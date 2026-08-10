import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import { SummaryScreen } from './SummaryScreen'
import { SHARE_CARD_WIDTH } from '../components/ShareCard'

vi.mock('../share/captureShareImage', () => ({
  captureShareImage: vi.fn(async () => 'data:image/png;base64,stub'),
}))

function bill(overrides: Partial<Bill> = {}): Bill {
  return { id: 'bill-1', currency: { code: 'SGD' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

const originalFetch = global.fetch

beforeEach(() => {
  global.fetch = vi.fn(async () => new Response(new Blob(['stub'], { type: 'image/png' }))) as unknown as typeof fetch
  // jsdom doesn't implement the Blob URL registry — stub it so the
  // anchor-download path is exercised without hitting "not implemented".
  URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  URL.revokeObjectURL = vi.fn()
})

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

  it('renders the ShareCard on its own root element, sized to its content, not an unsized wrapper', () => {
    const b = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByText } = render(<SummaryScreen bill={b} />)
    // The ShareCard root is the element that carries its own explicit width —
    // find it by walking up from known ShareCard content to the element that
    // sets that width inline, and confirm nothing wider (an unsized wrapper)
    // sits directly above it before the scroll container.
    const cardRoot = getByText('Alice').closest('[style*="width"]') as HTMLElement
    expect(cardRoot).not.toBeNull()
    expect(cardRoot.style.width).toBe(`${SHARE_CARD_WIDTH}px`)
    expect(cardRoot.parentElement?.className).toContain('overflow-x-auto')
  })

  it('never calls navigator.share, even when the platform provides it', async () => {
    const share = vi.fn(async () => {})
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share, clipboard: { writeText } })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole } = render(<SummaryScreen bill={b} />)

    fireEvent.click(getByRole('button', { name: /copy text/i }))
    await waitFor(() => expect(writeText).toHaveBeenCalled())

    fireEvent.click(getByRole('button', { name: /download image/i }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    expect(share).not.toHaveBeenCalled()
  })

  it('always copies the plain-text summary to the clipboard when Copy text is clicked', async () => {
    const writeText = vi.fn(async () => {})
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: { writeText } })

    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole, findByText } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /copy text/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Alice')))
    expect(await findByText('Summary copied to clipboard')).toBeInTheDocument()
  })

  it('always saves the share image directly via the download anchor when Download image is clicked', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    const b = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByRole, findByText } = render(<SummaryScreen bill={b} />)
    fireEvent.click(getByRole('button', { name: /download image/i }))

    await waitFor(() => expect(clickSpy).toHaveBeenCalled())
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(await findByText('Image downloaded')).toBeInTheDocument()

    clickSpy.mockRestore()
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
