import { useId, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { Adjustment, Bill, LineItem } from '../../domain'
import { calculateSplit, formatMoney } from '../../domain'
import type { ParseReconciliation } from '../ai/parseReceiptClient'
import { moveItem } from '../arrayMove'
import { copy } from '../copy'
import { SUPPORTED_CURRENCIES } from '../currencies'
import { localeForCurrency } from '../format'
import { PlusIcon } from '../icons'
import { AdjustmentRow } from '../components/AdjustmentRow'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { focusRing } from '../components/focusRing'
import { LineItemRow } from '../components/LineItemRow'
import { StickySummaryBar } from '../components/StickySummaryBar'
import { TextField } from '../components/TextField'

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

// DESIGN.md screen 5: the most important screen — Place/Date/currency, then
// Line Items with a running Subtotal, then reorderable Adjustments, then a
// StickySummaryBar carrying the Bill total onward to Diners. All arithmetic
// here goes through calculateSplit (the domain layer); nothing here
// reimplements the Subtotal or Adjustment-resolution rules.
export function BillEditorScreen({ bill, onBillChange, onContinue, reconciliation }: BillEditorScreenProps) {
  const dateInputId = useId()
  const currencyInputId = useId()
  const [placeDateRevealed, setPlaceDateRevealed] = useState(Boolean(bill.place || bill.date))
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const split = calculateSplit(bill)
  const locale = localeForCurrency(bill.currency.code)
  const showPlaceDate = placeDateRevealed || Boolean(bill.place || bill.date)
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
    <div className="flex flex-1 flex-col gap-6 p-4 pb-28 lg:flex-row lg:items-start lg:gap-6 lg:p-6 lg:pb-6">
      <div className="flex flex-1 flex-col gap-6">
        {reconciliation?.status === 'match' && (
          <Banner variant="neutral">
            <p className="text-body-md">{copy.billEditor.reconciliationMatch}</p>
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

        <div className="flex flex-col gap-4">
          {showPlaceDate ? (
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1">
                <TextField
                  label={copy.billEditor.place}
                  placeholder={copy.billEditor.placePlaceholder}
                  value={bill.place ?? ''}
                  onChange={(event) => onBillChange({ ...bill, place: event.target.value || undefined })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={dateInputId} className="text-label-sm uppercase text-on-surface-variant">
                  {copy.billEditor.date}
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  value={bill.date ?? ''}
                  onChange={(event) => onBillChange({ ...bill, date: event.target.value || undefined })}
                  className={`border border-pure-black bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface ${focusRing}`}
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
              className={`w-32 border border-pure-black bg-surface-container-lowest px-3 py-2 text-label-bold uppercase text-on-surface disabled:bg-disabled ${focusRing}`}
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

        <Card>
          <h2 className="text-headline-sm uppercase text-on-surface">{copy.billEditor.lineItemsHeading}</h2>
          <div className="mt-4 flex flex-col">
            {bill.lineItems.length === 0 && (
              <p className="py-4 text-body-md text-on-surface-variant">{copy.billEditor.lineItemsEmpty}</p>
            )}
            {bill.lineItems.map((item, index) => (
              <LineItemRow
                key={item.id}
                item={item}
                currency={bill.currency}
                canMoveUp={index > 0}
                canMoveDown={index < bill.lineItems.length - 1}
                onChange={(next) => updateLineItems((items) => items.map((i) => (i.id === item.id ? next : i)))}
                onRemove={() => updateLineItems((items) => items.filter((i) => i.id !== item.id))}
                onMoveUp={() => updateLineItems((items) => moveItem(items, index, index - 1))}
                onMoveDown={() => updateLineItems((items) => moveItem(items, index, index + 1))}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <Button variant="secondary" onClick={() => updateLineItems((items) => [...items, newLineItem()])}>
              <span className="flex items-center justify-center gap-2">
                <PlusIcon className="h-4 w-4" />
                {copy.billEditor.addLineItem}
              </span>
            </Button>
            <div className="flex items-baseline justify-between border-t border-pure-black pt-4">
              <span className="text-label-bold uppercase text-on-surface">{copy.billEditor.subtotal}</span>
              <span className="text-amount-md text-on-surface">
                {formatMoney(split.subtotal, bill.currency, localeForCurrency(bill.currency.code))}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-headline-sm uppercase text-on-surface">{copy.billEditor.adjustmentsHeading}</h2>
          <div className="mt-4 flex flex-col">
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
          <Button
            variant="secondary"
            onClick={() => updateAdjustments((adjustments) => [...adjustments, newAdjustment()])}
          >
            <span className="flex items-center justify-center gap-2">
              <PlusIcon className="h-4 w-4" />
              {copy.billEditor.addAdjustment}
            </span>
          </Button>
        </Card>
      </div>

      <div className="lg:w-80">
        <StickySummaryBar
          label={copy.billEditor.total}
          amount={split.total}
          currency={bill.currency}
          actionLabel={copy.billEditor.continueToDiners}
          onAction={onContinue}
        />
      </div>
    </div>
  )
}
