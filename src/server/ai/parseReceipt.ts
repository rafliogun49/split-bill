import type { Env } from '../index'
import { callOpenRouter, OpenRouterError } from './openrouter'
import { reconcile } from './reconcile'
import { parsedBillSchema } from './schema'
import type { ParseOutcome, ParsedBill } from './types'

export { OpenRouterError }

export class ParseValidationError extends Error {}

// The self-check and escalation from issue #10: on a reconciliation
// mismatch, retry once against the stronger model before responding, so the
// Payer is never asked to fix something that could have been read correctly.
// A malformed response is not itself grounds for escalation — only a
// numeric mismatch is.
export async function parseReceipt(env: Env, imageDataUrl: string): Promise<ParseOutcome> {
  const first = await attemptParse(env, env.OPENROUTER_MODEL_DEFAULT, imageDataUrl)
  const firstReconciliation = reconcile(first)

  if (firstReconciliation.status !== 'mismatch') {
    return { bill: first, reconciliation: firstReconciliation }
  }

  try {
    const escalated = await attemptParse(env, env.OPENROUTER_MODEL_ESCALATION, imageDataUrl)
    return { bill: escalated, reconciliation: reconcile(escalated) }
  } catch {
    // The escalation attempt itself failing (upstream error, malformed
    // response) is not grounds to discard an already-usable parse — the
    // Payer can still review and correct a mismatched Bill in the editor
    // (ADR-0004). Fall back to the first result rather than erroring out.
    return { bill: first, reconciliation: firstReconciliation }
  }
}

async function attemptParse(env: Env, model: string, imageDataUrl: string): Promise<ParsedBill> {
  const raw = await callOpenRouter(env, model, imageDataUrl)

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new ParseValidationError('Model response was not valid JSON')
  }

  const result = parsedBillSchema.safeParse(json)
  if (!result.success) {
    throw new ParseValidationError('Model response did not match the parse contract')
  }

  return result.data
}
