import {
  FLAT_NAMES,
  SHARP_NAMES,
  octaveOf,
  pitchClass,
  type Accidental,
  type Letter,
} from './music';

export const STANDARD_GUITAR_TUNING = [64, 59, 55, 50, 45, 40];

export interface SpelledMidi {
  letter: Letter;
  accidental: Accidental;
  octave: number;
}

/** Spell a sounding pitch for the staff without forcing double accidentals. */
export function spellMidi(midi: number, preferFlats = false): SpelledMidi {
  const label = (preferFlats ? FLAT_NAMES : SHARP_NAMES)[pitchClass(midi)];
  return {
    letter: label[0] as Letter,
    accidental: label.includes('♯') ? 1 : label.includes('♭') ? -1 : 0,
    octave: octaveOf(midi),
  };
}

export interface GuitarPosition {
  string: number;
  fret: number;
}

/**
 * Choose a comfortable first-position fingering for a melody note.
 * String 0 is the high E string, matching the fretboard component.
 */
export function autoGuitarPosition(
  midi: number,
  tuning: number[] = STANDARD_GUITAR_TUNING,
  maxFret = 7,
): GuitarPosition | null {
  const candidates: GuitarPosition[] = [];
  tuning.forEach((open, string) => {
    const fret = midi - open;
    if (fret >= 0 && fret <= maxFret) candidates.push({ string, fret });
  });
  candidates.sort((a, b) => a.fret - b.fret || a.string - b.string);
  return candidates[0] ?? null;
}
