import { describe, expect, it } from 'vitest'
import { copy } from '../client/copy'
import { buildLandingDocument, renderLandingContent } from './landingDocument'

describe('renderLandingContent', () => {
  it('includes the wordmark and hero tagline', () => {
    const html = renderLandingContent()
    expect(html).toContain(copy.wordmark)
    expect(html).toContain(copy.start.tagline)
  })

  it('includes every How it works step', () => {
    const html = renderLandingContent()
    for (const step of copy.start.howItWorks) {
      expect(html).toContain(step.title)
      expect(html).toContain(step.body)
    }
  })

  it('includes every feature', () => {
    const html = renderLandingContent()
    for (const feature of copy.start.features) {
      expect(html).toContain(feature.title)
      expect(html).toContain(feature.body)
    }
  })

  it('includes the footer tagline', () => {
    const html = renderLandingContent()
    expect(html).toContain(copy.start.footerTagline)
  })

  it('contains no script tags of its own', () => {
    // The generator only ever produces content markup — the shell it gets
    // spliced into (via buildLandingDocument) owns the actual <script> tag
    // that boots the SPA.
    expect(renderLandingContent()).not.toMatch(/<script/i)
  })
})

describe('buildLandingDocument', () => {
  const shell =
    '<!doctype html><html><head><title>Split Bill</title></head><body><div id="root"></div><script type="module" src="/assets/main-abc123.js"></script></body></html>'

  it('replaces the empty root div with landing content', () => {
    const html = buildLandingDocument(shell)
    expect(html).not.toContain('<div id="root"></div>')
    expect(html).toContain(copy.start.tagline)
  })

  it('preserves the rest of the shell untouched', () => {
    const html = buildLandingDocument(shell)
    expect(html).toContain('<script type="module" src="/assets/main-abc123.js"></script>')
    expect(html).toContain('<title>Split Bill</title>')
  })

  it('throws if the shell has no empty root placeholder to splice into', () => {
    expect(() => buildLandingDocument('<html><body>no root here</body></html>')).toThrow()
  })
})
