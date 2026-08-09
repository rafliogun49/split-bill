# Split Bill

A single Cloudflare Worker serving a React (Vite) SPA, with a Hono API mounted at `/api/*`. See `CONTEXT.md` for the domain glossary and `DESIGN.md` for the UI system — both are normative and should be read before touching app code. `docs/adr/0002-pure-core-not-mvc.md` is normative for where code lives.

## Scripts

```
pnpm dev        # vite dev — SPA + Worker, with HMR
pnpm build      # vite build — client assets to dist/client, worker to dist/split_bill
pnpm test       # vitest run
pnpm typecheck  # tsc --noEmit
pnpm deploy     # build, then wrangler deploy
```

## Layout

Three layers per ADR-0002 — no `model/`, no `services/` on top of routes:

```
src/domain/           Pure TypeScript. No React, no fetch, no Hono. Bill, Diner, LineItem,
                       Adjustment and calculateSplit() live here (issue #4) — the one module
                       meant to be deep. Zero-mocking unit tests.

src/server/
  routes/              Hono handlers, one file per route group. Thin by design — no business
                       rules (ADR-0002); they call src/domain and the AI client.
  ai/                  OpenRouter client (issues #10/#11) — the parsing/self-check logic hides
                       behind parseReceipt(), with OpenRouter injected as a port so tests use a
                       mock adapter instead of the real API.
  index.ts             Hono app assembly — the Worker's only job is holding the OpenRouter key
                       off the client (ADR-0001).

src/client/
  screens/             The 11 screens named in DESIGN.md §9 (issues #5-#10).
  components/          The 14 shared components named in DESIGN.md §8.
  persistence/         Bill <-> localStorage seam (ADR-0001) — loadBill()/saveBill()/clearBill(),
                       so swapping in D1 later touches this module only.
  main.tsx             Entry point.

src/design/            Design tokens — single source of truth for tailwind.config.ts — and their
                       tests (contrast, deleted tokens, no dark mode).
```

`screens/`, `components/`, `persistence/`, `ai/` and `src/domain/` don't exist yet — they land with the issues noted above rather than as empty placeholder folders.

Tailwind's theme carries Material 3 token names at pastel values (ADR-0007) — tokens DESIGN.md doesn't define are absent from the theme rather than overridden, so referencing one fails visibly. `src/design/tokens.ts` is the single source; `tailwind.config.ts` builds the theme from it.
