import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill, Diner, LineItem } from '../../domain'
import { AssignmentScreen } from './AssignmentScreen'

function emptyBill(overrides: Partial<Bill> = {}): Bill {
  return { id: 'bill-1', currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

function diner(id: string, name: string, joinIndex: number): Diner {
  return { id, name, joinIndex }
}

function lineItem(id: string, label: string, amount: number, overrides: Partial<LineItem> = {}): LineItem {
  return { id, label, amount, quantity: 1, shares: {}, ...overrides }
}

function noop() {}

describe('AssignmentScreen', () => {
  it('renders Line Items in Receipt order', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000), lineItem('2', 'Salad', 12000)],
    })
    const { getAllByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    const rowButtons = getAllByRole('button', { name: /^Assign /i })
    expect(rowButtons[0]).toHaveAccessibleName(/pizza/i)
    expect(rowButtons[1]).toHaveAccessibleName(/salad/i)
  })

  it('opens the AssignmentPicker with a Stepper for every Diner when a row is tapped', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0), diner('b', 'Bob', 1)],
      lineItems: [lineItem('1', 'Pizza', 18000)],
    })
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /assign pizza/i }))
    expect(getByRole('dialog')).toBeInTheDocument()
    expect(getByRole('group', { name: 'Alice' })).toBeInTheDocument()
    expect(getByRole('group', { name: 'Bob' })).toBeInTheDocument()
  })

  it('commits a Stepper change from the picker straight to the Bill', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000)],
    })
    const onBillChange = vi.fn()
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /assign pizza/i }))
    fireEvent.click(getByRole('button', { name: /increase shares.*alice/i }))
    const next = onBillChange.mock.calls[0][0] as Bill
    expect(next.lineItems[0]!.shares).toEqual({ a: 1 })
  })

  it('shows an alert Banner naming unclaimed Line Items and their value whenever any exist', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000), lineItem('2', 'Salad', 12000, { shares: { a: 1 } })],
    })
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    const banner = getByRole('alert')
    expect(banner).toHaveTextContent('Pizza')
    expect(banner).not.toHaveTextContent('Salad')
    expect(banner).toHaveTextContent('Rp 18.000')
  })

  it('does not show the Incomplete Split Banner once every Line Item is claimed', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000, { shares: { a: 1 } })],
    })
    const { queryByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('divides every unclaimed Line Item between every Diner in one tap', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0), diner('b', 'Bob', 1)],
      lineItems: [lineItem('1', 'Pizza', 18000), lineItem('2', 'Salad', 12000, { shares: { a: 1 } })],
    })
    const onBillChange = vi.fn()
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: 'Split the rest between everyone' }))
    const next = onBillChange.mock.calls[0][0] as Bill
    expect(next.lineItems.find((i) => i.id === '1')!.shares).toEqual({ a: 1, b: 1 })
    // Already-claimed Line Items are left untouched by the one-tap action.
    expect(next.lineItems.find((i) => i.id === '2')!.shares).toEqual({ a: 1 })
  })

  it('has no dismiss control on the Incomplete Split Banner', () => {
    const bill = emptyBill({ diners: [diner('a', 'Alice', 0)], lineItems: [lineItem('1', 'Pizza', 18000)] })
    const { getByRole, queryByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    const banner = getByRole('alert')
    expect(queryByRole('button', { name: /dismiss|close/i })).not.toBeInTheDocument()
    expect(banner).toBeInTheDocument()
  })

  it('blocks the onward action to Summary while the Split is incomplete', () => {
    const bill = emptyBill({ diners: [diner('a', 'Alice', 0)], lineItems: [lineItem('1', 'Pizza', 18000)] })
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByRole('button', { name: 'Continue to Summary' })).toBeDisabled()
  })

  it('enables the onward action once the Split is complete and calls onContinue', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000, { shares: { a: 1 } })],
    })
    const onContinue = vi.fn()
    const { getByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={onContinue} />)
    const button = getByRole('button', { name: 'Continue to Summary' })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('shows Adjustments as unassignable, offering no assignment interaction for them', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0)],
      lineItems: [lineItem('1', 'Pizza', 18000, { shares: { a: 1 } })],
      adjustments: [{ kind: 'rate', label: 'Tax', rateBps: 1000 }],
    })
    const { getByText, queryByRole } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByText('Tax')).toBeInTheDocument()
    expect(queryByRole('button', { name: /assign.*tax/i })).not.toBeInTheDocument()
  })

  it('has no WCAG AAA violations, complete or incomplete', async () => {
    const bill = emptyBill({
      diners: [diner('a', 'Alice', 0), diner('b', 'Bob', 1)],
      lineItems: [lineItem('1', 'Pizza', 18000), lineItem('2', 'Salad', 12000, { shares: { a: 1, b: 2 } })],
      adjustments: [{ kind: 'fixed', label: 'Delivery', amount: 5000 }],
    })
    const { container } = render(<AssignmentScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
