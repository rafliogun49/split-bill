import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { ProgressCard } from './ProgressCard'

const steps = [
  { label: 'Uploading photo', status: 'done' as const },
  { label: 'Reading receipt', status: 'active' as const },
]

const allStatusSteps = [
  { label: 'Uploading photo', status: 'done' as const },
  { label: 'Reading receipt', status: 'active' as const },
  { label: 'Matching totals', status: 'pending' as const },
]

describe('ProgressCard', () => {
  it('renders a determinate progressbar with the given percentage', () => {
    const { getByRole } = render(
      <ProgressCard progress={40} steps={steps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
  })

  it('omits aria-valuenow for an indeterminate stage rather than fabricating a percentage', () => {
    const { getByRole } = render(
      <ProgressCard progress={null} steps={steps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('renders every step label', () => {
    const { getByText } = render(<ProgressCard progress={null} steps={steps} cancelLabel="Cancel" onCancel={vi.fn()} />)
    expect(getByText('Uploading photo')).toBeInTheDocument()
    expect(getByText('Reading receipt')).toBeInTheDocument()
  })

  it('marks the active step for assistive tech via aria-current', () => {
    const { getByText } = render(<ProgressCard progress={null} steps={steps} cancelLabel="Cancel" onCancel={vi.fn()} />)
    expect(getByText('Reading receipt').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(getByText('Uploading photo').closest('li')).not.toHaveAttribute('aria-current')
  })

  it('calls onCancel when the Cancel button is pressed', () => {
    const onCancel = vi.fn()
    const { getByRole } = render(<ProgressCard progress={null} steps={steps} cancelLabel="Cancel" onCancel={onCancel} />)
    fireEvent.click(getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('gives a done step a green checkmark badge', () => {
    const { getByText } = render(
      <ProgressCard progress={null} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    const li = getByText('Uploading photo').closest('li') as HTMLElement
    expect(li.querySelector('.bg-diner-2')).toBeInTheDocument()
    expect(li.querySelector('svg')).toBeInTheDocument()
  })

  it('gives the active step a blinking blue badge', () => {
    const { getByText } = render(
      <ProgressCard progress={null} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    const li = getByText('Reading receipt').closest('li') as HTMLElement
    const badge = li.querySelector('.bg-diner-1') as HTMLElement
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('animate-pulse')
  })

  it('gives a pending step a plain white-with-border box, not a grey fill', () => {
    const { getByText } = render(
      <ProgressCard progress={null} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    const li = getByText('Matching totals').closest('li') as HTMLElement
    expect(li.querySelector('.bg-surface-container-lowest')).toBeInTheDocument()
    expect(li.querySelector('.bg-surface-variant')).not.toBeInTheDocument()
  })

  it('never uses primary-container as a fill, determinate or indeterminate', () => {
    const { container: determinate } = render(
      <ProgressCard progress={65} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(determinate.querySelector('.bg-primary-container')).not.toBeInTheDocument()

    const { container: indeterminate } = render(
      <ProgressCard progress={null} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(indeterminate.querySelector('.bg-primary-container')).not.toBeInTheDocument()
  })

  it('has no WCAG AAA violations, determinate or indeterminate', async () => {
    const { container: determinate } = render(
      <ProgressCard progress={65} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(await axe(determinate)).toHaveNoViolations()

    const { container: indeterminate } = render(
      <ProgressCard progress={null} steps={allStatusSteps} cancelLabel="Cancel" onCancel={vi.fn()} />,
    )
    expect(await axe(indeterminate)).toHaveNoViolations()
  })
})
