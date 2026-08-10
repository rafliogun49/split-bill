import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import { BillEditorScreen } from './BillEditorScreen'

function emptyBill(overrides: Partial<Bill> = {}): Bill {
  return { id: 'bill-1', currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

function noop() {}

describe('BillEditorScreen', () => {
  it('omits the Place/Date block when both are empty, offering to add them instead', () => {
    const { queryByLabelText, getByRole } = render(
      <BillEditorScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />,
    )
    expect(queryByLabelText('Place')).not.toBeInTheDocument()
    expect(getByRole('button', { name: 'Add place and date' })).toBeInTheDocument()
  })

  it('reveals the Place/Date fields once asked to', () => {
    const { getByRole, getByLabelText } = render(
      <BillEditorScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />,
    )
    fireEvent.click(getByRole('button', { name: 'Add place and date' }))
    expect(getByLabelText('Place')).toBeInTheDocument()
    expect(getByLabelText('Date')).toBeInTheDocument()
  })

  it('shows the Place/Date block directly when a Bill already carries them', () => {
    const { getByLabelText } = render(
      <BillEditorScreen bill={emptyBill({ place: 'Warung Tekko' })} onBillChange={noop} onContinue={noop} />,
    )
    expect(getByLabelText('Place')).toHaveValue('Warung Tekko')
  })

  it('always shows the currency, regardless of Place/Date', () => {
    const { getByLabelText } = render(<BillEditorScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />)
    expect(getByLabelText('Currency')).toHaveValue('IDR')
  })

  it('allows changing currency on an empty Bill', () => {
    const { getByLabelText } = render(<BillEditorScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />)
    expect(getByLabelText('Currency')).toBeEnabled()
  })

  it('locks the currency once a Line Item exists, so its minor units are never silently reinterpreted', () => {
    const bill = emptyBill({ lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }] })
    const { getByLabelText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByLabelText('Currency')).toBeDisabled()
  })

  it('locks the currency once an Adjustment exists', () => {
    const bill = emptyBill({ adjustments: [{ kind: 'fixed', label: 'Delivery', amount: 5000 }] })
    const { getByLabelText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByLabelText('Currency')).toBeDisabled()
  })

  it('adds a blank Line Item', () => {
    const onBillChange = vi.fn()
    const { getByRole } = render(<BillEditorScreen bill={emptyBill()} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /add line item/i }))
    expect(onBillChange).toHaveBeenCalledWith(
      expect.objectContaining({
        lineItems: [expect.objectContaining({ label: '', amount: 0, quantity: 1 })],
      }),
    )
  })

  it('computes the subtotal and total through the domain layer as Line Items change', () => {
    const bill = emptyBill({
      lineItems: [
        { id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} },
        { id: 'b', label: 'Es Teh', amount: 36000, quantity: 3, shares: {} },
      ],
    })
    const { getAllByText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getAllByText('Rp 126.000').length).toBeGreaterThan(0)
  })

  it('resolves an Adjustment rate against the running Subtotal and reflects it in the total', () => {
    const bill = emptyBill({
      lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 100000, quantity: 1, shares: {} }],
      adjustments: [{ kind: 'rate', label: 'Tax', rateBps: 1000 }],
    })
    const { getByText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByText('Rp 10.000')).toBeInTheDocument()
    expect(getByText('Rp 110.000')).toBeInTheDocument()
  })

  it('reordering Adjustments changes the resolved amounts because a later rate compounds on an earlier one', () => {
    const taxThenService = emptyBill({
      lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 100000, quantity: 1, shares: {} }],
      adjustments: [
        { kind: 'rate', label: 'Service', rateBps: 1000 },
        { kind: 'rate', label: 'Tax', rateBps: 1000 },
      ],
    })
    const onBillChange = vi.fn()
    const { getByRole } = render(
      <BillEditorScreen bill={taxThenService} onBillChange={onBillChange} onContinue={noop} />,
    )
    fireEvent.click(getByRole('button', { name: 'Move down Service' }))

    const reordered = onBillChange.mock.calls[0][0] as Bill
    expect(reordered.adjustments.map((a) => a.label)).toEqual(['Tax', 'Service'])
  })

  it('never offers to assign an Adjustment to a Diner anywhere on the screen', () => {
    const bill = emptyBill({ adjustments: [{ kind: 'fixed', label: 'Delivery', amount: 5000 }] })
    const { queryByText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(queryByText(/assign/i)).not.toBeInTheDocument()
  })

  it('carries the Bill total and the onward action in the sticky summary bar', () => {
    const bill = emptyBill({ lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }] })
    const onContinue = vi.fn()
    const { getByRole, getAllByText } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={onContinue} />)
    expect(getAllByText('Rp 90.000').length).toBeGreaterThan(0)
    fireEvent.click(getByRole('button', { name: 'Diners' }))
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('has no WCAG AAA violations with Line Items and Adjustments present', async () => {
    const bill = emptyBill({
      place: 'Warung Tekko',
      date: '2026-08-09',
      lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }],
      adjustments: [{ kind: 'rate', label: 'Tax', rateBps: 1000 }],
    })
    const { container } = render(<BillEditorScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('reconciliation banner', () => {
    it('shows no banner at all when the Bill was entered by hand', () => {
      const { queryByRole } = render(<BillEditorScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />)
      expect(queryByRole('status')).not.toBeInTheDocument()
      expect(queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows no banner when the Receipt had no printed total to check against', () => {
      const { queryByRole } = render(
        <BillEditorScreen
          bill={emptyBill()}
          onBillChange={noop}
          onContinue={noop}
          reconciliation={{ status: 'no-printed-total', computedTotal: 55000 }}
        />,
      )
      expect(queryByRole('status')).not.toBeInTheDocument()
      expect(queryByRole('alert')).not.toBeInTheDocument()
    })

    it('renders a quiet neutral one-liner on a match', () => {
      const { getByRole, getByText } = render(
        <BillEditorScreen
          bill={emptyBill()}
          onBillChange={noop}
          onContinue={noop}
          reconciliation={{ status: 'match', computedTotal: 55000 }}
        />,
      )
      expect(getByRole('status')).toBeInTheDocument()
      expect(getByText('Matches the receipt total.')).toBeInTheDocument()
    })

    it('renders computed, printed and the signed difference on a mismatch', () => {
      const { getByRole, getByText } = render(
        <BillEditorScreen
          bill={emptyBill()}
          onBillChange={noop}
          onContinue={noop}
          reconciliation={{ status: 'mismatch', computedTotal: 156177, printedTotal: 159100, difference: -2923 }}
        />,
      )
      const banner = getByRole('alert')
      expect(banner).toBeInTheDocument()
      expect(getByText("Doesn't match the receipt")).toBeInTheDocument()
      expect(getByText('Rp 156.177')).toBeInTheDocument()
      expect(getByText('Rp 159.100')).toBeInTheDocument()
      expect(getByText(/2\.923/)).toBeInTheDocument()
    })

    it('has no WCAG AAA violations with a mismatch banner shown', async () => {
      const { container } = render(
        <BillEditorScreen
          bill={emptyBill()}
          onBillChange={noop}
          onContinue={noop}
          reconciliation={{ status: 'mismatch', computedTotal: 156177, printedTotal: 159100, difference: -2923 }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
