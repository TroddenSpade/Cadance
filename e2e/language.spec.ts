import { test as baseTest } from '@playwright/test';
import { expect, test } from './fixtures';

baseTest.describe('first visit', () => {
  baseTest('asks for a language before anything else and remembers English', async ({ page }) => {
    await page.goto('/');

    const dialog = page.locator('.language-modal');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#language-modal-title')).toHaveText('Choose your language');
    await expect(page.getByRole('button', { name: /English/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /فارسی/ })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('cadence.language'))).toBeNull();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.locator('.language-option[lang="en"]').click();

    await expect(dialog).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    expect(await page.evaluate(() => localStorage.getItem('cadence.language'))).toBe('en');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  baseTest('switches to Persian, stores it, and reloads without the dialog', async ({ page }) => {
    await page.goto('/');
    await page.locator('.language-option[lang="fa"]').click();

    await expect(page.locator('.language-modal')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect(await page.evaluate(() => localStorage.getItem('cadence.language'))).toBe('fa');

    const greeting = page.locator('.hero-greeting');
    await expect(greeting).toContainText(/صبح بخیر|بعد از ظهر بخیر|عصر بخیر/);
    await expect(page.locator('.hero-motto')).toContainText('ریتم را زنده نگه دار');
    const lines = await page.locator('.hero h1 .hero-greeting, .hero h1 .hero-motto').evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
    );
    expect(lines).toHaveLength(2);
    expect(lines.every((height) => height > 0)).toBe(true);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.language-modal')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.hero-greeting')).toContainText(/صبح بخیر|بعد از ظهر بخیر|عصر بخیر/);

    await page.locator('.sidebar-language .language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.evaluate(() => localStorage.getItem('cadence.language'))).toBe('en');
  });

  baseTest('asks on a deep link and keeps focus inside the dialog', async ({ page }) => {
    await page.goto('/metronome');
    await expect(page.locator('.language-modal')).toBeVisible();

    // Focus starts on English; Tab and Shift+Tab must cycle inside the dialog.
    await expect(page.getByRole('button', { name: /English/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /فارسی/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /English/ })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: /فارسی/ })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('.language-modal')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('main h1')).toHaveText('مترونوم');
  });
});

test.describe('language switching', () => {
  test('applies Persian to every main page without horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await page.locator('.sidebar-language .language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    const routes = [
      { path: '/', heading: 'ریتم را زنده نگه دار' },
      { path: '/courses', heading: 'از نخستین نُت‌ها تا فرم استادی.' },
      { path: '/practice', heading: 'تمرین روزانه' },
      { path: '/tools', heading: 'ابزارها' },
      { path: '/settings', heading: 'تنظیمات' },
      { path: '/metronome', heading: 'مترونوم' },
      { path: '/tuner', heading: 'کوک‌کن' },
    ];

    for (const route of routes) {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('main h1')).toContainText(route.heading);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route.path} overflows in Persian`).toBeLessThanOrEqual(0);
    }
  });

  test('gives Persian lesson sections stable, shareable anchors', async ({ page }) => {
    await page.goto('/lesson/sound-pitch-keyboard', { waitUntil: 'networkidle' });
    await page.locator('.sidebar-language .language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    const sections = await page.locator('.lesson-section').evaluateAll((nodes) =>
      nodes.map((node) => ({ id: node.id, heading: node.querySelector('h2')?.textContent?.trim() ?? '' })),
    );
    expect(sections.length).toBeGreaterThan(1);
    expect(sections.every((section) => section.id.length > 0)).toBe(true);
    expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);

    const tocHrefs = await page.locator('.toc a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    for (const section of sections) {
      expect(tocHrefs).toContain(`#${section.id}`);
    }

    await page.locator('.toc a').first().click();
    await expect(page).toHaveURL(new RegExp(`#${sections[0].id}$`));
    const focusedHeading = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
    expect(focusedHeading).toBe(sections[0].heading);
  });

  test('keeps the language across routes and settings', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: /فارسی \(Persian\)/ }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await page.goto('/courses', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect(await page.evaluate(() => localStorage.getItem('cadence.language'))).toBe('fa');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.language-modal')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
