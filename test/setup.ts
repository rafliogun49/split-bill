import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { afterEach, expect } from 'vitest'

expect.extend(toHaveNoViolations)

// vitest.config.ts doesn't set test.globals, so Testing Library's own
// auto-cleanup (which only fires when it finds a global afterEach) never
// runs — without this, every render in a file after the first accumulates
// in the same jsdom document instead of unmounting.
afterEach(() => cleanup())

// AAA, not axe-core's AA default (DESIGN.md rule 2: every pairing clears 7:1).
// color-contrast is disabled here because jsdom doesn't paint — it can't read
// back real pixel colour, so the rule only ever reports "incomplete". The
// token values themselves are verified mathematically in
// src/design/tokens.test.ts instead.
export const axe = configureAxe({
  runOnly: {
    type: 'tag',
    values: ['wcag2aaa', 'wcag21aaa'],
  },
  rules: {
    'color-contrast': { enabled: false },
  },
})
