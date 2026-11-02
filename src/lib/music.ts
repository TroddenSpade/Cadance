export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export type Letter = (typeof LETTERS)[number];

export const LETTER_SEMITONES: Record<Letter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

export const ACCIDENTAL_SYMBOL: Record<number, string> = {
  [-2]: '𝄫',
  [-1]: '♭',
  0: '',
  1: '♯',
  2: '𝄪',
};

export type Accidental = -1 | 0 | 1;

export interface SpelledPitch {
  letter: Letter;
  accidental: number;
}

export function spelledPitchClass(pitch: SpelledPitch): number {
  return ((LETTER_SEMITONES[pitch.letter] + pitch.accidental) % 12 + 12) % 12;
}

export function spelledPitchName(pitch: SpelledPitch): string {
  return `${pitch.letter}${ACCIDENTAL_SYMBOL[pitch.accidental] ?? ''}`;
}

/** Spell the note a given diatonic and chromatic distance above a root. */
export function spellFromRoot(root: SpelledPitch, letterSteps: number, semitones: number): SpelledPitch {
  const rootIndex = LETTERS.indexOf(root.letter);
  const letter = LETTERS[(rootIndex + letterSteps) % 7];
  const targetClass = (spelledPitchClass(root) + semitones) % 12;
  let accidental = targetClass - LETTER_SEMITONES[letter];
  accidental = ((accidental % 12) + 12) % 12;
  if (accidental > 6) accidental -= 12;
  return { letter, accidental };
}

const PREFERRED_ROOT_SPELLINGS: SpelledPitch[] = [
  { letter: 'C', accidental: 0 },
  { letter: 'D', accidental: -1 },
  { letter: 'D', accidental: 0 },
  { letter: 'E', accidental: -1 },
  { letter: 'E', accidental: 0 },
  { letter: 'F', accidental: 0 },
  { letter: 'F', accidental: 1 },
  { letter: 'G', accidental: 0 },
  { letter: 'A', accidental: -1 },
  { letter: 'A', accidental: 0 },
  { letter: 'B', accidental: -1 },
  { letter: 'B', accidental: 0 },
];

/** The most readable spelling for a pitch class in a beginner-friendly key. */
export function preferredRootSpelling(pitchClass: number): SpelledPitch {
  return PREFERRED_ROOT_SPELLINGS[((pitchClass % 12) + 12) % 12];
}

/**
 * Practical spellings for a pitch class. Black keys have two common names;
 * generators try both so a mode or scale is not forced into double accidentals.
 */
export function commonRootSpellings(pitchClass: number): SpelledPitch[] {
  const pc = ((pitchClass % 12) + 12) % 12;
  const alternateNames: Record<number, SpelledPitch> = {
    1: { letter: 'C', accidental: 1 },
    3: { letter: 'D', accidental: 1 },
    6: { letter: 'G', accidental: -1 },
    8: { letter: 'G', accidental: 1 },
    10: { letter: 'A', accidental: 1 },
  };
  const preferred = preferredRootSpelling(pc);
  const alternate = alternateNames[pc];
  if (!alternate || (alternate.letter === preferred.letter && alternate.accidental === preferred.accidental)) {
    return [preferred];
  }
  return [preferred, alternate];
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function pitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12;
}

export function octaveOf(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function midiToName(midi: number, preferFlats = false): string {
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[pitchClass(midi)];
}

export function midiToFullName(midi: number, preferFlats = false): string {
  return `${midiToName(midi, preferFlats)}${octaveOf(midi)}`;
}

export function spelledToMidi(letter: Letter, accidental: Accidental, octave: number): number {
  return (octave + 1) * 12 + LETTER_SEMITONES[letter] + accidental;
}

export function spelledName(letter: Letter, accidental: Accidental): string {
  return `${letter}${ACCIDENTAL_SYMBOL[accidental]}`;
}

export function spelledFullName(letter: Letter, accidental: Accidental, octave: number): string {
  return `${spelledName(letter, accidental)}${octave}`;
}

/** Diatonic staff position (0 = C-1) used for vertical placement on a staff. */
export function diatonicStep(letter: Letter, octave: number): number {
  return octave * 7 + LETTERS.indexOf(letter);
}

export function isBlackKey(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(pitchClass(midi));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface IntervalDef {
  semitones: number;
  name: string;
  short: string;
}

export const INTERVALS: IntervalDef[] = [
  { semitones: 0, name: 'Unison', short: 'P1' },
  { semitones: 1, name: 'Minor 2nd', short: 'm2' },
  { semitones: 2, name: 'Major 2nd', short: 'M2' },
  { semitones: 3, name: 'Minor 3rd', short: 'm3' },
  { semitones: 4, name: 'Major 3rd', short: 'M3' },
  { semitones: 5, name: 'Perfect 4th', short: 'P4' },
  { semitones: 6, name: 'Tritone', short: 'TT' },
  { semitones: 7, name: 'Perfect 5th', short: 'P5' },
  { semitones: 8, name: 'Minor 6th', short: 'm6' },
  { semitones: 9, name: 'Major 6th', short: 'M6' },
  { semitones: 10, name: 'Minor 7th', short: 'm7' },
  { semitones: 11, name: 'Major 7th', short: 'M7' },
  { semitones: 12, name: 'Octave', short: 'P8' },
];

export function intervalBySemitones(semitones: number): IntervalDef {
  const exact = INTERVALS.find((i) => i.semitones === semitones);
  if (exact) return exact;
  const pitchClass = ((semitones % 12) + 12) % 12;
  return INTERVALS.find((i) => i.semitones === pitchClass) ?? INTERVALS[0];
}

/**
 * Intervals as they are actually spelled on the staff. Unlike the listening
 * pool, this distinguishes enharmonic spellings such as A4 and d5.
 */
export interface WrittenIntervalDef {
  semitones: number;
  /** Diatonic size: 1 = unison, 2 = second, ... 8 = octave. */
  number: number;
  name: string;
  short: string;
}

export const WRITTEN_INTERVALS: WrittenIntervalDef[] = [
  { semitones: 1, number: 2, name: 'Minor 2nd', short: 'm2' },
  { semitones: 2, number: 2, name: 'Major 2nd', short: 'M2' },
  { semitones: 3, number: 2, name: 'Augmented 2nd', short: 'A2' },
  { semitones: 3, number: 3, name: 'Minor 3rd', short: 'm3' },
  { semitones: 4, number: 3, name: 'Major 3rd', short: 'M3' },
  { semitones: 4, number: 4, name: 'Diminished 4th', short: 'd4' },
  { semitones: 5, number: 4, name: 'Perfect 4th', short: 'P4' },
  { semitones: 6, number: 4, name: 'Augmented 4th', short: 'A4' },
  { semitones: 6, number: 5, name: 'Diminished 5th', short: 'd5' },
  { semitones: 7, number: 5, name: 'Perfect 5th', short: 'P5' },
  { semitones: 8, number: 5, name: 'Augmented 5th', short: 'A5' },
  { semitones: 8, number: 6, name: 'Minor 6th', short: 'm6' },
  { semitones: 9, number: 6, name: 'Major 6th', short: 'M6' },
  { semitones: 10, number: 6, name: 'Augmented 6th', short: 'A6' },
  { semitones: 9, number: 7, name: 'Diminished 7th', short: 'd7' },
  { semitones: 10, number: 7, name: 'Minor 7th', short: 'm7' },
  { semitones: 11, number: 7, name: 'Major 7th', short: 'M7' },
  { semitones: 12, number: 8, name: 'Octave', short: 'P8' },
];

export interface ChordDef {
  name: string;
  symbol: string;
  intervals: number[];
  /** Diatonic steps above the root for each chord tone. */
  letterSteps: number[];
}

export const CHORDS: ChordDef[] = [
  { name: 'Major', symbol: '', intervals: [0, 4, 7], letterSteps: [0, 2, 4] },
  { name: 'Minor', symbol: 'm', intervals: [0, 3, 7], letterSteps: [0, 2, 4] },
  { name: 'Diminished', symbol: '°', intervals: [0, 3, 6], letterSteps: [0, 2, 4] },
  { name: 'Augmented', symbol: '+', intervals: [0, 4, 8], letterSteps: [0, 2, 4] },
  { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11], letterSteps: [0, 2, 4, 6] },
  { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], letterSteps: [0, 2, 4, 6] },
  { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], letterSteps: [0, 2, 4, 6] },
  { name: 'Half-diminished 7th', symbol: 'ø7', intervals: [0, 3, 6, 10], letterSteps: [0, 2, 4, 6] },
  { name: 'Diminished 7th', symbol: '°7', intervals: [0, 3, 6, 9], letterSteps: [0, 2, 4, 6] },
  { name: 'Sus2', symbol: 'sus2', intervals: [0, 2, 7], letterSteps: [0, 1, 4] },
  { name: 'Sus4', symbol: 'sus4', intervals: [0, 5, 7], letterSteps: [0, 3, 4] },
  { name: 'Major 6th', symbol: '6', intervals: [0, 4, 7, 9], letterSteps: [0, 2, 4, 5] },
  { name: 'Minor 6th', symbol: 'm6', intervals: [0, 3, 7, 9], letterSteps: [0, 2, 4, 5] },
];

export function chordByName(name: string): ChordDef {
  return CHORDS.find((c) => c.name === name) ?? CHORDS[0];
}

export type ScaleName =
  | 'Major'
  | 'Natural minor'
  | 'Harmonic minor'
  | 'Melodic minor'
  | 'Dorian'
  | 'Phrygian'
  | 'Lydian'
  | 'Mixolydian'
  | 'Locrian';

export interface ScaleDef {
  name: ScaleName;
  intervals: number[];
  degrees: string[];
}

export const SCALES: ScaleDef[] = [
  {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degrees: ['1', '2', '3', '4', '5', '6', '7'],
  },
  {
    name: 'Natural minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degrees: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
  },
  {
    name: 'Harmonic minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    degrees: ['1', '2', '♭3', '4', '5', '♭6', '7'],
  },
  {
    name: 'Melodic minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    degrees: ['1', '2', '♭3', '4', '5', '6', '7'],
  },
  {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    degrees: ['1', '2', '♭3', '4', '5', '6', '♭7'],
  },
  {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    degrees: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'],
  },
  {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    degrees: ['1', '2', '3', '♯4', '5', '6', '7'],
  },
  {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    degrees: ['1', '2', '3', '4', '5', '6', '♭7'],
  },
  {
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    degrees: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'],
  },
];

export function scaleByName(name: ScaleName): ScaleDef {
  return SCALES.find((s) => s.name === name) ?? SCALES[0];
}

export type KeySignatureKind = 'sharp' | 'flat';

export interface KeySignature {
  major: string;
  minor: string;
  count: number;
  type: KeySignatureKind | 'none';
}

export const KEY_SIGNATURES: KeySignature[] = [
  { major: 'C', minor: 'Am', count: 0, type: 'none' },
  { major: 'G', minor: 'Em', count: 1, type: 'sharp' },
  { major: 'D', minor: 'Bm', count: 2, type: 'sharp' },
  { major: 'A', minor: 'F♯m', count: 3, type: 'sharp' },
  { major: 'E', minor: 'C♯m', count: 4, type: 'sharp' },
  { major: 'B', minor: 'G♯m', count: 5, type: 'sharp' },
  { major: 'F♯', minor: 'D♯m', count: 6, type: 'sharp' },
  { major: 'C♯', minor: 'A♯m', count: 7, type: 'sharp' },
  { major: 'F', minor: 'Dm', count: 1, type: 'flat' },
  { major: 'B♭', minor: 'Gm', count: 2, type: 'flat' },
  { major: 'E♭', minor: 'Cm', count: 3, type: 'flat' },
  { major: 'A♭', minor: 'Fm', count: 4, type: 'flat' },
  { major: 'D♭', minor: 'B♭m', count: 5, type: 'flat' },
  { major: 'G♭', minor: 'E♭m', count: 6, type: 'flat' },
  { major: 'C♭', minor: 'A♭m', count: 7, type: 'flat' },
];

/** Sharps/flats appear in this fixed order. */
export const SHARP_ORDER: Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER: Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

/** Octave used for each accidental when drawing a key signature. */
export const KEY_SIG_POSITIONS: Record<'treble' | 'bass', Record<KeySignatureKind, Array<[Letter, number]>>> = {
  treble: {
    sharp: [
      ['F', 5],
      ['C', 5],
      ['G', 5],
      ['D', 5],
      ['A', 4],
      ['E', 5],
      ['B', 4],
    ],
    flat: [
      ['B', 4],
      ['E', 5],
      ['A', 4],
      ['D', 5],
      ['G', 4],
      ['C', 5],
      ['F', 4],
    ],
  },
  bass: {
    sharp: [
      ['F', 3],
      ['C', 3],
      ['G', 3],
      ['D', 3],
      ['A', 2],
      ['E', 3],
      ['B', 2],
    ],
    flat: [
      ['B', 2],
      ['E', 3],
      ['A', 2],
      ['D', 3],
      ['G', 2],
      ['C', 3],
      ['F', 3],
    ],
  },
};

/** Diatonic triads in a major key (scale degrees 1–7). */
export const MAJOR_TRIADS = [
  { roman: 'I', quality: 'Major', degree: 0 },
  { roman: 'ii', quality: 'Minor', degree: 1 },
  { roman: 'iii', quality: 'Minor', degree: 2 },
  { roman: 'IV', quality: 'Major', degree: 3 },
  { roman: 'V', quality: 'Major', degree: 4 },
  { roman: 'vi', quality: 'Minor', degree: 5 },
  { roman: 'vii°', quality: 'Diminished', degree: 6 },
];

/** Semitone offsets of a major scale. */
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

export const ROMAN_DEGREES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const SCALE_DEGREE_NAMES = [
  'Tonic (1st)',
  'Supertonic (2nd)',
  'Mediant (3rd)',
  'Subdominant (4th)',
  'Dominant (5th)',
  'Submediant (6th)',
  'Leading tone (7th)',
];

export function keySignatureLabel(key: KeySignature): string {
  if (key.count === 0) return 'no sharps or flats';
  return `${key.count} ${key.count === 1 ? key.type : key.type + 's'}`;
}

export function randomItem<T>(items: T[], rng: () => number = Math.random): T {
  return items[Math.floor(rng() * items.length)];
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sample<T>(items: T[], count: number, rng: () => number = Math.random): T[] {
  return shuffle(items, rng).slice(0, count);
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** Represents one beat of a rhythm pattern. */
export interface RhythmItem {
  beats: number;
  dotted?: boolean;
  rest?: boolean;
}
