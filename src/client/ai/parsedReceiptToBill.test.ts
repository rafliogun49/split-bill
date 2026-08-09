import { describe, expect, it } from 'vitest'
import type { ParsedReceipt } from './parseReceiptClient'
import { parsedReceiptToBill } from './parsedReceiptToBill'

function receipt(overrides: Partial<ParsedReceipt> = {}): ParsedReceipt {
  return {
    currency: 'idr',
    lineItems: [{ name: 'Nasi Goreng', quantity: 2, total: 50000 }],
    adjustments: [{ label: 'Tax', amount: 5000 }],
    reconciliation: { status: 'match', computedTotal: 55000 },
    ...overrides,
  }
}

describe('parsedReceiptToBill', () => {
  it('produces a Bill with no privileged shape — same fields manual entry would produce', () => {
    const bill = parsedReceiptToBill(receipt({ placeName: 'Waroeng SS', date: '2025-08-30' }))

    expect(bill.currency).toEqual({ code: 'IDR' })
    expect(bill.place).toBe('Waroeng SS')
    expect(bill.date).toBe('2025-08-30')
    expect(bill.diners).toEqual([])
    expect(bill.payerId).toBeUndefined()
  })

  it('maps a parsed Line Item to the domain shape, starting unassigned', () => {
    const bill = parsedReceiptToBill(receipt())

    expect(bill.lineItems).toHaveLength(1)
    expect(bill.lineItems[0]).toMatchObject({ label: 'Nasi Goreng', amount: 50000, quantity: 2, shares: {} })
    expect(bill.lineItems[0].id).toBeTruthy()
  })

  it('maps every Adjustment to a fixed-kind Adjustment', () => {
    const bill = parsedReceiptToBill(receipt())

    expect(bill.adjustments).toEqual([{ kind: 'fixed', label: 'Tax', amount: 5000 }])
  })

  it('omits place and date when the Receipt did not carry them', () => {
    const bill = parsedReceiptToBill(receipt())

    expect(bill.place).toBeUndefined()
    expect(bill.date).toBeUndefined()
  })

  it('assigns each Line Item a distinct id', () => {
    const bill = parsedReceiptToBill(
      receipt({
        lineItems: [
          { name: 'Latte', quantity: 1, total: 20000 },
          { name: 'Tea', quantity: 1, total: 10000 },
        ],
      }),
    )

    expect(bill.lineItems[0].id).not.toBe(bill.lineItems[1].id)
  })
})
