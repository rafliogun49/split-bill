import { useState } from 'react'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { focusRing } from '../components/focusRing'
import { copy } from '../copy'
import { CameraIcon, CheckIcon } from '../icons'

export interface StartScreenProps {
  /** Whether a Bill is already in progress, offering Resume over starting fresh. */
  hasActiveBill: boolean
  onPhotograph: () => void
  onEnterManually: () => void
  onResume: () => void
  onNewBill: () => void
}

// Number-badge fill per How-it-works step, diner-1/2/3 in order (issue #44 /
// DESIGN.md §9 screen 1). Literal `diner-N` fills, styled exactly like
// `DinerChip` (fill + black border + black text, DESIGN.md §8) even though
// this screen has no Diner chips of its own to collide with — purely
// decorative reuse of the scale (DESIGN.md §2 Diner scale).
const stepFills = ['bg-diner-1', 'bg-diner-2', 'bg-diner-3']

// DESIGN.md §8 Ornament, "Zigzag / torn-paper edge": a serrated clip-path
// divider, Start's hero/how-it-works seam only. Built once at module scope
// (not per render — the shape is static) as an alternating triangle wave
// along the bottom edge, flat along the top. `teeth` controls how fine the
// serration reads; 16 matches the mockup's tooth density closely enough
// without the polygon getting unwieldy.
function zigzagClipPath(teeth: number): string {
  const points = ['0% 0%', '100% 0%']
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100
    const y = i % 2 === 0 ? '100%' : '55%'
    points.push(`${x}% ${y}`)
  }
  return `polygon(${points.join(', ')})`
}

const zigzagDividerClipPath = zigzagClipPath(16)

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

// Issue #23 (kept under #44's rebuild): the one decorative asset DESIGN.md
// §9 screen 1 allows beside the hero copy on desktop. Deliberately not
// exported from ../icons — that module is DESIGN.md §8's closed ~14-glyph
// functional set, and this is a one-off ornament used only here, not a
// reusable icon. Solid currentColor fill, zero radius, same visual language
// as that set even though it isn't part of it. The zigzag hem is one
// evenodd path so it stays a single flat shape, no gradients or strokes.
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

// DESIGN.md §8 Ornament, "Hand-drawn arrow": a single SVG stroke path
// pointing at the primary CTA, Start desktop hero only. currentColor stroke
// so it inherits `on-surface` — never a token colour of its own.
function HandDrawnArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M84 6c-30 6-62 20-74 44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <path d="M22 38 8 50l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// DESIGN.md screen 1. Once a Bill exists this is the minimal Resume / New
// Bill choice — New Bill is a two-step action so a mistap can't discard work
// silently. Before any Bill exists it's a short landing page making the case
// for the app to someone arriving cold, carrying the landing-only ornament
// from DESIGN.md §8/§9 (folded corner, zigzag divider, hand-drawn arrow,
// rotated card) and the §5 motion carve-out — neither applies once
// `hasActiveBill` is true.
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
      <section className="w-full px-4 py-12 md:px-6 lg:px-10 lg:py-16">
        {/* Hero card. White fill rather than the mockup's literal orange band
            (docs/design/vibrant-neobrutalism-mockup.md §1) — DESIGN.md §1
            rule 3 is one of the four rules that win over generated design
            evidence on disagreement, and it's explicit that `primary-container`
            "is a button fill and nothing else". The CTA below stays the
            ordinary `primary` (orange) button as a result, instead of the
            mockup's white-on-orange swap. */}
        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 overflow-hidden border border-pure-black bg-surface-container-lowest p-6 shadow-lg animate-fade-slide-up motion-reduce:animate-none sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-14">
          {/* DESIGN.md §8 Ornament "Folded corner": mobile/tablet hero only
              (the mockup places it only on Start's mobile hero card). CSS
              border-triangle trick — width/height 0, one solid edge, one
              transparent, giving a black triangle whose right angle sits at
              the card's own bottom-left corner. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 border-b-[32px] border-l-[32px] border-b-pure-black border-l-transparent lg:hidden"
          />

          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <div>
              <h1 className="text-display-xl uppercase text-on-surface">{copy.wordmark}</h1>
              <p className="mt-4 text-headline-sm uppercase text-on-surface">{copy.start.tagline}</p>
            </div>

            <div className="relative flex w-full max-w-sm flex-col items-center gap-4 lg:items-start">
              <Button variant="primary" size="hero" onClick={onPhotograph}>
                <CameraIcon className="h-16 w-16" />
                <span className="text-headline-sm uppercase">{copy.start.photographReceipt}</span>
              </Button>

              {/* DESIGN.md §8 Ornament "Hand-drawn arrow": desktop hero only,
                  in the gap beside the CTA, curving in from the upper right
                  to point at its edge. */}
              <HandDrawnArrow className="pointer-events-none absolute -right-24 top-2 hidden h-14 w-20 text-on-surface lg:block" />

              <button
                type="button"
                onClick={onEnterManually}
                className={`text-label-bold uppercase text-on-surface underline ${focusRing}`}
              >
                {copy.start.enterManually}
              </button>
              <p className="text-label-sm text-on-surface-variant">{copy.start.photoNeverStored}</p>
            </div>
          </div>

          {/* DESIGN.md §8 Ornament "Rotated card": Start desktop hero's
              receipt-preview illustration only, mimicking a photo dropped on
              a desk. Static means static: entrance only, no hover motion of
              its own (that's the How-it-works/Features cards' job) — the
              resting -rotate-2 here must match the receipt-in keyframe's
              100% frame in tailwind.config.ts, or the entrance animation
              hands off with a visible snap. */}
          <div className="hidden shrink-0 lg:block" aria-hidden="true">
            <div className="-rotate-2 border border-pure-black bg-surface-container-lowest p-4 shadow-lg animate-receipt-in motion-reduce:animate-none">
              <ReceiptIllustration className="h-56 w-40 text-on-surface" />
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN.md §8 Ornament "Zigzag / torn-paper edge": Start's
          hero/how-it-works seam, below the breakpoint where the mockup
          says the sections stay visually separate. At lg+ the plain
          border-t below carries the seam instead — "no zigzag divider at
          this width" (vibrant-neobrutalism-mockup.md §1). */}
      <div
        aria-hidden="true"
        className="h-5 w-full bg-pure-black lg:hidden"
        style={{ clipPath: zigzagDividerClipPath }}
      />

      <section className="w-full px-4 py-16 lg:border-t lg:border-pure-black">
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
                  className={`flex h-12 w-12 items-center justify-center border border-pure-black text-headline-sm text-on-surface ${stepFills[index % stepFills.length]}`}
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
              <div
                key={feature.title}
                className={`flex gap-3 border border-pure-black bg-surface-container-lowest p-6 ${cardMotion('shadow-sm')}`}
              >
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
