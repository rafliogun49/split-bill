import { afterEach, describe, expect, it, vi } from 'vitest'
import { downscaleImage } from './downscaleImage'

function stubBitmap(width: number, height: number) {
  const bitmap = { width, height, close: vi.fn() }
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(async () => bitmap),
  )
  return bitmap
}

function stubCanvas(overrides: { getContext: () => unknown }) {
  const fakeCanvas = { width: 0, height: 0, ...overrides }
  const originalCreateElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
    if (tag === 'canvas') return fakeCanvas as unknown as HTMLCanvasElement
    return originalCreateElement(tag, options)
  })
  return fakeCanvas
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('downscaleImage', () => {
  it('returns the original file unchanged when it is already under the cap on both edges', async () => {
    const bitmap = stubBitmap(800, 600)
    const file = new Blob(['x'], { type: 'image/jpeg' })

    const result = await downscaleImage(file)

    expect(result).toBe(file)
    expect(bitmap.close).toHaveBeenCalledOnce()
  })

  it('never upscales a photo already exactly at the cap on its long edge', async () => {
    stubBitmap(1600, 1200)
    const file = new Blob(['x'])

    const result = await downscaleImage(file)

    expect(result).toBe(file)
  })

  it('scales the long edge down to 1600px and draws the bitmap through canvas', async () => {
    stubBitmap(3200, 2400)
    const file = new Blob(['x'])
    const drawImage = vi.fn()
    const scaledBlob = new Blob(['scaled'], { type: 'image/jpeg' })
    const canvas = stubCanvas({
      getContext: () => ({ drawImage }),
    })
    ;(canvas as unknown as { toBlob: (cb: (b: Blob | null) => void) => void }).toBlob = (cb) => cb(scaledBlob)

    const result = await downscaleImage(file)

    expect(canvas.width).toBe(1600)
    expect(canvas.height).toBe(1200)
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1600, 1200)
    expect(result).toBe(scaledBlob)
  })

  it('falls back to the original file when a 2d context is unavailable', async () => {
    stubBitmap(3200, 2400)
    const file = new Blob(['x'])
    stubCanvas({ getContext: () => null })

    const result = await downscaleImage(file)

    expect(result).toBe(file)
  })

  it('falls back to the original file when canvas.toBlob produces nothing', async () => {
    stubBitmap(3200, 2400)
    const file = new Blob(['x'])
    const canvas = stubCanvas({ getContext: () => ({ drawImage: vi.fn() }) })
    ;(canvas as unknown as { toBlob: (cb: (b: Blob | null) => void) => void }).toBlob = (cb) => cb(null)

    const result = await downscaleImage(file)

    expect(result).toBe(file)
  })
})
