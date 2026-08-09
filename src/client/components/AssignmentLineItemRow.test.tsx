import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Diner, LineItem } from '../../domain'
import { AssignmentLineItemRow } from './AssignmentLineItemRow'

const currency = { code: 'IDR' }

function diner(id: string, name: string, joinIndex: number): Diner {
  return { id, name, joinIndex }
}

function lineItem(overrides: Partial<LineItem> = {}): LineItem {
  return { id: 'item', label: 'Craft Beer', amount: 10000, quantity: 2, shares: {}, ...overrides }
}

const diners = [diner('a', 'Alice', 0), diner('b', 'Bob', 1)]

describe('AssignmentLineItemRow', () => {
  it('shows the name, quantity and line total', () => {
    const { getByText } = render(
      <AssignmentLineItemRow item={lineItem()} currency={currency} diners={diners} onOpenPicker={vi.fn()} />,
    )
    expect(getByText('Craft Beer')).toBeInTheDocument()
    expect(getByText('2x')).toBeInTheDocument()
    expect(getByText('Rp 10.000')).toBeInTheDocument()
  })

  it('shows claiming Diners without any interaction', () => {
    const { getByText, queryByText } = render(
      <AssignmentLineItemRow item={lineItem({ shares: { a: 1 } })} currency={currency} diners={diners} onOpenPicker={vi.fn()} />,
    )
    expect(getByText('A')).toBeInTheDocument()
    expect(queryByText('B')).not.toBeInTheDocument()
  })

  it('renders an unclaimed affordance, not an empty region, when no one has claimed it', () => {
    const { container } = render(
      <AssignmentLineItemRow item={lineItem()} currency={currency} diners={diners} onOpenPicker={vi.fn()} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('opens the picker when tapped anywhere on the row', () => {
    const onOpenPicker = vi.fn()
    const { getByRole } = render(
      <AssignmentLineItemRow item={lineItem()} currency={currency} diners={diners} onOpenPicker={onOpenPicker} />,
    )
    fireEvent.click(getByRole('button', { name: /assign.*craft beer/i }))
    expect(onOpenPicker).toHaveBeenCalledOnce()
  })

  it('has no WCAG AAA violations claimed or unclaimed', async () => {
    const { container } = render(
      <>
        <AssignmentLineItemRow item={lineItem()} currency={currency} diners={diners} onOpenPicker={vi.fn()} />
        <AssignmentLineItemRow item={lineItem({ shares: { a: 2 } })} currency={currency} diners={diners} onOpenPicker={vi.fn()} />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
