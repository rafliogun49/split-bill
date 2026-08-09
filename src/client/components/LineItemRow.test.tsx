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
// keystrokes each sees the item as it stood after the previous one, the way
// a live onChange -> re-render loop behaves.
function StatefulLineItemRow({ initial }: { initial: LineItem }) {
  const [item, setItem] = useState(initial)
  return (
    <LineItemRow
      item={item}
      currency={currency}
      canMoveUp={false}
      canMoveDown={false}
      onChange={setItem}
      onRemove={noop}
      onMoveUp={noop}
      onMoveDown={noop}
    />
  )
}

describe('LineItemRow', () => {
  it('renders the line item name, quantity and line total', () => {
    const { getByDisplayValue, getByLabelText } = render(
      <LineItemRow
        item={baseItem()}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(getByDisplayValue('Nasi Goreng Spesial')).toBeInTheDocument()
    expect(getByLabelText(/quantity/i)).toHaveValue('1')
    expect(getByLabelText(/line total/i)).toHaveValue('Rp 90.000')
  })

  it('renames the line item', () => {
    const onChange = vi.fn()
    const { getByDisplayValue } = render(
      <LineItemRow
        item={baseItem()}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={onChange}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    fireEvent.change(getByDisplayValue('Nasi Goreng Spesial'), { target: { value: 'Es Teh Manis' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ label: 'Es Teh Manis' }))
  })

  it('fills the line total by multiplying quantity and unit price', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <LineItemRow
        item={baseItem({ amount: 12000, quantity: 1 })}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={onChange}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    fireEvent.change(getByLabelText(/quantity/i), { target: { value: '3' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ quantity: 3, amount: 36000 }))
  })

  it('lets the line total be overridden independently of quantity and unit price', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <LineItemRow
        item={baseItem({ amount: 90000, quantity: 1 })}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={onChange}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
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
      <LineItemRow
        item={baseItem()}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={onRemove}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    fireEvent.click(getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('disables move up/down at the ends of the list', () => {
    const { getByRole } = render(
      <LineItemRow
        item={baseItem()}
        currency={currency}
        canMoveUp={false}
        canMoveDown={true}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(getByRole('button', { name: /move up/i })).toBeDisabled()
    expect(getByRole('button', { name: /move down/i })).toBeEnabled()
  })

  it('does not corrupt the unit price after quantity passes through zero mid-edit', () => {
    const { getByLabelText } = render(
      <StatefulLineItemRow initial={baseItem({ amount: 900000, quantity: 10 })} />,
    )
    const quantity = getByLabelText(/quantity/i)
    fireEvent.change(quantity, { target: { value: '0' } })
    fireEvent.change(quantity, { target: { value: '2' } })
    expect(getByLabelText(/line total/i)).toHaveValue('Rp 180.000')
  })

  it('resyncs the quantity field to the real value on blur after an invalid edit', () => {
    const { getByLabelText } = render(<StatefulLineItemRow initial={baseItem({ quantity: 5 })} />)
    const quantity = getByLabelText(/quantity/i)
    fireEvent.change(quantity, { target: { value: '' } })
    fireEvent.blur(quantity)
    expect(quantity).toHaveValue('5')
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(
      <LineItemRow
        item={baseItem()}
        currency={currency}
        canMoveUp
        canMoveDown
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
