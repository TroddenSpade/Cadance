import { expect, test as base, type Page } from '@playwright/test';

export { expect };

/**
 * Every normal test starts with English stored and the install card snoozed,
 * so only the language and mobile suites deal with first-run UI.
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() => {
      try {
        if (!localStorage.getItem('cadence.language')) {
          localStorage.setItem('cadence.language', 'en');
        }
        if (!localStorage.getItem('cadence.install.dismissed.v1')) {
          localStorage.setItem('cadence.install.dismissed.v1', String(Date.now()));
        }
      } catch {
        /* storage is unavailable */
      }
    });
    await use(context);
  },
});

export type RouteCheck = {
  path: string;
  heading: string | RegExp;
};

export async function openRoute(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' });
  await expect(page.locator('main h1')).toBeVisible();
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(0);
}

export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

export function readProgress(page: Page): Promise<Record<string, unknown> | null> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('cadence.progress.v1');
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  });
}

/**
 * Answers the current exercise. Choice questions get option A; instrument
 * questions get the first piano key. Both paths deliberately accept wrong
 * answers, because the session flow is what is under test.
 */
export async function answerCurrentQuestion(page: Page): Promise<void> {
  const choice = page.locator('.exercise-session .choice').first();
  if (await choice.count()) {
    await choice.click();
  } else {
    const pianoKey = page.locator('.exercise-session .piano-key').first();
    if (await pianoKey.count()) {
      await pianoKey.click();
    } else {
      const fret = page.locator('.exercise-session .fret-position').first();
      await fret.click();
    }
  }

  await expect(page.locator('.feedback-panel')).toBeVisible();
  await page.locator('.feedback-panel .button.primary').click();
}

/** Answers a whole session, including keyboard-only choice questions. */
export async function completeSession(page: Page, questions: number): Promise<void> {
  for (let index = 0; index < questions; index += 1) {
    await expect(page.locator('.session-count')).toContainText(`Question ${index + 1}`);
    await answerCurrentQuestion(page);
  }
  await expect(page.locator('.session-summary')).toBeVisible();
}

/**
 * True when the current question is a "Find X on the instrument" prompt whose
 * answer can be derived from the (visible) prompt text.
 */
export async function isFindNoteQuestion(page: Page): Promise<boolean> {
  const prompt = await page.locator('.question-prompt').innerText();
  return /^Find .+ on the instrument/.test(prompt.trim());
}

/**
 * Clicks the piano key named in a "Find X" prompt. Grading accepts any octave,
 * so the first matching key is always a correct answer.
 */
export async function answerFindNote(page: Page): Promise<void> {
  const prompt = (await page.locator('.question-prompt').innerText()).trim();
  const match = prompt.match(/^Find (\S+)/);
  if (!match) throw new Error(`Not a find-note prompt: ${prompt}`);

  const key = page.locator(`.exercise-session .piano-key[aria-label^="Piano key ${match[1]}"]`).first();
  await expect(key).toBeVisible();
  await key.click();
  await expect(page.locator('.feedback-panel.correct')).toBeVisible();
  await page.locator('.feedback-panel .button.primary').click();
}

/**
 * Answers a mixed session as well as possible without reading hidden state:
 * instrument prompts are answered correctly, everything else gets option A.
 */
export async function answerQuestionBestEffort(page: Page): Promise<void> {
  if (await isFindNoteQuestion(page)) {
    await answerFindNote(page);
    return;
  }
  await answerCurrentQuestion(page);
}

/** Completes a mix of find-note and choice questions. */
export async function completeSessionBestEffort(page: Page, questions: number): Promise<void> {
  for (let index = 0; index < questions; index += 1) {
    await expect(page.locator('.session-count')).toContainText(`Question ${index + 1}`);
    await answerQuestionBestEffort(page);
  }
  await expect(page.locator('.session-summary')).toBeVisible();
}

/** Reads persisted progress state, normalised to an object. */
export async function progressState(page: Page): Promise<{
  xp: number;
  settings: Record<string, unknown>;
  lessons: Record<string, { completedAt?: number; bestScore: number; attempts: number }>;
  skills: Record<string, unknown>;
  daily: { date: string; count: number; correct: number };
  [key: string]: unknown;
}> {
  const raw = await readProgress(page);
  if (!raw) throw new Error('No progress state stored');
  return raw as never;
}

/**
 * Merges values into the stored progress document, then reloads so the provider
 * picks them up. XP is stored per device, matching how the app recomputes it.
 */
export async function seedProgress(
  page: Page,
  options: {
    xp?: number;
    lessons?: Record<string, { completedAt?: number; bestScore: number; attempts: number }>;
    settings?: Record<string, unknown>;
  },
): Promise<void> {
  await page.evaluate((patch) => {
    const raw = localStorage.getItem('cadence.progress.v1');
    if (!raw) throw new Error('The app has not written progress state yet');
    const state = JSON.parse(raw) as Record<string, unknown>;
    const device = localStorage.getItem('cadence.device.v1') ?? 'test-device';

    if (patch.xp !== undefined) {
      const byDevice = (state.xpByDevice as Record<string, number> | undefined) ?? {};
      byDevice[device] = patch.xp;
      state.xpByDevice = byDevice;
    }
    if (patch.lessons) {
      state.lessons = { ...(state.lessons as Record<string, unknown>), ...patch.lessons };
    }
    if (patch.settings) {
      state.settings = { ...(state.settings as Record<string, unknown>), ...patch.settings };
    }
    localStorage.setItem('cadence.progress.v1', JSON.stringify(state));
  }, options);

  await page.reload({ waitUntil: 'networkidle' });
}

export async function dismissInstallPrompt(page: Page): Promise<void> {
  const dismiss = page.getByRole('button', { name: 'Dismiss install prompt' });
  if (await dismiss.count()) await dismiss.click();
}
