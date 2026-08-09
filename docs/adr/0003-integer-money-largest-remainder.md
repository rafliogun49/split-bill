# Integer minor units and largest-remainder allocation

Every monetary amount is a JavaScript integer in the Bill currency's minor unit (rupiah for IDR, cents for SGD). No floating-point arithmetic touches money anywhere in the system. The number of decimal places is a property of the Bill's currency and affects formatting only, never storage or arithmetic.

Dividing a Line Item by Shares, and allocating Adjustments pro-rata, both produce fractional amounts that must be resolved to whole minor units. We resolve them by **largest remainder**: floor every allocation, then distribute the leftover units one at a time to the recipients with the largest discarded fractions, tie-broken by a stable ordering.

This upholds the invariant recorded in `CONTEXT.md`: **the sum of all Diners' Totals equals the Bill total, exactly.** The alternatives break it — rounding each Diner up over-collects and visibly fails to reconcile against the printed receipt, and naive rounding drifts as it compounds across every item and every adjustment.

## Consequences

- No Diner is ever off by more than one minor unit, and allocation is deterministic — the same Bill always yields the same Split, so re-sharing a summary never produces different numbers.
- The tie-break must be stable, otherwise reordering Diners silently changes who absorbs the remainder.
- This is the hardest decision in the codebase to reverse: the representation is load-bearing for every amount in the domain, the UI, and the AI parse contract. It is covered by a property-based test rather than examples alone, because adversarial rounding combinations are exactly what hand-written cases miss.
