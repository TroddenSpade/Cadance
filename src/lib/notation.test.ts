import { describe, expect, it } from 'vitest';
import { STANDARD_GUITAR_TUNING, autoGuitarPosition, spellMidi } from './notation';

describe('pitch spelling', () => {
  it('spells natural notes with the right octave', () => {
    expect(spellMidi(60)).toEqual({ letter: 'C', accidental: 0, octave: 4 });
    expect(spellMidi(69)).toEqual({ letter: 'A', accidental: 0, octave: 4 });
    expect(spellMidi(71)).toEqual({ letter: 'B', accidental: 0, octave: 4 });
  });

  it('uses sharps by default and flats on request', () => {
    expect(spellMidi(61)).toEqual({ letter: 'C', accidental: 1, octave: 4 });
    expect(spellMidi(61, true)).toEqual({ letter: 'D', accidental: -1, octave: 4 });
    expect(spellMidi(70, true)).toEqual({ letter: 'B', accidental: -1, octave: 4 });
  });

  it('keeps enharmonic spellings inside a single accidental', () => {
    for (let midi = 21; midi <= 108; midi += 1) {
      const sharp = spellMidi(midi);
      const flat = spellMidi(midi, true);
      expect([-1, 0, 1]).toContain(sharp.accidental);
      expect([-1, 0, 1]).toContain(flat.accidental);
    }
  });
});

describe('guitar positions', () => {
  it('knows the standard tuning from high string to low string', () => {
    expect(STANDARD_GUITAR_TUNING).toEqual([64, 59, 55, 50, 45, 40]);
  });

  it('finds the closest first-position fingering', () => {
    expect(autoGuitarPosition(64)).toEqual({ string: 0, fret: 0 });
    expect(autoGuitarPosition(60)).toEqual({ string: 1, fret: 1 });
    expect(autoGuitarPosition(40)).toEqual({ string: 5, fret: 0 });
    expect(autoGuitarPosition(65)).toEqual({ string: 0, fret: 1 });
  });

  it('honours alternate tunings', () => {
    const dropD = [64, 59, 55, 50, 45, 38];
    expect(autoGuitarPosition(64, dropD)).toEqual({ string: 0, fret: 0 });
    expect(autoGuitarPosition(38, dropD)).toEqual({ string: 5, fret: 0 });
  });

  it('returns null when a pitch is out of range', () => {
    expect(autoGuitarPosition(20)).toBeNull();
    expect(autoGuitarPosition(100)).toBeNull();
  });

  it('can search higher frets for a melody note', () => {
    expect(autoGuitarPosition(72)).toBeNull();
    expect(autoGuitarPosition(72, STANDARD_GUITAR_TUNING, 12)).toEqual({ string: 0, fret: 8 });
  });
});
