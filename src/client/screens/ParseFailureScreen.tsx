import type { ParseFailureReason } from '../ai/parseReceiptClient'
import { Button } from '../components/Button'
import { focusRing } from '../components/focusRing'
import { copy } from '../copy'
import { WarningTriangleIcon } from '../icons'

export interface ParseFailureScreenProps {
  reason: ParseFailureReason
  onRetry: () => void
  onEnterManually: () => void
}

const wordingByReason: Record<ParseFailureReason, { heading: string; body: string }> = {
  offline: { heading: copy.parseFailure.offlineHeading, body: copy.parseFailure.offlineBody },
  rate_limited: { heading: copy.parseFailure.rateLimitedHeading, body: copy.parseFailure.rateLimitedBody },
  parse_failed: { heading: copy.parseFailure.parseFailedHeading, body: copy.parseFailure.parseFailedBody },
}

// DESIGN.md screen 4 / Standalone.html screens 2 and 4: parse failure,
// offline and rate-limited share one two-band layout — an alert-red band
// with the warning-triangle glyph and headline, a cream band with the cause
// and the primary action — differing only in copy (ADR-0004). Retry is a
// demoted text link back to Capture, not a second full-width button, so the
// mockup's single dominant CTA still reads as primary; the primary action
// always leads into the empty editor, so failure is a detour rather than a
// dead end.
export function ParseFailureScreen({ reason, onRetry, onEnterManually }: ParseFailureScreenProps) {
  const { heading, body } = wordingByReason[reason]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 md:max-w-xl">
      <div role="alert" className="flex flex-col border border-pure-black shadow-lg">
        {/* Banner's own sr-only prefix (Banner.tsx): a Diner who can't
            perceive the red fill still knows this is the alert kind. */}
        <span className="sr-only">Alert:</span>
        <div className="flex flex-col items-center gap-3 bg-error-container px-6 py-8 text-center md:flex-row md:justify-center md:gap-4">
          <WarningTriangleIcon className="h-10 w-10 shrink-0 text-on-surface" />
          <h1 className="text-headline-sm uppercase text-on-surface">{heading}</h1>
        </div>
        <div className="flex flex-col items-stretch gap-4 bg-surface-container-lowest px-6 py-6 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
          <p className="text-body-md text-on-surface-variant">{body}</p>
          <div className="md:shrink-0">
            <Button variant="primary" onClick={onEnterManually}>
              {copy.parseFailure.enterManually}
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className={`self-center text-label-bold uppercase text-on-surface underline ${focusRing}`}
      >
        {copy.parseFailure.retry}
      </button>
    </div>
  )
}
