import { useRef, useState } from 'react'
import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { ShareCard } from '../components/ShareCard'
import { Button } from '../components/Button'
import { copy } from '../copy'
import { localeForCurrency } from '../format'
import { ShareIcon } from '../icons'
import { captureShareImage } from '../share/captureShareImage'
import { buildShareText } from '../share/shareText'

export interface SummaryScreenProps {
  bill: Bill
}

type ShareStatus = 'idle' | 'text-copied' | 'image-copied' | 'image-downloaded'

function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

/**
 * True only for a user-dismissed share sheet — every other rejection should
 * still reach the fallback below it. navigator.share() rejects with a
 * DOMException, which (unlike a regular Error) doesn't extend Error in
 * browsers, so this checks `name` directly rather than `instanceof Error`.
 */
function isAbort(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return response.blob()
}

// DESIGN.md screen 10: the ShareCard rendered on screen is the exact node
// captured to PNG (screen 11) — this screen adds only the two share actions
// around it, never inside it, since ShareCard itself carries no button or
// anchor.
export function SummaryScreen({ bill }: SummaryScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ShareStatus>('idle')

  const split = calculateSplit(bill)
  const locale = localeForCurrency(bill.currency.code)

  async function handleShareText() {
    const text = buildShareText(bill, split, locale)
    if (canUseWebShare()) {
      try {
        await navigator.share({ text })
        return
      } catch (error) {
        if (isAbort(error)) return
        // A real failure (not a user-dismissed sheet) falls through to the clipboard below.
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus('text-copied')
    } catch {
      // Clipboard access denied — nothing to report.
    }
  }

  async function handleShareImage() {
    const node = cardRef.current
    if (!node) return

    const dataUrl = await captureShareImage(node)
    const blob = await dataUrlToBlob(dataUrl)
    const file = new File([blob], 'split-bill-summary.png', { type: 'image/png' })

    if (canUseWebShare() && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
        return
      } catch (error) {
        if (isAbort(error)) return
        // A real failure (not a user-dismissed sheet) falls through to the clipboard/download below.
      }
    }

    if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setStatus('image-copied')
        return
      } catch {
        // Falls through to the download fallback below.
      }
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'split-bill-summary.png'
    link.click()
    // Deferred rather than immediate: Safari can cancel an anchor download
    // if the object URL is revoked before it finishes reading the blob.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('image-downloaded')
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-4 lg:p-6">
      <h2 className="self-start text-headline-sm uppercase text-on-surface">{copy.summary.heading}</h2>

      <div className="w-full overflow-x-auto">
        <div ref={cardRef} className="mx-auto">
          <ShareCard bill={bill} split={split} locale={locale} />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
        <Button variant="primary" onClick={handleShareText}>
          <span className="flex items-center justify-center gap-2">
            <ShareIcon className="h-4 w-4" />
            {copy.summary.shareText}
          </span>
        </Button>
        <Button variant="secondary" onClick={handleShareImage}>
          <span className="flex items-center justify-center gap-2">
            <ShareIcon className="h-4 w-4" />
            {copy.summary.shareImage}
          </span>
        </Button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === 'text-copied' && copy.summary.shareTextCopied}
        {status === 'image-copied' && copy.summary.shareImageCopied}
        {status === 'image-downloaded' && copy.summary.shareImageDownloaded}
      </p>
    </div>
  )
}
