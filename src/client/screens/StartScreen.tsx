import { useState } from 'react'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { focusRing } from '../components/focusRing'
import { copy } from '../copy'
import { CameraIcon } from '../icons'

export interface StartScreenProps {
  /** Whether a Bill is already in progress, offering Resume over starting fresh. */
  hasActiveBill: boolean
  onPhotograph: () => void
  onEnterManually: () => void
  onResume: () => void
  onNewBill: () => void
}

// Number-badge fill per How-it-works step, diner-1/2/3 in order — matches
// `docs/design/Split Bill App Redesign - Standalone.html` screen 1 exactly
// (that HTML export is normative; the prose in vibrant-neobrutalism-mockup.md
// is a derived summary and loses fidelity where the two disagree).
const stepFills = ['bg-diner-1', 'bg-diner-2', 'bg-diner-3']

// DESIGN.md §5's carve-out for this screen only: fade/slide-in on the hero
// card. `motion-reduce:` mirrors ProgressCard's existing `animate-none`
// idiom.
const heroMotion = 'animate-fade-slide-up motion-reduce:animate-none'

// The mockup's Start hero shows a live-looking mini receipt beside the copy
// on desktop — a real (decorative, `aria-hidden`) line-item breakdown, not
// an abstract illustration. Content comes from `copy.start.receiptPreview`.
function ReceiptPreview() {
  const { place, items, total } = copy.start.receiptPreview
  return (
    <div
      aria-hidden="true"
      className="w-64 -rotate-2 border border-pure-black bg-surface-container-lowest p-5 shadow-lg animate-receipt-in motion-reduce:animate-none"
    >
      <p className="text-label-bold uppercase text-on-surface">{place}</p>
      <div className="mt-2 border-t border-pure-black" />
      <div className="mt-3 flex flex-col gap-1 text-label-sm text-on-surface">
        {items.map((item) => (
          <div key={item.name} className="flex justify-between gap-4">
            <span>{item.name}</span>
            <span>{item.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-dashed border-pure-black" />
      <div className="mt-3 flex justify-between text-label-bold uppercase text-on-surface">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  )
}

// DESIGN.md screen 1. Once a Bill exists this is the minimal Resume / New
// Bill choice — New Bill is a two-step action so a mistap can't discard work
// silently. Before any Bill exists it's a short landing page making the case
// for the app to someone arriving cold, carrying the landing-only ornament
// (folded corner, receipt preview, entrance motion) — neither applies once
// `hasActiveBill` is true.
export function StartScreen({ hasActiveBill, onPhotograph, onEnterManually, onResume, onNewBill }: StartScreenProps) {
  const [confirmingNewBill, setConfirmingNewBill] = useState(false)

  if (hasActiveBill) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="w-full border border-pure-black bg-surface-container-lowest p-8 shadow-lg">
          <h1 className="text-headline-md uppercase text-on-surface">{copy.start.returningTitle}</h1>

          {!confirmingNewBill ? (
            <div className="mt-6 flex w-full flex-col gap-3">
              <Button variant="primary" onClick={onResume}>
                {copy.start.resume}
              </Button>
              <Button variant="secondary" onClick={() => setConfirmingNewBill(true)}>
                {copy.start.newBill}
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex w-full flex-col gap-3">
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
      </div>
    )
  }

  return (
    <div className={`flex w-full flex-col ${heroMotion}`}>
      {/* Full-bleed, edge to edge — matches the mockup HTML exactly (the
          landing hero fills the viewport, no dot-textured gutter around it)
          and the rest of the app's own convention of not centering screens
          into a narrow column (see e.g. BillEditorScreen). */}

      {/* Hero band — full `primary-container` fill per the mockup HTML
          (screen 1's actual rendered hero, not the prose summary), with a
          white/`surface-container-lowest` CTA button so it still reads
          against the orange fill. */}
      <div className="relative flex w-full flex-col gap-6 border-b border-pure-black bg-primary-container px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-10 md:px-14 md:py-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-display-xl uppercase text-on-surface">{copy.start.headline}</h1>
          <p className="max-w-md text-body-md text-on-surface">{copy.start.tagline}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={onPhotograph}>
              <span className="flex items-center gap-2">
                <CameraIcon className="h-5 w-5" />
                {copy.start.photographReceipt}
              </span>
            </Button>
            <button
              type="button"
              onClick={onEnterManually}
              className={`text-label-bold text-on-surface underline ${focusRing}`}
            >
              {copy.start.enterManually}
            </button>
          </div>
        </div>

        {/* Receipt preview — desktop only, matches the mockup's hero. */}
        <div className="hidden shrink-0 md:block">
          <ReceiptPreview />
        </div>
      </div>

      {/* How it works + features. */}
      <div className="w-full border-b border-pure-black bg-surface-container-lowest px-4 py-10 sm:px-6 md:px-14 md:py-16">
        <h2 className="text-headline-sm uppercase text-on-surface">{copy.start.howItWorksTitle}</h2>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
          <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-3">
            {copy.start.howItWorks.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3 md:flex-col md:gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center border border-pure-black text-label-bold text-on-surface ${stepFills[index % stepFills.length]}`}
                >
                  {index + 1}
                </span>
                <p className="text-body-md text-on-surface md:hidden">
                  {step.title} {step.body}
                </p>
                <div className="hidden md:block">
                  <p className="text-label-bold uppercase text-on-surface">{step.title}</p>
                  <p className="mt-1 text-label-sm text-on-surface">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:w-64 md:shrink-0 md:border-l md:border-pure-black md:pl-10">
            {copy.start.features.map((feature) => (
              <div key={feature} className="border border-pure-black bg-surface-container-lowest p-4 text-label-bold text-on-surface">
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-label-sm text-on-surface-variant">{copy.start.photoNeverStored}</p>
      </div>

      {/* Footer note. Folded corner (border-triangle trick) sits at the
          bottom-left corner here, matching the mockup HTML — not on the
          hero, where the prose summary places it. */}
      <div className="relative w-full bg-surface-container-lowest px-4 py-6 text-center sm:px-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 border-b-[28px] border-l-[28px] border-b-diner-1 border-l-transparent"
        />
        <p className="text-label-sm text-on-surface-variant">{copy.start.footerNote}</p>
      </div>
    </div>
  )
}
