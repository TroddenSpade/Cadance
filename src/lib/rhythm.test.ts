import { describe, expect, it } from 'vitest';
import {
  RHYTHM_LEVELS,
  clickOnlyPattern,
  generateRhythm,
  rhythmOnsets,
  scoreEcho,
} from './rhythm';

function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

describe('rhythm generation', () => {
  it('fills every bar and never starts with a rest', () => {
    for (const level of RHYTHM_LEVELS) {
      for (let seed = 1; seed <= 20; seed += 1) {
        const items = generateRhythm(level.id, 2, seeded(seed));
        const total = items.reduce((sum, item) => sum + Math.abs(item.beats), 0);
        expect(total, `${level.id} seed ${seed}`).toBe(8);
        expect(items[0].rest, `${level.id} starts with a rest`).toBe(false);
        expect(items.every((item) => item.beats > 0)).toBe(true);
        expect(items.filter((item) => item.rest).length).toBeLessThanOrEqual(4);

        for (let index = 1; index < items.length; index += 1) {
          expect(
            items[index].rest && items[index - 1].rest,
            `${level.id} has consecutive rests`,
          ).toBe(false);
        }
      }
    }
  });

  it('only uses the values allowed by the level', () => {
    for (const level of RHYTHM_LEVELS) {
      const items = generateRhythm(level.id, 3, seeded(9));
      for (const item of items) {
        expect(level.values).toContain(item.beats);
      }
    }
  });

  it('reports the onset of every sounding note', () => {
    expect(rhythmOnsets([{ beats: 1 }, { beats: 1, rest: true }, { beats: 2 }, { beats: 0.5 }])).toEqual([
      0, 2, 4,
    ]);
  });

  it('creates a silent pattern for the tap click track', () => {
    const pattern = clickOnlyPattern(8, 4);
    expect(pattern.totalBeats).toBe(8);
    expect(pattern.beatsPerBar).toBe(4);
    expect(pattern.events).toHaveLength(1);
    expect(pattern.events[0].notes).toEqual([]);
  });
});

describe('echo scoring', () => {
  const items = [{ beats: 1 }, { beats: 1 }, { beats: 1 }, { beats: 1 }];
  const beatSeconds = 0.6;

  it('scores a perfectly spaced echo at 100%', () => {
    const score = scoreEcho(items, [0, 600, 1200, 1800], beatSeconds);
    expect(score.accuracy).toBe(1);
    expect(score.matched).toBe(4);
    expect(score.total).toBe(4);
    expect(score.extra).toBe(0);
    expect(score.meanErrorMs).toBe(0);
    expect(score.notes.every((note) => note.errorMs !== null)).toBe(true);
  });

  it('tolerates small timing errors inside the window', () => {
    const score = scoreEcho(items, [0, 640, 1170, 1870], beatSeconds);
    expect(score.accuracy).toBe(1);
    expect(score.meanErrorMs).toBeGreaterThan(0);
    expect(score.meanErrorMs).toBeLessThanOrEqual(70);
  });

  it('penalises missing and extra taps', () => {
    const missing = scoreEcho(items, [0, 600, 1200], beatSeconds);
    expect(missing.matched).toBe(3);
    expect(missing.accuracy).toBe(0.75);

    const extra = scoreEcho(items, [0, 300, 600, 1200, 1800], beatSeconds);
    expect(extra.matched).toBe(4);
    expect(extra.extra).toBe(1);
    expect(extra.accuracy).toBe(0.8);
  });

  it('rejects taps outside the tolerance window', () => {
    const score = scoreEcho(items, [0, 1000, 2000, 3000], beatSeconds);
    expect(score.matched).toBeLessThan(4);
    expect(score.accuracy).toBeLessThan(1);
  });

  it('measures onsets relative to the first tap, not absolute time', () => {
    const shifted = scoreEcho(items, [5000, 5600, 6200, 6800], beatSeconds);
    expect(shifted.accuracy).toBe(1);
    expect(shifted.notes[0].beat).toBe(0);
  });

  it('handles an empty performance without dividing by zero', () => {
    const score = scoreEcho(items, [], beatSeconds);
    expect(score.accuracy).toBe(0);
    expect(score.matched).toBe(0);
    expect(score.meanErrorMs).toBe(0);
  });
});
