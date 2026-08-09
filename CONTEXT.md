# Split Bill

Splitting a single restaurant bill among a group, where one person holds the receipt and works out what everyone owes. A receipt can be read by AI from a photo, or entered by hand.

## Language

### The bill

**Bill**:
One restaurant visit being split. Owns a currency, a Place and a Date, its Line Items, its Adjustments, and its Diners.
_Avoid_: Receipt, check, tab, session

**Receipt**:
The physical paper photographed by the user. Strictly the input to parsing — never the thing being split. Once parsed, the thing on screen is a Bill.
_Avoid_: using this for the Bill itself

**Line Item**:
One priced row on a Bill. Its line total is authoritative; quantity is carried for display and never used to derive money, so a promo-priced or rounded row stays representable.
_Avoid_: Product, dish, order, entry

**Payer**:
The Diner who paid the restaurant, if known. Named so the Split reads as an instruction — who to pay — rather than a bare set of amounts.
_Avoid_: Host, owner, organiser, creditor

**Diner**:
A person sharing a Bill. Exists only as a name within one Bill — never an account, never a login, never reused across Bills.
_Avoid_: User, member, participant, account

**Place**:
Where a Bill was incurred — the restaurant's name. Recovered from the Receipt when parsing finds it, and correctable by hand. Touches no amount; it exists so the shared Split says what the money was for. May be empty, in which case it is omitted rather than shown blank.
_Avoid_: Venue, merchant, location, vendor, restaurant

**Date**:
When a Bill was incurred. Defaults to today and is otherwise set by hand. Like Place, it is context for the shared Split and never affects arithmetic.
_Avoid_: Timestamp, created at, when

**History**:
The local, on-device list of past Bills — each a Bill that reached its Summary or was discarded by starting a New Bill. Read-only: opening an entry shows its Summary again, never the live editor. Never an account, never synced, never sent anywhere.
_Avoid_: Account, saved bills, cloud backup, past splits

### Dividing the money

**Share**:
A whole-number unit of claim by one Diner on one Line Item. Tagging a Diner gives them one Share; a Diner who consumed more holds more. A Line Item's cost divides by each Diner's Shares over its total Shares. Only the ratio matters, so any proportion is expressible without fractional Shares.
_Avoid_: Portion, weight, split, claim

**Adjustment**:
A bill-wide amount that is not a Line Item — service charge, tax, discount, delivery fee. Stated either as a fixed amount or as a rate, and resolved to a fixed amount against the running total in list order, so a rate levied on top of an earlier Adjustment computes correctly. Discounts are negative. Always allocated pro-rata by each Diner's Subtotal.
_Avoid_: Fee, charge, surcharge, extra, tax (as separate concepts)

**Subtotal**:
The sum of a Diner's Shares of Line Items, before any Adjustment.
_Avoid_: Base, net, pre-tax total

**Total**:
What one Diner finally owes: their Subtotal plus their allocated Adjustments.
_Avoid_: Amount due, balance, owed

**Split**:
The result of dividing a Bill — every Diner's Subtotal and Total. Derived, never stored.
_Avoid_: Calculation, breakdown, result, summary

**Incomplete Split**:
A Split over a Bill that still has a Line Item with no Shares on it. Its Totals are real but do not sum to the Bill total, so it cannot be shared.
_Avoid_: Invalid, draft, partial, unbalanced

## Invariants

- Every amount is an integer in the Bill currency's minor unit. No floating-point arithmetic touches money.
- A Bill has exactly one currency. Currencies are never mixed within a Bill.
- The sum of all Diners' Totals equals the Bill total, exactly. Rounding remainders are distributed by largest remainder, so no Diner is ever off by more than one minor unit.
