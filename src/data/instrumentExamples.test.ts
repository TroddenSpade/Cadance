import { describe, expect, it } from 'vitest';
import { COURSES } from './curriculum';
import { LESSON_INSTRUMENT_DEMOS } from './instrumentExamples';

const OPEN_STRING_MIDI = [64, 59, 55, 50, 45, 40];

describe('lesson instrument examples', () => {
  it('gives every lesson section a guided instrument example', () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const demos = LESSON_INSTRUMENT_DEMOS[lesson.id] ?? [];
        const covered = new Set(demos.map((entry) => entry.afterSection));
        const missing = lesson.sections
          .map((section, index) => ({ section, index }))
          .filter(({ index }) => !covered.has(index))
          .map(({ section, index }) => `${lesson.id}[${index}] ${section.heading ?? 'intro'}`);

        expect(missing, `Missing instrument examples in ${lesson.id}`).toEqual([]);
      }
    }
  });

  it('keeps section indices valid, unique, and ordered', () => {
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const demos = LESSON_INSTRUMENT_DEMOS[lesson.id] ?? [];
        const indices = demos.map((entry) => entry.afterSection);

        expect(new Set(indices).size, `Duplicate section index in ${lesson.id}`).toBe(indices.length);
        expect([...indices].sort((a, b) => a - b), `Unsorted examples in ${lesson.id}`).toEqual(indices);

        for (const index of indices) {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(lesson.sections.length);
        }
      }
    }
  });

  it('keeps every shown note inside the piano range', () => {
    for (const [lessonId, demos] of Object.entries(LESSON_INSTRUMENT_DEMOS)) {
      for (const { afterSection, spec } of demos) {
        const start = spec.pianoStart ?? 48;
        const end = spec.pianoEnd ?? 72;

        expect(spec.notes.length, `${lessonId}[${afterSection}] has no notes`).toBeGreaterThan(0);
        for (const midi of spec.notes) {
          expect(midi, `${lessonId}[${afterSection}] note ${midi} is below ${start}`).toBeGreaterThanOrEqual(start);
          expect(midi, `${lessonId}[${afterSection}] note ${midi} is above ${end}`).toBeLessThanOrEqual(end);
        }
      }
    }
  });

  it('keeps every guitar spot playable and inside the displayed notes', () => {
    for (const [lessonId, demos] of Object.entries(LESSON_INSTRUMENT_DEMOS)) {
      for (const { afterSection, spec } of demos) {
        if (!spec.guitarSpots) continue;
        const pitchClasses = new Set(spec.notes.map((midi) => midi % 12));

        for (const spot of spec.guitarSpots) {
          expect(spot.string, `${lessonId}[${afterSection}] has an invalid string`).toBeGreaterThanOrEqual(0);
          expect(spot.string, `${lessonId}[${afterSection}] has an invalid string`).toBeLessThanOrEqual(5);
          expect(spot.fret, `${lessonId}[${afterSection}] has an invalid fret`).toBeGreaterThanOrEqual(0);
          expect(spot.fret, `${lessonId}[${afterSection}] has an invalid fret`).toBeLessThanOrEqual(12);

          const midi = OPEN_STRING_MIDI[spot.string] + spot.fret;
          expect(
            pitchClasses.has(midi % 12),
            `${lessonId}[${afterSection}] spot string ${spot.string} fret ${spot.fret} is not in the displayed notes`,
          ).toBe(true);
        }
      }
    }
  });

  it('gives every example explanatory text and, when rhythmic, positive values', () => {
    for (const [lessonId, demos] of Object.entries(LESSON_INSTRUMENT_DEMOS)) {
      for (const { afterSection, spec } of demos) {
        expect(spec.body?.trim().length ?? 0, `${lessonId}[${afterSection}] has no body`).toBeGreaterThan(40);
        expect(spec.caption?.trim().length ?? 0, `${lessonId}[${afterSection}] has no caption`).toBeGreaterThan(0);

        for (const item of spec.rhythm ?? []) {
          expect(item.beats, `${lessonId}[${afterSection}] has a non-positive rhythm value`).toBeGreaterThan(0);
        }
      }
    }
  });
});
