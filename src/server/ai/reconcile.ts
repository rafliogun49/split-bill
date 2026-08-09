import type { ParsedAdjustment, ParsedLineItem, Reconciliation } from './types'

// The self-check from issue #10: catches a single misread row, though not a
// misread that scales every figure consistently — ADR-0006 closes that gap
// at the schema level instead. Pure and side-effect free, so it's tested
// directly rather than only through the HTTP boundary.
export function reconcile(bill: {
  lineItems: ParsedLineItem[]
  adjustments: ParsedAdjustment[]
  printedTotal?: number
}): Reconciliation {
  const computedTotal =
    bill.lineItems.reduce((sum, item) => sum + item.total, 0) +
    bill.adjustments.reduce((sum, adjustment) => sum + adjustment.amount, 0)

  if (bill.printedTotal === undefined) {
    return { status: 'no-printed-total', computedTotal }
  }

  if (computedTotal === bill.printedTotal) {
    return { status: 'match', computedTotal }
  }

  return {
    status: 'mismatch',
    computedTotal,
    printedTotal: bill.printedTotal,
    difference: computedTotal - bill.printedTotal,
  }
}
