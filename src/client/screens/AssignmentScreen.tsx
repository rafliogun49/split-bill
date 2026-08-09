import { useState } from 'react'
import type { Bill, DinerId, LineItemId } from '../../domain'
import { calculateSplit, divideUnclaimedEvenly, formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { copy } from '../copy'
import { AssignmentLineItemRow } from '../components/AssignmentLineItemRow'
import { AssignmentPicker } from '../components/AssignmentPicker'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { StickySummaryBar } from '../components/StickySummaryBar'

export interface AssignmentScreenProps {
  bill: Bill
  onBillChange: (next: Bill) => void
  onContinue: () => void
}

// DESIGN.md screen 8: a LineItemRow list in Receipt order (Bill.lineItems'
// own order — the same order the Payer typed them in on screen 5, which
// follows the paper receipt), AssignmentPicker on tap, running Totals in the
// StickySummaryBar. Screen 9's Incomplete Split banner lives on this screen
// too: undismissable, and it blocks the onward action rather than merely
// warning (ADR — sharing a Split quietly missing money is the one mistake
// this app exists to prevent).
export function AssignmentScreen({ bill, onBillChange, onContinue }: AssignmentScreenProps) {
  const [openLineItemId, setOpenLineItemId] = useState<LineItemId | null>(null)

  const split = calculateSplit(bill)
  const locale = localeForCurrency(bill.currency.code)
  const openLineItem = bill.lineItems.find((item) => item.id === openLineItemId) ?? null

  const unclaimedItems = bill.lineItems.filter((item) => split.unassignedLineItemIds.includes(item.id))
  const unclaimedTotal = unclaimedItems.reduce((sum, item) => sum + item.amount, 0)
  const unclaimedNames = unclaimedItems.map((item) => item.label.trim() || copy.billEditor.lineItemFallbackName).join(', ')

  function handleSharesChange(itemId: LineItemId, shares: Record<DinerId, number>) {
    onBillChange({ ...bill, lineItems: bill.lineItems.map((item) => (item.id === itemId ? { ...item, shares } : item)) })
  }

  function handleDivideRemainder() {
    onBillChange(divideUnclaimedEvenly(bill))
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-28 lg:flex-row lg:items-start lg:gap-6 lg:p-6 lg:pb-6">
      <div className="flex flex-1 flex-col gap-6 lg:min-w-0 lg:grow-[7] lg:basis-0">
        {!split.isComplete && (
          <Banner variant="alert">
            <p className="text-label-bold uppercase text-on-surface">{copy.assignment.incompleteSplitHeading}</p>
            <p className="mt-1 text-body-md text-on-surface">
              {unclaimedNames} — {formatMoney(unclaimedTotal, bill.currency, locale)} {copy.assignment.incompleteSplitTrailer}
            </p>
            <div className="mt-3">
              <Button variant="secondary" onClick={handleDivideRemainder}>
                {copy.assignment.divideRemainder}
              </Button>
            </div>
          </Banner>
        )}

        <Card>
          <h2 className="text-headline-sm uppercase text-on-surface">{copy.billEditor.lineItemsHeading}</h2>
          <div className="mt-4 flex flex-col">
            {bill.lineItems.length === 0 && <p className="py-4 text-body-md text-on-surface-variant">{copy.assignment.lineItemsEmpty}</p>}
            {bill.lineItems.map((item) => (
              <AssignmentLineItemRow
                key={item.id}
                item={item}
                currency={bill.currency}
                diners={bill.diners}
                onOpenPicker={() => setOpenLineItemId(item.id)}
              />
            ))}
          </div>
        </Card>

        {bill.adjustments.length > 0 && (
          <Card>
            <h2 className="text-headline-sm uppercase text-on-surface">{copy.billEditor.adjustmentsHeading}</h2>
            <p className="mt-2 text-label-sm text-on-surface-variant">{copy.assignment.adjustmentsUnassignableNote}</p>
            <div className="mt-4 flex flex-col">
              {bill.adjustments.map((adjustment, index) => (
                <div
                  key={index}
                  className="flex items-baseline justify-between border-b border-pure-black py-3 last:border-b-0"
                >
                  <span className="text-body-md text-on-surface">
                    {adjustment.label.trim() || copy.billEditor.adjustmentFallbackName}
                  </span>
                  <span className="text-amount-sm text-on-surface">
                    {formatMoney(split.adjustments[index]?.amount ?? 0, bill.currency, locale)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="lg:grow-[5] lg:basis-0">
        <StickySummaryBar
          label={copy.billEditor.total}
          amount={split.total}
          currency={bill.currency}
          actionLabel={copy.assignment.continueToSummary}
          onAction={onContinue}
          disabled={!split.isComplete}
        />
      </div>

      {openLineItem && (
        <AssignmentPicker
          lineItem={openLineItem}
          currency={bill.currency}
          diners={bill.diners}
          // Reuses the Split this screen already computed (it has to, for the
          // sticky Total) instead of the picker recomputing its own —
          // split.diners[i].lineItems carries exactly this row's amount for
          // every Diner who holds a Share of it.
          dinerAmounts={Object.fromEntries(
            split.diners.map((d) => [d.dinerId, d.lineItems.find((li) => li.lineItemId === openLineItem.id)?.amount ?? 0]),
          )}
          onSharesChange={(shares) => handleSharesChange(openLineItem.id, shares)}
          onClose={() => setOpenLineItemId(null)}
        />
      )}
    </div>
  )
}
