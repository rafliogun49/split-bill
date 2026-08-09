import { describe, expect, it, vi } from 'vitest'
import type { Env } from '../index'
import app from '../index'

const env: Env = {
  OPENROUTER_API_KEY: 'test-openrouter-key',
  OPENROUTER_MODEL_DEFAULT: 'google/gemini-3.1-flash-lite',
  OPENROUTER_MODEL_ESCALATION: 'google/gemini-3.5-flash',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  TURNSTILE_SITE_KEY: 'test-turnstile-site-key',
  PARSE_RATE_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
}

describe('GET /api/config', () => {
  it('hands the non-secret Turnstile site key to the client', async () => {
    const res = await app.request('/api/config', {}, env)

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ turnstileSiteKey: 'test-turnstile-site-key' })
  })
})
