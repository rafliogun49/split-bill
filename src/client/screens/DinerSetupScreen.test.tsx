import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill, Diner } from '../../domain'
import { DinerSetupScreen } from './DinerSetupScreen'

function emptyBill(overrides: Partial<Bill> = {}): Bill {
  return { currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

function diner(id: string, name: string, joinIndex = 0): Diner {
  return { id, name, joinIndex }
}

function noop() {}

describe('DinerSetupScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a Diner by typing a name and submitting', () => {
    const onBillChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <DinerSetupScreen bill={emptyBill()} onBillChange={onBillChange} onContinue={noop} />,
    )
    fireEvent.change(getByLabelText('Diner name'), { target: { value: 'Budi' } })
    fireEvent.click(getByRole('button', { name: 'Add' }))
    expect(onBillChange).toHaveBeenCalledWith(
      expect.objectContaining({ diners: [expect.objectContaining({ name: 'Budi', joinIndex: 0 })] }),
    )
  })

  it('assigns the next Diner a joinIndex one past the highest already on the Bill, not the array length', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi', 4)] })
    const onBillChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />,
    )
    fireEvent.change(getByLabelText('Diner name'), { target: { value: 'Sarah' } })
    fireEvent.click(getByRole('button', { name: 'Add' }))
    const next = onBillChange.mock.calls[0][0] as Bill
    expect(next.diners.find((d) => d.name === 'Sarah')?.joinIndex).toBe(5)
  })

  it('remembers a typed name, offering it as a chip immediately', () => {
    const onBillChange = vi.fn()
    const { getByLabelText, getByRole } = render(
      <DinerSetupScreen bill={emptyBill()} onBillChange={onBillChange} onContinue={noop} />,
    )
    fireEvent.change(getByLabelText('Diner name'), { target: { value: 'Budi' } })
    fireEvent.click(getByRole('button', { name: 'Add' }))

    expect(getByRole('button', { name: 'Budi' })).toBeInTheDocument()
  })

  it('shows a remembered name as a tappable chip that adds a Diner in one tap', () => {
    localStorage.setItem('split-bill:diner-names', JSON.stringify({ version: 1, names: ['Sarah'] }))
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={emptyBill()} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: 'Sarah' }))
    expect(onBillChange).toHaveBeenCalledWith(
      expect.objectContaining({ diners: [expect.objectContaining({ name: 'Sarah' })] }),
    )
  })

  it('forgetting a remembered name removes its chip', () => {
    localStorage.setItem('split-bill:diner-names', JSON.stringify({ version: 1, names: ['Sarah'] }))
    const { getByRole, queryByRole } = render(
      <DinerSetupScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />,
    )
    fireEvent.click(getByRole('button', { name: /forget sarah/i }))
    expect(queryByRole('button', { name: 'Sarah' })).not.toBeInTheDocument()
  })

  it('does not offer a remembered chip for a name already seated on this Bill', () => {
    localStorage.setItem('split-bill:diner-names', JSON.stringify({ version: 1, names: ['Sarah'] }))
    const bill = emptyBill({ diners: [diner('a', 'Sarah')] })
    const { queryByRole } = render(<DinerSetupScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(queryByRole('button', { name: 'Sarah' })).not.toBeInTheDocument()
  })

  it('renames a Diner already on the Bill', () => {
    const bill = emptyBill({ diners: [diner('a', 'Sarahh')] })
    const onBillChange = vi.fn()
    const { getByDisplayValue } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.change(getByDisplayValue('Sarahh'), { target: { value: 'Sarah' } })
    expect(onBillChange).toHaveBeenCalledWith(
      expect.objectContaining({ diners: [expect.objectContaining({ id: 'a', name: 'Sarah' })] }),
    )
  })

  it('removing a Diner strips their Shares from every Line Item, leaving no dangling reference', () => {
    const bill = emptyBill({
      diners: [diner('a', 'Budi', 0), diner('b', 'Sarah', 1)],
      lineItems: [{ id: 'item', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: { a: 1, b: 1 } }],
    })
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /remove budi/i }))

    const next = onBillChange.mock.calls[0][0] as Bill
    expect(next.diners.map((d) => d.id)).toEqual(['b'])
    expect(next.lineItems[0]!.shares).toEqual({ b: 1 })
  })

  it("removing an earlier Diner leaves a later Diner's joinIndex, and therefore colour, unchanged", () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi', 0), diner('b', 'Sarah', 1), diner('c', 'Cara', 2)] })
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /remove budi/i }))

    const next = onBillChange.mock.calls[0][0] as Bill
    expect(next.diners.find((d) => d.id === 'b')?.joinIndex).toBe(1)
    expect(next.diners.find((d) => d.id === 'c')?.joinIndex).toBe(2)
  })

  it('clears the Payer when the Payer Diner is removed', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi')], payerId: 'a' })
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: /remove budi/i }))
    expect(onBillChange).toHaveBeenCalledWith(expect.objectContaining({ payerId: undefined }))
  })

  it('marks a Diner as Payer, distinctly among the Diners', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi', 0), diner('b', 'Sarah', 1)] })
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: 'Mark as Payer — Budi' }))
    expect(onBillChange).toHaveBeenCalledWith(expect.objectContaining({ payerId: 'a' }))
  })

  it('unmarks the Payer on a second tap', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi')], payerId: 'a' })
    const onBillChange = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={onBillChange} onContinue={noop} />)
    fireEvent.click(getByRole('button', { name: 'Remove as Payer — Budi' }))
    expect(onBillChange).toHaveBeenCalledWith(expect.objectContaining({ payerId: undefined }))
  })

  it('blocks Continue until at least one Diner exists', () => {
    const { getByRole } = render(<DinerSetupScreen bill={emptyBill()} onBillChange={noop} onContinue={noop} />)
    expect(getByRole('button', { name: 'Assignment' })).toBeDisabled()
  })

  it('blocks Continue while any Diner has a blank name', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi'), diner('b', '   ')] })
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(getByRole('button', { name: 'Assignment' })).toBeDisabled()
  })

  it('enables Continue once a Diner is present and calls onContinue', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi')] })
    const onContinue = vi.fn()
    const { getByRole } = render(<DinerSetupScreen bill={bill} onBillChange={noop} onContinue={onContinue} />)
    const button = getByRole('button', { name: 'Assignment' })
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('never renders an avatar image for a Diner', () => {
    const bill = emptyBill({ diners: [diner('a', 'Budi')] })
    const { container } = render(<DinerSetupScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('has no WCAG AAA violations with remembered names, Diners and a Payer present', async () => {
    localStorage.setItem('split-bill:diner-names', JSON.stringify({ version: 1, names: ['Sarah'] }))
    const bill = emptyBill({ diners: [diner('a', 'Budi')], payerId: 'a' })
    const { container } = render(<DinerSetupScreen bill={bill} onBillChange={noop} onContinue={noop} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
