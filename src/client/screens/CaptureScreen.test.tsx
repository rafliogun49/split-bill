import { fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { CaptureScreen } from './CaptureScreen'

function file(name = 'receipt.jpg', type = 'image/jpeg') {
  return new File(['x'], name, { type })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('CaptureScreen', () => {
  it('presents the camera ahead of the photo library, per DESIGN.md screen 2', () => {
    const { getByRole } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
    expect(getByRole('heading', { name: 'Scan receipt' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Scan photo' })).toBeInTheDocument()
    expect(getByRole('button', { name: /choose from library/i })).toBeInTheDocument()
  })

  it('says Scan, never Photograph', () => {
    const { container } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
    expect(container).not.toHaveTextContent(/photograph/i)
  })

  it('calls onCapture with the file chosen through the camera input', () => {
    const onCapture = vi.fn()
    const { container } = render(<CaptureScreen onCapture={onCapture} onEnterManually={vi.fn()} />)
    const input = container.querySelector('input[name="camera-photo"]') as HTMLInputElement
    const chosen = file()
    fireEvent.change(input, { target: { files: [chosen] } })
    expect(onCapture).toHaveBeenCalledWith(chosen)
  })

  it('calls onCapture with the file chosen through the library input', () => {
    const onCapture = vi.fn()
    const { container } = render(<CaptureScreen onCapture={onCapture} onEnterManually={vi.fn()} />)
    const input = container.querySelector('input[name="library-photo"]') as HTMLInputElement
    const chosen = file()
    fireEvent.change(input, { target: { files: [chosen] } })
    expect(onCapture).toHaveBeenCalledWith(chosen)
  })

  it('ignores a non-image file dropped or chosen', () => {
    const onCapture = vi.fn()
    const { container } = render(<CaptureScreen onCapture={onCapture} onEnterManually={vi.fn()} />)
    const input = container.querySelector('input[name="library-photo"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file('notes.txt', 'text/plain')] } })
    expect(onCapture).not.toHaveBeenCalled()
  })

  it('calls onCapture with a file dropped on the desktop dropzone', () => {
    const onCapture = vi.fn()
    const { getByText } = render(<CaptureScreen onCapture={onCapture} onEnterManually={vi.fn()} />)
    const dropzone = getByText(/drag a photo here/i).closest('button') as HTMLButtonElement
    const chosen = file()
    fireEvent.drop(dropzone, { dataTransfer: { files: [chosen] } })
    expect(onCapture).toHaveBeenCalledWith(chosen)
  })

  it('reaches manual entry without needing to photograph anything', () => {
    const onEnterManually = vi.fn()
    const { getByRole } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={onEnterManually} />)
    fireEvent.click(getByRole('button', { name: /enter manually instead/i }))
    expect(onEnterManually).toHaveBeenCalledOnce()
  })

  it('shows the promise that the photo is never stored', () => {
    const { getByText } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
    expect(getByText('Your photo is never stored.')).toBeInTheDocument()
  })

  describe('webcam', () => {
    it('starts the camera stream when opened', async () => {
      const getUserMedia = vi.fn(async () => ({ getTracks: () => [] }) as unknown as MediaStream)
      vi.stubGlobal('navigator', Object.create(navigator, { mediaDevices: { value: { getUserMedia } } }))

      const { getByRole } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
      fireEvent.click(getByRole('button', { name: /use webcam/i }))

      await waitFor(() => expect(getUserMedia).toHaveBeenCalledWith({ video: true }))
      expect(getByRole('button', { name: 'Capture photo' })).toBeInTheDocument()
    })

    it('shows an inline error and no Capture control when the camera is unavailable', async () => {
      const getUserMedia = vi.fn(async () => {
        throw new Error('Permission denied')
      })
      vi.stubGlobal('navigator', Object.create(navigator, { mediaDevices: { value: { getUserMedia } } }))

      const { getByRole, findByRole, queryByRole } = render(
        <CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />,
      )
      fireEvent.click(getByRole('button', { name: /use webcam/i }))

      expect(await findByRole('alert')).toHaveTextContent(/camera/i)
      expect(queryByRole('button', { name: 'Capture photo' })).not.toBeInTheDocument()
    })

    it('cancelling the webcam panel stops the stream and returns to the button', async () => {
      const stop = vi.fn()
      const getUserMedia = vi.fn(async () => ({ getTracks: () => [{ stop }] }) as unknown as MediaStream)
      vi.stubGlobal('navigator', Object.create(navigator, { mediaDevices: { value: { getUserMedia } } }))

      const { getByRole } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
      fireEvent.click(getByRole('button', { name: /use webcam/i }))
      await waitFor(() => expect(getUserMedia).toHaveBeenCalled())

      fireEvent.click(getByRole('button', { name: 'Cancel' }))
      expect(getByRole('button', { name: /use webcam/i })).toBeInTheDocument()
      expect(stop).toHaveBeenCalled()
    })
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<CaptureScreen onCapture={vi.fn()} onEnterManually={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
