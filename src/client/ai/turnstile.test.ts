import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  delete window.turnstile
  document.querySelectorAll('script[src*="turnstile"]').forEach((node) => node.remove())
})

describe('getTurnstileToken', () => {
  it('resolves with the token the widget callback receives', async () => {
    window.turnstile = {
      render: (container, options) => {
        expect(container.style.display).toBe('none')
        expect(options.sitekey).toBe('a-site-key')
        expect(options.size).toBe('invisible')
        options.callback('a-token')
        return 'widget-1'
      },
      remove: vi.fn(),
    }

    const { getTurnstileToken } = await import('./turnstile')
    await expect(getTurnstileToken('a-site-key')).resolves.toBe('a-token')
  })

  it('rejects when the widget reports its own error-callback', async () => {
    window.turnstile = {
      render: (_container, options) => {
        options['error-callback']()
        return 'widget-1'
      },
      remove: vi.fn(),
    }

    const { getTurnstileToken } = await import('./turnstile')
    await expect(getTurnstileToken('a-site-key')).rejects.toThrow('turnstile_failed')
  })

  it('removes the widget and its hidden container once resolved, so repeat calls do not leak DOM nodes', async () => {
    const remove = vi.fn()
    window.turnstile = {
      render: (_container, options) => {
        options.callback('a-token')
        return 'widget-1'
      },
      remove,
    }

    const { getTurnstileToken } = await import('./turnstile')
    const before = document.body.childElementCount
    await getTurnstileToken('a-site-key')

    expect(remove).toHaveBeenCalledWith('widget-1')
    expect(document.body.childElementCount).toBe(before)
  })

  it('loads the Cloudflare script on demand when turnstile is not yet on window', async () => {
    const { getTurnstileToken } = await import('./turnstile')
    const pending = getTurnstileToken('a-site-key')

    const script = document.head.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')
    expect(script).not.toBeNull()

    window.turnstile = {
      render: (_container, options) => {
        options.callback('a-token')
        return 'widget-1'
      },
      remove: vi.fn(),
    }
    script?.dispatchEvent(new Event('load'))

    await expect(pending).resolves.toBe('a-token')
  })

  it('rejects when the Cloudflare script itself fails to load', async () => {
    const { getTurnstileToken } = await import('./turnstile')
    const pending = getTurnstileToken('a-site-key')

    const script = document.head.querySelector('script[src*="turnstile"]')
    script?.dispatchEvent(new Event('error'))

    await expect(pending).rejects.toThrow('turnstile_script_failed')
  })
})
