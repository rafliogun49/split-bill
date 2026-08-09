import type { Bill, Split } from '../../domain'
import { formatMoney } from '../../domain'
import { copy } from '../copy'
import { formatDate } from '../format'

function lineItemLabel(bill: Bill, lineItemId: string): string {
  const item = bill.lineItems.find((i) => i.id === lineItemId)
  return item?.label.trim() || copy.billEditor.lineItemFallbackName
}

// The plain-text twin of ShareCard — same content, same order (Payer-owed
// lead, one block per Diner, who-to-pay and Bill total at the foot), so a
// share-sheet recipient without the PNG still gets the identical numbers.
export function buildShareText(bill: Bill, split: Split, locale: string): string {
  const lines: string[] = []

  if (bill.place || bill.date) {
    lines.push([bill.place, bill.date ? formatDate(bill.date, locale) : undefined].filter(Boolean).join(' · '), '')
  }

  const payer = bill.diners.find((d) => d.id === bill.payerId)
  const payerSplit = payer ? split.diners.find((d) => d.dinerId === payer.id) : undefined
  if (payer && payerSplit) {
    lines.push(
      `${payer.name} ${copy.summary.isOwed} ${formatMoney(split.total - payerSplit.total, bill.currency, locale)}`,
      '',
    )
  }

  for (const diner of bill.diners) {
    const dinerSplit = split.diners.find((d) => d.dinerId === diner.id)
    if (!dinerSplit) continue
    const name = diner.id === bill.payerId ? `${diner.name} — ${copy.dinerSetup.payerBadge}` : diner.name
    lines.push(`${name} — ${formatMoney(dinerSplit.total, bill.currency, locale)}`)
    for (const item of dinerSplit.lineItems) {
      lines.push(`  ${lineItemLabel(bill, item.lineItemId)}  ${formatMoney(item.amount, bill.currency, locale)}`)
    }
    for (const adjustment of dinerSplit.adjustments) {
      lines.push(
        `  ${adjustment.label.trim() || copy.billEditor.adjustmentFallbackName}  ${formatMoney(adjustment.amount, bill.currency, locale)}`,
      )
    }
    lines.push('')
  }

  if (payer) lines.push(`${copy.summary.payLine} ${payer.name}`)
  lines.push(`${copy.summary.billTotal} ${formatMoney(split.total, bill.currency, locale)}`)

  return lines.join('\n').trim()
}
