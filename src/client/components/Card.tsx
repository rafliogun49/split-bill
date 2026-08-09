import type { HTMLAttributes } from 'react'

// DESIGN.md §8: the universal container — white fill, 4px border, shadow-lg.
export function Card({ children, ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'className'>) {
  return (
    <div className="border border-pure-black bg-surface-container-lowest p-6 shadow-lg" {...props}>
      {children}
    </div>
  )
}
