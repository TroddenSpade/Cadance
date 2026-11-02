import type { Accidental, KeySignatureKind, Letter, RhythmItem, ScaleName } from './music';

export type Clef = 'treble' | 'bass';

export type ExerciseKind =
  | 'note-reading'
  | 'find-note'
  | 'interval-ear'
  | 'interval-id'
  | 'chord-ear'
  | 'chord-inversion'
  | 'chord-build'
  | 'scale-build'
  | 'key-signature'
  | 'rhythm-count'
  | 'rhythm-dictation'
  | 'degree-ear'
  | 'melody-dictation'
  | 'progression-ear';

export interface StaffNoteSpec {
  letter: Letter;
  accidental: Accidental;
  octave: number;
}

export interface StaffSpec {
  clef: Clef;
  notes: StaffNoteSpec[];
  keySig?: { count: number; type: KeySignatureKind };
  time?: [number, number];
  chord?: boolean;
}

export interface RhythmSpec {
  items: RhythmItem[];
}

export interface AudioSpec {
  midis?: number[];
  chords?: number[][];
  /** Percussion pattern for rhythm dictation. */
  rhythm?: RhythmItem[];
  mode: 'sequence' | 'chord';
  tempo?: number;
}

export interface Question {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  instruction?: string;
  staff?: StaffSpec;
  rhythm?: RhythmSpec;
  audio?: AudioSpec;
  autoPlay?: boolean;
  choices?: string[];
  /** Displayed rhythm per choice; index matches choices. */
  choiceRhythms?: RhythmItem[][];
  answer: string;
  targetMidi?: number;
  targetMidis?: number[];
  ordered?: boolean;
  targetLabel?: string;
  explanation: string;
  hint?: string;
  skills: string[];
}

export interface ExerciseConfig {
  clef?: Clef | 'both';
  accidentals?: boolean;
  intervals?: number[];
  /** Spelled interval names used by written-interval questions. */
  writtenIntervals?: string[];
  direction?: 'ascending' | 'descending' | 'harmonic' | 'mixed';
  qualities?: string[];
  scales?: ScaleName[];
  keyMode?: 'major' | 'minor' | 'mixed';
  keyType?: 'sharp' | 'flat' | 'mixed';
  maxAccidentals?: number;
  degrees?: number[];
  totalBeats?: number[];
  progressions?: string[];
  roots?: number[];
}

export interface ExerciseSpec {
  kind: ExerciseKind;
  count: number;
  skills: string[];
  config?: ExerciseConfig;
  label?: string;
}

export interface SessionResult {
  total: number;
  correct: number;
  accuracy: number;
  xp: number;
  byKind: Record<string, { correct: number; total: number }>;
}
