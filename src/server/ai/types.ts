// The receipt-parsing wire contract (issue #10 / ADR-0006). Deliberately not
// the domain Bill shape — no ids, no shares, `name`/`total` instead of
// `label`/`amount`. The client (issue #11) converts this into a Bill when it
// pre-fills the editor (ADR-0004); the AI gets no privileged representation.

export interface ParsedLineItem {
  name: string
  quantity: number
  /** Minor units. Never a decimal — see ADR-0006. */
  total: number
}

export interface ParsedAdjustment {
  label: string
  /** Minor units. Always resolved to a fixed amount; may be negative (discount). */
  amount: number
}

export interface ParsedBill {
  /** ISO 4217 currency code. */
  currency: string
  placeName?: string
  date?: string
  lineItems: ParsedLineItem[]
  adjustments: ParsedAdjustment[]
  /** The grand total printed on the Receipt, if the model found one. Minor units. */
  printedTotal?: number
}

export type Reconciliation =
  | { status: 'match'; computedTotal: number }
  | { status: 'no-printed-total'; computedTotal: number }
  | { status: 'mismatch'; computedTotal: number; printedTotal: number; difference: number }

export interface ParseOutcome {
  bill: ParsedBill
  reconciliation: Reconciliation
}
