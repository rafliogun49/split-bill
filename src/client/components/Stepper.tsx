import { MinusIcon, PlusIcon } from '../icons'
import { copy } from '../copy'
import { focusRing } from './focusRing'

export interface StepperProps {
  /** Names the thing being counted, e.g. a Diner's name — composed into each button's accessible name. */
  label: string
  value: number
  onChange: (next: number) => void
  min?: number
}

// DESIGN.md §8: `[−] n [+]`, 44px targets, amount-sm numeral, floors at 0.
export function Stepper({ label, value, onChange, min = 0 }: StepperProps) {
  const canDecrement = value > min

  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrement}
        aria-label={`${copy.assignment.stepperDecrease} ${label}`}
        className={`flex h-11 w-11 shrink-0 items-center justify-center border border-pure-black text-on-surface disabled:border-disabled disabled:text-disabled ${focusRing}`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="w-6 text-center text-amount-sm text-on-surface">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`${copy.assignment.stepperIncrease} ${label}`}
        className={`flex h-11 w-11 shrink-0 items-center justify-center border border-pure-black text-on-surface ${focusRing}`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
