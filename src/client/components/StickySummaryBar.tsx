import type { Currency } from '../../domain'
import { formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { Button } from './Button'

export interface StickySummaryBarProps {
  label: string
  amount: number
  currency: Currency
  actionLabel: string
  onAction: () => void
  disabled?: boolean
}

// DESIGN.md §8: mobile-only, fixed to the bottom edge with an upward shadow;
// becomes the static right-hand column at >= 1024px (DESIGN.md §"Layout").
export function StickySummaryBar({ label, amount, currency, actionLabel, onAction, disabled }: StickySummaryBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 border-t border-pure-black bg-surface-container-lowest p-4 shadow-summary-bar lg:static lg:border lg:shadow-lg">
      <div>
        <p className="text-label-sm uppercase text-on-surface-variant">{label}</p>
        <p className="text-amount-md text-on-surface">{formatMoney(amount, currency, localeForCurrency(currency.code))}</p>
      </div>
      <Button variant="primary" onClick={onAction} disabled={disabled}>
        {actionLabel}
      </Button>
    </div>
  )
}
