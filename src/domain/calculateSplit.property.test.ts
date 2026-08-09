import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { calculateSplit } from './calculateSplit.ts'
import type { Adjustment, Bill, Diner, LineItem } from './types.ts'

const dinerIdArb = fc.integer({ min: 0, max: 5 }).map((n) => `diner-${n}`)

const lineItemArb = fc
  .record({
    id: fc.uuid(),
    amount: fc.integer({ min: 0, max: 100_000 }),
    quantity: fc.integer({ min: 1, max: 10 }),
    shareEntries: fc.array(fc.tuple(dinerIdArb, fc.integer({ min: 1, max: 5 })), {
      minLength: 1,
      maxLength: 5,
    }),
  })
  .map(
    ({ id, amount, quantity, shareEntries }): LineItem => ({
      id,
      label: id,
      amount,
      quantity,
      shares: Object.fromEntries(shareEntries),
    }),
  )

const adjustmentArb: fc.Arbitrary<Adjustment> = fc.oneof(
  fc.record({
    kind: fc.constant('fixed' as const),
    label: fc.uuid(),
    amount: fc.integer({ min: -50_000, max: 50_000 }),
  }),
  fc.record({
    kind: fc.constant('rate' as const),
    label: fc.uuid(),
    rateBps: fc.integer({ min: -2000, max: 2000 }),
  }),
)

// Diners and Line Items are generated independently and then intersected
// against the same pool of ids, so a Line Item's Shares sometimes land on a
// Diner the Bill doesn't have — exactly the "Shares outlive the Diner"
// scenario the domain has to tolerate, exercised here at random.
const billArb: fc.Arbitrary<Bill> = fc
  .record({
    dinerIds: fc.uniqueArray(dinerIdArb, { minLength: 1, maxLength: 6 }),
    lineItems: fc.array(lineItemArb, { minLength: 0, maxLength: 6 }),
    adjustments: fc.array(adjustmentArb, { minLength: 0, maxLength: 4 }),
  })
  .map(({ dinerIds, lineItems, adjustments }): Bill => {
    const diners: Diner[] = dinerIds.map((id, index) => ({ id, name: id, joinIndex: index }))
    return { currency: { code: 'SGD' }, diners, lineItems, adjustments }
  })

describe('calculateSplit property: the sum invariant (ADR-0003)', () => {
  it("sums every Diner's Total to the Bill Total exactly when the Split is complete", () => {
    fc.assert(
      fc.property(billArb, (bill) => {
        const split = calculateSplit(bill)
        fc.pre(split.isComplete)

        const sumOfDinerTotals = split.diners.reduce((sum, d) => sum + d.total, 0)
        expect(sumOfDinerTotals).toBe(split.total)
      }),
    )
  })

  it("bounds every Diner's Subtotal within one minor unit of their exact proportional share", () => {
    fc.assert(
      fc.property(billArb, (bill) => {
        const split = calculateSplit(bill)
        fc.pre(split.isComplete)

        for (const item of bill.lineItems) {
          const totalShares = bill.diners.reduce((sum, d) => sum + (item.shares[d.id] ?? 0), 0)
          if (totalShares === 0) continue

          for (const diner of bill.diners) {
            const shares = item.shares[diner.id] ?? 0
            if (shares === 0) continue

            const exact = (item.amount * shares) / totalShares
            const allocated =
              split.diners
                .find((d) => d.dinerId === diner.id)
                ?.lineItems.find((li) => li.lineItemId === item.id)?.amount ?? 0

            expect(Math.abs(allocated - exact)).toBeLessThanOrEqual(1)
          }
        }
      }),
    )
  })
})
