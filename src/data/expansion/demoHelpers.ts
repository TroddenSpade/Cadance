import type { RhythmItem } from '../../lib/music';
import type { GuitarSpot, InstrumentDemoSpec } from '../../lib/types';

export interface ExpansionDemo {
  afterSection: number;
  spec: InstrumentDemoSpec;
}

const LETTER_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Parse a written note such as C4, F♯3, or B♭4 into MIDI. */
export function note(name: string): number {
  const match = /^([A-G])([♯#♭b]?)(-?\d+)$/.exec(name.trim());
  if (!match) throw new Error(`Cannot parse note: ${name}`);
  const [, letter, accidental, octave] = match;
  const offset = accidental === '♯' || accidental === '#' ? 1 : accidental === '♭' || accidental === 'b' ? -1 : 0;
  return 12 * (Number(octave) + 1) + LETTER_SEMITONES[letter] + offset;
}

/** Read a space-separated list of notes: `N('C4 E4 G4')`. */
export const N = (names: string): number[] => names.trim().split(/\s+/).map(note);

/** Guitar shape from low E to high E. `x` mutes a string. */
export function shape(values: string): GuitarSpot[] {
  const tokens = values.trim().split(/\s+/);
  if (tokens.length !== 6) throw new Error(`Guitar shape needs six strings: ${values}`);
  return tokens.flatMap((token, index) => {
    if (token === 'x' || token === '-') return [];
    const fret = Number(token);
    if (!Number.isInteger(fret) || fret < 0 || fret > 12) {
      throw new Error(`Guitar fret out of range: ${token}`);
    }
    return [{ string: 5 - index, fret }];
  });
}

/** Explicit [string, fret] pairs. String 0 is high E. */
export const spots = (...pairs: Array<[number, number]>): GuitarSpot[] =>
  pairs.map(([string, fret]) => ({ string, fret }));

const rhythm = (...beats: number[]): RhythmItem[] =>
  beats.map((value) => ({
    beats: Math.abs(value),
    dotted: Math.abs(value) === 1.5 || Math.abs(value) === 3,
    rest: value < 0,
  }));

export const line = (
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'sequence', ...extra });

export const chord = (
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'chord', ...extra });

export const progression = (
  chords: number[][],
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'sequence', chords, ...extra });

export const pulse = (
  items: RhythmItem[],
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, rhythm: items, ...extra });

/** Build a rhythmic demo from beat values; negative values are rests. */
export const rhythmSpec = (
  beats: number[],
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => pulse(rhythm(...beats), notes, body, extra);

export const demo = (afterSection: number, spec: InstrumentDemoSpec): ExpansionDemo => ({
  afterSection,
  spec,
});
