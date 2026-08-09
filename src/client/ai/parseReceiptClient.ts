// The receipt-parsing wire contract, client side. Deliberately not imported
// from src/server/ai/types — the client depends on nothing server-side
// (ADR-0002), so the shape is mirrored here instead of shared.

export interface ParsedReceiptLineItem {
  name: string
  quantity: number
  /** Minor units. */
  total: number
}

export interface ParsedReceiptAdjustment {
  label: string
  /** Minor units; may be negative (discount). */
  amount: number
}

export type ParseReconciliation =
  | { status: 'match'; computedTotal: number }
  | { status: 'no-printed-total'; computedTotal: number }
  | { status: 'mismatch'; computedTotal: number; printedTotal: number; difference: number }

export interface ParsedReceipt {
  /** ISO 4217 currency code. */
  currency: string
  placeName?: string
  date?: string
  lineItems: ParsedReceiptLineItem[]
  adjustments: ParsedReceiptAdjustment[]
  printedTotal?: number
  reconciliation: ParseReconciliation
}

// DESIGN.md screen 4: the three failure states the Capture/Parsing flow can
// land on. "offline" is detected client-side and never reaches the server.
export type ParseFailureReason = 'offline' | 'rate_limited' | 'parse_failed'

export type ParseResult = { ok: true; receipt: ParsedReceipt } | { ok: false; reason: ParseFailureReason }

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

// Thin fetch wrapper (ADR-0002: no business rules here — the domain
// conversion lives in parsedReceiptToBill.ts). Every failure collapses to
// one of the three ParseFailureReasons the Failure screen already knows how
// to render — the caller never sees a raw HTTP status.
export async function requestParse(image: Blob, turnstileToken: string, signal: AbortSignal): Promise<ParseResult> {
  if (isOffline()) {
    return { ok: false, reason: 'offline' }
  }

  const form = new FormData()
  form.set('image', image, 'receipt.jpg')
  form.set('turnstileToken', turnstileToken)

  let response: Response
  try {
    response = await fetch('/api/parse', { method: 'POST', body: form, signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    return { ok: false, reason: 'offline' }
  }

  if (response.status === 429) {
    return { ok: false, reason: 'rate_limited' }
  }
  if (!response.ok) {
    return { ok: false, reason: 'parse_failed' }
  }

  const receipt = (await response.json()) as ParsedReceipt
  return { ok: true, receipt }
}

export async function fetchTurnstileSiteKey(signal?: AbortSignal): Promise<string> {
  const response = await fetch('/api/config', { signal })
  if (!response.ok) {
    throw new Error('Failed to load Turnstile config')
  }
  const data = (await response.json()) as { turnstileSiteKey: string }
  return data.turnstileSiteKey
}
