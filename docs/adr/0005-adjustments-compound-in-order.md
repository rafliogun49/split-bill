# Adjustments compound in list order

An Adjustment is stated either as a fixed amount or as a rate. Rates are resolved to fixed amounts **in list order, each against the running total** — subtotal plus every Adjustment already resolved above it. Order is therefore load-bearing, and reordering the list changes the money. **This is deliberate; it is not an accident of implementation.**

Restaurant tax is normally levied on the subtotal *plus* the service charge — true of Indonesian PB1 and Singaporean GST alike. On a 200,000 subtotal with 5% service and 11% tax, applying both to the subtotal gives 232,000, while compounding correctly gives 233,100. Roughly 1% of every bill, wrong in the same direction every time.

Modelling the cascade rather than special-casing "tax" means both conventions are expressible by ordering alone, and the domain never needs to know which line is a tax and which is a service charge.

## Consequences

- The editor must preserve Adjustment order and make it visible; a drag-to-reorder is a money-affecting control, not a cosmetic one.
- Rates are stored as integer basis points (1100 = 11%) so no float enters the money path. See [ADR-0003](./0003-integer-money-largest-remainder.md).
- Rate resolution rounds half-up to a whole minor unit, and the resolved fixed amount is what gets allocated to Diners — so allocation and the invariant are unaffected by how a charge was stated.
- A parsed receipt stores fixed amounts, since the printed figures are already resolved. Rates exist for manual entry.
