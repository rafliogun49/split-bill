import { useEffect, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import type { Adjustment, Currency } from '../../domain'
import { formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { copy } from '../copy'
import { ChevronIcon, GripIcon, TrashIcon } from '../icons'
import { AmountField } from './AmountField'
import { focusRing } from './focusRing'
import { TextField } from './TextField'

export interface AdjustmentRowProps {
  adjustment: Adjustment
  /** The amount this Adjustment resolved to, from calculateSplit — never recomputed here (ADR-0005). */
  resolvedAmount: number
  currency: Currency
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (next: Adjustment) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  /** Native HTML5 drag-and-drop, wired up by the list that owns ordering. The grip is also a keyboard-operable Move up/down pair, so dragging is progressive enhancement rather than the only way to reorder. */
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void
  onDrop?: (event: DragEvent<HTMLDivElement>) => void
  onDragEnd?: (event: DragEvent<HTMLDivElement>) => void
}

function percentString(rateBps: number): string {
  return (rateBps / 100).toString()
}

// DESIGN.md screen 5 + §8 AdjustmentRow: name, fixed-or-rate toggle, value,
// resolved amount, drag handle. Adjustments are never assignable to a Diner —
// there is deliberately no such control here.
export function AdjustmentRow({
  adjustment,
  resolvedAmount,
  currency,
  canMoveUp,
  canMoveDown,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: AdjustmentRowProps) {
  const name = adjustment.label.trim() || copy.billEditor.adjustmentFallbackName
  const [percentDraft, setPercentDraft] = useState(adjustment.kind === 'rate' ? percentString(adjustment.rateBps) : '0')

  useEffect(() => {
    if (adjustment.kind === 'rate') setPercentDraft(percentString(adjustment.rateBps))
  }, [adjustment])

  function switchKind(kind: 'fixed' | 'rate') {
    if (kind === adjustment.kind) return
    onChange(
      kind === 'fixed'
        ? { kind: 'fixed', label: adjustment.label, amount: 0 }
        : { kind: 'rate', label: adjustment.label, rateBps: 0 },
    )
  }

  function handlePercentChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setPercentDraft(raw)
    const percent = Number.parseFloat(raw)
    if (Number.isFinite(percent)) onChange({ ...adjustment, kind: 'rate', rateBps: Math.round(percent * 100) })
  }

  function handlePercentBlur() {
    if (adjustment.kind === 'rate') setPercentDraft(percentString(adjustment.rateBps))
  }

  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="flex flex-col gap-3 border-b border-pure-black p-4 last:border-b-0"
    >
      <div className="flex items-center gap-2">
        <GripIcon className="h-5 w-5 shrink-0 text-on-surface-variant" />
        <div className="flex-1">
          <TextField
            label={copy.billEditor.adjustmentName}
            hideLabel
            placeholder={copy.billEditor.adjustmentName}
            value={adjustment.label}
            onChange={(event) => onChange({ ...adjustment, label: event.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label={`${copy.billEditor.moveUp} ${name}`}
          className={`p-2 text-on-surface disabled:text-disabled ${focusRing}`}
        >
          <ChevronIcon className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label={`${copy.billEditor.moveDown} ${name}`}
          className={`p-2 text-on-surface disabled:text-disabled ${focusRing}`}
        >
          <ChevronIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${copy.billEditor.removeAdjustment} ${name}`}
          className={`p-2 text-on-surface ${focusRing}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-1" role="group" aria-label={`${copy.billEditor.adjustmentKind} — ${name}`}>
          <button
            type="button"
            aria-pressed={adjustment.kind === 'rate'}
            onClick={() => switchKind('rate')}
            className={`border border-pure-black px-3 py-2 text-label-bold uppercase text-on-surface ${adjustment.kind === 'rate' ? 'bg-primary-container' : 'bg-surface-container-lowest'} ${focusRing}`}
          >
            {copy.billEditor.rate}
          </button>
          <button
            type="button"
            aria-pressed={adjustment.kind === 'fixed'}
            onClick={() => switchKind('fixed')}
            className={`border border-pure-black px-3 py-2 text-label-bold uppercase text-on-surface ${adjustment.kind === 'fixed' ? 'bg-primary-container' : 'bg-surface-container-lowest'} ${focusRing}`}
          >
            {copy.billEditor.fixed}
          </button>
        </div>
        {adjustment.kind === 'rate' ? (
          <div className="w-24">
            <TextField
              label={`${copy.billEditor.ratePercent} — ${name}`}
              hideLabel
              inputMode="decimal"
              value={percentDraft}
              onChange={handlePercentChange}
              onBlur={handlePercentBlur}
            />
          </div>
        ) : (
          <div className="flex-1">
            <AmountField
              label={`${copy.billEditor.fixedAmount} — ${name}`}
              hideLabel
              value={adjustment.amount}
              currency={currency}
              onChange={(amount) => onChange({ ...adjustment, kind: 'fixed', amount })}
            />
          </div>
        )}
        <p className="text-label-sm text-on-surface-variant">
          {copy.billEditor.resolvesTo}{' '}
          <span className="text-amount-sm text-on-surface">
            {formatMoney(resolvedAmount, currency, localeForCurrency(currency.code))}
          </span>
        </p>
      </div>
    </div>
  )
}
