import type { Env } from './index'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface TurnstileVerifyResponse {
  success?: boolean
}

// Abuse control (issue #10): the parse route requires a Turnstile token.
// Verification failure (network error, non-2xx, or success: false) is
// treated uniformly as "not verified" — the route doesn't need to
// distinguish why.
export async function verifyTurnstile(env: Env, token: string, remoteIp?: string): Promise<boolean> {
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token })
  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body })
    if (!res.ok) {
      return false
    }
    const data = (await res.json()) as TurnstileVerifyResponse
    return data.success === true
  } catch {
    return false
  }
}
