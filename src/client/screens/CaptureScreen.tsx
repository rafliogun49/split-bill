import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Banner } from '../components/Banner'
import { Button, pressInteraction } from '../components/Button'
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

// The mobile bottom bar's Library button — a square icon control the hero
// Button component doesn't offer a size for. `h-14 w-14` also sizes the
// invisible spacer that balances the shutter button below.
const squareControlSize = 'h-14 w-14'
const squareControl = `flex ${squareControlSize} shrink-0 items-center justify-center border border-pure-black bg-surface-container-lowest shadow-sm [@media(hover:hover)]:hover:shadow-md ${pressInteraction} ${focusRing}`

// DESIGN.md screen 2 / Standalone.html screen 2. Mobile opens the camera
// directly, framed as a viewfinder with corner brackets, shutter and
// library controls below it; desktop (≥1024px, matching Tailwind's `lg`)
// can't assume a camera, so a drag-and-drop zone is primary and a webcam
// panel secondary. Both paths and manual entry converge on the same
// onCapture / onEnterManually callbacks App.tsx already wires to the
// empty/populated editor (ADR-0004).
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      {/* The mockup's Capture screen carries no visible heading — this stays
          for the document outline and the screen's accessible name only. */}
      <h1 className="sr-only">{copy.capture.heading}</h1>

      {/* Mobile: a camera-viewfinder frame (decorative — no live preview,
          since capture goes through a native file input) with the real
          Library / shutter controls in the bar below it, matching the
          mockup's dark bracket-cornered box over a bottom control bar. */}
      <div className="flex flex-col border border-pure-black shadow-lg lg:hidden">
        <div
          aria-hidden="true"
          className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-on-surface"
        >
          <span className="absolute left-3 top-3 h-7 w-7 border-l border-t border-primary-container" />
          <span className="absolute right-3 top-3 h-7 w-7 border-r border-t border-primary-container" />
          <span className="absolute bottom-3 left-3 h-7 w-7 border-b border-l border-primary-container" />
          <span className="absolute bottom-3 right-3 h-7 w-7 border-b border-r border-primary-container" />
          <CameraIcon className="h-16 w-16 text-surface-container-lowest opacity-60" />
        </div>

        <div className="flex items-center justify-center gap-6 border-t border-pure-black bg-surface-container-lowest px-4 py-6">
          <button
            type="button"
            onClick={() => libraryInputRef.current?.click()}
            aria-label={copy.capture.libraryLabel}
            className={squareControl}
          >
            <UploadIcon className="h-5 w-5 text-on-surface" />
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            aria-label={copy.capture.cameraLabel}
            className={`flex h-20 w-20 shrink-0 items-center justify-center border border-pure-black bg-primary-container shadow-md [@media(hover:hover)]:hover:shadow-lg ${pressInteraction} ${focusRing}`}
          >
            <CameraIcon className="h-8 w-8 text-on-surface" />
          </button>

          {/* Balances the Library button's width so the shutter — not the
              pair's midpoint — sits on the bar's true centre, matching the
              mockup. */}
          <span aria-hidden="true" className={`${squareControlSize} shrink-0`} />
        </div>
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

      {/* Desktop: drag-and-drop is primary, webcam secondary, both inside
          one card — matches the mockup's boxed capture panel. */}
      <div className="hidden flex-col gap-4 border border-pure-black bg-surface-container-lowest p-8 shadow-lg lg:flex">
        <button
          type="button"
          onClick={() => dropInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center gap-3 border border-dashed border-pure-black p-16 text-center ${focusRing} ${
            dragActive ? 'bg-diner-6/50' : 'bg-diner-6/25'
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
