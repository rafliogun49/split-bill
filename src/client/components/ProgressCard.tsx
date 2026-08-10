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

const badgeFillByStatus: Record<ProgressStepStatus, string> = {
  done: 'bg-diner-2',
  active: 'bg-diner-1 animate-blink motion-reduce:animate-none',
  pending: 'bg-surface-container-lowest',
}

// DESIGN.md screen 3 / Standalone.html screen 3: a receipt-shaped
// illustration with a top-to-bottom scan-line replaces the old fill track,
// and each step gets its own badge — green check (done), blinking blue
// (active), plain white-with-border (pending, not a grey "inert" fill).
// `role="progressbar"` moves onto the illustration itself, since that's the
// element carrying the animation, and keeps the same honest-indeterminate
// contract as before: aria-valuenow is omitted rather than fabricated when
// `progress` is null (ARIA's own indeterminate convention). Motion
// carve-out: DESIGN.md §5 allows this screen (and Start) to animate beyond
// shadow/position; `motion-reduce:animate-none` still drops both the
// scan-line and the active badge's blink for reduced-motion users.
export function ProgressCard({ progress, steps, cancelLabel, onCancel }: ProgressCardProps) {
  const determinate = progress !== null

  return (
    <Card>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={determinate ? Math.round(progress) : undefined}
          className="relative h-[130px] w-[110px] shrink-0 overflow-hidden border border-pure-black bg-surface-container-lowest p-3.5"
        >
          <div aria-hidden="true">
            <div className="mb-2 h-2 w-[70%] bg-on-surface" />
            <div className="mb-1.5 h-1.5 w-[90%] bg-surface-variant" />
            <div className="mb-1.5 h-1.5 w-[60%] bg-surface-variant" />
            <div className="mb-1.5 h-1.5 w-[75%] bg-surface-variant" />
            <div className="mb-1.5 h-1.5 w-[50%] bg-surface-variant" />
            <div className="h-1.5 w-[80%] bg-surface-variant" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 animate-scan bg-diner-1 motion-reduce:animate-none"
          />
        </div>

        <div className="flex w-full flex-col gap-6">
          <ol className="flex flex-col gap-3">
            {steps.map((step) => (
              <li
                key={step.label}
                aria-current={step.status === 'active' ? 'step' : undefined}
                className={`flex items-center gap-3 text-body-md ${
                  step.status === 'pending' ? 'text-on-surface-variant' : 'text-on-surface'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border border-pure-black ${badgeFillByStatus[step.status]}`}
                >
                  {step.status === 'done' && <CheckIcon className="h-3 w-3 text-on-surface" />}
                </span>
                {step.label}
              </li>
            ))}
          </ol>

          <div>
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
