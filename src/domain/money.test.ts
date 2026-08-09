import { describe, expect, it } from 'vitest'
import { formatMoney } from './money.ts'

describe('formatMoney', () => {
  it('derives two decimal places for SGD from Intl', () => {
    expect(formatMoney(1234, { code: 'SGD' }, 'en-SG')).toBe('$12.34')
  })

  it('derives zero decimal places for JPY from Intl', () => {
    expect(formatMoney(1234, { code: 'JPY' }, 'en-US')).toBe('¥1,234')
  })

  it('formats a negative amount (discount) with a minus sign', () => {
    expect(formatMoney(-500, { code: 'SGD' }, 'en-SG')).toBe('-$5.00')
  })

  it('formats zero', () => {
    expect(formatMoney(0, { code: 'SGD' }, 'en-SG')).toBe('$0.00')
  })
})
