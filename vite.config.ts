import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev/build/deploy only. Vitest reads vitest.config.ts instead — the
// Cloudflare plugin adds a Worker "environment" to this config that isn't
// compatible with how Vitest runs tests against the same file.
export default defineConfig({
  plugins: [react(), cloudflare()],
})
