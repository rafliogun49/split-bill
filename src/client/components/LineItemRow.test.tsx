import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { LineItem } from '../../domain'
import { LineItemRow } from './LineItemRow'

const currency = { code: 'IDR' }

function baseItem(overrides: Partial<LineItem> = {}): LineItem {
  return { id: 'li-1', label: 'Nasi Goreng Spesial', amount: 90000, quantity: 1, shares: {}, ...overrides }
}

function noop() {}

// A thin stateful wrapper — like the real parent — so a sequence of
// stepper clicks each sees the item as it stood after the previous one, the
// way a live onChange -> re-render loop behaves.
function StatefulLineItemRow({ initial }: { initial: LineItem }) {
  const [item, setItem] = useState(initial)
  return <LineItemRow item={item} currency={currency} onChange={setItem} onRemove={noop} />
}

describe('LineItemRow', () => {
  it('renders the line item name, quantity and line total', () => {
    const { getByDisplayValue, getByRole, getByLabelText } = render(
      <LineItemRow item={baseItem()} currency={currency} onChange={noop} onRemove={noop} />,
    )
    expect(getByDisplayValue('Nasi Goreng Spesial')).toBeInTheDocument()
    expect(getByRole('group', { name: 'Nasi Goreng Spesial' })).toHaveTextContent('1')
    expect(getByLabelText(/line total/i)).toHaveValue('Rp 90.000')
  })

  it('renames the line item', () => {
    const onChange = vi.fn()
    const { getByDisplayValue } = render(
      <LineItemRow item={baseItem()} currency={currency} onChange={onChange} onRemove={noop} />,
    )
    fireEvent.change(getByDisplayValue('Nasi Goreng Spesial'), { target: { value: 'Es Teh Manis' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ label: 'Es Teh Manis' }))
  })

  it('quantity is entered via a Stepper, not a free-text field', () => {
    const { queryByLabelText, getByRole } = render(
      <LineItemRow item={baseItem()} currency={currency} onChange={noop} onRemove={noop} />,
    )
    expect(queryByLabelText(/quantity/i, { selector: 'input, textarea' })).not.toBeInTheDocument()
    expect(getByRole('button', { name: /increase quantity.*nasi goreng spesial/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /decrease quantity.*nasi goreng spesial/i })).toBeInTheDocument()
  })

  it('disables the stepper decrement control once quantity reaches zero, so it can never go negative', () => {
    const { getByRole } = render(
      <LineItemRow item={baseItem({ quantity: 0 })} currency={currency} onChange={noop} onRemove={noop} />,
    )
    expect(getByRole('button', { name: /decrease quantity.*nasi goreng spesial/i })).toBeDisabled()
  })

  it("recomputes the line total against the item's last-known unit price as the stepper is incremented", () => {
    const { getByLabelText, getByRole } = render(
      <StatefulLineItemRow initial={baseItem({ amount: 12000, quantity: 1 })} />,
    )
    const increase = getByRole('button', { name: /increase quantity.*nasi goreng spesial/i })
    fireEvent.click(increase)
    fireEvent.click(increase)
    // Unit price was 12000 / 1 = 12000; quantity is now 3.
    expect(getByLabelText(/line total/i)).toHaveValue('Rp 36.000')
  })

  it('lets the line total be overridden independently of quantity and unit price', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <LineItemRow item={baseItem({ amount: 90000, quantity: 1 })} currency={currency} onChange={onChange} onRemove={noop} />,
    )
    const lineTotal = getByLabelText(/line total/i)
    fireEvent.focus(lineTotal)
    fireEvent.change(lineTotal, { target: { value: '75000' } })
    fireEvent.blur(lineTotal)
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ quantity: 1, amount: 75000 }))
  })

  it('calls onRemove when the delete action is pressed', () => {
    const onRemove = vi.fn()
    const { getByRole } = render(
      <LineItemRow item={baseItem()} currency={currency} onChange={noop} onRemove={onRemove} />,
    )
    fireEvent.click(getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('does not corrupt the unit price after quantity passes through zero via the stepper', () => {
    const { getByLabelText, getByRole } = render(
      <StatefulLineItemRow initial={baseItem({ amount: 900000, quantity: 10 })} />,
    )
    // Unit price is 900000 / 10 = 90000.
    const decrease = getByRole('button', { name: /decrease quantity.*nasi goreng spesial/i })
    const increase = getByRole('button', { name: /increase quantity.*nasi goreng spesial/i })
    for (let i = 0; i < 10; i += 1) fireEvent.click(decrease)
    fireEvent.click(increase)
    fireEvent.click(increase)
    expect(getByLabelText(/line total/i)).toHaveValue('Rp 180.000')
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<LineItemRow item={baseItem()} currency={currency} onChange={noop} onRemove={noop} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
