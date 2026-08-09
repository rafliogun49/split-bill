// The Bill <-> localStorage seam (ADR-0001). Exactly one active Bill is
// stored; the envelope is versioned so a later change to the Bill shape can
// discard old data on load instead of crashing on it.

import type { Bill } from '../../domain'
import { safeGetItem, safeRemoveItem, safeSetItem } from './storage'

const STORAGE_KEY = 'split-bill:bill'
const VERSION = 1

interface StoredBill {
  version: number
  bill: Bill
}

export function loadBill(): Bill | null {
  const raw = safeGetItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StoredBill
    if (parsed.version !== VERSION || !parsed.bill) return null
    return parsed.bill
  } catch {
    return null
  }
}

export function saveBill(bill: Bill): void {
  const stored: StoredBill = { version: VERSION, bill }
  safeSetItem(STORAGE_KEY, JSON.stringify(stored))
}

export function clearBill(): void {
  safeRemoveItem(STORAGE_KEY)
}
