import type { Adjustment, Bill, LineItem } from '../../domain'
import type { ParsedReceipt } from './parseReceiptClient'

// ADR-0004: a parsed Receipt opens the same editor manual entry opens, just
// populated — so this produces exactly a Bill, with no privileged shape of
// its own. Diners and payerId start empty; the Receipt has no opinion on
// who's at the table.
export function parsedReceiptToBill(receipt: ParsedReceipt): Bill {
  const lineItems: LineItem[] = receipt.lineItems.map((item) => ({
    id: crypto.randomUUID(),
    label: item.name,
    amount: item.total,
    quantity: item.quantity,
    shares: {},
  }))

  const adjustments: Adjustment[] = receipt.adjustments.map((adjustment) => ({
    kind: 'fixed',
    label: adjustment.label,
    amount: adjustment.amount,
  }))

  return {
    id: crypto.randomUUID(),
    currency: { code: receipt.currency.toUpperCase() },
    place: receipt.placeName,
    date: receipt.date,
    diners: [],
    lineItems,
    adjustments,
  }
}
