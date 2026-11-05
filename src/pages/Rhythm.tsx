import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import PlayAlongControls from '../components/PlayAlongControls';
import RhythmDisplay from '../components/RhythmDisplay';
import { useI18n } from '../lib/i18n';
import { rhythmPattern, usePlayAlong } from '../lib/playAlong';
import {
  RHYTHM_LEVELS,
  clickOnlyPattern,
  generateRhythm,
  rhythmOnsets,
  scoreEcho,
  type EchoScore,
  type RhythmLevelId,
} from '../lib/rhythm';

export default function Rhythm() {
  const { t } = useI18n();
  const [levelId, setLevelId] = useState<RhythmLevelId>('steady');
  const [items, setItems] = useState(() => generateRhythm('steady'));
  const [mode, setMode] = useState<'listen' | 'tap'>('listen');
  const [taps, setTaps] = useState<number[]>([]);
  const [score, setScore] = useState<EchoScore | null>(null);
  const startRef = useRef<number | null>(null);

  const level =
    RHYTHM_LEVELS.find((candidate) => candidate.id === levelId) ?? RHYTHM_LEVELS[0];
  const listenPattern = useMemo(() => rhythmPattern(items, 84, 4), [items]);
  const listen = usePlayAlong(listenPattern, {
    bpm: level.bpm,
    loop: true,
    countIn: 4,
    click: true,
  });
  const tapPattern = useMemo(() => clickOnlyPattern(8, 4), []);
  const tapTransport = usePlayAlong(tapPattern, {
    bpm: level.bpm,
    loop: true,
    countIn: 4,
    click: true,
  });

  const expectedAttacks = rhythmOnsets(items).length;

  const reset = (nextLevel: RhythmLevelId = levelId) => {
    const nextItems = generateRhythm(nextLevel);
    const nextLevelDef =
      RHYTHM_LEVELS.find((candidate) => candidate.id === nextLevel) ?? RHYTHM_LEVELS[0];
    listen.stop();
    tapTransport.stop();
    listen.setBpm(nextLevelDef.bpm);
    tapTransport.setBpm(nextLevelDef.bpm);
    setItems(nextItems);
    setTaps([]);
    setScore(null);
    startRef.current = null;
  };

  const chooseLevel = (id: RhythmLevelId) => {
    setLevelId(id);
    reset(id);
  };

  const switchMode = (next: 'listen' | 'tap') => {
    listen.stop();
    tapTransport.stop();
    setMode(next);
  };

  const handleTap = () => {
    const now = performance.now();
    if (startRef.current === null) {
      startRef.current = now;
      setTaps([0]);
    } else {
      setTaps((current) => [...current, Math.round(now - startRef.current!)]);
    }
    setScore(null);
  };

  const clearTaps = () => {
    startRef.current = null;
    setTaps([]);
    setScore(null);
  };

  const checkTaps = () => {
    if (taps.length < 2) return;
    tapTransport.stop();
    setScore(scoreEcho(items, taps, 60 / tapTransport.bpm));
  };

  const scoreTone =
    score === null ? '' : score.accuracy >= 0.85 ? 'good' : score.accuracy >= 0.55 ? 'near' : 'off';

  return (
    <div className="page rhythm-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Rhythm')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Move the pulse')}</span>
          <h1>{t('Rhythm room')}</h1>
          <p>
            {t(
              'Listen to a two-bar pattern, then tap it back. The score compares the spacing of your attacks, not when you happened to start.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Current level')}</span>
          <strong>{t(level.label)}</strong>
          <small>{t('{n} attacks per pattern', { n: expectedAttacks })}</small>
        </div>
      </header>

      <section className="panel rhythm-setup">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Choose a level')}</span>
            <h2>{t('From steady quarters to syncopation')}</h2>
          </div>
        </div>
        <div className="rhythm-levels">
          {RHYTHM_LEVELS.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={`rhythm-level ${levelId === option.id ? 'selected' : ''}`}
              aria-pressed={levelId === option.id}
              onClick={() => chooseLevel(option.id)}
            >
              <span className="rhythm-level-number">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>{t(option.label)}</strong>
                <small>{t(option.description)}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="rhythm-mode-switch" role="group" aria-label={t('Rhythm mode')}>
        <button
          type="button"
          className={`rhythm-mode ${mode === 'listen' ? 'active' : ''}`}
          aria-pressed={mode === 'listen'}
          onClick={() => switchMode('listen')}
        >
          <Icon name="headphones" size={16} /> {t('Listen')}
        </button>
        <button
          type="button"
          className={`rhythm-mode ${mode === 'tap' ? 'active' : ''}`}
          aria-pressed={mode === 'tap'}
          onClick={() => switchMode('tap')}
        >
          <Icon name="target" size={16} /> {t('Tap back')}
        </button>
      </div>

      {mode === 'listen' ? (
        <section className="panel rhythm-room">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Listen')}</span>
              <h2>{t('Hear the two-bar pattern')}</h2>
            </div>
            <button className="button secondary small" onClick={() => reset()}>
              <Icon name="refresh" size={14} /> {t('New rhythm')}
            </button>
          </div>

          <RhythmDisplay items={items} barEvery={4} className="rhythm-score" />
          <PlayAlongControls controls={listen} label={t('Rhythm tempo')} />
          <p className="rhythm-note">
            {t(
              'Count one bar in, then say the pattern to yourself while it plays. When you can hear it before it arrives, switch to Tap back.',
            )}
          </p>
        </section>
      ) : (
        <section className="panel rhythm-room tap-room">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Tap back')}</span>
              <h2>{t('Echo the rhythm')}</h2>
            </div>
            <button className="button secondary small" onClick={() => reset()}>
              <Icon name="refresh" size={14} /> {t('New rhythm')}
            </button>
          </div>

          <div className="rhythm-tap-layout">
            <div className="rhythm-tap-score">
              <RhythmDisplay items={items} barEvery={4} className="rhythm-score" />
              <PlayAlongControls controls={tapTransport} label={t('Click tempo')} compact />
            </div>

            <div className="tap-panel">
              <button
                type="button"
                className={`tap-pad ${scoreTone}`}
                onClick={handleTap}
                aria-label={t('Tap the rhythm')}
              >
                <span>{t('Tap')}</span>
                <small>{t('Every attack you hear')}</small>
              </button>

              <div className="tap-stats">
                <span>{t('{n} taps', { n: taps.length })}</span>
                <span>{t('{n} expected', { n: expectedAttacks })}</span>
              </div>

              <div className="tap-actions">
                <button
                  className="button ghost small"
                  onClick={clearTaps}
                  disabled={!taps.length}
                >
                  {t('Clear taps')}
                </button>
                <button
                  className="button primary small"
                  onClick={checkTaps}
                  disabled={taps.length < 2}
                >
                  {t('Check taps')}
                </button>
              </div>

              <p className="tap-hint">
                {t(
                  'The first tap starts your clock. Only the spacing between taps is judged, so a late start is fine.',
                )}
              </p>
            </div>
          </div>

          {score && (
            <div className={`tap-result ${scoreTone}`} role="status">
              <strong>{Math.round(score.accuracy * 100)}%</strong>
              <div>
                <p>
                  {t('{matched} of {total} attacks matched.', {
                    matched: score.matched,
                    total: score.total,
                  })}
                </p>
                <small>
                  {t('Average timing error: {ms} ms.', { ms: score.meanErrorMs })}
                  {score.extra > 0 ? ` ${t('{n} extra taps.', { n: score.extra })}` : ''}
                </small>
                <div className="tap-dots" aria-hidden="true">
                  {score.notes.map((note, index) => (
                    <span key={index} className={note.errorMs !== null ? 'hit' : 'miss'} />
                  ))}
                </div>
                <p className="tap-verdict">
                  {score.accuracy === 1
                    ? t('Perfect echo. Keep that internal pulse.')
                    : score.accuracy >= 0.7
                      ? t('Close. Hold the long notes for their full value and keep the short ones light.')
                      : t('Listen once more before tapping. Feel the pulse in your body first.')}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="panel rhythm-tips">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Practice plan')}</span>
            <h2>{t('Listen, tap, then play')}</h2>
          </div>
        </div>
        <ol>
          <li>{t('Listen to the whole pattern twice without tapping.')}</li>
          <li>{t('Tap only the downbeats, then add the notes between them.')}</li>
          <li>{t('Echo the pattern, check the score, and listen again.')}</li>
          <li>{t('Play the same rhythm on one note of your instrument.')}</li>
        </ol>
      </section>
    </div>
  );
}
