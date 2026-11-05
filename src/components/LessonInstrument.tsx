import { useMemo } from 'react';
import { useI18n } from '../lib/i18n';
import { STANDARD_GUITAR_TUNING } from '../lib/notation';
import { demoBpm, patternFromDemo, usePlayAlong } from '../lib/playAlong';
import { useProgress } from '../lib/progress';
import type { InstrumentDemoSpec } from '../lib/types';
import Icon from './Icons';
import InstrumentSurface from './InstrumentSurface';
import NoteText from './NoteText';
import PlayAlongControls from './PlayAlongControls';
import RichText from './RichText';

export default function LessonInstrument({ spec }: { spec: InstrumentDemoSpec }) {
  const { settings } = useProgress();
  const { t } = useI18n();
  const pattern = useMemo(() => patternFromDemo(spec), [spec]);
  const controls = usePlayAlong(pattern, {
    bpm: demoBpm(spec),
    countIn: 0,
    loop: true,
    click: false,
  });
  const standardTuningDemo =
    Boolean(spec.guitarSpots) && settings.guitarTuning !== 'standard';

  const instrumentLabel =
    settings.instrument === 'guitar'
      ? t('On the guitar')
      : settings.instrument === 'piano'
        ? t('At the piano')
        : t('At the instrument');

  return (
    <aside className="lesson-instrument" aria-label={t('Guided instrument example')}>
      <div className="lesson-instrument-top">
        <div className="lesson-instrument-title">
          <span className="lesson-instrument-icon">
            <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={17} />
          </span>
          <div>
            <span className="eyebrow">{instrumentLabel}</span>
            <strong>
              <NoteText text={spec.title ?? t('Play the example')} />
            </strong>
          </div>
        </div>
        <button
          type="button"
          className="button secondary small lesson-instrument-play"
          onClick={controls.toggle}
          aria-label={controls.playing ? t('Stop play-along') : t('Start play-along')}
        >
          <Icon name={controls.playing ? 'pause' : 'play'} size={14} />
          {controls.playing ? t('Stop') : t('Hear it')}
        </button>
      </div>

      {spec.body && <RichText body={spec.body} className="lesson-instrument-body" />}

      <PlayAlongControls controls={controls} compact />

      <div className="lesson-instrument-surface">
        <InstrumentSurface
          marks={{}}
          showLabelsOverride={settings.showLabels}
          label={settings.instrument === 'both'}
          pianoKeys={spec.notes}
          pianoStart={spec.pianoStart}
          pianoEnd={spec.pianoEnd}
          guitarSpots={standardTuningDemo ? undefined : spec.guitarSpots}
          rootPitchClasses={spec.rootPitchClasses}
          preferFlats={spec.preferFlats}
          tuning={standardTuningDemo ? STANDARD_GUITAR_TUNING : undefined}
          tuningLabel={standardTuningDemo ? t('Standard tuning') : undefined}
        />
      </div>

      {standardTuningDemo && (
        <p className="lesson-instrument-caption">
          {t(
            'This hand position is written for standard tuning. The fretboard shows standard tuning here; your saved tuning applies to exercises, repertoire, and the explorer.',
          )}
        </p>
      )}

      {spec.caption && (
        <p className="lesson-instrument-caption">
          <NoteText text={spec.caption} />
        </p>
      )}
    </aside>
  );
}
