import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { ParseFailureReason } from '../ai/parseReceiptClient'
import { ParseFailureScreen } from './ParseFailureScreen'

const reasons: ParseFailureReason[] = ['offline', 'rate_limited', 'parse_failed']

describe('ParseFailureScreen', () => {
  it.each(reasons)('renders %s with the shared layout: an alert Banner and both actions', (reason) => {
    const { getByRole } = render(<ParseFailureScreen reason={reason} onRetry={vi.fn()} onEnterManually={vi.fn()} />)
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Enter Bill by hand' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('gives every reason distinct wording', () => {
    const headings = reasons.map((reason) => {
      const { getByRole, unmount } = render(<ParseFailureScreen reason={reason} onRetry={vi.fn()} onEnterManually={vi.fn()} />)
      const heading = getByRole('alert').textContent
      unmount()
      return heading
    })
    expect(new Set(headings).size).toBe(reasons.length)
  })

  it('the primary action (Enter Bill by hand) leads into the empty editor, never a dead end', () => {
    const onEnterManually = vi.fn()
    const { getByRole } = render(<ParseFailureScreen reason="parse_failed" onRetry={vi.fn()} onEnterManually={onEnterManually} />)
    fireEvent.click(getByRole('button', { name: 'Enter Bill by hand' }))
    expect(onEnterManually).toHaveBeenCalledOnce()
  })

  it('Try again calls onRetry', () => {
    const onRetry = vi.fn()
    const { getByRole } = render(<ParseFailureScreen reason="parse_failed" onRetry={onRetry} onEnterManually={vi.fn()} />)
    fireEvent.click(getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has no WCAG AAA violations for any failure reason', async () => {
    for (const reason of reasons) {
      const { container, unmount } = render(<ParseFailureScreen reason={reason} onRetry={vi.fn()} onEnterManually={vi.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
      unmount()
    }
  })
})
