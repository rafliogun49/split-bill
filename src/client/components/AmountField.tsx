import { useId, useState } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'
import { formatMoney, minorUnitDigits } from '../../domain'
import type { Currency } from '../../domain'
import { localeForCurrency } from '../format'
import { focusRing } from './focusRing'

export interface AmountFieldProps {
  label: string
  /** Keeps the label in the accessible name while hiding it visually, e.g. a Line Item's line-total cell whose column header already carries it. */
  hideLabel?: boolean
  /** Integer minor units, e.g. cents. Never a float. */
  value: number
  currency: Currency
  onChange: (minorUnits: number) => void
  id?: string
  /**
   * Standalone.html's own caption: "Boxed white fields are editable · plain
   * text is calculated automatically." A Line Total is always boxed
   * (`'always'`, the default) — it's the number a Diner audits. A Line
   * Item's unit price is never boxed (`'never'`) — it reads as plain
   * calculated text, baked into "2 × $6.50 =", at every breakpoint.
   */
  boxed?: 'always' | 'lg' | 'never'
  /** DESIGN.md §8 specifies right-aligned amounts; the Bill editor's Line Items row reads left-to-right as a sentence ("2 × $6.50 = $13.00") and asked to align left instead. */
  align?: 'left' | 'right'
}

function toMajorUnitString(minorUnits: number, digits: number): string {
  return (minorUnits / 10 ** digits).toFixed(digits)
}

function toMinorUnits(text: string, digits: number): number | null {
  const normalized = text.trim().replace(/,/g, '')
  if (normalized === '' || Number.isNaN(Number(normalized))) return null
  return Math.round(Number(normalized) * 10 ** digits)
}

// DESIGN.md §8: right-aligned, amount-md, tabular, enforces the currency's
// minor unit. Shows the locale-formatted amount at rest ("Rp 156.177"); a
// focused field edits the plain major-unit number ("156177") so typing isn't
// fighting a currency symbol and thousands separators, then reformats on blur.
export function AmountField({ label, hideLabel, value, currency, onChange, id, boxed = 'always', align = 'right' }: AmountFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const digits = minorUnitDigits(currency.code)
  const formatted = formatMoney(value, currency, localeForCurrency(currency.code))

  const [draft, setDraft] = useState<string | null>(null)

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setDraft(toMajorUnitString(value, digits))
    // The draft (and so the input's DOM value) hasn't committed yet at this
    // point in the event — select() here would select the formatted text
    // being replaced. Deferring to the next frame selects the editable
    // major-unit number instead, so the first keystroke replaces it.
    const target = event.target
    requestAnimationFrame(() => target.select())
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value)
  }

  function handleBlur() {
    if (draft !== null) {
      const parsed = toMinorUnits(draft, digits)
      if (parsed !== null && parsed !== value) onChange(parsed)
    }
    setDraft(null)
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className={hideLabel ? 'sr-only' : 'text-label-sm uppercase text-on-surface-variant'}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="decimal"
        value={draft ?? formatted}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          (boxed === 'always'
            ? `w-full min-w-0 border border-pure-black bg-surface-container-lowest px-3 py-2 text-amount-md text-on-surface ${focusRing}`
            : boxed === 'lg'
              ? `w-full min-w-0 border-0 bg-transparent p-0 text-body-md text-on-surface lg:border lg:border-pure-black lg:bg-surface-container-lowest lg:px-3 lg:py-2 lg:text-amount-sm ${focusRing}`
              : `w-full min-w-0 border-0 bg-transparent p-0 text-body-md text-on-surface ${focusRing}`) +
          (align === 'left' ? ' text-left' : ' text-right')
        }
      />
    </div>
  )
}
