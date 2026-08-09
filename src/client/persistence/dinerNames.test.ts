import { beforeEach, describe, expect, it } from 'vitest'
import { loadRememberedDinerNames, rememberDinerName } from './dinerNames'

describe('dinerNames', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(loadRememberedDinerNames()).toEqual([])
  })

  it('remembers a name, most recent first', () => {
    rememberDinerName('Budi')
    rememberDinerName('Sarah')
    expect(loadRememberedDinerNames()).toEqual(['Sarah', 'Budi'])
  })

  it('moves a re-remembered name to the front instead of duplicating it', () => {
    rememberDinerName('Budi')
    rememberDinerName('Sarah')
    rememberDinerName('Budi')
    expect(loadRememberedDinerNames()).toEqual(['Budi', 'Sarah'])
  })

  it('ignores a blank name', () => {
    rememberDinerName('   ')
    expect(loadRememberedDinerNames()).toEqual([])
  })

  it('caps the remembered list at a short length', () => {
    for (let i = 0; i < 20; i++) rememberDinerName(`Diner ${i}`)
    expect(loadRememberedDinerNames().length).toBeLessThanOrEqual(8)
  })

  it('discards data from an unrecognised version instead of crashing', () => {
    localStorage.setItem('split-bill:diner-names', JSON.stringify({ version: 999, names: ['Budi'] }))
    expect(loadRememberedDinerNames()).toEqual([])
  })

  it('discards corrupt JSON instead of throwing', () => {
    localStorage.setItem('split-bill:diner-names', '{not json')
    expect(() => loadRememberedDinerNames()).not.toThrow()
  })
})
