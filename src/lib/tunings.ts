import { midiToFullName } from './music';

export interface TuningString {
  midi: number;
  /** Optional display label such as `6th`. */
  label?: string;
}

export interface TuningPreset {
  id: string;
  name: string;
  description: string;
  strings: TuningString[];
  chromatic?: boolean;
}

export interface InstrumentPreset {
  id: string;
  name: string;
  family: 'Guitar' | 'Bass' | 'Orchestral' | 'Folk' | 'Keyboard' | 'Custom';
  tunings: TuningPreset[];
}

const string = (midi: number): TuningString => ({ midi });

function guitarStrings(lowToHigh: number[]): TuningString[] {
  return lowToHigh.map((midi, index) => ({ midi, label: stringLabel(index, lowToHigh.length) }));
}

export const INSTRUMENTS: InstrumentPreset[] = [
  {
    id: 'guitar',
    name: 'Guitar',
    family: 'Guitar',
    tunings: [
      {
        id: 'standard',
        name: 'Standard E',
        description: 'E A D G B E — the default six-string tuning.',
        strings: guitarStrings([40, 45, 50, 55, 59, 64]),
      },
      {
        id: 'drop-d',
        name: 'Drop D',
        description: 'Lower the sixth string to D for power chords and dropped riffs.',
        strings: guitarStrings([38, 45, 50, 55, 59, 64]),
      },
      {
        id: 'half-step-down',
        name: 'Half-step down',
        description: 'Everything down a semitone: E♭ A♭ D♭ G♭ B♭ E♭.',
        strings: guitarStrings([39, 44, 49, 54, 58, 63]),
      },
      {
        id: 'full-step-down',
        name: 'Full-step down',
        description: 'D G C F A D — a whole step below standard.',
        strings: guitarStrings([38, 43, 48, 53, 57, 62]),
      },
      {
        id: 'dadgad',
        name: 'DADGAD',
        description: 'D A D G A D — open, modal, and popular in folk and Celtic music.',
        strings: guitarStrings([38, 45, 50, 55, 57, 62]),
      },
      {
        id: 'open-g',
        name: 'Open G',
        description: 'D G D G B D — a G major chord across the open strings.',
        strings: guitarStrings([38, 43, 50, 55, 59, 62]),
      },
      {
        id: 'open-d',
        name: 'Open D',
        description: 'D A D F♯ A D — a D major chord across the open strings.',
        strings: guitarStrings([38, 45, 50, 54, 57, 62]),
      },
      {
        id: 'open-e',
        name: 'Open E',
        description: 'E B E G♯ B E — a bright E major tuning.',
        strings: guitarStrings([40, 47, 52, 56, 59, 64]),
      },
      {
        id: 'drop-c',
        name: 'Drop C',
        description: 'C G C F A D — a low, heavy tuning for modern rock.',
        strings: guitarStrings([36, 43, 48, 53, 57, 62]),
      },
      {
        id: 'seven-string',
        name: '7-string standard',
        description: 'B E A D G B E — add a low B to the standard guitar.',
        strings: guitarStrings([35, 40, 45, 50, 55, 59, 64]),
      },
    ],
  },
  {
    id: 'bass',
    name: 'Bass guitar',
    family: 'Bass',
    tunings: [
      {
        id: 'bass-standard',
        name: 'Standard E',
        description: 'E A D G — the four-string bass standard.',
        strings: guitarStrings([28, 33, 38, 43]),
      },
      {
        id: 'bass-five',
        name: '5-string low B',
        description: 'B E A D G — a low B extends the range downward.',
        strings: guitarStrings([23, 28, 33, 38, 43]),
      },
      {
        id: 'bass-drop-d',
        name: 'Drop D',
        description: 'D A D G — lower the fourth string for drop-D bass lines.',
        strings: guitarStrings([26, 33, 38, 43]),
      },
    ],
  },
  {
    id: 'ukulele',
    name: 'Ukulele',
    family: 'Folk',
    tunings: [
      {
        id: 'uke-standard',
        name: 'Standard (reentrant)',
        description: 'G C E A — the high-G tuning most ukuleles use.',
        strings: guitarStrings([67, 60, 64, 69]),
      },
      {
        id: 'uke-low-g',
        name: 'Low G',
        description: 'G C E A with a low G for a guitar-like bass.',
        strings: guitarStrings([55, 60, 64, 69]),
      },
      {
        id: 'uke-baritone',
        name: 'Baritone',
        description: 'D G B E — the same intervals as the top four guitar strings.',
        strings: guitarStrings([50, 55, 59, 64]),
      },
    ],
  },
  {
    id: 'violin',
    name: 'Violin',
    family: 'Orchestral',
    tunings: [
      {
        id: 'violin-standard',
        name: 'Standard',
        description: 'G D A E — perfect fifths from the low G.',
        strings: guitarStrings([55, 62, 69, 76]),
      },
    ],
  },
  {
    id: 'viola',
    name: 'Viola',
    family: 'Orchestral',
    tunings: [
      {
        id: 'viola-standard',
        name: 'Standard',
        description: 'C G D A — a fifth below the violin.',
        strings: guitarStrings([48, 55, 62, 69]),
      },
    ],
  },
  {
    id: 'cello',
    name: 'Cello',
    family: 'Orchestral',
    tunings: [
      {
        id: 'cello-standard',
        name: 'Standard',
        description: 'C G D A — the cello’s four strings, an octave below the viola.',
        strings: guitarStrings([36, 43, 50, 57]),
      },
    ],
  },
  {
    id: 'double-bass',
    name: 'Double bass',
    family: 'Orchestral',
    tunings: [
      {
        id: 'bass-orchestral',
        name: 'Standard',
        description: 'E A D G — sounding an octave below the bass guitar.',
        strings: guitarStrings([28, 33, 38, 43]),
      },
    ],
  },
  {
    id: 'mandolin',
    name: 'Mandolin',
    family: 'Folk',
    tunings: [
      {
        id: 'mandolin-standard',
        name: 'Standard',
        description: 'G D A E — four pairs of strings tuned in fifths.',
        strings: guitarStrings([55, 62, 69, 76]),
      },
    ],
  },
  {
    id: 'banjo',
    name: 'Banjo',
    family: 'Folk',
    tunings: [
      {
        id: 'banjo-open-g',
        name: 'Open G',
        description: 'G D G B D — the five-string banjo’s standard open-G tuning.',
        strings: guitarStrings([67, 50, 55, 59, 62]),
      },
    ],
  },
  {
    id: 'piano',
    name: 'Piano',
    family: 'Keyboard',
    tunings: [
      {
        id: 'piano-chromatic',
        name: 'Chromatic',
        description: 'Detect any piano note; no string selection needed.',
        strings: [],
        chromatic: true,
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom strings',
    family: 'Custom',
    tunings: [
      {
        id: 'custom',
        name: 'Custom tuning',
        description: 'Choose your own strings, octaves, and order.',
        strings: guitarStrings([40, 45, 50, 55, 59, 64]),
      },
    ],
  },
];

export const DEFAULT_CUSTOM_STRINGS = [40, 45, 50, 55, 59, 64];

export function instrumentById(id: string): InstrumentPreset {
  return INSTRUMENTS.find((instrument) => instrument.id === id) ?? INSTRUMENTS[0];
}

export function tuningById(instrumentId: string, tuningId: string): TuningPreset {
  const instrument = instrumentById(instrumentId);
  return instrument.tunings.find((tuning) => tuning.id === tuningId) ?? instrument.tunings[0];
}

export function stringLabel(index: number, total: number): string {
  const value = total - index;
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export function stringNote(midi: number): string {
  return midiToFullName(midi);
}

export function customTuning(strings: number[]): TuningPreset {
  return {
    id: 'custom',
    name: 'Custom tuning',
    description: 'Your own string layout.',
    strings: strings.map((midi, index) => ({ midi, label: stringLabel(index, strings.length) })),
  };
}

export function noteOptions(): Array<{ midi: number; label: string }> {
  const options: Array<{ midi: number; label: string }> = [];
  for (let midi = 12; midi <= 108; midi += 1) {
    options.push({ midi, label: midiToFullName(midi) });
  }
  return options;
}

export const STRING_NOTE_OPTIONS = noteOptions();
