import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import { SummaryScreen } from './SummaryScreen'

vi.mock('../share/captureShareImage', () => ({
  captureShareImage: vi.fn(async () => 'data:image/png;base64,stub'),
}))

function bill(overrides: Partial<Bill> = {}): Bill {
  return { currency: { code: 'SGD' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

const originalFetch = global.fetch

afterEach(() => {
  vi.unstubAllGlobals()
  global.fetch = originalFetch
})

describe('SummaryScreen', () => {
  it('renders the ShareCard with what the Payer is owed', () => {
    const b = bill({
      payerId: 'a',
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 4000, quantity: 1, shares: { a: 1, b: 1 } }],
    })
    const { getByText } = render(<SummaryScreen bill={b} />)
    expect(getByText('Alice is owed')).toBeInTheDocument()
  })

  it('shares the plain-text summary through the Web Share API when available', async () => {
    const share = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /share summary/i }))

    await waitFor(() => expect(share).toHaveBeenCalledWith({ text: expect.stringContaining('Alice') }))
  })

  it('falls back to a clipboard copy when the Web Share API is unavailable', async () => {
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: { writeText } })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole, findByText } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /share summary/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Alice')))
    expect(await findByText('Summary copied to clipboard')).toBeInTheDocument()
  })

  it('falls back to the clipboard when the share sheet rejects with a real error, not a user cancellation', async () => {
    const share = vi.fn(async () => {
      throw new DOMException('Permission denied', 'NotAllowedError')
    })
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share, clipboard: { writeText } })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole, findByText } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /share summary/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Alice')))
    expect(await findByText('Summary copied to clipboard')).toBeInTheDocument()
  })

  it('reports nothing, and does not fall back, when the user simply cancels the share sheet', async () => {
    const share = vi.fn(async () => {
      throw new DOMException('Abort', 'AbortError')
    })
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share, clipboard: { writeText } })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /share summary/i }))

    await waitFor(() => expect(share).toHaveBeenCalled())
    expect(writeText).not.toHaveBeenCalled()
  })

  it('renders a PNG from the same node as the on-screen ShareCard when sharing the image', async () => {
    global.fetch = vi.fn(async () => new Response(new Blob(['stub'], { type: 'image/png' }))) as unknown as typeof fetch
    const canShare = vi.fn(() => true)
    const share = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share, canShare })

    const b = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /share image/i }))

    await waitFor(() => expect(share).toHaveBeenCalledWith(expect.objectContaining({ files: expect.any(Array) })))
  })

  it('has no WCAG AAA violations', async () => {
    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { container } = render(<SummaryScreen bill={b} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
