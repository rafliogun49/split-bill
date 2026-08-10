import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders the wordmark', () => {
    const { getByText } = render(<TopBar onHistory={() => {}} />)
    expect(getByText('Split Bill')).toBeInTheDocument()
  })

  it('renders no navigation links', () => {
    const { container } = render(<TopBar onExit={() => {}} onHistory={() => {}} />)
    expect(container.querySelectorAll('nav, a')).toHaveLength(0)
  })

  it('omits the exit action when there is nothing to exit', () => {
    const { queryByRole } = render(<TopBar onHistory={() => {}} />)
    expect(queryByRole('button', { name: 'Exit' })).not.toBeInTheDocument()
  })

  it('always renders the History action, even with nothing to exit', () => {
    const { getByRole } = render(<TopBar onHistory={() => {}} />)
    expect(getByRole('button', { name: 'History' })).toBeInTheDocument()
  })

  it('calls onExit when the exit action is present and pressed', () => {
    const onExit = vi.fn()
    const { getByRole } = render(<TopBar onExit={onExit} onHistory={() => {}} />)
    fireEvent.click(getByRole('button', { name: 'Exit' }))
    expect(onExit).toHaveBeenCalledOnce()
  })

  it('calls onHistory when the History action is pressed', () => {
    const onHistory = vi.fn()
    const { getByRole } = render(<TopBar onExit={() => {}} onHistory={onHistory} />)
    fireEvent.click(getByRole('button', { name: 'History' }))
    expect(onHistory).toHaveBeenCalledOnce()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<TopBar onExit={() => {}} onHistory={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
