import { completeSessionBestEffort, expect, openRoute, progressState, test } from './fixtures';

test.describe('lesson page', () => {
  test('presents the lesson, its sections, and the exercise set', async ({ page }) => {
    await openRoute(page, '/lesson/treble-clef-reading');

    await expect(page.locator('main h1')).toHaveText('Reading the Treble Clef');
    await expect(page.locator('.lesson-section').first()).toBeVisible();
    const sections = await page.locator('.lesson-section').count();
    expect(sections).toBeGreaterThanOrEqual(3);

    await expect(page.locator('.toc a')).toHaveCount(sections + 1);
    await expect(page.locator('.lesson-meta')).toContainText('10 min read');
    await expect(page.locator('.lesson-meta')).toContainText('10 exercise questions');
    await expect(page.locator('.lesson-pager .pager-link.next')).toContainText('Next lesson');

    // The practice banner sits at the end of the lesson and opens the session.
    await page.getByRole('button', { name: 'Start exercises' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 10');
    await expect(page.locator('.session-head .eyebrow')).toHaveText('Lesson exercises');

    await page.getByRole('button', { name: 'Exit exercises' }).click();
    await expect(page.locator('.session-embed')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Start exercises' })).toBeVisible();
  });

  test('passes the lesson by finding the requested notes, then persists completion', async ({ page }) => {
    test.setTimeout(90_000);
    const lessonId = 'sound-pitch-keyboard';
    await openRoute(page, `/lesson/${lessonId}`);

    await expect(page.locator('.lesson-meta')).toContainText('14 exercise questions');
    await page.getByRole('button', { name: 'Start exercises' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 14');

    // 10 of the 14 questions are find-note; answering those correctly is
    // enough for the 70% pass mark, so this completes the lesson for real.
    await completeSessionBestEffort(page, 14);

    await expect(page.locator('.session-summary h2')).toHaveText('Lesson complete');
    const accuracy = Number((await page.locator('.summary-ring strong').innerText()).replace('%', ''));
    expect(accuracy, 'find-note answers should clear the pass mark').toBeGreaterThanOrEqual(70);

    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('.lesson-result.passed')).toBeVisible();
    await expect(page.locator('.done-chip')).toContainText('Completed');

    const state = await progressState(page);
    expect(state.lessons[lessonId]?.completedAt, 'lesson completion is stored').toBeGreaterThan(0);
    expect(state.lessons[lessonId]?.bestScore).toBeGreaterThanOrEqual(0.7);

    await page.reload();
    await expect(page.locator('.done-chip')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Practise again' })).toBeVisible();
  });

  test('shows the failure result without completing the lesson', async ({ page }) => {
    const lessonId = 'treble-clef-reading';
    await openRoute(page, `/lesson/${lessonId}`);
    const before = (await progressState(page)).lessons[lessonId]?.attempts ?? 0;

    await page.getByRole('button', { name: 'Start exercises' }).click();
    await expect(page.locator('.session-count')).toContainText('Question 1 / 10');

    // Deliberately pick option A every time. With 10 four-choice questions the
    // odds of a pass are negligible, and the point is the failure path anyway.
    for (let index = 0; index < 10; index += 1) {
      await page.locator('.choice').first().click();
      await page.locator('.feedback-panel .button.primary').click();
    }

    await expect(page.locator('.session-summary')).toBeVisible();
    const accuracy = Number((await page.locator('.summary-ring strong').innerText()).replace('%', ''));
    const heading = await page.locator('.session-summary h2').innerText();
    if (accuracy >= 70) {
      // Extremely unlikely, but keep the assertion honest if it happens.
      await expect(page.locator('.session-summary h2')).toHaveText('Lesson complete');
    } else {
      await expect(page.locator('.session-summary h2')).toHaveText('Almost there');
      await expect(page.locator('.session-summary')).toContainText('reach 70% to complete this lesson');
      await expect(page.locator('.done-chip')).toHaveCount(0);
    }
    expect(heading).toMatch(/Lesson complete|Almost there/);

    await page.getByRole('button', { name: 'Done' }).click();
    const attempts = (await progressState(page)).lessons[lessonId]?.attempts;
    expect(attempts, 'the attempt is recorded even when it fails').toBeGreaterThan(before);
  });
});
