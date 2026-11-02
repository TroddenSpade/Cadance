import { isBlackKey, midiToName, pitchClass } from '../lib/music';

export type MarkState = 'correct' | 'wrong' | 'selected' | 'target';

interface PianoProps {
  onNote?: (midi: number) => void;
  marks?: Record<number, MarkState>;
  showLabels?: boolean;
  disabled?: boolean;
  startMidi?: number;
  endMidi?: number;
  height?: number;
  preferFlats?: boolean;
}

const WHITE_WIDTH = 50;
const WHITE_HEIGHT = 206;
const BLACK_WIDTH = 30;
const BLACK_HEIGHT = 126;

export default function Piano({
  onNote,
  marks = {},
  showLabels = true,
  disabled = false,
  startMidi = 48,
  endMidi = 72,
  preferFlats = false,
}: PianoProps) {
  const whites: number[] = [];
  const blacks: number[] = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi)) blacks.push(midi);
    else whites.push(midi);
  }
  const width = whites.length * WHITE_WIDTH;
  const height = WHITE_HEIGHT + 6;

  const whiteIndex = (midi: number) => whites.filter((value) => value < midi).length;

  return (
    <div className="piano-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="piano"
        role="group"
        aria-label="Piano keyboard"
      >
        {whites.map((midi, index) => {
          const mark = marks[pitchClass(midi)];
          const name = midiToName(midi, preferFlats);
          return (
            <g
              key={midi}
              className={`piano-key white ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onNote?.(midi)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Piano key ${name}${midi === 60 ? ' middle C' : ''}`}
              onKeyDown={(event) => {
                if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onNote?.(midi);
                }
              }}
            >
              <rect x={index * WHITE_WIDTH + 1} y={1} width={WHITE_WIDTH - 2} height={WHITE_HEIGHT} rx={5} />
              {mark && <rect className="key-mark" x={index * WHITE_WIDTH + 5} y={WHITE_HEIGHT - 18} width={WHITE_WIDTH - 10} height={5} rx={2.5} />}
              {showLabels && (
                <text x={index * WHITE_WIDTH + WHITE_WIDTH / 2} y={WHITE_HEIGHT - 30} className={`piano-label ${name === 'C' ? 'is-c' : ''}`}>
                  {name}
                </text>
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
          const mark = marks[pitchClass(midi)];
          const name = midiToName(midi, preferFlats);
          return (
            <g
              key={midi}
              className={`piano-key black ${mark ? `mark-${mark}` : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onNote?.(midi)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Piano key ${name}`}
              onKeyDown={(event) => {
                if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  onNote?.(midi);
                }
              }}
            >
              <rect x={x} y={0} width={BLACK_WIDTH} height={BLACK_HEIGHT} rx={4} />
              {mark && <rect className="key-mark" x={x + 6} y={BLACK_HEIGHT - 14} width={BLACK_WIDTH - 12} height={4} rx={2} />}
              {showLabels && (
                <text x={x + BLACK_WIDTH / 2} y={BLACK_HEIGHT - 22} className="piano-label black-label">
                  {name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
