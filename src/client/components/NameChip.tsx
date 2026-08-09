import { CloseIcon } from '../icons'
import { copy } from '../copy'
import { focusRing } from './focusRing'

export interface NameChipProps {
  name: string
  onAdd: () => void
  onForget: () => void
}

// DESIGN.md §8: remembered Diner names on the setup screen — white fill,
// shadow-sm, tap to add, ✕ to forget. Two buttons rather than a button
// nested in a button, since the add and forget gestures are independent.
export function NameChip({ name, onAdd, onForget }: NameChipProps) {
  return (
    <div className="flex items-center border border-pure-black bg-surface-container-lowest shadow-sm">
      <button
        type="button"
        onClick={onAdd}
        className={`px-3 py-2 text-label-bold text-on-surface ${focusRing}`}
      >
        {name}
      </button>
      <button
        type="button"
        onClick={onForget}
        aria-label={`${copy.dinerSetup.forgetName} ${name}`}
        className={`border-l border-pure-black p-2 text-on-surface ${focusRing}`}
      >
        <CloseIcon className="h-3 w-3" />
      </button>
    </div>
  )
}
