import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fa } from './index';

const ROOT = join(process.cwd(), 'src');
const SKIP = join(ROOT, 'locales', 'fa');

function files(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (path === SKIP) return [];
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

function unescape(value: string): string {
  return value.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
}

describe('Persian interface coverage', () => {
  it('has a Persian value for every literal t() key', () => {
    const missing = new Set<string>();
    for (const file of files(ROOT)) {
      const source = readFileSync(file, 'utf8');
      const pattern = /\bt\(\s*(['"])((?:[^\\]|\\.)*?)\1/g;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source))) {
        const key = unescape(match[2]);
        if (!key.trim()) continue;
        const value = fa[key];
        if (!value || !value.trim()) missing.add(key);
      }
    }
    expect([...missing].sort(), `Missing Persian UI translations (${missing.size})`).toEqual([]);
  });
});
