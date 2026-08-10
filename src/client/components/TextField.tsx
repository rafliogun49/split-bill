import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { focusRing } from './focusRing'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string
  /** Keeps the label in the accessible name while hiding it visually, for a field whose label is already carried by surrounding layout (e.g. a Line Item's name cell). */
  hideLabel?: boolean
  /**
   * Standalone.html's own caption: "Boxed white fields are editable · plain
   * text is calculated automatically." Most text fields are boxed at every
   * breakpoint (`'always'`, the default). A Line Item's name reads as plain
   * text on mobile — like a receipt letterhead — and only gets its own
   * boxed grid cell once desktop has room for one (`'lg'`). An Adjustment's
   * label is never boxed (`'never'`) — the row's own border already carries
   * it, and only the resolved value is a number worth auditing in a box.
   */
  boxed?: 'always' | 'lg' | 'never'
}

// DESIGN.md §8: 4px border, no radius, no inner shadow.
export function TextField({ label, hideLabel, id, boxed = 'always', ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  // Standalone.html's unboxed "letterhead" fields (Line Item name, Adjustment
  // label) carry font-weight:600 — the bolder weight is doing the visual
  // work a border would otherwise do to set the field apart from plain
  // surrounding text. A boxed field's own border already does that job, so
  // it stays at the regular body weight.
  const className =
    boxed === 'always'
      ? `w-full min-w-0 border border-pure-black bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface ${focusRing}`
      : boxed === 'lg'
        ? `w-full min-w-0 border-0 bg-transparent p-0 text-body-md font-semibold text-on-surface lg:border lg:border-pure-black lg:bg-surface-container-lowest lg:px-3 lg:py-2 lg:font-normal ${focusRing}`
        : `w-full min-w-0 border-none bg-transparent p-0 text-body-md font-semibold text-on-surface ${focusRing}`

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className={hideLabel ? 'sr-only' : 'text-label-sm uppercase text-on-surface-variant'}
      >
        {label}
      </label>
      <input id={inputId} type="text" className={className} {...props} />
    </div>
  )
}
