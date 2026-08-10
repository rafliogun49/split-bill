import { Hono } from 'hono'
import { buildLandingDocument } from './landingDocument'
import { config } from './routes/config'
import { health } from './routes/health'
import { parse } from './routes/parse'

// The OpenRouter key and Turnstile secret (ADR-0001) — real secrets, held in
// .dev.vars locally and `wrangler secret put` in prod, never in wrangler.jsonc.
// The model identifiers and the Turnstile site key are non-secret config and
// live in wrangler.jsonc `vars` (issue #10 / #1: "environment configuration,
// not literals").
export interface Env {
  OPENROUTER_API_KEY: string
  OPENROUTER_MODEL_DEFAULT: string
  OPENROUTER_MODEL_ESCALATION: string
  TURNSTILE_SECRET_KEY: string
  TURNSTILE_SITE_KEY: string
  PARSE_RATE_LIMITER: RateLimit
  // The Workers Assets binding (issue #29) — lets the `/` handler below
  // fetch the built shell straight from the static-assets layer.
  ASSETS: Fetcher
}

// The Worker's job (ADR-0001, ADR-0010): host API routes that need a secret
// off the client, and serve the prerendered landing document at `/`.
// `run_worker_first` in wrangler.jsonc scopes it to exactly those two things
// — `/api/*` and `/` — every other request is served as a static asset / SPA
// fallback and never reaches this code. Route handlers stay thin (ADR-0002)
// — business logic belongs in src/domain, not here.
const app = new Hono<{ Bindings: Env }>()

// Issue #29: `/` gets a distinct, real-content document instead of the
// empty SPA shell, so a crawler that doesn't execute JavaScript still sees
// it. Fetches the same built `index.html` every other route falls back to
// (so hashed script/link tags stay correct automatically) and splices real
// landing markup into its otherwise-empty `#root` — see
// `landingDocument.ts` for the pure generator this wraps. Once the SPA
// bundle boots from that same script tag, it re-renders `StartScreen` over
// this content as normal; nothing here changes what happens after that.
app.get('/', async (c) => {
  const shellResponse = await c.env.ASSETS.fetch(c.req.raw)
  if (!shellResponse.ok) return shellResponse

  const shellHtml = await shellResponse.text()
  return c.html(buildLandingDocument(shellHtml))
})

app.route('/api/health', health)
app.route('/api/parse', parse)
app.route('/api/config', config)

export default app
