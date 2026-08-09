const MAX_LONG_EDGE = 1600

// DESIGN.md screen 2: downscaled before upload so parsing stays fast on bad
// restaurant wifi. Long edge only, and never upscales — a photo already
// under the cap goes through untouched rather than being re-encoded for no
// reason. Falls back to the original file if the canvas path is unavailable
// (e.g. no 2d context) rather than failing the capture outright.
export async function downscaleImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_LONG_EDGE / Math.max(bitmap.width, bitmap.height))
    if (scale === 1) {
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return file
    }
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    return blob ?? file
  } finally {
    bitmap.close()
  }
}
