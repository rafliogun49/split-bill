import { describe, expect, it, vi } from 'vitest'

const toPng = vi.fn(async () => 'data:image/png;base64,stub')
vi.mock('html-to-image', () => ({ toPng }))

describe('captureShareImage', () => {
  it('waits for fonts to be ready before rasterising, so a fallback face is never baked in', async () => {
    let fontsReadyResolved = false
    const fontsReady = new Promise<FontFaceSet>((resolve) => {
      setTimeout(() => {
        fontsReadyResolved = true
        resolve({} as FontFaceSet)
      }, 0)
    })
    const originalFonts = document.fonts
    Object.defineProperty(document, 'fonts', { value: { ready: fontsReady }, configurable: true })

    const { captureShareImage } = await import('./captureShareImage')
    const node = document.createElement('div')
    const result = await captureShareImage(node)

    expect(fontsReadyResolved).toBe(true)
    expect(result).toBe('data:image/png;base64,stub')
    expect(toPng).toHaveBeenCalledWith(node, expect.objectContaining({ pixelRatio: 2 }))

    Object.defineProperty(document, 'fonts', { value: originalFonts, configurable: true })
  })
})
