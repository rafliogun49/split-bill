/** Moves the item at `from` to `to`, leaving the array unchanged if `to` is out of range. Shared by Line Item and Adjustment reordering. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved as T)
  return next
}
