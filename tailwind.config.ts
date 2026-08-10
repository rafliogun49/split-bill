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

// DESIGN.md's colour palette / vibrant-neobrutalism-mockup.md: a 22×22px
// repeating dot, ink-coloured at 14% opacity, applied once at the app-shell
// level so it renders behind every screen rather than being reimplemented
// per screen.
const dotTexturePlugin = plugin(({ addUtilities }) => {
  const dot = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='11' cy='11' r='1.5' fill='${colors['on-background']}' fill-opacity='0.14'/></svg>`,
  )
  addUtilities({
    '.bg-dot-texture': {
      backgroundImage: `url("data:image/svg+xml,${dot}")`,
      backgroundRepeat: 'repeat',
    },
  })
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
    extend: {
      keyframes: {
        // ProgressCard's indeterminate fill (DESIGN.md screen 3): a
        // sliding block rather than a percentage, since the stage it
        // represents has no knowable completion fraction.
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        // Issue #23: entrance for Start's landing hero and its How-it-works /
        // Features cards — DESIGN.md §5's other named carve-out. One-shot, no
        // fill-mode: the keyframe's 100% frame matches each element's own
        // resting (non-animated) styles, so when the animation ends control
        // reverts to the ordinary cascade with no visible snap.
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Same shape, but lands on the receipt illustration's resting tilt
        // (`-rotate-2`, DESIGN.md §8 Ornament "Rotated card") instead of no
        // rotation, so entrance hands off to that utility class cleanly too.
        'receipt-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) rotate(0deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(-2deg)' },
        },
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.2s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 500ms ease-out',
        'receipt-in': 'receipt-in 600ms ease-out',
      },
    },
  },
  plugins: [typeScalePlugin, dotTexturePlugin],
} satisfies Config
