import { copy } from '../copy'

// DESIGN.md §8 Ornament / screen 5: a rotated "SCANNED" provenance stamp,
// pinned top-right of the Bill editor whenever the Bill was pre-filled from a
// photo. It reports *how the Bill was made*, not *whether the math matches*
// (that's the reconciliation Banner) — the caller renders it independently of
// reconciliation.status, including the 'no-printed-total' case. The parent
// is expected to be `position: relative` so this can sit `absolute` within it.
export function ScannedStamp() {
  return (
    <span className="absolute -top-3 right-4 z-10 -rotate-3 border border-pure-black bg-diner-2 px-2.5 py-1 text-label-sm font-bold uppercase text-on-surface shadow-sm lg:right-6">
      {copy.billEditor.scannedBadge}
    </span>
  )
}
