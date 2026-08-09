import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { AmountField } from './AmountField'

describe('AmountField', () => {
  it('renders IDR with dot separators and no decimals', () => {
    const { getByLabelText } = render(
      <AmountField label="Total" value={156177} currency={{ code: 'IDR' }} onChange={() => {}} />,
    )
    expect(getByLabelText('Total')).toHaveValue('Rp 156.177')
  })

  it('renders SGD with two decimals', () => {
    const { getByLabelText } = render(
      <AmountField label="Total" value={15618} currency={{ code: 'SGD' }} onChange={() => {}} />,
    )
    expect(getByLabelText('Total')).toHaveValue('$156.18')
  })

  it('carries the tabular-nums amount-md token', () => {
    const { getByLabelText } = render(
      <AmountField label="Total" value={0} currency={{ code: 'SGD' }} onChange={() => {}} />,
    )
    expect(getByLabelText('Total').className).toContain('text-amount-md')
  })

  it('switches to the plain major-unit number while focused', () => {
    const { getByLabelText } = render(
      <AmountField label="Total" value={156177} currency={{ code: 'IDR' }} onChange={() => {}} />,
    )
    const input = getByLabelText('Total')
    fireEvent.focus(input)
    expect(input).toHaveValue('156177')
  })

  it('commits an edited value in minor units on blur', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <AmountField label="Total" value={156177} currency={{ code: 'IDR' }} onChange={onChange} />,
    )
    const input = getByLabelText('Total')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '90000' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(90000)
  })

  it('does not call onChange when blurred without an edit', () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      <AmountField label="Total" value={156177} currency={{ code: 'IDR' }} onChange={onChange} />,
    )
    const input = getByLabelText('Total')
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(
      <AmountField label="Total" value={156177} currency={{ code: 'IDR' }} onChange={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
