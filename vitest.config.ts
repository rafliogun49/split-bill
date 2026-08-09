import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    // e2e/ holds Playwright specs, run separately via `pnpm test:e2e` — Vitest's
    // default include pattern would otherwise pick them up and choke on `test()`
    // from a different test runner.
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
})
