import { describe, expect, it } from 'vitest';
import { COURSES } from '../curriculum';
import { ALL_GUIDES, GUIDE_FA, LESSON_GUIDES } from './index';

describe('lesson guides', () => {
  it('covers every lesson exactly once', () => {
    const lessonIds = COURSES.flatMap((course) => course.lessons.map((lesson) => lesson.id)).sort();
    const guideIds = ALL_GUIDES.map((guide) => guide.id).sort();

    expect(guideIds).toEqual(lessonIds);
    expect(new Set(guideIds).size).toBe(guideIds.length);
  });

  it('pairs English and Persian text so translation keys cannot drift', () => {
    for (const guide of ALL_GUIDES) {
      expect(guide.faIdea.trim(), `${guide.id} has no Persian idea`).not.toBe('');
      expect(guide.faPractice.trim(), `${guide.id} has no Persian practice`).not.toBe('');
      expect(GUIDE_FA[guide.idea], `${guide.id} idea is not mapped`).toBe(guide.faIdea);
      expect(GUIDE_FA[guide.practice], `${guide.id} practice is not mapped`).toBe(guide.faPractice);
    }
  });

  it('keeps every English guide string unique', () => {
    const keys = ALL_GUIDES.flatMap((guide) => [guide.idea, guide.practice]);
    expect(new Set(keys).size).toBe(keys.length);
    expect(Object.keys(GUIDE_FA)).toHaveLength(keys.length);
  });

  it('exposes the same text through the curriculum', () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        expect(lesson.guide).toEqual(LESSON_GUIDES[lesson.id]);
      }
    }
  });
});
