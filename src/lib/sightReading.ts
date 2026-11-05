import { clamp, MAJOR_SCALE, pitchClass } from './music';
import type { PlayAlongPattern } from './playAlong';
import type { Clef } from './types';

export type SightReadingLevelId =
  | 'treble-steps'
  | 'treble-leaps'
  | 'bass-steps'
  | 'chromatic';

export interface SightReadingLevel {
  id: SightReadingLevelId;
  /** English key; translate at the call site. */
  label: string;
  description: string;
  clef: Clef;
  tonic: number;
  maxDegree: number;
  /** Allowed step sizes in scale degrees. */
  leaps: number[];
  rhythm: 'quarters' | 'mixed';
  accidentals: boolean;
  bpm: number;
}

export const SIGHT_READING_LEVELS: SightReadingLevel[] = [
  {
    id: 'treble-steps',
    label: 'Treble steps',
    description: 'C4 to G4, quarter notes, stepwise motion only.',
    clef: 'treble',
    tonic: 60,
    maxDegree: 5,
    leaps: [1],
    rhythm: 'quarters',
    accidentals: false,
    bpm: 72,
  },
  {
    id: 'treble-leaps',
    label: 'Treble leaps',
    description: 'A full octave in C major with small leaps and eighth-note pairs.',
    clef: 'treble',
    tonic: 60,
    maxDegree: 8,
    leaps: [1, 1, 2, 3],
    rhythm: 'mixed',
    accidentals: false,
    bpm: 76,
  },
  {
    id: 'bass-steps',
    label: 'Bass clef',
    description: 'C3 to G3 in bass clef, one note per beat.',
    clef: 'bass',
    tonic: 48,
    maxDegree: 5,
    leaps: [1],
    rhythm: 'quarters',
    accidentals: false,
    bpm: 66,
  },
  {
    id: 'chromatic',
    label: 'Accidentals',
    description: 'C major with occasional sharps and flats in the melody.',
    clef: 'treble',
    tonic: 60,
    maxDegree: 8,
    leaps: [1, 1, 2],
    rhythm: 'mixed',
    accidentals: true,
    bpm: 72,
  },
];

export interface SightReadingNote {
  midi: number;
  /** Duration in beats. */
  beats: number;
}

export interface SightReadingExercise {
  id: string;
  levelId: SightReadingLevelId;
  notes: SightReadingNote[];
  clef: Clef;
  time: [number, number];
  beatsPerBar: number;
  preferFlats: boolean;
  bpm: number;
}

const MIXED_RHYTHMS: number[][] = [
  [1, 1, 1, 1],
  [0.5, 0.5, 1, 1, 1],
  [1, 0.5, 0.5, 1, 1],
  [1, 1, 0.5, 0.5, 1],
  [2, 1, 1],
  [1, 1, 2],
];

let exerciseCounter = 0;

function choose<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)] ?? items[0];
}

function rhythmForBar(level: SightReadingLevel, rng: () => number): number[] {
  if (level.rhythm === 'quarters') return [1, 1, 1, 1];
  return [...choose(MIXED_RHYTHMS, rng)];
}

function degreeWalk(
  count: number,
  level: SightReadingLevel,
  rng: () => number,
): number[] {
  const degrees: number[] = [];
  let current = choose([1, 3, 5], rng);

  for (let index = 0; index < count; index += 1) {
    if (index === count - 1) {
      degrees.push(1);
      break;
    }
    if (index === 0) {
      degrees.push(current);
      continue;
    }

    let next = current;
    let guard = 0;
    while (next === current && guard < 12) {
      guard += 1;
      const step = choose(level.leaps, rng);
      const direction = rng() < 0.5 ? -1 : 1;
      next = clamp(current + step * direction, 1, level.maxDegree);
    }
    // If the walk is pinned at an edge, allow a repeat rather than stalling.
    degrees.push(next);
    current = next;
  }

  return degrees;
}

/**
 * Generate a four-bar sight-reading example. The melody is always in C major;
 * the level controls range, clef, rhythm, and whether accidentals appear.
 */
export function generateSightReading(
  levelId: SightReadingLevelId,
  rng: () => number = Math.random,
): SightReadingExercise {
  const level =
    SIGHT_READING_LEVELS.find((candidate) => candidate.id === levelId) ??
    SIGHT_READING_LEVELS[0];
  const bars = 4;
  const beatsPerBar = 4;

  const durations: number[] = [];
  for (let bar = 0; bar < bars; bar += 1) {
    durations.push(...rhythmForBar(level, rng));
  }

  const degrees = degreeWalk(durations.length, level, rng);
  const notes: SightReadingNote[] = degrees.map((degree, index) => {
    let midi = level.tonic + (MAJOR_SCALE[degree - 1] ?? 0);
    if (level.accidentals && index > 0 && index < degrees.length - 1 && rng() < 0.16) {
      midi += rng() < 0.5 ? -1 : 1;
    }
    return {
      midi: clamp(midi, level.tonic, level.tonic + 12),
      beats: durations[index] ?? 1,
    };
  });

  exerciseCounter += 1;
  return {
    id: `sight-${level.id}-${Date.now().toString(36)}-${exerciseCounter}`,
    levelId: level.id,
    notes,
    clef: level.clef,
    time: [4, 4],
    beatsPerBar,
    preferFlats: false,
    bpm: level.bpm,
  };
}

export function sightReadingPattern(exercise: SightReadingExercise): PlayAlongPattern {
  let beat = 0;
  const events = exercise.notes.map((note) => {
    const event = {
      beat,
      notes: [note.midi],
      beats: Math.max(0.12, note.beats * 0.9),
      velocity: 0.8,
    };
    beat += note.beats;
    return event;
  });
  return {
    events,
    totalBeats: Math.max(1, beat),
    beatsPerBar: exercise.beatsPerBar,
  };
}

export interface SightReadingResult {
  correct: boolean;
  matched: boolean[];
  played: number;
  total: number;
}

/** Compare a played melody with the score, pitch class by pitch class. */
export function checkSightReading(
  exercise: SightReadingExercise,
  playedMidis: number[],
): SightReadingResult {
  const matched = exercise.notes.map(
    (note, index) =>
      playedMidis[index] !== undefined &&
      pitchClass(playedMidis[index]) === pitchClass(note.midi),
  );
  return {
    correct: matched.length > 0 && matched.every(Boolean) && playedMidis.length === matched.length,
    matched,
    played: playedMidis.length,
    total: matched.length,
  };
}
