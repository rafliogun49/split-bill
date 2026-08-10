import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../test/setup'
import type { Bill } from '../domain'
import { App } from './App'

const { downscaleImage, fetchTurnstileSiteKey, requestParse, getTurnstileToken } = vi.hoisted(() => ({
  downscaleImage: vi.fn(async (file: Blob) => file),
  fetchTurnstileSiteKey: vi.fn(async () => 'a-site-key'),
  requestParse: vi.fn(),
  getTurnstileToken: vi.fn(async () => 'a-token'),
}))

vi.mock('./downscaleImage', () => ({ downscaleImage }))
vi.mock('./ai/turnstile', () => ({ getTurnstileToken }))
vi.mock('./ai/parseReceiptClient', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./ai/parseReceiptClient')>()),
  fetchTurnstileSiteKey,
  requestParse,
}))

const bill: Bill = {
  currency: { code: 'IDR' },
  diners: [],
  lineItems: [],
  adjustments: [],
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the wordmark', () => {
    const { getAllByText } = render(<App />)
    expect(getAllByText('Split Bill').length).toBeGreaterThan(0)
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('opens on the Start screen with no Resume offered when nothing is persisted', () => {
    const { queryByRole, getByRole } = render(<App />)
    expect(queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument()
  })

  it('offers Resume when a Bill was persisted from a previous session', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole } = render(<App />)
    expect(getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('discards the persisted Bill once New Bill is confirmed', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole, queryByRole } = render(<App />)

    fireEvent.click(getByRole('button', { name: 'New Bill' }))
    fireEvent.click(getByRole('button', { name: 'Discard and start new' }))

    expect(queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(localStorage.getItem('split-bill:bill')).toBeNull()
  })

  it('returning to Start via Exit keeps the Resume offer intact', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole } = render(<App />)

    fireEvent.click(getByRole('button', { name: 'Resume' }))
    fireEvent.click(getByRole('button', { name: 'Exit' }))

    expect(getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('opens the Bill editor on an empty Bill when entering manually', () => {
    const { getByRole } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Enter manually' }))
    expect(getByRole('button', { name: /add line item/i })).toBeInTheDocument()
  })

  it('resumes directly into the Bill editor with the persisted Line Items', () => {
    localStorage.setItem(
      'split-bill:bill',
      JSON.stringify({
        version: 1,
        bill: { ...bill, lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }] },
      }),
    )
    const { getByRole, getByDisplayValue } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Resume' }))
    expect(getByDisplayValue('Nasi Goreng')).toBeInTheDocument()
  })

  it('a Bill typed by hand survives a reload, with the same total', () => {
    const { getByRole, getByLabelText, unmount } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Enter manually' }))
    fireEvent.click(getByRole('button', { name: /add line item/i }))
    fireEvent.change(getByLabelText('Line item name'), { target: { value: 'Nasi Goreng' } })
    const lineTotal = getByLabelText(/line total/i)
    fireEvent.focus(lineTotal)
    fireEvent.change(lineTotal, { target: { value: '90000' } })
    fireEvent.blur(lineTotal)
    unmount()

    const reloaded = render(<App />)
    fireEvent.click(reloaded.getByRole('button', { name: 'Resume' }))
    expect(reloaded.getByDisplayValue('Nasi Goreng')).toBeInTheDocument()
    expect(reloaded.getAllByText('Rp 90.000').length).toBeGreaterThan(0)
  })

  describe('the Capture -> Parsing -> Bill editor path (issue #11)', () => {
    const receipt = {
      currency: 'idr',
      placeName: 'Waroeng SS',
      lineItems: [{ name: 'Nasi Goreng', quantity: 1, total: 25000 }],
      adjustments: [],
      reconciliation: { status: 'mismatch' as const, computedTotal: 25000, printedTotal: 27000, difference: -2000 },
    }

    function photograph(app: ReturnType<typeof render>) {
      fireEvent.click(app.getByRole('button', { name: 'Scan receipt' }))
      const input = app.container.querySelector('input[name="library-photo"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })] } })
    }

    it('goes to the Capture screen from Scan, not straight to the editor', () => {
      const app = render(<App />)
      fireEvent.click(app.getByRole('button', { name: 'Scan receipt' }))
      expect(app.getByRole('heading', { name: 'Scan receipt' })).toBeInTheDocument()
      expect(app.getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()
    })

    it('a successful parse pre-fills the editor and shows the reconciliation banner', async () => {
      requestParse.mockResolvedValue({ ok: true, receipt })
      const app = render(<App />)

      photograph(app)
      expect(app.getByText('Reading your receipt')).toBeInTheDocument()

      await waitFor(() => expect(app.getByDisplayValue('Nasi Goreng')).toBeInTheDocument())
      expect(app.getByRole('alert')).toHaveTextContent("Doesn't match the receipt")
      expect(app.getByLabelText('Place')).toHaveValue('Waroeng SS')
    })

    it('a failed parse lands on the shared Failure screen, and its primary action reaches the empty editor', async () => {
      requestParse.mockResolvedValue({ ok: false, reason: 'parse_failed' })
      const app = render(<App />)

      photograph(app)
      await waitFor(() => expect(app.getByRole('alert')).toBeInTheDocument())
      expect(app.getByText(/couldn't read that receipt/i)).toBeInTheDocument()

      fireEvent.click(app.getByRole('button', { name: 'Enter Bill by hand' }))
      expect(app.getByRole('button', { name: /add line item/i })).toBeInTheDocument()
      expect(app.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('cancelling the parse returns to Capture without ever reaching the editor', async () => {
      requestParse.mockReturnValue(new Promise(() => {}))
      const app = render(<App />)

      photograph(app)
      await waitFor(() => expect(requestParse).toHaveBeenCalled())
      fireEvent.click(app.getByRole('button', { name: 'Cancel' }))

      expect(app.getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()
    })
  })
})
