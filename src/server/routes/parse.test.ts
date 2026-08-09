// @vitest-environment node
//
// jsdom's File/FormData aren't the undici-branded ones Hono's Request parsing
// expects, so multipart bodies fail to parse under the project's default
// jsdom environment. This is a server-only suite — run it in node instead.
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Env } from '../index'
import app from '../index'

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  vi.restoreAllMocks()
})

function createEnv(overrides: Partial<Env> = {}): Env {
  return {
    OPENROUTER_API_KEY: 'test-openrouter-key',
    OPENROUTER_MODEL_DEFAULT: 'google/gemini-3.1-flash-lite',
    OPENROUTER_MODEL_ESCALATION: 'google/gemini-3.5-flash',
    TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
    TURNSTILE_SITE_KEY: 'test-turnstile-site-key',
    PARSE_RATE_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
    ...overrides,
  }
}

function buildForm({
  withToken = true,
  withImage = true,
  sizeBytes = 1024,
  type = 'image/jpeg',
}: { withToken?: boolean; withImage?: boolean; sizeBytes?: number; type?: string } = {}) {
  const form = new FormData()
  if (withToken) {
    form.set('turnstileToken', 'a-turnstile-token')
  }
  if (withImage) {
    form.set('image', new File([new Uint8Array(sizeBytes)], 'receipt.jpg', { type }))
  }
  return form
}

interface OpenRouterStubResponse {
  status?: number
  content?: string
  networkError?: boolean
}

function stubNetwork({
  turnstileSuccess = true,
  openRouterResponses,
}: {
  turnstileSuccess?: boolean
  openRouterResponses: OpenRouterStubResponse[]
}) {
  let openRouterCallCount = 0
  const openRouterRequestBodies: string[] = []

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

    if (url.includes('challenges.cloudflare.com')) {
      return new Response(JSON.stringify({ success: turnstileSuccess }), { status: 200 })
    }

    if (url.includes('openrouter.ai')) {
      const response = openRouterResponses[openRouterCallCount] ?? openRouterResponses[openRouterResponses.length - 1]
      openRouterRequestBodies.push(init?.body as string)
      openRouterCallCount += 1

      if (response.networkError) {
        throw new TypeError('network error')
      }

      if (response.status && response.status >= 400) {
        return new Response('upstream error', { status: response.status })
      }

      return new Response(JSON.stringify({ choices: [{ message: { content: response.content } }] }), { status: 200 })
    }

    throw new Error(`Unexpected fetch to ${url}`)
  })

  global.fetch = fetchMock as unknown as typeof fetch

  return {
    fetchMock,
    openRouterRequestBodies,
    get openRouterCallCount() {
      return openRouterCallCount
    },
  }
}

const wellFormedBill = {
  currency: 'SGD',
  placeName: 'Kopi House',
  lineItems: [{ name: 'Latte', quantity: 1, total: 500 }],
  adjustments: [{ label: 'Service charge', amount: 50 }],
  printedTotal: 550,
}

describe('POST /api/parse', () => {
  it('rejects a missing turnstile token without calling OpenRouter', async () => {
    const network = stubNetwork({ openRouterResponses: [] })

    const res = await app.request(
      '/api/parse',
      { method: 'POST', body: buildForm({ withToken: false }) },
      createEnv(),
    )

    expect(res.status).toBe(403)
    expect(network.fetchMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid turnstile token', async () => {
    stubNetwork({ turnstileSuccess: false, openRouterResponses: [] })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(403)
  })

  it('returns 429 when the rate limiter denies the request', async () => {
    stubNetwork({ openRouterResponses: [] })
    const env = createEnv({ PARSE_RATE_LIMITER: { limit: vi.fn(async () => ({ success: false })) } })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, env)

    expect(res.status).toBe(429)
  })

  it('rejects a missing image', async () => {
    stubNetwork({ openRouterResponses: [] })

    const res = await app.request(
      '/api/parse',
      { method: 'POST', body: buildForm({ withImage: false }) },
      createEnv(),
    )

    expect(res.status).toBe(400)
  })

  it('rejects a non-image payload', async () => {
    stubNetwork({ openRouterResponses: [] })

    const res = await app.request(
      '/api/parse',
      { method: 'POST', body: buildForm({ type: 'application/pdf' }) },
      createEnv(),
    )

    expect(res.status).toBe(400)
  })

  it('rejects an oversized image before any model call', async () => {
    const network = stubNetwork({ openRouterResponses: [] })

    const res = await app.request(
      '/api/parse',
      { method: 'POST', body: buildForm({ sizeBytes: 9 * 1024 * 1024 }) },
      createEnv(),
    )

    expect(res.status).toBe(400)
    expect(network.fetchMock.mock.calls.some(([url]) => String(url).includes('openrouter.ai'))).toBe(false)
  })

  it('maps a well-formed model response to the Bill-shaped payload and does not escalate on a match', async () => {
    const network = stubNetwork({
      openRouterResponses: [{ content: JSON.stringify(wellFormedBill) }],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ...wellFormedBill,
      reconciliation: { status: 'match', computedTotal: 550 },
    })
    expect(network.openRouterCallCount).toBe(1)
  })

  it('reports no-printed-total when the receipt had no grand total', async () => {
    const { printedTotal: _printedTotal, ...billWithoutPrintedTotal } = wellFormedBill
    stubNetwork({
      openRouterResponses: [{ content: JSON.stringify(billWithoutPrintedTotal) }],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(200)
    const body = (await res.json()) as { reconciliation: unknown }
    expect(body.reconciliation).toEqual({ status: 'no-printed-total', computedTotal: 550 })
  })

  it('rejects a malformed model response without escalating', async () => {
    const network = stubNetwork({
      openRouterResponses: [{ content: JSON.stringify({ currency: 'SGD' /* missing lineItems/adjustments */ }) }],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(502)
    expect(network.openRouterCallCount).toBe(1)
  })

  it('rejects a non-JSON model response', async () => {
    stubNetwork({ openRouterResponses: [{ content: 'not json at all' }] })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(502)
  })

  it('returns 502 when the OpenRouter call itself fails', async () => {
    stubNetwork({ openRouterResponses: [{ status: 500 }] })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(502)
  })

  it('returns 502 when the OpenRouter request throws (network error / timeout)', async () => {
    stubNetwork({ openRouterResponses: [{ networkError: true }] })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(502)
  })

  it('escalates to the stronger model exactly once when the parsed rows mismatch the printed total', async () => {
    const mismatched = { ...wellFormedBill, printedTotal: 999 }
    const env = createEnv()
    const network = stubNetwork({
      openRouterResponses: [
        { content: JSON.stringify(mismatched) },
        { content: JSON.stringify(wellFormedBill) },
      ],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, env)

    expect(res.status).toBe(200)
    expect(network.openRouterCallCount).toBe(2)

    const firstRequestModel = JSON.parse(network.openRouterRequestBodies[0]).model
    const secondRequestModel = JSON.parse(network.openRouterRequestBodies[1]).model
    expect(firstRequestModel).toBe(env.OPENROUTER_MODEL_DEFAULT)
    expect(secondRequestModel).toBe(env.OPENROUTER_MODEL_ESCALATION)

    await expect(res.json()).resolves.toEqual({
      ...wellFormedBill,
      reconciliation: { status: 'match', computedTotal: 550 },
    })
  })

  it('returns the escalated mismatch when the stronger model still disagrees with the printed total', async () => {
    const mismatched = { ...wellFormedBill, printedTotal: 999 }
    const network = stubNetwork({
      openRouterResponses: [{ content: JSON.stringify(mismatched) }, { content: JSON.stringify(mismatched) }],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(200)
    expect(network.openRouterCallCount).toBe(2)
    const body = (await res.json()) as { reconciliation: unknown }
    expect(body.reconciliation).toEqual({
      status: 'mismatch',
      computedTotal: 550,
      printedTotal: 999,
      difference: -449,
    })
  })

  it('falls back to the first (mismatched) parse when the escalation call itself fails', async () => {
    const mismatched = { ...wellFormedBill, printedTotal: 999 }
    const network = stubNetwork({
      openRouterResponses: [{ content: JSON.stringify(mismatched) }, { networkError: true }],
    })

    const res = await app.request('/api/parse', { method: 'POST', body: buildForm() }, createEnv())

    expect(res.status).toBe(200)
    expect(network.openRouterCallCount).toBe(2)
    await expect(res.json()).resolves.toEqual({
      ...mismatched,
      reconciliation: { status: 'mismatch', computedTotal: 550, printedTotal: 999, difference: -449 },
    })
  })
})
