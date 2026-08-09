// Allocation and rate-resolution internals for calculateSplit. Deliberately
// untested on their own — see ADR-0003: they're reachable through
// calculateSplit, and pinning them separately would fix implementation
// detail in place.

/**
 * Splits `amount` minor units across `weights` proportionally, preserving
 * the exact sum via largest-remainder allocation: floor every part, then
 * hand the leftover minor units to the largest discarded fractions,
 * tie-broken by index. Negative amounts (discounts) spread by the same
 * rule, mirrored in sign.
 *
 * If every weight is zero, falls back to an equal split so the sum
 * invariant still holds when there is nothing to be proportional to (e.g.
 * an Adjustment allocated by Subtotal when every Diner's Subtotal is 0).
 */
export function allocateByWeight(amount: number, weights: number[]): number[] {
  if (amount < 0) return allocateByWeight(-amount, weights).map((value) => -value)
  if (weights.length === 0) return []

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const effectiveWeights = totalWeight === 0 ? weights.map(() => 1) : weights
  const effectiveTotal = totalWeight === 0 ? weights.length : totalWeight

  const raw = effectiveWeights.map((weight) => (amount * weight) / effectiveTotal)
  const floored = raw.map(Math.floor)
  const remainder = amount - floored.reduce((sum, value) => sum + value, 0)

  const byLargestFraction = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)

  const result = [...floored]
  for (let i = 0; i < remainder; i++) {
    result[byLargestFraction[i].index] += 1
  }
  return result
}

/** Rounds numerator/denominator half up (ties toward +Infinity). `denominator` must be positive. */
export function roundHalfUp(numerator: number, denominator: number): number {
  const quotient = Math.floor(numerator / denominator)
  const remainder = numerator - quotient * denominator
  return remainder * 2 >= denominator ? quotient + 1 : quotient
}

/** Resolves a rate in basis points (1100 = 11%) against a running total, half up. */
export function resolveRate(runningTotal: number, rateBps: number): number {
  return roundHalfUp(runningTotal * rateBps, 10000)
}
