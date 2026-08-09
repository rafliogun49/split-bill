# Client-side routing over `App.tsx`'s screen enum

Each screen (Start, Capture, Parsing, Bill editor, Diner setup, Assignment, Summary, History) gets a real URL via a client-side router, in place of `App.tsx`'s `useState<Screen>` switch. The bundle stays a single SPA — there is no server round-trip between screens, and the Hono Worker still only serves `/api/*` plus the prerendered landing document (ADR-0010).

The flow is strictly linear and single-operator (ADR-0001), so this is not about letting people jump around non-linearly — Assignment still requires a Bill with Diners, same guards as today. It's about the browser's own back/forward and refresh matching what the screen enum could never give it: refreshing on Assignment stays on Assignment (the Bill is already in `localStorage`) instead of bouncing to Start, and back-navigation is predictable instead of exiting the tab or doing nothing.

## Consequences

- Transient, file-holding screens (Capture with a picked file, Parsing with an in-flight request) use history *replacement*, not push — back from the Bill editor must not land on a stale Parsing screen that has no file to resume.
- A route with no active Bill in `localStorage` (e.g. a bookmarked `/assignment` with none) redirects to Start rather than rendering broken state — the guard that used to live in `App.tsx`'s conditional rendering moves to the route level.
- Screen URLs are not a public API — nothing here implies a link should ever point at `/assignment`; the guard above exists for correctness under refresh/back, not to invite bookmarking or SEO surfaces (see ADR-0010's `noindex`).
