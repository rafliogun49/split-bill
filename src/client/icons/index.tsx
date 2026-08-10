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

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5Z" />
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

export function MinusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 11h16v2H4v-2Z" />
    </svg>
  )
}

// The "unclaimed" affordance a LineItemRow shows in place of DinerChips
// (DESIGN.md §8 icon set: `person+`).
export function PersonPlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v2h14v-2c0-3.3-4.7-5-6-5Zm9-4h-2v3h-3v2h3v3h2v-3h3v-2h-3V9Z" />
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

// Unused since #28 retired the native-share flow on Summary (screen 10) in
// favour of always-on Copy text / Download image buttons, which don't carry
// icons of their own. Kept because DESIGN.md §8's closed icon set still
// names `share` as one of the ~14 glyphs — remove both together if a future
// change drops it from the set.
export function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 16.1a3 3 0 0 0-2 .77l-6.1-3.55a3 3 0 0 0 0-1.24l6.02-3.5a3 3 0 1 0-1-2.2l-6.02 3.5a3 3 0 1 0 0 4.24l6.1 3.55A3 3 0 1 0 18 16.1Z" />
    </svg>
  )
}

// The desktop Capture screen's drag-and-drop affordance (DESIGN.md §8 icon
// set: `upload`).
export function UploadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11 4h2v9h-2V4Zm-4.6 4.4L12 3.8l5.6 5.6L16.2 10.8 13 7.6V13h-2V7.6l-3.2 3.2L6.4 8.4ZM4 15h2v3h12v-3h2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z" />
    </svg>
  )
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 3h9a2 2 0 0 1 2 2v9h-2V5H8V3ZM4 7h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 2v10h9V9H4Z" />
    </svg>
  )
}
