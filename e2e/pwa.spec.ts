import { expect, openRoute, test } from './fixtures';

test.describe('PWA and offline', () => {
  test('links a valid web app manifest', async ({ page, request }) => {
    await openRoute(page, '/');

    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(href).toBeTruthy();

    const response = await request.get(new URL(href!, page.url()).href);
    expect(response.ok()).toBe(true);
    const manifest = await response.json();
    expect(manifest.name).toContain('Cadence');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#0c0d10');
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(
      expect.arrayContaining(['192x192', '512x512']),
    );

    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0c0d10');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/icon-192.png');
  });

  test('registers a service worker that serves the app offline', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect
      .poll(
        () =>
          page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            return registration?.active?.state ?? null;
          }),
        { timeout: 20_000 },
      )
      .toBe('activated');

    // The first page load happens before the worker claims the client; one
    // reload is enough to make the document itself come from the cache.
    await page.reload({ waitUntil: 'networkidle' });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('main h1')).toContainText(/Good (morning|afternoon|evening)\./);

    // Clean URLs are served by the cached document through the SPA fallback.
    await page.goto('/courses', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveText('From first notes to master form.');

    await page.goto('/lesson/treble-clef-reading', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveText('Reading the Treble Clef');

    await context.setOffline(false);
  });

  test('does not show the update prompt when no new build is waiting', async ({ page }) => {
    await openRoute(page, '/');
    await expect(page.locator('.update-prompt')).toHaveCount(0);
  });
});
