# Prerendered landing page; everything else `noindex`

Start's pre-Bill landing content (DESIGN.md §9 screen 1) is prerendered to static HTML at build time and served directly by the Hono Worker at `/`, so a crawler that doesn't execute JavaScript — true of most AI crawlers, and not guaranteed for search ones — still sees the real hero, How it works, and Features copy instead of an empty SPA shell. Structured data (`SoftwareApplication` JSON-LD), OpenGraph tags, `robots.txt`, `sitemap.xml`, and an `llms.txt` describing the app all point at this one document.

Every route from Start's active-Bill state onward (Capture through Summary, and History) carries `noindex` and gets no prerendering. This isn't an oversight to fix later — indexing those routes would be wrong on the merits. Their content is one person's Bill, held only in their browser (ADR-0001); there is nothing there that is the same for two visitors, nothing a search result could usefully link to, and nothing that should be discoverable by a crawler in the first place.

## Consequences

- Only one document is prerendered. Adding a second marketing page later (e.g. a `/pricing` or `/about`) would need this decision revisited — no such page exists today and DESIGN.md §6 rules out inventing nav destinations toward one.
- The prerendered document and `StartScreen.tsx`'s landing JSX must stay in sync by hand — there is no shared template between the build-time render and the client component. A copy change to the hero/How-it-works/Features content updates both.
- `robots.txt` disallows everything under the Bill-flow routes explicitly, rather than relying on `noindex` meta tags alone, since a Bill route can be reached client-side without a fresh server response to carry the tag.
