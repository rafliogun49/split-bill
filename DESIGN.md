# Split Bill — Design

The reference an agent reads **before** writing any UI. It is normative: where this file and generated design evidence disagree on tokens, copy, or the four rules in §1, this file wins.

> **Visual identity confirmed, not yet built.** §2's palette below is the **vibrant, cheerful pastel neobrutalism** direction — confirmed with the maintainer against a real Claude Design export, replacing the muted palette that used to ship here. The values in §2 and the descriptions in §8/§9 are normative; `src/design/tokens.ts` and the screen components still carry the old muted values until that build pass happens — don't assume shipped code matches this file until that's done. Update §2's table and `src/design/tokens.ts` together when it does — never one without the other.

Companion documents:

| File | Holds |
|---|---|
| `CONTEXT.md` | Domain vocabulary. All UI copy obeys it. |
| `docs/adr/0007-…` | Why the tokens carry Material 3 names |
| `docs/design/Split Bill App Redesign - Standalone.html` | **The raw rendered export** — open in a browser for pixel-accurate evidence of all 10 screens. Wins over the prose below on any disagreement. |
| `docs/design/vibrant-neobrutalism-mockup.md` | Prose description of the same 10 screens, derived from the HTML above, for reading without a browser. Start here for a screen's layout before writing markup. |
| `docs/adr/0011-…` | Why Assignment moved from a modal picker to inline tap-to-claim chips |
| [issue #1](https://github.com/rafliogun49/split-bill/issues/1) | The product spec — 59 stories |

The style is **pastel neobrutalism**: pure-black 4px borders, hard offset shadows with zero blur, zero corner radius, flat fills, no gradients, no elevation, no translucency. Everything is either black, `#1A1720` ink, or one flat pastel from §2. A handful of static ornamental treatments (dot-textured backgrounds, torn/zigzag card edges, rotated stamp badges) are also part of the system now — see §8's Ornament section — but they layer on top of the flat/hard-shadow base, they don't replace it.

---

## 1. Four rules that override everything

These are not preferences. Code that breaks them is wrong.

**1. There is no white text anywhere in the app.** Pastel fills are light. White on the brand `#FF936A` is **2.18:1**. Every fill in this system carries black text. The tokens that would permit white text (`on-primary`, `on-secondary`, `on-tertiary`, `on-error`) are deleted, not overridden.

**2. Text clears AAA; a fill behind a short bold label may claim AA-large instead.** Body copy, standalone labels and numerals — anything read on its own — clear WCAG 2.1 AAA: 7:1 normal text, 4.5:1 large. A fill that only ever hosts a short bold label sitting on top of it (a button, a chip) may drop to AA-large — 4.5:1 — since rule 1 already guarantees black text there and the bold weight carries it at that ratio. Measured ratios are in §2. Proposing a new colour means computing and stating its ratio and which tier it's claiming.

**3. `primary-container` is a button fill and nothing else.** It is never text, never a numeral, never an icon (pastel orange as text on white is 2.18:1), and never a Diner colour.

**4. Zero corner radius, no exceptions.** `borderRadius.full` is `0px`. Diner chips are squares.

---

## 2. Colour

**Status: confirmed, not yet in code.** This is the vibrant/cheerful palette — measured directly from `docs/design/Split Bill App Redesign - Standalone.html`'s markup and confirmed with the maintainer. `src/design/tokens.ts` still holds the old muted values; update it and this table together, don't hand-edit one.

Fill tokens are measured as black-text-on-fill (`(L+0.05)/0.05` against `#000000` — matches `tokens.test.ts`'s existing convention). Ink/label tokens are measured against the ground they actually render on, since the page ground is no longer pure white. Every value clears full AAA (7:1) — §1 rule 2's AA-large allowance (4.5:1) for button/chip fills isn't needed anywhere in this palette.

### Tokens

| Token | Value | Role | Ratio |
|---|---|---|---|
| `background` | `#EDE6DC` | page ground, dot-textured (§8 Ornament) | 17.0:1 |
| `surface-container-lowest` | `#FFF7ED` | card fill | 19.8:1 |
| `surface-variant` | `#E7E7E7` | inert fill — no distinct mockup value exists; reusing `disabled` (see §10) | 17.0:1 |
| `pure-black` | `#000000` | borders, shadows | — |
| `on-surface` | `#1A1720` | body text, headings | 14.3–16.7:1 vs. the two grounds above |
| `on-background` | `#1A1720` | body text, headings | 14.3–16.7:1 vs. the two grounds above |
| `on-surface-variant` | `#4A4458` | secondary labels only | 7.5:1 on page ground, 8.8:1 on card |
| `primary-container` | `#FF936A` | primary button fill | 9.6:1 |
| `error-container` | `#FF7E8E` | destructive + mismatch fill | 8.6:1 |
| `disabled` | `#E7E7E7` | disabled fill | 17.0:1 (exempt anyway, WCAG 1.4.3) |

`pure-black` stays the *only* pure black — `on-surface`/`on-background` move to a warm near-black ink instead, deliberately distinct from the border/shadow colour. This is new: the previous palette used `#000000` for both roles.

**"White fill" throughout §8 means `surface-container-lowest`**, i.e. `#FFF7ED` — a warm off-white, not literal `#FFFFFF`. Nothing in this system uses pure white anymore; `#FFFFFF` isn't a token.

### Diner scale

Not a Material scale. Allocated by join order: `diner-{(index % 6) + 1}`.

| Token | Value | Ratio |
|---|---|---|
| `diner-1` | `#66D4FC` blue | 12.4:1 |
| `diner-2` | `#A4D589` green | 12.5:1 |
| `diner-3` | `#EFA9E8` pink | 11.5:1 |
| `diner-4` | `#E6BE68` gold | 11.9:1 |
| `diner-5` | `#61DCC7` teal | 12.6:1 |
| `diner-6` | `#B5BCFF` periwinkle | 11.6:1 |

Chosen to sit clearly apart from `primary-container` (`#FF936A`, orange) in hue — resolves the old palette's known risk of `diner-5`/`diner-6` flanking the primary blue (§10).

### Deleted tokens

Present in Stitch exports, absent here. Referencing one is a bug.

```
on-primary  on-secondary  on-tertiary  on-error     #ffffff — no white text
outline     #737781   4.26:1 on ground — fails AAA and AA
primary     #315f9d   exists only to host white text
error       #ba1a1a   exists only to host white text
secondary   tertiary  secondary-container  tertiary-container
mint-green  cyber-yellow  flamingo-pink   ad-hoc, replaced by diner-*
*-fixed  *-fixed-dim  inverse-*  surface-tint  outline-variant  unused
```

There is **no success colour**. "Good" is expressed as the absence of `error-container`, not as green — this avoids a green success fill colliding with `diner-2`.

### Dark mode

Out of scope. `darkMode` is deliberately unset and no `dark:` utility may be written. The black border is the entire structural system and it is invisible on a dark ground; supporting dark means white borders, white shadows and white body text — a second design language, not a theme.

---

## 3. Typography

Two families. **Archivo Black is a single-weight family declared at 400** — requesting 900 from it produces a synthesised fake bold. Archivo Narrow tops out at 700. Neither supports the `fontWeight: 900` that Stitch emitted on every heading token.

| Token | Family | Size / line | Weight |
|---|---|---|---|
| `display-xl` | Archivo Black | 80/80, `-0.02em` | 400 |
| `headline-lg` | Archivo Black | 48/52 | 400 |
| `headline-md` | Archivo Black | 32/36 | 400 |
| `headline-sm` | Archivo Black | 24/28 | 400 |
| `body-lg` | Inter | 18/28 | 500 |
| `body-md` | Inter | 16/24 | 400 |
| `label-bold` | Inter | 14/20 | 700 |
| `label-sm` | Inter | 12/16 | 600 |
| `amount-lg` | Inter | 32/36 | 600 |
| `amount-md` | Inter | 20/28 | 600 |
| `amount-sm` | Inter | 16/24 | 600 |

`display-xl` drops to **56px** below `md`.

### Money

**Every amount uses an `amount-*` token, never a `headline-*` one.** All three carry:

```css
font-variant-numeric: tabular-nums;
```

Display faces do not ship usable tabular figures; Inter does. Without this, a column of totals shifts horizontally row to row:

```
proportional          tabular
  Rp 71.667             Rp 71.667
  Rp 47.667             Rp 47.667
  Rp 156.177            Rp 156.177
  ↑ groups wander       ↑ groups align
```

Formatting is `Intl.NumberFormat` against the Bill currency — `Rp 156.177` for IDR (dot separators, 0 decimals), `$156.18` for SGD. Never hand-formatted.

Headings are uppercase. Body copy and Diner names are not — a Diner's name is theirs, and uppercasing it destroys information.

---

## 4. Space, border, shadow

```
spacing     base 4   gutter 24   margin-mobile 16   margin-desktop 40
border      4px solid #000000 — every size, every breakpoint
radius      0 everywhere
```

Hard shadows only. Zero blur, zero spread, pure black, offset on both axes:

| Token | Shadow | Used by |
|---|---|---|
| `shadow-sm` | `4px 4px 0 #000` | chips, small controls |
| `shadow-md` | `6px 6px 0 #000` | buttons, top bar |
| `shadow-lg` | `8px 8px 0 #000` | cards, sheets |

The sticky summary bar shadows **upward**: `0 -8px 0 #000`.

---

## 5. Interaction states

State is carried by **shadow and position**, never by changing a fill. This matters more than usual: six pastel fills sit at similar lightness, so a fill change is a weak signal, while gaining or losing a hard shadow is unmissable.

```
rest                 hover (pointer only)      press / active
┌──────────┐         ┌──────────┐              ┌──────────┐
│  CLAIM   │         │  CLAIM   │              │  CLAIM   │
└──────────┘         └──────────┘              └──────────┘
  ▀▀▀▀▀▀▀▀             ▀▀▀▀▀▀▀▀▀▀              (no shadow)
  offset N             offset N+2               translate(N, N)
                       translate(-2, -2)        shadow: none
```

- **Hover is pointer-only.** Guard with `@media (hover: hover)`. On touch it fires on tap and sticks.
- **Focus** is a 4px black outline offset 4px outside the border. Never removed.
- **Disabled** is `disabled` fill, no shadow, no translate.
- Transitions: 200ms hover, 100ms press. Nothing else animates — with two scoped exceptions, both places trying to hold attention rather than report a state change: Start's pre-Bill landing content (§9 screen 1) may use entrance and hover motion (fade/slide-in, a hover lift on cards, a tilt on the receipt ornament), and Parsing (§9 screen 3) may pulse its active step and icon badge. Every screen in the chromeless flow — Start's Resume/New-Bill choice onward — stays exactly this strict.

---

## 6. Layout

```
< 768px    single column, margin-mobile, bottom-pinned action bar
768–1023   single column at a wider measure, mobile layout
≥ 1024px   two column where the screen has a summary, max 1280px centred
```

Once a Bill exists, the app is a **chromeless linear flow**: one top bar, no bottom navigation, no in-flow marketing. There is nowhere to navigate to — the flow is strictly linear, and the bottom edge belongs to the screen's own action bar.

**Exception: Start's first-visit state** (§9, screen 1). Before any Bill exists, Start is a short landing page — hero, How it works, a few Features, a one-line footer — making the case for the app to someone arriving cold. It still obeys every rule in §1 and §2 (no white text, AAA contrast, `primary-container` reserved for the button fill, zero radius) and every deleted token in §2 stays deleted; it does not grow a nav bar or links to pages the app doesn't have. The instant a Bill exists — including the moment New Bill or Resume is chosen — Start drops the landing content for the minimal Resume/New Bill choice, and every screen after it is the chromeless layout above.

```
┌────────────────────────┐        ┌──────────────────────────────────┐
│ SPLIT BILL         ✕   │        │ SPLIT BILL                   ✕   │
├────────────────────────┤        ├───────────────────┬──────────────┤
│                        │        │                   │              │
│        content         │        │     content       │   summary    │
│                        │        │                   │   (sticky)   │
├────────────────────────┤        │                   │              │
│   Rp 156.177  [NEXT]   │        └───────────────────┴──────────────┘
└────────────────────────┘                7 cols            5 cols
```

**No accounts, no groups, no pricing, no server-side history.** A Diner "exists only as a name within one Bill." Nav destinations implying an account or a server ever holds your data are out of scope and must not be added back.

**Exception: local History.** The device may keep a list of past Bills entirely in `localStorage` — nothing leaves the browser, there is no login and no sync between devices. A Bill archives into it when it reaches Summary or is discarded by starting a New Bill; entries are view-only (they reopen a Summary, never the live editor). Reachable everywhere via a single TopBar icon (§8 TopBar, §9 screen 12) — it does not reintroduce a nav bar or the marketing links this rule otherwise forbids. See ADR-0008.

---

## 7. Copy

`CONTEXT.md` is binding. These substitutions are the ones generated designs keep reaching for:

| Never | Always |
|---|---|
| Split Sheet, Settle Up | Assignment, Summary |
| The Party, Person, Participant, User, Member | **Diner**, **Diners** |
| Receipt Items | **Line Items** |
| Tax, Tip, Fee, Service Charge (as concepts) | **Adjustments** |
| Unassigned Items | **Incomplete Split** |
| Total Owed, Amount Due, Balance | **Total** |
| Breakdown, Calculation, Result | **Split** |
| New Split | **New Bill** |
| Venue, Merchant, Restaurant | **Place** |

Two things that must never appear because the domain has no such concept:

- **Payment status.** No "Pending", no "Paid", no "Settled". There are no accounts and nothing is persisted; a per-Diner payment state cannot exist.
- **Line Item categories.** No "Food" / "Drinks" / "Fee" tags. A Line Item has a name, a quantity and a line total.

Adjustments are **never assignable**. They are allocated pro-rata by Subtotal, always, by definition. Any UI that offers to assign one is wrong.

---

## 8. Components

Sixteen. No component library — these are hand-built against the tokens above.

**`Button`** — `primary` (`primary-container` fill), `secondary` (white fill), `danger` (`error-container` fill), `disabled`. All four carry black text and `shadow-md`. Minimum height 48px.

**`Card`** — white fill, 4px border, `shadow-lg`. The universal container.

**`TopBar`** — sticky, white, bottom border only, wordmark left, a History icon and exit/restart right. Those two destinations — History and back to Start — are the only navigation it ever carries.

**`LineItemRow`** — the Bill editor's row (screen 5): inline-editable name, quantity, unit price and line total, plus reorder and remove controls. Entering quantity or unit price fills the line total; the line total is overridable and authoritative.

**`AssignmentLineItemRow`** — the Assignment screen's row (screen 8): read-only name, quantity, line total, then **every current Diner** rendered as a `DinerChip` — not just claimants. Claimed chips carry `shadow-sm` and full opacity; unclaimed sit at 50% opacity with no shadow. Tapping any chip toggles that Diner's claim on this row directly. Tapping an already-claimed chip a second time opens `AssignmentPicker` (see below), scoped to this row. No chevron, no whole-row tap target — the chips themselves are the interaction now (ADR-0011). Row height varies with Diner count, since every Diner renders on every row; below 1024px it splits across two lines (name/quantity, then chips/amount) since the row no longer shares its width with a desktop summary column. A distinct component from `LineItemRow` rather than a shared one, since one edits the Line Item and the other only reads it plus manages claims.

**`DinerChip`** — 44×44 square, `diner-N` fill, black border, initial in `label-bold`. Claimed carries `shadow-sm` and full opacity; unclaimed carries neither shadow nor full opacity (50%) — on `AssignmentLineItemRow` both channels move together so claimed/unclaimed never depends on fill alone. A Share count above 1 renders as a superscript badge in the top-right corner.

**`AssignmentPicker`** — bottom sheet on mobile, centred modal ≥1024px. Narrowed scope (ADR-0011): opens only via a second tap on an already-claimed `DinerChip`, and lists only that row's current claimers — not every Diner — since claiming/unclaiming itself is handled by the first tap on `AssignmentLineItemRow`. Header names the Line Item and its total; one `Stepper` row per claiming Diner; footer shows each one's resulting share of the row and a `DONE` button. Governs custom (uneven) Shares only.

**`Stepper`** — `[−] n [+]`, 44px targets, `amount-sm` numeral, floors at 0.

**`TextField` / `AmountField`** — 4px border, no radius, no inner shadow. `AmountField` is right-aligned, `amount-md`, tabular, and enforces the currency's minor unit.

**`Banner`** — full-width, 4px border, `shadow-md`. `neutral` (white) and `alert` (`error-container`) only. Carries reconciliation state, Incomplete Split and parse failure.

**`StickySummaryBar`** — mobile only. Fixed to the bottom edge, upward shadow, label + `amount-md` left, primary `Button` right. Becomes the static foot of the right-hand column ≥1024px, pinned below `AssignmentDinerTotals`.

**`AssignmentDinerTotals`** — desktop only (≥1024px), the right-hand column's header on the Assignment screen (screen 8): a `Card` naming each Diner with a `DinerChip`, next to their live running Total from the same `Split` the screen already computed. Sits above `StickySummaryBar` in that column, sticky under the `TopBar`; mobile has no equivalent, since the fixed `StickySummaryBar` there already carries the one number that matters before Continue.

**`ProgressCard`** — parsing state. Determinate track in `surface-variant`, fill in `primary-container`, plus a step list. Cancel is a `secondary` Button.

**`AdjustmentRow`** — name, fixed-or-rate toggle, value, resolved amount, drag handle. Order is visible and reorderable because it changes the arithmetic (ADR-0005).

**`NameChip`** — remembered Diner names on the setup screen. White fill, `shadow-sm`, tap to add, long-press or `✕` to forget.

**`ShareCard`** — the node rendered to PNG. Renders standalone with no app chrome; see screen 11.

### Icons

A closed inline-SVG set, solid black, `currentColor`, ~14 glyphs:

```
camera  upload  pencil  close  check  plus  minus
person+ chevron warning share  copy   trash grip
```

**No icon font.** Material Symbols is a ligature font — until it loads, every icon renders as its own name in body text (`document_scanner` appearing as literal words on the parsing screen). Stories 14 and 16 exist because the network is bad; an icon set that spells itself during the wait is the wrong dependency. Inline SVG also removes the last third-party request, which matters in an app whose promise is that the receipt photo goes nowhere.

### Ornament

Static decorative treatments layered on top of the flat/hard-shadow base (§1, §4) — not new interactive components, and none of them animate outside the existing Start-only motion exception (§5). Full detail and per-screen placement in `docs/design/vibrant-neobrutalism-mockup.md`.

- **Dot texture** — 22×22px repeating SVG dot pattern, ink colour at 14% opacity, on the page background. Every screen, not just Start.
- **Folded corner** — solid-black triangular fold at a card's bottom-left corner.
- **Zigzag / torn-paper edge** — serrated `clip-path` divider. Start's hero/how-it-works seam; `ShareCard`'s bottom edge.
- **Rotated stamp badge** — small badge, a few degrees off-axis, own hard shadow. "SCANNED" on the Bill editor when a Bill came from a photo — provenance, independent of the reconciliation Banner's match/mismatch state.
- **Diamond warning badge** — a `Banner`'s warning icon as a black-bordered square rotated 45°, poking out of the Banner's corner, in place of an inline icon glyph. Assignment's desktop Incomplete Split Banner only.
- **Hand-drawn arrow** — single SVG stroke path. Start desktop hero only.
- **Rotated card** — a card tilted a few degrees with its own hard shadow, mimicking something dropped on a desk. Start desktop hero's receipt-preview illustration only.

---

## 9. Screens

Flow order. All 10 mockup screens now have rendered evidence: `docs/design/Split Bill App Redesign - Standalone.html` is the actual export (open it in a browser), `docs/design/vibrant-neobrutalism-mockup.md` is its prose description. Start there for a screen's actual layout (mobile + desktop) before writing markup, and use the §11 checklist on it same as any generated export. The prose below stays the normative summary of *behavior*; the mockup files are where the *look* lives.

```
Start ─┬─ scan ──────→ Capture ─→ Parsing ─┬─ Failure ─┐
       └─ enter manually ────────────────────┼──────────┘
                                             ↓
                          Bill editor + Reconciliation
                                             ↓
                                      Diner setup
                                             ↓
                        Assignment + Incomplete Split
                                             ↓
                                        Summary ─→ Share image

History (screen 12) sits outside this line — a TopBar icon reaches it from
any screen, and it always returns to a read-only Summary, never rejoins the
flow above.
```

**1 · Start** — first visit is a short landing page: hero (wordmark, tagline, the two entry points with scan dominant as a large icon-led button, and the "your photo is never stored" line), a three-step How it works, a handful of Features, and a one-line footer repeating the no-accounts promise. No nav bar, no external links — there's nothing else in the app to link to. Carries the landing-only ornament from §8 (folded corner, zigzag divider, hand-drawn arrow, rotated card on desktop). Once a Bill exists, Start drops the landing content — and that ornament — for the minimal choice it always was: *Resume* over *New Bill*, and *New Bill* warns that it discards the current one before acting on it.

**2 · Capture** — mobile opens the camera directly with a library fallback. Desktop cannot assume a camera, so a drag-and-drop file zone is primary and webcam secondary. *Enter manually instead* stays reachable.

**3 · Parsing** — `ProgressCard`, cancellable. Progress must be honest; if the stage is unknown, show an indeterminate state rather than a fake percentage.

**4 · Failure** — parse failed, offline, rate-limited. Three copies, one layout: `alert` Banner, plain cause, and a primary action into the empty editor. Failure is a detour, never a dead end (ADR-0004).

**5 · Bill editor** — the most important screen. Place and Date at the top (omitted entirely when empty, never shown blank), currency prominent, Line Items with inline editing of name/qty/unit price/line total, then Adjustments as reorderable `AdjustmentRow`s. Entering qty and unit price fills the line total; the line total is overridable and authoritative. A rotated "SCANNED" stamp badge (§8 Ornament) appears top-right when the Bill came from a photo — independent of the reconciliation Banner below, which reports the totals match/mismatch, not the provenance.

**6 · Reconciliation** — a Banner on the editor, not a screen. Matching: neutral, quiet, one line. Mismatching: `alert` fill, both totals, and the signed discrepancy.

```
┌────────────────────────────────────────┐
│ ⚠  DOESN'T MATCH THE RECEIPT           │
│    Computed  Rp 156.177                │
│    Printed   Rp 159.100                │
│    Difference   Rp 2.923               │
└────────────────────────────────────────┘
```

**7 · Diner setup** — `NameChip`s of remembered names above a text field; current Diners as removable chips carrying their `diner-N` colour; one markable as Payer. Removing a Diner removes their Shares with them.

**8 · Assignment** — `AssignmentLineItemRow` list in Receipt order. Every current Diner renders as a chip on every row; tapping a chip toggles that Diner's claim on the spot — no modal for the default (even-split) case. A second tap on an already-claimed chip opens `AssignmentPicker`, narrowed to that row's claimers, for a custom share (ADR-0011). Running Totals in the `StickySummaryBar`. At ≥1024px the right-hand column also carries `AssignmentDinerTotals`, a live per-Diner running Total pinned above the Bill Total and Continue action; below that width the row list alone fills the screen and each row splits across two lines (name/quantity, then chips/amount) to stay legible at the narrower measure. The busiest screen in the app.

**9 · Incomplete Split** — persistent `alert` Banner naming the unclaimed Line Items and their value, with a one-tap *split these between everyone*. **Blocks sharing**: the Continue button renders `disabled` and its own label explains why ("Continue (resolve Incomplete Split)") — it is not a dismissible warning. Desktop's Banner carries the diamond warning badge (§8 Ornament); mobile's doesn't have room for it.

**10 · Summary** — Payer named and what they're owed, then each Diner's Total with an itemised breakdown, then the reconciliation line. No native share sheet: a "Copy text" button always copies the plain-text summary to the clipboard, and a "Download image" button always saves the share PNG directly.

**11 · Share image** — the one non-responsive surface. Rendered from the `ShareCard` DOM node to PNG at a fixed width, so it must read standalone: Place and Date at the top, every Diner's Total with items, who to pay, and no app chrome, buttons or navigation. Inline the fonts — a webfont that hasn't loaded renders into the PNG as a fallback.

**12 · History** — reached from the TopBar icon on any screen, never part of the linear flow above. A list of past Bills — Place, Date, Total, when it was archived — newest first, built entirely from `localStorage`. Tapping one reopens its Summary (screen 10) read-only; nothing in History is editable, and there is no route back into the live editor from here. Empty state explains it fills in as Bills are finished or discarded (ADR-0008).

---

## 10. Known risks

**Resolved: the picker's gesture cost.** Assigning used to be open → set → close per row, ~36 gestures for a 12-item Bill. §8/§9 screen 8 now describe always-visible tap-to-claim chips instead (~15 gestures), with `AssignmentPicker` narrowed to the custom-share case only. See ADR-0011. Still worth watching in practice at six Diners on a narrow phone — a row with six chips plus name/qty/total is dense — but the fix if it doesn't hold up is tightening chip size, not reopening the picker.

**Resolved: Diner colours flanking the primary.** The old `diner-5`/`diner-6` (lilac/aqua) sat either side of the old blue primary in hue. The new set (§2) was chosen with the new orange primary already in mind and reads as clearly separate from all six.

**`surface-variant` has no source value.** The mockup never renders a distinct inert/track fill — Parsing's pending step is white+border, not grey. §2 reuses `disabled` (`#E7E7E7`) for `surface-variant` rather than inventing an unreviewed seventh neutral. If a real progress track shows up somewhere this doesn't cover well, that's the moment to give it its own value, not before.

**Code hasn't caught up.** `src/design/tokens.ts`, `AssignmentLineItemRow`, `AssignmentPicker`, `DinerChip`, `StartScreen.tsx` and the rest all still implement the *previous* muted palette and the picker-first interaction. This file and `docs/design/vibrant-neobrutalism-mockup.md` are the confirmed target, not a description of what's currently running.

---

## 11. Checklist for new design evidence

These mistakes show up reliably in generated exports, Stitch or otherwise. Check every one before merging.

- [ ] White text anywhere — especially a white label on a `primary-container` button
- [ ] `fontWeight: 900` on a heading token
- [ ] Amounts set in a `headline-*` token; missing `tabular-nums`
- [ ] `borderRadius.full: 9999px`; `rounded-full` avatars
- [ ] `darkMode: "class"` and no-op `dark:` utilities
- [ ] `outline`, `primary`, `error`, `on-*` or `mint-green` referenced
- [ ] `primary-container` used as a Diner colour
- [ ] Nav offering Groups, Pricing or API; a footer with links to pages the app doesn't have (Privacy, Terms, social) — Start's own one-line footer is the only exception
- [ ] An *account-backed* History — login, sync, "your bills" tied to an identity. The one local-History TopBar icon (§8, §9 screen 12) is the only History affordance, and it stays view-only, local, and account-free (ADR-0008)
- [ ] `cdn.tailwindcss.com`; duplicate Google Fonts `<link>`s
- [ ] `lh3.googleusercontent.com` placeholder images
- [ ] "Settle Up", "Split Sheet", "The Party", "Participant", "Total Owed"
- [ ] Payment status chips; Line Item categories; an assignable Adjustment
- [ ] Dollar amounts instead of the IDR worked example
