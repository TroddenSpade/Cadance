import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// GitHub Pages serves 404.html for unknown paths. A copy of the built shell
// lets the client router render deep links such as /lesson/treble-clef-reading.
// Every real route now has its own index.html, so this file is only a genuine
// missing-page fallback and should never be indexed.
const source = join('dist', 'index.html');
const target = join('dist', '404.html');
let html = await readFile(source, 'utf8');
html = html.replace(
  '</head>',
  '    <meta name="robots" content="noindex" />\n  </head>',
);
await writeFile(target, html);
console.log('Created dist/404.html for genuine missing pages.');
