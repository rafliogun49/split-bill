import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { AssignmentDinerTotals } from './AssignmentDinerTotals'

const currency = { code: 'IDR' }

function bill(overrides: Partial<Bill> = {}): Bill {
  return { currency, diners: [], lineItems: [], adjustments: [], ...overrides }
}

describe('AssignmentDinerTotals', () => {
  it("shows every Diner's name and running Total", () => {
    const b = bill({
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 18000, quantity: 1, shares: { a: 1 } }],
    })
    const split = calculateSplit(b)
    const { getByText } = render(<AssignmentDinerTotals diners={b.diners} split={split} currency={currency} />)
    expect(getByText('Alice')).toBeInTheDocument()
    expect(getByText('Bob')).toBeInTheDocument()
    expect(getByText('Rp 18.000')).toBeInTheDocument()
    expect(getByText('Rp 0')).toBeInTheDocument()
  })

  it("updates a Diner's Total live as Line Items are claimed, without recomputing its own Split", () => {
    const claimed = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 18000, quantity: 1, shares: { a: 1 } }],
    })
    const { getByText, rerender } = render(
      <AssignmentDinerTotals diners={claimed.diners} split={calculateSplit(claimed)} currency={currency} />,
    )
    expect(getByText('Rp 18.000')).toBeInTheDocument()

    const unclaimed = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 18000, quantity: 1, shares: {} }],
    })
    rerender(<AssignmentDinerTotals diners={unclaimed.diners} split={calculateSplit(unclaimed)} currency={currency} />)
    expect(getByText('Rp 0')).toBeInTheDocument()
  })

  it("allocates a Diner's pro-rata share of Adjustments into their Total", () => {
    const b = bill({
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 10000, quantity: 1, shares: { a: 1, b: 1 } }],
      adjustments: [{ kind: 'fixed', label: 'Delivery', amount: 2000 }],
    })
    const split = calculateSplit(b)
    const { getAllByText } = render(<AssignmentDinerTotals diners={b.diners} split={split} currency={currency} />)
    // $10.000 Pizza split evenly + $2.000 Delivery split evenly = Rp 6.000 each.
    expect(getAllByText('Rp 6.000')).toHaveLength(2)
  })

  it('has no WCAG AAA violations', async () => {
    const b = bill({
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 18000, quantity: 1, shares: { a: 1, b: 1 } }],
    })
    const { container } = render(<AssignmentDinerTotals diners={b.diners} split={calculateSplit(b)} currency={currency} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
