// A device-local archive of past Bills (ADR-0008), entirely separate from
// billStorage.ts's single active-Bill slot — that slot's load/save/clear
// behaviour is untouched; this module only reads Bill values handed to it
// and writes them into its own key. Nothing here ever crosses the network.
//
// A Bill archives in exactly two moments (App.tsx): when it reaches Summary,
// and when New Bill discards whatever was active. Both call `archiveBill`,
// which upserts by `Bill.id` rather than always appending — revisiting an
// already-archived Bill's Summary (e.g. a page refresh, or Back) updates its
// snapshot and total in place instead of piling up duplicate rows, and the
// updated entry moves to the front, same as a fresh archive would. Entries
// are otherwise immutable: nothing in the History or read-only Summary UI
// writes back through this module.

import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { safeGetItem, safeSetItem } from './storage'

const STORAGE_KEY = 'split-bill:bill-history'
const VERSION = 1
// Generous relative to how many Bills one device realistically accumulates
// (dinerNames.ts caps remembered names far lower because that list is a
// picker, not a record) — this is the whole point of History, so it trims
// only to keep localStorage from growing unbounded, not to keep the list
// short for the user.
const MAX_ENTRIES = 200

export interface BillHistoryEntry {
  id: string
  place?: string
  date?: string
  /** Bill Total in minor units at the moment of archiving — see calculateSplit. */
  total: number
  currencyCode: string
  /** ISO timestamp of when this entry was archived (or last re-archived). */
  archivedAt: string
  /** The full Bill snapshot, so the read-only Summary view can recompute its Split. */
  bill: Bill
}

interface StoredHistory {
  version: number
  entries: BillHistoryEntry[]
}

// Stored newest-first: archiveBill always unshifts, so callers never need
// to sort this themselves.
export function loadBillHistory(): BillHistoryEntry[] {
  const raw = safeGetItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as StoredHistory
    if (parsed.version !== VERSION || !Array.isArray(parsed.entries)) return []
    return parsed.entries
  } catch {
    return []
  }
}

export function getBillHistoryEntry(id: string): BillHistoryEntry | undefined {
  return loadBillHistory().find((entry) => entry.id === id)
}

export function archiveBill(bill: Bill): void {
  const split = calculateSplit(bill)
  const entry: BillHistoryEntry = {
    id: bill.id,
    place: bill.place,
    date: bill.date,
    total: split.total,
    currencyCode: bill.currency.code,
    archivedAt: new Date().toISOString(),
    bill,
  }

  const withoutExisting = loadBillHistory().filter((existing) => existing.id !== bill.id)
  const entries = [entry, ...withoutExisting].slice(0, MAX_ENTRIES)
  const stored: StoredHistory = { version: VERSION, entries }
  safeSetItem(STORAGE_KEY, JSON.stringify(stored))
}
