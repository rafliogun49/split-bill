import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import type { Bill } from '../../domain'
import type { BillHistoryEntry } from '../persistence/billHistory'
import { HistoryScreen } from './HistoryScreen'

function makeBill(overrides: Partial<Bill> = {}): Bill {
  return { id: 'bill-1', currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

function makeEntry(overrides: Partial<BillHistoryEntry> = {}): BillHistoryEntry {
  return {
    id: 'bill-1',
    place: 'Warung Tekko',
    date: '2026-08-01',
    total: 90_000,
    currencyCode: 'IDR',
    archivedAt: '2026-08-01T12:00:00.000Z',
    bill: makeBill(),
    ...overrides,
  }
}

describe('HistoryScreen', () => {
  it('shows an empty state explaining the list fills in over time when nothing is archived', () => {
    const { getByText } = render(<HistoryScreen entries={[]} onSelect={vi.fn()} />)
    expect(getByText(/fills in as Bills are finished or discarded/i)).toBeInTheDocument()
  })

  it('lists each archived Bill by Place, Date and Total', () => {
    const { getByText } = render(<HistoryScreen entries={[makeEntry()]} onSelect={vi.fn()} />)
    expect(getByText('Warung Tekko')).toBeInTheDocument()
    expect(getByText('Rp 90.000')).toBeInTheDocument()
    expect(getByText('1 Agustus 2026')).toBeInTheDocument()
  })

  it('shows when each Bill was archived', () => {
    const { getByText } = render(
      <HistoryScreen entries={[makeEntry({ archivedAt: '2026-08-05T09:30:00.000Z' })]} onSelect={vi.fn()} />,
    )
    expect(getByText(/Archived/)).toBeInTheDocument()
  })

  it('falls back to a placeholder name when a Bill has no Place', () => {
    const { getByText } = render(<HistoryScreen entries={[makeEntry({ place: undefined })]} onSelect={vi.fn()} />)
    expect(getByText('Untitled Bill')).toBeInTheDocument()
  })

  it('renders entries in the order given, newest first per the persistence layer', () => {
    const entries = [
      makeEntry({ id: 'b2', place: 'Second' }),
      makeEntry({ id: 'b1', place: 'First' }),
    ]
    const { getAllByRole } = render(<HistoryScreen entries={entries} onSelect={vi.fn()} />)
    const buttons = getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('Second')
    expect(buttons[1]).toHaveTextContent('First')
  })

  it('calls onSelect with the entry id when a row is picked', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(<HistoryScreen entries={[makeEntry({ id: 'bill-42' })]} onSelect={onSelect} />)
    fireEvent.click(getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('bill-42')
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<HistoryScreen entries={[makeEntry()]} onSelect={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
