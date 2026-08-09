import { useState } from 'react'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { copy } from '../copy'
import { CameraIcon, CheckIcon, PencilIcon } from '../icons'

export interface StartScreenProps {
  /** Whether a Bill is already in progress, offering Resume over starting fresh. */
  hasActiveBill: boolean
  onPhotograph: () => void
  onEnterManually: () => void
  onResume: () => void
  onNewBill: () => void
}

// Numeral accent per How-it-works step — cycles the Diner scale purely as
// decoration; this screen has no Diner chips of its own so there's no
// semantic collision (DESIGN.md §2 Diner scale).
const stepAccents = ['text-diner-1', 'text-diner-4', 'text-diner-5']

// DESIGN.md screen 1. Once a Bill exists this is the minimal Resume / New
// Bill choice — New Bill is a two-step action so a mistap can't discard work
// silently. Before any Bill exists it's a short landing page making the case
// for the app to someone arriving cold.
export function StartScreen({ hasActiveBill, onPhotograph, onEnterManually, onResume, onNewBill }: StartScreenProps) {
  const [confirmingNewBill, setConfirmingNewBill] = useState(false)

  if (hasActiveBill) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
        <div>
          <h1 className="text-display-xl uppercase text-on-surface">{copy.wordmark}</h1>
          <p className="mt-2 text-headline-sm text-on-surface">{copy.start.tagline}</p>
        </div>

        {!confirmingNewBill ? (
          <div className="flex w-full flex-col gap-3">
            <Button variant="primary" onClick={onResume}>
              {copy.start.resume}
            </Button>
            <Button variant="secondary" onClick={() => setConfirmingNewBill(true)}>
              {copy.start.newBill}
            </Button>
          </div>
        ) : (
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
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center">
      <section className="flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center">
        <div>
          <h1 className="text-display-xl uppercase text-on-surface">{copy.wordmark}</h1>
          <p className="mt-4 text-headline-sm uppercase text-on-surface">{copy.start.tagline}</p>
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <Button variant="primary" size="hero" onClick={onPhotograph}>
            <CameraIcon className="h-16 w-16" />
            <span className="text-headline-sm uppercase">{copy.start.photographReceipt}</span>
          </Button>
          <Button variant="secondary" onClick={onEnterManually}>
            <span className="flex items-center justify-center gap-2">
              <PencilIcon className="h-5 w-5" />
              {copy.start.enterManually}
            </span>
          </Button>
          <p className="text-label-sm text-on-surface-variant">{copy.start.photoNeverStored}</p>
        </div>
      </section>

      <section className="w-full border-t border-pure-black bg-surface-variant px-4 py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <h2 className="text-center text-headline-md uppercase text-on-surface md:text-left">
            {copy.start.howItWorksTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {copy.start.howItWorks.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col gap-4 border border-pure-black bg-surface-container-lowest p-6 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center bg-pure-black text-headline-sm ${stepAccents[index % stepAccents.length]}`}
                >
                  {index + 1}
                </div>
                <h3 className="text-headline-sm uppercase text-on-surface">{step.title}</h3>
                <p className="text-body-md text-on-surface">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-t border-pure-black px-4 py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <h2 className="text-center text-headline-md uppercase text-on-surface md:text-left">
            {copy.start.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {copy.start.features.map((feature) => (
              <div key={feature.title} className="flex gap-3 border border-pure-black p-6">
                <CheckIcon className="h-6 w-6 shrink-0 text-on-surface" />
                <div>
                  <h3 className="text-headline-sm uppercase text-on-surface">{feature.title}</h3>
                  <p className="mt-1 text-body-md text-on-surface">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-pure-black bg-surface-container-lowest px-4 py-8 text-center">
        <p className="text-label-bold uppercase text-on-surface">{copy.wordmark}</p>
        <p className="mt-1 text-label-sm text-on-surface-variant">{copy.start.footerTagline}</p>
      </footer>
    </div>
  )
}
