import { useEffect, useId, useRef } from 'react'
import type { Currency, Diner, DinerId, LineItem } from '../../domain'
import { formatMoney } from '../../domain'
import { localeForCurrency } from '../format'
import { copy } from '../copy'
import { Button } from './Button'
import { DinerChip } from './DinerChip'
import { Stepper } from './Stepper'

const focusableSelector = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export interface AssignmentPickerProps {
  lineItem: LineItem
  currency: Currency
  /** Every Diner on the Bill, including those at zero Shares of this row — the picker is one interaction per row regardless of who's on it. */
  diners: Diner[]
  /** Each Diner's resolved cost of this row, keyed by Diner id — the caller's Split already carries this, so the picker doesn't recompute it. */
  dinerAmounts: Record<DinerId, number>
  onSharesChange: (shares: Record<DinerId, number>) => void
  onClose: () => void
}

// DESIGN.md §8: bottom sheet on mobile, centred modal >=1024px. Header names
// the Line Item and its total; one Stepper row per Diner; footer shows each
// claiming Diner's share of the row and a DONE button. Fully controlled —
// every Stepper change is emitted immediately so a Diner's running Total
// (story 39) updates live rather than only once the sheet closes.
export function AssignmentPicker({ lineItem, currency, diners, dinerAmounts, onSharesChange, onClose }: AssignmentPickerProps) {
  const headingId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const locale = localeForCurrency(currency.code)

  // Stepper clicks change props (a new `lineItem`, a new `onClose` closure)
  // on every keystroke of assigning without the sheet itself remounting, so
  // this reads onClose through a ref and runs exactly once per open/close —
  // deps on the prop directly would re-run the effect on every Share change
  // and steal focus back to the first control mid-interaction.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // A real modal: focus enters the sheet on open, Tab cycles within it
  // instead of leaking into the row list or sticky bar behind it, and
  // closing (Escape, Done, or the backdrop) hands focus back to whatever a
  // keyboard user was on before opening it.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    dialog.querySelector<HTMLElement>(focusableSelector)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusable.length === 0) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [])

  function setShare(dinerId: DinerId, next: number) {
    if (next < 0) return
    onSharesChange({ ...lineItem.shares, [dinerId]: next })
  }

  const claimingDiners = diners.filter((d) => (lineItem.shares[d.id] ?? 0) > 0)

  return (
    // The backdrop and dialog are siblings-in-a-wrapper rather than the
    // dialog itself carrying the click handler, so a click stopped from
    // bubbling inside the dialog can't also be mistaken for a backdrop hit.
    <div
      className="fixed inset-0 z-20 flex flex-col justify-end bg-pure-black/40 lg:items-center lg:justify-center"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto border border-pure-black bg-surface-container-lowest p-6 shadow-lg lg:w-full lg:max-w-md"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-pure-black pb-4">
          <h2 id={headingId} className="text-headline-sm uppercase text-on-surface">
            {lineItem.label || copy.billEditor.lineItemFallbackName}
          </h2>
          <span className="text-amount-md text-on-surface">{formatMoney(lineItem.amount, currency, locale)}</span>
        </div>

        <div className="flex flex-col gap-4">
          {diners.map((diner) => (
            <div key={diner.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <DinerChip name={diner.name} joinIndex={diner.joinIndex} claimed={(lineItem.shares[diner.id] ?? 0) > 0} />
                <span className="text-body-md text-on-surface">{diner.name}</span>
              </div>
              <Stepper label={diner.name} value={lineItem.shares[diner.id] ?? 0} onChange={(next) => setShare(diner.id, next)} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-pure-black pt-4">
          {claimingDiners.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">{copy.assignment.pickerNoClaims}</p>
          ) : (
            claimingDiners.map((diner) => (
              <div key={diner.id} className="flex items-baseline justify-between text-body-md text-on-surface">
                <span>{diner.name}</span>
                <span className="text-amount-sm">{formatMoney(dinerAmounts[diner.id] ?? 0, currency, locale)}</span>
              </div>
            ))
          )}
          <Button variant="primary" onClick={onClose}>
            {copy.assignment.pickerDone}
          </Button>
        </div>
      </div>
    </div>
  )
}
