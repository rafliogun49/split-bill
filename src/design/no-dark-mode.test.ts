import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

describe('dark mode', () => {
  it('no dark: utility appears anywhere in the app source', () => {
    const appDir = join(__dirname, '..', 'app')
    const files = walk(appDir).filter((file) => /\.(tsx?|css)$/.test(file))

    expect(files.length).toBeGreaterThan(0)

    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      expect(content, file).not.toMatch(/(^|["'`\s])dark:/)
    }
  })
})
