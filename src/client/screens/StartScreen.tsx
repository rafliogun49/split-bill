import { useState } from 'react'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { copy } from '../copy'

export interface StartScreenProps {
  /** Whether a Bill is already in progress, offering Resume over starting fresh. */
  hasActiveBill: boolean
  onPhotograph: () => void
  onEnterManually: () => void
  onResume: () => void
  onNewBill: () => void
}

// DESIGN.md screen 1. No menus, no landing page — this is the only place a
// Payer can be. With an active Bill, Resume sits above New Bill and New
// Bill is a two-step action so a mistap can't discard work silently.
export function StartScreen({ hasActiveBill, onPhotograph, onEnterManually, onResume, onNewBill }: StartScreenProps) {
  const [confirmingNewBill, setConfirmingNewBill] = useState(false)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div>
        <h1 className="text-display-xl uppercase text-on-surface">{copy.wordmark}</h1>
        <p className="mt-2 text-headline-sm text-on-surface">{copy.start.tagline}</p>
      </div>

      {hasActiveBill && !confirmingNewBill && (
        <div className="flex w-full flex-col gap-3">
          <Button variant="primary" onClick={onResume}>
            {copy.start.resume}
          </Button>
          <Button variant="secondary" onClick={() => setConfirmingNewBill(true)}>
            {copy.start.newBill}
          </Button>
        </div>
      )}

      {hasActiveBill && confirmingNewBill && (
        <div className="flex w-full flex-col gap-3">
          <Banner variant="alert">
            <p className="text-label-bold uppercase">{copy.start.newBillWarningTitle}</p>
            <p className="mt-1 text-body-md">{copy.start.newBillWarningBody}</p>
          </Banner>
          <Button variant="danger" onClick={onNewBill}>
            {copy.start.confirmNewBill}
          </Button>
          <Button variant="secondary" onClick={() => setConfirmingNewBill(false)}>
            {copy.start.cancelNewBill}
          </Button>
        </div>
      )}

      {!hasActiveBill && (
        <div className="flex w-full flex-col items-center gap-3">
          <Button variant="primary" onClick={onPhotograph}>
            {copy.start.photographReceipt}
          </Button>
          <Button variant="secondary" onClick={onEnterManually}>
            {copy.start.enterManually}
          </Button>
          <p className="text-label-sm text-on-surface-variant">{copy.start.photoNeverStored}</p>
        </div>
      )}
    </div>
  )
}
