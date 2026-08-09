import { describe, expect, it } from 'vitest'
import { localeForCurrency } from './format'

describe('localeForCurrency', () => {
  it('maps IDR to id-ID so amounts render with dot separators and no decimals', () => {
    expect(localeForCurrency('IDR')).toBe('id-ID')
  })

  it('maps SGD to en-SG', () => {
    expect(localeForCurrency('SGD')).toBe('en-SG')
  })

  it('falls back to en-US for an unmapped currency', () => {
    expect(localeForCurrency('USD')).toBe('en-US')
  })
})
