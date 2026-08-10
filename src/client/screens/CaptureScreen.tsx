import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Banner } from '../components/Banner'
import { Button } from '../components/Button'
import { focusRing } from '../components/focusRing'
import { copy } from '../copy'
import { CameraIcon, UploadIcon } from '../icons'

export interface CaptureScreenProps {
  onCapture: (file: File) => void
  onEnterManually: () => void
}

function isImageFile(file: File | null | undefined): file is File {
  return Boolean(file && file.type.startsWith('image/'))
}

// DESIGN.md screen 2. Mobile opens the camera directly with the photo
// library beside it; desktop (≥1024px, matching Tailwind's `lg`) can't
// assume a camera, so a drag-and-drop zone is primary and a webcam panel
// secondary. Both paths and manual entry converge on the same onCapture /
// onEnterManually callbacks App.tsx already wires to the empty/populated
// editor (ADR-0004).
export function CaptureScreen({ onCapture, onEnterManually }: CaptureScreenProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const libraryInputRef = useRef<HTMLInputElement>(null)
  const dropInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [webcamOpen, setWebcamOpen] = useState(false)

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (isImageFile(file)) onCapture(file)
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (isImageFile(file)) onCapture(file)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="text-headline-md uppercase text-on-surface">{copy.capture.heading}</h1>

      {/* Mobile: camera is the primary affordance, library beside it. The
          dark frame + corner brackets are viewfinder ornament only (DESIGN.md
          screen 2; mockup §2 "Capture") — the Button inside is the same
          capture trigger, unchanged. */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="relative border border-pure-black bg-on-surface p-4">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-2 h-7 w-7 border-l border-t border-primary-container"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-2 h-7 w-7 border-r border-t border-primary-container"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-2 h-7 w-7 border-b border-l border-primary-container"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-2 h-7 w-7 border-b border-r border-primary-container"
          />
          <Button variant="primary" size="hero" onClick={() => cameraInputRef.current?.click()}>
            <CameraIcon className="h-16 w-16" />
            <span className="text-headline-sm uppercase">{copy.capture.cameraLabel}</span>
          </Button>
        </div>
        <input
          ref={cameraInputRef}
          name="camera-photo"
          type="file"
          accept="image/*"
          capture="environment"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={handleFileInput}
        />

        <Button variant="secondary" onClick={() => libraryInputRef.current?.click()}>
          <span className="flex items-center justify-center gap-2">
            <UploadIcon className="h-5 w-5" />
            {copy.capture.libraryLabel}
          </span>
        </Button>
        <input
          ref={libraryInputRef}
          name="library-photo"
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={handleFileInput}
        />
      </div>

      {/* Desktop: drag-and-drop is primary, webcam secondary. */}
      <div className="hidden flex-col gap-4 lg:flex">
        <button
          type="button"
          onClick={() => dropInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center gap-3 border border-dashed border-pure-black p-12 text-center ${focusRing} ${
            dragActive ? 'bg-surface-variant' : 'bg-surface-container-lowest'
          }`}
        >
          <UploadIcon className="h-12 w-12 text-on-surface" />
          <span className="text-headline-sm uppercase text-on-surface">{copy.capture.dropzoneLabel}</span>
          <span className="text-label-sm text-on-surface-variant">{copy.capture.dropzoneHint}</span>
        </button>
        <input
          ref={dropInputRef}
          name="drop-photo"
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={handleFileInput}
        />

        {webcamOpen ? (
          <WebcamPanel onCapture={onCapture} onCancel={() => setWebcamOpen(false)} />
        ) : (
          <Button variant="secondary" onClick={() => setWebcamOpen(true)}>
            <span className="flex items-center justify-center gap-2">
              <CameraIcon className="h-5 w-5" />
              {copy.capture.webcamLabel}
            </span>
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={onEnterManually}
        className={`self-center text-label-bold uppercase text-on-surface underline ${focusRing}`}
      >
        {copy.capture.enterManually}
      </button>

      <p className="text-center text-label-sm text-on-surface-variant">{copy.capture.photoNeverStored}</p>
    </div>
  )
}

interface WebcamPanelProps {
  onCapture: (file: File) => void
  onCancel: () => void
}

function WebcamPanel({ onCapture, onCancel }: WebcamPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  function handleCapture() {
    const video = videoRef.current
    if (!video || !video.videoWidth) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) onCapture(new File([blob], 'webcam.jpg', { type: 'image/jpeg' }))
    }, 'image/jpeg')
  }

  return (
    <div className="flex flex-col gap-3 border border-pure-black bg-surface-container-lowest p-4">
      {error ? (
        <Banner variant="alert">{copy.capture.webcamUnavailable}</Banner>
      ) : (
        <video ref={videoRef} autoPlay muted playsInline className="w-full bg-pure-black" aria-label={copy.capture.webcamLabel} />
      )}
      <div className="flex gap-3">
        {!error && (
          <Button variant="primary" onClick={handleCapture}>
            {copy.capture.webcamCapture}
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          {copy.capture.webcamCancel}
        </Button>
      </div>
    </div>
  )
}
