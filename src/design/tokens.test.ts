import type { Config } from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config'
import { contrastRatio } from './contrast'
import { borderRadius, colors, deletedColorTokens, textColorTokens, typeScale } from './tokens'

describe('colour tokens', () => {
  const nonColorKeys = new Set(['transparent', 'current'])
  const fillTokens = (Object.keys(colors) as (keyof typeof colors)[]).filter(
    (key) => !nonColorKeys.has(key) && !textColorTokens.includes(key),
  )

  it('every fill token pairs with #000000 at >= 7:1 (AAA)', () => {
    for (const token of fillTokens) {
      const ratio = contrastRatio(colors[token], '#000000')
      expect(ratio, `${token} (${colors[token]}) vs #000000`).toBeGreaterThanOrEqual(7)
    }
  })

  it('no token is pure white — the page ground is a warm off-white, not #FFFFFF', () => {
    const white = Object.entries(colors)
      .filter(([, value]) => value.toUpperCase() === '#FFFFFF')
      .map(([key]) => key)

    expect(white).toEqual([])
  })

  it('on-surface and on-background clear AAA (7:1) against both grounds, and are distinct from pure-black', () => {
    const grounds = [colors.background, colors['surface-container-lowest']]
    for (const token of ['on-surface', 'on-background', 'on-surface-variant'] as const) {
      for (const ground of grounds) {
        const ratio = contrastRatio(colors[token], ground)
        expect(ratio, `${token} (${colors[token]}) vs ${ground}`).toBeGreaterThanOrEqual(7)
      }
    }

    expect(colors['on-surface']).not.toBe(colors['pure-black'])
    expect(colors['on-background']).not.toBe(colors['pure-black'])
  })

  it('surface-variant reuses disabled — no distinct inert/track value in the mockup (DESIGN.md §10)', () => {
    expect(colors['surface-variant']).toBe(colors.disabled)
  })

  it('every deleted token is absent from the palette', () => {
    for (const token of deletedColorTokens) {
      expect(colors, token).not.toHaveProperty(token)
    }
  })
})

describe('type scale', () => {
  it('every amount-* token carries tabular-nums and is distinct from headline-*', () => {
    for (const [name, token] of Object.entries(typeScale)) {
      if (name.startsWith('amount-')) {
        expect(token.tabularNums, name).toBe(true)
        expect(token.family, name).toBe('body')
      }
    }
  })

  it('no headline-* token carries tabular-nums', () => {
    for (const [name, token] of Object.entries(typeScale)) {
      if (name.startsWith('headline-')) {
        expect(token.tabularNums, name).toBeFalsy()
        expect(token.family, name).toBe('display')
      }
    }
  })
})

describe('tailwind theme', () => {
  it('every borderRadius value is 0', () => {
    for (const [name, value] of Object.entries(borderRadius)) {
      expect(value, name).toBe('0px')
    }
  })

  it('has no darkMode key configured', () => {
    expect((tailwindConfig as Config).darkMode).toBeUndefined()
  })
})
