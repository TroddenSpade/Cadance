import { useI18n } from '../lib/i18n';
import { midiToName } from '../lib/music';
import { STANDARD_GUITAR_TUNING } from '../lib/notation';

export interface TabNote {
  /** 0 is the high E string, matching the fretboard. */
  string: number;
  fret: number;
  /** Duration in beats, used for spacing. */
  beats: number;
}

interface TablatureProps {
  notes: TabNote[];
  beatsPerBar?: number;
  /** Open-string MIDI notes, high string first. */
  tuning?: number[];
  activeBeat?: number;
  className?: string;
}

const TOP = 34;
const STRING_GAP = 22;
const START_X = 62;

/**
 * Guitar tablature with fret numbers, bar lines, and a play cursor. Rhythm is
 * shown by horizontal spacing rather than stems; the staff above the tab is the
 * rhythmic reference.
 */
export default function Tablature({
  notes,
  beatsPerBar = 4,
  tuning = STANDARD_GUITAR_TUNING,
  activeBeat = -1,
  className = '',
}: TablatureProps) {
  const { t } = useI18n();
  const strings = Math.max(1, tuning.length);
  const height = TOP + (strings - 1) * STRING_GAP + 42;
  const totalBeats = Math.max(1, notes.reduce((sum, note) => sum + note.beats, 0));
  const beatWidth = 36;
  const width = Math.max(560, START_X + totalBeats * beatWidth + 36);
  const bars = Math.ceil(totalBeats / beatsPerBar);

  let cursor = 0;
  const positioned = notes.map((note, index) => {
    const x = START_X + cursor * beatWidth;
    const startBeat = cursor;
    cursor += note.beats;
    return { ...note, x, startBeat, index };
  });

  const cursorX = activeBeat >= 0 ? START_X + activeBeat * beatWidth : -1;

  return (
    <div className={`tablature-scroll ${className}`}>
      <svg
        className="tablature"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width }}
        role="img"
        aria-label={t('Guitar tablature with {count} notes', { count: notes.length })}
      >
        {Array.from({ length: strings }, (_, string) => {
          const y = TOP + string * STRING_GAP;
          return (
            <line
              key={`string-${string}`}
              x1={START_X - 8}
              x2={width - 18}
              y1={y}
              y2={y}
              className="tab-string"
            />
          );
        })}

        {tuning.map((midi, index) => (
          <text
            key={`label-${index}`}
            x={START_X - 22}
            y={TOP + index * STRING_GAP + 4}
            className="tab-string-label"
            textAnchor="end"
          >
            {midiToName(midi)}
          </text>
        ))}

        {Array.from({ length: bars + 1 }, (_, bar) => {
          const x = START_X + bar * beatsPerBar * beatWidth;
          return (
            <line
              key={`bar-${bar}`}
              x1={x}
              x2={x}
              y1={TOP - 8}
              y2={TOP + (strings - 1) * STRING_GAP + 8}
              className={bar === bars ? 'staff-barline end' : 'staff-barline'}
            />
          );
        })}

        {positioned.map((note) => {
          if (note.string < 0 || note.string >= strings) return null;
          const y = TOP + note.string * STRING_GAP;
          const noteActive =
            activeBeat >= note.startBeat && activeBeat < note.startBeat + note.beats;
          return (
            <g key={`tab-${note.index}`} className={noteActive ? 'tab-note active' : 'tab-note'}>
              <circle cx={note.x} cy={y} r={10} className="tab-note-dot" />
              <text x={note.x} y={y + 4.5} textAnchor="middle" className="tab-fret">
                {note.fret}
              </text>
            </g>
          );
        })}

        {cursorX >= 0 && (
          <line
            x1={cursorX}
            x2={cursorX}
            y1={TOP - 10}
            y2={TOP + (strings - 1) * STRING_GAP + 10}
            className="score-cursor"
          />
        )}
      </svg>
    </div>
  );
}
