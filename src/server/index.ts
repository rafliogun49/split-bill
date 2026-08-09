import { Hono } from 'hono'
import { health } from './routes/health'

// No secrets bound yet — the OpenRouter key (ADR-0001) lands with the AI
// client issue. Kept as a named type so adding bindings later is a one-line change.
interface Env {}

// The Worker's only job (ADR-0001): host API routes that need a secret off
// the client. `run_worker_first` in wrangler.jsonc scopes it to /api/* —
// every other request is served as a static asset / SPA fallback and never
// reaches this code. Route handlers stay thin (ADR-0002) — business logic
// belongs in src/domain, not here.
const app = new Hono<{ Bindings: Env }>()

app.route('/api/health', health)

export default app
