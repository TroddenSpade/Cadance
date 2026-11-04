import { useI18n } from '../lib/i18n';
import { KEY_SIG_POSITIONS, diatonicStep, type Letter } from '../lib/music';
import type { StaffSpec } from '../lib/types';

const LINE_GAP = 13;
const TOP = 52;
const WIDTH = 680;
const HEIGHT = 198;
const MIDDLE_STEP = 34;
const BASS_MIDDLE_STEP = 22;

function staffY(letter: Letter, octave: number, clef: 'treble' | 'bass'): number {
  const middleStep = clef === 'treble' ? MIDDLE_STEP : BASS_MIDDLE_STEP;
  const diff = diatonicStep(letter, octave) - middleStep;
  return TOP + LINE_GAP * 2 - diff * (LINE_GAP / 2);
}

function ledgerYs(y: number, x: number) {
  const lines: number[] = [];
  const top = TOP;
  const bottom = TOP + LINE_GAP * 4;
  if (y < top) {
    for (let lineY = top - LINE_GAP; lineY >= y - 0.1; lineY -= LINE_GAP) lines.push(lineY);
  } else if (y > bottom) {
    for (let lineY = bottom + LINE_GAP; lineY <= y + 0.1; lineY += LINE_GAP) lines.push(lineY);
  }
  return lines.map((lineY) => (
    <line key={`ledger-${x}-${lineY}`} x1={x - 13} x2={x + 13} y1={lineY} y2={lineY} className="staff-ledger" />
  ));
}

export default function Staff({ spec, className = '' }: { spec: StaffSpec; className?: string }) {
  const { t } = useI18n();
  const clef = spec.clef;
  const keyCount = spec.keySig?.count ?? 0;
  const keyType = spec.keySig?.type;
  const clefWidth = clef === 'treble' ? 40 : 46;
  const keyStart = 14 + clefWidth + 8;
  const keySpacing = 13;
  const afterKey = keyStart + keyCount * keySpacing;
  const timeX = afterKey + 14;
  let notesStart = Math.max(afterKey + 34, 132);
  if (spec.time) notesStart += 34;

  const noteGap = spec.notes.length > 5 ? 56 : 78;
  const notes = spec.notes.map((note) => {
    const y = staffY(note.letter, note.octave, clef);
    return { ...note, y };
  });

  const sameX = spec.chord;
  const baseX = notesStart;
  const positions = notes.map((note, index) => ({
    ...note,
    x: sameX ? baseX + 20 : baseX + index * noteGap,
  }));

  const middleY = TOP + LINE_GAP * 2;
  const chordDirection =
    positions.length && positions.reduce((sum, note) => sum + note.y, 0) / positions.length <= middleY
      ? 'down'
      : 'up';

  const keyNotes =
    keyCount > 0 && keyType
      ? KEY_SIG_POSITIONS[clef][keyType].slice(0, keyCount).map(([letter, octave], index) => ({
          letter,
          octave,
          x: keyStart + index * keySpacing,
          y: staffY(letter, octave, clef),
        }))
      : [];

  const staffLabel =
    clef === 'treble'
      ? t(spec.notes.length === 1 ? 'treble clef staff with {count} note' : 'treble clef staff with {count} notes', {
          count: spec.notes.length,
        })
      : t(spec.notes.length === 1 ? 'bass clef staff with {count} note' : 'bass clef staff with {count} notes', {
          count: spec.notes.length,
        });

  return (
    <svg
      className={`staff ${className}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={staffLabel}
    >
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1={20}
          x2={WIDTH - 20}
          y1={TOP + line * LINE_GAP}
          y2={TOP + line * LINE_GAP}
          className="staff-line"
        />
      ))}

      <text
        x={14}
        y={clef === 'treble' ? 99 : 107}
        fontSize={clef === 'treble' ? 52 : 54}
        className="music-glyph staff-clef"
      >
        {clef === 'treble' ? '𝄞' : '𝄢'}
      </text>

      {keyNotes.map((key, index) => (
        <text
          key={`key-${index}`}
          x={key.x}
          y={key.y + (keyType === 'flat' ? 5.5 : 4.5)}
          fontSize={22}
          className="music-glyph staff-accidental"
        >
          {keyType === 'flat' ? '♭' : '♯'}
        </text>
      ))}

      {spec.time && (
        <g className="staff-time">
          <text x={timeX} y={TOP + LINE_GAP * 1.7} fontSize={21} textAnchor="middle">
            {spec.time[0]}
          </text>
          <text x={timeX} y={TOP + LINE_GAP * 3.6} fontSize={21} textAnchor="middle">
            {spec.time[1]}
          </text>
        </g>
      )}

      {positions.map((note, index) => {
        const stemDirection = note.y <= middleY ? 'down' : 'up';
        return (
          <g key={`note-${index}`}>
            {ledgerYs(note.y, note.x)}
            {note.accidental !== 0 && (
              <text x={note.x - 19} y={note.y + 5} fontSize={22} className="music-glyph staff-accidental" textAnchor="middle">
                {note.accidental === 1 ? '♯' : '♭'}
              </text>
            )}
            <ellipse cx={note.x} cy={note.y} rx={7.4} ry={5.3} transform={`rotate(-18 ${note.x} ${note.y})`} className="staff-note-head" />
            {!spec.chord && (
              <line
                x1={stemDirection === 'down' ? note.x - 6.8 : note.x + 6.8}
                x2={stemDirection === 'down' ? note.x - 6.8 : note.x + 6.8}
                y1={note.y}
                y2={stemDirection === 'down' ? note.y + 40 : note.y - 40}
                className="staff-stem"
              />
            )}
          </g>
        );
      })}

      {spec.chord && positions.length > 1 && (
        <line
          x1={chordDirection === 'down' ? baseX + 20 - 7 : baseX + 20 + 7}
          x2={chordDirection === 'down' ? baseX + 20 - 7 : baseX + 20 + 7}
          y1={
            chordDirection === 'down'
              ? Math.min(...positions.map((p) => p.y))
              : Math.max(...positions.map((p) => p.y))
          }
          y2={
            chordDirection === 'down'
              ? Math.max(...positions.map((p) => p.y)) + 40
              : Math.min(...positions.map((p) => p.y)) - 40
          }
          className="staff-stem"
        />
      )}
    </svg>
  );
}
