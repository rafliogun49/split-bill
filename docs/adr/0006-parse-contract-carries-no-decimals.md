# The parse contract never carries decimals

Every monetary field in the receipt-parsing schema is typed as an **integer in the detected currency's minor unit**. The model is never asked for, and must never return, a decimal number. The detected currency is a required field and is surfaced prominently on the review screen. **Do not "simplify" this schema to a float.**

On an Indonesian receipt `45.000` means forty-five thousand; on a Singaporean one `45.00` means forty-five. The same glyph, three orders of magnitude apart, disambiguated only by currency. A vision model asked for "the price as a number" will sometimes return `45.0` for the Indonesian case — and `Rp 45` looks entirely plausible on screen. This is the default failure mode of naive receipt parsing, not an exotic edge case.

The Q9 checksum against the printed grand total is a real defence but not a complete one: it catches a single misread row, and misses a misread that scales every figure consistently. Making the ambiguous representation unrepresentable in the schema closes the gap the checksum leaves open.

## Consequences

- The prompt states the separator and decimal-place rule per currency explicitly, with `45.000 → 45000` as a worked example.
- A wrong currency guess becomes visibly wrong on the review screen rather than silently wrong in the totals.
- The parse contract and the domain share one representation, so parsed output needs no conversion — which is also what keeps AI output non-privileged. See [ADR-0004](./0004-ai-is-a-prefill.md).
