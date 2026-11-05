import { describe, expect, it } from 'vitest';
import { ALL_LESSONS } from './curriculum';
import {
  OPEN_CHORDS,
  REPERTOIRE,
  REPERTOIRE_LEVELS,
  REPERTOIRE_MAP,
  piecesAfterLesson,
  type RepertoirePiece,
} from './repertoire';
import { STANDARD_GUITAR_TUNING } from '../lib/notation';
import { midiToFrequency } from '../lib/music';

function totalBeats(piece: RepertoirePiece): number {
  return piece.notes.reduce((sum, note) => sum + note.beats, 0);
}

const lessonIds = new Set(ALL_LESSONS.map((lesson) => lesson.id));
const levels = new Set(REPERTOIRE_LEVELS.map((level) => level.id));

describe('repertoire data', () => {
  it('uses unique ids and exposes a lookup map', () => {
    const ids = REPERTOIRE.map((piece) => piece.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(REPERTOIRE_MAP)).toHaveLength(REPERTOIRE.length);
    for (const piece of REPERTOIRE) {
      expect(REPERTOIRE_MAP[piece.id]).toBe(piece);
    }
  });

  it('links every piece to a real lesson and a known level', () => {
    for (const piece of REPERTOIRE) {
      expect(lessonIds.has(piece.afterLesson), `${piece.id} links to ${piece.afterLesson}`).toBe(
        true,
      );
      expect(levels.has(piece.level), `${piece.id} has level ${piece.level}`).toBe(true);
    }
  });

  it('fills whole bars with positive durations', () => {
    for (const piece of REPERTOIRE) {
      expect(piece.notes.length, `${piece.id} has no notes`).toBeGreaterThan(8);
      expect(piece.time[0], `${piece.id} beats per bar`).toBe(piece.beatsPerBar);
      expect(piece.beatsPerBar).toBeGreaterThan(0);
      expect(piece.notes.every((note) => note.beats > 0), `${piece.id} has a zero duration`).toBe(
        true,
      );
      expect(totalBeats(piece) % piece.beatsPerBar, `${piece.id} leaves a partial bar`).toBe(0);
    }
  });

  it('keeps every note in range and playable in the first twelve frets', () => {
    for (const piece of REPERTOIRE) {
      for (const note of piece.notes) {
        expect(note.midi, `${piece.id} note`).toBeGreaterThanOrEqual(21);
        expect(note.midi, `${piece.id} note`).toBeLessThanOrEqual(108);
        expect(Number.isFinite(midiToFrequency(note.midi))).toBe(true);

        const playable = STANDARD_GUITAR_TUNING.some((open) => {
          const fret = note.midi - open;
          return fret >= 0 && fret <= 12;
        });
        expect(playable, `${piece.id} has no guitar position for MIDI ${note.midi}`).toBe(true);
      }
    }
  });

  it('declares valid key and time signatures', () => {
    for (const piece of REPERTOIRE) {
      expect(['treble', 'bass']).toContain(piece.clef);
      expect(piece.bpm).toBeGreaterThanOrEqual(40);
      expect(piece.bpm).toBeLessThanOrEqual(220);
      if (piece.keySig) {
        expect(piece.keySig.count).toBeGreaterThanOrEqual(1);
        expect(piece.keySig.count).toBeLessThanOrEqual(7);
        expect(['sharp', 'flat']).toContain(piece.keySig.type);
      }
    }
  });

  it('reuses valid six-string chord shapes for accompaniment', () => {
    for (const piece of REPERTOIRE) {
      for (const chord of piece.chords ?? []) {
        expect(OPEN_CHORDS[chord.name], `${piece.id} uses unknown chord ${chord.name}`).toBe(chord);
        expect(chord.frets).toHaveLength(6);
        expect(chord.fingers ?? []).toHaveLength(chord.fingers ? 6 : 0);
        for (const fret of chord.frets) {
          expect(fret === null || (fret >= 0 && fret <= 16)).toBe(true);
        }
        for (const finger of chord.fingers ?? []) {
          expect(finger === null || (finger >= 1 && finger <= 4)).toBe(true);
        }
      }
    }
  });

  it('groups pieces by the lesson that prepares them', () => {
    expect(piecesAfterLesson('treble-clef-reading').map((piece) => piece.id)).toContain(
      'ode-to-joy',
    );
    expect(piecesAfterLesson('not-a-lesson')).toEqual([]);
  });
});
