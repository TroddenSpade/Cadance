import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useI18n } from '../lib/i18n';
import {
  isBlackKey,
  midiToName,
  noteLabelLines,
  pitchClass,
  type Letter,
  type NoteNaming,
} from '../lib/music';

export type MarkState = 'correct' | 'wrong' | 'selected' | 'target' | 'lesson' | 'root';

interface PianoProps {
  onNote?: (midi: number) => void;
  marks?: Record<number, MarkState>;
  showLabels?: boolean;
  naming?: NoteNaming;
  disabled?: boolean;
  startMidi?: number;
  endMidi?: number;
  height?: number;
  preferFlats?: boolean;
  /** Exact keys to mark. When present, these replace the pitch-class `marks`. */
  markedKeys?: number[];
  /** Pitch classes drawn with root emphasis inside `markedKeys`. */
  rootPitchClasses?: number[];
}

const WHITE_WIDTH = 50;
const WHITE_HEIGHT = 206;
const BLACK_WIDTH = 30;
const BLACK_HEIGHT = 126;

function labelLines(midi: number, preferFlats: boolean, naming: NoteNaming): string[] {
  const name = midiToName(midi, preferFlats);
  const letter = name[0] as Letter;
  const accidental = name.includes('♯') ? 1 : name.includes('♭') ? -1 : 0;
  return noteLabelLines(letter, accidental, naming);
}

export default function Piano({
  onNote,
  marks = {},
  showLabels = true,
  naming = 'both',
  disabled = false,
  startMidi = 48,
  endMidi = 72,
  preferFlats = false,
  markedKeys,
  rootPitchClasses = [],
}: PianoProps) {
  const { t } = useI18n();
  const keyboardRef = useRef<SVGSVGElement | null>(null);
  const hintId = useId();
  const whites: number[] = [];
  const blacks: number[] = [];
  const allKeys: number[] = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    allKeys.push(midi);
    if (isBlackKey(midi)) blacks.push(midi);
    else whites.push(midi);
  }
  const width = whites.length * WHITE_WIDTH;
  const height = WHITE_HEIGHT + 6;

  const defaultActive =
    markedKeys?.find((midi) => allKeys.includes(midi)) ??
    (allKeys.includes(60) ? 60 : allKeys[0]);
  const [activeMidi, setActiveMidi] = useState(defaultActive);

  useEffect(() => {
    if (!allKeys.includes(activeMidi)) setActiveMidi(defaultActive);
  }, [activeMidi, defaultActive, startMidi, endMidi]);

  const focusKey = (midi: number) => {
    setActiveMidi(midi);
    keyboardRef.current?.querySelector<SVGGElement>(`[data-midi="${midi}"]`)?.focus();
  };

  const onKeyDown = (event: ReactKeyboardEvent<SVGGElement>, midi: number) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNote?.(midi);
      return;
    }

    let next: number | null = null;
    if (event.key === 'ArrowRight') next = midi + 1;
    else if (event.key === 'ArrowLeft') next = midi - 1;
    else if (event.key === 'ArrowUp') next = midi + 12;
    else if (event.key === 'ArrowDown') next = midi - 12;
    else if (event.key === 'Home') next = startMidi;
    else if (event.key === 'End') next = endMidi;

    if (next === null) return;
    event.preventDefault();
    const clamped = Math.max(startMidi, Math.min(endMidi, next));
    if (clamped !== midi) focusKey(clamped);
  };

  const markFor = (midi: number): MarkState | undefined => {
    if (markedKeys) {
      if (!markedKeys.includes(midi)) return undefined;
      return rootPitchClasses.includes(pitchClass(midi)) ? 'root' : 'lesson';
    }
    return marks[pitchClass(midi)];
  };

  const whiteIndex = (midi: number) => whites.filter((value) => value < midi).length;

  return (
    <div className="piano-wrap">
      <svg
        ref={keyboardRef}
        viewBox={`0 0 ${width} ${height}`}
        className="piano"
        role="group"
        aria-label={t('Piano keyboard')}
        aria-describedby={disabled ? undefined : hintId}
      >
        {whites.map((midi, index) => {
          const mark = markFor(midi);
          const name = midiToName(midi, preferFlats);
          const lines = labelLines(midi, preferFlats, naming);
          return (
            <g
              key={midi}
              data-midi={midi}
              className={`piano-key white ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => {
                setActiveMidi(midi);
                if (!disabled) onNote?.(midi);
              }}
              onFocus={() => setActiveMidi(midi)}
              role="button"
              tabIndex={disabled ? -1 : midi === activeMidi ? 0 : -1}
              aria-label={t(midi === 60 ? 'Piano key {note} middle C' : 'Piano key {note}', {
                note: lines.join(' '),
              })}
              onKeyDown={(event) => onKeyDown(event, midi)}
            >
              <rect x={index * WHITE_WIDTH + 1} y={1} width={WHITE_WIDTH - 2} height={WHITE_HEIGHT} rx={5} />
              {mark && <rect className="key-mark" x={index * WHITE_WIDTH + 5} y={WHITE_HEIGHT - 18} width={WHITE_WIDTH - 10} height={5} rx={2.5} />}
              {showLabels && (
                <>
                  <text
                    x={index * WHITE_WIDTH + WHITE_WIDTH / 2}
                    y={lines.length > 1 ? WHITE_HEIGHT - 42 : WHITE_HEIGHT - 30}
                    className={`piano-label ${name === 'C' ? 'is-c' : ''}`}
                  >
                    {lines[0]}
                  </text>
                  {lines[1] && (
                    <text
                      x={index * WHITE_WIDTH + WHITE_WIDTH / 2}
                      y={WHITE_HEIGHT - 23}
                      className={`piano-label piano-solfege ${name === 'C' ? 'is-c' : ''}`}
                    >
                      {lines[1]}
                    </text>
                  )}
                </>
              )}
              {name === 'C' && (
                <text x={index * WHITE_WIDTH + WHITE_WIDTH / 2} y={WHITE_HEIGHT - 10} className="piano-octave">
                  {Math.floor(midi / 12) - 1}
                </text>
              )}
            </g>
          );
        })}

        {blacks.map((midi) => {
          const before = whiteIndex(midi);
          const x = before * WHITE_WIDTH - BLACK_WIDTH / 2;
          const mark = markFor(midi);
          const name = midiToName(midi, preferFlats);
          const lines = labelLines(midi, preferFlats, naming);
          return (
            <g
              key={midi}
              data-midi={midi}
              className={`piano-key black ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => {
                setActiveMidi(midi);
                if (!disabled) onNote?.(midi);
              }}
              onFocus={() => setActiveMidi(midi)}
              role="button"
              tabIndex={disabled ? -1 : midi === activeMidi ? 0 : -1}
              aria-label={t('Piano key {note}', { note: lines.join(' ') })}
              onKeyDown={(event) => onKeyDown(event, midi)}
            >
              <rect x={x} y={0} width={BLACK_WIDTH} height={BLACK_HEIGHT} rx={4} />
              {mark && <rect className="key-mark" x={x + 6} y={BLACK_HEIGHT - 14} width={BLACK_WIDTH - 12} height={4} rx={2} />}
              {showLabels && (
                <>
                  <text
                    x={x + BLACK_WIDTH / 2}
                    y={lines.length > 1 ? BLACK_HEIGHT - 34 : BLACK_HEIGHT - 22}
                    className="piano-label black-label"
                  >
                    {lines[0]}
                  </text>
                  {lines[1] && (
                    <text x={x + BLACK_WIDTH / 2} y={BLACK_HEIGHT - 22} className="piano-label black-label piano-solfege">
                      {lines[1]}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
      {!disabled && (
        <p id={hintId} className="sr-only">
          {t('Use arrow keys to move between keys, then Enter or Space to play.')}
        </p>
      )}
    </div>
  );
}
