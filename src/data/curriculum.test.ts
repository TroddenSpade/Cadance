import { describe, expect, it } from 'vitest';
import { ALL_LESSONS, COURSES } from './curriculum';
import { LESSON_INSTRUMENT_DEMOS } from './instrumentExamples';

describe('curriculum structure', () => {
  it('uses unique course and lesson ids', () => {
    const courseIds = COURSES.map((course) => course.id);
    const lessonIds = ALL_LESSONS.map((lesson) => lesson.id);

    expect(new Set(courseIds).size).toBe(courseIds.length);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it('gives every lesson prose, exercises, and a playable example', () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        expect(lesson.sections.length, `${lesson.id} has no sections`).toBeGreaterThan(0);
        expect(lesson.exercises.length, `${lesson.id} has no exercises`).toBeGreaterThan(0);
        expect(lesson.minutes, `${lesson.id} has no duration`).toBeGreaterThan(0);
        expect(LESSON_INSTRUMENT_DEMOS[lesson.id]?.length, `${lesson.id} has no example`).toBeGreaterThan(0);

        for (const section of lesson.sections) {
          expect(section.body.trim().length, `${lesson.id} has an empty section`).toBeGreaterThan(40);
        }
      }
    }
  });

  it('covers the full starter-to-master range', () => {
    const levels = new Set(COURSES.map((course) => course.level));
    expect(levels).toEqual(new Set(['foundations', 'beginner', 'intermediate', 'advanced', 'master']));
  });
});
