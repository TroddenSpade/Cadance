export type CagedShapeName = 'C' | 'A' | 'G' | 'E' | 'D';
export type CagedQuality = 'Major' | 'Minor';

export interface CagedPosition {
  shape: CagedShapeName;
  /** First fret of the diagram. */
  baseFret: number;
  /** Absolute frets, low E to high E. `null` means muted. */
  frets: Array<number | null>;
  fingers: Array<number | null>;
  barre?: number;
}

interface Template {
  shape: CagedShapeName;
  frets: Array<number | null>;
  fingers: Array<number | null>;
  /** Which open string carries the root, and its pitch class. */
  rootString: 'A' | 'E' | 'D';
  /** The template's reference fret on that string. */
  referenceFret: number;
  barreFret?: number;
}

const OPEN_PITCH_CLASS = { A: 9, E: 4, D: 2 } as const;

const MAJOR_TEMPLATES: Template[] = [
  {
    shape: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    rootString: 'A',
    referenceFret: 3,
  },
  {
    shape: 'A',
    frets: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    rootString: 'A',
    referenceFret: 0,
  },
  {
    shape: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    rootString: 'E',
    referenceFret: 3,
  },
  {
    shape: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    rootString: 'E',
    referenceFret: 0,
  },
  {
    shape: 'D',
    frets: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    rootString: 'D',
    referenceFret: 0,
  },
];

const MINOR_TEMPLATES: Template[] = [
  {
    shape: 'C',
    frets: [null, 3, 5, 5, 4, 3],
    fingers: [null, 1, 3, 4, 2, 1],
    rootString: 'A',
    referenceFret: 3,
    barreFret: 3,
  },
  {
    shape: 'A',
    frets: [null, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    rootString: 'A',
    referenceFret: 0,
    barreFret: 0,
  },
  {
    shape: 'G',
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    rootString: 'E',
    referenceFret: 3,
    barreFret: 3,
  },
  {
    shape: 'E',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    rootString: 'E',
    referenceFret: 0,
    barreFret: 0,
  },
  {
    shape: 'D',
    frets: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    rootString: 'D',
    referenceFret: 0,
  },
];

function normalizeBase(base: number): number {
  let value = base;
  while (value < 0) value += 12;
  while (value >= 12) value -= 12;
  return value;
}

/**
 * Five movable CAGED positions for a major or minor chord. The shapes are
 * transposed by finding the root on each template's reference string, which
 * keeps every position on the same five-shape map.
 */
export function cagedPositions(
  rootPitchClass: number,
  quality: CagedQuality,
): CagedPosition[] {
  const templates = quality === 'Minor' ? MINOR_TEMPLATES : MAJOR_TEMPLATES;
  return templates.map((template) => {
    const open = OPEN_PITCH_CLASS[template.rootString];
    const rootFret = ((rootPitchClass - open) % 12 + 12) % 12;
    const base = normalizeBase(rootFret - template.referenceFret);
    const frets = template.frets.map((fret) => {
      if (fret === null) return null;
      return fret === 0 ? base : fret + base;
    });
    return {
      shape: template.shape,
      baseFret: base === 0 ? 1 : base,
      frets,
      fingers: template.fingers,
      barre:
        template.barreFret === undefined
          ? undefined
          : template.barreFret === 0
            ? base || undefined
            : template.barreFret + base,
    };
  });
}
