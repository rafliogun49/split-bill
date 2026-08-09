import { describe, expect, it } from 'vitest'
import app from './index'

describe('worker', () => {
  it('responds to the stub health route', async () => {
    const res = await app.request('/api/health')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ status: 'ok' })
  })
})
