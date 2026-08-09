import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { focusRing } from './focusRing'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: string
  /** Keeps the label in the accessible name while hiding it visually, for a field whose label is already carried by surrounding layout (e.g. a Line Item's name cell). */
  hideLabel?: boolean
}

// DESIGN.md §8: 4px border, no radius, no inner shadow.
export function TextField({ label, hideLabel, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

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
        className={`border border-pure-black bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface ${focusRing}`}
        {...props}
      />
    </div>
  )
}
