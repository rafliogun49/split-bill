import { copy } from '../client/copy'

// The placeholder the built shell's `index.html` always ships with, for
// React to mount into (see repo-root `index.html`). The landing route's
// prerendered document swaps its emptiness for real markup; every other
// route leaves it untouched (ADR-0010).
const ROOT_PLACEHOLDER = '<div id="root"></div>'

// Escapes text content for interpolation into hand-written HTML strings.
// `copy.ts` doesn't currently contain markup-significant characters, but
// this keeps the generator safe if it ever does.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Mirrors StartScreen.tsx's no-active-bill branch (DESIGN.md §9 screen 1) —
// hero, "How it works", "Why Split Bill", footer — as a plain HTML string
// built from the same `copy.start.*` source. Pure and framework-free: no
// DOM, no fetch, no React — directly testable with plain string assertions
// (issue #29's "no headless browser needed" requirement) — and it's the one
// seam issue #30 can extend with title/meta/OG/JSON-LD without touching the
// routing/asset-splicing side of this feature.
//
// Deliberately not interactive markup (no real `<button>` or `<a href>` into
// the app): the whole app is client-rendered (ADR-0001), so nothing here
// does anything until the SPA bundle boots and takes over `#root`. ADR-0010
// also means the in-app routes are meant to stay undiscoverable to
// crawlers, so this generator doesn't hand one a link to follow.
export function renderLandingContent(): string {
  const howItWorks = copy.start.howItWorks
    .map(
      (step, index) => `
        <li class="flex flex-col gap-4 border border-pure-black bg-surface-container-lowest p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center bg-pure-black text-headline-sm text-on-primary">${index + 1}</div>
          <h3 class="text-headline-sm uppercase text-on-surface">${escapeHtml(step.title)}</h3>
          <p class="text-body-md text-on-surface">${escapeHtml(step.body)}</p>
        </li>`,
    )
    .join('')

  const features = copy.start.features
    .map(
      (feature) => `
        <li class="flex gap-3 border border-pure-black p-6">
          <div>
            <h3 class="text-headline-sm uppercase text-on-surface">${escapeHtml(feature.title)}</h3>
            <p class="mt-1 text-body-md text-on-surface">${escapeHtml(feature.body)}</p>
          </div>
        </li>`,
    )
    .join('')

  return `
    <div class="flex w-full flex-col items-center">
      <section class="w-full">
        <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-16 text-center">
          <div>
            <h1 class="text-display-xl uppercase text-on-surface">${escapeHtml(copy.wordmark)}</h1>
            <p class="mt-4 text-headline-sm uppercase text-on-surface">${escapeHtml(copy.start.tagline)}</p>
          </div>
          <p class="text-headline-sm uppercase text-on-surface">${escapeHtml(copy.start.photographReceipt)}</p>
          <p class="text-label-sm text-on-surface-variant">${escapeHtml(copy.start.enterManually)}</p>
          <p class="text-label-sm text-on-surface-variant">${escapeHtml(copy.start.photoNeverStored)}</p>
        </div>
      </section>

      <section class="w-full border-t border-pure-black bg-surface-variant px-4 py-16">
        <div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <h2 class="text-center text-headline-md uppercase text-on-surface">${escapeHtml(copy.start.howItWorksTitle)}</h2>
          <ul class="grid grid-cols-1 gap-6 md:grid-cols-3">${howItWorks}</ul>
        </div>
      </section>

      <section class="w-full border-t border-pure-black px-4 py-16">
        <div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <h2 class="text-center text-headline-md uppercase text-on-surface">${escapeHtml(copy.start.featuresTitle)}</h2>
          <ul class="grid grid-cols-1 gap-6 md:grid-cols-3">${features}</ul>
        </div>
      </section>

      <footer class="w-full border-t border-pure-black bg-surface-container-lowest px-4 py-8 text-center">
        <p class="text-label-bold uppercase text-on-surface">${escapeHtml(copy.wordmark)}</p>
        <p class="mt-1 text-label-sm text-on-surface-variant">${escapeHtml(copy.start.footerTagline)}</p>
      </footer>
    </div>`
}

// Splices `renderLandingContent()`'s markup into the app's built shell
// (`dist/client/index.html`, fetched from the Workers Assets binding at
// request time — see the `/` route in `src/server/index.ts`) by replacing
// the empty root div the shell always ships with. Reusing the real built
// shell — rather than hand-assembling `<script>`/`<link>` tags here — means
// this stays correct automatically as Vite's hashed asset filenames change
// from build to build. Pure string transform — no fetch, no DOM — so it's
// testable with a literal shell string, same as `renderLandingContent`.
export function buildLandingDocument(shellHtml: string): string {
  if (!shellHtml.includes(ROOT_PLACEHOLDER)) {
    throw new Error(`landingDocument: expected shell HTML to contain '${ROOT_PLACEHOLDER}'`)
  }
  return shellHtml.replace(ROOT_PLACEHOLDER, `<div id="root">${renderLandingContent()}</div>`)
}
