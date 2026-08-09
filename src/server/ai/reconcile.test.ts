import { describe, expect, it } from 'vitest'
import { reconcile } from './reconcile'

describe('reconcile', () => {
  it('matches when the computed total equals the printed total', () => {
    const result = reconcile({
      lineItems: [{ name: 'Latte', quantity: 1, total: 500 }],
      adjustments: [{ label: 'Tax', amount: 50 }],
      printedTotal: 550,
    })

    expect(result).toEqual({ status: 'match', computedTotal: 550 })
  })

  it('reports a mismatch with a signed difference when the printed total is higher', () => {
    const result = reconcile({
      lineItems: [{ name: 'Latte', quantity: 1, total: 500 }],
      adjustments: [],
      printedTotal: 600,
    })

    expect(result).toEqual({
      status: 'mismatch',
      computedTotal: 500,
      printedTotal: 600,
      difference: -100,
    })
  })

  it('reports a mismatch with a positive difference when the computed total is higher', () => {
    const result = reconcile({
      lineItems: [{ name: 'Latte', quantity: 1, total: 700 }],
      adjustments: [],
      printedTotal: 600,
    })

    expect(result).toEqual({
      status: 'mismatch',
      computedTotal: 700,
      printedTotal: 600,
      difference: 100,
    })
  })

  it('reports no-printed-total when the receipt had no grand total', () => {
    const result = reconcile({
      lineItems: [{ name: 'Latte', quantity: 1, total: 500 }],
      adjustments: [],
    })

    expect(result).toEqual({ status: 'no-printed-total', computedTotal: 500 })
  })

  it('allows negative adjustments (discounts) to lower the computed total', () => {
    const result = reconcile({
      lineItems: [{ name: 'Latte', quantity: 1, total: 1000 }],
      adjustments: [{ label: 'Promo', amount: -200 }],
      printedTotal: 800,
    })

    expect(result).toEqual({ status: 'match', computedTotal: 800 })
  })
})
