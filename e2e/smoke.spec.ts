import { expect, test } from '@playwright/test'
import { copy } from '../src/client/copy'

test('start screen renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(copy.start.headline)).toBeVisible()
})
