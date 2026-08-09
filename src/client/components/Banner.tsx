import type { HTMLAttributes } from 'react'

export type BannerVariant = 'neutral' | 'alert'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant: BannerVariant
}

const fillByVariant: Record<BannerVariant, string> = {
  neutral: 'bg-surface-container-lowest',
  alert: 'bg-error-container',
}

// DESIGN.md §8: neutral (white) and alert (error-container) only. The
// `sr-only` prefix and the `alert` vs `status` role carry the distinction
// in text and semantics, not only in fill — a Diner who can't perceive the
// colour still knows which kind of Banner this is.
export function Banner({ variant, children, ...props }: BannerProps) {
  return (
    <div
      role={variant === 'alert' ? 'alert' : 'status'}
      className={`flex items-start gap-3 border border-pure-black p-4 text-body-md text-on-surface shadow-md ${fillByVariant[variant]}`}
      {...props}
    >
      {variant === 'alert' && <span className="sr-only">Alert:</span>}
      <div>{children}</div>
    </div>
  )
}
