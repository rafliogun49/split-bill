import { useId, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { Adjustment, Bill, LineItem } from '../../domain'
import { calculateSplit, formatMoney } from '../../domain'
import type { ParseReconciliation } from '../ai/parseReceiptClient'
import { moveItem } from '../arrayMove'
import { copy } from '../copy'
import { SUPPORTED_CURRENCIES } from '../currencies'
import { localeForCurrency } from '../format'
import { CheckIcon, PlusIcon } from '../icons'
import { AdjustmentRow } from '../components/AdjustmentRow'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { focusRing } from '../components/focusRing'
import { LineItemRow } from '../components/LineItemRow'
import { ScannedStamp } from '../components/ScannedStamp'
import { StickySummaryBar } from '../components/StickySummaryBar'

export interface BillEditorScreenProps {
  bill: Bill
  onBillChange: (next: Bill) => void
  onContinue: () => void
  /** The Worker's self-check from a receipt parse, if this Bill was pre-filled from one (DESIGN.md screen 6). Absent for manual entry. */
  reconciliation?: ParseReconciliation
}

function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), label: '', amount: 0, quantity: 1, shares: {} }
}

function newAdjustment(): Adjustment {
  return { kind: 'fixed', label: '', amount: 0 }
}

// DESIGN.md screen 5 / Standalone.html: the most important screen —
// Place/Date/currency, then Line Items with a running Subtotal, then
// reorderable Adjustments, then a StickySummaryBar carrying the Bill total
// onward to Diners. Desktop moves Adjustments + the running total into a
// sticky right-hand sidebar instead of stacking below the Line Items. All
// arithmetic here goes through calculateSplit (the domain layer); nothing
// here reimplements the Subtotal or Adjustment-resolution rules.
export function BillEditorScreen({ bill, onBillChange, onContinue, reconciliation }: BillEditorScreenProps) {
  const placeInputId = useId()
  const dateInputId = useId()
  const currencyInputId = useId()
  const [placeDateRevealed, setPlaceDateRevealed] = useState(Boolean(bill.place || bill.date))
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const split = calculateSplit(bill)
  const locale = localeForCurrency(bill.currency.code)
  const showPlaceDate = placeDateRevealed || Boolean(bill.place || bill.date)
  // A reconciliation is only ever handed down when this Bill was pre-filled
  // from a photo parse (ParseReconciliation's own docstring) — the stamp
  // cares only about presence, rendering the same for 'match', 'mismatch'
  // and 'no-printed-total' alike (vibrant-neobrutalism-mockup.md §"Ornament").
  const isScanned = reconciliation !== undefined
  // Every amount is an integer in the Bill's own minor unit (CONTEXT.md
  // invariants) — switching currency once amounts exist would silently
  // reinterpret them under a different minor-unit convention (e.g. 90000
  // read as Rp 90.000 becomes $900.00) rather than converting them, so the
  // selector locks once there's anything to corrupt.
  const hasAmounts = bill.lineItems.length > 0 || bill.adjustments.length > 0

  function updateLineItems(updater: (items: LineItem[]) => LineItem[]) {
    onBillChange({ ...bill, lineItems: updater(bill.lineItems) })
  }

  function updateAdjustments(updater: (adjustments: Adjustment[]) => Adjustment[]) {
    onBillChange({ ...bill, adjustments: updater(bill.adjustments) })
  }

  function adjustmentDragHandlers(index: number) {
    return {
      onDragStart: (event: DragEvent<HTMLDivElement>) => {
        setDragIndex(index)
        event.dataTransfer.effectAllowed = 'move'
      },
      onDragOver: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
      },
      onDrop: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (dragIndex !== null && dragIndex !== index) {
          updateAdjustments((adjustments) => moveItem(adjustments, dragIndex, index))
        }
        setDragIndex(null)
      },
      onDragEnd: () => setDragIndex(null),
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4 pb-28 lg:p-6 lg:pb-6">
      {/* Standalone.html screen 5: on desktop the whole editor is one
          bordered/shadowed card, split by an internal divider into content +
          sidebar — not two separately-shadowed Cards side by side, which
          reads as a stray vertical bar down the page once Line Items runs
          past a couple of rows (each Card's own 8px hard shadow tracing its
          own tall right edge). Mobile keeps each section as its own Card,
          stacked, matching the mockup's mobile layout. `relative` anchors
          ScannedStamp to this shared card's corner instead of the bare
          screen edge, which sat flush under TopBar with no room for the
          badge's own negative offset. */}
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0 lg:border lg:border-pure-black lg:bg-surface-container-lowest lg:shadow-lg">
        {isScanned && <ScannedStamp />}

        <div className="flex flex-1 flex-col gap-6 lg:min-w-0 lg:grow lg:border-r lg:border-pure-black lg:p-6">
          {reconciliation?.status === 'match' && (
            <Banner variant="neutral">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center border border-pure-black bg-surface-container-lowest"
                >
                  <CheckIcon className="h-3 w-3 text-on-surface" />
                </span>
                <p className="text-body-md">{copy.billEditor.reconciliationMatch}</p>
              </div>
            </Banner>
          )}

          {reconciliation?.status === 'mismatch' && (
            <Banner variant="alert">
              <p className="text-label-bold uppercase">{copy.billEditor.reconciliationMismatchHeading}</p>
              <dl className="mt-2 flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-body-md">{copy.billEditor.reconciliationComputed}</dt>
                  <dd className="text-amount-sm text-on-surface">
                    {formatMoney(reconciliation.computedTotal, bill.currency, locale)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-body-md">{copy.billEditor.reconciliationPrinted}</dt>
                  <dd className="text-amount-sm text-on-surface">
                    {formatMoney(reconciliation.printedTotal, bill.currency, locale)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-body-md">{copy.billEditor.reconciliationDifference}</dt>
                  <dd className="text-amount-sm text-on-surface">
                    {formatMoney(reconciliation.difference, bill.currency, locale)}
                  </dd>
                </div>
              </dl>
            </Banner>
          )}

          {/* Standalone.html screen 5: Place/Date render as plain text (a
              receipt letterhead — "The Warung" / "14 Aug 2026 · SGD"), not
              boxed fields — unlike Line Item/Adjustment values, which are
              boxed because they're the numbers a Diner is meant to audit.
              Still real inputs (border-none/bg-transparent only strips the
              box chrome), so a scanned Place/Date typo stays correctable. */}
          <div className="flex flex-col gap-3">
            {showPlaceDate ? (
              <div className="flex flex-col gap-1">
                <label htmlFor={placeInputId} className="sr-only">
                  {copy.billEditor.place}
                </label>
                <input
                  id={placeInputId}
                  type="text"
                  placeholder={copy.billEditor.placePlaceholder}
                  value={bill.place ?? ''}
                  onChange={(event) => onBillChange({ ...bill, place: event.target.value || undefined })}
                  className={`w-full min-w-0 border-none bg-transparent p-0 text-headline-sm text-on-surface placeholder:text-on-surface-variant ${focusRing}`}
                />
                <div className="flex flex-wrap items-center gap-1 text-body-md text-on-surface-variant">
                  <label htmlFor={dateInputId} className="sr-only">
                    {copy.billEditor.date}
                  </label>
                  <input
                    id={dateInputId}
                    type="date"
                    value={bill.date ?? ''}
                    onChange={(event) => onBillChange({ ...bill, date: event.target.value || undefined })}
                    className={`min-w-0 border-none bg-transparent p-0 text-body-md text-on-surface-variant ${focusRing}`}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPlaceDateRevealed(true)}
                className={`self-start text-label-bold uppercase text-on-surface underline ${focusRing}`}
              >
                {copy.billEditor.addPlaceAndDate}
              </button>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor={currencyInputId} className="text-label-sm uppercase text-on-surface-variant">
                {copy.billEditor.currency}
              </label>
              <select
                id={currencyInputId}
                value={bill.currency.code}
                disabled={hasAmounts}
                title={hasAmounts ? copy.billEditor.currencyLockedHint : undefined}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onBillChange({ ...bill, currency: { code: event.target.value } })
                }
                className={`w-fit min-w-0 border-none bg-transparent p-0 text-label-bold uppercase text-on-surface disabled:text-on-surface-variant ${focusRing}`}
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {hasAmounts && (
                <p className="text-label-sm text-on-surface-variant">{copy.billEditor.currencyLockedHint}</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-label-sm uppercase text-on-surface-variant">{copy.billEditor.lineItemsHeading}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {bill.lineItems.length === 0 && (
                <p className="py-4 text-body-md text-on-surface-variant">{copy.billEditor.lineItemsEmpty}</p>
              )}
              {bill.lineItems.map((item) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  currency={bill.currency}
                  onChange={(next) => updateLineItems((items) => items.map((i) => (i.id === item.id ? next : i)))}
                  onRemove={() => updateLineItems((items) => items.filter((i) => i.id !== item.id))}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => updateLineItems((items) => [...items, newLineItem()])}
                className={`border border-dashed border-pure-black px-4 py-3 text-label-bold uppercase text-on-surface [@media(hover:hover)]:hover:bg-surface-variant ${focusRing}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  {copy.billEditor.addLineItem}
                </span>
              </button>
              <div className="flex items-baseline justify-between border-t border-pure-black pt-4">
                <span className="text-label-bold uppercase text-on-surface">{copy.billEditor.subtotal}</span>
                <span className="text-amount-md text-on-surface">
                  {formatMoney(split.subtotal, bill.currency, localeForCurrency(bill.currency.code))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DESIGN.md screen 5 / Standalone.html: on desktop, Adjustments + the
            running total move into this sticky right-hand sidebar instead of
            stacking below Line Items; mobile keeps the same stacked order via
            flex-col. lg:top-12 matches TopBar's own min-h-12 (App.tsx) so this
            column's sticky offset sits flush under it rather than overlapping
            or gapping — same convention as AssignmentScreen's sidebar. A
            fixed pixel width (matching Standalone.html's literal 300px of a
            900px card) turned unreadable at viewports not far past the `lg`
            breakpoint — the content column lost almost all its width. A
            percentage keeps the same ~40/60 split at every desktop width
            instead. */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-12 lg:w-[40%] lg:shrink-0 lg:p-6">
          <div>
            <h2 className="text-label-sm uppercase text-on-surface-variant">{copy.billEditor.adjustmentsHeading}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {bill.adjustments.length === 0 && (
                <p className="py-4 text-body-md text-on-surface-variant">{copy.billEditor.adjustmentsEmpty}</p>
              )}
              {bill.adjustments.map((adjustment, index) => (
                <AdjustmentRow
                  key={index}
                  adjustment={adjustment}
                  resolvedAmount={split.adjustments[index]?.amount ?? 0}
                  currency={bill.currency}
                  canMoveUp={index > 0}
                  canMoveDown={index < bill.adjustments.length - 1}
                  onChange={(next) =>
                    updateAdjustments((adjustments) => adjustments.map((a, i) => (i === index ? next : a)))
                  }
                  onRemove={() => updateAdjustments((adjustments) => adjustments.filter((_, i) => i !== index))}
                  onMoveUp={() => updateAdjustments((adjustments) => moveItem(adjustments, index, index - 1))}
                  onMoveDown={() => updateAdjustments((adjustments) => moveItem(adjustments, index, index + 1))}
                  {...adjustmentDragHandlers(index)}
                />
              ))}
            </div>
            <div className="mt-2">
              <Button
                variant="secondary"
                onClick={() => updateAdjustments((adjustments) => [...adjustments, newAdjustment()])}
              >
                <span className="flex items-center justify-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  {copy.billEditor.addAdjustment}
                </span>
              </Button>
            </div>
          </div>

          <StickySummaryBar
            label={copy.billEditor.total}
            amount={split.total}
            currency={bill.currency}
            actionLabel={copy.billEditor.continueToDiners}
            onAction={onContinue}
          />
        </div>
      </div>
    </div>
  )
}
