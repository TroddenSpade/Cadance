import { readFile } from 'node:fs/promises';
import { expect, openRoute, progressState, seedProgress, test } from './fixtures';

test.describe('settings', () => {
  test('changes language, instrument, naming, timbre, audio, and goal', async ({ page }) => {
    await openRoute(page, '/settings');
    await expect(page.locator('main h1')).toHaveText('Settings');

    await page.locator('.instrument-choice').filter({ hasText: 'Guitar fretboard' }).click();
    await expect(page.locator('.instrument-choice').filter({ hasText: 'Guitar fretboard' })).toHaveClass(/selected/);

    await page.locator('.naming-option').filter({ hasText: 'Letter names only' }).click();
    await expect(page.locator('.naming-option').filter({ hasText: 'Letter names only' })).toHaveClass(/selected/);

    await page.locator('.timbre-card').filter({ hasText: 'Guitar tone' }).locator('.timbre-select').click();
    await expect(page.locator('.timbre-card').filter({ hasText: 'Guitar tone' })).toHaveClass(/selected/);

    const autoPlay = page.getByRole('checkbox', { name: /Auto-play listening questions/ });
    const labels = page.getByRole('checkbox', { name: /Note labels on instruments/ });
    const sound = page.getByRole('checkbox', { name: /Sound enabled/ });
    await expect(autoPlay).toBeChecked();
    await autoPlay.uncheck();
    await labels.uncheck();
    await sound.uncheck();

    await page.locator('.goal-option').filter({ hasText: '30' }).click();
    await expect(page.locator('.goal-option.selected')).toContainText('30');

    await expect
      .poll(async () => (await progressState(page)).settings)
      .toMatchObject({
        instrument: 'guitar',
        noteNaming: 'letters',
        timbre: 'guitar',
        autoPlay: false,
        showLabels: false,
        sound: false,
        dailyGoal: 30,
      });

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.instrument-choice').filter({ hasText: 'Guitar fretboard' })).toHaveClass(/selected/);
    await expect(page.getByRole('checkbox', { name: /Auto-play listening questions/ })).not.toBeChecked();
    await expect(page.locator('.goal-option.selected')).toContainText('30');

    await page.locator('.instrument-choice').filter({ hasText: 'فارسی (Persian)' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.locator('.sidebar-language .language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('exports a backup, resets progress, and restores the file', async ({ page }) => {
    await openRoute(page, '/settings');
    await seedProgress(page, {
      xp: 321,
      lessons: { 'treble-clef-reading': { completedAt: Date.now(), bestScore: 0.9, attempts: 2 } },
      settings: { instrument: 'guitar', dailyGoal: 30 },
    });

    await expect(page.locator('.settings-level')).toContainText('321 XP total');
    await expect(page.locator('.sidebar .level-card')).toContainText('321 XP');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export backup' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^cadence-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const path = await download.path();
    expect(path).not.toBeNull();
    const backup = JSON.parse(await readFile(path!, 'utf8'));
    expect(backup.xp).toBe(321);
    expect(backup.settings.instrument).toBe('guitar');
    expect(backup.lessons['treble-clef-reading'].bestScore).toBe(0.9);

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Reset progress', exact: true }).click();
    await expect(page.locator('.settings-level')).toContainText('0 XP total');
    // Resetting progress keeps preferences.
    await expect(page.locator('.instrument-choice').filter({ hasText: 'Guitar fretboard' })).toHaveClass(/selected/);
    expect((await progressState(page)).lessons['treble-clef-reading']).toBeUndefined();

    page.on('dialog', (dialog) => dialog.accept());
    await page.locator('input[type="file"]').setInputFiles({
      name: 'cadence-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backup)),
    });

    await expect(page.locator('.settings-level')).toContainText('321 XP total');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.settings-level')).toContainText('321 XP total');
    const restored = await progressState(page);
    expect(restored.lessons['treble-clef-reading'].bestScore).toBe(0.9);
    expect(restored.settings.instrument).toBe('guitar');
  });

  test('requires a second tap to reset everything', async ({ page }) => {
    await openRoute(page, '/settings');
    await seedProgress(page, { xp: 50, settings: { instrument: 'guitar', timbre: 'guitar', dailyGoal: 40 } });

    const resetAll = page.getByRole('button', { name: 'Reset all settings & progress' });
    await resetAll.click();
    await expect(page.getByRole('button', { name: 'Tap again to confirm' })).toBeVisible();

    await page.getByRole('button', { name: 'Tap again to confirm' }).click();
    await expect(page.locator('.settings-level')).toContainText('0 XP total');
    await expect(page.locator('.instrument-choice').filter({ hasText: 'Both surfaces' })).toHaveClass(/selected/);
    await expect(page.locator('.goal-option.selected')).toContainText('20');

    await page.reload({ waitUntil: 'networkidle' });
    const state = await progressState(page);
    expect(state.xp).toBe(0);
    expect(state.settings).toMatchObject({ instrument: 'both', timbre: 'piano', dailyGoal: 20 });
  });

  test('offers installation help and explains local-only sync', async ({ page }) => {
    await openRoute(page, '/settings');

    await expect(page.locator('.account-panel')).toContainText('Cross-device sync is not configured in this build');
    await expect(page.locator('.account-panel .sync-pill')).toContainText('Local only');

    const installRow = page.locator('.install-row');
    await expect(installRow).toContainText('Install app');
    await expect(installRow).toContainText('Add Cadence to your home screen or desktop');

    // The fixture snoozes the install card, so Settings offers to bring it back.
    await installRow.getByRole('button', { name: 'Show reminder' }).click();
    await expect(page.locator('.install-prompt')).toBeVisible();
    await expect(page.locator('.install-prompt')).toContainText(/browser menu|address bar/);
    await expect(installRow).toContainText(/Address-bar install icon/);
  });
});
