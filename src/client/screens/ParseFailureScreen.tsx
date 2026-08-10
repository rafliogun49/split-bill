import type { ParseFailureReason } from '../ai/parseReceiptClient'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { copy } from '../copy'
import { WarningIcon } from '../icons'

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

// DESIGN.md screen 4: parse failure, offline and rate-limited share one
// layout and differ only in wording — an alert Banner topped with a large
// warning-triangle graphic, a plain cause, and a primary action into the
// empty editor, so failure is a detour rather than a dead end (ADR-0004).
// Retry is the secondary action: it goes back to Capture rather than into
// the editor.
export function ParseFailureScreen({ reason, onRetry, onEnterManually }: ParseFailureScreenProps) {
  const { heading, body } = wordingByReason[reason]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
      <Banner variant="alert">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <WarningIcon className="h-14 w-14 text-pure-black" />
          <p className="text-headline-sm uppercase">{heading}</p>
          <p className="text-body-md">{body}</p>
        </div>
      </Banner>
      <div className="flex flex-col gap-3">
        <Button variant="primary" onClick={onEnterManually}>
          {copy.parseFailure.enterManually}
        </Button>
        <Button variant="secondary" onClick={onRetry}>
          {copy.parseFailure.retry}
        </Button>
      </div>
    </div>
  )
}
