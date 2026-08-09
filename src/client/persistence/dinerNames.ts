// A short list of previously used Diner names, separate from the active
// Bill, so a returning Payer can tap a remembered name instead of retyping
// it (DESIGN.md screen 7). Same versioned-envelope discard-on-mismatch rule
// as billStorage.
//
// No caller yet — issue #5 only establishes the persistence seam; the Diner
// setup screen that reads and writes through it lands in issue #7.

import { safeGetItem, safeSetItem } from './storage'

const STORAGE_KEY = 'split-bill:diner-names'
const VERSION = 1
const MAX_REMEMBERED = 8

interface StoredNames {
  version: number
  names: string[]
}

export function loadRememberedDinerNames(): string[] {
  const raw = safeGetItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as StoredNames
    if (parsed.version !== VERSION || !Array.isArray(parsed.names)) return []
    return parsed.names
  } catch {
    return []
  }
}

export function rememberDinerName(name: string): void {
  const trimmed = name.trim()
  if (!trimmed) return

  const withoutExisting = loadRememberedDinerNames().filter((remembered) => remembered !== trimmed)
  const names = [trimmed, ...withoutExisting].slice(0, MAX_REMEMBERED)
  const stored: StoredNames = { version: VERSION, names }
  safeSetItem(STORAGE_KEY, JSON.stringify(stored))
}

export function forgetDinerName(name: string): void {
  const names = loadRememberedDinerNames().filter((remembered) => remembered !== name)
  const stored: StoredNames = { version: VERSION, names }
  safeSetItem(STORAGE_KEY, JSON.stringify(stored))
}
