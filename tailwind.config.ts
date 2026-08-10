import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { borderRadius, borderWidth, boxShadow, colors, dotTexture, fontFamily, typeScale } from './src/design/tokens'

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

// DESIGN.md §8 Ornament: the dot-textured page background, emitted as a
// utility (rather than an inline style) so it composes with the rest of the
// className list on the app-shell element in App.tsx.
const dotTexturePlugin = plugin(({ addUtilities }) => {
  addUtilities({
    '.bg-dot-texture': {
      backgroundImage: dotTexture.backgroundImage,
      backgroundSize: dotTexture.backgroundSize,
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
        // (`-rotate-3`) instead of no rotation, so entrance hands off to that
        // utility class cleanly too.
        'receipt-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) rotate(0deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(-3deg)' },
        },
        // Issue #46: the scan-line sweeping down ProgressCard's receipt
        // illustration — DESIGN.md §5's Parsing carve-out, mirroring
        // vibrant-neobrutalism-mockup.md §3's `@keyframes scan{0%{top:0}100%{top:100%}}`.
        // The illustration wrapper is `overflow-hidden`, so the bar clips at
        // the bottom edge exactly as in the mockup rather than escaping it.
        'receipt-scan': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.2s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 500ms ease-out',
        'receipt-in': 'receipt-in 600ms ease-out',
        'receipt-scan': 'receipt-scan 1.8s linear infinite',
      },
    },
  },
  plugins: [typeScalePlugin, dotTexturePlugin],
} satisfies Config
