import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { ParsingScreen } from './ParsingScreen'

const { downscaleImage, fetchTurnstileSiteKey, requestParse, getTurnstileToken } = vi.hoisted(() => ({
  downscaleImage: vi.fn(async (file: Blob) => file),
  fetchTurnstileSiteKey: vi.fn(async () => 'a-site-key'),
  requestParse: vi.fn(),
  getTurnstileToken: vi.fn(async () => 'a-token'),
}))

vi.mock('../downscaleImage', () => ({ downscaleImage }))
vi.mock('../ai/turnstile', () => ({ getTurnstileToken }))
vi.mock('../ai/parseReceiptClient', () => ({ fetchTurnstileSiteKey, requestParse }))

const receipt = {
  currency: 'IDR',
  lineItems: [{ name: 'Nasi Goreng', quantity: 1, total: 25000 }],
  adjustments: [],
  reconciliation: { status: 'match' as const, computedTotal: 25000 },
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (err: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('ParsingScreen', () => {
  it('shows the Uploading step as active before the parse request goes out', async () => {
    const { promise, resolve } = deferred<{ ok: true; receipt: typeof receipt }>()
    requestParse.mockReturnValue(promise)

    const { getByText } = render(
      <ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={vi.fn()} onFailure={vi.fn()} onCancel={vi.fn()} />,
    )

    await waitFor(() => expect(getByText('Reading receipt').closest('li')).toHaveAttribute('aria-current', 'step'))
    expect(getByText('Uploading photo').closest('li')).not.toHaveAttribute('aria-current')
    resolve({ ok: true, receipt })
  })

  it('downscales before sending, and sends the Turnstile token requestParse expects', async () => {
    requestParse.mockResolvedValue({ ok: true, receipt })
    const onParsed = vi.fn()

    render(<ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={onParsed} onFailure={vi.fn()} onCancel={vi.fn()} />)

    await waitFor(() => expect(onParsed).toHaveBeenCalledWith(receipt))
    expect(downscaleImage).toHaveBeenCalledOnce()
    expect(requestParse).toHaveBeenCalledWith(expect.anything(), 'a-token', expect.any(AbortSignal))
  })

  it('calls onFailure with the reason a failed parse reports', async () => {
    requestParse.mockResolvedValue({ ok: false, reason: 'rate_limited' })
    const onFailure = vi.fn()

    render(<ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={vi.fn()} onFailure={onFailure} onCancel={vi.fn()} />)

    await waitFor(() => expect(onFailure).toHaveBeenCalledWith('rate_limited'))
  })

  it('treats an unexpected thrown error as parse_failed', async () => {
    getTurnstileToken.mockRejectedValueOnce(new Error('turnstile_unavailable'))
    const onFailure = vi.fn()

    render(<ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={vi.fn()} onFailure={onFailure} onCancel={vi.fn()} />)

    await waitFor(() => expect(onFailure).toHaveBeenCalledWith('parse_failed'))
  })

  it('cancelling aborts the in-flight request and calls onCancel without reporting a failure', async () => {
    const { promise } = deferred<{ ok: true; receipt: typeof receipt }>()
    requestParse.mockReturnValue(promise)
    const onCancel = vi.fn()
    const onFailure = vi.fn()
    const onParsed = vi.fn()

    const { getByRole } = render(
      <ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={onParsed} onFailure={onFailure} onCancel={onCancel} />,
    )
    await waitFor(() => expect(requestParse).toHaveBeenCalled())

    fireEvent.click(getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledOnce()
    const signal = requestParse.mock.calls[0][2] as AbortSignal
    expect(signal.aborted).toBe(true)
    expect(onFailure).not.toHaveBeenCalled()
    expect(onParsed).not.toHaveBeenCalled()
  })

  it('has no WCAG AAA violations', async () => {
    requestParse.mockReturnValue(new Promise(() => {}))
    const { container } = render(
      <ParsingScreen file={new File(['x'], 'r.jpg')} onParsed={vi.fn()} onFailure={vi.fn()} onCancel={vi.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
