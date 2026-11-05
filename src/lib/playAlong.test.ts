import { describe, expect, it } from 'vitest';
import {
  MAX_PLAY_ALONG_BPM,
  MIN_PLAY_ALONG_BPM,
  bpmFromSecondsPerBeat,
  chordPattern,
  clampPlayAlongBpm,
  demoBpm,
  patternFromDemo,
  rhythmPattern,
  sequencePattern,
} from './playAlong';

describe('play-along tempo helpers', () => {
  it('clamps and rounds beats per minute', () => {
    expect(clampPlayAlongBpm(72.4)).toBe(72);
    expect(clampPlayAlongBpm(10)).toBe(MIN_PLAY_ALONG_BPM);
    expect(clampPlayAlongBpm(500)).toBe(MAX_PLAY_ALONG_BPM);
    expect(clampPlayAlongBpm(Number.NaN)).toBe(72);
    expect(clampPlayAlongBpm(Number.POSITIVE_INFINITY)).toBe(72);
  });

  it('converts a seconds-per-beat demo tempo into BPM', () => {
    expect(bpmFromSecondsPerBeat(0.5)).toBe(120);
    expect(bpmFromSecondsPerBeat(1)).toBe(60);
    expect(bpmFromSecondsPerBeat(0)).toBe(72);
    expect(bpmFromSecondsPerBeat(Number.NaN)).toBe(72);
  });
});

describe('play-along patterns', () => {
  it('spaces a pitch sequence one beat apart', () => {
    const pattern = sequencePattern([60, 64, 67], 4);

    expect(pattern.totalBeats).toBe(3);
    expect(pattern.beatsPerBar).toBe(4);
    expect(pattern.events.map((event) => event.beat)).toEqual([0, 1, 2]);
    expect(pattern.events.map((event) => event.notes)).toEqual([[60], [64], [67]]);
    expect(pattern.events.every((event) => event.beats > 0 && event.beats < 1)).toBe(true);
  });

  it('spaces chord changes by their duration', () => {
    const pattern = chordPattern(
      [
        [60, 64, 67],
        [65, 69, 72],
      ],
      4,
      4,
    );

    expect(pattern.totalBeats).toBe(8);
    expect(pattern.events.map((event) => event.beat)).toEqual([0, 4]);
    expect(pattern.events[1].notes).toEqual([65, 69, 72]);
    expect(pattern.events[0].beats).toBeGreaterThan(3);
    expect(pattern.events[0].beats).toBeLessThan(4);
  });

  it('skips rests but keeps the rhythmic cursor moving', () => {
    const pattern = rhythmPattern(
      [{ beats: 1 }, { beats: 1, rest: true }, { beats: 2 }, { beats: 0.5 }],
      84,
      4,
    );

    expect(pattern.events.map((event) => event.beat)).toEqual([0, 2, 4]);
    const durations = pattern.events.map((event) => event.beats);
    expect(durations[0]).toBeCloseTo(0.92, 5);
    expect(durations[1]).toBeCloseTo(1.84, 5);
    expect(durations[2]).toBeCloseTo(0.46, 5);
    expect(pattern.totalBeats).toBe(4.5);
  });

  it('never reports fewer beats than one bar', () => {
    const empty = rhythmPattern([{ beats: 1 }], 84, 4);
    expect(empty.totalBeats).toBe(4);
    expect(sequencePattern([], 3).totalBeats).toBe(1);
  });

  it('adapts each kind of lesson demonstration to the transport', () => {
    const rhythm = patternFromDemo({
      notes: [60],
      rhythm: [
        { beats: 1 },
        { beats: 1, rest: true },
        { beats: 2 },
      ],
    });
    expect(rhythm.totalBeats).toBe(4);
    expect(rhythm.events).toHaveLength(2);

    const progression = patternFromDemo({
      notes: [60, 64, 67],
      chords: [
        [60, 64, 67],
        [65, 69, 72],
      ],
    });
    expect(progression.totalBeats).toBe(2);
    expect(progression.events.map((event) => event.beat)).toEqual([0, 1]);

    const chord = patternFromDemo({ notes: [60, 64, 67], mode: 'chord' });
    expect(chord.events).toHaveLength(1);
    expect(chord.events[0].notes).toEqual([60, 64, 67]);

    const melody = patternFromDemo({ notes: [60, 62, 64] });
    expect(melody.events.map((event) => event.beat)).toEqual([0, 1, 2]);
  });

  it('derives a sensible starting tempo from a demo', () => {
    expect(demoBpm({ notes: [60], tempo: 0.5 })).toBe(120);
    expect(demoBpm({ notes: [60], mode: 'chord', tempo: 1 })).toBe(60);
    expect(demoBpm({ notes: [60], rhythm: [{ beats: 1 }] })).toBe(130);
    expect(demoBpm({ notes: [60], chords: [[60]] })).toBe(75);
    expect(demoBpm({ notes: [60] })).toBe(120);
  });
});
