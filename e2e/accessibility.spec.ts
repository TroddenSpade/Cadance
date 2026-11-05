import { test as baseTest } from '@playwright/test';
import { collectPageErrors, expect, openRoute, test } from './fixtures';

const ROUTES = [
  '/',
  '/courses',
  '/courses/staff-pitch',
  '/lesson/treble-clef-reading',
  '/practice',
  '/trainer',
  '/tools',
  '/metronome',
  '/tuner',
  '/settings',
  '/missing-page',
];

type Audit = {
  h1: number;
  emptyButtons: string[];
  emptyLinks: string[];
  unlabeledControls: string[];
  duplicateIds: string[];
  imagesWithoutAlt: string[];
  mainLandmarks: number;
};

async function auditPage(page: import('@playwright/test').Page): Promise<Audit> {
  return page.evaluate(() => {
    const visible = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };

    const nameOf = (element: Element): string => {
      const aria = element.getAttribute('aria-label');
      if (aria?.trim()) return aria.trim();
      const labelledby = element.getAttribute('aria-labelledby');
      if (labelledby) {
        const text = labelledby
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent ?? '')
          .join(' ')
          .trim();
        if (text) return text;
      }
      const title = element.getAttribute('title');
      if (title?.trim()) return title.trim();
      return (element.textContent ?? '').replace(/\s+/g, ' ').trim();
    };

    const buttons = [...document.querySelectorAll('button, [role="button"], a[href]')].filter(visible);
    const controls = [...document.querySelectorAll('input, select, textarea')].filter(visible).filter((element) => {
      if (element.getAttribute('aria-label')?.trim()) return false;
      if (element.getAttribute('aria-labelledby')?.trim()) return false;
      if (element.closest('label')) return false;
      if ('labels' in element && (element as HTMLInputElement).labels?.length) return false;
      return true;
    });

    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

    return {
      h1: document.querySelectorAll('main h1').length,
      emptyButtons: buttons
        .filter((element) => element.tagName === 'BUTTON' || element.getAttribute('role') === 'button')
        .filter((element) => !nameOf(element))
        .map((element) => element.outerHTML.slice(0, 140)),
      emptyLinks: buttons
        .filter((element) => element.tagName === 'A')
        .filter((element) => !nameOf(element))
        .map((element) => element.outerHTML.slice(0, 140)),
      unlabeledControls: controls.map((element) => element.outerHTML.slice(0, 140)),
      duplicateIds,
      imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
      mainLandmarks: document.querySelectorAll('main').length,
    };
  });
}

test('audits every route for structural accessibility', async ({ page }) => {
  const errors = collectPageErrors(page);

  for (const route of ROUTES) {
    await openRoute(page, route);
    const audit = await auditPage(page);

    expect(audit.h1, `${route} should have exactly one main heading`).toBe(1);
    expect(audit.mainLandmarks, `${route} should have one main landmark`).toBe(1);
    expect(audit.emptyButtons, `${route} has unnamed buttons: ${audit.emptyButtons.join(' | ')}`).toEqual([]);
    expect(audit.emptyLinks, `${route} has unnamed links: ${audit.emptyLinks.join(' | ')}`).toEqual([]);
    expect(audit.unlabeledControls, `${route} has unlabeled controls`).toEqual([]);
    expect(audit.duplicateIds, `${route} has duplicate ids`).toEqual([]);
    expect(audit.imagesWithoutAlt, `${route} has images without alt text`).toEqual([]);
  }

  expect(errors, errors.join('\n')).toEqual([]);
});

test('names navigation landmarks and breadcrumbs', async ({ page }) => {
  await openRoute(page, '/tuner');

  await expect(page.getByRole('navigation', { name: 'Main navigation' }).first()).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Today' }).first()).toBeVisible();
});

test('exposes instrument keys and frets as labelled buttons', async ({ page }) => {
  await openRoute(page, '/trainer?topic=find-notes');
  await page.getByRole('button', { name: 'Start drill' }).click();
  await expect(page.locator('.instrument-surface')).toBeVisible();

  const keys = page.locator('.piano-key');
  const keyCount = await keys.count();
  expect(keyCount).toBeGreaterThan(0);
  for (let index = 0; index < keyCount; index += 1) {
    const key = keys.nth(index);
    await expect(key).toHaveAttribute('role', 'button');
    await expect(key).toHaveAttribute('tabindex', '0');
    await expect(key).toHaveAttribute('aria-label', /^Piano key /);
  }

  const frets = page.locator('.fret-position');
  const fretCount = await frets.count();
  expect(fretCount).toBeGreaterThan(0);
  await expect(frets.first()).toHaveAttribute('role', 'button');
  await expect(frets.first()).toHaveAttribute('aria-label', /\S/);

  // Labels are hidden during the quiz but the controls stay operable.
  const firstKey = keys.first();
  await firstKey.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.feedback-panel')).toBeVisible();
});

test('names every exercise choice and reports feedback to assistive tech', async ({ page }) => {
  await openRoute(page, '/trainer?topic=staff-reading');
  await page.getByRole('button', { name: 'Start drill' }).click();

  const choices = page.locator('.choice');
  await expect(choices).toHaveCount(4);
  for (const choice of await choices.all()) {
    expect((await choice.innerText()).trim().length).toBeGreaterThan(1);
    const name = await choice.evaluate((element) =>
      (element.getAttribute('aria-label') ?? element.textContent ?? '').trim(),
    );
    expect(name.length).toBeGreaterThan(1);
  }

  await choices.first().click();
  await expect(page.locator('.feedback-panel')).toBeVisible();
  await expect(page.locator('.feedback-panel .feedback-head strong')).toHaveText(/Correct|Not quite/);
});

baseTest.describe('language dialog', () => {
  baseTest('has dialog semantics and trapped focus', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog', { name: 'Choose your language' });

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'language-modal-title');
    await expect(dialog).toHaveAttribute('aria-describedby', 'language-modal-lead');
    await expect(page.locator('#language-modal-title')).toBeVisible();
    await expect(page.locator('#language-modal-lead')).toBeVisible();
    await expect(dialog.getByRole('button')).toHaveCount(2);

    await page.keyboard.press('Tab');
    const insideDialog = await page.evaluate(() => Boolean(document.activeElement?.closest('.language-modal')));
    expect(insideDialog).toBe(true);
  });
});
