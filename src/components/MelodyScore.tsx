import { useI18n } from '../lib/i18n';
import {
  FLAT_ORDER,
  KEY_SIG_POSITIONS,
  SHARP_ORDER,
  diatonicStep,
  type KeySignatureKind,
  type Letter,
} from '../lib/music';
import { spellMidi } from '../lib/notation';
import type { Clef } from '../lib/types';

export interface ScoreNote {
  midi: number;
  /** Duration in beats. */
  beats: number;
}

interface MelodyScoreProps {
  notes: ScoreNote[];
  clef: Clef;
  beatsPerBar?: number;
  time?: [number, number];
  keySig?: { count: number; type: KeySignatureKind };
  preferFlats?: boolean;
  /** Absolute beat since the pattern began, used to draw a play cursor. */
  activeBeat?: number;
  className?: string;
}

const LINE_GAP = 13;
const TOP = 58;
const HEIGHT = 214;
const MIDDLE_STEP = 34;
const BASS_MIDDLE_STEP = 22;

function staffY(letter: Letter, octave: number, clef: Clef): number {
  const middleStep = clef === 'treble' ? MIDDLE_STEP : BASS_MIDDLE_STEP;
  const diff = diatonicStep(letter, octave) - middleStep;
  return TOP + LINE_GAP * 2 - diff * (LINE_GAP / 2);
}

function ledgerLines(y: number, x: number) {
  const lines: number[] = [];
  const top = TOP;
  const bottom = TOP + LINE_GAP * 4;
  if (y < top) {
    for (let lineY = top - LINE_GAP; lineY >= y - 0.1; lineY -= LINE_GAP) lines.push(lineY);
  } else if (y > bottom) {
    for (let lineY = bottom + LINE_GAP; lineY <= y + 0.1; lineY += LINE_GAP) lines.push(lineY);
  }
  return lines.map((lineY) => (
    <line
      key={`ledger-${x}-${lineY}`}
      x1={x - 14}
      x2={x + 14}
      y1={lineY}
      y2={lineY}
      className="staff-ledger"
    />
  ));
}

function accidentalFor(
  keySig: { count: number; type: KeySignatureKind } | undefined,
): Map<Letter, number> {
  const alterations = new Map<Letter, number>();
  if (!keySig || keySig.count <= 0) return alterations;
  const order = keySig.type === 'sharp' ? SHARP_ORDER : FLAT_ORDER;
  order.slice(0, keySig.count).forEach((letter) => {
    alterations.set(letter, keySig.type === 'sharp' ? 1 : -1);
  });
  return alterations;
}

/**
 * A single-system melody staff. It is deliberately simpler than a full
 * engraver: one horizontal line with bar lines, correct pitch placement,
 * durations, and an optional play cursor. That is enough for short graded
 * repertoire and keeps the SVG light.
 */
export default function MelodyScore({
  notes,
  clef,
  beatsPerBar = 4,
  time,
  keySig,
  preferFlats = false,
  activeBeat = -1,
  className = '',
}: MelodyScoreProps) {
  const { t } = useI18n();
  const keyCount = keySig?.count ?? 0;
  const keyType = keySig?.type;
  const clefWidth = clef === 'treble' ? 40 : 46;
  const keyStart = 18 + clefWidth + 8;
  const keySpacing = 13;
  const afterKey = keyStart + keyCount * keySpacing;
  const timeX = afterKey + 14;
  const startX = Math.max(afterKey + 38, time ? 150 : 126);
  const totalBeats = Math.max(1, notes.reduce((sum, note) => sum + note.beats, 0));
  const beatWidth = 36;
  const width = Math.max(680, startX + totalBeats * beatWidth + 44);
  const alterations = accidentalFor(keySig);

  const keyNotes =
    keyCount > 0 && keyType
      ? KEY_SIG_POSITIONS[clef][keyType]
          .slice(0, keyCount)
          .map(([letter, octave], index) => ({
            letter,
            octave,
            x: keyStart + index * keySpacing,
            y: staffY(letter, octave, clef),
          }))
      : [];

  let cursor = 0;
  const positioned = notes.map((note, index) => {
    const spelled = spellMidi(note.midi, preferFlats);
    const x = startX + cursor * beatWidth;
    const y = staffY(spelled.letter, spelled.octave, clef);
    const startBeat = cursor;
    cursor += note.beats;
    return { ...note, ...spelled, x, y, index, startBeat };
  });

  const bars = Math.ceil(totalBeats / beatsPerBar);
  const middleY = TOP + LINE_GAP * 2;
  const cursorX = activeBeat >= 0 ? startX + activeBeat * beatWidth : -1;

  return (
    <div className={`melody-score-scroll ${className}`}>
      <svg
        className="staff melody-score"
        viewBox={`0 0 ${width} ${HEIGHT}`}
        style={{ width }}
        role="img"
        aria-label={t('Melody score with {count} notes in {clef} clef', {
          count: notes.length,
          clef: t(clef === 'treble' ? 'treble' : 'bass'),
        })}
      >
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1={20}
            x2={width - 20}
            y1={TOP + line * LINE_GAP}
            y2={TOP + line * LINE_GAP}
            className="staff-line"
          />
        ))}

        <text
          x={16}
          y={clef === 'treble' ? 105 : 113}
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

        {time && (
          <g className="staff-time">
            <text x={timeX} y={TOP + LINE_GAP * 1.7} fontSize={21} textAnchor="middle">
              {time[0]}
            </text>
            <text x={timeX} y={TOP + LINE_GAP * 3.6} fontSize={21} textAnchor="middle">
              {time[1]}
            </text>
          </g>
        )}

        {Array.from({ length: bars + 1 }, (_, bar) => {
          const x = startX + bar * beatsPerBar * beatWidth;
          return (
            <line
              key={`bar-${bar}`}
              x1={x}
              x2={x}
              y1={TOP}
              y2={TOP + LINE_GAP * 4}
              className={bar === bars ? 'staff-barline end' : 'staff-barline'}
            />
          );
        })}

        {positioned.map((note) => {
          const hollow = note.beats >= 2;
          const hasStem = note.beats < 4;
          const stemDown = note.y <= middleY;
          const stemX = stemDown ? note.x - 7 : note.x + 7;
          const stemEnd = stemDown ? note.y + 42 : note.y - 42;
          const flags = note.beats <= 0.25 ? 2 : note.beats <= 0.5 ? 1 : 0;
          const showAccidental =
            note.accidental !== 0 && alterations.get(note.letter) !== note.accidental;
          const noteActive =
            activeBeat >= note.startBeat && activeBeat < note.startBeat + note.beats;
          return (
            <g
              key={`note-${note.index}`}
              className={noteActive ? 'score-note active' : 'score-note'}
            >
              {ledgerLines(note.y, note.x)}
              {showAccidental && (
                <text
                  x={note.x - 20}
                  y={note.y + 5}
                  fontSize={22}
                  className="music-glyph staff-accidental"
                  textAnchor="middle"
                >
                  {note.accidental === 1 ? '♯' : '♭'}
                </text>
              )}
              <ellipse
                cx={note.x}
                cy={note.y}
                rx={7.4}
                ry={5.3}
                transform={`rotate(-18 ${note.x} ${note.y})`}
                className="staff-note-head"
                fill={hollow ? 'none' : 'currentColor'}
              />
              {hasStem && (
                <line
                  x1={stemX}
                  x2={stemX}
                  y1={note.y}
                  y2={stemEnd}
                  className="staff-stem"
                />
              )}
              {flags > 0 &&
                Array.from({ length: flags }, (_, flag) => (
                  <path
                    key={`flag-${flag}`}
                    d={`M ${stemX} ${stemEnd + flag * 9} q 13 5 16 15`}
                    className="staff-flag"
                  />
                ))}
              {note.beats === 3 && <circle cx={note.x + 17} cy={note.y} r={2.4} className="staff-dot" />}
            </g>
          );
        })}

        {cursorX >= 0 && (
          <line
            x1={cursorX}
            x2={cursorX}
            y1={TOP - 18}
            y2={TOP + LINE_GAP * 4 + 18}
            className="score-cursor"
          />
        )}
      </svg>
    </div>
  );
}
