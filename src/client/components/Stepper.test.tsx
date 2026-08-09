import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('renders the current value', () => {
    const { getByText } = render(
      <Stepper label="Alice" value={2} onChange={vi.fn()} increaseLabel="Increase" decreaseLabel="Decrease" />,
    )
    expect(getByText('2')).toBeInTheDocument()
  })

  it('emits value + 1 when the increment control is pressed', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Stepper label="Alice" value={1} onChange={onChange} increaseLabel="Increase" decreaseLabel="Decrease" />,
    )
    fireEvent.click(getByRole('button', { name: /increase.*alice/i }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('emits value - 1 when the decrement control is pressed', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Stepper label="Alice" value={2} onChange={onChange} increaseLabel="Increase" decreaseLabel="Decrease" />,
    )
    fireEvent.click(getByRole('button', { name: /decrease.*alice/i }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('floors at zero: the decrement control is disabled and never emits a negative value', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Stepper label="Alice" value={0} onChange={onChange} increaseLabel="Increase" decreaseLabel="Decrease" />,
    )
    const decrement = getByRole('button', { name: /decrease.*alice/i })
    expect(decrement).toBeDisabled()
    fireEvent.click(decrement)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('composes the caller-supplied increase/decrease wording into each button\'s accessible name, e.g. a Line Item quantity rather than a Share', () => {
    const { getByRole } = render(
      <Stepper
        label="Nasi Goreng"
        value={1}
        onChange={vi.fn()}
        increaseLabel="Increase quantity —"
        decreaseLabel="Decrease quantity —"
      />,
    )
    expect(getByRole('button', { name: 'Increase quantity — Nasi Goreng' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Decrease quantity — Nasi Goreng' })).toBeInTheDocument()
  })

  it('has no WCAG AAA violations at zero and above', async () => {
    const { container } = render(
      <>
        <Stepper label="Alice" value={0} onChange={vi.fn()} increaseLabel="Increase" decreaseLabel="Decrease" />
        <Stepper label="Bob" value={3} onChange={vi.fn()} increaseLabel="Increase" decreaseLabel="Decrease" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
