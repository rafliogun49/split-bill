import { expect, test } from '@playwright/test'

test('start screen renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Scan the receipt. Tag who had what.')).toBeVisible()
})
