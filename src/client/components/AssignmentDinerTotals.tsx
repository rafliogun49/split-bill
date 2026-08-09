import type { Currency, Diner, Split } from '../../domain'
import { formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { copy } from '../copy'
import { Card } from './Card'
import { DinerChip } from './DinerChip'

export interface AssignmentDinerTotalsProps {
  diners: Diner[]
  /** The Split this screen already computed — read-only here, same as AssignmentPicker's dinerAmounts. */
  split: Split
  currency: Currency
}

// DESIGN.md screen 8 (desktop): the right-hand column's live per-Diner
// running total — story 39 (see AssignmentPicker) landing on the column
// itself rather than only inside the picker footer. Pure display over the
// Split this screen already computed, so a Stepper change inside the picker
// updates a row here on the very next render.
export function AssignmentDinerTotals({ diners, split, currency }: AssignmentDinerTotalsProps) {
  const locale = localeForCurrency(currency.code)

  return (
    <Card>
      <h2 className="text-headline-sm uppercase text-on-surface">{copy.assignment.dinersHeading}</h2>
      <div className="mt-4 flex flex-col gap-4">
        {diners.map((diner) => {
          const total = split.diners.find((d) => d.dinerId === diner.id)?.total ?? 0
          return (
            <div key={diner.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <DinerChip name={diner.name} joinIndex={diner.joinIndex} />
                <span className="text-body-md text-on-surface">{diner.name}</span>
              </div>
              <span className="text-amount-sm text-on-surface">{formatMoney(total, currency, locale)}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
