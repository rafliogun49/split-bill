// Single source of truth for the design tokens in DESIGN.md.
// tailwind.config.ts builds the theme from this file; tokens.test.ts
// asserts the acceptance criteria against the same data.

export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  background: '#EDE6DC',
  'surface-container-lowest': '#FFF7ED',
  // No distinct inert/track fill exists in the confirmed mockup — reuses `disabled`.
  'surface-variant': '#E7E7E7',
  'pure-black': '#000000',
  // Warm near-black ink, deliberately distinct from `pure-black` (borders/shadows).
  'on-surface': '#1A1720',
  'on-background': '#1A1720',
  'on-surface-variant': '#4A4458',
  'primary-container': '#FF936A',
  'error-container': '#FF7E8E',
  disabled: '#E7E7E7',
  'diner-1': '#66D4FC',
  'diner-2': '#A4D589',
  'diner-3': '#EFA9E8',
  'diner-4': '#E6BE68',
  'diner-5': '#61DCC7',
  'diner-6': '#B5BCFF',
} as const

export type ColorToken = keyof typeof colors

// Text-role tokens: read as ink on a light ground, not as a fill that
// needs to host black text on top of it. Excluded from the fill-contrast
// check below (see tokens.test.ts for why on-surface-variant's ratios in
// DESIGN.md are measured against the two page grounds, not black).
export const textColorTokens: ColorToken[] = [
  'pure-black',
  'on-surface',
  'on-background',
  'on-surface-variant',
]

// Present in Stitch exports, deliberately absent here (DESIGN.md §2, ADR-0007).
export const deletedColorTokens = [
  'outline',
  'primary',
  'error',
  'on-primary',
  'on-secondary',
  'on-tertiary',
  'on-error',
  'secondary',
  'tertiary',
  'secondary-container',
  'tertiary-container',
  'primary-fixed',
  'primary-fixed-dim',
  'secondary-fixed',
  'secondary-fixed-dim',
  'tertiary-fixed',
  'tertiary-fixed-dim',
  'inverse-surface',
  'inverse-on-surface',
  'inverse-primary',
  'surface-tint',
  'outline-variant',
  'mint-green',
  'cyber-yellow',
  'flamingo-pink',
] as const

export const fontFamily: Record<'display' | 'body', string[]> = {
  display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
}

export interface TypeScaleToken {
  family: keyof typeof fontFamily
  /** Size used at >= md (768px). */
  size: string
  /** Size used below md, when the token is responsive (display-xl only). */
  sizeBelowMd?: string
  lineHeight: string
  letterSpacing?: string
  weight: number
  tabularNums?: boolean
}

export const typeScale: Record<string, TypeScaleToken> = {
  'display-xl': {
    family: 'display',
    size: '80px',
    sizeBelowMd: '56px',
    lineHeight: '80px',
    letterSpacing: '-0.02em',
    weight: 400,
  },
  'headline-lg': { family: 'display', size: '48px', lineHeight: '52px', weight: 400 },
  'headline-md': { family: 'display', size: '32px', lineHeight: '36px', weight: 400 },
  'headline-sm': { family: 'display', size: '24px', lineHeight: '28px', weight: 400 },
  'body-lg': { family: 'body', size: '18px', lineHeight: '28px', weight: 500 },
  'body-md': { family: 'body', size: '16px', lineHeight: '24px', weight: 400 },
  'label-bold': { family: 'body', size: '14px', lineHeight: '20px', weight: 700 },
  'label-sm': { family: 'body', size: '12px', lineHeight: '16px', weight: 600 },
  'amount-lg': { family: 'body', size: '32px', lineHeight: '36px', weight: 600, tabularNums: true },
  'amount-md': { family: 'body', size: '20px', lineHeight: '28px', weight: 600, tabularNums: true },
  'amount-sm': { family: 'body', size: '16px', lineHeight: '24px', weight: 600, tabularNums: true },
}

// Zero everywhere, including `full` — Diner chips are squares (DESIGN.md rule 4).
export const borderRadius = {
  none: '0px',
  sm: '0px',
  DEFAULT: '0px',
  md: '0px',
  lg: '0px',
  xl: '0px',
  '2xl': '0px',
  '3xl': '0px',
  full: '0px',
} as const

// 4px solid black, every size, every breakpoint — only DEFAULT and 0 exist,
// so there is no `border-2` / `border-8` to reach for by mistake.
export const borderWidth = {
  DEFAULT: '4px',
  0: '0px',
} as const

// Hard offset shadows only: zero blur, zero spread, pure black.
export const boxShadow = {
  none: 'none',
  sm: '4px 4px 0 #000000',
  md: '6px 6px 0 #000000',
  lg: '8px 8px 0 #000000',
  'summary-bar': '0 -8px 0 #000000',
} as const
