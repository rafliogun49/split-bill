import { beforeEach, describe, expect, it } from 'vitest'
import type { Bill } from '../../domain'
import { archiveBill, getBillHistoryEntry, loadBillHistory } from './billHistory'

function makeBill(overrides: Partial<Bill> = {}): Bill {
  return {
    id: 'bill-1',
    currency: { code: 'IDR' },
    place: 'Warung Tekko',
    date: '2026-08-01',
    diners: [{ id: 'd1', name: 'Rafli', joinIndex: 0 }],
    lineItems: [{ id: 'li1', label: 'Nasi Goreng', amount: 90_000, quantity: 1, shares: { d1: 1 } }],
    adjustments: [],
    ...overrides,
  }
}

describe('billHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing has been archived', () => {
    expect(loadBillHistory()).toEqual([])
  })

  it('archives a Bill with enough detail to render a History row', () => {
    archiveBill(makeBill())
    const [entry] = loadBillHistory()
    expect(entry.id).toBe('bill-1')
    expect(entry.place).toBe('Warung Tekko')
    expect(entry.date).toBe('2026-08-01')
    expect(entry.total).toBe(90_000)
    expect(entry.currencyCode).toBe('IDR')
    expect(entry.archivedAt).toEqual(expect.any(String))
    expect(entry.bill).toEqual(makeBill())
  })

  it('lists archived Bills newest first', () => {
    archiveBill(makeBill({ id: 'bill-1', place: 'First' }))
    archiveBill(makeBill({ id: 'bill-2', place: 'Second' }))
    const entries = loadBillHistory()
    expect(entries.map((e) => e.place)).toEqual(['Second', 'First'])
  })

  it('re-archiving the same Bill id updates the entry in place instead of duplicating it', () => {
    archiveBill(makeBill({ id: 'bill-1', place: 'Original' }))
    archiveBill(makeBill({ id: 'bill-1', place: 'Updated' }))
    const entries = loadBillHistory()
    expect(entries).toHaveLength(1)
    expect(entries[0].place).toBe('Updated')
  })

  it('moves a re-archived Bill back to the front of the list', () => {
    archiveBill(makeBill({ id: 'bill-1' }))
    archiveBill(makeBill({ id: 'bill-2' }))
    archiveBill(makeBill({ id: 'bill-1' }))
    expect(loadBillHistory().map((e) => e.id)).toEqual(['bill-1', 'bill-2'])
  })

  it('finds a single entry by id', () => {
    archiveBill(makeBill({ id: 'bill-1' }))
    archiveBill(makeBill({ id: 'bill-2' }))
    expect(getBillHistoryEntry('bill-2')?.id).toBe('bill-2')
  })

  it('returns undefined for an id that was never archived', () => {
    expect(getBillHistoryEntry('missing')).toBeUndefined()
  })

  it('discards data from an unrecognised version instead of crashing', () => {
    localStorage.setItem('split-bill:bill-history', JSON.stringify({ version: 999, entries: [{ id: 'x' }] }))
    expect(loadBillHistory()).toEqual([])
  })

  it('discards corrupt JSON instead of throwing', () => {
    localStorage.setItem('split-bill:bill-history', '{not json')
    expect(() => loadBillHistory()).not.toThrow()
    expect(loadBillHistory()).toEqual([])
  })

  it('never touches the active-Bill storage key', () => {
    archiveBill(makeBill())
    expect(localStorage.getItem('split-bill:bill')).toBeNull()
  })
})
