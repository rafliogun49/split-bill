import type { Env } from '../index'
import { PARSE_PROMPT } from './prompt'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Bounds worst-case latency — parseReceipt can make up to two of these calls
// in sequence (default, then escalation), so an unbounded hang here doubles
// exposure to a slow or stalled upstream.
const OPENROUTER_TIMEOUT_MS = 20_000

export class OpenRouterError extends Error {}

interface OpenRouterChatResponse {
  choices?: { message?: { content?: string } }[]
}

// The network boundary this issue's tests stub — request in, response out.
// Nothing above this function knows or cares that the upstream is OpenRouter.
export async function callOpenRouter(env: Env, model: string, imageDataUrl: string): Promise<string> {
  let res: Response
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(OPENROUTER_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PARSE_PROMPT },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    })
  } catch (err) {
    // Network failure, DNS error, or the timeout above firing all land here
    // as a thrown error rather than a Response — fold them into the same
    // upstream-failure type so the route always maps to a clean 502.
    const reason = err instanceof Error ? err.message : String(err)
    throw new OpenRouterError(`OpenRouter request failed: ${reason}`)
  }

  if (!res.ok) {
    throw new OpenRouterError(`OpenRouter request failed with status ${res.status}`)
  }

  const body = (await res.json()) as OpenRouterChatResponse
  const content = body.choices?.[0]?.message?.content

  if (!content) {
    throw new OpenRouterError('OpenRouter response had no message content')
  }

  return content
}
