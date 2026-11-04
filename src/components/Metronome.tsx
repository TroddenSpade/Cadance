import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { isStrongBeat, meterLabel, METERS, useMetronome } from '../lib/metronome';
import Icon from './Icons';

/** Inline metronome used inside lessons. It shares the global clock and settings. */
export default function Metronome() {
  const { t } = useI18n();
  const { settings, running, beat, toggle, nudgeBpm, setBpm, setBeatsPerBar } = useMetronome();

  return (
    <div className="metronome">
      <div className="metronome-top">
        <div className="metronome-label">
          <Icon name="metronome" size={20} />
          <span>{t('Metronome')}</span>
        </div>
        <div className="metronome-beats" aria-hidden="true">
          {Array.from({ length: settings.beatsPerBar }, (_, value) => (
            <span
              key={value}
              className={`metronome-beat ${running && beat === value ? 'active' : ''} ${
                isStrongBeat(value, settings.beatsPerBar) ? 'strong' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className="metronome-meters" aria-label={t('Beats per bar')}>
        {METERS.map((value) => (
          <button
            key={value}
            className={`meter-button ${settings.beatsPerBar === value ? 'active' : ''}`}
            onClick={() => setBeatsPerBar(value)}
            aria-pressed={settings.beatsPerBar === value}
          >
            {meterLabel(value)}
          </button>
        ))}
      </div>
      <div className="metronome-controls">
        <button className="icon-button" onClick={() => nudgeBpm(-4)} aria-label={t('Slower')}>
          −
        </button>
        <div className="bpm-display">
          <strong>{settings.bpm}</strong>
          <span>{t('BPM')}</span>
        </div>
        <button className="icon-button" onClick={() => nudgeBpm(4)} aria-label={t('Faster')}>
          +
        </button>
        <button className={`button small ${running ? 'secondary' : 'primary'}`} onClick={toggle}>
          <Icon name={running ? 'pause' : 'play'} size={16} />
          {running ? t('Stop') : t('Start')}
        </button>
      </div>
      <input
        className="bpm-slider"
        type="range"
        min={30}
        max={260}
        value={settings.bpm}
        onChange={(event) => setBpm(Number(event.target.value))}
        aria-label={t('Tempo in beats per minute')}
      />
      <Link className="metronome-more" to="/metronome">
        {t('More settings')}
        <Icon name="arrow" size={13} />
      </Link>
    </div>
  );
}
