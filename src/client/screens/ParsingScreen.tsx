import { useEffect, useRef, useState } from 'react'
import type { ParseFailureReason, ParsedReceipt } from '../ai/parseReceiptClient'
import { fetchTurnstileSiteKey, requestParse } from '../ai/parseReceiptClient'
import { getTurnstileToken } from '../ai/turnstile'
import { downscaleImage } from '../downscaleImage'
import { ProgressCard } from '../components/ProgressCard'
import type { ProgressStep } from '../components/ProgressCard'
import { copy } from '../copy'

export interface ParsingScreenProps {
  file: File
  onParsed: (receipt: ParsedReceipt) => void
  onFailure: (reason: ParseFailureReason) => void
  onCancel: () => void
}

type Stage = 'uploading' | 'reading'

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

// DESIGN.md screen 3: ProgressCard, cancellable. The bar itself stays
// indeterminate throughout — a single POST /api/parse has no byte-level
// progress worth reporting once Turnstile and the upload are underway — but
// the step list is honest about which of the two real phases is active
// (ADR-0004: the request that's read is invisible to the client, so a third
// "checking totals" step would be fabricated, not observed).
export function ParsingScreen({ file, onParsed, onFailure, onCancel }: ParsingScreenProps) {
  const [stage, setStage] = useState<Stage>('uploading')
  const controllerRef = useRef<AbortController | null>(null)
  const onParsedRef = useRef(onParsed)
  const onFailureRef = useRef(onFailure)

  useEffect(() => {
    onParsedRef.current = onParsed
  }, [onParsed])
  useEffect(() => {
    onFailureRef.current = onFailure
  }, [onFailure])

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller

    async function run() {
      try {
        const image = await downscaleImage(file)
        const siteKey = await fetchTurnstileSiteKey(controller.signal)
        const token = await getTurnstileToken(siteKey)

        setStage('reading')
        const result = await requestParse(image, token, controller.signal)

        if (result.ok) {
          onParsedRef.current(result.receipt)
        } else {
          onFailureRef.current(result.reason)
        }
      } catch (err) {
        if (isAbort(err)) return
        onFailureRef.current('parse_failed')
      }
    }

    run()
    return () => controller.abort()
  }, [file])

  function handleCancel() {
    controllerRef.current?.abort()
    onCancel()
  }

  const steps: ProgressStep[] = [
    { label: copy.parsing.stepUploading, status: stage === 'uploading' ? 'active' : 'done' },
    { label: copy.parsing.stepReading, status: stage === 'reading' ? 'active' : 'pending' },
  ]

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-headline-lg uppercase text-on-surface">{copy.parsing.heading}</h1>
        <ProgressCard progress={null} steps={steps} cancelLabel={copy.parsing.cancel} onCancel={handleCancel} />
      </div>
    </div>
  )
}
