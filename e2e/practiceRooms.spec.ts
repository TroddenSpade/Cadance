import { expect, openRoute, test } from './fixtures';

test.describe('sight-reading room', () => {
  test('changes level, records notes, undoes, and checks the read', async ({ page }) => {
    await openRoute(page, '/sight-reading');

    await expect(page.locator('main h1')).toHaveText('Sight-reading room');
    await expect(page.locator('.sight-level')).toHaveCount(4);
    await expect(page.locator('.sight-slot')).toHaveCount(16);
    await expect(page.locator('.melody-score')).toBeVisible();

    await page.getByRole('button', { name: /Bass clef/ }).click();
    await expect(page.locator('.sight-room .panel-head h2')).toHaveText('Bass clef');
    await expect(page.locator('.sight-slot')).toHaveCount(16);

    const keys = page.locator('.piano-key.white');
    const keyCount = await keys.count();
    expect(keyCount).toBeGreaterThan(3);
    const firstKey = keys.nth(1);
    await firstKey.click();
    await firstKey.click();
    await expect(page.locator('.sight-slot.filled')).toHaveCount(2);

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.locator('.sight-slot.filled')).toHaveCount(1);

    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.locator('.sight-slot.filled')).toHaveCount(0);

    for (let index = 0; index < 16; index += 1) {
      await keys.nth(index % keyCount).click();
    }
    await expect(page.locator('.sight-slot.filled')).toHaveCount(16);

    await page.getByRole('button', { name: 'Check reading' }).click();
    await expect(page.locator('.sight-feedback')).toBeVisible();
    await expect(page.locator('.sight-feedback')).toContainText(/matched|Clean read/);
  });

  test('starts the transport with a count-in and a click', async ({ page }) => {
    await openRoute(page, '/sight-reading');

    await page.locator('.play-along-count-in select').selectOption('0');
    const play = page.locator('.play-along-button');
    await play.click();
    await expect(play).toContainText('Stop');
    await expect(page.locator('.play-along-beat.active')).toHaveCount(1, { timeout: 4000 });
    await play.click();
    await expect(play).toContainText('Play');
  });
});

test.describe('rhythm room', () => {
  test('switches level, listens, then scores a tapped echo', async ({ page }) => {
    await openRoute(page, '/rhythm');

    await expect(page.locator('main h1')).toHaveText('Rhythm room');
    await expect(page.locator('.rhythm-level')).toHaveCount(4);
    await expect(page.locator('.rhythm-display')).toBeVisible();

    await page.getByRole('button', { name: /Split the beat/ }).click();
    await expect(page.locator('.rhythm-room .panel-head h2')).toHaveText(
      'Hear the two-bar pattern',
    );

    await page.getByRole('button', { name: 'Tap back' }).click();
    await expect(page.locator('.tap-pad')).toBeVisible();
    await expect(page.locator('.rhythm-tap-layout .rhythm-display')).toBeVisible();

    for (let index = 0; index < 8; index += 1) {
      await page.locator('.tap-pad').click();
      await page.waitForTimeout(280);
    }

    await page.getByRole('button', { name: 'Check taps' }).click();
    await expect(page.locator('.tap-result')).toBeVisible();
    await expect(page.locator('.tap-result')).toContainText(/attacks matched/);
    expect(await page.locator('.tap-dots span').count()).toBeGreaterThan(3);

    await page.getByRole('button', { name: 'Clear taps' }).click();
    await expect(page.locator('.tap-result')).toHaveCount(0);
  });

  test('the listening transport runs and stops', async ({ page }) => {
    await openRoute(page, '/rhythm');

    await page.locator('.play-along-count-in select').selectOption('0');
    const play = page.locator('.play-along-button').first();
    await play.click();
    await expect(play).toContainText('Stop');
    await play.click();
    await expect(play).toContainText('Play');
  });
});

test.describe('backing loops', () => {
  test('changes style and key, shows the progression, and plays', async ({ page }) => {
    await openRoute(page, '/loops');

    await expect(page.locator('main h1')).toHaveText('Backing loops');
    await expect(page.locator('.loop-style')).toHaveCount(6);
    await expect(page.locator('.loop-chord')).toHaveCount(4);
    await expect(page.locator('.loop-chord strong')).toHaveText(['C', 'G', 'Am', 'F']);
    await expect(page.locator('.loop-score')).toBeVisible();
    await expect(page.locator('.loop-solo-surface .fretboard')).toBeVisible();

    await page.locator('.loop-key').filter({ hasText: /^D$/ }).click();
    await expect(page.locator('.loop-chord strong')).toHaveText(['D', 'A', 'Bm', 'G']);

    await page.getByRole('button', { name: /^Jazz/ }).click();
    await expect(page.locator('.loop-room .panel-head h2')).toHaveText('Jazz in D');
    await expect(page.locator('.loop-chord strong')).toHaveText(['Em7', 'A7', 'Dmaj7', 'Dmaj7']);

    await page.getByRole('button', { name: /^Waltz/ }).click();
    await expect(page.locator('.loop-room .panel-head h2')).toHaveText('Waltz in D');

    await page.locator('.play-along-count-in select').selectOption('0');
    const play = page.locator('.play-along-button');
    await play.click();
    await expect(play).toContainText('Stop');
    await expect(page.locator('.loop-chord.active')).toHaveCount(1, { timeout: 4000 });
    await play.click();
    await expect(play).toContainText('Play');
  });
});
