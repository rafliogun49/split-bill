import { describe, expect, it } from 'vitest'
import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { buildShareText } from './shareText'

function bill(overrides: Partial<Bill> = {}): Bill {
  return { id: 'bill-1', currency: { code: 'SGD' }, diners: [], lineItems: [], adjustments: [], ...overrides }
}

describe('buildShareText', () => {
  it('leads with what the Payer is owed, then each Diner, then who to pay and the Bill total', () => {
    const b = bill({
      place: 'Pizza Place',
      date: '2026-08-09',
      payerId: 'a',
      diners: [
        { id: 'a', name: 'Alice', joinIndex: 0 },
        { id: 'b', name: 'Bob', joinIndex: 1 },
      ],
      lineItems: [{ id: '1', label: 'Pizza', amount: 4000, quantity: 1, shares: { a: 1, b: 1 } }],
      adjustments: [{ kind: 'fixed', label: 'Service charge', amount: 800 }],
    })
    const split = calculateSplit(b)
    const text = buildShareText(b, split, 'en-SG')

    expect(text).toContain('Pizza Place')
    expect(text).toContain('9 August 2026')
    expect(text).toContain('Alice is owed $24.00')
    expect(text).toContain('Alice — Payer — $24.00')
    expect(text).toContain('Bob — $24.00')
    expect(text).toContain('Pizza')
    expect(text).toContain('Service charge')
    expect(text).toContain('Pay Alice')
    expect(text).toContain('Bill total $48.00')
    expect(text.indexOf('Alice is owed')).toBeLessThan(text.indexOf('Bob —'))
    expect(text.indexOf('Bob —')).toBeLessThan(text.indexOf('Pay Alice'))
  })

  it('omits Place and Date entirely when both are absent', () => {
    const b = bill({
      payerId: 'a',
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const text = buildShareText(b, calculateSplit(b), 'en-SG')
    expect(text).not.toContain('undefined')
    expect(text.startsWith('Alice is owed')).toBe(true)
  })

  it('falls back to the Bill total, with no "is owed" or "Pay" line, when no Payer is marked', () => {
    const b = bill({
      diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }],
      lineItems: [{ id: '1', label: 'Pizza', amount: 1000, quantity: 1, shares: { a: 1 } }],
    })
    const text = buildShareText(b, calculateSplit(b), 'en-SG')
    expect(text).toContain('Bill total $10.00')
    expect(text).not.toContain('is owed')
    expect(text).not.toContain('Pay ')
  })

  it('never mentions payment status', () => {
    const b = bill({ diners: [{ id: 'a', name: 'Alice', joinIndex: 0 }], lineItems: [] })
    const text = buildShareText(b, calculateSplit(b), 'en-SG')
    expect(text).not.toMatch(/pending|paid|settled/i)
  })
})
