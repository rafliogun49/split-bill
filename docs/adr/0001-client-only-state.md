# Client-only state; the Worker is an AI proxy

A Bill lives entirely in the browser, persisted to `localStorage`, and is never sent to or stored on a server. The Worker exists for exactly one reason: to hold the OpenRouter API key so it isn't shipped to the client. There is no database, no Bill IDs, and no server-side record that a Bill ever existed.

This follows from the app being single-operator (one person holds the receipt, tags everyone, and shares the result as text and an image). Nobody else ever opens the app, so there is nothing to synchronise and no second device to reconcile with.

## Consequences

- No retention policy, no ownership model, and no privacy surface — we cannot leak data we never hold.
- Clearing browser storage loses the active Bill. Accepted: a Bill is worth minutes, not months.
- Adding D1 later is additive, not a rewrite — the domain model is unchanged by where it is stored. See [ADR-0002](./0002-pure-core-not-mvc.md).
