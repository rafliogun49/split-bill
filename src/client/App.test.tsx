import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from '../../test/setup'
import type { Bill } from '../domain'
import { App } from './App'

const bill: Bill = {
  currency: { code: 'IDR' },
  diners: [],
  lineItems: [],
  adjustments: [],
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the wordmark', () => {
    const { getAllByText } = render(<App />)
    expect(getAllByText('Split Bill').length).toBeGreaterThan(0)
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('opens on the Start screen with no Resume offered when nothing is persisted', () => {
    const { queryByRole, getByRole } = render(<App />)
    expect(queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(getByRole('button', { name: 'Photograph receipt' })).toBeInTheDocument()
  })

  it('offers Resume when a Bill was persisted from a previous session', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole } = render(<App />)
    expect(getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('discards the persisted Bill once New Bill is confirmed', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole, queryByRole } = render(<App />)

    fireEvent.click(getByRole('button', { name: 'New Bill' }))
    fireEvent.click(getByRole('button', { name: 'Discard and start new' }))

    expect(queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(localStorage.getItem('split-bill:bill')).toBeNull()
  })

  it('returning from the in-progress placeholder via Exit keeps the Resume offer intact', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 1, bill }))
    const { getByRole } = render(<App />)

    fireEvent.click(getByRole('button', { name: 'Resume' }))
    fireEvent.click(getByRole('button', { name: 'Exit' }))

    expect(getByRole('button', { name: 'Resume' })).toBeInTheDocument()
  })

  it('opens the Bill editor on an empty Bill when entering manually', () => {
    const { getByRole } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Enter manually' }))
    expect(getByRole('button', { name: /add line item/i })).toBeInTheDocument()
  })

  it('resumes directly into the Bill editor with the persisted Line Items', () => {
    localStorage.setItem(
      'split-bill:bill',
      JSON.stringify({
        version: 1,
        bill: { ...bill, lineItems: [{ id: 'a', label: 'Nasi Goreng', amount: 90000, quantity: 1, shares: {} }] },
      }),
    )
    const { getByRole, getByDisplayValue } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Resume' }))
    expect(getByDisplayValue('Nasi Goreng')).toBeInTheDocument()
  })

  it('a Bill typed by hand survives a reload, with the same total', () => {
    const { getByRole, getByLabelText, unmount } = render(<App />)
    fireEvent.click(getByRole('button', { name: 'Enter manually' }))
    fireEvent.click(getByRole('button', { name: /add line item/i }))
    fireEvent.change(getByLabelText('Line item name'), { target: { value: 'Nasi Goreng' } })
    const lineTotal = getByLabelText(/line total/i)
    fireEvent.focus(lineTotal)
    fireEvent.change(lineTotal, { target: { value: '90000' } })
    fireEvent.blur(lineTotal)
    unmount()

    const reloaded = render(<App />)
    fireEvent.click(reloaded.getByRole('button', { name: 'Resume' }))
    expect(reloaded.getByDisplayValue('Nasi Goreng')).toBeInTheDocument()
    expect(reloaded.getAllByText('Rp 90.000').length).toBeGreaterThan(0)
  })
})
