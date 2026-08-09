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
  currency: Currency
  place?: string
  date?: string
  diners: Diner[]
  lineItems: LineItem[]
  /** Order is load-bearing — see ADR-0005. */
  adjustments: Adjustment[]
}
