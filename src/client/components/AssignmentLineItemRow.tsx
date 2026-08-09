import type { Currency, Diner, LineItem } from '../../domain'
import { formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { copy } from '../copy'
import { ChevronIcon, PersonPlusIcon } from '../icons'
import { DinerChip } from './DinerChip'
import { focusRing } from './focusRing'

export interface AssignmentLineItemRowProps {
  item: LineItem
  currency: Currency
  /** Every Diner on the Bill — only those holding a Share of this row render a chip. */
  diners: Diner[]
  onOpenPicker: () => void
}

// DESIGN.md §8: name, quantity, line total, claimed DinerChips, chevron.
// Tapping anywhere opens AssignmentPicker. Unclaimed rows show a +person
// icon in place of chips — distinct from the editable LineItemRow born in
// issue #6 for the Bill editor, since this row is read-only and exists to
// open the picker rather than to edit the Line Item itself.
//
// Below 1024px the row splits across two lines (name/quantity, then claimed
// chips/amount/chevron) per DESIGN.md §10's own fallback for the picker's
// gesture cost — density that stayed cramped on one line at >= 1024px stays
// the original single ~72px-tall row there. The two `lg:contents` wrappers
// below collapse into the button's own row at that breakpoint so every
// piece of text renders exactly once in the DOM; `lg:order-*` restores the
// original left-to-right reading order (qty, name, amount, chips, chevron)
// without touching source order, which is what the two-line mobile layout
// relies on.
export function AssignmentLineItemRow({ item, currency, diners, onOpenPicker }: AssignmentLineItemRowProps) {
  const name = item.label.trim() || copy.billEditor.lineItemFallbackName
  const claimingDiners = diners.filter((d) => (item.shares[d.id] ?? 0) > 0)

  return (
    <button
      type="button"
      onClick={onOpenPicker}
      aria-label={`${copy.assignment.assignRow} ${name}`}
      className={`flex w-full flex-col gap-2 border-b border-pure-black p-4 text-left last:border-b-0 lg:min-h-[72px] lg:flex-row lg:items-center lg:gap-3 ${focusRing}`}
    >
      <span className="flex items-baseline gap-2 lg:contents">
        <span className="w-8 shrink-0 text-label-sm text-on-surface-variant lg:order-1">{item.quantity}x</span>
        <span className="flex-1 text-body-md text-on-surface lg:order-2">{name}</span>
      </span>
      <span className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 lg:contents">
        <span className="flex min-w-0 flex-wrap items-center gap-1 lg:order-4">
          {claimingDiners.length === 0 ? (
            <PersonPlusIcon className="h-6 w-6 text-on-surface-variant" />
          ) : (
            claimingDiners.map((diner) => (
              <DinerChip key={diner.id} name={diner.name} joinIndex={diner.joinIndex} shareCount={item.shares[diner.id]} />
            ))
          )}
        </span>
        <span className="text-amount-sm text-on-surface lg:order-3">
          {formatMoney(item.amount, currency, localeForCurrency(currency.code))}
        </span>
        <ChevronIcon className="h-4 w-4 shrink-0 -rotate-90 text-on-surface lg:order-5" />
      </span>
    </button>
  )
}
