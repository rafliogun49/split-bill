import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { borderRadius, borderWidth, boxShadow, colors, fontFamily, typeScale } from './src/design/tokens'

// Emits one `.text-{token}` utility per DESIGN.md type-scale row, carrying
// font-family/size/line-height/weight/tracking together — Tailwind's built-in
// fontSize theme has no slot for `font-variant-numeric`, which the amount-*
// tokens require.
const typeScalePlugin = plugin(({ addUtilities, theme }) => {
  // CSS-in-JS shape (postcss-js), not Tailwind's own theme types — cast at
  // the addUtilities call below rather than fight CSSRuleObject's nominal typing.
  const utilities: Record<string, Record<string, unknown>> = {}

  for (const [name, token] of Object.entries(typeScale)) {
    // Tailwind resolves fontFamily arrays to a joined string internally, but
    // that's an implementation detail rather than a documented contract —
    // handle both shapes.
    const family = theme(`fontFamily.${token.family}`) as string | string[]
    const declarations: Record<string, unknown> = {
      fontFamily: Array.isArray(family) ? family.join(', ') : family,
      fontSize: token.sizeBelowMd ?? token.size,
      lineHeight: token.lineHeight,
      fontWeight: String(token.weight),
    }
    if (token.letterSpacing) declarations.letterSpacing = token.letterSpacing
    if (token.tabularNums) declarations.fontVariantNumeric = 'tabular-nums'
    if (token.sizeBelowMd) {
      declarations['@media (min-width: 768px)'] = { fontSize: token.size }
    }
    utilities[`.text-${name}`] = declarations
  }

  addUtilities(utilities as Parameters<typeof addUtilities>[0])
})

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // darkMode is intentionally omitted — DESIGN.md §2 rules dark mode out of
  // scope entirely, and no `dark:` utility is used anywhere in the app source
  // (enforced by src/design/no-dark-mode.test.ts).
  theme: {
    colors,
    fontFamily,
    borderRadius,
    borderWidth,
    borderColor: { DEFAULT: colors['pure-black'], ...colors },
    boxShadow,
    extend: {},
  },
  plugins: [typeScalePlugin],
} satisfies Config
