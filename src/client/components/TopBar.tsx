import { copy } from '../copy'
import { focusRing } from './focusRing'
import { HistoryIcon } from '../icons'

export interface TopBarProps {
  /** Omitted on screens with nothing to exit yet, e.g. the Start screen. */
  onExit?: () => void
  /**
   * History (issue #31 / ADR-0008) is reachable from every screen, unlike
   * `onExit` — so unlike that prop, this one has no undefined case to
   * render around.
   */
  onHistory: () => void
}

// DESIGN.md §6/§8: the one top bar, sticky, white, bottom border only,
// wordmark left, History icon and exit right. The only two navigation
// destinations it ever carries.
export function TopBar({ onExit, onHistory }: TopBarProps) {
  return (
    <header className="sticky top-0 flex min-h-12 items-center justify-between border-b border-pure-black bg-surface-container-lowest px-4">
      <span className="text-label-bold uppercase text-on-surface">{copy.wordmark}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onHistory}
          aria-label={copy.topBar.history}
          className={`text-on-surface ${focusRing}`}
        >
          <HistoryIcon className="h-6 w-6" />
        </button>
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
      </div>
    </header>
  )
}
