import { describe, expect, it } from 'vitest'
import { copy } from '../client/copy'
import app from './index'
import type { Env } from './index'

// A stub of the Workers Assets binding good enough to exercise the `/`
// handler's wiring in `index.ts` without a real Wrangler/Miniflare asset
// server — `landingDocument.test.ts` covers the actual content generation
// and splicing logic in isolation.
const shellHtml =
  '<!doctype html><html><head><title>Split Bill</title></head><body><div id="root"></div><script type="module" src="/assets/main-abc123.js"></script></body></html>'

function stubEnv(overrides?: Partial<Env>): Env {
  return {
    OPENROUTER_API_KEY: '',
    OPENROUTER_MODEL_DEFAULT: '',
    OPENROUTER_MODEL_ESCALATION: '',
    TURNSTILE_SECRET_KEY: '',
    TURNSTILE_SITE_KEY: '',
    PARSE_RATE_LIMITER: {} as Env['PARSE_RATE_LIMITER'],
    ASSETS: {
      fetch: async () => new Response(shellHtml, { headers: { 'content-type': 'text/html' } }),
    } as unknown as Fetcher,
    ...overrides,
  }
}

describe('server', () => {
  it('responds to the stub health route', async () => {
    const res = await app.request('/api/health')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ status: 'ok' })
  })

  it('serves a distinct prerendered document at the landing route', async () => {
    const res = await app.request('/', {}, stubEnv())

    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).not.toContain('<div id="root"></div>')
    expect(html).toContain(copy.start.tagline)
    // The shell's own boot script must survive the splice untouched.
    expect(html).toContain('<script type="module" src="/assets/main-abc123.js"></script>')
  })

  it('passes through a non-ok Assets response instead of splicing into it', async () => {
    const res = await app.request(
      '/',
      {},
      stubEnv({ ASSETS: { fetch: async () => new Response('not found', { status: 404 }) } as unknown as Fetcher }),
    )

    expect(res.status).toBe(404)
  })
})
