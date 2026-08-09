// DESIGN.md §8 "Icons": closed inline-SVG set, solid black, currentColor.
// These are always paired with a visible text label, so they're aria-hidden
// rather than independently accessible.

export interface IconProps {
  className?: string
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9 2 7.2 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.2L15 2H9Zm3 6a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 16a2.8 2.8 0 0 0 0-5.6Z" />
    </svg>
  )
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.5 17 4 11.5l1.7-1.7L9.5 13.6l8.8-8.8L20 6.5 9.5 17Z" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9 2h6l1 2h4v2H4V4h4l1-2Zm-3 6h12l-1 14H7L6 8Zm3 2v10h1V10H9Zm3 0v10h1V10h-1Zm3 0v10h1V10h-1Z" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z" />
    </svg>
  )
}

export function GripIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5h2v2H8V5Zm6 0h2v2h-2V5ZM8 11h2v2H8v-2Zm6 0h2v2h-2v-2ZM8 17h2v2H8v-2Zm6 0h2v2h-2v-2Z" />
    </svg>
  )
}

// Points down at rest; rotate with a className for other directions.
export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.7 9.3 12 14.6l5.3-5.3 1.4 1.4-6.7 6.7-6.7-6.7 1.4-1.4Z" />
    </svg>
  )
}
