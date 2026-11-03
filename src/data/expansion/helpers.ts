import type { Accidental, Letter, RhythmItem } from '../../lib/music';
import type { AudioSpec, ExerciseSpec, StaffNoteSpec, StaffSpec } from '../../lib/types';
import type { Lesson, LessonSection } from '../curriculum';

export const n = (letter: Letter, octave: number, accidental: Accidental = 0): StaffNoteSpec => ({
  letter,
  accidental,
  octave,
});

export const treble = (notes: StaffNoteSpec[], keySig?: StaffSpec['keySig']): StaffSpec => ({
  clef: 'treble',
  notes,
  keySig,
});

export const bass = (notes: StaffNoteSpec[], keySig?: StaffSpec['keySig']): StaffSpec => ({
  clef: 'bass',
  notes,
  keySig,
});

export const chordStaff = (clef: 'treble' | 'bass', notes: StaffNoteSpec[]): StaffSpec => ({
  clef,
  notes,
  chord: true,
});

export const seq = (midis: number[], tempo = 0.6): AudioSpec => ({ midis, mode: 'sequence', tempo });
export const block = (midis: number[]): AudioSpec => ({ midis, mode: 'chord' });
export const chordSeq = (items: number[][], tempo = 0.85): AudioSpec => ({
  chords: items,
  mode: 'chord',
  tempo,
});

export const rhythm = (...beats: number[]): { items: RhythmItem[] } => ({
  items: beats.map((value) => ({
    beats: Math.abs(value),
    dotted: Math.abs(value) === 1.5 || Math.abs(value) === 3,
    rest: value < 0,
  })),
});

export const noteReading = (
  count: number,
  skill: string,
  clef: 'treble' | 'bass' | 'both',
  accidentals = false,
): ExerciseSpec => ({
  kind: 'note-reading',
  count,
  skills: [skill],
  config: { clef, accidentals },
  label: clef === 'both' ? 'Grand staff reading' : `${clef === 'treble' ? 'Treble' : 'Bass'} clef reading`,
});

export const findNote = (count: number, skill: string, accidentals = false): ExerciseSpec => ({
  kind: 'find-note',
  count,
  skills: [skill],
  config: { accidentals },
  label: 'Find the note',
});

export const earIntervals = (count: number, skill: string, intervals: number[]): ExerciseSpec => ({
  kind: 'interval-ear',
  count,
  skills: [skill],
  config: { intervals, direction: 'mixed' },
  label: 'Interval ear training',
});

export const writtenIntervals = (count: number, skill: string, writtenIntervals?: string[]): ExerciseSpec => ({
  kind: 'interval-id',
  count,
  skills: [skill],
  config: writtenIntervals ? { writtenIntervals } : {},
  label: 'Written intervals',
});

export const earChords = (count: number, skill: string, qualities: string[]): ExerciseSpec => ({
  kind: 'chord-ear',
  count,
  skills: [skill],
  config: { qualities },
  label: 'Chord ear training',
});

export const buildChords = (count: number, qualities: string[], skill = 'chord-build-triads'): ExerciseSpec => ({
  kind: 'chord-build',
  count,
  skills: [skill],
  config: { qualities },
  label: 'Build chords',
});

export const inversions = (count: number, qualities: string[], skill = 'chord-inversion'): ExerciseSpec => ({
  kind: 'chord-inversion',
  count,
  skills: [skill],
  config: { qualities },
  label: 'Chord inversions',
});

export const buildScales = (
  count: number,
  skill: string,
  scales: Array<
    | 'Major'
    | 'Natural minor'
    | 'Harmonic minor'
    | 'Melodic minor'
    | 'Dorian'
    | 'Phrygian'
    | 'Lydian'
    | 'Mixolydian'
    | 'Locrian'
  >,
): ExerciseSpec => ({
  kind: 'scale-build',
  count,
  skills: [skill],
  config: { scales },
  label: 'Build scales',
});

export const keySigs = (
  count: number,
  skill: string,
  maxAccidentals: number,
  keyMode: 'major' | 'minor' | 'mixed' = 'major',
  keyType: 'sharp' | 'flat' | 'mixed' = 'mixed',
): ExerciseSpec => ({
  kind: 'key-signature',
  count,
  skills: [skill],
  config: { maxAccidentals, keyMode, keyType, clef: 'both' },
  label: 'Key signatures',
});

export const rhythmCount = (count: number, skill: string, totalBeats = [2, 3, 4]): ExerciseSpec => ({
  kind: 'rhythm-count',
  count,
  skills: [skill],
  config: { totalBeats },
  label: 'Rhythm counting',
});

export const rhythmDictation = (count: number, skill = 'rhythm-dictation'): ExerciseSpec => ({
  kind: 'rhythm-dictation',
  count,
  skills: [skill],
  label: 'Rhythm dictation',
});

export const melodyDictation = (count: number, skill = 'melody-dictation'): ExerciseSpec => ({
  kind: 'melody-dictation',
  count,
  skills: [skill],
  label: 'Melodic dictation',
});

export const progressions = (count: number, skill = 'progression-ear-cadences', labels?: string[]): ExerciseSpec => ({
  kind: 'progression-ear',
  count,
  skills: [skill],
  config: labels ? { progressions: labels } : {},
  label: 'Chord progressions',
});

export const section = (heading: string, body: string, extra: Partial<LessonSection> = {}): LessonSection => ({
  heading,
  body,
  ...extra,
});

export const lesson = (
  id: string,
  title: string,
  summary: string,
  minutes: number,
  sections: LessonSection[],
  exercises: ExerciseSpec[],
): Lesson => ({ id, title, summary, minutes, sections, exercises });
