import { beforeEach, describe, expect, it } from 'vitest'
import type { Bill } from '../../domain'
import { clearBill, loadBill, saveBill } from './billStorage'

const bill: Bill = {
  id: 'bill-1',
  currency: { code: 'IDR' },
  place: 'Warung Tekko',
  diners: [{ id: 'd1', name: 'Rafli', joinIndex: 0 }],
  lineItems: [{ id: 'li1', label: 'Nasi Goreng', amount: 90_000, quantity: 1, shares: { d1: 1 } }],
  adjustments: [],
}

describe('billStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is stored', () => {
    expect(loadBill()).toBeNull()
  })

  it('round-trips a Bill through save and load', () => {
    saveBill(bill)
    expect(loadBill()).toEqual(bill)
  })

  it('discards data from an unrecognised version instead of crashing', () => {
    localStorage.setItem('split-bill:bill', JSON.stringify({ version: 999, bill }))
    expect(loadBill()).toBeNull()
  })

  it('discards corrupt JSON instead of throwing', () => {
    localStorage.setItem('split-bill:bill', '{not json')
    expect(() => loadBill()).not.toThrow()
    expect(loadBill()).toBeNull()
  })

  it('clearBill removes the stored Bill', () => {
    saveBill(bill)
    clearBill()
    expect(loadBill()).toBeNull()
  })
})
