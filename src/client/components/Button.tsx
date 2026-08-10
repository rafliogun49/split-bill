import type { ButtonHTMLAttributes } from 'react'
import { focusRing } from './focusRing'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'default' | 'hero'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  /** `hero` stacks icon + label for the Start screen's dominant photograph action. */
  size?: ButtonSize
}

// DESIGN.md §8: all four states (primary/secondary/danger/disabled) carry
// black text and shadow-md at rest — disabled fill overrides the variant
// fill rather than stacking with it. §5: state is carried by shadow and
// position, never by fill, so hover/press are shadow+translate only, and
// hover is guarded to pointer devices so a tap can't get stuck in it.
const variantFill: Record<ButtonVariant, string> = {
  primary: 'bg-primary-container',
  secondary: 'bg-surface-container-lowest',
  danger: 'bg-error-container',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'min-h-[48px] px-6',
  hero: 'flex w-full flex-col items-center gap-3 px-6 py-10',
}

/**
 * The hover/press choreography DESIGN.md §5 requires of every clickable
 * surface — translate distances only, no shadow tier baked in, since
 * one-off controls outside this component (e.g. CaptureScreen's square
 * Library/shutter buttons) rest at a different shadow size than Button's
 * own shadow-md. Callers pair this with their own `shadow-{size}
 * hover:shadow-{next size}` classes.
 */
export const pressInteraction =
  '[@media(hover:hover)]:hover:-translate-x-0.5 [@media(hover:hover)]:hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-[transform,box-shadow] duration-100'

export function Button({ variant = 'primary', size = 'default', disabled, type = 'button', ...props }: ButtonProps) {
  const fill = disabled ? 'bg-disabled' : variantFill[variant]
  const interaction = disabled ? 'shadow-none' : `shadow-md [@media(hover:hover)]:hover:shadow-lg ${pressInteraction}`

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={[
        'border border-pure-black text-label-bold text-on-surface',
        sizeClasses[size],
        focusRing,
        fill,
        interaction,
      ].join(' ')}
      {...props}
    />
  )
}
