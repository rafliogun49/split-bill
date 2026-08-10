# Inline tap-to-claim Assignment, AssignmentPicker narrowed to custom shares

Claiming a Line Item no longer opens a modal by default. Every current Diner renders as a chip directly on each `AssignmentLineItemRow` — claimed chips full-opacity with a shadow, unclaimed at 50% opacity with none — and tapping a chip toggles that Diner's claim on that row immediately. `AssignmentPicker`, the existing bottom-sheet/modal with one `Stepper` row per Diner, is not removed: it now opens only on a *second* tap of an already-claimed chip, and only lists the claimers already on that row, to set a custom (uneven) Share split instead of the default even one.

This reverses the shape the picker shipped with (open → set every Diner's share → close, for every claim on every row) without discarding the component — the Stepper-per-Diner internals are exactly what a custom-share popover needs, just scoped to fewer Diners and triggered less often.

The reason: `DESIGN.md` §10 already named this as a known cost before any of this redesign started — roughly 36 gestures to claim a 12-item Bill through the picker, against ~15 for always-visible chips — and flagged "chips on a second line inside each row" as the fix if it ever felt slow. The vibrant-neobrutalism redesign's mockup (`docs/design/vibrant-neobrutalism-mockup.md`, screen 7) happens to deliver exactly that fix, including the second-tap escape hatch for the uneven-split case the simple toggle can't express on its own.

## Consequences

- `AssignmentLineItemRow` grows: it now renders one `DinerChip` per current Diner (not just claimants), and the tap handler moves from "open picker" to "toggle claim, unless already claimed, then open picker." Row height varies with Diner count, since every Diner appears on every row now.
- `AssignmentPicker`'s props change from "all Diners for this Line Item" to "this row's current claimers only" — a real API change, and its existing tests need updating for the new trigger condition, not just new colors.
- The domain model doesn't change. A tap-toggle is still just "give this Diner one Share of this Line Item" (`CONTEXT.md`'s `Share` definition, unchanged) — the picker's custom-share case was always "more Shares than the default," and stays that.
- Incomplete Split's gating behavior (`DESIGN.md` §9 screen 9) is unaffected — it still watches for any Line Item with zero claimers and still hard-blocks Continue, independent of how a claim gets made.
- If a future redesign reverses this, `AssignmentPicker` still has everything needed to go back to being the primary claim UI — nothing about the narrowing is destructive to its internals, only to its trigger and prop shape.
