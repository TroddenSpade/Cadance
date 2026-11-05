import { expect, openRoute, test } from './fixtures';

test.describe('metadata and shareability', () => {
  test('sets route-specific titles, descriptions, canonical URLs, and social tags', async ({ page }) => {
    await openRoute(page, '/lesson/treble-clef-reading');
    await expect(page).toHaveTitle('Reading the Treble Clef — Cadence');

    const origin = new URL(page.url()).origin;
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /ledger lines/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}/lesson/treble-clef-reading`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${origin}/lesson/treble-clef-reading`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Reading the Treble Clef — Cadence',
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Reading the Treble Clef — Cadence',
    );

    await openRoute(page, '/courses');
    await expect(page).toHaveTitle('Courses — Cadence');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /22 courses/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}/courses`,
    );

    await openRoute(page, '/');
    await expect(page).toHaveTitle('Cadence — Music Theory Trainer');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}/`);

    await openRoute(page, '/not-a-route');
    await expect(page).toHaveTitle('This page is off the staff. — Cadence');
  });

  test('keeps metadata localized in Persian', async ({ page }) => {
    await openRoute(page, '/');
    await page.locator('.sidebar-language .language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await openRoute(page, '/courses');
    await expect(page).toHaveTitle('دوره‌ها — کادنس');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fa_IR');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /دوره/);
  });

  test('serves a sitemap covering courses and lessons plus a matching robots file', async ({
    request,
  }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    const xml = await sitemap.text();
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('/courses/staff-pitch</loc>');
    expect(xml).toContain('/lesson/treble-clef-reading</loc>');
    expect(xml).not.toContain('/settings/settings');

    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    const rules = await robots.text();
    expect(rules).toContain('User-agent: *');
    expect(rules).toContain('Sitemap: https://cadence.parsasam.ir/sitemap.xml');

    const fallback = await request.get('/404.html');
    expect(fallback.ok()).toBe(true);
    const fallbackHtml = await fallback.text();
    expect(fallbackHtml).toContain('<div id="root"></div>');
    expect(fallbackHtml).toContain('<meta name="robots" content="noindex" />');
  });

  test('serves deep routes as static HTML with route-specific metadata', async ({ request }) => {
    const lesson = await request.get('/lesson/treble-clef-reading');
    expect(lesson.status()).toBe(200);
    const lessonHtml = await lesson.text();
    expect(lessonHtml).toContain('<title>Reading the Treble Clef — Cadence</title>');
    expect(lessonHtml).toContain('<meta property="og:type" content="article" />');
    expect(lessonHtml).toContain(
      '<link rel="canonical" href="https://cadence.parsasam.ir/lesson/treble-clef-reading" />',
    );

    const course = await request.get('/courses/staff-pitch');
    expect(course.status()).toBe(200);
    const courseHtml = await course.text();
    expect(courseHtml).toContain('<title>Pitch &amp; the Staff — Cadence</title>');
    expect(courseHtml).toContain('<meta property="og:type" content="article" />');

    const staticPage = await request.get('/courses');
    expect(staticPage.status()).toBe(200);
    expect(await staticPage.text()).toContain('<title>Courses — Cadence</title>');
  });

  test('serves deep links directly and redirects old hash links', async ({ page }) => {
    await page.goto('/lesson/treble-clef-reading', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/lesson\/treble-clef-reading$/);
    await expect(page.locator('main h1')).toHaveText('Reading the Treble Clef');

    await page.goto('/#/lesson/sound-pitch-keyboard', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/lesson\/sound-pitch-keyboard$/);
    await expect(page.locator('main h1')).toHaveText('Sound, Pitch & the Keyboard');

    await page.goto('/#/trainer?topic=find-notes', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/trainer\?topic=find-notes$/);
    await expect(page.locator('.topic-card.selected')).toContainText('Find notes');
  });
});
