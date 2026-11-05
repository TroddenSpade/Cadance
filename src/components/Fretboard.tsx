import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useI18n } from '../lib/i18n';
import { midiToFullName, midiToName, noteLabelLines, noteName, pitchClass, type Letter, type NoteNaming } from '../lib/music';
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
  /** Open-string MIDI notes, high string first. Defaults to standard tuning. */
  tuning?: number[];
  /** Human-readable tuning name for the group label and accessible name. */
  tuningLabel?: string;
}

const STANDARD_TUNING = [64, 59, 55, 50, 45, 40];
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
  tuning = STANDARD_TUNING,
  tuningLabel,
}: FretboardProps) {
  const { t } = useI18n();
  const fretboardRef = useRef<SVGSVGElement | null>(null);
  const hintId = useId();
  const width = 920;
  const stringCount = Math.max(1, tuning.length);
  const lastStringY = TOP + STRING_GAP * (stringCount - 1);
  const centerString = (stringCount - 1) / 2;
  const centerY = TOP + STRING_GAP * centerString;
  const markerStringIndexes =
    stringCount === 1
      ? [0]
      : Number.isInteger(centerString)
        ? [centerString - 1, centerString + 1]
        : [Math.floor(centerString), Math.ceil(centerString)];
  const height = lastStringY + 58;
  const fretWidth = (RIGHT - LEFT) / FRETS;
  const stringY = (index: number) => TOP + index * STRING_GAP;
  const strings = tuning.map((midi, index) => ({
    midi,
    label: midiToFullName(midi, preferFlats),
    name:
      index === 0 && midi === 64
        ? 'high E'
        : index === tuning.length - 1 && midi === 40
          ? 'low E'
          : midiToName(midi, preferFlats),
  }));

  const defaultPosition = spots?.[0] ?? { string: 0, fret: 0 };
  const [activePosition, setActivePosition] = useState(defaultPosition);

  const focusPosition = (stringIndex: number, fret: number) => {
    setActivePosition({ string: stringIndex, fret });
    fretboardRef.current
      ?.querySelector<SVGGElement>(`[data-string="${stringIndex}"][data-fret="${fret}"]`)
      ?.focus();
  };

  const onKeyDown = (
    event: ReactKeyboardEvent<SVGGElement>,
    stringIndex: number,
    fret: number,
  ) => {
    if (disabled) return;
    const midi = strings[stringIndex].midi + fret;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNote?.(midi, stringIndex, fret);
      return;
    }

    let nextString = stringIndex;
    let nextFret = fret;
    if (event.key === 'ArrowRight') nextFret = Math.min(FRETS, fret + 1);
    else if (event.key === 'ArrowLeft') nextFret = Math.max(0, fret - 1);
    else if (event.key === 'ArrowUp') nextString = Math.max(0, stringIndex - 1);
    else if (event.key === 'ArrowDown') nextString = Math.min(strings.length - 1, stringIndex + 1);
    else if (event.key === 'Home') nextFret = 0;
    else if (event.key === 'End') nextFret = FRETS;
    else return;

    event.preventDefault();
    if (nextString !== stringIndex || nextFret !== fret) {
      focusPosition(nextString, nextFret);
    }
  };

  return (
    <div className="fretboard-scroll">
      <svg
        ref={fretboardRef}
        viewBox={`0 0 ${width} ${height}`}
        className="fretboard"
        role="group"
        aria-label={
          tuningLabel
            ? t('Guitar fretboard, {tuning}, frets 0 to 12', { tuning: tuningLabel })
            : t('Guitar fretboard, standard tuning, frets 0 to 12')
        }
        aria-describedby={disabled ? undefined : hintId}
      >
        <rect x={LEFT} y={TOP - 16} width={RIGHT - LEFT} height={lastStringY - TOP + 32} rx={4} className="fretboard-wood" />

        {MARKER_FRETS.map((fret) => {
          const x = LEFT + (fret - 0.5) * fretWidth;
          if (fret === 12) {
            return (
              <g key={fret}>
                {markerStringIndexes.map((index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={stringY(index)}
                    r={4.5}
                    className="fret-marker"
                  />
                ))}
              </g>
            );
          }
          return <circle key={fret} cx={x} cy={centerY} r={4.5} className="fret-marker" />;
        })}

        {Array.from({ length: FRETS + 1 }, (_, fret) => {
          const x = LEFT + fret * fretWidth;
          return (
            <g key={`fret-${fret}`}>
              <line x1={x} x2={x} y1={TOP - 18} y2={lastStringY + 18} className={fret === 0 ? 'nut' : 'fret'} strokeWidth={fret === 0 ? NUT_WIDTH : 1.6} />
              {fret > 0 && fret < FRETS && (
                <text x={x} y={height - 18} textAnchor="middle" className="fret-number">
                  {fret}
                </text>
              )}
            </g>
          );
        })}

        {strings.map((string, index) => {
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

        {strings.map((string, stringIndex) =>
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
                data-string={stringIndex}
                data-fret={fret}
                className={`fret-position ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => {
                  setActivePosition({ string: stringIndex, fret });
                  if (!disabled) onNote?.(midi, stringIndex, fret);
                }}
                onFocus={() => setActivePosition({ string: stringIndex, fret })}
                role="button"
                tabIndex={
                  disabled
                    ? -1
                    : activePosition.string === stringIndex && activePosition.fret === fret
                      ? 0
                      : -1
                }
                aria-label={t('{string} string, fret {fret}, {note}', {
                  string: t(string.name),
                  fret,
                  note: displayName,
                })}
                onKeyDown={(event) => onKeyDown(event, stringIndex, fret)}
              >
                <rect x={xStart} y={y - 16} width={Math.max(xEnd - xStart, 18)} height={32} rx={5} className="fret-hit" />
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
      {!disabled && (
        <p id={hintId} className="sr-only">
          {t('Use arrow keys to move between strings and frets, then Enter or Space to play.')}
        </p>
      )}
    </div>
  );
}
