import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { ShareCard } from './ShareCard'

function bill(overrides: Partial<Bill> = {}): Bill {
  return { currency: { code: 'SGD' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

describe('ShareCard', () => {
  it('leads with what the Payer is owed, in amount-lg', () => {
    const b = bill({
      payerId: 'a',
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 4000, quantity: 1, shares: { a: 1, b: 3 } }],
    })
    const split = calculateSplit(b)
    const { container } = render(<ShareCard bill={b} split={split} locale="en-SG" />)
    // Alice (Payer) is owed the Bill total minus her own Total: $40.00 - $10.00.
    const owed = container.querySelector('.text-amount-lg')
    expect(owed).toHaveTextContent('$30.00')
  })

  it('gives each Diner a card in their allocated colour with itemised Shares, Subtotal, Adjustments and Total', () => {
    const b = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 2 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 4000, quantity: 1, shares: { a: 1 } }],
      adjustments: [{ kind: 'fixed', label: 'Service charge', amount: 800 }],
    })
    const split = calculateSplit(b)
    const { getByText } = render(<ShareCard bill={b} split={split} locale="en-SG" />)
    const dinerCard = getByText('Alice').closest('div.bg-diner-3')
    expect(dinerCard).not.toBeNull()
    expect(dinerCard).toHaveTextContent('Pizza')
    expect(dinerCard).toHaveTextContent('Service charge')
    expect(dinerCard).toHaveTextContent('$48.00')
  })

  it('marks the Payer distinctly and names who to pay', () => {
    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const split = calculateSplit(b)
    const { getByText } = render(<ShareCard bill={b} split={split} locale="en-SG" />)
    expect(getByText('Pay Alice')).toBeInTheDocument()
    expect(getByText(/Payer/)).toBeInTheDocument()
  })

  it('heads with Place and Date, omitted when absent', () => {
    const withPlace = bill({
      place: 'Pizza Place',
      date: '2026-08-09',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [],
    })
    const { getByText, queryByText, rerender } = render(
      <ShareCard bill={withPlace} split={calculateSplit(withPlace)} locale="en-SG" />,
    )
    expect(getByText('Pizza Place')).toBeInTheDocument()
    expect(getByText('9 August 2026')).toBeInTheDocument()

    const withoutPlace = bill({ diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }], lineItems: [] })
    rerender(<ShareCard bill={withoutPlace} split={calculateSplit(withoutPlace)} locale="en-SG" />)
    expect(queryByText('Pizza Place')).not.toBeInTheDocument()
  })

  it('renders no button or anchor elements', () => {
    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const { container } = render(<ShareCard bill={b} split={calculateSplit(b)} locale="en-SG" />)
    expect(container.querySelectorAll('button, a')).toHaveLength(0)
  })

  it('never mentions payment status', () => {
    const b = bill({ diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }], lineItems: [] })
    const { container } = render(<ShareCard bill={b} split={calculateSplit(b)} locale="en-SG" />)
    expect(container.textContent).not.toMatch(/pending|paid|settled/i)
  })

  it('has no WCAG AAA violations', async () => {
    const b = bill({
      payerId: 'a',
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 4000, quantity: 1, shares: { a: 1, b: 1 } }],
      adjustments: [{ kind: 'fixed', label: 'Service charge', amount: 800 }],
    })
    const { container } = render(<ShareCard bill={b} split={calculateSplit(b)} locale="en-SG" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
