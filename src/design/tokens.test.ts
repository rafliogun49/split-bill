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

  it('no token except background and surface-container-lowest is #FFFFFF', () => {
    const white = Object.entries(colors)
      .filter(([, value]) => value.toUpperCase() === '#FFFFFF')
      .map(([key]) => key)
      .sort()

    expect(white).toEqual(['background', 'surface-container-lowest'])
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
