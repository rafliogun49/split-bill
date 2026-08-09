# Split Bill — Design

The reference an agent reads **before** writing any UI. It is normative: where this file and a Stitch export disagree on tokens, copy, or the four rules in §1, this file wins. For a screen with Stitch evidence, the export's markup and layout are the starting point — adapt it through the §11 checklist, don't redesign it from this file's prose.

Companion documents:

| File | Holds |
|---|---|
| `CONTEXT.md` | Domain vocabulary. All UI copy obeys it. |
| `docs/adr/0007-…` | Why the tokens carry Material 3 names |
| `docs/design/stitch-design.md` | Raw Stitch exports — the layout to adapt for screens listed in §9; run every export through §11's checklist, never redesign from scratch |
| `docs/design/stitch-prompts.md` | Prompts used to generate them |
| [issue #1](https://github.com/rafliogun49/split-bill/issues/1) | The product spec — 59 stories |

The style is **pastel neobrutalism**: pure-black 4px borders, hard offset shadows with zero blur, zero corner radius, flat pastel fills, no gradients, no elevation, no translucency. Everything is either black, white, or one flat pastel.

---

## 1. Four rules that override everything

These are not preferences. Code that breaks them is wrong.

**1. There is no white text anywhere in the app.** Pastel fills are light. White on the brand `#8AB4F8` is **2.11:1**. Every fill in this system carries black text. The tokens that would permit white text (`on-primary`, `on-secondary`, `on-tertiary`, `on-error`) are deleted, not overridden.

**2. Every colour pairing clears WCAG 2.1 AAA** — 7:1 for normal text, 4.5:1 for large. Measured ratios are in §2. Proposing a new colour means computing and stating its ratio.

**3. `primary-container` is a button fill and nothing else.** It is never text, never a numeral, never an icon (pastel blue as text on white is 2.11:1), and never a Diner colour.

**4. Zero corner radius, no exceptions.** `borderRadius.full` is `0px`. Diner chips are squares.

---

## 2. Colour

All ratios measured against `#000000` unless stated. Every one clears AAA.

### Tokens

| Token | Value | Role | Ratio |
|---|---|---|---|
| `background` | `#FFFFFF` | page ground | 21.0:1 |
| `surface-container-lowest` | `#FFFFFF` | card fill | 21.0:1 |
| `surface-variant` | `#E2E2E2` | inert fill, progress track | 16.2:1 |
| `pure-black` | `#000000` | borders, shadows, all ink | — |
| `on-surface` | `#000000` | body text | 21.0:1 |
| `on-background` | `#000000` | body text | 21.0:1 |
| `on-surface-variant` | `#424750` | secondary labels only | 9.3:1 |
| `primary-container` | `#8AB4F8` | primary button fill | 10.0:1 |
| `error-container` | `#FCA5A5` | destructive + mismatch fill | 11.1:1 |
| `disabled` | `#E5E5E5` | disabled fill | 16.7:1 |

### Diner scale

Not a Material scale. Allocated by join order: `diner-{(index % 6) + 1}`.

| Token | Value | Ratio |
|---|---|---|
| `diner-1` | `#FDE68A` butter | 16.9:1 |
| `diner-2` | `#FDBA74` peach | 12.5:1 |
| `diner-3` | `#F9A8D4` pink | 11.6:1 |
| `diner-4` | `#A7F3D0` mint | 16.4:1 |
| `diner-5` | `#C4B5FD` lilac | 11.4:1 |
| `diner-6` | `#A5F3FC` aqua | 16.8:1 |

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

There is **no success colour**. "Good" is expressed as the absence of `error-container`, not as green — this avoids a mint success fill colliding with `diner-4`.

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

**`AssignmentLineItemRow`** — the Assignment screen's row (screen 8): read-only name, quantity, line total, claimed `DinerChip`s, chevron. ~72px tall at ≥1024px; below that it splits across two lines (name/quantity, then chips/amount/chevron) since the row no longer shares its width with a desktop summary column. Tapping anywhere opens `AssignmentPicker`. Unclaimed rows show a `+person` icon in place of chips. A distinct component from `LineItemRow` rather than a shared one, since one edits the Line Item and the other only opens the picker onto it.

**`DinerChip`** — 44×44 square, `diner-N` fill, black border, initial in `label-bold`. Claimed carries `shadow-sm`; unclaimed carries none. A Share count above 1 renders as a superscript badge in the top-right corner. Claimed/unclaimed must never depend on fill alone.

**`AssignmentPicker`** — bottom sheet on mobile, centred modal ≥1024px. Header names the Line Item and its total; one `Stepper` row per Diner; footer shows each claiming Diner's share of the row and a `DONE` button.

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

---

## 9. Screens

Flow order. Screens 1–5, 8 and 10 have Stitch evidence; the rest are specified here first.

For a screen with Stitch evidence, start from its export in `docs/design/stitch-design.md` — same structure, same component boundaries — and fix it up via the §11 checklist. Only screens without evidence are designed from the prose below.

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

**1 · Start** — first visit is a short landing page: hero (wordmark, tagline, the two entry points with scan dominant as a large icon-led button, and the "your photo is never stored" line), a three-step How it works, a handful of Features, and a one-line footer repeating the no-accounts promise. No nav bar, no external links — there's nothing else in the app to link to. Once a Bill exists, Start drops the landing content for the minimal choice it always was: *Resume* over *New Bill*, and *New Bill* warns that it discards the current one before acting on it.

**2 · Capture** — mobile opens the camera directly with a library fallback. Desktop cannot assume a camera, so a drag-and-drop file zone is primary and webcam secondary. *Enter manually instead* stays reachable.

**3 · Parsing** — `ProgressCard`, cancellable. Progress must be honest; if the stage is unknown, show an indeterminate state rather than a fake percentage.

**4 · Failure** — parse failed, offline, rate-limited. Three copies, one layout: `alert` Banner, plain cause, and a primary action into the empty editor. Failure is a detour, never a dead end (ADR-0004).

**5 · Bill editor** — the most important screen. Place and Date at the top (omitted entirely when empty, never shown blank), currency prominent, Line Items with inline editing of name/qty/unit price/line total, then Adjustments as reorderable `AdjustmentRow`s. Entering qty and unit price fills the line total; the line total is overridable and authoritative.

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

**8 · Assignment** — `LineItemRow` list in Receipt order, `AssignmentPicker` on tap, running Totals in the `StickySummaryBar`. At ≥1024px the right-hand column also carries `AssignmentDinerTotals`, a live per-Diner running Total pinned above the Bill Total and Continue action; below that width the row list alone fills the screen and each row splits across two lines (name/quantity, then claimed chips/amount/chevron) to stay legible at the narrower measure. The busiest screen in the app.

**9 · Incomplete Split** — persistent `alert` Banner naming the unclaimed Line Items and their value, with a one-tap *split these between everyone*. **Blocks sharing** — it is not a warning that can be dismissed.

**10 · Summary** — Payer named and what they're owed, then each Diner's Total with an itemised breakdown, then the reconciliation line. Share as text, share as image, copy to clipboard on desktop.

**11 · Share image** — the one non-responsive surface. Rendered from the `ShareCard` DOM node to PNG at a fixed width, so it must read standalone: Place and Date at the top, every Diner's Total with items, who to pay, and no app chrome, buttons or navigation. Inline the fonts — a webfont that hasn't loaded renders into the PNG as a fallback.

**12 · History** — reached from the TopBar icon on any screen, never part of the linear flow above. A list of past Bills — Place, Date, Total, when it was archived — newest first, built entirely from `localStorage`. Tapping one reopens its Summary (screen 10) read-only; nothing in History is editable, and there is no route back into the live editor from here. Empty state explains it fills in as Bills are finished or discarded (ADR-0008).

---

## 10. Known risks

**Lilac and aqua flank the brand blue.** `diner-5` `#C4B5FD` and `diner-6` `#A5F3FC` sit either side of `#8AB4F8` in hue. Reserving `primary-container` for buttons prevents the exact collision but not the resemblance. Judge it on a phone at six Diners. The chip initial and the claimed-state shadow are what carry meaning; colour is a third channel, not the only one. If it reads badly, swap `diner-6` to a pastel lime — a value change, no renames.

**The picker costs gestures.** Assigning a Line Item is open → set → close, so a 12-item Bill is roughly 36 gestures against 15 for always-visible chips. This was chosen deliberately for density and for rows that stay readable at six Diners. If it feels slow in use, the fix is chips on a second line inside each row, not a faster picker.

**Screens have no rendered evidence.** 6, 7, 9, 11, 12, plus the Adjustments half of 5, are specified from the product spec and this token system alone. Worth running through Stitch and revising. Screen 1 is now implemented directly in code (`StartScreen.tsx`) rather than from a Stitch export. Screen 12 (History) is new enough that it has no Stitch prompt at all yet.

---

## 11. Checklist for a new Stitch export

Stitch reliably reintroduces these. Check every one before merging an export.

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
