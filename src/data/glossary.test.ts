import { describe, expect, it } from 'vitest';
import { ALL_LESSONS } from './curriculum';
import { GLOSSARY, GLOSSARY_CATEGORIES } from './glossary';

const lessonIds = new Set(ALL_LESSONS.map((lesson) => lesson.id));

describe('glossary', () => {
  it('has 35 unique terms across six categories', () => {
    expect(GLOSSARY).toHaveLength(35);
    expect(GLOSSARY_CATEGORIES).toHaveLength(6);
    expect(new Set(GLOSSARY.map((entry) => entry.term)).size).toBe(GLOSSARY.length);
    for (const entry of GLOSSARY) {
      expect(GLOSSARY_CATEGORIES).toContain(entry.category);
      expect(entry.term.trim().length).toBeGreaterThan(0);
      expect(entry.definition.trim().length).toBeGreaterThan(0);
    }
  });

  it('links every entry to a lesson that exists', () => {
    for (const entry of GLOSSARY) {
      expect(entry.lessonId, entry.term).toBeDefined();
      expect(lessonIds.has(entry.lessonId ?? ''), `${entry.term}: ${entry.lessonId}`).toBe(true);
    }
  });

  it('uses aliases only for additional searchable names', () => {
    for (const entry of GLOSSARY) {
      for (const alias of entry.aliases ?? []) {
        expect(alias.trim().length).toBeGreaterThan(0);
        expect(alias.toLowerCase()).not.toBe(entry.term.toLowerCase());
      }
    }
  });

  it('covers every category with at least one entry', () => {
    for (const category of GLOSSARY_CATEGORIES) {
      expect(GLOSSARY.some((entry) => entry.category === category)).toBe(true);
    }
  });
});
