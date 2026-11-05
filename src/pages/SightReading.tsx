import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import InstrumentSurface from '../components/InstrumentSurface';
import MelodyScore from '../components/MelodyScore';
import PlayAlongControls from '../components/PlayAlongControls';
import type { MarkState } from '../components/Piano';
import { useI18n } from '../lib/i18n';
import { midiToName, pitchClass } from '../lib/music';
import { usePlayAlong } from '../lib/playAlong';
import {
  SIGHT_READING_LEVELS,
  checkSightReading,
  generateSightReading,
  sightReadingPattern,
  type SightReadingLevelId,
} from '../lib/sightReading';

export default function SightReading() {
  const { t } = useI18n();
  const [levelId, setLevelId] = useState<SightReadingLevelId>('treble-steps');
  const [exercise, setExercise] = useState(() => generateSightReading('treble-steps'));
  const [played, setPlayed] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const level =
    SIGHT_READING_LEVELS.find((candidate) => candidate.id === levelId) ??
    SIGHT_READING_LEVELS[0];
  const pattern = useMemo(() => sightReadingPattern(exercise), [exercise]);
  const controls = usePlayAlong(pattern, {
    bpm: exercise.bpm,
    loop: false,
    countIn: 4,
    click: true,
  });

  const result = checked ? checkSightReading(exercise, played) : null;

  const marks = useMemo(() => {
    if (!result) return {} as Record<number, MarkState>;
    const values: Record<number, MarkState> = {};
    const targetPcs = new Set(exercise.notes.map((note) => pitchClass(note.midi)));
    exercise.notes.forEach((note, index) => {
      if (result.matched[index]) values[pitchClass(note.midi)] = 'correct';
    });
    exercise.notes.forEach((note, index) => {
      const pc = pitchClass(note.midi);
      if (!result.matched[index] && values[pc] === undefined) values[pc] = 'target';
    });
    played.forEach((midi) => {
      const pc = pitchClass(midi);
      if (!targetPcs.has(pc)) values[pc] = 'wrong';
    });
    return values;
  }, [exercise, played, result]);

  const startNew = (nextLevel: SightReadingLevelId = levelId) => {
    const next = generateSightReading(nextLevel);
    controls.stop();
    controls.setBpm(next.bpm);
    setExercise(next);
    setPlayed([]);
    setChecked(false);
  };

  const chooseLevel = (id: SightReadingLevelId) => {
    setLevelId(id);
    startNew(id);
  };

  const handleNote = (midi: number) => {
    if (checked) return;
    setPlayed((current) =>
      current.length >= exercise.notes.length ? current : [...current, midi],
    );
  };

  const undo = () => {
    setChecked(false);
    setPlayed((current) => current.slice(0, -1));
  };

  const clear = () => {
    setChecked(false);
    setPlayed([]);
  };

  const check = () => {
    if (!played.length) return;
    controls.stop();
    setChecked(true);
  };

  const midis = exercise.notes.map((note) => note.midi);
  const pianoStart = Math.max(21, Math.min(...midis) - 2);
  const pianoEnd = Math.min(108, Math.max(...midis) + 2);
  const mistakes = result
    ? exercise.notes
        .map((note, index) =>
          result.matched[index]
            ? null
            : {
                index,
                expected: midiToName(note.midi, exercise.preferFlats),
                played:
                  played[index] !== undefined
                    ? midiToName(played[index], exercise.preferFlats)
                    : null,
              },
        )
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return (
    <div className="page sight-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Sight reading')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Read before you play')}</span>
          <h1>{t('Sight-reading room')}</h1>
          <p>
            {t(
              'Four bars at a time. Read the score, then play it on your instrument in order. The count-in and click keep the pulse honest.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Current level')}</span>
          <strong>{t(level.label)}</strong>
          <Link className="text-link" to="/settings">
            {t('Instrument settings')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </header>

      <section className="panel sight-setup">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Choose a level')}</span>
            <h2>{t('From steps to accidentals')}</h2>
          </div>
        </div>
        <div className="sight-levels">
          {SIGHT_READING_LEVELS.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={`sight-level ${levelId === option.id ? 'selected' : ''}`}
              aria-pressed={levelId === option.id}
              onClick={() => chooseLevel(option.id)}
            >
              <span className="sight-level-number">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>{t(option.label)}</strong>
                <small>{t(option.description)}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel sight-room">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Practice room')}</span>
            <h2>{t(level.label)}</h2>
            <p className="room-note">{t(level.description)}</p>
          </div>
          <button className="button secondary small" onClick={() => startNew()}>
            <Icon name="refresh" size={14} /> {t('New example')}
          </button>
        </div>

        <PlayAlongControls controls={controls} label={t('Reference tempo')} />

        <MelodyScore
          notes={exercise.notes}
          clef={exercise.clef}
          beatsPerBar={exercise.beatsPerBar}
          time={exercise.time}
          preferFlats={exercise.preferFlats}
          activeBeat={controls.beat}
          className="sight-score"
        />

        <div className="sight-slots" aria-label={t('Note slots')}>
          {exercise.notes.map((note, index) => {
            const filled = played[index] !== undefined;
            const status =
              checked && result
                ? result.matched[index]
                  ? 'correct'
                  : 'wrong'
                : filled
                  ? 'filled'
                  : '';
            return (
              <span key={index} className={`sight-slot ${status}`}>
                <strong>{index + 1}</strong>
                <small>
                  {checked && result && !result.matched[index]
                    ? midiToName(note.midi, exercise.preferFlats)
                    : filled
                      ? midiToName(played[index]!, exercise.preferFlats)
                      : '—'}
                </small>
              </span>
            );
          })}
        </div>

        <div className="sight-actions">
          <span className="sight-count">
            {t('{n} / {total} notes', { n: played.length, total: exercise.notes.length })}
          </span>
          <button className="button ghost small" onClick={undo} disabled={!played.length}>
            {t('Undo')}
          </button>
          <button className="button ghost small" onClick={clear} disabled={!played.length}>
            {t('Clear')}
          </button>
          <button
            className="button primary small"
            onClick={check}
            disabled={!played.length}
          >
            {t('Check reading')}
          </button>
        </div>

        {checked && result && (
          <div
            className={`sight-feedback ${result.correct ? 'correct' : 'wrong'}`}
            role="status"
          >
            <strong>
              {result.correct
                ? t('Clean read — every pitch in order.')
                : t('{matched} of {total} pitches matched.', {
                    matched: result.matched.filter(Boolean).length,
                    total: result.total,
                  })}
            </strong>
            {result.played < result.total && (
              <p>
                {t('You played {played} of {total} notes.', {
                  played: result.played,
                  total: result.total,
                })}
              </p>
            )}
            {mistakes.length > 0 && (
              <ul>
                {mistakes.map(
                  (mistake) =>
                    mistake && (
                      <li key={mistake.index}>
                        {mistake.played
                          ? t('Note {n}: expected {expected}, you played {played}.', {
                              n: mistake.index + 1,
                              expected: mistake.expected,
                              played: mistake.played,
                            })
                          : t('Note {n}: expected {expected}, not played.', {
                              n: mistake.index + 1,
                              expected: mistake.expected,
                            })}
                      </li>
                    ),
                )}
              </ul>
            )}
            {result.correct && (
              <p>
                {t('Now try it once more at the same tempo without looking at the note names.')}
              </p>
            )}
          </div>
        )}

        <div className="sight-surface">
          <InstrumentSurface
            onNote={handleNote}
            marks={marks}
            pianoStart={pianoStart}
            pianoEnd={pianoEnd}
            preferFlats={exercise.preferFlats}
          />
        </div>
      </section>

      <section className="panel sight-tips">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('How to read it')}</span>
            <h2>{t('Eyes ahead, hands steady')}</h2>
          </div>
        </div>
        <ol>
          <li>{t('Say the first three notes in your head before you play.')}</li>
          <li>{t('Start the count-in, then play one note per click unless the score shows a pair.')}</li>
          <li>{t('If you miss a note, keep going. Stopping to fix it breaks the read.')}</li>
          <li>{t('Repeat the same example until it is clean, then raise the tempo.')}</li>
        </ol>
      </section>
    </div>
  );
}
