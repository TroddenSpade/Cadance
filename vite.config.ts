import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { COURSES } from './src/data/curriculum';

// GitHub Pages project sites live under /<repo>/. Set BASE_PATH when building
// for Pages; local development and root-hosted sites keep "/".
const base = process.env.BASE_PATH ?? '/';
const siteUrl = (process.env.SITE_URL ?? 'https://cadance.parsasam.ir').replace(/\/$/, '');

const sitePrefix = `${siteUrl}${base === '/' ? '' : base.replace(/\/$/, '')}`;

/** Emit a sitemap of every indexable route plus a matching robots.txt. */
function seoFiles(): Plugin {
  return {
    name: 'cadence-seo',
    apply: 'build',
    transformIndexHtml(html) {
      // Keep the static crawler metadata aligned with SITE_URL and BASE_PATH;
      // the runtime RouteMeta component handles navigation after that.
      return html.replaceAll('https://cadance.parsasam.ir', sitePrefix);
    },
    generateBundle() {
      const paths = [
        '/',
        '/courses',
        '/practice',
        '/trainer',
        '/tools',
        '/metronome',
        '/tuner',
        '/settings',
        ...COURSES.map((course) => `/courses/${course.id}`),
        ...COURSES.flatMap((course) => course.lessons.map((lesson) => `/lesson/${lesson.id}`)),
      ];
      const urls = [...new Set(paths)].map(
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
  };
}

export default defineConfig({
  base,
  plugins: [
    react(),
    seoFiles(),
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
        globPatterns: ['**/*.{js,css,html,svg,png,ttf,woff2}'],
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
