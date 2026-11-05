import { expect, openRoute, progressState, seedProgress, test } from './fixtures';

test.describe('graded repertoire', () => {
  test('lists every piece and filters by level', async ({ page }) => {
    await openRoute(page, '/repertoire');

    const cards = page.locator('.repertoire-card');
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toContainText('Ode to Joy');
    await expect(cards.first()).toContainText('After');
    await expect(page.locator('.repertoire-note')).toBeVisible();

    await page.getByRole('button', { name: 'Early intermediate' }).click();
    await expect(cards).toHaveCount(2);
    await expect(cards.filter({ hasText: 'Minuet in G' })).toBeVisible();
    await expect(cards.filter({ hasText: 'Scarborough Fair' })).toBeVisible();

    await page.getByRole('button', { name: 'Beginner', exact: true }).click();
    await expect(cards).toHaveCount(3);
    await expect(cards.filter({ hasText: 'Twinkle, Twinkle, Little Star' })).toBeVisible();

    await page.getByRole('button', { name: 'All levels' }).click();
    await expect(cards).toHaveCount(5);
  });

  test('opens a piece with score, tab, chords, hands, and a working transport', async ({
    page,
  }) => {
    await openRoute(page, '/repertoire/ode-to-joy');

    await expect(page.locator('main h1')).toHaveText('Ode to Joy');
    await expect(page.locator('.melody-score')).toBeVisible();
    await expect(page.locator('.tablature')).toBeVisible();
    await expect(page.locator('.chord-diagram')).toHaveCount(4);
    await expect(page.getByRole('link', { name: /Open lesson/ })).toBeVisible();

    const play = page.locator('.play-along-button');
    const tempo = page.locator('.play-along-tempo output');
    await expect(tempo).toHaveText('84 BPM');
    await page.locator('.play-along-tempo input').focus();
    await page.locator('.play-along-tempo input').press('ArrowRight');
    await expect(tempo).toHaveText('85 BPM');

    const loop = page.locator('.play-along-toggle').filter({ hasText: 'Loop' });
    await expect(loop).toHaveAttribute('aria-pressed', 'true');
    await loop.click();
    await expect(loop).toHaveAttribute('aria-pressed', 'false');
    await loop.click();

    await page.locator('.play-along-count-in select').selectOption('0');
    await play.click();
    await expect(play).toContainText('Stop');
    await expect(page.locator('.play-along-beat.active')).toHaveCount(1, { timeout: 4000 });
    await play.click();
    await expect(play).toContainText('Play');

    await page.getByRole('button', { name: 'Left hand', exact: true }).click();
    await expect(page.locator('.repertoire-hand-note')).toBeVisible();
    await expect(page.locator('.melody-score')).toHaveCount(0);

    await page.getByRole('button', { name: 'Both hands', exact: true }).click();
    await expect(page.locator('.melody-score')).toBeVisible();
    await expect(page.locator('.repertoire-hand-note')).toHaveCount(0);
  });

  test('follows the saved guitar tuning in the tab and fretboard', async ({ page }) => {
    await openRoute(page, '/repertoire/ode-to-joy');
    await seedProgress(page, {
      settings: { instrument: 'both', guitarTuning: 'drop-d' },
    });

    await expect(page.locator('.instrument-heading').filter({ hasText: 'Guitar' })).toContainText(
      'Guitar · Drop D',
    );
    await expect(page.locator('.fretboard')).toHaveAttribute(
      'aria-label',
      'Guitar fretboard, Drop D, frets 0 to 12',
    );

    const labels = await page
      .locator('.tab-string-label')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim()));
    expect(labels).toEqual(['E', 'B', 'G', 'D', 'A', 'D']);

    await expect(page.locator('.repertoire-tuning-note')).toContainText('Drop D');

    const state = await progressState(page);
    expect(state.settings).toMatchObject({ guitarTuning: 'drop-d' });
  });

  test('keeps lesson hand positions in standard tuning when another is saved', async ({ page }) => {
    await openRoute(page, '/lesson/sound-pitch-keyboard');
    await seedProgress(page, {
      settings: { instrument: 'guitar', guitarTuning: 'drop-d' },
    });

    await expect(page.locator('.lesson-instrument-caption').first()).toContainText(
      /standard tuning/i,
    );
    await expect(page.locator('.lesson-instrument .fretboard').first()).toHaveAttribute(
      'aria-label',
      'Guitar fretboard, Standard tuning, frets 0 to 12',
    );

    await page.locator('.lesson-instrument-play').first().click();
    await expect(page.locator('.lesson-instrument .play-along-button').first()).toContainText(
      'Stop',
    );
    await page.locator('.lesson-instrument .play-along-button').first().click();
  });
});

test.describe('scale and chord explorer', () => {
  test('shows scales and chords on every surface and maps CAGED shapes', async ({ page }) => {
    await openRoute(page, '/explorer');

    const heading = page.locator('.explorer-view-head h2');
    await expect(heading).toHaveText('C Major');
    await expect(page.locator('.explorer-notes span')).toHaveCount(7);
    await expect(page.locator('.melody-score')).toBeVisible();
    await expect(page.locator('.fretboard')).toBeVisible();

    await page.locator('#explorer-root').selectOption('2');
    await page.locator('#explorer-kind').selectOption('chord:Major');
    await expect(heading).toHaveText('D Major');
    await expect(page.locator('.explorer-caged .chord-diagram')).toHaveCount(5);
    await expect(page.locator('.explorer-caged figcaption').first()).toContainText('D · C');

    await page.getByRole('button', { name: 'Transpose up one semitone' }).click();
    await expect(heading).toHaveText('D♯ Major');

    await page.locator('.explorer-spelling').click();
    await expect(heading).toHaveText('E♭ Major');

    await page.getByRole('button', { name: 'Hear it' }).click();
    await expect(page.locator('.play-along-button')).toContainText('Stop');
    await page.locator('.play-along-button').click();
    await expect(page.locator('.play-along-button')).toContainText('Play');
  });
});
