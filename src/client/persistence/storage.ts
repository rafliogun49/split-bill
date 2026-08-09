// localStorage is unavailable in some contexts (private browsing with
// storage blocked, a full quota) — reads and writes degrade to a no-op
// there rather than throwing and crashing the app.

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Bill still works for this session; it just won't survive a reload.
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // no-op
  }
}
