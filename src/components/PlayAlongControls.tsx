import { useId } from 'react';
import { useI18n } from '../lib/i18n';
import type { PlayAlongControlsState } from '../lib/playAlong';
import Icon from './Icons';

interface PlayAlongControlsProps {
  controls: PlayAlongControlsState;
  /** Short caption shown above the transport. */
  label?: string;
  compact?: boolean;
}

/**
 * Shared transport for every practice surface: play/stop, tempo, count-in,
 * looping, and a click. The lesson examples, repertoire pages, and explorer all
 * use the same component so the behaviour never drifts.
 */
export default function PlayAlongControls({
  controls,
  label,
  compact = false,
}: PlayAlongControlsProps) {
  const { t } = useI18n();
  const tempoId = useId();
  const countInId = useId();

  const toggleLoop = () => controls.setLoop(!controls.loop);
  const toggleClick = () => controls.setClick(!controls.click);

  const countInOptions = [
    { value: 0, label: t('Off') },
    { value: controls.beatsPerBar, label: t('1 bar') },
    { value: controls.beatsPerBar * 2, label: t('2 bars') },
  ];

  return (
    <div className={`play-along ${compact ? 'compact' : ''}`}>
      <div className="play-along-top">
        <button
          type="button"
          className={`button small play-along-button ${controls.playing ? 'active' : 'primary'}`}
          onClick={controls.toggle}
          aria-label={controls.playing ? t('Stop play-along') : t('Start play-along')}
        >
          <Icon name={controls.playing ? 'pause' : 'play'} size={15} />
          {controls.playing ? t('Stop') : t('Play')}
        </button>

        <div className="play-along-tempo">
          <label htmlFor={tempoId}>
            {label ?? t('Practice tempo')}
            <output htmlFor={tempoId}>{t('{bpm} BPM', { bpm: controls.bpm })}</output>
          </label>
          <input
            id={tempoId}
            type="range"
            min={30}
            max={220}
            step={1}
            value={controls.bpm}
            aria-label={t('Tempo in beats per minute')}
            onChange={(event) => controls.setBpm(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="play-along-bottom">
        <div className="play-along-toggles">
          <button
            type="button"
            className={`play-along-toggle ${controls.loop ? 'active' : ''}`}
            aria-pressed={controls.loop}
            onClick={toggleLoop}
          >
            {t('Loop')}
          </button>
          <button
            type="button"
            className={`play-along-toggle ${controls.click ? 'active' : ''}`}
            aria-pressed={controls.click}
            onClick={toggleClick}
          >
            {t('Click')}
          </button>
          <label className="play-along-count-in" htmlFor={countInId}>
            <span>{t('Count-in')}</span>
            <select
              id={countInId}
              value={controls.countIn}
              onChange={(event) => controls.setCountIn(Number(event.target.value))}
            >
              {countInOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="play-along-beats" aria-hidden="true">
          {controls.countInBeat > 0 ? (
            <span className="play-along-count">{t('Count-in {n}', { n: controls.countInBeat })}</span>
          ) : (
            Array.from({ length: controls.beatsPerBar }, (_, index) => (
              <span
                key={index}
                className={`play-along-beat ${controls.playing && controls.barBeat === index ? 'active' : ''} ${index === 0 ? 'strong' : ''}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
