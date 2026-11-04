import { completeSessionBestEffort, expect, openRoute, test } from './fixtures';

test.describe('trainer', () => {
  test('builds a drill from a topic and difficulty', async ({ page }) => {
    await openRoute(page, '/trainer');

    await expect(page.locator('.topic-card')).toHaveCount(14);
    await expect(page.locator('.topic-card.selected')).toContainText('Staff reading');
    await expect(page.locator('.difficulty-card')).toHaveCount(3);
    await expect(page.locator('.difficulty-card.selected')).toContainText('Foundation');
    await expect(page.locator('.trainer-start')).toContainText('10 questions');
    await expect(page.locator('main h1')).toHaveText('Trainer');

    await page.locator('.topic-card').filter({ hasText: 'Find notes' }).click();
    await expect(page.locator('.topic-card.selected')).toContainText('Find notes');
    await expect(page.locator('.trainer-start')).toContainText('Locate notes on the piano and fretboard.');

    await page.locator('.difficulty-card').filter({ hasText: 'Advanced' }).click();
    await expect(page.locator('.difficulty-card.selected')).toContainText('Advanced');

    await page.getByRole('button', { name: 'Start drill' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 10');
    await expect(page.locator('.session-head .eyebrow')).toHaveText('Find notes trainer');

    await page.getByRole('button', { name: 'Exit exercises' }).click();
    await expect(page.locator('.trainer-builder')).toBeVisible();
    await expect(page.locator('.topic-card.selected')).toContainText('Find notes');
  });

  test('completes a find-note drill and returns to the builder', async ({ page }) => {
    await openRoute(page, '/trainer?topic=find-notes');

    await expect(page.locator('.topic-card.selected')).toContainText('Find notes');
    await page.getByRole('button', { name: 'Start drill' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 10');

    await completeSessionBestEffort(page, 10);
    await expect(page.locator('.session-summary h2')).toHaveText('Session complete');
    await expect(page.locator('.session-summary')).toContainText('Find the note');

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('.trainer-builder')).toBeVisible();
    await expect(page.locator('.session-summary')).toHaveCount(0);
  });

  test('mixed review pulls a twelve-question set across topics', async ({ page }) => {
    await openRoute(page, '/trainer');
    await page.locator('.topic-card.mixed').click();
    await expect(page.locator('.topic-card.selected')).toContainText('Mixed review');
    await expect(page.locator('.trainer-start')).toContainText('12 questions');
    await expect(page.locator('.trainer-start')).toContainText('A balanced set across three randomly chosen topics.');

    await page.getByRole('button', { name: 'Start drill' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 12');
    await expect(page.locator('.session-head .eyebrow')).toHaveText('Mixed trainer');

    await page.getByRole('button', { name: 'Exit exercises' }).click();
    await expect(page.locator('.trainer-builder')).toBeVisible();
  });

  test('honours the topic query parameter and ignores unknown ones', async ({ page }) => {
    await openRoute(page, '/trainer?topic=intervals');
    await expect(page.locator('.topic-card.selected')).toContainText('Ear intervals');

    // Leave the trainer so an unknown query parameter is evaluated on mount.
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.goto('/trainer?topic=not-a-topic', { waitUntil: 'networkidle' });
    await expect(page.locator('main h1')).toHaveText('Trainer');
    await expect(page.locator('.topic-card.selected')).toContainText('Staff reading');
  });

  test('shows the current instrument and links to settings', async ({ page }) => {
    await openRoute(page, '/trainer');
    await expect(page.locator('.trainer-header-stat')).toContainText('Piano & guitar');

    await page.locator('.trainer-header-stat').getByRole('link', { name: 'Change' }).click();
    await expect(page.locator('main h1')).toHaveText('Settings');

    await page.locator('.instrument-choice').filter({ hasText: 'Guitar fretboard' }).click();
    await page.goto('/trainer', { waitUntil: 'networkidle' });
    await expect(page.locator('.trainer-header-stat')).toContainText('Guitar');
  });
});
