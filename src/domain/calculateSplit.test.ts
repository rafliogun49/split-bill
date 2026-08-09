import { describe, expect, it } from 'vitest'
import { calculateSplit } from './calculateSplit.ts'
import type { Adjustment, Bill, Diner, LineItem } from './types.ts'

const sgd = { code: 'SGD' }

function diner(id: string, name = id): Diner {
  return { id, name }
}

function lineItem(id: string, amount: number, shares: Record<string, number> = {}): LineItem {
  return { id, label: id, amount, quantity: 1, shares }
}

function bill(overrides: Partial<Bill>): Bill {
  return {
    currency: sgd,
    diners: [],
    lineItems: [],
    adjustments: [],
    ...overrides,
  }
}

describe('calculateSplit', () => {
  it('divides a Line Item equally between Diners with one Share each', () => {
    const a = diner('a')
    const b = diner('b')
    const split = calculateSplit(
      bill({ diners: [a, b], lineItems: [lineItem('noodles', 2000, { a: 1, b: 1 })] }),
    )

    expect(split.diners.find((d) => d.dinerId === 'a')?.total).toBe(1000)
    expect(split.diners.find((d) => d.dinerId === 'b')?.total).toBe(1000)
    expect(split.subtotal).toBe(2000)
    expect(split.total).toBe(2000)
    expect(split.isComplete).toBe(true)
  })

  it('weights a Line Item by each Diner Share count', () => {
    const a = diner('a')
    const b = diner('b')
    const split = calculateSplit(
      bill({ diners: [a, b], lineItems: [lineItem('rice', 3000, { a: 2, b: 1 })] }),
    )

    expect(split.diners.find((d) => d.dinerId === 'a')?.total).toBe(2000)
    expect(split.diners.find((d) => d.dinerId === 'b')?.total).toBe(1000)
  })

  it('only charges a Diner for Line Items they Share', () => {
    const a = diner('a')
    const b = diner('b')
    const split = calculateSplit(
      bill({
        diners: [a, b],
        lineItems: [lineItem('coffee', 500, { a: 1 }), lineItem('tea', 400, { b: 1 })],
      }),
    )

    expect(split.diners.find((d) => d.dinerId === 'a')?.subtotal).toBe(500)
    expect(split.diners.find((d) => d.dinerId === 'b')?.subtotal).toBe(400)
  })

  it('resolves a division that cannot come out evenly by largest remainder, stable by Diner order', () => {
    const a = diner('a')
    const b = diner('b')
    const c = diner('c')
    const split = calculateSplit(
      bill({ diners: [a, b, c], lineItems: [lineItem('bun', 10, { a: 1, b: 1, c: 1 })] }),
    )

    const totals = split.diners.map((d) => d.total)
    expect(totals.reduce((sum, t) => sum + t, 0)).toBe(10)
    expect(totals).toEqual([4, 3, 3])
  })

  it('applies a fixed and a rate Adjustment together, allocated pro-rata by Subtotal', () => {
    const a = diner('a')
    const b = diner('b')
    const adjustments: Adjustment[] = [
      { kind: 'fixed', label: 'Delivery', amount: 500 },
      { kind: 'rate', label: 'GST', rateBps: 900 },
    ]
    const split = calculateSplit(
      bill({
        diners: [a, b],
        lineItems: [lineItem('meal', 10000, { a: 3, b: 1 })],
        adjustments,
      }),
    )

    // subtotal 10000 -> +500 delivery -> 10500 -> +9% GST (945, half up) -> 11445
    expect(split.adjustments).toEqual([
      { label: 'Delivery', amount: 500 },
      { label: 'GST', amount: 945 },
    ])
    expect(split.adjustmentsTotal).toBe(1445)
    expect(split.total).toBe(11445)
    const totalOfDiners = split.diners.reduce((sum, d) => sum + d.total, 0)
    expect(totalOfDiners).toBe(split.total)
  })

  it('compounds a rate Adjustment on top of an earlier one, in list order (ADR-0005)', () => {
    const a = diner('a')
    const adjustments: Adjustment[] = [
      { kind: 'rate', label: 'Service', rateBps: 500 },
      { kind: 'rate', label: 'Tax', rateBps: 1100 },
    ]
    const split = calculateSplit(
      bill({ diners: [a], lineItems: [lineItem('meal', 200000, { a: 1 })], adjustments }),
    )

    expect(split.adjustments).toEqual([
      { label: 'Service', amount: 10000 },
      { label: 'Tax', amount: 23100 },
    ])
    expect(split.total).toBe(233100)
  })

  it('spreads a negative Adjustment (discount) by the same pro-rata rule', () => {
    const a = diner('a')
    const b = diner('b')
    const adjustments: Adjustment[] = [{ kind: 'fixed', label: 'Discount', amount: -1000 }]
    const split = calculateSplit(
      bill({
        diners: [a, b],
        lineItems: [lineItem('meal', 3000, { a: 1, b: 1 })],
        adjustments,
      }),
    )

    expect(split.total).toBe(2000)
    const totalOfDiners = split.diners.reduce((sum, d) => sum + d.total, 0)
    expect(totalOfDiners).toBe(2000)
    for (const d of split.diners) {
      expect(d.total).toBeGreaterThanOrEqual(0)
    }
  })

  it('gives everything to the sole Diner on a Bill', () => {
    const a = diner('a')
    const split = calculateSplit(
      bill({
        diners: [a],
        lineItems: [lineItem('meal', 4321, { a: 1 })],
        adjustments: [{ kind: 'rate', label: 'Tax', rateBps: 700 }],
      }),
    )

    expect(split.diners).toHaveLength(1)
    expect(split.diners[0]?.total).toBe(split.total)
  })

  it('still computes real Bill-level totals with no Diners', () => {
    const split = calculateSplit(
      bill({
        diners: [],
        lineItems: [lineItem('meal', 1000)],
        adjustments: [{ kind: 'fixed', label: 'Fee', amount: 100 }],
      }),
    )

    expect(split.diners).toEqual([])
    expect(split.subtotal).toBe(1000)
    expect(split.total).toBe(1100)
    expect(split.isComplete).toBe(false)
  })

  it('reports a Line Item with no Shares as unassigned and the Split as incomplete', () => {
    const a = diner('a')
    const split = calculateSplit(
      bill({
        diners: [a],
        lineItems: [lineItem('meal', 1000, { a: 1 }), lineItem('drink', 500, {})],
      }),
    )

    expect(split.unassignedLineItemIds).toEqual(['drink'])
    expect(split.isComplete).toBe(false)
    // Totals are still real even though incomplete.
    expect(split.diners[0]?.total).toBe(1000)
    expect(split.subtotal).toBe(1500)
  })

  it('treats Shares referencing a removed Diner as unassigned', () => {
    const a = diner('a')
    // 'ghost' tagged this item but is no longer in bill.diners.
    const split = calculateSplit(
      bill({ diners: [a], lineItems: [lineItem('meal', 1000, { ghost: 1 })] }),
    )

    expect(split.unassignedLineItemIds).toEqual(['meal'])
    expect(split.isComplete).toBe(false)
    expect(split.diners[0]?.total).toBe(0)
  })

  it('ignores a removed Diner Share but still splits the rest of that Line Item among current Diners', () => {
    const a = diner('a')
    const b = diner('b')
    const split = calculateSplit(
      bill({ diners: [a, b], lineItems: [lineItem('meal', 1000, { a: 1, b: 1, ghost: 5 })] }),
    )

    expect(split.unassignedLineItemIds).toEqual([])
    expect(split.diners.find((d) => d.dinerId === 'a')?.total).toBe(500)
    expect(split.diners.find((d) => d.dinerId === 'b')?.total).toBe(500)
  })

  it('formats currency-affecting fields as plain integers, never floats', () => {
    const a = diner('a')
    const split = calculateSplit(
      bill({ diners: [a], lineItems: [lineItem('meal', 999, { a: 1 })] }),
    )

    expect(Number.isInteger(split.diners[0]?.total)).toBe(true)
    expect(Number.isInteger(split.subtotal)).toBe(true)
    expect(Number.isInteger(split.total)).toBe(true)
  })
})
