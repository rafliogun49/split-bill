import { describe, expect, it } from 'vitest'
import { moveItem } from './arrayMove'

describe('moveItem', () => {
  it('moves an item earlier in the array', () => {
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('moves an item later in the array', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
  })

  it('leaves the array unchanged when the target index is out of range', () => {
    const items = ['a', 'b', 'c']
    expect(moveItem(items, 0, -1)).toBe(items)
    expect(moveItem(items, 0, 3)).toBe(items)
  })

  it('leaves the array unchanged when moving to the same index', () => {
    const items = ['a', 'b', 'c']
    expect(moveItem(items, 1, 1)).toBe(items)
  })
})
