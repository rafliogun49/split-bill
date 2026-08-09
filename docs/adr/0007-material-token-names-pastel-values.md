# Material 3 token names, pastel AAA values

The design tokens are named with Material Design 3's vocabulary — `primary-container`, `surface-container-lowest`, `on-surface-variant` — but every value behind them belongs to a pastel neobrutalist system that shares nothing with Material: pure-black 4px borders, hard offset shadows, zero radius, flat pastel fills. A reader who recognises the names will expect elevation, tonal surfaces and Material's contrast model, and will find none of them.

The names were kept because screens are drafted in Google Stitch, which emits a Material 3 token set regardless of what the prompt asks for. Renaming the tokens would mean hand-editing every export before it could be used; keeping them means an export pastes in and simply resolves to our palette. The alternative — our own `--brand` / `--ink` / `--ground` vocabulary — was rejected for that reason alone, not because it reads worse.

## Consequences

- Tokens that cannot exist in this system are **deleted rather than overridden**, so a violating value is unavailable rather than merely discouraged. `on-primary`, `on-secondary`, `on-tertiary` and `on-error` (all `#ffffff`) are gone, because pastel fills are light and there is no white text anywhere in the app. `outline` (`#737781`) is gone at 4.26:1 against the ground — it fails AAA and AA both, and Stitch had it carrying real body copy. `primary` (`#315f9d`) and `error` (`#ba1a1a`) are gone because their only purpose is to host white text, at 6.45:1 and 6.54:1.
- A Stitch export that references a deleted token fails visibly — the utility class resolves to nothing — instead of silently rendering an inaccessible pairing.
- Material's three container tokens cannot express six Diner colours, so `diner-1` … `diner-6` sit alongside the Material names as an explicitly non-Material scale. `primary-container` is reserved for buttons; Stitch had assigned it to a Diner, making that person's chip identical to the primary button on the same screen.
- `borderRadius.full` is `0px`, not `9999px`. Material markup written for circular avatars renders them square, which is intended.
- The names are a Stitch-compatibility affordance and nothing more. If screens stop being drafted in Stitch, the reason for this decision is gone and renaming becomes worth doing.
