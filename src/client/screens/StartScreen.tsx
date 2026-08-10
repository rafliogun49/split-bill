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

// Issue #23: graph-paper backdrop behind the landing hero — thin black lines
// at low opacity on white. Inline rather than a Tailwind background-image
// utility so the two-axis line grid can be expressed as a single value;
// still just pure-black at partial alpha, so DESIGN.md §2's token list gains
// nothing new.
const graphPaperStyle = {
  backgroundImage:
    'linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

// DESIGN.md §5's carve-out for this screen only: fade/slide-in on the hero,
// a hover lift on the How-it-works/Features cards. `motion-reduce:` mirrors
// ProgressCard's existing `animate-none` idiom so both entrance and hover
// motion drop out together under prefers-reduced-motion. Takes the hover
// shadow as a parameter because How-it-works cards rest at shadow-sm and
// Features cards rest at no shadow — each should step up exactly one tier,
// not converge on the same hover shadow.
function cardMotion(hoverShadow: 'shadow-sm' | 'shadow-md') {
  return `animate-fade-slide-up transition-[transform,box-shadow] duration-200 motion-reduce:animate-none motion-reduce:transition-none [@media(hover:hover)]:hover:-translate-x-0.5 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:${hoverShadow}`
}

// Issue #23: the one decorative asset DESIGN.md §9 screen 1 allows beside the
// hero copy on desktop. Deliberately not exported from ../icons — that
// module is DESIGN.md §8's closed ~14-glyph functional set, and this is a
// one-off ornament used only here, not a reusable icon. Solid currentColor
// fill, zero radius, same visual language as that set even though it isn't
// part of it. The zigzag hem is one evenodd path so it stays a single flat
// shape, no gradients or strokes.
function ReceiptIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 2h72v128.7l-9-7-9 7-9-7-9 7-9-7-9 7-9-7-9 7V2Zm4 4v115.3l5-3.9 9 7 9-7 9 7 9-7 9 7 9-7 5 3.9V6H18Z"
      />
      <rect x="28" y="22" width="44" height="6" />
      <rect x="28" y="38" width="44" height="6" />
      <rect x="28" y="54" width="30" height="6" />
      <rect x="28" y="76" width="44" height="6" />
      <rect x="28" y="92" width="20" height="6" />
    </svg>
  )
}

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
      <section className="w-full" style={graphPaperStyle}>
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-16 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:text-left">
          <div className="flex flex-col items-center gap-8 animate-fade-slide-up motion-reduce:animate-none lg:items-start">
            <div>
              <h1 className="text-display-xl uppercase text-on-surface">{copy.wordmark}</h1>
              <p className="mt-4 text-headline-sm uppercase text-on-surface">{copy.start.tagline}</p>
            </div>

            <div className="flex w-full max-w-sm flex-col items-center gap-4 lg:items-start">
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
          </div>

          {/* DESIGN.md §9 screen 1: a static receipt ornament beside the hero
              copy on desktop only — mobile stays copy-first. Static means
              static: entrance only, no hover motion of its own (that's the
              cards' job) — the resting -rotate-3 here must match the
              receipt-in keyframe's 100% frame in tailwind.config.ts, or the
              entrance animation will hand off with a visible snap. */}
          <div className="hidden shrink-0 lg:block" aria-hidden="true">
            <ReceiptIllustration className="h-64 w-48 -rotate-3 animate-receipt-in text-on-surface motion-reduce:animate-none" />
          </div>
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
                className={`flex flex-col gap-4 border border-pure-black bg-surface-container-lowest p-6 shadow-sm ${cardMotion('shadow-md')}`}
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
              <div key={feature.title} className={`flex gap-3 border border-pure-black p-6 ${cardMotion('shadow-sm')}`}>
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
