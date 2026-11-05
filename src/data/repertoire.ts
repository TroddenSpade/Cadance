import type { ChordShape } from '../components/ChordDiagram';
import type { KeySignatureKind } from '../lib/music';
import type { Clef } from '../lib/types';

export type RepertoireLevel = 'beginner' | 'early' | 'intermediate';

export interface RepertoireNote {
  midi: number;
  /** Duration in beats. */
  beats: number;
  /** Suggested right-hand piano fingering (1 = thumb). */
  pianoFinger?: number;
}

export interface RepertoirePiece {
  id: string;
  title: string;
  composer: string;
  summary: string;
  level: RepertoireLevel;
  /** The lesson this piece reinforces. */
  afterLesson: string;
  keyLabel: string;
  clef: Clef;
  time: [number, number];
  beatsPerBar: number;
  keySig?: { count: number; type: KeySignatureKind };
  bpm: number;
  preferFlats?: boolean;
  notes: RepertoireNote[];
  /** Open-position accompaniment shapes with suggested fingers. */
  chords?: ChordShape[];
  capo?: number;
}

const note = (midi: number, beats: number, pianoFinger?: number): RepertoireNote => ({
  midi,
  beats,
  pianoFinger,
});

export const OPEN_CHORDS: Record<string, ChordShape> = {
  C: {
    name: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
  },
  G: {
    name: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
  },
  G7: {
    name: 'G7',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, null, null, null, 1],
  },
  D: {
    name: 'D',
    frets: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
  },
  D7: {
    name: 'D7',
    frets: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
  },
  A: {
    name: 'A',
    frets: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
  },
  Am: {
    name: 'Am',
    frets: [null, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
  },
  E: {
    name: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
  },
  Em: {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
  },
  Dm: {
    name: 'Dm',
    frets: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
  },
  F: {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: 1,
  },
};

const twinkleFirst = [
  note(60, 1, 1),
  note(60, 1, 1),
  note(67, 1, 5),
  note(67, 1, 5),
  note(69, 1, 5),
  note(69, 1, 5),
  note(67, 2, 5),
];

const twinkleSecond = [
  note(65, 1, 4),
  note(65, 1, 4),
  note(64, 1, 3),
  note(64, 1, 3),
  note(62, 1, 2),
  note(62, 1, 2),
  note(60, 2, 1),
];

const twinkleThird = [
  note(67, 1, 5),
  note(67, 1, 5),
  note(65, 1, 4),
  note(65, 1, 4),
  note(64, 1, 3),
  note(64, 1, 3),
  note(62, 2, 2),
];

export const REPERTOIRE: RepertoirePiece[] = [
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    summary:
      'The famous theme from the Ninth Symphony. Stepwise motion, repeated notes, and one dotted rhythm — ideal after your first treble-clef lesson.',
    level: 'beginner',
    afterLesson: 'treble-clef-reading',
    keyLabel: 'C major',
    clef: 'treble',
    time: [4, 4],
    beatsPerBar: 4,
    bpm: 84,
    notes: [
      note(64, 1, 3),
      note(64, 1, 3),
      note(65, 1, 4),
      note(67, 1, 5),
      note(67, 1, 5),
      note(65, 1, 4),
      note(64, 1, 3),
      note(62, 1, 2),
      note(60, 1, 1),
      note(60, 1, 1),
      note(62, 1, 2),
      note(64, 1, 3),
      note(64, 3, 3),
      note(62, 1, 2),
      note(64, 1, 3),
      note(64, 1, 3),
      note(65, 1, 4),
      note(67, 1, 5),
      note(67, 1, 5),
      note(65, 1, 4),
      note(64, 1, 3),
      note(62, 1, 2),
      note(60, 1, 1),
      note(60, 1, 1),
      note(62, 1, 2),
      note(64, 1, 3),
      note(62, 3, 2),
      note(60, 1, 1),
    ],
    chords: [OPEN_CHORDS.C, OPEN_CHORDS.G, OPEN_CHORDS.C, OPEN_CHORDS.G],
  },
  {
    id: 'twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    composer: 'Traditional',
    summary:
      'A first piece in C position. Keep the repeated notes light and let the half notes breathe at the end of each phrase.',
    level: 'beginner',
    afterLesson: 'beat-note-values',
    keyLabel: 'C major',
    clef: 'treble',
    time: [4, 4],
    beatsPerBar: 4,
    bpm: 92,
    notes: [
      ...twinkleFirst,
      ...twinkleSecond,
      ...twinkleThird,
      ...twinkleThird,
      ...twinkleFirst,
      ...twinkleSecond,
    ],
    chords: [OPEN_CHORDS.C, OPEN_CHORDS.F, OPEN_CHORDS.C, OPEN_CHORDS.G],
  },
  {
    id: 'aura-lee',
    title: 'Aura Lee',
    composer: 'George R. Poulton',
    summary:
      'A lyrical Civil War song, later borrowed for “Love Me Tender”. Practise a smooth right-hand line while the left hand holds simple open chords.',
    level: 'beginner',
    afterLesson: 'major-scale',
    keyLabel: 'C major',
    clef: 'treble',
    time: [4, 4],
    beatsPerBar: 4,
    bpm: 76,
    notes: [
      note(60, 1, 1),
      note(60, 1, 1),
      note(64, 1, 3),
      note(67, 1, 5),
      note(67, 1, 5),
      note(64, 1, 3),
      note(60, 1, 1),
      note(64, 1, 3),
      note(62, 1, 2),
      note(62, 1, 2),
      note(65, 1, 4),
      note(69, 1, 5),
      note(69, 1, 5),
      note(65, 1, 4),
      note(62, 2, 2),
      note(60, 1, 1),
      note(60, 1, 1),
      note(64, 1, 3),
      note(67, 1, 5),
      note(67, 1, 5),
      note(64, 1, 3),
      note(60, 1, 1),
      note(64, 1, 3),
      note(62, 1, 2),
      note(62, 1, 2),
      note(65, 1, 4),
      note(69, 1, 5),
      note(67, 1, 5),
      note(65, 1, 4),
      note(64, 1, 3),
      note(62, 1, 2),
      note(60, 4, 1),
    ],
    chords: [OPEN_CHORDS.C, OPEN_CHORDS.Am, OPEN_CHORDS.F, OPEN_CHORDS.G],
  },
  {
    id: 'minuet-in-g',
    title: 'Minuet in G',
    composer: 'Christian Petzold',
    summary:
      'A Baroque dance in 3/4, long attributed to Bach. This beginner arrangement sits an octave lower than the original; listen for the strong first beat and the light two-beat answer in each bar.',
    level: 'early',
    afterLesson: 'time-signatures',
    keyLabel: 'G major',
    clef: 'treble',
    time: [3, 4],
    beatsPerBar: 3,
    keySig: { count: 1, type: 'sharp' },
    bpm: 108,
    notes: [
      note(62, 1, 5),
      note(55, 1, 1),
      note(57, 1, 2),
      note(59, 1, 3),
      note(60, 1, 4),
      note(62, 2, 5),
      note(55, 1, 1),
      note(55, 1, 1),
      note(64, 1, 5),
      note(60, 1, 3),
      note(62, 1, 4),
      note(64, 1, 5),
      note(66, 1, 5),
      note(67, 2, 5),
      note(55, 1, 1),
      note(55, 1, 1),
      note(60, 1, 2),
      note(62, 1, 3),
      note(60, 1, 2),
      note(59, 1, 1),
      note(57, 1, 1),
      note(59, 1, 2),
      note(60, 1, 3),
      note(59, 1, 2),
      note(57, 1, 1),
      note(55, 1, 1),
      note(54, 1, 1),
      note(55, 1, 2),
      note(57, 1, 3),
      note(59, 1, 4),
      note(55, 1, 2),
      note(59, 1, 3),
      note(57, 1, 2),
      note(55, 1, 1),
    ],
    chords: [OPEN_CHORDS.G, OPEN_CHORDS.C, OPEN_CHORDS.D7, OPEN_CHORDS.G],
  },
  {
    id: 'scarborough-fair',
    title: 'Scarborough Fair',
    composer: 'Traditional English',
    summary:
      'A modal ballad in A minor. The narrow range and slow 3/4 pulse make it a good first minor-key piece for both hands.',
    level: 'early',
    afterLesson: 'natural-minor',
    keyLabel: 'A minor',
    clef: 'treble',
    time: [3, 4],
    beatsPerBar: 3,
    bpm: 72,
    notes: [
      note(69, 2, 5),
      note(69, 1, 5),
      note(64, 2, 3),
      note(64, 1, 3),
      note(65, 2, 4),
      note(64, 1, 3),
      note(62, 3, 2),
      note(62, 2, 2),
      note(60, 1, 1),
      note(62, 2, 2),
      note(64, 1, 3),
      note(69, 3, 5),
      note(72, 2, 5),
      note(71, 1, 4),
      note(69, 2, 5),
      note(67, 1, 4),
      note(69, 3, 5),
      note(69, 2, 5),
      note(64, 1, 3),
      note(65, 2, 4),
      note(64, 1, 3),
      note(62, 3, 2),
    ],
    chords: [OPEN_CHORDS.Am, OPEN_CHORDS.G, OPEN_CHORDS.Am, OPEN_CHORDS.Em],
  },
];

export const REPERTOIRE_MAP: Record<string, RepertoirePiece> = Object.fromEntries(
  REPERTOIRE.map((piece) => [piece.id, piece]),
);

export function piecesAfterLesson(lessonId: string): RepertoirePiece[] {
  return REPERTOIRE.filter((piece) => piece.afterLesson === lessonId);
}

export const REPERTOIRE_LEVELS: Array<{ id: RepertoireLevel; title: string }> = [
  { id: 'beginner', title: 'Beginner' },
  { id: 'early', title: 'Early intermediate' },
  { id: 'intermediate', title: 'Intermediate' },
];
