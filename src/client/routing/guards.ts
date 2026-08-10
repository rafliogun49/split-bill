// Decides whether a route may render, or must redirect instead, given some
// piece of state the route depends on (issue #22 / ADR-0009). Two callers:
//
//  - Bill-dependent routes (Bill editor onward) pass the Bill loaded from
//    localStorage; a route with no active Bill redirects to Start.
//  - Transient, in-memory-only routes (Parsing, parse failure) pass the
//    captured File / failure reason that was set by the previous screen;
//    neither survives a reload, so a route reached with neither redirects
//    back to Capture instead of rendering broken state.
//
// Returns the redirect target, or null when the route should render as normal.
export function redirectWhenMissing<T>(value: T | null, fallback: string): string | null {
  return value === null ? fallback : null
}
