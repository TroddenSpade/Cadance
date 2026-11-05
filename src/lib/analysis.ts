import { chordByName, pitchClass } from './music';
import { chordPattern, type PlayAlongPattern } from './playAlong';

export type ChordFunction = 'tonic' | 'predominant' | 'dominant' | 'colour';

export type CadenceId = 'authentic' | 'plagal' | 'deceptive' | 'half' | 'none';

export interface AnalysisChord {
  /** Roman numeral in the key, including sevenths and applied chords. */
  roman: string;
  /** Absolute chord symbol for the exemplar key. */
  symbol: string;
  /** A CHORDS name from src/lib/music.ts. */
  quality: string;
  /** Semitones above the tonic. */
  offset: number;
  func: ChordFunction;
}

export interface AnalysisProgression {
  id: string;
  title: string;
  blurb: string;
  keyLabel: string;
  tonicPc: number;
  mode: 'major' | 'minor';
  chords: AnalysisChord[];
  /** Curriculum lessons that explain the harmony in this example. */
  lessonIds: string[];
}

const chord = (
  roman: string,
  symbol: string,
  quality: string,
  offset: number,
  func: ChordFunction,
): AnalysisChord => ({ roman, symbol, quality, offset, func });

export const ANALYSIS_PROGRESSIONS: AnalysisProgression[] = [
  {
    id: 'classical-period',
    title: 'The classical period',
    blurb:
      'A four-bar sentence closes with a dominant seventh pulling hard into the tonic. The oldest cadence in the book, and still the clearest.',
    keyLabel: 'C major',
    tonicPc: 0,
    mode: 'major',
    lessonIds: ['cadences-ii-v-i', 'phrase-period-form'],
    chords: [
      chord('I', 'C', 'Major', 0, 'tonic'),
      chord('IV', 'F', 'Major', 5, 'predominant'),
      chord('V7', 'G7', 'Dominant 7th', 7, 'dominant'),
      chord('I', 'C', 'Major', 0, 'tonic'),
    ],
  },
  {
    id: 'deceptive-resolution',
    title: 'The deceptive turn',
    blurb:
      'The dominant arrives and the ear expects tonic, but the phrase slips to the relative minor. The tension is prolonged, not released.',
    keyLabel: 'C major',
    tonicPc: 0,
    mode: 'major',
    lessonIds: ['diatonic-functions', 'cadences-ii-v-i'],
    chords: [
      chord('I', 'C', 'Major', 0, 'tonic'),
      chord('vi', 'Am', 'Minor', 9, 'tonic'),
      chord('IV', 'F', 'Major', 5, 'predominant'),
      chord('V', 'G', 'Major', 7, 'dominant'),
      chord('vi', 'Am', 'Minor', 9, 'tonic'),
    ],
  },
  {
    id: 'half-cadence',
    title: 'Hanging on the dominant',
    blurb:
      'This phrase stops on V instead of resolving. A half cadence leaves the sentence open so the next phrase can answer it.',
    keyLabel: 'C major',
    tonicPc: 0,
    mode: 'major',
    lessonIds: ['cadences-ii-v-i', 'phrase-period-form'],
    chords: [
      chord('I', 'C', 'Major', 0, 'tonic'),
      chord('vi', 'Am', 'Minor', 9, 'tonic'),
      chord('ii', 'Dm', 'Minor', 2, 'predominant'),
      chord('V', 'G', 'Major', 7, 'dominant'),
    ],
  },
  {
    id: 'plagal-amen',
    title: 'The plagal amen',
    blurb:
      'IV to I without a leading tone. Softer than V–I, and the sound of countless hymns and folk songs.',
    keyLabel: 'F major',
    tonicPc: 5,
    mode: 'major',
    lessonIds: ['diatonic-functions', 'phrase-period-form'],
    chords: [
      chord('I', 'F', 'Major', 0, 'tonic'),
      chord('vi', 'Dm', 'Minor', 9, 'tonic'),
      chord('IV', 'B♭', 'Major', 5, 'predominant'),
      chord('I', 'F', 'Major', 0, 'tonic'),
    ],
  },
  {
    id: 'two-five-one',
    title: 'ii–V–I, the engine',
    blurb:
      'Predominant, dominant, tonic. Sevenths make every step of the motion explicit, which is why jazz standards lean on it.',
    keyLabel: 'C major',
    tonicPc: 0,
    mode: 'major',
    lessonIds: ['cadences-ii-v-i', 'seventh-chords'],
    chords: [
      chord('ii7', 'Dm7', 'Minor 7th', 2, 'predominant'),
      chord('V7', 'G7', 'Dominant 7th', 7, 'dominant'),
      chord('Imaj7', 'Cmaj7', 'Major 7th', 0, 'tonic'),
      chord('Imaj7', 'Cmaj7', 'Major 7th', 0, 'tonic'),
    ],
  },
  {
    id: 'minor-lament',
    title: 'Minor with a raised dominant',
    blurb:
      'In A minor the dominant is E7, not Em. The raised third, G♯, is the leading tone that makes the final resolution feel inevitable.',
    keyLabel: 'A minor',
    tonicPc: 9,
    mode: 'minor',
    lessonIds: ['minor-progressions', 'harmonic-melodic-minor'],
    chords: [
      chord('i', 'Am', 'Minor', 0, 'tonic'),
      chord('iv', 'Dm', 'Minor', 5, 'predominant'),
      chord('V7', 'E7', 'Dominant 7th', 7, 'dominant'),
      chord('i', 'Am', 'Minor', 0, 'tonic'),
    ],
  },
  {
    id: 'secondary-dominant',
    title: 'A dominant inside the key',
    blurb:
      'D7 is not diatonic to C major. It is V of G, a secondary dominant that briefly makes the dominant feel like home.',
    keyLabel: 'C major',
    tonicPc: 0,
    mode: 'major',
    lessonIds: ['secondary-dominants', 'chord-progression-recognition'],
    chords: [
      chord('I', 'C', 'Major', 0, 'tonic'),
      chord('V/V', 'D7', 'Dominant 7th', 2, 'dominant'),
      chord('V7', 'G7', 'Dominant 7th', 7, 'dominant'),
      chord('I', 'C', 'Major', 0, 'tonic'),
    ],
  },
  {
    id: 'modal-rock',
    title: 'A modal loop',
    blurb:
      'A flat-seven chord keeps the loop from behaving like functional harmony. It is colour first, cadence second — and a staple of rock.',
    keyLabel: 'G major',
    tonicPc: 7,
    mode: 'major',
    lessonIds: ['seven-modes', 'modal-ear'],
    chords: [
      chord('I', 'G', 'Major', 0, 'tonic'),
      chord('♭VII', 'F', 'Major', 10, 'colour'),
      chord('IV', 'C', 'Major', 5, 'predominant'),
      chord('I', 'G', 'Major', 0, 'tonic'),
    ],
  },
];

export const ANALYSIS_MAP: Record<string, AnalysisProgression> = Object.fromEntries(
  ANALYSIS_PROGRESSIONS.map((progression) => [progression.id, progression]),
);

export const CADENCES: CadenceId[] = ['authentic', 'plagal', 'deceptive', 'half'];

/** Strip sevenths, applied-chord slashes, and case so cadence rules stay simple. */
export function normalizeRoman(roman: string): string {
  return roman
    .replace(/\/.*$/, '')
    .replace(/(maj|dim|aug|ø|°)?\d+$/i, '')
    .replace(/[^ivIV♭♯]/g, '');
}

/**
 * Name the cadence formed by the final two chords. A phrase that ends on V is a
 * half cadence; a phrase that ends on vi after V is deceptive.
 */
export function detectCadence(romans: string[]): CadenceId {
  if (romans.length < 2) return 'none';
  const normalized = romans.map(normalizeRoman);
  const last = normalized[normalized.length - 1];
  const tonic = last === 'I' || last === 'i';
  if (tonic) {
    // A tonic chord may be held for more than one bar after the resolution, so
    // look back to the last chord that is not tonic: ii–V–Imaj7–Imaj7 still
    // closes with an authentic cadence.
    const previous = [...normalized.slice(0, -1)]
      .reverse()
      .find((roman) => roman !== 'I' && roman !== 'i');
    if (previous === 'V' || previous === 'v') return 'authentic';
    if (previous === 'IV' || previous === 'iv') return 'plagal';
    return 'none';
  }
  const previous = normalized[normalized.length - 2];
  if ((previous === 'V' || previous === 'v') && (last === 'vi' || last === 'VI')) {
    return 'deceptive';
  }
  if (last === 'V' || last === 'v') return 'half';
  return 'none';
}

/** Chord MIDI stacks for playback, voiced around middle C. */
export function progressionChords(progression: AnalysisProgression): number[][] {
  return progression.chords.map((item) => {
    const root = 60 + ((progression.tonicPc + item.offset) % 12);
    const intervals = chordByName(item.quality).intervals;
    return intervals.map((interval) => root + interval);
  });
}

export function progressionPattern(progression: AnalysisProgression): PlayAlongPattern {
  return chordPattern(progressionChords(progression), 4, 4);
}

export function progressionPitchClasses(progression: AnalysisProgression): number[] {
  return [
    ...new Set(
      progression.chords.flatMap((item) =>
        chordByName(item.quality).intervals.map((interval) =>
          pitchClass(progression.tonicPc + item.offset + interval),
        ),
      ),
    ),
  ].sort((a, b) => a - b);
}
