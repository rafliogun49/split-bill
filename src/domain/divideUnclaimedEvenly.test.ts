import { describe, expect, it } from 'vitest'
import { divideUnclaimedEvenly } from './divideUnclaimedEvenly.ts'
import type { Bill, Diner, LineItem } from './types.ts'

const idr = { code: 'IDR' }

function diner(id: string, name = id): Diner {
  return { id, name, joinIndex: 0 }
}

function lineItem(id: string, amount: number, shares: Record<string, number> = {}): LineItem {
  return { id, label: id, amount, quantity: 1, shares }
}

function bill(overrides: Partial<Bill>): Bill {
  return { id: 'bill-1', currency: idr, diners: [], lineItems: [], adjustments: [], ...overrides }
}

describe('divideUnclaimedEvenly', () => {
  it('gives every unclaimed Line Item one Share per Diner', () => {
    const a = diner('a')
    const b = diner('b')
    const next = divideUnclaimedEvenly(bill({ diners: [a, b], lineItems: [lineItem('pizza', 18000)] }))
    expect(next.lineItems[0]!.shares).toEqual({ a: 1, b: 1 })
  })

  it('leaves an already-claimed Line Item untouched', () => {
    const a = diner('a')
    const b = diner('b')
    const claimed = lineItem('salad', 12000, { a: 2 })
    const next = divideUnclaimedEvenly(bill({ diners: [a, b], lineItems: [claimed, lineItem('pizza', 18000)] }))
    expect(next.lineItems.find((i) => i.id === 'salad')!.shares).toEqual({ a: 2 })
    expect(next.lineItems.find((i) => i.id === 'pizza')!.shares).toEqual({ a: 1, b: 1 })
  })

  it('is a no-op when every Line Item is already claimed', () => {
    const a = diner('a')
    const original = bill({ diners: [a], lineItems: [lineItem('pizza', 18000, { a: 1 })] })
    expect(divideUnclaimedEvenly(original)).toBe(original)
  })

  it('is a no-op when there are no Diners to divide between', () => {
    const original = bill({ diners: [], lineItems: [lineItem('pizza', 18000)] })
    expect(divideUnclaimedEvenly(original)).toBe(original)
  })
})
