import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { PayerRibbon } from './PayerRibbon'

describe('PayerRibbon', () => {
  it('renders the Payer label as visible text', () => {
    const { getByText } = render(<PayerRibbon joinIndex={0} onClick={() => {}} label="Remove as Payer — Budi" />)
    expect(getByText('Payer')).toBeInTheDocument()
  })

  it('calls onClick when tapped', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<PayerRibbon joinIndex={0} onClick={onClick} label="Remove as Payer — Budi" />)
    fireEvent.click(getByRole('button', { name: 'Remove as Payer — Budi' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('cycles through the diner-1..6 inks by join order, wrapping past six', () => {
    const { container: c0 } = render(<PayerRibbon joinIndex={0} onClick={() => {}} label="a" />)
    const { container: c5 } = render(<PayerRibbon joinIndex={5} onClick={() => {}} label="b" />)
    const { container: c6 } = render(<PayerRibbon joinIndex={6} onClick={() => {}} label="c" />)
    expect(c0.querySelector('.text-diner-1')).toBeInTheDocument()
    expect(c5.querySelector('.text-diner-6')).toBeInTheDocument()
    expect(c6.querySelector('.text-diner-1')).toBeInTheDocument()
  })

  it('never renders white text', () => {
    const { container } = render(<PayerRibbon joinIndex={0} onClick={() => {}} label="a" />)
    expect(container.querySelector('.text-white')).not.toBeInTheDocument()
  })

  it('renders no rounded corners', () => {
    const { container } = render(<PayerRibbon joinIndex={0} onClick={() => {}} label="a" />)
    expect(container.innerHTML).not.toMatch(/rounded/)
  })

  it('has no WCAG AAA violations across the diner-1..6 inks', async () => {
    const { container } = render(
      <>
        <PayerRibbon joinIndex={0} onClick={() => {}} label="Remove as Payer — Alice" />
        <PayerRibbon joinIndex={1} onClick={() => {}} label="Remove as Payer — Bob" />
        <PayerRibbon joinIndex={2} onClick={() => {}} label="Remove as Payer — Cara" />
        <PayerRibbon joinIndex={3} onClick={() => {}} label="Remove as Payer — Dedi" />
        <PayerRibbon joinIndex={4} onClick={() => {}} label="Remove as Payer — Eka" />
        <PayerRibbon joinIndex={5} onClick={() => {}} label="Remove as Payer — Farah" />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
