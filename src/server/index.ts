import { Hono } from 'hono'
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
}

// The Worker's only job (ADR-0001): host API routes that need a secret off
// the client. `run_worker_first` in wrangler.jsonc scopes it to /api/* —
// every other request is served as a static asset / SPA fallback and never
// reaches this code. Route handlers stay thin (ADR-0002) — business logic
// belongs in src/domain, not here.
const app = new Hono<{ Bindings: Env }>()

app.route('/api/health', health)
app.route('/api/parse', parse)
app.route('/api/config', config)

export default app
