import { CheckIcon } from '../icons'
import { Button } from './Button'
import { Card } from './Card'

export type ProgressStepStatus = 'done' | 'active' | 'pending'

export interface ProgressStep {
  label: string
  status: ProgressStepStatus
}

export interface ProgressCardProps {
  /** 0–100, or `null` when the stage's completion can't be known. */
  progress: number | null
  steps: ProgressStep[]
  cancelLabel: string
  onCancel: () => void
}

// DESIGN.md §9 screen 3 / vibrant-neobrutalism-mockup.md §3: a receipt-shaped
// illustration with a scan-line replaces the old camera-icon badge, and each
// step gets its own badge — green check (`diner-2`) done, blinking blue
// (`diner-1`) active, plain white+border pending. `surface-variant` (grey)
// is deliberately not used for pending — DESIGN.md §10 calls this out by
// name: the mockup's pending state is white+border, not an "inert" grey
// fill. "White" here is `surface-container-lowest` per §2 ("white fill"
// throughout the mockup means that token, never literal `#fff`).
//
// The determinate/indeterminate track below keeps its existing behavior
// (Issue #24, unchanged by #46 — progress is still honest, never a fake
// percentage) but its fill moves off `primary-container` onto `diner-1`:
// DESIGN.md rule 3 reserves `primary-container` for a button fill and
// nothing else, and `diner-1` is already this screen's "in progress" blue
// via the active badge and scan-line.
//
// Motion: DESIGN.md §5's Parsing carve-out is the only place outside Start
// allowed to animate anything but shadow/position — used here for the
// scan-line and the active step's badge, both `motion-reduce:animate-none`
// so reduced-motion users get the static equivalent. `aria-current` already
// carries "this is the active step" for assistive tech, so nothing is lost.
export function ProgressCard({ progress, steps, cancelLabel, onCancel }: ProgressCardProps) {
  const determinate = progress !== null

  return (
    <Card>
      <div className="mb-6 flex justify-center" aria-hidden="true">
        <div className="relative h-28 w-24 overflow-hidden border border-pure-black bg-surface-container-lowest p-3 shadow-sm">
          <div className="mb-2 h-2 w-2/3 bg-on-surface" />
          <div className="mb-1.5 h-1.5 w-11/12 bg-surface-variant" />
          <div className="mb-1.5 h-1.5 w-3/5 bg-surface-variant" />
          <div className="mb-1.5 h-1.5 w-3/4 bg-surface-variant" />
          <div className="mb-1.5 h-1.5 w-1/2 bg-surface-variant" />
          <div className="h-1.5 w-4/5 bg-surface-variant" />
          <div className="absolute inset-x-0 top-0 h-1 animate-receipt-scan bg-diner-1 motion-reduce:animate-none" />
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(progress) : undefined}
        className="h-8 w-full overflow-hidden border border-pure-black bg-surface-variant"
      >
        <div
          className={
            determinate
              ? 'h-full bg-diner-1 transition-[width] duration-300'
              : 'h-full w-1/3 animate-progress-indeterminate bg-diner-1'
          }
          style={determinate ? { width: `${progress}%` } : undefined}
        />
      </div>

      <ol className="mt-6 flex flex-col gap-3">
        {steps.map((step) => (
          <li
            key={step.label}
            aria-current={step.status === 'active' ? 'step' : undefined}
            className={`flex items-center gap-3 text-body-md ${
              step.status === 'active' ? 'text-on-surface' : 'text-on-surface-variant'
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center border border-pure-black ${
                step.status === 'done'
                  ? 'bg-diner-2'
                  : step.status === 'active'
                    ? 'bg-diner-1 animate-pulse motion-reduce:animate-none'
                    : 'bg-surface-container-lowest'
              }`}
            >
              {step.status === 'done' && <CheckIcon className="h-3 w-3 text-on-surface" />}
            </span>
            {step.label}
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </Card>
  )
}
