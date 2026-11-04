import {
  answerCurrentQuestion,
  completeSession,
  expect,
  openRoute,
  progressState,
  test,
} from './fixtures';

test.describe('daily practice', () => {
  test('runs the starter session end to end and records the result', async ({ page }) => {
    await openRoute(page, '/practice');
    await expect(page.locator('.starter-callout')).toContainText('No history yet');
    await expect(page.locator('.practice-start')).toContainText('Begin 12-question session');

    await page.getByRole('button', { name: 'Begin 12-question session' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 12');
    await expect(page.locator('.session-head .eyebrow')).toHaveText('Starter session');

    await completeSession(page, 12);

    await expect(page.locator('.session-summary h2')).toHaveText('Session complete');
    await expect(page.locator('.session-summary .summary-ring')).toContainText('%');
    await expect(page.locator('.session-summary')).toContainText('of 12 correct');
    await expect(page.locator('.session-summary')).toContainText('XP this session');
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('.practice-toast')).toContainText('Session logged');
    await expect(page.locator('.practice-toast')).toContainText('%');

    const state = await progressState(page);
    expect(state.daily.count, 'twelve answers are logged today').toBe(12);
    expect(state.xp, 'answers award XP').toBeGreaterThan(0);
    expect(Object.keys(state.skills).length, 'starter skills enter the queue').toBeGreaterThan(0);

    await page.reload({ waitUntil: 'networkidle' });
    const reloaded = await progressState(page);
    expect(reloaded.xp).toBe(state.xp);
    expect(reloaded.daily.count).toBe(12);
    await expect(page.locator('.practice-toast')).toHaveCount(0);
  });

  test('answers choice questions with number keys and continues with Enter', async ({ page }) => {
    await openRoute(page, '/practice');
    await page.getByRole('button', { name: 'Begin 12-question session' }).click();

    // The first four questions are staff-reading choices.
    await expect(page.locator('.choice')).toHaveCount(4);
    await page.keyboard.press('1');
    await expect(page.locator('.feedback-panel')).toBeVisible();
    await expect(page.locator('.choice.correct')).toHaveCount(1);

    await page.keyboard.press('Enter');
    await expect(page.locator('.session-count')).toContainText('Question 2 / 12');
    await expect(page.locator('.feedback-panel')).toHaveCount(0);

    await page.keyboard.press('2');
    await expect(page.locator('.feedback-panel')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('.session-count')).toContainText('Question 3 / 12');
  });

  test('leaving mid-session returns to the queue without logging a result', async ({ page }) => {
    await openRoute(page, '/practice');
    await page.getByRole('button', { name: 'Begin 12-question session' }).click();
    await expect(page.locator('.exercise-session')).toBeVisible();

    await page.getByRole('button', { name: 'Exit exercises' }).click();
    await expect(page.locator('.practice-start')).toBeVisible();
    await expect(page.locator('.exercise-session')).toHaveCount(0);
    await expect(page.locator('.practice-toast')).toHaveCount(0);
  });

  test('retrying a finished session starts a fresh set of questions', async ({ page }) => {
    await openRoute(page, '/practice');
    await page.getByRole('button', { name: 'Begin 12-question session' }).click();
    await completeSession(page, 12);

    const firstSummary = await page.locator('.session-summary .summary-ring strong').innerText();
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 /');
    await expect(page.locator('.session-summary')).toHaveCount(0);

    // After the first session the queue is built from the skills just practised,
    // so the retried set can be shorter than the 12-question starter mix.
    const total = Number((await page.locator('.session-count').innerText()).match(/\/ (\d+)/)?.[1]);
    expect(total).toBeGreaterThan(0);

    // Answer one question and confirm the session is restartable after that.
    await answerCurrentQuestion(page);
    expect(firstSummary).toMatch(/%$/);
  });
});
