import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders the wordmark', () => {
    const { getByText } = render(<TopBar />)
    expect(getByText('Split Bill')).toBeInTheDocument()
  })

  it('renders no navigation links', () => {
    const { container } = render(<TopBar onExit={() => {}} />)
    expect(container.querySelectorAll('nav, a')).toHaveLength(0)
  })

  it('omits the exit action when there is nothing to exit', () => {
    const { queryByRole } = render(<TopBar />)
    expect(queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onExit when the exit action is present and pressed', () => {
    const onExit = vi.fn()
    const { getByRole } = render(<TopBar onExit={onExit} />)
    fireEvent.click(getByRole('button', { name: 'Exit' }))
    expect(onExit).toHaveBeenCalledOnce()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<TopBar onExit={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
