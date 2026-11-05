import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { COURSES } from './src/data/curriculum';
import { REPERTOIRE } from './src/data/repertoire';

// GitHub Pages project sites live under /<repo>/. Set BASE_PATH when building
// for Pages; local development and root-hosted sites keep "/".
const base = process.env.BASE_PATH ?? '/';
const siteUrl = (process.env.SITE_URL ?? 'https://cadence.parsasam.ir').replace(/\/$/, '');

const sitePrefix = `${siteUrl}${base === '/' ? '' : base.replace(/\/$/, '')}`;

const STATIC_PAGES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Cadence — Music Theory Trainer',
    description:
      'Learn music theory by reading, hearing, and playing it. Courses, daily review, and instrument drills for piano and guitar.',
  },
  '/courses': {
    title: 'Courses — Cadence',
    description:
      'Browse the full Cadence curriculum: courses across five levels, from first notes to post-tonal analysis.',
  },
  '/repertoire': {
    title: 'Graded repertoire — Cadence',
    description:
      'Short public-domain pieces with score, tab, chord diagrams, and a tempo, count-in, loop, and click.',
  },
  '/explorer': {
    title: 'Scale & chord explorer — Cadence',
    description:
      'See any scale or chord on the staff, piano, and fretboard, hear it, transpose it, and view CAGED shapes.',
  },
  '/sight-reading': {
    title: 'Sight reading — Cadence',
    description:
      'Read four bars of music and play them back in order, with a count-in, click, and pitch-by-pitch feedback.',
  },
  '/rhythm': {
    title: 'Rhythm room — Cadence',
    description:
      'Listen to a two-bar rhythm and tap it back. The score judges the spacing of your attacks.',
  },
  '/loops': {
    title: 'Backing loops — Cadence',
    description:
      'A bass line and chords in a repeating four-bar progression, with a solo scale in every key.',
  },
  '/practice': {
    title: 'Daily practice — Cadence',
    description:
      'A daily mix of reading, listening, and instrument questions, scheduled by spaced review.',
  },
  '/trainer': {
    title: 'Trainer — Cadence',
    description:
      'Build a custom drill by topic and difficulty, from note reading to progressions and melody dictation.',
  },
  '/tools': {
    title: 'Tools — Cadence',
    description: 'Metronome and tuner: keep time and pitch with offline practice tools.',
  },
  '/metronome': {
    title: 'Metronome — Cadence',
    description:
      'A precise metronome with meters, subdivisions, accents, tap tempo, and a floating dock.',
  },
  '/tuner': {
    title: 'Tuner — Cadence',
    description:
      'A microphone tuner for guitar, bass, orchestral strings, piano, and custom tunings.',
  },
  '/settings': {
    title: 'Settings — Cadence',
    description: 'Language, instrument, note names, audio, daily goal, sync, backup, and reset.',
  },
};

const COURSE_PATHS = new Map(COURSES.map((course) => [`/courses/${course.id}`, course]));
const LESSON_PATHS = new Map(
  COURSES.flatMap((course) => course.lessons.map((lesson) => [`/lesson/${lesson.id}`, lesson])),
);
const REPERTOIRE_PATHS = new Map(
  REPERTOIRE.map((piece) => [`/repertoire/${piece.id}`, piece]),
);

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function pageMeta(path: string): { title: string; description: string; type: string } {
  const course = COURSE_PATHS.get(path);
  if (course) {
    return { title: `${course.title} — Cadence`, description: course.subtitle, type: 'article' };
  }
  const lesson = LESSON_PATHS.get(path);
  if (lesson) {
    return { title: `${lesson.title} — Cadence`, description: lesson.summary, type: 'article' };
  }
  const piece = REPERTOIRE_PATHS.get(path);
  if (piece) {
    return {
      title: `${piece.title} — Cadence`,
      description: piece.summary,
      type: 'article',
    };
  }
  const page = STATIC_PAGES[path] ?? STATIC_PAGES['/'];
  return { ...page, type: 'website' };
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, content: string): string {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  return html.replace(
    pattern,
    `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`,
  );
}

function renderRouteHtml(
  source: string,
  path: string,
  meta: { title: string; description: string; type: string },
): string {
  const url = `${sitePrefix}${path === '/' ? '/' : path}`;
  let html = source;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttribute(meta.description)}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttribute(url)}" />`,
  );
  html = setMeta(html, 'property', 'og:type', meta.type);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  return html;
}

/** Emit a sitemap, robots.txt, and a static HTML shell for every route. */
function seoFiles(): Plugin {
  const paths = [
    '/',
    ...Object.keys(STATIC_PAGES).filter((path) => path !== '/'),
    ...COURSES.map((course) => `/courses/${course.id}`),
    ...COURSES.flatMap((course) => course.lessons.map((lesson) => `/lesson/${lesson.id}`)),
    ...REPERTOIRE.map((piece) => `/repertoire/${piece.id}`),
  ];
  const uniquePaths = [...new Set(paths)];

  return {
    name: 'cadence-seo',
    apply: 'build',
    transformIndexHtml(html) {
      // Keep the static crawler metadata aligned with SITE_URL and BASE_PATH;
      // the runtime RouteMeta component handles navigation after that.
      return html.replaceAll('https://cadence.parsasam.ir', sitePrefix);
    },
    generateBundle() {
      const urls = uniquePaths.map(
        (path) => `  <url><loc>${sitePrefix}${path}</loc></url>`,
      );
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${sitePrefix}/sitemap.xml\n`,
      });
    },
    async closeBundle() {
      const source = await readFile(join('dist', 'index.html'), 'utf8');
      for (const path of uniquePaths) {
        if (path === '/') continue;
        const directory = join('dist', path.replace(/^\//, ''));
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, 'index.html'), renderRouteHtml(source, path, pageMeta(path)));
      }
      console.log(`Prerendered ${uniquePaths.length - 1} route shells.`);
    },
  };
}

/**
 * `vite preview` does not resolve `/route` to `/route/index.html`. Real static
 * hosts (and GitHub Pages) do, so mirror that behavior locally and in tests
 * instead of silently falling back to the root shell.
 */
function previewRouteShells(): Plugin {
  return {
    name: 'cadence-preview-routes',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? '/';
        const [pathname, search] = raw.split('?');
        const basePath = server.config.base.replace(/\/$/, '');
        const relative =
          basePath && pathname.startsWith(basePath)
            ? pathname.slice(basePath.length) || '/'
            : pathname;

        if (relative !== '/' && !/\.[a-z0-9]+$/i.test(relative)) {
          const directory = relative.replace(/\/$/, '');
          const candidate = join(
            server.config.root,
            server.config.build.outDir,
            directory.replace(/^\//, ''),
            'index.html',
          );
          if (existsSync(candidate)) {
            req.url = `${basePath}${directory}/index.html${search ? `?${search}` : ''}`;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [
    react(),
    seoFiles(),
    previewRouteShells(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'fonts/NotoMusic-Regular.ttf'],
      manifest: {
        name: 'Cadence — Music Theory Trainer',
        short_name: 'Cadence',
        description:
          'Learn to read, hear, and play music theory. Interactive courses, daily recall, and instrument practice for piano and guitar.',
        theme_color: '#0c0d10',
        background_color: '#0c0d10',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        categories: ['education', 'music'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['index.html', '**/*.{js,css,svg,png,ttf,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
});
