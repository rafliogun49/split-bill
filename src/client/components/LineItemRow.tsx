import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Currency, LineItem } from '../../domain'
import { AmountField } from './AmountField'
import { ChevronIcon, TrashIcon } from '../icons'
import { TextField } from './TextField'
import { focusRing } from './focusRing'
import { copy } from '../copy'

export interface LineItemRowProps {
  item: LineItem
  currency: Currency
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (next: LineItem) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

// A Line Item's unit price has no field of its own in the domain shape —
// amount is authoritative (types.ts) — so it's always the display-only
// quotient of amount over quantity, never separately stored. Falls back to 0
// (not amount) while quantity is transiently 0 — treating the whole line
// total as a per-unit price would multiply it back in once quantity is
// re-entered.
function unitPriceOf(item: LineItem): number {
  return item.quantity > 0 ? Math.round(item.amount / item.quantity) : 0
}

// DESIGN.md screen 5: name + delete on one line, quantity/unit price/line
// total on the next. Entering quantity or unit price fills the line total by
// simple multiplication of two already-integer minor-unit values (exact, no
// rounding) — the Split arithmetic itself stays entirely in the domain layer.
export function LineItemRow({ item, currency, canMoveUp, canMoveDown, onChange, onRemove, onMoveUp, onMoveDown }: LineItemRowProps) {
  const name = item.label.trim() || copy.billEditor.lineItemFallbackName
  const [quantityDraft, setQuantityDraft] = useState(String(item.quantity))

  // The last known positive unit price, kept across a transient quantity of
  // 0 (e.g. deleting a leading digit mid-edit) so the next digit multiplies
  // the real per-unit price rather than a stale total (unitPriceOf falls
  // back to 0 exactly to keep that stale total out of this ref).
  const lastUnitPriceRef = useRef(unitPriceOf(item))
  if (item.quantity > 0) lastUnitPriceRef.current = unitPriceOf(item)

  useEffect(() => {
    setQuantityDraft(String(item.quantity))
  }, [item.quantity])

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setQuantityDraft(raw)
    const parsed = Number.parseInt(raw, 10)
    if (!Number.isFinite(parsed) || parsed < 0) return
    onChange({ ...item, quantity: parsed, amount: parsed > 0 ? lastUnitPriceRef.current * parsed : item.amount })
  }

  function handleQuantityBlur() {
    setQuantityDraft(String(item.quantity))
  }

  function handleUnitPriceChange(nextUnitPrice: number) {
    const quantity = item.quantity > 0 ? item.quantity : 1
    onChange({ ...item, quantity, amount: nextUnitPrice * quantity })
  }

  function handleAmountChange(nextAmount: number) {
    onChange({ ...item, amount: nextAmount })
  }

  return (
    <div className="flex flex-col gap-3 border-b border-pure-black p-4 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <TextField
            label={copy.billEditor.lineItemName}
            hideLabel
            placeholder={copy.billEditor.lineItemName}
            value={item.label}
            onChange={(event) => onChange({ ...item, label: event.target.value })}
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
          aria-label={`${copy.billEditor.removeLineItem} ${name}`}
          className={`p-2 text-on-surface ${focusRing}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-end gap-3">
        <div className="w-16">
          <TextField
            label={`${copy.billEditor.quantity} — ${name}`}
            hideLabel
            inputMode="numeric"
            value={quantityDraft}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
          />
        </div>
        <div className="flex-1">
          <AmountField
            label={`${copy.billEditor.unitPrice} — ${name}`}
            hideLabel
            value={unitPriceOf(item)}
            currency={currency}
            onChange={handleUnitPriceChange}
          />
        </div>
        <div className="flex-1">
          <AmountField
            label={`${copy.billEditor.lineTotal} — ${name}`}
            hideLabel
            value={item.amount}
            currency={currency}
            onChange={handleAmountChange}
          />
        </div>
      </div>
    </div>
  )
}
