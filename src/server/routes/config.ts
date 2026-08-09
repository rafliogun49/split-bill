import { Hono } from 'hono'
import type { Env } from '../index'

// Non-secret, client-facing config (README: "TURNSTILE_SITE_KEY ... lands in
// wrangler.jsonc vars when the client widget ships in issue #11"). The site
// key is meant to be public — Cloudflare's own docs serve it inline in HTML —
// so handing it out over GET needs no auth, unlike TURNSTILE_SECRET_KEY.
export const config = new Hono<{ Bindings: Env }>()

config.get('/', (c) => c.json({ turnstileSiteKey: c.env.TURNSTILE_SITE_KEY }))
