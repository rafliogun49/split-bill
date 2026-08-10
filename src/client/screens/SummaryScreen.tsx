import { useRef, useState } from 'react'
import type { Bill } from '../../domain'
import { calculateSplit } from '../../domain'
import { ShareCard } from '../components/ShareCard'
import { Button } from '../components/Button'
import { copy } from '../copy'
import { localeForCurrency } from '../format'
import { captureShareImage } from '../share/captureShareImage'
import { buildShareText } from '../share/shareText'

export interface SummaryScreenProps {
  bill: Bill
}

type ShareStatus = 'idle' | 'text-copied' | 'image-downloaded'

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return response.blob()
}

// DESIGN.md screen 10: the ShareCard rendered on screen is the exact node
// captured to PNG (screen 11) — this screen adds only the two actions around
// it, never inside it, since ShareCard itself carries no button or anchor.
// Both actions are always available and neither ever attempts
// navigator.share(): "Copy text" writes the plain-text summary straight to
// the clipboard, and "Download image" always saves the PNG via the anchor
// download rather than trying (and possibly silently succeeding into) a
// native share sheet first.
export function SummaryScreen({ bill }: SummaryScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ShareStatus>('idle')

  const split = calculateSplit(bill)
  const locale = localeForCurrency(bill.currency.code)

  async function handleCopyText() {
    const text = buildShareText(bill, split, locale)
    try {
      await navigator.clipboard.writeText(text)
      setStatus('text-copied')
    } catch {
      // Clipboard access denied — nothing to report.
    }
  }

  async function handleDownloadImage() {
    const node = cardRef.current
    if (!node) return

    const dataUrl = await captureShareImage(node)
    const blob = await dataUrlToBlob(dataUrl)

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
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-6 p-4 lg:p-6">
      <h2 className="self-start text-headline-sm uppercase text-on-surface">{copy.summary.heading}</h2>

      <div className="w-full overflow-x-auto">
        <ShareCard ref={cardRef} bill={bill} split={split} locale={locale} />
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
        <Button variant="primary" onClick={handleCopyText}>
          {copy.summary.copyText}
        </Button>
        <Button variant="secondary" onClick={handleDownloadImage}>
          {copy.summary.downloadImage}
        </Button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === 'text-copied' && copy.summary.textCopied}
        {status === 'image-downloaded' && copy.summary.imageDownloaded}
      </p>
    </div>
  )
}
