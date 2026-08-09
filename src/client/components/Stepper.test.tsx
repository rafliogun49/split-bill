import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('renders the current value', () => {
    const { getByText } = render(<Stepper label="Alice" value={2} onChange={vi.fn()} />)
    expect(getByText('2')).toBeInTheDocument()
  })

  it('emits value + 1 when the increment control is pressed', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Stepper label="Alice" value={1} onChange={onChange} />)
    fireEvent.click(getByRole('button', { name: /increase shares.*alice/i }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('emits value - 1 when the decrement control is pressed', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Stepper label="Alice" value={2} onChange={onChange} />)
    fireEvent.click(getByRole('button', { name: /decrease shares.*alice/i }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('floors at zero: the decrement control is disabled and never emits a negative Share', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Stepper label="Alice" value={0} onChange={onChange} />)
    const decrement = getByRole('button', { name: /decrease shares.*alice/i })
    expect(decrement).toBeDisabled()
    fireEvent.click(decrement)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has no WCAG AAA violations at zero and above', async () => {
    const { container } = render(
      <>
        <Stepper label="Alice" value={0} onChange={vi.fn()} />
        <Stepper label="Bob" value={3} onChange={vi.fn()} />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
