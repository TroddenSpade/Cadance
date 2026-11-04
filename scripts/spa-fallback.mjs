import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

// GitHub Pages serves 404.html for unknown paths. A copy of the built shell
// lets the client router render deep links such as /lesson/treble-clef-reading.
const source = join('dist', 'index.html');
const target = join('dist', '404.html');
await copyFile(source, target);
console.log('Created dist/404.html for clean-URL deep links.');
