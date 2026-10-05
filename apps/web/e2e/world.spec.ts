import { expect, type Page, test } from '@playwright/test';

/** Holds a key until `done` resolves or the time runs out, like a person walking. */
async function holdUntil(page: Page, key: string, done: Promise<unknown>, ms: number): Promise<void> {
  await page.keyboard.down(key);
  await Promise.race([done, page.waitForTimeout(ms)]);
  await page.keyboard.up(key);
}

test('walks from the hall, through the door, up to the Dev AI', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('WASD ou setas para andar')).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);

  // Right, to line up with the door of the dev room, then up until the world says who is near.
  await holdUntil(page, 'd', new Promise(() => undefined), 400);
  const near = page.getByRole('status');
  await holdUntil(page, 'w', near.waitFor(), 10_000);
  await expect(near).toHaveText('Perto de Dev AI');
  await page.screenshot({ path: 'test-results/near-dev-ai.png' });

  // Walking away clears it.
  await holdUntil(page, 's', near.waitFor({ state: 'detached' }), 10_000);
  await expect(near).toHaveCount(0);
  expect(errors).toEqual([]);
});
