import { copy } from '../copy'
import { focusRing } from './focusRing'

export interface TopBarProps {
  /** Omitted on screens with nothing to exit yet, e.g. the Start screen. */
  onExit?: () => void
}

// DESIGN.md §6/§8: the one top bar, sticky, white, bottom border only,
// wordmark left, exit right. No navigation — there is nowhere else to go.
export function TopBar({ onExit }: TopBarProps) {
  return (
    <header className="sticky top-0 flex min-h-12 items-center justify-between border-b border-pure-black bg-surface-container-lowest px-4">
      <span className="text-label-bold uppercase text-on-surface">{copy.wordmark}</span>
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          aria-label={copy.topBar.exit}
          className={`text-label-bold uppercase text-on-surface ${focusRing}`}
        >
          ✕
        </button>
      )}
    </header>
  )
}
