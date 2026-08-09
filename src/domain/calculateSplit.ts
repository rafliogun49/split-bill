import { allocateByWeight, resolveRate } from './allocate.ts'
import type { Adjustment, Bill, DinerId, LineItemId } from './types.ts'

export interface DinerLineItemAmount {
  lineItemId: LineItemId
  amount: number
}

/** A resolved Adjustment amount — either the Bill-level resolved figure or one Diner's allocated share of it. */
export interface AdjustmentAmount {
  label: string
  amount: number
}

export interface DinerSplit {
  dinerId: DinerId
  lineItems: DinerLineItemAmount[]
  subtotal: number
  adjustments: AdjustmentAmount[]
  total: number
}

export interface Split {
  diners: DinerSplit[]
  /** Bill-level: sum of every Line Item's amount, regardless of Shares. */
  subtotal: number
  /** Each Adjustment resolved to a fixed minor-unit amount, in list order. */
  adjustments: AdjustmentAmount[]
  adjustmentsTotal: number
  /** subtotal + adjustmentsTotal. */
  total: number
  unassignedLineItemIds: LineItemId[]
  isComplete: boolean
}

function resolveAdjustments(subtotal: number, adjustments: Adjustment[]): AdjustmentAmount[] {
  const resolved: AdjustmentAmount[] = []
  let runningTotal = subtotal
  for (const adjustment of adjustments) {
    const amount =
      adjustment.kind === 'fixed' ? adjustment.amount : resolveRate(runningTotal, adjustment.rateBps)
    resolved.push({ label: adjustment.label, amount })
    runningTotal += amount
  }
  return resolved
}

/** Pure: divides a Bill into each Diner's itemised amounts, Subtotal, allocated Adjustments and Total. */
export function calculateSplit(bill: Bill): Split {
  const dinerIds = bill.diners.map((d) => d.id)

  const subtotal = bill.lineItems.reduce((sum, item) => sum + item.amount, 0)

  const dinerSubtotals = new Map<DinerId, number>(dinerIds.map((id) => [id, 0]))
  const dinerLineItems = new Map<DinerId, DinerLineItemAmount[]>(dinerIds.map((id) => [id, []]))
  const unassignedLineItemIds: LineItemId[] = []

  for (const item of bill.lineItems) {
    const participantIds = dinerIds.filter((id) => (item.shares[id] ?? 0) > 0)
    if (participantIds.length === 0) {
      unassignedLineItemIds.push(item.id)
      continue
    }

    const weights = participantIds.map((id) => item.shares[id] ?? 0)
    const amounts = allocateByWeight(item.amount, weights)
    participantIds.forEach((id, index) => {
      dinerSubtotals.set(id, (dinerSubtotals.get(id) ?? 0) + amounts[index]!)
      dinerLineItems.get(id)!.push({ lineItemId: item.id, amount: amounts[index]! })
    })
  }

  const resolvedAdjustments = resolveAdjustments(subtotal, bill.adjustments)
  const adjustmentsTotal = resolvedAdjustments.reduce((sum, a) => sum + a.amount, 0)
  const total = subtotal + adjustmentsTotal

  const subtotalWeights = dinerIds.map((id) => dinerSubtotals.get(id) ?? 0)
  const dinerAdjustments = new Map<DinerId, AdjustmentAmount[]>(dinerIds.map((id) => [id, []]))
  for (const resolved of resolvedAdjustments) {
    const amounts = allocateByWeight(resolved.amount, subtotalWeights)
    dinerIds.forEach((id, index) => {
      dinerAdjustments.get(id)!.push({ label: resolved.label, amount: amounts[index]! })
    })
  }

  const diners: DinerSplit[] = dinerIds.map((id) => {
    const dinerSubtotal = dinerSubtotals.get(id) ?? 0
    const dinerAdjustmentAmounts = dinerAdjustments.get(id) ?? []
    const dinerAdjustmentsTotal = dinerAdjustmentAmounts.reduce((sum, a) => sum + a.amount, 0)
    return {
      dinerId: id,
      lineItems: dinerLineItems.get(id) ?? [],
      subtotal: dinerSubtotal,
      adjustments: dinerAdjustmentAmounts,
      total: dinerSubtotal + dinerAdjustmentsTotal,
    }
  })

  return {
    diners,
    subtotal,
    adjustments: resolvedAdjustments,
    adjustmentsTotal,
    total,
    unassignedLineItemIds,
    isComplete: unassignedLineItemIds.length === 0,
  }
}
