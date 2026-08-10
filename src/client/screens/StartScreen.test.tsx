import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { StartScreen } from './StartScreen'

function renderScreen(hasActiveBill: boolean) {
  const handlers = {
    onPhotograph: vi.fn(),
    onEnterManually: vi.fn(),
    onResume: vi.fn(),
    onNewBill: vi.fn(),
  }
  const utils = render(<StartScreen hasActiveBill={hasActiveBill} {...handlers} />)
  return { ...utils, ...handlers }
}

describe('StartScreen', () => {
  describe('with no Bill in progress', () => {
    it('presents scanning the receipt ahead of manual entry', () => {
      const { getAllByRole } = renderScreen(false)
      const buttons = getAllByRole('button')
      expect(buttons[0]).toHaveTextContent('Scan receipt')
      expect(buttons[1]).toHaveTextContent('Enter manually')
    })

    it('says Scan, never Photograph, anywhere on the landing page', () => {
      const { container } = renderScreen(false)
      expect(container).not.toHaveTextContent(/photograph/i)
    })

    it('shows the promise that the photo is never stored', () => {
      const { getByText } = renderScreen(false)
      expect(getByText('Your photo is never stored.')).toBeInTheDocument()
    })

    it('calls onPhotograph and onEnterManually', () => {
      const { getByRole, onPhotograph, onEnterManually } = renderScreen(false)
      fireEvent.click(getByRole('button', { name: 'Scan receipt' }))
      fireEvent.click(getByRole('button', { name: 'Enter manually' }))
      expect(onPhotograph).toHaveBeenCalledOnce()
      expect(onEnterManually).toHaveBeenCalledOnce()
    })

    it('presents How it works and Features as a landing page for a first-time visitor', () => {
      const { getByRole, getByText } = renderScreen(false)
      expect(getByRole('heading', { name: 'How it works' })).toBeInTheDocument()
      expect(getByRole('heading', { name: 'Why Split Bill' })).toBeInTheDocument()
      expect(getByText('Scan the receipt')).toBeInTheDocument()
      expect(getByText('Tag who had what')).toBeInTheDocument()
      expect(getByText('Nothing stored')).toBeInTheDocument()
    })

    it('colours the three How-it-works number badges diner-1/2/3', () => {
      const { container } = renderScreen(false)
      expect(container.querySelector('.bg-diner-1')).toBeInTheDocument()
      expect(container.querySelector('.bg-diner-2')).toBeInTheDocument()
      expect(container.querySelector('.bg-diner-3')).toBeInTheDocument()
    })

    it('carries the landing-only ornament (folded corner, zigzag divider, rotated receipt card)', () => {
      const { container } = renderScreen(false)
      // Folded corner: border-triangle trick on the hero card.
      expect(container.querySelector('.border-l-transparent')).toBeInTheDocument()
      // Zigzag divider: a serrated clip-path polygon between hero and How it works.
      expect(container.querySelector('[style*="polygon("]')).toBeInTheDocument()
      // Rotated "sticky note" receipt-preview card, desktop only.
      expect(container.querySelector('.-rotate-2')).toBeInTheDocument()
    })
  })

  describe('with a Bill in progress', () => {
    it('offers Resume above New Bill', () => {
      const { getAllByRole } = renderScreen(true)
      const buttons = getAllByRole('button')
      expect(buttons[0]).toHaveTextContent('Resume')
      expect(buttons[1]).toHaveTextContent('New Bill')
    })

    it('drops the landing content once a Bill exists', () => {
      const { queryByRole } = renderScreen(true)
      expect(queryByRole('heading', { name: 'How it works' })).not.toBeInTheDocument()
      expect(queryByRole('heading', { name: 'Why Split Bill' })).not.toBeInTheDocument()
    })

    it('calls onResume directly', () => {
      const { getByRole, onResume } = renderScreen(true)
      fireEvent.click(getByRole('button', { name: 'Resume' }))
      expect(onResume).toHaveBeenCalledOnce()
    })

    it('warns before discarding instead of calling onNewBill immediately', () => {
      const { getByRole, getByText, onNewBill } = renderScreen(true)
      fireEvent.click(getByRole('button', { name: 'New Bill' }))
      expect(onNewBill).not.toHaveBeenCalled()
      expect(getByText(/discards the current/i)).toBeInTheDocument()
    })

    it('calls onNewBill only after the warning is confirmed', () => {
      const { getByRole, onNewBill } = renderScreen(true)
      fireEvent.click(getByRole('button', { name: 'New Bill' }))
      fireEvent.click(getByRole('button', { name: 'Discard and start new' }))
      expect(onNewBill).toHaveBeenCalledOnce()
    })

    it('cancelling the warning returns to Resume / New Bill without discarding', () => {
      const { getByRole, queryByText, onNewBill } = renderScreen(true)
      fireEvent.click(getByRole('button', { name: 'New Bill' }))
      fireEvent.click(getByRole('button', { name: 'Cancel' }))
      expect(onNewBill).not.toHaveBeenCalled()
      expect(getByRole('button', { name: 'Resume' })).toBeInTheDocument()
      expect(queryByText(/discards the current/i)).not.toBeInTheDocument()
    })

    it('carries none of the landing page ornament or motion', () => {
      const { container } = renderScreen(true)
      expect(container.querySelector('.border-l-transparent')).not.toBeInTheDocument()
      expect(container.querySelector('[style*="polygon("]')).not.toBeInTheDocument()
      expect(container.querySelector('.-rotate-2')).not.toBeInTheDocument()
      expect(container.querySelector('[class*="animate-"]')).not.toBeInTheDocument()
    })
  })

  it('has no WCAG AAA violations in either state', async () => {
    const { container: withoutBill } = renderScreen(false)
    expect(await axe(withoutBill)).toHaveNoViolations()

    const { container: withBill } = renderScreen(true)
    expect(await axe(withBill)).toHaveNoViolations()
  })
})
