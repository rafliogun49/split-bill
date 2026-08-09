import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { StickySummaryBar } from './StickySummaryBar'

describe('StickySummaryBar', () => {
  it('renders the label and amount', () => {
    const { getByText } = render(
      <StickySummaryBar
        label="Total"
        amount={156177}
        currency={{ code: 'IDR' }}
        actionLabel="Diners"
        onAction={() => {}}
      />,
    )
    expect(getByText('Total')).toBeInTheDocument()
    expect(getByText('Rp 156.177')).toBeInTheDocument()
  })

  it('calls onAction when the primary action is pressed', () => {
    const onAction = vi.fn()
    const { getByRole } = render(
      <StickySummaryBar
        label="Total"
        amount={156177}
        currency={{ code: 'IDR' }}
        actionLabel="Diners"
        onAction={onAction}
      />,
    )
    fireEvent.click(getByRole('button', { name: 'Diners' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('disables the primary action when told to', () => {
    const { getByRole } = render(
      <StickySummaryBar
        label="Total"
        amount={156177}
        currency={{ code: 'IDR' }}
        actionLabel="Diners"
        onAction={() => {}}
        disabled
      />,
    )
    expect(getByRole('button', { name: 'Diners' })).toBeDisabled()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(
      <StickySummaryBar
        label="Total"
        amount={156177}
        currency={{ code: 'IDR' }}
        actionLabel="Diners"
        onAction={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
