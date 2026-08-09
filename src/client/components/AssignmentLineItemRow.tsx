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

// DESIGN.md §8: name, quantity, line total, claimed DinerChips, chevron;
// ~72px tall. Tapping anywhere opens AssignmentPicker. Unclaimed rows show a
// +person icon in place of chips — distinct from the editable LineItemRow
// born in issue #6 for the Bill editor, since this row is read-only and
// exists to open the picker rather than to edit the Line Item itself.
export function AssignmentLineItemRow({ item, currency, diners, onOpenPicker }: AssignmentLineItemRowProps) {
  const name = item.label.trim() || copy.billEditor.lineItemFallbackName
  const claimingDiners = diners.filter((d) => (item.shares[d.id] ?? 0) > 0)

  return (
    <button
      type="button"
      onClick={onOpenPicker}
      aria-label={`${copy.assignment.assignRow} ${name}`}
      className={`flex min-h-[72px] w-full items-center gap-3 border-b border-pure-black p-4 text-left last:border-b-0 ${focusRing}`}
    >
      <span className="w-8 shrink-0 text-label-sm text-on-surface-variant">{item.quantity}x</span>
      <span className="flex-1 text-body-md text-on-surface">{name}</span>
      <span className="text-amount-sm text-on-surface">{formatMoney(item.amount, currency, localeForCurrency(currency.code))}</span>
      <span className="flex shrink-0 items-center gap-1">
        {claimingDiners.length === 0 ? (
          <PersonPlusIcon className="h-6 w-6 text-on-surface-variant" />
        ) : (
          claimingDiners.map((diner) => (
            <DinerChip key={diner.id} name={diner.name} joinIndex={diner.joinIndex} shareCount={item.shares[diner.id]} />
          ))
        )}
      </span>
      <ChevronIcon className="h-4 w-4 shrink-0 -rotate-90 text-on-surface" />
    </button>
  )
}
