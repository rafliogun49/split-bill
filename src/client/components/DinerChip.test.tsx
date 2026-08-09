import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import { DinerChip } from './DinerChip'

describe('DinerChip', () => {
  it('shows the first character of the name as typed, uncased', () => {
    const { getByText } = render(<DinerChip name="budi" joinIndex={0} />)
    expect(getByText('b')).toBeInTheDocument()
  })

  it('cycles through the diner-1..6 fills by join order, wrapping past six', () => {
    const { container: c0 } = render(<DinerChip name="A" joinIndex={0} />)
    const { container: c5 } = render(<DinerChip name="F" joinIndex={5} />)
    const { container: c6 } = render(<DinerChip name="G" joinIndex={6} />)
    expect(c0.querySelector('.bg-diner-1')).toBeInTheDocument()
    expect(c5.querySelector('.bg-diner-6')).toBeInTheDocument()
    expect(c6.querySelector('.bg-diner-1')).toBeInTheDocument()
  })

  it('never uses primary-container as a fill', () => {
    for (let i = 0; i < 12; i++) {
      const { container } = render(<DinerChip name="A" joinIndex={i} />)
      expect(container.querySelector('.bg-primary-container')).not.toBeInTheDocument()
    }
  })

  it('renders no rounded corners in any variant', () => {
    const { container } = render(<DinerChip name="A" joinIndex={0} shareCount={3} isPayer />)
    expect(container.innerHTML).not.toMatch(/rounded/)
  })

  it('claimed and unclaimed differ in shadow class, not fill', () => {
    const { container: claimed } = render(<DinerChip name="A" joinIndex={0} claimed />)
    const { container: unclaimed } = render(<DinerChip name="A" joinIndex={0} claimed={false} />)
    expect(claimed.querySelector('.shadow-sm')).toBeInTheDocument()
    expect(unclaimed.querySelector('.shadow-sm')).not.toBeInTheDocument()
    expect(claimed.querySelector('.bg-diner-1')).toBeInTheDocument()
    expect(unclaimed.querySelector('.bg-diner-1')).toBeInTheDocument()
  })

  it('renders a Share count above one as visible text', () => {
    const { getByText } = render(<DinerChip name="A" joinIndex={0} shareCount={3} />)
    expect(getByText('3')).toBeInTheDocument()

    const single = render(<DinerChip name="B" joinIndex={0} shareCount={1} />)
    expect(single.queryByText('1')).not.toBeInTheDocument()
  })

  it('renders no image', () => {
    const { container } = render(<DinerChip name="A" joinIndex={0} />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('marks the Payer distinctly, visible as text', () => {
    const { getByText } = render(<DinerChip name="A" joinIndex={0} isPayer />)
    expect(getByText('Payer')).toBeInTheDocument()
  })

  it('has no WCAG AAA violations across variants', async () => {
    const { container } = render(
      <>
        <DinerChip name="Alice" joinIndex={0} claimed />
        <DinerChip name="Bob" joinIndex={1} claimed={false} />
        <DinerChip name="Cara" joinIndex={2} shareCount={2} />
        <DinerChip name="Dedi" joinIndex={3} isPayer />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
