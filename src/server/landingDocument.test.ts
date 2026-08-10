import { describe, expect, it } from 'vitest'
import { copy } from '../client/copy'
import { buildLandingDocument, renderLandingContent, renderLandingHead } from './landingDocument'

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
      expect(html).toContain(feature)
    }
  })

  it('includes the footer note', () => {
    const html = renderLandingContent()
    expect(html).toContain(copy.start.footerNote)
  })

  it('contains no script tags of its own', () => {
    // The generator only ever produces content markup — the shell it gets
    // spliced into (via buildLandingDocument) owns the actual <script> tag
    // that boots the SPA.
    expect(renderLandingContent()).not.toMatch(/<script/i)
  })
})

describe('renderLandingHead', () => {
  it('includes a title built from the wordmark and tagline', () => {
    const head = renderLandingHead()
    expect(head).toContain(`<title>${copy.wordmark} — ${copy.start.tagline}</title>`)
  })

  it('includes a meta description sourced from copy.start', () => {
    const head = renderLandingHead()
    expect(head).toMatch(/<meta name="description" content="[^"]*"/)
    expect(head).toContain(copy.start.tagline)
    expect(head).toContain(copy.start.footerNote)
  })

  it('includes OpenGraph tags', () => {
    const head = renderLandingHead()
    expect(head).toContain('property="og:title"')
    expect(head).toContain('property="og:description"')
    expect(head).toContain('property="og:type" content="website"')
    expect(head).toContain('property="og:url"')
    expect(head).toContain('property="og:site_name"')
  })

  it('includes a canonical link', () => {
    expect(renderLandingHead()).toMatch(/<link rel="canonical" href="https:\/\/[^"]+" \/>/)
  })

  it('includes a valid SoftwareApplication JSON-LD block', () => {
    const head = renderLandingHead()
    const match = head.match(/<script type="application\/ld\+json">(.+)<\/script>/)
    expect(match).not.toBeNull()

    const jsonLd = JSON.parse(match![1])
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('SoftwareApplication')
    expect(jsonLd.name).toBe(copy.wordmark)
    expect(jsonLd.featureList).toEqual(copy.start.features)
  })
})

describe('buildLandingDocument', () => {
  const shell =
    '<!doctype html><html><head><title>Split Bill</title></head><body><div id="root"></div><script type="module" src="/assets/main-abc123.js"></script></body></html>'

  const shellWithNoindex =
    '<!doctype html><html><head><!-- explains the tag below --><meta name="robots" content="noindex" /><title>Split Bill</title></head><body><div id="root"></div><script type="module" src="/assets/main-abc123.js"></script></body></html>'

  it('replaces the empty root div with landing content', () => {
    const html = buildLandingDocument(shell)
    expect(html).not.toContain('<div id="root"></div>')
    expect(html).toContain(copy.start.tagline)
  })

  it('preserves the rest of the shell untouched', () => {
    const html = buildLandingDocument(shell)
    expect(html).toContain('<script type="module" src="/assets/main-abc123.js"></script>')
  })

  it('replaces the shell title with the landing-specific title', () => {
    const html = buildLandingDocument(shell)
    expect(html).not.toContain('<title>Split Bill</title>')
    expect(html).toContain(`<title>${copy.wordmark} — ${copy.start.tagline}</title>`)
  })

  it('includes the JSON-LD block', () => {
    expect(buildLandingDocument(shell)).toContain('application/ld+json')
  })

  it('strips the shell noindex tag and its explanatory comment out of the landing document', () => {
    const html = buildLandingDocument(shellWithNoindex)
    expect(html).not.toContain('noindex')
    expect(html).not.toContain('explains the tag below')
  })

  it('throws if the shell has no empty root placeholder to splice into', () => {
    expect(() =>
      buildLandingDocument('<html><head><title>Split Bill</title></head><body>no root here</body></html>'),
    ).toThrow()
  })

  it('throws if the shell has no title tag to replace', () => {
    expect(() => buildLandingDocument('<html><head></head><body><div id="root"></div></body></html>')).toThrow()
  })
})
