import { copy } from '../copy'

export interface DinerChipProps {
  name: string
  /** Diner's position in Bill.diners by join order — picks the diner-N fill (DESIGN.md §"Diner scale": diner-{(index % 6) + 1}). */
  joinIndex: number
  /** A Line Item's chip is "claimed" only where that Diner holds a Share of it; the Diner setup roster always passes true. */
  claimed?: boolean
  /** Renders as a visible count, never as colour or size alone, when a Diner holds more than one Share of a row. */
  shareCount?: number
  isPayer?: boolean
}

// DESIGN.md §8: 44x44 square, diner-N fill, black border, initial in
// label-bold. Claimed carries shadow-sm; unclaimed carries none, so the two
// states never depend on fill alone. Literal class names below (not
// template-built) so Tailwind's content scan can see every diner-N utility.
const dinerFill = [
  'bg-diner-1',
  'bg-diner-2',
  'bg-diner-3',
  'bg-diner-4',
  'bg-diner-5',
  'bg-diner-6',
] as const

export function DinerChip({ name, joinIndex, claimed = true, shareCount, isPayer }: DinerChipProps) {
  const initial = name.trim().charAt(0) || '?'
  const fill = dinerFill[joinIndex % dinerFill.length]
  const label = isPayer ? `${name} — ${copy.dinerSetup.payerBadge}` : name

  return (
    <span
      role="img"
      aria-label={label}
      title={name}
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center border border-pure-black text-label-bold text-on-surface ${fill} ${claimed ? 'shadow-sm' : 'shadow-none'}`}
    >
      {initial}
      {isPayer && (
        <span className="absolute -bottom-1 -left-1 border border-pure-black bg-surface-container-lowest px-1 text-[10px] font-bold leading-tight text-on-surface">
          {copy.dinerSetup.payerBadge}
        </span>
      )}
      {shareCount !== undefined && shareCount > 1 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center border border-pure-black bg-surface-container-lowest px-0.5 text-[10px] font-bold leading-none text-on-surface">
          {shareCount}
        </span>
      )}
    </span>
  )
}
