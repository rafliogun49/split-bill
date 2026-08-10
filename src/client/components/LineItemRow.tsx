import { useRef } from 'react'
import type { Currency, LineItem } from '../../domain'
import { AmountField } from './AmountField'
import { TrashIcon } from '../icons'
import { Stepper } from './Stepper'
import { TextField } from './TextField'
import { focusRing } from './focusRing'
import { copy } from '../copy'

export interface LineItemRowProps {
  item: LineItem
  currency: Currency
  onChange: (next: LineItem) => void
  onRemove: () => void
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

// DESIGN.md screen 5 / Standalone.html: each Line Item is its own bordered
// box — name (plain, calculated-text styling — DESIGN.md §8's "boxed white
// fields are editable · plain text is calculated automatically" — still a
// real input, just unboxed chrome) on its own line with delete, then
// quantity/unit price/line total below. Line Item order carries no meaning
// (unlike Adjustments, which compound in list order per ADR-0005), so unlike
// AdjustmentRow there's no reorder control here — just add and delete.
// Quantity is a Stepper (issue #21/#25) rather than free-text — the domain
// layer already treats quantity as display-only (CONTEXT.md: "quantity is
// carried for display and never used to derive money"), and free-text let a
// keystroke silently overwrite an already-correct line total. Changing the
// stepper still fills the line total by simple multiplication of two
// already-integer minor-unit values (exact, no rounding) — the Split
// arithmetic itself stays entirely in the domain layer.
export function LineItemRow({ item, currency, onChange, onRemove }: LineItemRowProps) {
  const name = item.label.trim() || copy.billEditor.lineItemFallbackName

  // The last known positive unit price, kept across a transient quantity of
  // 0 (e.g. the stepper floored at zero mid-adjustment) so the next
  // increment multiplies the real per-unit price rather than a stale total
  // (unitPriceOf falls back to 0 exactly to keep that stale total out of
  // this ref).
  const lastUnitPriceRef = useRef(unitPriceOf(item))
  if (item.quantity > 0) lastUnitPriceRef.current = unitPriceOf(item)

  function handleQuantityChange(nextQuantity: number) {
    onChange({ ...item, quantity: nextQuantity, amount: nextQuantity > 0 ? lastUnitPriceRef.current * nextQuantity : item.amount })
  }

  function handleUnitPriceChange(nextUnitPrice: number) {
    const quantity = item.quantity > 0 ? item.quantity : 1
    onChange({ ...item, quantity, amount: nextUnitPrice * quantity })
  }

  function handleAmountChange(nextAmount: number) {
    onChange({ ...item, amount: nextAmount })
  }

  return (
    <div className="flex flex-col gap-2 border border-pure-black bg-surface-container-lowest p-3">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <TextField
            label={copy.billEditor.lineItemName}
            hideLabel
            boxed="never"
            placeholder={copy.billEditor.lineItemName}
            value={item.label}
            onChange={(event) => onChange({ ...item, label: event.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${copy.billEditor.removeLineItem} ${name}`}
          className={`p-2 text-on-surface ${focusRing}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      {/* flex-wrap: on a narrow card the unit-price field's legible minimum
          can exceed the row's width, so it wraps to a second line instead of
          clipping or overflowing past the card's own border. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="shrink-0">
          <Stepper
            label={name}
            value={item.quantity}
            onChange={handleQuantityChange}
            increaseLabel={copy.billEditor.increaseQuantity}
            decreaseLabel={copy.billEditor.decreaseQuantity}
          />
        </div>
        <span aria-hidden="true" className="text-body-md text-on-surface-variant">
          ×
        </span>
        <div className="min-w-20 flex-1">
          <AmountField
            label={`${copy.billEditor.unitPrice} — ${name}`}
            hideLabel
            align="left"
            value={unitPriceOf(item)}
            currency={currency}
            onChange={handleUnitPriceChange}
          />
        </div>
        <span aria-hidden="true" className="text-body-md text-on-surface-variant">
          =
        </span>
        <div className="min-w-20 flex-1">
          <AmountField
            label={`${copy.billEditor.lineTotal} — ${name}`}
            hideLabel
            boxed="never"
            align="left"
            value={item.amount}
            currency={currency}
            onChange={handleAmountChange}
          />
        </div>
      </div>
    </div>
  )
}
