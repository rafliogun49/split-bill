// DESIGN.md §5: focus is a 4px black outline offset 4px outside the border,
// and is never removed. Shared so every interactive element stays in lockstep
// if that spec changes.
export const focusRing = 'focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-pure-black'
