import { describe, expect, it } from 'vitest'
import { redirectWhenMissing } from './guards'

describe('redirectWhenMissing', () => {
  it('returns null (proceed) when the value is present', () => {
    expect(
      redirectWhenMissing({ id: 'bill-1', currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [] }, '/'),
    ).toBeNull()
  })

  it('returns the fallback path when the value is null', () => {
    expect(redirectWhenMissing(null, '/')).toBe('/')
  })

  it('treats a File instance as present, even though it is not persisted (Capture/Parsing guard)', () => {
    const file = new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })
    expect(redirectWhenMissing(file, '/capture')).toBeNull()
  })

  it('redirects a route that needs an in-flight file with none available, e.g. Parsing after a reload', () => {
    expect(redirectWhenMissing<File>(null, '/capture')).toBe('/capture')
  })
})
