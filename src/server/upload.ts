// Cost control (issue #10): reject oversized or non-image uploads before
// they reach the model. The client downscales to ~1600px on the long edge
// (issue #11), so a real upload is well under this; the cap exists for
// abuse, not the golden path.
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export type UploadValidation =
  | { ok: true; contentType: string; bytes: ArrayBuffer }
  | { ok: false; reason: 'missing' | 'not-an-image' | 'too-large' }

export async function validateImageUpload(file: File | null): Promise<UploadValidation> {
  if (!file) {
    return { ok: false, reason: 'missing' }
  }

  if (!file.type.startsWith('image/')) {
    return { ok: false, reason: 'not-an-image' }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, reason: 'too-large' }
  }

  const bytes = await file.arrayBuffer()
  return { ok: true, contentType: file.type, bytes }
}
