# Vibrant neobrutalism — mockup evidence

**Raw evidence:** [`Split Bill App Redesign - Standalone.html`](./Split%20Bill%20App%20Redesign%20-%20Standalone.html) — the actual Claude Design export, self-contained, open it in a browser to see the real thing pixel-for-pixel. This file is a structured *prose* reference derived from it, for reading without a browser (and for pointing at from `DESIGN.md`) — where the two disagree, the HTML wins, same as any other generated export under §11's checklist.

The HTML was generated from a brief (now deleted — it was a prompt, not a source of truth, and had started drifting from the hand-tweaked result) and edited further by hand afterward in the Claude Design canvas before being exported. This file describes that final, tweaked result.

10 screens, each shown mobile + desktop. Numbering matches the mockup's own tabs, not `DESIGN.md` §9's 12-screen breakdown — the mapping is noted per screen. All decisions below (adopt structurally, resolve token values, etc.) were confirmed with the maintainer in the grilling session that produced this file; see [ADR-0011](../adr/0011-inline-tap-to-claim-assignment.md) for the one that needed a formal record.

## Palette extracted from the mockup

Every value below was measured by the agent that wrote this file, not eyeballed. Ratios are black-text-on-fill for fills (matching `DESIGN.md`'s existing convention — see `tokens.test.ts`), or text-on-background for ink/label tokens.

| Role | Hex | Ratio | Tier |
|---|---|---|---|
| Page background (dot-textured, every screen) | `#EDE6DC` | 17.0:1 | AAA |
| Card / surface fill | `#FFF7ED` | 19.8:1 | AAA |
| Ink (body text, headings) | `#1A1720` | 14.3–16.7:1 vs. the two grounds above | AAA |
| Secondary label text | `#4A4458` | 7.5:1 on page bg, 8.8:1 on card | AAA (worst case still clears) |
| Primary button fill | `#FF936A` | 9.6:1 | AAA |
| Alert / destructive fill | `#FF7E8E` | 8.6:1 | AAA |
| Disabled fill | `#E7E7E7` | 17.0:1 | AAA (exempt anyway, WCAG 1.4.3) |
| Diner 1 — blue | `#66D4FC` | 12.4:1 | AAA |
| Diner 2 — green | `#A4D589` | 12.5:1 | AAA |
| Diner 3 — pink | `#EFA9E8` | 11.5:1 | AAA |
| Diner 4 — gold | `#E6BE68` | 11.9:1 | AAA |
| Diner 5 — teal | `#61DCC7` | 12.6:1 | AAA |
| Diner 6 — periwinkle | `#B5BCFF` | 11.6:1 | AAA |

Borders and shadows stay pure `#000000` — unchanged, structural, not part of the palette swap. Every value above clears full AAA (7:1), which is stronger than `DESIGN.md` §1 rule 2 requires for fills behind short bold labels (AA-large, 4.5:1) — there was no need to spend that allowance anywhere in this palette.

No `surface-variant`/inert-track equivalent appears anywhere in the mockup (the old system's progress-track grey has no counterpart — Parsing's pending step is white+border, not filled grey). Reusing `#E7E7E7` (disabled) for that role is the path of least surprise; flagged in `DESIGN.md` §10 as a small open question rather than decided unilaterally.

Typography is unchanged: Archivo Black (400 only) for headings, Inter for body/labels/amounts, same type scale as today.

## Ornament (new, structural)

These are additions to the flat/hard-shadow system, not replacements for it — confirmed in grilling as adopted everywhere the mockup uses them, decoupled from `DESIGN.md` §5's existing Start-only motion exception (that exception still governs *animation*; these are static).

- **Dot texture** — a repeating 22×22px SVG dot pattern (`#1A1720` at 14% opacity) on the page background, every screen, behind every card.
- **Folded corner** — a solid-black triangular fold at a card's bottom-left corner (CSS border-triangle trick), seen on Start's mobile hero card.
- **Zigzag / torn-paper edge** — a serrated `clip-path` divider, seen (a) between Start's hero and "How it works" section, and (b) at the bottom of `ShareCard`, just above the watermark.
- **Rotated stamp badge** — a small badge rotated a few degrees off-axis with its own hard shadow, e.g. "SCANNED" top-right of the Bill editor when a Bill came from a photo. Distinct from the reconciliation Banner: the stamp says *how this Bill was made*, the Banner says *whether the math matches*. Both can be present at once and don't duplicate each other.
- **Diamond warning badge** — the Assignment screen's desktop alert Banner has its warning icon rendered as a black-bordered square rotated 45° (a diamond) poking out of the Banner's top-left corner, "!" centred inside, instead of an inline icon glyph.
- **Hand-drawn arrow** — a single SVG stroke-path arrow pointing at the primary CTA, Start desktop hero only.
- **Rotated "sticky note"** — the receipt-preview card in Start's desktop hero sits at a slight rotation (`-2deg`) with its own hard shadow, mimicking a photo dropped on a desk.

## 1 · Start

*(`DESIGN.md` §9 screen 1)*

**First visit — mobile.** Hero card: folded corner bottom-left, dot-textured page ground behind it. Headline "Split the bill, not the friendship" in Archivo Black, tagline, primary button "📷 Scan a receipt" (white fill, black border/shadow — not `primary-container`; the button sits *inside* an orange `#FF936A` hero band, so a same-color button on it would vanish) with a hand-drawn arrow pointing at it, "Enter manually instead" as underlined text beneath. Zigzag divider, then a numbered 1-2-3 "How it works" list using diner-1/2/3 (blue/green/pink) as the number badges, then two white feature strips ("No accounts…", "Works in IDR, SGD…"), then a one-line footer repeating the no-storage promise.

**First visit — desktop.** Same content, two-column hero: copy + CTA left, the rotated "sticky note" receipt preview right (shows a live-looking Line Item breakdown — this is decorative, not a real Bill). How-it-works becomes a 3-column row plus a 4th column of the two feature strips, all inside one continuous card (no zigzag divider at this width).

**Returning — both.** Collapses to the minimal choice per the existing spec: "You have a Bill in progress", place + elapsed time, "Resume this Bill" (primary) over "Start a New Bill" (secondary) with the discard warning beneath. No ornament here — this state was never the landing page, so it doesn't inherit the landing page's extra motion/flourish allowance (`DESIGN.md` §5, §6 exception).

**Status:** `StartScreen.tsx` currently implements the *previous* muted-palette version of this screen directly in code — this mockup supersedes it and the component needs a rebuild pass, not a fresh design.

## 2 · Capture

*(§9 screen 2)*

Mobile: camera viewfinder fills the screen (corner brackets in `#FF936A`), library-picker and shutter buttons pinned below, "Enter manually instead" beneath that. Desktop: drag-and-drop zone is primary (dashed border, diagonal-stripe fill), "Use webcam instead" secondary button, manual-entry link beneath. No new ornament beyond the palette swap.

## 3 · Parsing

*(§9 screen 3)*

A small receipt-shaped card (white lines standing in for the Line Items, a horizontal scan-line bar animating top-to-bottom) sits beside/above a 3-item step checklist: done steps get a green (`diner-2` `#A4D589`) check-badge, the active step blinks (`diner-1` `#66D4FC`), pending steps are a plain white+border box — not a grey "inert" fill. Cancel button beneath. Matches the existing named-stages/no-fake-percentage spec exactly; only the palette and the receipt-card illustration are new.

## 4 · Failure

*(§9 screen 4)*

One shared layout for all three causes, as specified. A large solid black warning triangle (not a small icon-in-badge) sits in an alert-red (`#FF7E8E`) band above the headline "Couldn't read this photo". Plain-language cause line, then the single "Enter items manually" button — always the escape hatch, never a dead end.

## 5 · Bill editor

*(§9 screens 5 + 6/Reconciliation, which stay one screen as today)*

Reconciliation Banner unchanged in behavior (quiet when matching, alert with both totals + signed difference when not) — new palette only. New: a rotated "SCANNED" stamp badge top-right when the Bill came from a photo (provenance, independent of whether the totals match). Line Items are inline-editable rows (name / qty / unit / line-total, boxed white fields = editable, plain text = calculated), Adjustments below as a reorderable list with drag handles. Desktop moves Adjustments + running Total into a sticky right-hand sidebar instead of stacking below the Line Items.

## 6 · Diner setup

*(§9 screen 7)*

Previously-used names as one-tap `+Name` chips, a text field for new names beneath, current Diners as removable chips carrying their `diner-N` fill with a `★ PAYER` ribbon-style tag on whoever's marked Payer, "Make Payer" button on the others. Desktop splits into a form-left / live-roster-right layout instead of stacking. Palette-only change from current spec; no interaction change.

## 7 · Assignment

*(§9 screens 8 + 9/Incomplete Split — this is the interaction change; see ADR-0011)*

**This is the screen that changed shape, not just color.** Every Line Item row shows its name/qty/total, then **every current Diner rendered as a chip on that row** — not just the claimers. Claimed chips: full opacity, `shadow-sm`, a `✓` prefix. Unclaimed chips: 50% opacity, no shadow. **Tapping any chip toggles that Diner's claim on that row directly** — no modal, no intermediate step. **Tapping an already-claimed chip a second time** opens `AssignmentPicker`, narrowed to that row's current claimers only, for a custom (uneven) Share split — confirmed by the mockup's own caption: *"Shared evenly by 2 · tap a claimer again to open a custom-share stepper."*

Incomplete Split stays a hard gate exactly as specified: a persistent alert Banner names the unclaimed Line Item and its value with a one-tap "Split between everyone" fix, and the Continue button renders in `disabled` fill (`#E7E7E7`) with the button label itself explaining why ("Continue (resolve Incomplete Split)") until resolved. Desktop's alert Banner carries the rotated diamond warning badge described above; mobile's is a plain banner (no room for the corner ornament at that width).

Running totals: mobile keeps the `StickySummaryBar` pattern (now showing a compact per-Diner breakdown line, e.g. "Nadia $6.50 · Farah $6.50 · Wei $0.00"); desktop keeps `AssignmentDinerTotals` as a sticky sidebar card, unchanged in role from the current spec.

## 8 · Summary

*(§9 screen 10)*

Payer line at top ("Nadia paid $25.89 and is owed $19.39 back") with an "✓ ALL SET" badge, then each Diner's Total in its own card with a one-line itemised reason ("½ Nasi Goreng, service charge & tax share"), each card's Diner-color swatch matching their chip color from Assignment/Diner-setup. "Who to pay" line, then "Copy text" / "Download image" side by side, "Start a New Bill" beneath. Desktop moves "Who to pay" + both actions into a sticky right sidebar. No reconciliation content here, matching the existing rule — that only ever lives on the Bill editor.

## 9 · Share image

*(§9 screen 11)*

The exact `ShareCard` render, fixed-width PNG, same on mobile and desktop (this is the one non-responsive surface, per existing spec). Place/Date/total in an orange header band, each Diner's card below (colored by their `diner-N`), a periwinkle (`diner-6` `#B5BCFF`) "Who to pay" band, the zigzag torn-edge motif at the bottom, small "Split Bill" wordmark watermark. Zero app chrome, zero interactive elements, exactly as specified.

## 10 · History

*(§9 screen 12)*

A newest-first list of past Bills (Place, Total, Date + "archived N ago"), plain white cards. Empty-state / low-count state shows a small stacked-bars illustration (three overlapping bars in periwinkle/gold/teal) with copy explaining it fills in over time. Desktop switches to a 2-column grid. Palette-only change from current spec.
