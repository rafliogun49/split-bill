import { CameraIcon, CheckIcon } from '../icons'
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

// DESIGN.md §8: determinate track in surface-variant, fill in
// primary-container, plus a step list; Cancel is a secondary Button. When
// progress is null the fill slides rather than fabricating a percentage
// (DESIGN.md screen 3) — aria-valuenow is omitted in that case for the same
// reason, per the ARIA progressbar spec's own indeterminate convention.
//
// Issue #24: the icon badge (existing CameraIcon, no new glyph), track and
// step list are sized up for more presence, and the active step pulses —
// the Motion section's carve-out for this screen (DESIGN.md §5) is the only
// place outside Start that's allowed to animate anything but shadow/position.
// `motion-reduce:animate-none` drops the pulse for reduced-motion users;
// aria-current already carries the same "this is the active step"
// information for assistive tech, so nothing is lost. The badge fill is
// surface-variant, not primary-container — DESIGN.md rule 3 reserves
// primary-container for a button fill and nothing else, and surface-variant
// is already the token for an "inert fill" (§2), which a purely decorative
// badge is.
export function ProgressCard({ progress, steps, cancelLabel, onCancel }: ProgressCardProps) {
  const determinate = progress !== null

  return (
    <Card>
      <div className="mb-6 flex justify-center">
        <div
          className="flex h-20 w-20 items-center justify-center border border-pure-black bg-surface-variant shadow-md animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        >
          <CameraIcon className="h-10 w-10 text-on-surface" />
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
              ? 'h-full bg-primary-container transition-[width] duration-300'
              : 'h-full w-1/3 animate-progress-indeterminate bg-primary-container'
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
              step.status === 'pending' ? 'text-on-surface-variant' : 'text-on-surface'
            } ${step.status === 'active' ? 'animate-pulse motion-reduce:animate-none' : ''}`}
          >
            {step.status === 'done' ? (
              <CheckIcon className="h-5 w-5 shrink-0" />
            ) : (
              <span className="h-5 w-5 shrink-0" aria-hidden="true" />
            )}
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
