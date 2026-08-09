import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Adjustment } from '../../domain'
import { AdjustmentRow } from './AdjustmentRow'

const currency = { code: 'IDR' }

function noop() {}

const rateAdjustment: Adjustment = { kind: 'rate', label: 'Tax', rateBps: 1100 }
const fixedAdjustment: Adjustment = { kind: 'fixed', label: 'Delivery fee', amount: 5000 }

describe('AdjustmentRow', () => {
  it('shows both the stated rate and its resolved amount', () => {
    const { getByDisplayValue, getByText } = render(
      <AdjustmentRow
        adjustment={rateAdjustment}
        resolvedAmount={14740}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(getByDisplayValue('11')).toBeInTheDocument()
    expect(getByText('Rp 14.740')).toBeInTheDocument()
  })

  it('shows both the stated fixed amount and its resolved amount', () => {
    const { getByLabelText, getByText } = render(
      <AdjustmentRow
        adjustment={fixedAdjustment}
        resolvedAmount={5000}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(getByLabelText(/fixed amount/i)).toHaveValue('Rp 5.000')
    expect(getByText('Rp 5.000')).toBeInTheDocument()
  })

  it('switches from rate to fixed, resetting the value', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <AdjustmentRow
        adjustment={rateAdjustment}
        resolvedAmount={14740}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={onChange}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'Fixed' }))
    expect(onChange).toHaveBeenCalledWith({ kind: 'fixed', label: 'Tax', amount: 0 })
  })

  it('never offers to assign the Adjustment to a Diner', () => {
    const { queryByText } = render(
      <AdjustmentRow
        adjustment={fixedAdjustment}
        resolvedAmount={5000}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    expect(queryByText(/assign/i)).not.toBeInTheDocument()
  })

  it('calls onRemove when the delete action is pressed', () => {
    const onRemove = vi.fn()
    const { getByRole } = render(
      <AdjustmentRow
        adjustment={fixedAdjustment}
        resolvedAmount={5000}
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

  it('resyncs the rate field to the real value on blur after an invalid edit', () => {
    const { getByDisplayValue } = render(
      <AdjustmentRow
        adjustment={rateAdjustment}
        resolvedAmount={14740}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
      />,
    )
    const percent = getByDisplayValue('11')
    fireEvent.change(percent, { target: { value: '' } })
    fireEvent.blur(percent)
    expect(getByDisplayValue('11')).toBeInTheDocument()
  })

  it('is draggable when a drag handler is supplied', () => {
    const { container } = render(
      <AdjustmentRow
        adjustment={fixedAdjustment}
        resolvedAmount={5000}
        currency={currency}
        canMoveUp={false}
        canMoveDown={false}
        onChange={noop}
        onRemove={noop}
        onMoveUp={noop}
        onMoveDown={noop}
        onDragStart={noop}
      />,
    )
    expect(container.firstElementChild).toHaveAttribute('draggable', 'true')
  })

  it('has no WCAG AAA violations in either kind', async () => {
    const { container } = render(
      <>
        <AdjustmentRow
          adjustment={rateAdjustment}
          resolvedAmount={14740}
          currency={currency}
          canMoveUp
          canMoveDown
          onChange={noop}
          onRemove={noop}
          onMoveUp={noop}
          onMoveDown={noop}
        />
        <AdjustmentRow
          adjustment={fixedAdjustment}
          resolvedAmount={5000}
          currency={currency}
          canMoveUp
          canMoveDown
          onChange={noop}
          onRemove={noop}
          onMoveUp={noop}
          onMoveDown={noop}
        />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
