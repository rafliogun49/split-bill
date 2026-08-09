# Local Bill History, still client-only

The device keeps a list of past Bills in `localStorage` — Place, Date, Total, and when each was archived. A Bill is archived (moved out of the single "active" slot and into this list) when it reaches Summary or is discarded by starting a New Bill. Entries are read-only: opening one reopens its Summary, never the live editor.

This extends [ADR-0001](./0001-client-only-state.md) rather than reversing it. "No database, no Bill IDs, no server-side record" still holds exactly — History is more local state, not a backend. What changes is the shape of that local state: one active Bill becomes one active Bill plus a list of archived ones, each needing a stable local id it didn't need before. Nothing crosses the network, there is still no account, and clearing browser storage still loses everything — a Bill (and its History) remains worth minutes to months on one device, never something to recover from elsewhere.

The product reason: people re-open the app to check a number from last week's dinner, and re-typing or re-scanning a settled Bill to see it again is a bad experience for something the device already computed once.

## Consequences

- `Bill` gains a locally-generated `id`, used only to key the History list — never sent anywhere, never meaningful across devices.
- `billStorage.ts`'s single `StoredBill` envelope becomes two concerns: the one active/editable Bill (unchanged), and an archive list. The active slot's autosave behaviour is unchanged.
- History is reachable from a single TopBar icon on every screen (DESIGN.md §8, §9 screen 12) — the one exception to DESIGN.md §6's "no server-side history," and the one exception §11's checklist now explicitly carves out.
- A Diner still "exists only as a name within one Bill" (CONTEXT.md) — History does not introduce cross-Bill Diner identity or reused Shares; each archived Bill is a frozen, independent snapshot.
