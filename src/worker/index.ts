import { Hono } from 'hono'

// No secrets bound yet — the OpenRouter key (ADR-0001) lands with the AI
// client issue. Kept as a named type so adding bindings later is a one-line change.
interface Env {}

// The Worker's only job (ADR-0001): host API routes that need a secret off
// the client. `run_worker_first` in wrangler.jsonc scopes it to /api/* —
// every other request is served as a static asset / SPA fallback and never
// reaches this code.
const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default app
