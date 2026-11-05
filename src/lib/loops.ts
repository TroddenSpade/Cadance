import { chordByName, pitchClass } from './music';
import type { PlayAlongEvent, PlayAlongPattern } from './playAlong';

export type LoopStyleId = 'pop' | 'rock' | 'jazz' | 'blues' | 'waltz' | 'folk';

export interface LoopScale {
  /** English key; translate at the call site. */
  label: string;
  intervals: number[];
}

export interface LoopStyle {
  id: LoopStyleId;
  /** English key; translate at the call site. */
  label: string;
  description: string;
  bpm: number;
  beatsPerBar: number;
  /** Chords as semitone offsets above the tonic, one per bar. */
  progression: Array<{ offset: number; quality: string }>;
  /** How the accompaniment is voiced. */
  feel: 'pop' | 'rock' | 'jazz' | 'blues' | 'waltz' | 'folk';
  scale: LoopScale;
  tip: string;
}

export const LOOP_STYLES: LoopStyle[] = [
  {
    id: 'pop',
    label: 'Pop',
    description: 'I–V–vi–IV, the four-chord loop behind countless songs.',
    bpm: 96,
    beatsPerBar: 4,
    progression: [
      { offset: 0, quality: 'Major' },
      { offset: 7, quality: 'Major' },
      { offset: 9, quality: 'Minor' },
      { offset: 5, quality: 'Major' },
    ],
    feel: 'pop',
    scale: { label: 'Major pentatonic', intervals: [0, 2, 4, 7, 9] },
    tip: 'Keep the chords light and let the bass carry the pulse. Aim for an even strum or a clean block chord on beats 2 and 4.',
  },
  {
    id: 'rock',
    label: 'Rock',
    description: 'I–♭VII–IV–I with power-chord stabs and a driving bass.',
    bpm: 112,
    beatsPerBar: 4,
    progression: [
      { offset: 0, quality: 'Major' },
      { offset: 10, quality: 'Major' },
      { offset: 5, quality: 'Major' },
      { offset: 0, quality: 'Major' },
    ],
    feel: 'rock',
    scale: { label: 'Minor pentatonic', intervals: [0, 3, 5, 7, 10] },
    tip: 'Lock the bass to the kick and keep the stabs short. Leave space between attacks so the riff breathes.',
  },
  {
    id: 'jazz',
    label: 'Jazz',
    description: 'ii–V–I with seventh chords and a relaxed off-beat comp.',
    bpm: 124,
    beatsPerBar: 4,
    progression: [
      { offset: 2, quality: 'Minor 7th' },
      { offset: 7, quality: 'Dominant 7th' },
      { offset: 0, quality: 'Major 7th' },
      { offset: 0, quality: 'Major 7th' },
    ],
    feel: 'jazz',
    scale: { label: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
    tip: 'Comp on the “and” of beats 2 and 4. Guide tones — thirds and sevenths — matter more than the roots.',
  },
  {
    id: 'blues',
    label: 'Blues',
    description: 'Twelve-bar colour in a four-bar loop: I7–IV7–I7–V7.',
    bpm: 88,
    beatsPerBar: 4,
    progression: [
      { offset: 0, quality: 'Dominant 7th' },
      { offset: 5, quality: 'Dominant 7th' },
      { offset: 0, quality: 'Dominant 7th' },
      { offset: 7, quality: 'Dominant 7th' },
    ],
    feel: 'blues',
    scale: { label: 'Blues scale', intervals: [0, 3, 5, 6, 7, 10] },
    tip: 'Feel the shuffle in the click. Keep the comp sparse and answer the vocal with short phrases rather than filling every beat.',
  },
  {
    id: 'waltz',
    label: 'Waltz',
    description: 'I–IV–V–I in 3/4: bass on one, chords on two and three.',
    bpm: 126,
    beatsPerBar: 3,
    progression: [
      { offset: 0, quality: 'Major' },
      { offset: 5, quality: 'Major' },
      { offset: 7, quality: 'Major' },
      { offset: 0, quality: 'Major' },
    ],
    feel: 'waltz',
    scale: { label: 'Major scale', intervals: [0, 2, 4, 5, 7, 9, 11] },
    tip: 'Make beat one strong but not heavy. Let the two lighter chords lean into the next downbeat.',
  },
  {
    id: 'folk',
    label: 'Folk',
    description: 'I–IV–I–V with an open, acoustic strum.',
    bpm: 100,
    beatsPerBar: 4,
    progression: [
      { offset: 0, quality: 'Major' },
      { offset: 5, quality: 'Major' },
      { offset: 0, quality: 'Major' },
      { offset: 7, quality: 'Major' },
    ],
    feel: 'folk',
    scale: { label: 'Major pentatonic', intervals: [0, 2, 4, 7, 9] },
    tip: 'Keep the right hand moving in eighth notes and change chords early. The bass note should arrive with the click.',
  },
];

export const LOOP_KEYS: Array<{ pc: number; label: string }> = [
  { pc: 0, label: 'C' },
  { pc: 1, label: 'D♭' },
  { pc: 2, label: 'D' },
  { pc: 3, label: 'E♭' },
  { pc: 4, label: 'E' },
  { pc: 5, label: 'F' },
  { pc: 6, label: 'F♯' },
  { pc: 7, label: 'G' },
  { pc: 8, label: 'A♭' },
  { pc: 9, label: 'A' },
  { pc: 10, label: 'B♭' },
  { pc: 11, label: 'B' },
];

export interface LoopChord {
  name: string;
  midis: number[];
  /** Beat where the chord begins. */
  beat: number;
}

export interface LoopPattern extends PlayAlongPattern {
  chords: LoopChord[];
}

const CHORD_ROOT_MIDI = 48;
const BASS_MIDI = 36;

function accompaniment(
  feel: LoopStyle['feel'],
  chord: number[],
  bass: number,
  start: number,
): PlayAlongEvent[] {
  const events: PlayAlongEvent[] = [];
  const chordStab = (offset: number, length = 0.9, velocity = 0.7) =>
    events.push({ beat: start + offset, notes: chord, beats: length, velocity });
  const bassNote = (offset: number, length = 1.7, velocity = 0.6) =>
    events.push({ beat: start + offset, notes: [bass], beats: length, velocity });

  switch (feel) {
    case 'pop':
      bassNote(0);
      chordStab(1);
      bassNote(2);
      chordStab(3);
      break;
    case 'rock':
      bassNote(0);
      chordStab(0, 1.6, 0.78);
      chordStab(1.5, 0.4, 0.7);
      bassNote(2);
      chordStab(2, 1.6, 0.78);
      chordStab(3.5, 0.4, 0.7);
      break;
    case 'jazz':
      bassNote(0);
      chordStab(1.5, 0.7, 0.66);
      bassNote(2);
      chordStab(3.5, 0.7, 0.66);
      break;
    case 'blues':
      bassNote(0);
      chordStab(0.5, 0.45, 0.7);
      chordStab(1.5, 0.45, 0.7);
      bassNote(2);
      chordStab(2.5, 0.45, 0.7);
      chordStab(3.5, 0.45, 0.7);
      break;
    case 'waltz':
      bassNote(0);
      chordStab(1, 0.85, 0.66);
      chordStab(2, 0.85, 0.66);
      break;
    case 'folk':
      bassNote(0);
      chordStab(1);
      bassNote(2);
      chordStab(3);
      break;
  }

  return events;
}

/** Build a looping accompaniment for one style and key. */
export function buildLoop(styleId: LoopStyleId, tonicPc: number): LoopPattern {
  const style = LOOP_STYLES.find((candidate) => candidate.id === styleId) ?? LOOP_STYLES[0];
  const root = CHORD_ROOT_MIDI + ((tonicPc + 12) % 12);
  const bass = BASS_MIDI + ((tonicPc + 12) % 12);
  const keyLabel =
    LOOP_KEYS.find((key) => key.pc === ((tonicPc + 12) % 12))?.label ?? 'C';

  const events: PlayAlongEvent[] = [];
  const chords: LoopChord[] = style.progression.map((entry, index) => {
    const chord = chordByName(entry.quality);
    const chordRoot = root + entry.offset;
    const midis = chord.intervals.map((interval) => chordRoot + interval);
    const beat = index * style.beatsPerBar;
    const chordPc = ((tonicPc + entry.offset) % 12 + 12) % 12;
    const chordLabel = LOOP_KEYS.find((key) => key.pc === chordPc)?.label ?? keyLabel;
    events.push(...accompaniment(style.feel, midis, bass + entry.offset, beat));
    return {
      name: `${chordLabel}${chord.symbol}`,
      midis,
      beat,
    };
  });

  const totalBeats = style.progression.length * style.beatsPerBar;
  return {
    events: events
      .filter((event) => event.beat < totalBeats)
      .map((event) => ({
        ...event,
        beats: Math.min(event.beats, totalBeats - event.beat),
      })),
    totalBeats,
    beatsPerBar: style.beatsPerBar,
    chords,
  };
}

/** Scale tones for soloing over a loop, from C3 upward for two octaves. */
export function loopScaleMidis(styleId: LoopStyleId, tonicPc: number): number[] {
  const style = LOOP_STYLES.find((candidate) => candidate.id === styleId) ?? LOOP_STYLES[0];
  const start = CHORD_ROOT_MIDI + ((tonicPc + 12) % 12);
  const values = new Set<number>();
  for (let octave = 0; octave <= 1; octave += 1) {
    style.scale.intervals.forEach((interval) => {
      values.add(start + interval + octave * 12);
    });
  }
  return [...values].sort((a, b) => a - b);
}

/** Pitch classes emphasized as the tonic inside a scale display. */
export function loopRootPitchClasses(tonicPc: number): number[] {
  return [pitchClass(tonicPc)];
}
