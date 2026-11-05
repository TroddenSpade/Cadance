import type { LoopStyleId } from '../lib/loops';

export type StylePathId = 'classical' | 'pop' | 'jazz' | 'blues-folk';

export type StylePathStep =
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'piece'; pieceId: string }
  | { kind: 'loop'; styleId: LoopStyleId; keyPc: number }
  | { kind: 'analysis'; progressionId: string }
  | { kind: 'room'; room: 'sight-reading' | 'rhythm' | 'trainer' | 'repertoire' };

export interface StylePath {
  id: StylePathId;
  /** English display text; translate at the call site. */
  title: string;
  tagline: string;
  description: string;
  /** A level name already used by the curriculum. */
  level: string;
  steps: StylePathStep[];
}

export const STYLE_PATHS: StylePath[] = [
  {
    id: 'classical',
    title: 'The classical path',
    tagline: 'Read the page, shape the phrase.',
    description:
      'Start with the staff, then learn how a phrase is built and how a cadence closes it. The pieces move from a single line to two hands and a dance form.',
    level: 'Foundations',
    steps: [
      { kind: 'lesson', lessonId: 'treble-clef-reading' },
      { kind: 'piece', pieceId: 'ode-to-joy' },
      { kind: 'lesson', lessonId: 'major-scale' },
      { kind: 'piece', pieceId: 'minuet-in-g' },
      { kind: 'lesson', lessonId: 'cadences-ii-v-i' },
      { kind: 'analysis', progressionId: 'classical-period' },
      { kind: 'lesson', lessonId: 'phrase-period-form' },
      { kind: 'piece', pieceId: 'scarborough-fair' },
      { kind: 'lesson', lessonId: 'sonata-large-forms' },
    ],
  },
  {
    id: 'pop',
    title: 'The pop path',
    tagline: 'Four chords, a strong pulse, a melody on top.',
    description:
      'Learn the beat first, then the chords that carry most songs. The loop and the analysis room show why the same four bars keep working.',
    level: 'Foundations',
    steps: [
      { kind: 'lesson', lessonId: 'beat-note-values' },
      { kind: 'piece', pieceId: 'twinkle' },
      { kind: 'lesson', lessonId: 'diatonic-chords' },
      { kind: 'loop', styleId: 'pop', keyPc: 0 },
      { kind: 'analysis', progressionId: 'modal-rock' },
      { kind: 'lesson', lessonId: 'cadences-ii-v-i' },
      { kind: 'piece', pieceId: 'aura-lee' },
      { kind: 'loop', styleId: 'folk', keyPc: 7 },
      { kind: 'room', room: 'sight-reading' },
    ],
  },
  {
    id: 'jazz',
    title: 'The jazz path',
    tagline: 'Hear the seventh, follow the guide tones.',
    description:
      'Seventh chords turn a progression into a conversation. Work from ii–V–I outwards, then use the loop to hear the same motion in a different key.',
    level: 'Intermediate',
    steps: [
      { kind: 'lesson', lessonId: 'major-scale' },
      { kind: 'lesson', lessonId: 'seventh-chords' },
      { kind: 'analysis', progressionId: 'two-five-one' },
      { kind: 'loop', styleId: 'jazz', keyPc: 0 },
      { kind: 'lesson', lessonId: 'chord-progression-recognition' },
      { kind: 'piece', pieceId: 'aura-lee' },
      { kind: 'loop', styleId: 'blues', keyPc: 5 },
      { kind: 'lesson', lessonId: 'extensions-alterations' },
      { kind: 'room', room: 'rhythm' },
    ],
  },
  {
    id: 'blues-folk',
    title: 'The blues & folk path',
    tagline: 'Modal colour, open strings, and space.',
    description:
      'Minor pentatonic and modal harmony are forgiving places to improvise. Learn the scale, feel the twelve-bar shape, and let the loop carry the form.',
    level: 'Beginner',
    steps: [
      { kind: 'lesson', lessonId: 'natural-minor' },
      { kind: 'piece', pieceId: 'scarborough-fair' },
      { kind: 'lesson', lessonId: 'minor-progressions' },
      { kind: 'loop', styleId: 'blues', keyPc: 9 },
      { kind: 'analysis', progressionId: 'minor-lament' },
      { kind: 'room', room: 'rhythm' },
      { kind: 'lesson', lessonId: 'seven-modes' },
      { kind: 'loop', styleId: 'folk', keyPc: 7 },
      { kind: 'piece', pieceId: 'minuet-in-g' },
    ],
  },
];

export const STYLE_PATH_MAP: Record<string, StylePath> = Object.fromEntries(
  STYLE_PATHS.map((path) => [path.id, path]),
);

export function pathLessonIds(path: StylePath): string[] {
  return path.steps
    .filter((step): step is Extract<StylePathStep, { kind: 'lesson' }> => step.kind === 'lesson')
    .map((step) => step.lessonId);
}

export function stylePathProgress(
  path: StylePath,
  lessons: Record<string, { completedAt?: number }>,
): { done: number; total: number } {
  const ids = pathLessonIds(path);
  return {
    done: ids.filter((id) => Boolean(lessons[id]?.completedAt)).length,
    total: ids.length,
  };
}
