// The internal URL for every screen (issue #22 / ADR-0009). These are not a
// public API — nothing implies a link should ever point at one of these
// directly; they exist so the browser's own back/forward and refresh behave
// correctly, not to invite bookmarking (ADR-0009, ADR-0010's `noindex`).
export const paths = {
  start: '/',
  capture: '/capture',
  parsing: '/parsing',
  parseFailure: '/parse-failure',
  bill: '/bill',
  diners: '/diners',
  assignment: '/assignment',
  summary: '/summary',
  // History (issue #31 / ADR-0008) sits outside the linear flow above — a
  // TopBar icon reaches it from any screen, and an entry always opens a
  // read-only Summary, never rejoining the flow (DESIGN.md §9 screen 12).
  history: '/history',
  historyEntry: '/history/:id',
} as const

/** Builds the read-only Summary URL for one archived Bill's History id. */
export function historyEntryPath(id: string): string {
  return `/history/${id}`
}
