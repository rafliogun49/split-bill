import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { TextField } from './TextField'

describe('TextField', () => {
  it('associates the visible label with the input', () => {
    const { getByLabelText } = render(<TextField label="Place" value="" onChange={() => {}} />)
    expect(getByLabelText('Place')).toBeInTheDocument()
  })

  it('keeps the label in the accessible name when visually hidden', () => {
    const { getByLabelText } = render(<TextField label="Line item name" hideLabel value="" onChange={() => {}} />)
    expect(getByLabelText('Line item name')).toBeInTheDocument()
  })

  it('calls onChange as the user types', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(<TextField label="Place" value="" onChange={onChange} />)
    fireEvent.change(getByLabelText('Place'), { target: { value: 'Warung Tekko' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('has no WCAG AAA violations, visible or hidden label', async () => {
    const { container } = render(
      <>
        <TextField label="Place" value="" onChange={() => {}} />
        <TextField label="Line item name" hideLabel value="" onChange={() => {}} />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
