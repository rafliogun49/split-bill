# Split Bill — Design Redesign

Vibrant, cheerful pastel neobrutalism. Reference build: `C:\split-bill\docs\design\Split Bill App Redesign - Standalone.html`.

## Structural mechanics (unchanged from the original system)
- 4px solid black border on every element, zero corner radius.
- Flat hard offset shadows only: chips `4px 4px 0 #000`, buttons/cards `6px–8px 8px 0 #000`, bottom bars shadow upward `0 -8px 0 #000`.
- No gradients, no blur, no translucency — every fill is flat black, white, or one pastel.
- No white text — always black text on any fill.
- State shown by shadow movement (hover/press), not colour change.
- Motion is otherwise off, except the landing hero and the Parsing screen.

## Colour palette
| Role | Hex | Contrast vs black | Tier |
|---|---|---|---|
| Page background (dot-textured, every screen) | `#EDE6DC` | 17.0:1 | AAA |
| Card fill | `#FFF7ED` | 19.8:1 | AAA |
| Ink (body text, headings) | `#1A1720` | 14.3–16.7:1 vs. the two grounds above | AAA |
| Secondary label text | `#4A4458` | 7.5:1 on page bg, 8.8:1 on card | AAA |
| Primary button accent | `#FF936A` (tangerine) | 9.6:1 | AAA |
| Destructive/alert fill | `#FF7E8E` (coral-red) | 8.6:1 | AAA |
| Disabled fill (also the inert/track fill — no distinct value exists in the mockup) | `#E7E7E7` | 17.0:1 | AAA |
| Diner 1 — blue | `#66D4FC` | 12.4:1 | AAA |
| Diner 2 — green | `#A4D589` | 12.5:1 | AAA |
| Diner 3 — pink | `#EFA9E8` | 11.5:1 | AAA |
| Diner 4 — gold | `#E6BE68` | 11.9:1 | AAA |
| Diner 5 — teal | `#61DCC7` | 12.6:1 | AAA |
| Diner 6 — periwinkle | `#B5BCFF` | 11.6:1 | AAA |

Six Diner hues sit ~45–50° apart on the wheel, sharing lightness/chroma so they read as a matched set while staying distinguishable from each other and from the tangerine primary. No green/success colour exists as an "all clear" signal — Parsing's done-step check-badge is the one place `diner-2` green is reused for that meaning. Ink (`#1A1720`) is a warm near-black, deliberately distinct from the pure `#000000` used for borders and shadows — the two never share a token.

## Typography
- **Archivo Black** — headings, uppercase, single weight (it has no real bold, never faked).
- **Inter** — body, labels, and numbers; amounts use `font-variant-numeric: tabular-nums`. Diner names and body copy stay sentence case.

## Screens
Each of the 10 screens has both a **Mobile** and **Desktop** layout (except Share Image, which is one fixed-width export regardless of device). Desktop uses a two-column content + sticky-sidebar pattern wherever a running total/summary applies (Bill editor, Assignment, Summary); other screens widen into horizontal compositions.

1. **Start** — landing hero (scan primary, manual entry demoted to a text link) on first visit; collapses to Resume/New Bill once a Bill exists.
2. **Capture** — mobile opens the camera directly; desktop leads with a drag-and-drop zone, webcam secondary.
3. **Parsing** — staged, honest-indeterminate loader (Reading photo → Finding Line Items → Matching totals) with an animated scan-line, not a fake percentage. Cancellable.
4. **Failure** — one shared layout for parse/offline/rate-limit, short headline + one line + a single CTA into the manual editor.
5. **Bill editor** — reconciliation banner when scanned; boxed white fields (with visible borders) are editable — name, qty, unit, line total, adjustment name/amount; plain text (Subtotal → Total) is calculated. Adjustments reorder and compound in order.
6. **Diner setup** — previously-used chips, add field, current-Diner chips, exactly one Payer via a ribbon tag.
7. **Assignment** — tap-to-claim chips replace the old 3-step picker sheet; persistent Incomplete Split alert with a one-tap "split between everyone" fix; Continue stays disabled until resolved.
8. **Summary** — Payer + per-Diner breakdown + who-to-pay; "✓ All set" sits inline next to the heading; Copy text / Download image, plus a low-emphasis "Start a New Bill" link.
9. **Share image** — a rendered (not screenshotted) card: coloured Diner rows in their assigned colours, a who-to-pay band, torn-edge bottom, zero interactive chrome.
10. **History** — newest-first local Bills; reopens a read-only Summary; empty state explains it fills in over time.

## Key UX changes from the original spec
- **Claiming is now tap-to-claim chips** instead of an open-picker → set-share → close sheet, cutting a ~36-tap flow on a 12-item bill down to one tap per claim (with a stepper only when a custom, non-even split is needed).
- **Editable vs. calculated is now visually explicit** in the Bill editor: every editable value sits in a bordered white input; every computed value is plain text with no box.
- **Summary always offers a way to start over** ("Start a New Bill"), not just via returning to Start.
