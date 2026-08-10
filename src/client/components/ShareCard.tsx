import { forwardRef } from 'react'
import type { Bill, Split } from '../../domain'
import { formatMoney } from '../../domain'
import { copy } from '../copy'
import { dinerFillClass } from '../dinerFill'
import { formatDate } from '../format'

export interface ShareCardProps {
  bill: Bill
  split: Split
  locale: string
}

/** The one non-responsive surface in the app (DESIGN.md screen 11) — an inline pixel width, never a Tailwind breakpoint. */
export const SHARE_CARD_WIDTH = 480

function lineItemLabel(bill: Bill, lineItemId: string): string {
  const item = bill.lineItems.find((i) => i.id === lineItemId)
  return item?.label.trim() || copy.billEditor.lineItemFallbackName
}

// DESIGN.md §8 ShareCard / screen 11: the node rendered to PNG, so it carries
// no button or anchor and no app chrome — only the content a recipient needs
// to check their own number without asking the Payer. Structure mirrors
// buildShareText so the two never drift: Place/Date, what the Payer is
// owed, one card per Diner in their allocated colour, then who to pay and
// the Bill total at the foot.
//
// forwardRef so the PNG-capture ref (SummaryScreen) attaches directly to
// this root element rather than to an unsized wrapper div around it — the
// wrapper had no intrinsic width, so it stretched to fill its flex parent
// and left this card sitting at its start edge instead of centred, and
// html-to-image rasterised the wrapper's full (empty) width instead of the
// card's own 480px.
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { bill, split, locale },
  ref,
) {
  const payer = bill.diners.find((d) => d.id === bill.payerId)
  const payerSplit = payer ? split.diners.find((d) => d.dinerId === payer.id) : undefined

  return (
    <div
      ref={ref}
      style={{ width: SHARE_CARD_WIDTH }}
      className="mx-auto flex flex-col gap-6 border border-pure-black bg-surface-container-lowest p-6 shadow-lg"
    >
      {(bill.place || bill.date) && (
        <div className="flex flex-col gap-1 border-b border-pure-black pb-4">
          {bill.place && <p className="text-headline-sm uppercase text-on-surface">{bill.place}</p>}
          {bill.date && <p className="text-label-sm uppercase text-on-surface-variant">{formatDate(bill.date, locale)}</p>}
        </div>
      )}

      <div>
        <p className="text-label-sm uppercase text-on-surface-variant">
          {payer ? `${payer.name} ${copy.summary.isOwed}` : copy.summary.billTotal}
        </p>
        <p className="text-amount-lg text-on-surface">
          {formatMoney(payer && payerSplit ? split.total - payerSplit.total : split.total, bill.currency, locale)}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {bill.diners.map((diner) => {
          const dinerSplit = split.diners.find((d) => d.dinerId === diner.id)
          if (!dinerSplit) return null
          const isPayer = diner.id === bill.payerId

          return (
            <div
              key={diner.id}
              className={`flex flex-col gap-2 border border-pure-black p-4 ${dinerFillClass(diner.joinIndex)}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-label-bold uppercase text-on-surface">
                  {diner.name}
                  {isPayer ? ` — ${copy.dinerSetup.payerBadge}` : ''}
                </span>
                <span className="text-amount-md text-on-surface">{formatMoney(dinerSplit.total, bill.currency, locale)}</span>
              </div>
              <div className="flex flex-col gap-1">
                {dinerSplit.lineItems.map((item) => (
                  <div key={item.lineItemId} className="flex items-baseline justify-between gap-3 text-body-md text-on-surface">
                    <span>{lineItemLabel(bill, item.lineItemId)}</span>
                    <span className="text-amount-sm">{formatMoney(item.amount, bill.currency, locale)}</span>
                  </div>
                ))}
                {dinerSplit.adjustments.map((adjustment, index) => (
                  <div
                    key={index}
                    className="flex items-baseline justify-between gap-3 text-body-md text-on-surface-variant"
                  >
                    <span>{adjustment.label.trim() || copy.billEditor.adjustmentFallbackName}</span>
                    <span className="text-amount-sm">{formatMoney(adjustment.amount, bill.currency, locale)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-pure-black pt-4">
        {payer && <p className="text-label-bold uppercase text-on-surface">{`${copy.summary.payLine} ${payer.name}`}</p>}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-label-sm uppercase text-on-surface-variant">{copy.summary.billTotal}</span>
          <span className="text-amount-sm text-on-surface">{formatMoney(split.total, bill.currency, locale)}</span>
        </div>
      </div>
    </div>
  )
})
