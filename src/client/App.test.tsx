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

function photograph(app: ReturnType<typeof render>) {
  fireEvent.click(app.getByRole('button', { name: 'Scan receipt' }))
  const input = app.container.querySelector('input[name="library-photo"]') as HTMLInputElement
  fireEvent.change(input, { target: { files: [new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })] } })
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    // App owns a BrowserRouter (issue #22), which reads real window.location
    // — reset it so each test starts fresh on Start regardless of where a
    // previous test's navigation left the URL.
    window.history.replaceState(null, '', '/')
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

    // A real reload keeps the browser on whatever URL it was already on
    // (unlike `unmount` resetting to Start) — remounting at the same /bill
    // URL with the Bill still in localStorage lands straight back on the
    // Bill editor, no Resume click required (issue #22 acceptance: refreshing
    // Bill editor onward stays on that same screen).
    const reloaded = render(<App />)
    expect(reloaded.queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
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

  describe('client-side routing (issue #22)', () => {
    const filledBill: Bill = {
      ...bill,
      lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }],
    }

    it('visiting the Bill editor URL with no active Bill in local storage redirects to Start', () => {
      window.history.replaceState(null, '', '/bill')
      const { getByRole } = render(<App />)
      expect(getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument()
    })

    it('visiting the Assignment URL with no active Bill in local storage redirects to Start', () => {
      window.history.replaceState(null, '', '/assignment')
      const { getByRole } = render(<App />)
      expect(getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument()
    })

    it('visiting the Summary URL with no active Bill in local storage redirects to Start', () => {
      window.history.replaceState(null, '', '/summary')
      const { getByRole } = render(<App />)
      expect(getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument()
    })

    it('refreshing Diner setup with an active Bill in local storage stays on Diner setup', () => {
      localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill: filledBill }))
      window.history.replaceState(null, '', '/diners')
      const { getByText, queryByRole } = render(<App />)
      expect(queryByRole('button', { name: 'Scan receipt' })).not.toBeInTheDocument()
      expect(getByText('No Diners yet. Add the first one above.')).toBeInTheDocument()
    })

    it('refreshing Assignment with an active Bill in local storage stays on Assignment', () => {
      localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill: filledBill }))
      window.history.replaceState(null, '', '/assignment')
      const { getByText, queryByRole } = render(<App />)
      expect(queryByRole('button', { name: 'Scan receipt' })).not.toBeInTheDocument()
      expect(getByText('Nasi Goreng')).toBeInTheDocument()
    })

    it('refreshing Summary with an active Bill in local storage stays on Summary', () => {
      localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill: filledBill }))
      window.history.replaceState(null, '', '/summary')
      const { getByRole } = render(<App />)
      expect(getByRole('button', { name: 'Share summary' })).toBeInTheDocument()
    })

    it('refreshing Parsing (an in-flight request that cannot survive reload) lands on Capture, never a stuck Parsing screen', () => {
      window.history.replaceState(null, '', '/parsing')
      const { getByRole, queryByText } = render(<App />)
      expect(getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()
      expect(queryByText('Reading your receipt')).not.toBeInTheDocument()
    })

    it('refreshing the parse-failure screen (an in-memory reason that cannot survive reload) lands on Capture', () => {
      window.history.replaceState(null, '', '/parse-failure')
      const { getByRole } = render(<App />)
      expect(getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()
    })

    it('browser back from Capture returns to Start, in the order actually visited', async () => {
      const { getByRole } = render(<App />)
      fireEvent.click(getByRole('button', { name: 'Scan receipt' }))
      expect(getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()

      window.history.back()
      await waitFor(() => expect(getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument())
    })

    it('browser back from Diner setup returns to the Bill editor', async () => {
      const { getByRole, getByText } = render(<App />)
      fireEvent.click(getByRole('button', { name: 'Enter manually' }))
      fireEvent.click(getByRole('button', { name: 'Diners' }))
      expect(getByText('No Diners yet. Add the first one above.')).toBeInTheDocument()

      window.history.back()
      await waitFor(() => expect(getByRole('button', { name: /add line item/i })).toBeInTheDocument())
    })

    it('a successful parse leaves no stale Parsing screen for browser back to land on', async () => {
      requestParse.mockResolvedValue({
        ok: true,
        receipt: {
          currency: 'idr',
          placeName: 'Waroeng SS',
          lineItems: [{ name: 'Nasi Goreng', quantity: 1, total: 25000 }],
          adjustments: [],
          reconciliation: { status: 'match' as const, computedTotal: 25000, printedTotal: 25000, difference: 0 },
        },
      })
      const app = render(<App />)

      fireEvent.click(app.getByRole('button', { name: 'Scan receipt' }))
      const input = app.container.querySelector('input[name="library-photo"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })] } })
      await waitFor(() => expect(app.getByDisplayValue('Nasi Goreng')).toBeInTheDocument())

      // Capture and Parsing were both replaced away (ADR-0009) — back from
      // the Bill editor goes straight to Start, not to a resurrected Parsing
      // screen with no request left to resume. Start now offers Resume
      // rather than the landing content, since parsing left a Bill behind.
      window.history.back()
      await waitFor(() => expect(app.getByRole('button', { name: 'Resume' })).toBeInTheDocument())
      expect(app.queryByText('Reading your receipt')).not.toBeInTheDocument()
    })

    it('reaching the Bill editor via "Enter Bill by hand" after a parse failure leaves no stale Failure screen for browser back to land on', async () => {
      requestParse.mockResolvedValue({ ok: false, reason: 'parse_failed' })
      const app = render(<App />)

      photograph(app)
      await waitFor(() => expect(app.getByRole('alert')).toBeInTheDocument())
      fireEvent.click(app.getByRole('button', { name: 'Enter Bill by hand' }))
      expect(app.getByRole('button', { name: /add line item/i })).toBeInTheDocument()

      // ParseFailure was replaced away same as Parsing — back goes to Start,
      // never back to the already-resolved failure banner. Start offers
      // Resume rather than the landing content, since entering by hand left
      // a (blank) Bill behind.
      window.history.back()
      await waitFor(() => expect(app.getByRole('button', { name: 'Resume' })).toBeInTheDocument())
      expect(app.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('retrying after a parse failure leaves no stale Failure screen for browser back to land on', async () => {
      requestParse.mockResolvedValue({ ok: false, reason: 'parse_failed' })
      const app = render(<App />)

      photograph(app)
      await waitFor(() => expect(app.getByRole('alert')).toBeInTheDocument())
      fireEvent.click(app.getByRole('button', { name: 'Try again' }))
      expect(app.getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()

      window.history.back()
      await waitFor(() => expect(app.getByRole('button', { name: 'Scan receipt' })).toBeInTheDocument())
      expect(app.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
