import { Hono } from 'hono'
import type { Env } from '../index'
import { OpenRouterError, ParseValidationError, parseReceipt } from '../ai/parseReceipt'
import { arrayBufferToBase64 } from '../base64'
import { verifyTurnstile } from '../turnstile'
import { validateImageUpload } from '../upload'

export const parse = new Hono<{ Bindings: Env }>()

// Thin by design (ADR-0002): this route holds abuse/cost gates and response
// mapping only. Parsing, the self-check and escalation all live in ../ai.
parse.post('/', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'

  const { success: withinLimit } = await c.env.PARSE_RATE_LIMITER.limit({ key: ip })
  if (!withinLimit) {
    return c.json({ error: 'rate_limited' }, 429)
  }

  const form = await c.req.formData()

  const token = form.get('turnstileToken')
  if (typeof token !== 'string' || token.length === 0) {
    return c.json({ error: 'turnstile_required' }, 403)
  }

  const turnstileOk = await verifyTurnstile(c.env, token, ip === 'unknown' ? undefined : ip)
  if (!turnstileOk) {
    return c.json({ error: 'turnstile_invalid' }, 403)
  }

  const file = form.get('image')
  const upload = await validateImageUpload(file instanceof File ? file : null)
  if (!upload.ok) {
    return c.json({ error: upload.reason }, 400)
  }

  const imageDataUrl = `data:${upload.contentType};base64,${arrayBufferToBase64(upload.bytes)}`

  try {
    const outcome = await parseReceipt(c.env, imageDataUrl)
    return c.json({ ...outcome.bill, reconciliation: outcome.reconciliation })
  } catch (err) {
    if (err instanceof OpenRouterError || err instanceof ParseValidationError) {
      return c.json({ error: 'parse_failed' }, 502)
    }
    throw err
  }
})
