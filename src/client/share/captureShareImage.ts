import { toPng } from 'html-to-image'

// DESIGN.md screen 11: fonts must be inlined at render time, so a webfont
// that hasn't loaded yet can't bake a fallback face into the PNG. Waiting on
// document.fonts.ready guarantees the @fontsource faces are loaded before
// html-to-image walks the node and embeds them.
export async function captureShareImage(node: HTMLElement): Promise<string> {
  await document.fonts.ready
  return toPng(node, { pixelRatio: 2, backgroundColor: '#ffffff' })
}
