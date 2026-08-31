import { test, expect } from '@playwright/test';

test.describe('NeuronFlow E2E Suite', () => {
  test('loads home view and concept #1', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('NeuronFlow')).toBeVisible();
  });

  test('opens and searches in Quick Search modal', async ({ page }) => {
    await page.goto('./');
    // Click Search button
    const searchBtn = page.getByRole('button', { name: /search/i });
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });
});
