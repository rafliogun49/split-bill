import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { NameChip } from './NameChip'

function noop() {}

describe('NameChip', () => {
  it('renders the name', () => {
    const { getByText } = render(<NameChip name="Budi" onAdd={noop} onForget={noop} />)
    expect(getByText('Budi')).toBeInTheDocument()
  })

  it('calls onAdd when the name itself is tapped', () => {
    const onAdd = vi.fn()
    const { getByRole } = render(<NameChip name="Budi" onAdd={onAdd} onForget={noop} />)
    fireEvent.click(getByRole('button', { name: 'Budi' }))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('calls onForget when the ✕ is tapped, without also calling onAdd', () => {
    const onAdd = vi.fn()
    const onForget = vi.fn()
    const { getByRole } = render(<NameChip name="Budi" onAdd={onAdd} onForget={onForget} />)
    fireEvent.click(getByRole('button', { name: /forget budi/i }))
    expect(onForget).toHaveBeenCalledOnce()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<NameChip name="Budi" onAdd={noop} onForget={noop} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
