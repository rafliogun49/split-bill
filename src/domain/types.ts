// Domain types for Split Bill. Plain data — no React, no fetch, no Hono.
// See CONTEXT.md for the glossary these names follow, and ADR-0002 for why
// this layer exists instead of an MVC "Model".

export type DinerId = string
export type LineItemId = string

export interface Currency {
  /** ISO 4217 currency code, e.g. "SGD", "IDR". Decimal places derive from this via Intl — see money.ts. */
  code: string
}

export interface Diner {
  id: DinerId
  name: string
  /**
   * The order this Diner joined the Bill, assigned once and never reused —
   * a later removal must not shift a remaining Diner's position. Drives the
   * `diner-N` colour scale in the client layer (DESIGN.md "Diner scale");
   * the colour itself is a rendering concern and stays out of this file.
   */
  joinIndex: number
}

export interface LineItem {
  id: LineItemId
  label: string
  /** Minor units. Authoritative — never derived from quantity. */
  amount: number
  /** Display only; never used to derive money. */
  quantity: number
  /**
   * Diner id -> whole Share count. Tagging a Diner increments their count;
   * only the ratio between counts matters. A key absent or 0 means no Share.
   * Keys may reference a Diner no longer in Bill.diners — calculateSplit
   * ignores those, so removing a Diner can turn a Line Item unassigned.
   */
  shares: Record<DinerId, number>
}

/**
 * Stated as either a fixed amount or a rate; rates resolve against the
 * running total in list order (ADR-0005). `amount` and `rateBps` may be
 * negative to express a discount.
 */
export type Adjustment =
  | { kind: 'fixed'; label: string; amount: number }
  | { kind: 'rate'; label: string; rateBps: number }

export interface Bill {
  /**
   * Locally-generated, stable once assigned (crypto.randomUUID() at
   * creation). Keys a History entry (ADR-0008) — never transmitted, never
   * meaningful across devices, and irrelevant to the Split arithmetic.
   */
  id: string
  currency: Currency
  place?: string
  date?: string
  diners: Diner[]
  /** The Diner who paid, if marked. May reference a Diner no longer in `diners`; treat as unset in that case. */
  payerId?: DinerId
  lineItems: LineItem[]
  /** Order is load-bearing — see ADR-0005. */
  adjustments: Adjustment[]
}
