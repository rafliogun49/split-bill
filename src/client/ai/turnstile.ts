// Runs Cloudflare Turnstile invisibly to mint the single-use token
// POST /api/parse requires. Split Bill has no CAPTCHA UI of its own — the
// DESIGN.md §8 component list doesn't include one — so this never shows the
// Payer anything unless Cloudflare itself decides to interrupt.

interface TurnstileRenderOptions {
  sitekey: string
  size: 'invisible'
  callback: (token: string) => void
  'error-callback': () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

let scriptPromise: Promise<void> | undefined

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('turnstile_script_failed'))
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export async function getTurnstileToken(siteKey: string): Promise<string> {
  await loadTurnstileScript()
  const turnstile = window.turnstile
  if (!turnstile) {
    throw new Error('turnstile_unavailable')
  }

  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    // `turnstile.render` returns the widget id synchronously, but a stub (or
    // an unusually fast real widget) can invoke callback/error-callback
    // before that return value is assigned — reading it directly inside
    // either callback would hit the temporal dead zone. Deferring the
    // `remove` call to a microtask guarantees the assignment below has
    // already completed by the time it runs, while still running before
    // this function's own caller resumes.
    const widgetId = turnstile.render(container, {
      sitekey: siteKey,
      size: 'invisible',
      callback: (token) => {
        container.remove()
        queueMicrotask(() => turnstile.remove(widgetId))
        resolve(token)
      },
      'error-callback': () => {
        container.remove()
        queueMicrotask(() => turnstile.remove(widgetId))
        reject(new Error('turnstile_failed'))
      },
    })
  })
}
