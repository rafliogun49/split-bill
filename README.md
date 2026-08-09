# Split Bill

A single Cloudflare Worker serving a React (Vite) SPA, with a Hono API mounted at `/api/*`. See `CONTEXT.md` for the domain glossary and `DESIGN.md` for the UI system — both are normative and should be read before touching app code.

## Scripts

```
pnpm dev        # vite dev — SPA + Worker, with HMR
pnpm build      # vite build — client assets to dist/client, worker to dist/split_bill
pnpm test       # vitest run
pnpm typecheck  # tsc --noEmit
pnpm deploy     # build, then wrangler deploy
```

## Layout

```
src/app/      React SPA
src/worker/   Hono app — the Worker's only job is holding secrets off the client (ADR-0001)
src/design/   Design tokens (source of truth for tailwind.config.ts) and their tests
```

Tailwind's theme carries Material 3 token names at pastel values (ADR-0007) — tokens DESIGN.md doesn't define are absent from the theme rather than overridden, so referencing one fails visibly. `src/design/tokens.ts` is the single source; `tailwind.config.ts` builds the theme from it.
