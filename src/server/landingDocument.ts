import { copy } from '../client/copy'

// The placeholder the built shell's `index.html` always ships with, for
// React to mount into (see repo-root `index.html`). The landing route's
// prerendered document swaps its emptiness for real markup; every other
// route leaves it untouched (ADR-0010).
const ROOT_PLACEHOLDER = '<div id="root"></div>'

// The shell's static `<title>`, swapped out for the landing-specific head
// block built by `renderLandingHead()`. Every other route keeps this title
// unchanged (ADR-0010).
const SHELL_TITLE = '<title>Split Bill</title>'

// The shell also ships a blanket `noindex` plus the comment explaining it
// (repo-root `index.html`, issue #30) so every non-root route is uniformly
// uncrawlable without each of them needing to know that. The landing
// document is the one route that *should* be indexed, so this splice strips
// both back out — matched together so the explanatory comment (which talks
// about the tag it sits above) never survives without it.
const NOINDEX_BLOCK = /<!--[\s\S]*?-->\s*<meta name="robots" content="noindex" \/>\s*/

// The deployed origin (see deployment notes / Cloudflare Workers routing) —
// used for the canonical link, OpenGraph `url`, and JSON-LD `url` below.
// There is no single source of truth for this in the repo (no env var, no
// config file carries it), so it's a literal here, same as `copy.ts`'s
// strings are literals.
const CANONICAL_URL = 'https://split-bill.rafsmith.com/'

// Title and meta description are composed from `copy.start.*` — the exact
// strings visible on the page — rather than hand-written, so neither can
// drift from the redesigned landing content (issue #30's acceptance
// criteria) without a copy change updating both.
const LANDING_TITLE = `${copy.wordmark} — ${copy.start.tagline}`
const LANDING_DESCRIPTION = `${copy.start.tagline} ${copy.start.footerNote}`

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
        <li class="border border-pure-black bg-surface-container-lowest p-4 text-label-bold text-on-surface">${escapeHtml(feature)}</li>`,
    )
    .join('')

  return `
    <div class="flex w-full flex-col items-center">
      <section class="w-full px-4 py-8">
        <div class="mx-auto w-full max-w-4xl border border-pure-black">
          <div class="bg-primary-container p-10 text-center">
            <p class="text-label-bold uppercase text-on-surface">${escapeHtml(copy.wordmark)}</p>
            <h1 class="mt-4 text-display-xl uppercase text-on-surface">${escapeHtml(copy.start.headline)}</h1>
            <p class="mt-4 text-body-md text-on-surface">${escapeHtml(copy.start.tagline)}</p>
            <p class="mt-4 text-label-bold uppercase text-on-surface">${escapeHtml(copy.start.photographReceipt)}</p>
            <p class="text-label-sm text-on-surface-variant">${escapeHtml(copy.start.enterManually)}</p>
          </div>

          <div class="border-t border-pure-black bg-surface-container-lowest p-10">
            <h2 class="text-headline-sm uppercase text-on-surface">${escapeHtml(copy.start.howItWorksTitle)}</h2>
            <ul class="grid grid-cols-1 gap-6 md:grid-cols-3">${howItWorks}</ul>
            <ul class="mt-6 flex flex-col gap-3">${features}</ul>
            <p class="mt-6 text-center text-label-sm text-on-surface-variant">${escapeHtml(copy.start.photoNeverStored)}</p>
          </div>

          <footer class="border-t border-pure-black bg-surface-container-lowest px-4 py-8 text-center">
            <p class="text-label-sm text-on-surface-variant">${escapeHtml(copy.start.footerNote)}</p>
          </footer>
        </div>
      </section>
    </div>`
}

// Builds the `SoftwareApplication` JSON-LD payload (issue #30's acceptance
// criteria). `featureList` mirrors `copy.start.features` so it can't assert
// anything the visible page doesn't already say. Escapes `<` so a future
// copy string containing e.g. "</script>" can't break out of the JSON-LD
// script tag it's embedded in below.
function renderJsonLd(): string {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: copy.wordmark,
    description: LANDING_DESCRIPTION,
    url: CANONICAL_URL,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (web browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: copy.start.features,
  }
  return JSON.stringify(payload).replace(/</g, '\\u003c')
}

// The landing document's `<head>` additions: a real `<title>`, meta
// description, OpenGraph tags, and a `SoftwareApplication` JSON-LD block
// (issue #30's acceptance criteria) — all sourced from `copy.start.*` so
// they can't drift from the visible page content. Pure string generation,
// same seam as `renderLandingContent` — directly testable, no DOM/fetch.
export function renderLandingHead(): string {
  return `<title>${escapeHtml(LANDING_TITLE)}</title>
    <meta name="description" content="${escapeHtml(LANDING_DESCRIPTION)}" />
    <link rel="canonical" href="${CANONICAL_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(copy.wordmark)}" />
    <meta property="og:title" content="${escapeHtml(LANDING_TITLE)}" />
    <meta property="og:description" content="${escapeHtml(LANDING_DESCRIPTION)}" />
    <meta property="og:url" content="${CANONICAL_URL}" />
    <script type="application/ld+json">${renderJsonLd()}</script>`
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
  if (!shellHtml.includes(SHELL_TITLE)) {
    throw new Error(`landingDocument: expected shell HTML to contain '${SHELL_TITLE}'`)
  }

  const withHead = shellHtml
    // The landing document is the one route meant to be indexed — every
    // other route keeps the shell's blanket noindex untouched (ADR-0010).
    .replace(NOINDEX_BLOCK, '')
    .replace(SHELL_TITLE, renderLandingHead())

  return withHead.replace(ROOT_PLACEHOLDER, `<div id="root">${renderLandingContent()}</div>`)
}
