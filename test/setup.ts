import '@testing-library/jest-dom/vitest'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

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
