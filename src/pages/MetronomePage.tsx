import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import MetronomeFigure from '../components/MetronomeFigure';
import { useI18n } from '../lib/i18n';
import {
  MAX_BPM,
  MIN_BPM,
  METERS,
  SUBDIVISIONS,
  isStrongBeat,
  meterLabel,
  useMetronome,
} from '../lib/metronome';

const TEMPO_TERMS: Array<{ max: number; term: string }> = [
  { max: 40, term: 'Grave' },
  { max: 50, term: 'Largo' },
  { max: 60, term: 'Larghetto' },
  { max: 66, term: 'Adagio' },
  { max: 76, term: 'Andante' },
  { max: 96, term: 'Moderato' },
  { max: 120, term: 'Allegretto' },
  { max: 156, term: 'Allegro' },
  { max: 200, term: 'Vivace' },
  { max: MAX_BPM, term: 'Presto' },
];

function tempoTerm(bpm: number): string {
  return TEMPO_TERMS.find((entry) => bpm <= entry.max)?.term ?? 'Presto';
}

export default function MetronomePage() {
  const { t } = useI18n();
  const {
    settings,
    running,
    beat,
    toggle,
    setBpm,
    nudgeBpm,
    setBeatsPerBar,
    setSubdivision,
    setAccentFirst,
    setVolume,
    tap,
  } = useMetronome();

  // Space starts/stops, arrows nudge, T taps. Ignore typing in controls.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        toggle();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nudgeBpm(1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        nudgeBpm(-1);
      } else if (event.key.toLowerCase() === 't') {
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nudgeBpm, tap, toggle]);

  return (
    <div className="page metronome-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Metronome')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Practice tool')}</span>
          <h1>{t('Metronome')}</h1>
          <p>
            {t(
              'A steady clock for lessons, scales, and repertoire. It keeps running while you move around the app, so you can start it here and shrink it into the floating dock.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Tempo marking')}</span>
          <strong>{tempoTerm(settings.bpm)}</strong>
        </div>
      </header>

      <section className="metronome-stage panel">
        <div className={`metronome-stage-visual ${running ? 'running' : ''}`}>
          <MetronomeFigure bpm={settings.bpm} running={running} accented={running && beat === 0} />
          <div className="metronome-stage-tempo">
            <strong>{settings.bpm}</strong>
            <span>{t('BPM')}</span>
          </div>
          <div className="metronome-stage-beats" aria-live="off">
            {Array.from({ length: settings.beatsPerBar }, (_, value) => (
              <span
                key={value}
                className={`metronome-stage-beat ${running && beat === value ? 'active' : ''} ${
                  isStrongBeat(value, settings.beatsPerBar) ? 'strong' : ''
                }`}
              >
                {value + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="metronome-stage-controls">
          <button className="icon-button big" onClick={() => nudgeBpm(-1)} aria-label={t('Slower by one')}>
            −
          </button>
          <button className={`metronome-play ${running ? 'stop' : ''}`} onClick={toggle}>
            <Icon name={running ? 'pause' : 'play'} size={24} />
            {running ? t('Stop') : t('Start')}
          </button>
          <button className="icon-button big" onClick={() => nudgeBpm(1)} aria-label={t('Faster by one')}>
            +
          </button>
        </div>

        <div className="metronome-tempo-row">
          <input
            className="bpm-slider"
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={settings.bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
            aria-label={t('Tempo in beats per minute')}
          />
          <div className="metronome-tempo-inputs">
            <button className="button ghost small" onClick={() => setBpm(60)}>
              60
            </button>
            <button className="button ghost small" onClick={() => setBpm(72)}>
              72
            </button>
            <button className="button ghost small" onClick={() => setBpm(96)}>
              96
            </button>
            <button className="button ghost small" onClick={() => setBpm(120)}>
              120
            </button>
          </div>
        </div>
        <p className="metronome-hint">
          {t('The brass weight follows the tempo up and down the scale. Tap')} <kbd>T</kbd>{' '}
          {t('or use Tap tempo to set the pulse by feel.')} <kbd>Space</kbd> {t('starts and stops;')} <kbd>↑</kbd>{' '}
          <kbd>↓</kbd> {t('nudge the tempo.')}
        </p>
      </section>

      <div className="metronome-settings-grid">
        <section className="panel">
          <div className="panel-head">
            <h2>{t('Meter')}</h2>
            <span className="panel-note">{t(meterLabel(settings.beatsPerBar))}</span>
          </div>
          <div className="metronome-option-grid">
            {METERS.map((value) => (
              <button
                key={value}
                className={`metronome-option ${settings.beatsPerBar === value ? 'active' : ''}`}
                onClick={() => setBeatsPerBar(value)}
                aria-pressed={settings.beatsPerBar === value}
              >
                <strong>{t(meterLabel(value))}</strong>
                <span>{t(value === 6 ? 'compound' : value === 5 || value === 7 ? 'odd' : 'simple')}</span>
              </button>
            ))}
          </div>
          <p className="metronome-note">
            {t(
              'In 6/8 the pulse is the eighth note and beats 1 and 4 are accented. Odd meters stay grouped in the same regular pulse.',
            )}
          </p>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>{t('Subdivision')}</h2>
            <span className="panel-note">{t('Clicks between beats')}</span>
          </div>
          <div className="metronome-segmented">
            {SUBDIVISIONS.map((entry) => (
              <button
                key={entry.id}
                className={settings.subdivision === entry.id ? 'active' : ''}
                onClick={() => setSubdivision(entry.id)}
                aria-pressed={settings.subdivision === entry.id}
              >
                <strong>{entry.short}</strong>
                <span>{t(entry.label)}</span>
              </button>
            ))}
          </div>
          <label className="metronome-switch">
            <span>
              <strong>{t('Accent the first beat')}</strong>
              <small>{t('A higher click marks the downbeat of every bar.')}</small>
            </span>
            <input
              type="checkbox"
              checked={settings.accentFirst}
              onChange={(event) => setAccentFirst(event.target.checked)}
            />
          </label>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>{t('Feel')}</h2>
            <span className="panel-note">{t('Tap tempo')}</span>
          </div>
          <button className="metronome-tap" onClick={tap}>
            <Icon name="target" size={22} />
            {t('Tap tempo')}
          </button>
          <p className="metronome-note">
            {t('Tap four or more times in a row. The average of your taps sets the tempo.')}
          </p>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>{t('Volume')}</h2>
            <span className="panel-note">{t('{n}%', { n: Math.round(settings.volume * 100) })}</span>
          </div>
          <input
            className="bpm-slider"
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            aria-label={t('Metronome volume')}
          />
          <p className="metronome-note">
            {t(
              'The metronome follows the app-wide sound switch in Settings. This slider balances it against lessons and examples.',
            )}
          </p>
        </section>
      </div>

      <div className="tool-crosslink">
        <div>
          <strong>{t('Need a reference pitch?')}</strong>
          <p>{t('Open the tuner to check intonation before you practise.')}</p>
        </div>
        <Link className="button secondary small" to="/tuner">
          {t('Open the tuner')}
          <Icon name="arrow" size={15} />
        </Link>
      </div>
    </div>
  );
}
