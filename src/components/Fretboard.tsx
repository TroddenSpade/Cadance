import { useI18n } from '../lib/i18n';
import { midiToName, noteLabelLines, noteName, pitchClass, type Letter, type NoteNaming } from '../lib/music';
import type { GuitarSpot } from '../lib/types';
import type { MarkState } from './Piano';

interface FretboardProps {
  onNote?: (midi: number, stringIndex: number, fret: number) => void;
  marks?: Record<number, MarkState>;
  showLabels?: boolean;
  naming?: NoteNaming;
  disabled?: boolean;
  preferFlats?: boolean;
  /** Exact suggested positions. When present, these replace pitch-class marks. */
  spots?: GuitarSpot[];
  /** Pitch classes drawn with root emphasis inside `spots`. */
  rootPitchClasses?: number[];
}

const STRINGS = [
  { midi: 64, label: 'E4', name: 'high E' },
  { midi: 59, label: 'B3', name: 'B' },
  { midi: 55, label: 'G3', name: 'G' },
  { midi: 50, label: 'D3', name: 'D' },
  { midi: 45, label: 'A2', name: 'A' },
  { midi: 40, label: 'E2', name: 'low E' },
];

const FRETS = 12;
const LEFT = 78;
const RIGHT = 886;
const TOP = 42;
const STRING_GAP = 28;
const NUT_WIDTH = 6;
const MARKER_FRETS = [3, 5, 7, 9, 12];

export default function Fretboard({
  onNote,
  marks = {},
  showLabels = true,
  naming = 'both',
  disabled = false,
  preferFlats = false,
  spots,
  rootPitchClasses = [],
}: FretboardProps) {
  const { t } = useI18n();
  const width = 920;
  const height = TOP + STRING_GAP * 5 + 58;
  const fretWidth = (RIGHT - LEFT) / FRETS;
  const stringY = (index: number) => TOP + index * STRING_GAP;

  return (
    <div className="fretboard-scroll">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="fretboard"
        role="group"
        aria-label={t('Guitar fretboard, standard tuning, frets 0 to 12')}
      >
        <rect x={LEFT} y={TOP - 16} width={RIGHT - LEFT} height={STRING_GAP * 5 + 32} rx={4} className="fretboard-wood" />

        {MARKER_FRETS.map((fret) => {
          const x = LEFT + (fret - 0.5) * fretWidth;
          if (fret === 12) {
            return (
              <g key={fret}>
                <circle cx={x} cy={TOP + STRING_GAP * 2} r={4.5} className="fret-marker" />
                <circle cx={x} cy={TOP + STRING_GAP * 3} r={4.5} className="fret-marker" />
              </g>
            );
          }
          return <circle key={fret} cx={x} cy={TOP + STRING_GAP * 2.5} r={4.5} className="fret-marker" />;
        })}

        {Array.from({ length: FRETS + 1 }, (_, fret) => {
          const x = LEFT + fret * fretWidth;
          return (
            <g key={`fret-${fret}`}>
              <line x1={x} x2={x} y1={TOP - 18} y2={TOP + STRING_GAP * 5 + 18} className={fret === 0 ? 'nut' : 'fret'} strokeWidth={fret === 0 ? NUT_WIDTH : 1.6} />
              {fret > 0 && fret < FRETS && (
                <text x={x} y={height - 18} textAnchor="middle" className="fret-number">
                  {fret}
                </text>
              )}
            </g>
          );
        })}

        {STRINGS.map((string, index) => {
          const y = stringY(index);
          const labelName = midiToName(string.midi, preferFlats);
          const letter = labelName[0] as Letter;
          const accidental = labelName.includes('♯') ? 1 : labelName.includes('♭') ? -1 : 0;
          const octave = Math.floor(string.midi / 12) - 1;
          const lines = noteLabelLines(letter, accidental, naming).map((line) => `${line}${octave}`);
          return (
            <g key={string.midi}>
              <line x1={LEFT - 26} x2={RIGHT} y1={y} y2={y} className="string-line" strokeWidth={2.8 - index * 0.3} />
              <text x={LEFT - 34} y={lines.length > 1 ? y : y + 4} textAnchor="end" className="string-label">
                {lines[0]}
              </text>
              {lines[1] && (
                <text x={LEFT - 34} y={y + 10} textAnchor="end" className="string-label string-solfege">
                  {lines[1]}
                </text>
              )}
            </g>
          );
        })}

        {STRINGS.map((string, stringIndex) =>
          Array.from({ length: FRETS + 1 }, (_, fret) => {
            const midi = string.midi + fret;
            const spot = spots?.find((item) => item.string === stringIndex && item.fret === fret);
            const mark = spots
              ? spot
                ? rootPitchClasses.includes(pitchClass(midi))
                  ? 'root'
                  : 'lesson'
                : undefined
              : marks[pitchClass(midi)];
            const xStart = fret === 0 ? 12 : LEFT + (fret - 1) * fretWidth + 2;
            const xEnd = fret === 0 ? LEFT - 2 : LEFT + fret * fretWidth - 2;
            const y = stringY(stringIndex);
            const name = midiToName(midi, preferFlats);
            const letter = name[0] as Letter;
            const accidental = name.includes('♯') ? 1 : name.includes('♭') ? -1 : 0;
            const displayName = noteName(letter, accidental, naming);
            const showName = showLabels && (spot ? true : fret === 0 || Boolean(mark));
            return (
              <g
                key={`pos-${stringIndex}-${fret}`}
                className={`fret-position ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && onNote?.(midi, stringIndex, fret)}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={t('{string} string, fret {fret}, {note}', {
                  string: t(string.name),
                  fret,
                  note: displayName,
                })}
                onKeyDown={(event) => {
                  if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onNote?.(midi, stringIndex, fret);
                  }
                }}
              >
                <rect x={xStart} y={y - 14} width={Math.max(xEnd - xStart, 18)} height={28} rx={5} className="fret-hit" />
                {mark && (
                  <circle
                    cx={spot && fret === 0 ? LEFT - 12 : (xStart + xEnd) / 2}
                    cy={y}
                    r={10}
                    className="fret-mark-dot"
                  />
                )}
                {showName && (
                  <text
                    x={spot && fret === 0 ? LEFT - 12 : fret === 0 ? LEFT - 48 : (xStart + xEnd) / 2}
                    y={spot ? y - 14 : fret === 0 ? y + 20 : y - 14}
                    textAnchor="middle"
                    className={`fret-note-label ${mark ? 'visible' : ''}`}
                  >
                    {displayName}
                  </text>
                )}
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
