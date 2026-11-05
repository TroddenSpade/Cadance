import { useI18n } from '../lib/i18n';

/**
 * A chord shape. `frets` and `fingers` run low E to high E, left to right in the
 * diagram. Use `null` for a muted string and `0` for an open string.
 */
export interface ChordShape {
  name: string;
  frets: Array<number | null>;
  fingers?: Array<number | null>;
  /** First fret shown in the grid. Open chords use 1. */
  baseFret?: number;
  /** Absolute fret of a barre, when the shape uses one. */
  barre?: number;
}

interface ChordDiagramProps {
  shape: ChordShape;
  className?: string;
}

const WIDTH = 132;
const HEIGHT = 176;
const LEFT = 24;
const TOP = 34;
const STRING_GAP = 16;
const FRET_GAP = 26;
const FRETS_SHOWN = 5;

export default function ChordDiagram({ shape, className = '' }: ChordDiagramProps) {
  const { t } = useI18n();
  const strings = 6;
  const positive = shape.frets.filter((fret): fret is number => fret !== null && fret > 0);
  const baseFret = shape.baseFret ?? (positive.length && Math.min(...positive) > 4 ? Math.min(...positive) : 1);
  const bottom = TOP + FRETS_SHOWN * FRET_GAP;
  const xFor = (string: number) => LEFT + string * STRING_GAP;
  const yFor = (fret: number) => TOP + (fret - baseFret + 1) * FRET_GAP - FRET_GAP / 2;

  return (
    <figure className={`chord-diagram ${className}`}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={t('{name} chord diagram', { name: shape.name })}
      >
        {Array.from({ length: strings }, (_, string) => (
          <line
            key={`string-${string}`}
            x1={xFor(string)}
            x2={xFor(string)}
            y1={TOP}
            y2={bottom}
            className="chord-string"
          />
        ))}

        {Array.from({ length: FRETS_SHOWN + 1 }, (_, fret) => (
          <line
            key={`fret-${fret}`}
            x1={LEFT}
            x2={LEFT + (strings - 1) * STRING_GAP}
            y1={TOP + fret * FRET_GAP}
            y2={TOP + fret * FRET_GAP}
            className={fret === 0 && baseFret === 1 ? 'chord-nut' : 'chord-fret'}
          />
        ))}

        {baseFret > 1 && (
          <text x={LEFT - 10} y={TOP + 12} textAnchor="end" className="chord-base-fret">
            {baseFret}
          </text>
        )}

        {shape.frets.map((fret, string) => {
          if (fret === null) {
            return (
              <text
                key={`marker-${string}`}
                x={xFor(string)}
                y={TOP - 13}
                textAnchor="middle"
                className="chord-marker muted"
              >
                ×
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`marker-${string}`}
                cx={xFor(string)}
                cy={TOP - 18}
                r={4.3}
                className="chord-marker open"
              />
            );
          }
          return null;
        })}

        {shape.barre && shape.barre >= baseFret && shape.barre < baseFret + FRETS_SHOWN && (
          <rect
            x={LEFT - 3}
            y={yFor(shape.barre) - 7.5}
            width={(strings - 1) * STRING_GAP + 6}
            height={15}
            rx={7.5}
            className="chord-barre"
          />
        )}

        {shape.frets.map((fret, string) => {
          if (fret === null || fret === 0) return null;
          const relative = fret - baseFret + 1;
          if (relative < 1 || relative > FRETS_SHOWN) return null;
          const finger = shape.fingers?.[string] ?? null;
          return (
            <g key={`dot-${string}`}>
              <circle cx={xFor(string)} cy={yFor(fret)} r={7.6} className="chord-dot" />
              {finger !== null && (
                <text
                  x={xFor(string)}
                  y={yFor(fret) + 3.4}
                  textAnchor="middle"
                  className="chord-finger"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>{shape.name}</figcaption>
    </figure>
  );
}
