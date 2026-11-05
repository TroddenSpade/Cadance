import { expect, openRoute, test } from './fixtures';

test.describe('analysis room', () => {
  test('switches between progressions and grades the cadence', async ({ page }) => {
    await openRoute(page, '/analysis');

    await expect(page.locator('main h1')).toHaveText('Harmony analysis');
    await expect(page.locator('.analysis-card')).toHaveCount(8);
    await expect(page.locator('.analysis-room h2')).toHaveText('The classical period');
    await expect(page.locator('.analysis-chord')).toHaveCount(4);

    await page.locator('.analysis-card', { hasText: 'The deceptive turn' }).click();
    await expect(page.locator('.analysis-room h2')).toHaveText('The deceptive turn');
    await expect(page.locator('.analysis-chord')).toHaveCount(5);

    await page.locator('.cadence-option', { hasText: 'Deceptive cadence' }).click();
    const feedback = page.locator('.cadence-feedback');
    await expect(feedback).toHaveClass(/correct/);
    await expect(feedback).toContainText('Correct — Deceptive cadence.');

    await page.getByRole('button', { name: 'Hide Roman numerals' }).click();
    await expect(page.locator('.analysis-roman').first()).toHaveText('—');
    await expect(page.getByRole('button', { name: 'Show Roman numerals' })).toBeVisible();
  });

  test('opens a requested progression and links back to the lesson that explains it', async ({
    page,
  }) => {
    await openRoute(page, '/analysis?progression=two-five-one');

    await expect(page.locator('.analysis-room h2')).toHaveText('ii–V–I, the engine');
    await expect(page.locator('.analysis-card.selected')).toContainText('ii–V–I, the engine');
    await expect(page.locator('.analysis-lessons a[href="/lesson/seventh-chords"]')).toBeVisible();

    await expect(page.locator('.analysis-cadence')).toBeVisible();
    await page.locator('.cadence-option', { hasText: 'Authentic cadence' }).click();
    await expect(page.locator('.cadence-feedback')).toHaveClass(/correct/);
  });
});

test.describe('style paths', () => {
  test('lists four traditions and opens a route with working deep links', async ({ page }) => {
    await openRoute(page, '/paths');
    await expect(page.locator('main h1')).toHaveText('Style paths');
    await expect(page.locator('.path-card')).toHaveCount(4);

    await page.locator('.path-card', { hasText: 'The pop path' }).click();
    await expect(page).toHaveURL(/\/paths\/pop$/);
    await expect(page.locator('main h1')).toHaveText('The pop path');
    await expect(page.locator('.path-step')).toHaveCount(9);

    const loopLink = page.locator('a[href="/loops?style=pop&key=0"]');
    await expect(loopLink).toBeVisible();
    await loopLink.click();
    await expect(page).toHaveURL(/\/loops\?style=pop&key=0$/);
    await expect(page.locator('.loop-style.selected')).toContainText('Pop');
    await expect(page.locator('.loop-key.selected')).toHaveText('C');
  });

  test('shows a not-found state for an unknown path', async ({ page }) => {
    await openRoute(page, '/paths/not-a-path');
    await expect(page.locator('main h1')).toHaveText('Path not found');
    await page.getByRole('link', { name: 'Back to paths' }).click();
    await expect(page.locator('main h1')).toHaveText('Style paths');
  });

  test('carries a starting step and progress into each route', async ({ page }) => {
    await openRoute(page, '/paths/jazz');
    await expect(page.locator('main h1')).toHaveText('The jazz path');
    await expect(page.locator('.path-step').first()).toContainText('Lesson');
    await expect(page.locator('.path-step-open').first()).toHaveAttribute(
      'href',
      '/lesson/major-scale',
    );
    await expect(page.getByRole('link', { name: 'Start the path' })).toBeVisible();
  });
});

test.describe('glossary', () => {
  test('searches terms and filters by topic', async ({ page }) => {
    await openRoute(page, '/glossary');
    await expect(page.locator('main h1')).toHaveText('Glossary');
    await expect(page.locator('.glossary-card')).toHaveCount(35);

    await page.getByLabel('Search the glossary').fill('cadence');
    await expect(page.locator('.glossary-card')).toHaveCount(1);
    await expect(page.locator('.glossary-card h3')).toHaveText('Cadence (phrase ending)');
    await expect(page.locator('.glossary-count')).toContainText('Showing 1 of 35 terms');

    await page.getByRole('button', { name: 'Clear the search' }).click();
    await expect(page.locator('.glossary-card')).toHaveCount(35);

    await page.locator('.glossary-filter', { hasText: 'Rhythm' }).click();
    await expect(page.locator('.glossary-card')).toHaveCount(6);
    await expect(page.locator('.glossary-filter.active')).toHaveText('Rhythm');
  });

  test('shows an empty state and links each term to its lesson', async ({ page }) => {
    await openRoute(page, '/glossary');
    const firstLink = page.locator('.glossary-card .text-link').first();
    await expect(firstLink).toHaveAttribute('href', /^\/lesson\//);

    await page.getByLabel('Search the glossary').fill('zzzz-not-a-term');
    await expect(page.locator('.glossary-empty h2')).toHaveText('No terms match that search');
    await page.getByRole('button', { name: 'Reset the glossary' }).click();
    await expect(page.locator('.glossary-card')).toHaveCount(35);
  });
});

test.describe('assignments and worksheets', () => {
  test('builds a timed sheet with the chosen focus and student name', async ({ page }) => {
    await openRoute(page, '/assignments');
    await expect(page.locator('main h1')).toHaveText('Assignments & worksheets');
    await expect(page.locator('.worksheet-focus')).toHaveCount(5);
    await expect(page.locator('.worksheet-minutes button')).toHaveCount(4);
    await expect(page.locator('.worksheet-task')).toHaveCount(8);

    await page.getByRole('button', { name: '15 min' }).click();
    const minutes = await page
      .locator('.worksheet-task-head span')
      .evaluateAll((nodes) =>
        nodes.reduce((sum, node) => sum + Number.parseInt(node.textContent ?? '0', 10), 0),
      );
    expect(minutes).toBe(15);

    await page.locator('.worksheet-focus', { hasText: 'Harmony' }).click();
    await expect(page.locator('.worksheet-sheet-head h2')).toHaveText('Harmony');
    await expect(page.locator('.worksheet-task')).toHaveCount(5);

    await page.getByLabel('Student or ensemble (optional)').fill('Ada Lovelace');
    await expect(page.locator('.worksheet-sheet-name')).toContainText('Ada Lovelace');
  });

  test('clears the sheet when nothing is selected and prints from the browser', async ({ page }) => {
    await openRoute(page, '/assignments');

    const boxes = page.locator('.worksheet-activity input');
    for (let index = 0; index < (await boxes.count()); index += 1) {
      if (await boxes.nth(index).isChecked()) await boxes.nth(index).uncheck();
    }
    await expect(page.locator('.worksheet-empty')).toContainText('No activities selected');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('.worksheet-task')).toHaveCount(8);

    await page.evaluate(() => {
      window.print = () => {
        (window as unknown as { __printed?: boolean }).__printed = true;
      };
    });
    await page.getByRole('button', { name: 'Print worksheet' }).click();
    expect(await page.evaluate(() => (window as unknown as { __printed?: boolean }).__printed)).toBe(
      true,
    );
  });
});

test.describe('practice recorder', () => {
  test('offers an explicit, local recording on a piece and a loop', async ({ page }) => {
    await openRoute(page, '/repertoire/ode-to-joy');
    const pieceRecorder = page.locator('.practice-recorder');
    await expect(pieceRecorder).toBeVisible();
    await expect(pieceRecorder.locator('.recorder-note')).toContainText(/never uploaded/i);
    await expect(pieceRecorder.getByRole('button', { name: 'Record' })).toBeVisible();
    await expect(pieceRecorder.locator('audio')).toHaveCount(0);

    await page.goto('/loops?style=jazz&key=2', { waitUntil: 'networkidle' });
    await expect(page.locator('.loop-style.selected')).toContainText('Jazz');
    await expect(page.locator('.practice-recorder h2')).toHaveText('Record your solo');
    await expect(page.locator('.practice-recorder audio')).toHaveCount(0);
  });
});

test('tools links to every phase-three room', async ({ page }) => {
  await openRoute(page, '/tools');
  for (const [href, title] of [
    ['/analysis', 'Harmony analysis'],
    ['/paths', 'Style paths'],
    ['/glossary', 'Glossary'],
    ['/assignments', 'Assignments & worksheets'],
  ]) {
    const card = page.locator(`.tool-card[href="${href}"]`);
    await expect(card).toContainText(title);
  }
});

test('searches both English and localized glossary text', async ({ page }) => {
  await openRoute(page, '/');
  await page.locator('.sidebar-language .language-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  await page.goto('/glossary', { waitUntil: 'networkidle' });
  await expect(page.locator('.glossary-card')).toHaveCount(35);
  await page.getByLabel('جست‌وجو در واژه‌نامه').fill('کادنس');
  await expect(page.locator('.glossary-card')).toHaveCount(1);
  await expect(page.locator('.glossary-card h3')).toContainText('کادنس');
});
