import type { RhythmItem } from './music';
import type { PlayAlongPattern } from './playAlong';

export type RhythmLevelId = 'steady' | 'split' | 'rests' | 'dotted';

export interface RhythmLevel {
  id: RhythmLevelId;
  /** English key; translate at the call site. */
  label: string;
  description: string;
  bpm: number;
  /** Note values allowed in a bar, in beats. */
  values: number[];
  rests: boolean;
}

export const RHYTHM_LEVELS: RhythmLevel[] = [
  {
    id: 'steady',
    label: 'Steady pulse',
    description: 'Quarter and half notes in 4/4. One attack per beat or every two beats.',
    bpm: 76,
    values: [1, 2],
    rests: false,
  },
  {
    id: 'split',
    label: 'Split the beat',
    description: 'Adds eighth notes, so some beats carry two attacks.',
    bpm: 84,
    values: [0.5, 1, 2],
    rests: false,
  },
  {
    id: 'rests',
    label: 'Rests',
    description: 'Eighth and quarter values with silent beats you must feel through.',
    bpm: 84,
    values: [0.5, 1, 2],
    rests: true,
  },
  {
    id: 'dotted',
    label: 'Dotted and syncopated',
    description: 'Dotted quarters and off-beat attacks against a steady pulse.',
    bpm: 92,
    values: [0.5, 1, 1.5, 2],
    rests: true,
  },
];

const BEATS_PER_BAR = 4;

function choose<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)] ?? items[0];
}

function fillBar(level: RhythmLevel, rng: () => number): RhythmItem[] {
  const items: RhythmItem[] = [];
  let remaining = BEATS_PER_BAR;
  let guard = 0;

  while (remaining > 0.001 && guard < 24) {
    guard += 1;
    const candidates = level.values.filter((value) => value <= remaining + 0.001);
    if (!candidates.length) break;

    let value = choose(candidates, rng);
    // Keep bars playable: no more than two rests, never a rest on the downbeat,
    // and no rest directly after another rest.
    const previous = items[items.length - 1];
    const canRest =
      level.rests &&
      items.length > 0 &&
      !previous?.rest &&
      items.filter((item) => item.rest).length < 2 &&
      remaining - value >= 0;
    const rest = canRest && rng() < 0.18;

    if (rest && (value === 1.5 || value === 2)) value = 1;
    if (value > remaining) value = remaining;

    items.push({
      beats: value,
      dotted: value === 1.5,
      rest,
    });
    remaining = Math.round((remaining - value) * 100) / 100;
  }

  return items;
}

/** Generate a two-bar rhythm. Each bar always adds up to four beats. */
export function generateRhythm(
  levelId: RhythmLevelId,
  bars = 2,
  rng: () => number = Math.random,
): RhythmItem[] {
  const level = RHYTHM_LEVELS.find((candidate) => candidate.id === levelId) ?? RHYTHM_LEVELS[0];
  const items: RhythmItem[] = [];
  for (let bar = 0; bar < Math.max(1, Math.round(bars)); bar += 1) {
    items.push(...fillBar(level, rng));
  }
  return items;
}

/** Absolute beat positions of every sounding note, rests excluded. */
export function rhythmOnsets(items: RhythmItem[]): number[] {
  const onsets: number[] = [];
  let cursor = 0;
  items.forEach((item) => {
    const length = Math.abs(item.beats) || 1;
    if (!item.rest) onsets.push(cursor);
    cursor += length;
  });
  return onsets;
}

/** A silent pattern that keeps the click track running for tap exercises. */
export function clickOnlyPattern(totalBeats: number, beatsPerBar = 4): PlayAlongPattern {
  return {
    events: [{ beat: 0, notes: [], beats: 0.1 }],
    totalBeats: Math.max(1, totalBeats),
    beatsPerBar,
  };
}

export interface EchoNoteResult {
  beat: number;
  errorMs: number | null;
}

export interface EchoScore {
  /** Matched onsets divided by the larger of expected and tapped counts. */
  accuracy: number;
  matched: number;
  total: number;
  extra: number;
  meanErrorMs: number;
  notes: EchoNoteResult[];
}

/**
 * Score a tapped echo against a written rhythm. The learner's first tap starts
 * their own clock, so only the spacing between attacks is judged — the tempo is
 * set by the exercise, not by when they happened to begin.
 */
export function scoreEcho(
  items: RhythmItem[],
  tapOffsetsMs: number[],
  beatSeconds: number,
): EchoScore {
  const onsets = rhythmOnsets(items);
  const expectedOffsets = onsets.map((beat) => (beat - onsets[0]) * beatSeconds * 1000);
  // The learner's first tap starts their own clock, so a performance that
  // begins later is still judged on its internal spacing.
  const firstTap = tapOffsetsMs[0] ?? 0;
  const tapOffsets = tapOffsetsMs.map((tap) => tap - firstTap);
  // At fast tempos an eighth note is short, so scale the window with the beat.
  const toleranceMs = Math.max(80, Math.min(220, beatSeconds * 1000 * 0.28));
  const used = new Set<number>();
  const notes: EchoNoteResult[] = expectedOffsets.map((expected) => {
    let bestIndex = -1;
    let bestError = Number.POSITIVE_INFINITY;
    tapOffsets.forEach((tap, index) => {
      if (used.has(index)) return;
      const error = Math.abs(tap - expected);
      if (error < bestError) {
        bestError = error;
        bestIndex = index;
      }
    });
    if (bestIndex >= 0 && bestError <= toleranceMs) {
      used.add(bestIndex);
      return { beat: expected / 1000, errorMs: Math.round(bestError) };
    }
    return { beat: expected / 1000, errorMs: null };
  });

  const matchedNotes = notes.filter((note) => note.errorMs !== null);
  const matched = matchedNotes.length;
  const extra = Math.max(0, tapOffsetsMs.length - matched);
  const denominator = Math.max(expectedOffsets.length, tapOffsetsMs.length, 1);
  const meanErrorMs = matchedNotes.length
    ? Math.round(
        matchedNotes.reduce((sum, note) => sum + (note.errorMs ?? 0), 0) / matchedNotes.length,
      )
    : 0;

  return {
    accuracy: Math.min(1, matched / denominator),
    matched,
    total: expectedOffsets.length,
    extra,
    meanErrorMs,
    notes,
  };
}
