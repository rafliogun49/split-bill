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

// DESIGN.md §8: determinate track in surface-variant, fill in
// primary-container, plus a step list; Cancel is a secondary Button. When
// progress is null the fill slides rather than fabricating a percentage
// (DESIGN.md screen 3) — aria-valuenow is omitted in that case for the same
// reason, per the ARIA progressbar spec's own indeterminate convention.
export function ProgressCard({ progress, steps, cancelLabel, onCancel }: ProgressCardProps) {
  const determinate = progress !== null

  return (
    <Card>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(progress) : undefined}
        className="h-3 w-full overflow-hidden border border-pure-black bg-surface-variant"
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

      <ol className="mt-4 flex flex-col gap-2">
        {steps.map((step) => (
          <li
            key={step.label}
            aria-current={step.status === 'active' ? 'step' : undefined}
            className={`flex items-center gap-2 text-body-md ${
              step.status === 'pending' ? 'text-on-surface-variant' : 'text-on-surface'
            }`}
          >
            {step.status === 'done' ? (
              <CheckIcon className="h-4 w-4 shrink-0" />
            ) : (
              <span className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {step.label}
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </Card>
  )
}
