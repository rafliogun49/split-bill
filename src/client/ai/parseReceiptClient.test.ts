import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTurnstileSiteKey, requestParse } from './parseReceiptClient'

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  vi.restoreAllMocks()
})

function stubOnline(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online)
}

describe('requestParse', () => {
  it('reports offline without touching the network when the browser already knows it is offline', async () => {
    stubOnline(false)
    const fetchMock = vi.fn()
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await requestParse(new Blob(), 'token', new AbortController().signal)

    expect(result).toEqual({ ok: false, reason: 'offline' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports offline when the fetch itself fails (DNS down, no connection)', async () => {
    stubOnline(true)
    global.fetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }) as unknown as typeof fetch

    const result = await requestParse(new Blob(), 'token', new AbortController().signal)

    expect(result).toEqual({ ok: false, reason: 'offline' })
  })

  it('re-throws an AbortError so a cancelled parse is distinguishable from a failed one', async () => {
    stubOnline(true)
    global.fetch = vi.fn(async () => {
      throw new DOMException('aborted', 'AbortError')
    }) as unknown as typeof fetch

    await expect(requestParse(new Blob(), 'token', new AbortController().signal)).rejects.toThrow('aborted')
  })

  it('reports rate_limited on a 429', async () => {
    stubOnline(true)
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 })) as unknown as typeof fetch

    const result = await requestParse(new Blob(), 'token', new AbortController().signal)

    expect(result).toEqual({ ok: false, reason: 'rate_limited' })
  })

  it('collapses every other non-2xx status to parse_failed', async () => {
    stubOnline(true)
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ error: 'parse_failed' }), { status: 502 })) as unknown as typeof fetch

    const result = await requestParse(new Blob(), 'token', new AbortController().signal)

    expect(result).toEqual({ ok: false, reason: 'parse_failed' })
  })

  it('returns the parsed receipt on success, posting the image and Turnstile token', async () => {
    stubOnline(true)
    const receipt = {
      currency: 'IDR',
      lineItems: [{ name: 'Nasi Goreng', quantity: 1, total: 25000 }],
      adjustments: [],
      reconciliation: { status: 'match', computedTotal: 25000 },
    }
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(receipt), { status: 200 }),
    )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await requestParse(new Blob(['x']), 'a-token', new AbortController().signal)

    expect(result).toEqual({ ok: true, receipt })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/parse')
    expect(init?.method).toBe('POST')
    const body = init?.body as FormData
    expect(body.get('turnstileToken')).toBe('a-token')
    expect(body.get('image')).toBeInstanceOf(Blob)
  })
})

describe('fetchTurnstileSiteKey', () => {
  it('reads the site key from GET /api/config', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ turnstileSiteKey: 'a-site-key' }), { status: 200 })) as unknown as typeof fetch

    await expect(fetchTurnstileSiteKey()).resolves.toBe('a-site-key')
  })

  it('throws when the config endpoint fails', async () => {
    global.fetch = vi.fn(async () => new Response('', { status: 500 })) as unknown as typeof fetch

    await expect(fetchTurnstileSiteKey()).rejects.toThrow()
  })
})
