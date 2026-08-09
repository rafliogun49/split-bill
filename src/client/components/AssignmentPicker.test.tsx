import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Diner, DinerId, LineItem } from '../../domain'
import { AssignmentPicker } from './AssignmentPicker'

const currency = { code: 'IDR' }

function diner(id: string, name: string, joinIndex: number): Diner {
  return { id, name, joinIndex }
}

function lineItem(overrides: Partial<LineItem> = {}): LineItem {
  return { id: 'item', label: 'Craft Beer', amount: 10000, quantity: 2, shares: {}, ...overrides }
}

const diners = [diner('a', 'Alice', 0), diner('b', 'Bob', 1)]
const noAmounts: Record<DinerId, number> = {}

describe('AssignmentPicker', () => {
  it('names the Line Item and its total in the header', () => {
    const { getByRole, getByText } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(getByRole('heading', { name: 'Craft Beer' })).toBeInTheDocument()
    expect(getByText('Rp 10.000')).toBeInTheDocument()
  })

  it('renders a Stepper for every Diner, including those at zero Shares', () => {
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(getByRole('group', { name: 'Alice' })).toBeInTheDocument()
    expect(getByRole('group', { name: 'Bob' })).toBeInTheDocument()
  })

  it("incrementing a Diner's Stepper emits the full shares record with only that Diner changed", () => {
    const onSharesChange = vi.fn()
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem({ shares: { a: 1 } })}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={onSharesChange}
        onClose={vi.fn()}
      />,
    )
    fireEvent.click(getByRole('button', { name: /increase shares.*bob/i }))
    expect(onSharesChange).toHaveBeenCalledWith({ a: 1, b: 1 })
  })

  it("decrementing a Diner's Stepper never goes below zero", () => {
    const onSharesChange = vi.fn()
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem({ shares: { a: 1 } })}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={onSharesChange}
        onClose={vi.fn()}
      />,
    )
    fireEvent.click(getByRole('button', { name: /decrease shares.*bob/i }))
    expect(onSharesChange).not.toHaveBeenCalled()
  })

  it("shows each claiming Diner's share of the row's cost from the caller's own Split", () => {
    const { getAllByText, queryByText } = render(
      <AssignmentPicker
        lineItem={lineItem({ shares: { a: 1, b: 1 } })}
        currency={currency}
        diners={diners}
        dinerAmounts={{ a: 5000, b: 5000 }}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(getAllByText('Rp 5.000')).toHaveLength(2)
    expect(queryByText('Rp 0')).not.toBeInTheDocument()
  })

  it('calls onClose when Done is pressed', () => {
    const onClose = vi.fn()
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={onClose}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'Done' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={onClose}
      />,
    )
    fireEvent.click(getByRole('dialog').parentElement!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={onClose}
      />,
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('moves focus into the dialog on open', () => {
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('returns focus to the element that was focused before it opened, on close', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const { unmount } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(document.activeElement).not.toBe(trigger)
    unmount()
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('traps Tab focus within the dialog, wrapping from the last control back to the first', () => {
    const { getByRole } = render(
      <AssignmentPicker
        lineItem={lineItem()}
        currency={currency}
        diners={diners}
        dinerAmounts={noAmounts}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    const doneButton = getByRole('button', { name: 'Done' })
    doneButton.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).not.toBe(doneButton)
    expect(getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(
      <AssignmentPicker
        lineItem={lineItem({ shares: { a: 1, b: 2 } })}
        currency={currency}
        diners={diners}
        dinerAmounts={{ a: 3333, b: 6667 }}
        onSharesChange={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
