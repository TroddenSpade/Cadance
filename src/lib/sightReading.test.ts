import { describe, expect, it } from 'vitest';
import { STANDARD_GUITAR_TUNING } from './notation';
import {
  SIGHT_READING_LEVELS,
  checkSightReading,
  generateSightReading,
  sightReadingPattern,
} from './sightReading';

function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const playable = (midi: number) =>
  STANDARD_GUITAR_TUNING.some((open) => {
    const fret = midi - open;
    return fret >= 0 && fret <= 12;
  });

describe('sight-reading generation', () => {
  it('fills four complete bars at every level', () => {
    for (const level of SIGHT_READING_LEVELS) {
      for (let seed = 1; seed <= 12; seed += 1) {
        const exercise = generateSightReading(level.id, seeded(seed));
        const total = exercise.notes.reduce((sum, note) => sum + note.beats, 0);

        expect(exercise.notes.length, `${level.id} has no notes`).toBeGreaterThan(7);
        expect(total, `${level.id} does not fill four bars`).toBe(16);
        expect(exercise.clef).toBe(level.clef);
        expect(exercise.time).toEqual([4, 4]);

        let bar = 0;
        for (const note of exercise.notes) {
          expect(note.beats).toBeGreaterThan(0);
          bar += note.beats;
          while (bar >= 4) bar -= 4;
        }
        expect(bar).toBe(0);
      }
    }
  });

  it('keeps every note in the level range and playable on guitar', () => {
    for (const level of SIGHT_READING_LEVELS) {
      for (let seed = 1; seed <= 20; seed += 1) {
        const exercise = generateSightReading(level.id, seeded(seed));
        for (const note of exercise.notes) {
          expect(note.midi, `${level.id} below range`).toBeGreaterThanOrEqual(level.tonic);
          expect(note.midi, `${level.id} above range`).toBeLessThanOrEqual(level.tonic + 12);
          expect(playable(note.midi), `${level.id} note ${note.midi} is off the neck`).toBe(true);
        }
      }
    }
  });

  it('starts and ends on the tonic', () => {
    for (const level of SIGHT_READING_LEVELS) {
      for (let seed = 1; seed <= 8; seed += 1) {
        const exercise = generateSightReading(level.id, seeded(seed));
        const first = exercise.notes[0].midi - level.tonic;
        const last = exercise.notes[exercise.notes.length - 1].midi - level.tonic;
        expect([0, 4, 7]).toContain(first);
        expect(last).toBe(0);
      }
    }
  });

  it('repeats exactly for the same seeded random source', () => {
    const a = generateSightReading('treble-leaps', seeded(42));
    const b = generateSightReading('treble-leaps', seeded(42));
    expect(a.notes).toEqual(b.notes);
  });

  it('builds a transport pattern that matches the score length', () => {
    const exercise = generateSightReading('treble-steps', seeded(7));
    const pattern = sightReadingPattern(exercise);
    expect(pattern.totalBeats).toBe(16);
    expect(pattern.events).toHaveLength(exercise.notes.length);
    expect(pattern.events[0].beat).toBe(0);
    expect(pattern.events.every((event) => event.notes.length === 1 && event.beats > 0)).toBe(
      true,
    );
  });
});

describe('sight-reading grading', () => {
  const exercise = generateSightReading('treble-steps', seeded(3));

  it('accepts the exact pitches in order, at any octave', () => {
    expect(checkSightReading(exercise, exercise.notes.map((note) => note.midi)).correct).toBe(true);
    expect(
      checkSightReading(
        exercise,
        exercise.notes.map((note) => note.midi + 12),
      ).correct,
    ).toBe(true);
  });

  it('rejects a wrong pitch, a wrong order, and extra notes', () => {
    const target = exercise.notes.map((note) => note.midi);
    const wrongPitch = [...target];
    wrongPitch[1] = target[1] + 1;
    expect(checkSightReading(exercise, wrongPitch).correct).toBe(false);

    const swapped = [...target];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    expect(checkSightReading(exercise, swapped).correct).toBe(false);
    expect(checkSightReading(exercise, [...target, target[0]]).correct).toBe(false);
  });

  it('reports which notes matched', () => {
    const played = exercise.notes.map((note) => note.midi);
    played[2] += 1;
    const result = checkSightReading(exercise, played);
    expect(result.matched).toHaveLength(exercise.notes.length);
    expect(result.matched[2]).toBe(false);
    expect(result.matched.filter(Boolean)).toHaveLength(exercise.notes.length - 1);
    expect(result.played).toBe(exercise.notes.length);
  });
});
