import { calculateSplit } from './calculateSplit.ts'
import type { Bill } from './types.ts'

/**
 * The one-tap "split the rest between everyone" action (CONTEXT.md story
 * 42): every currently-unclaimed Line Item gets one Share for each Diner.
 * Already-claimed Line Items are untouched. Returns the same Bill reference
 * when there's nothing to divide, so callers can skip a redundant update.
 */
export function divideUnclaimedEvenly(bill: Bill): Bill {
  const { unassignedLineItemIds } = calculateSplit(bill)
  if (unassignedLineItemIds.length === 0 || bill.diners.length === 0) return bill

  const unassigned = new Set(unassignedLineItemIds)
  const oneShareEach = Object.fromEntries(bill.diners.map((d) => [d.id, 1]))
  return {
    ...bill,
    lineItems: bill.lineItems.map((item) => (unassigned.has(item.id) ? { ...item, shares: oneShareEach } : item)),
  }
}
