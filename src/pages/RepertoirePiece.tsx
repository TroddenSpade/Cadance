import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChordDiagram from '../components/ChordDiagram';
import Icon from '../components/Icons';
import InstrumentSurface from '../components/InstrumentSurface';
import MelodyScore from '../components/MelodyScore';
import PlayAlongControls from '../components/PlayAlongControls';
import Tablature from '../components/Tablature';
import { REPERTOIRE_LEVELS, REPERTOIRE_MAP, type RepertoirePiece } from '../data/repertoire';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';
import { LETTER_SEMITONES, type Letter } from '../lib/music';
import { autoGuitarPosition, STANDARD_GUITAR_TUNING } from '../lib/notation';
import { usePlayAlong, type PlayAlongPattern } from '../lib/playAlong';
import { useProgress } from '../lib/progress';
import { tuningById } from '../lib/tunings';

type Hand = 'right' | 'left' | 'both';

function chordRootMidi(name: string, octave: number): number {
  const match = /^([A-G])([♯♭]?)/.exec(name);
  if (!match) return 48;
  const letter = match[1] as Letter;
  const accidental = match[2] === '♯' ? 1 : match[2] === '♭' ? -1 : 0;
  return (octave + 1) * 12 + LETTER_SEMITONES[letter] + accidental;
}

function melodyPattern(piece: RepertoirePiece): PlayAlongPattern {
  let cursor = 0;
  const events = piece.notes.map((note) => {
    const event = {
      beat: cursor,
      notes: [note.midi],
      beats: note.beats,
      velocity: 0.76,
    };
    cursor += note.beats;
    return event;
  });
  return { events, totalBeats: Math.max(1, cursor), beatsPerBar: piece.beatsPerBar };
}

function leftHandPattern(piece: RepertoirePiece): PlayAlongPattern {
  const melody = melodyPattern(piece);
  const chords = piece.chords ?? [];
  if (!chords.length) return melody;
  const bars = Math.ceil(melody.totalBeats / piece.beatsPerBar);
  const events = Array.from({ length: bars }, (_, bar) => {
    const chord = chords[bar % chords.length];
    const root = chordRootMidi(chord.name, 3);
    return {
      beat: bar * piece.beatsPerBar,
      notes: [root, root + 7],
      beats: piece.beatsPerBar * 0.94,
      velocity: 0.62,
    };
  });
  return { events, totalBeats: melody.totalBeats, beatsPerBar: piece.beatsPerBar };
}

function mergePatterns(first: PlayAlongPattern, second: PlayAlongPattern): PlayAlongPattern {
  return {
    events: [...first.events, ...second.events].sort((a, b) => a.beat - b.beat),
    totalBeats: Math.max(first.totalBeats, second.totalBeats),
    beatsPerBar: first.beatsPerBar,
  };
}

export default function RepertoirePiecePage() {
  const { pieceId } = useParams<{ pieceId: string }>();
  const piece = pieceId ? REPERTOIRE_MAP[pieceId] : undefined;
  const { t } = useI18n();
  const { lessonMap } = useCurriculum();
  const { settings } = useProgress();
  const [hand, setHand] = useState<Hand>('right');

  if (!piece) {
    return (
      <div className="page repertoire-page">
        <header className="page-header">
          <div>
            <span className="eyebrow">{t('Repertoire')}</span>
            <h1>{t('Piece not found')}</h1>
            <p>{t('That piece is not in the library. Choose another one from the graded list.')}</p>
          </div>
        </header>
        <Link className="button primary" to="/repertoire">
          {t('Back to repertoire')}
        </Link>
      </div>
    );
  }

  const right = useMemo(() => melodyPattern(piece), [piece]);
  const left = useMemo(() => leftHandPattern(piece), [piece]);
  const pattern = useMemo(() => {
    if (hand === 'left') return left;
    if (hand === 'both') return mergePatterns(right, left);
    return right;
  }, [hand, left, right]);

  const controls = usePlayAlong(pattern, {
    bpm: piece.bpm,
    countIn: piece.beatsPerBar,
    loop: true,
    click: true,
  });

  const tuning = useMemo(
    () => [...tuningById('guitar', settings.guitarTuning).strings].reverse().map((string) => string.midi),
    [settings.guitarTuning],
  );

  const tabNotes = useMemo(
    () =>
      piece.notes.map((note) => {
        const position =
          autoGuitarPosition(note.midi, tuning, 12) ??
          autoGuitarPosition(note.midi, STANDARD_GUITAR_TUNING, 12) ??
          { string: 0, fret: Math.max(0, Math.min(12, note.midi - STANDARD_GUITAR_TUNING[0])) };
        return { ...position, beats: note.beats };
      }),
    [piece, tuning],
  );

  const leftNotes = useMemo(
    () => left.events.flatMap((event) => event.notes),
    [left],
  );

  const displayedMidis = useMemo(() => {
    const melody = piece.notes.map((note) => note.midi);
    const values =
      hand === 'right' ? melody : hand === 'left' ? leftNotes : [...melody, ...leftNotes];
    return [...new Set(values)].sort((a, b) => a - b);
  }, [hand, leftNotes, piece]);

  const fingers = useMemo(() => {
    const result: Record<number, number> = {};
    piece.notes.forEach((note) => {
      if (note.pianoFinger) result[note.midi] = note.pianoFinger;
    });
    return result;
  }, [piece]);

  const guitarSpots = useMemo(() => {
    if (hand === 'left') {
      return leftNotes.map((midi) => autoGuitarPosition(midi, tuning, 12)).filter(Boolean) as Array<{
        string: number;
        fret: number;
      }>;
    }
    return tabNotes;
  }, [hand, leftNotes, tabNotes, tuning]);

  const tonicPitchClass = chordRootMidi(piece.keyLabel, 4) % 12;
  const lesson = lessonMap[piece.afterLesson];
  const levelTitle =
    REPERTOIRE_LEVELS.find((level) => level.id === piece.level)?.title ?? 'Beginner';

  const hands: Array<{ id: Hand; label: string }> = [
    { id: 'right', label: 'Right hand' },
    { id: 'left', label: 'Left hand' },
    { id: 'both', label: 'Both hands' },
  ];

  return (
    <div className="page repertoire-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/repertoire">{t('Repertoire')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t(piece.title)}</span>
      </nav>

      <header className="repertoire-header">
        <div>
          <span className="eyebrow">
            {t(levelTitle)} · {t('Public domain')}
          </span>
          <h1>{t(piece.title)}</h1>
          <p className="repertoire-composer">{t(piece.composer)}</p>
          <p className="repertoire-summary">{t(piece.summary)}</p>
          <div className="repertoire-chips">
            <span>{piece.keyLabel}</span>
            <span>
              {piece.time[0]}/{piece.time[1]}
            </span>
            <span>{t('{bpm} BPM', { bpm: controls.bpm })}</span>
          </div>
        </div>
        {lesson && (
          <div className="header-stat repertoire-lesson-card">
            <span className="eyebrow">{t('Play this after')}</span>
            <strong>{lesson.title}</strong>
            <Link className="button ghost small" to={`/lesson/${lesson.id}`}>
              <Icon name="book" size={14} /> {t('Open lesson')}
            </Link>
          </div>
        )}
      </header>

      <section className="panel repertoire-practice">
        <div className="repertoire-practice-head">
          <div>
            <span className="eyebrow">{t('Practice room')}</span>
            <h2>{t('Hands, tempo, and repetition')}</h2>
          </div>
          <div className="repertoire-hands" role="group" aria-label={t('Hands')}>
            {hands.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`repertoire-hand ${hand === option.id ? 'active' : ''}`}
                aria-pressed={hand === option.id}
                onClick={() => setHand(option.id)}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
        </div>

        <PlayAlongControls controls={controls} />

        {hand !== 'left' ? (
          <>
            <MelodyScore
              notes={piece.notes}
              clef={piece.clef}
              beatsPerBar={piece.beatsPerBar}
              time={piece.time}
              keySig={piece.keySig}
              preferFlats={piece.preferFlats}
              activeBeat={controls.beat}
              className="repertoire-score"
            />
            <Tablature
              notes={tabNotes}
              beatsPerBar={piece.beatsPerBar}
              tuning={tuning}
              activeBeat={controls.beat}
              className="repertoire-tab"
            />
          </>
        ) : (
          <p className="repertoire-hand-note">
            {t(
              'Left hand: play the root and fifth of each chord in the bass register. Keep the wrist loose and let the pedal, if you use it, change only when the harmony changes.',
            )}
          </p>
        )}

        <div className="repertoire-surface">
          <InstrumentSurface
            pianoKeys={displayedMidis}
            pianoStart={Math.max(21, displayedMidis[0] - 2)}
            pianoEnd={Math.min(108, displayedMidis[displayedMidis.length - 1] + 2)}
            guitarSpots={guitarSpots}
            rootPitchClasses={[tonicPitchClass]}
            fingers={hand === 'left' ? undefined : fingers}
            preferFlats={piece.preferFlats}
          />
          {settings.instrument !== 'piano' && settings.guitarTuning !== 'standard' && (
            <p className="repertoire-tuning-note">
              {t('Tab and fretboard use your saved guitar tuning: {tuning}.', {
                tuning: t(tuningById('guitar', settings.guitarTuning).name),
              })}
            </p>
          )}
        </div>
      </section>

      {piece.chords && piece.chords.length > 0 && (
        <section className="panel repertoire-chords">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Accompaniment')}</span>
              <h2>{t('Open chords with suggested fingers')}</h2>
            </div>
          </div>
          <div className="chord-diagram-grid">
            {piece.chords.map((chord) => (
              <ChordDiagram key={chord.name} shape={chord} />
            ))}
          </div>
        </section>
      )}

      <section className="panel repertoire-plan">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Practice plan')}</span>
            <h2>{t('Five focused passes')}</h2>
          </div>
        </div>
        <ol>
          <li>{t('Count one full bar in, then play only the first phrase at half tempo.')}</li>
          <li>{t('Loop the harder two bars until the fingering is automatic.')}</li>
          <li>{t('Play the right hand alone, then the left hand alone.')}</li>
          <li>{t('Join the hands and keep the pulse even, even if a note slips.')}</li>
          <li>{t('Raise the tempo only after three clean passes in a row.')}</li>
        </ol>
      </section>
    </div>
  );
}
