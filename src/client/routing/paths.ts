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
} as const
