// ADR-0006: the model is never asked for a decimal. The same glyph means
// different magnitudes in different currencies, so the rule and a worked
// example per currency shape ships in the prompt rather than being left
// implicit.
export const PARSE_PROMPT = `You are reading a photographed restaurant receipt. Return ONLY a JSON object matching this exact shape, with no prose and no markdown fences:

{
  "currency": string,       // ISO 4217 code, e.g. "SGD", "IDR", "USD"
  "placeName"?: string,     // the restaurant's name, if printed
  "date"?: string,          // ISO 8601 date, if printed
  "lineItems": [
    { "name": string, "quantity": number, "total": integer }
  ],
  "adjustments": [
    { "label": string, "amount": integer }
  ],
  "printedTotal"?: integer  // the grand total printed on the receipt
}

CRITICAL — every monetary field ("total", "amount", "printedTotal") is an INTEGER in the currency's minor unit. Never return a decimal. Convert using the currency's minor-unit exponent from ISO 4217:

- Most currencies (e.g. USD, SGD, EUR) use 2 decimal places: "$12.50" -> 1250, "S$3.00" -> 300.
- Zero-decimal currencies (e.g. IDR, JPY, KRW) use the printed integer as-is, with any "." or "," a thousands separator, not a decimal point: "Rp 45.000" -> 45000, "¥500" -> 500.
- Three-decimal currencies (e.g. BHD, KWD, OMR) use 3 decimal places: "12.500" -> 12500.

"lineItems[].total" is the row's line total (quantity already applied), never a unit price. "adjustments" covers service charge, tax, delivery fee and discounts as already-resolved fixed amounts in minor units — a discount is negative. Omit "placeName", "date" and "printedTotal" if the receipt doesn't show them. If you cannot read the receipt at all, return an empty "lineItems" array and omit "printedTotal".`
