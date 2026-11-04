import { synth } from '../lib/audio';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';
import type { InstrumentDemoSpec } from '../lib/types';
import Icon from './Icons';
import InstrumentSurface from './InstrumentSurface';
import NoteText from './NoteText';
import RichText from './RichText';

export default function LessonInstrument({ spec }: { spec: InstrumentDemoSpec }) {
  const { settings } = useProgress();
  const { t } = useI18n();

  const play = () => {
    synth.setTimbre(settings.timbre);
    synth.stopAll();
    if (spec.rhythm) synth.playRhythm(spec.rhythm, spec.tempo ?? 0.46, spec.notes[0] ?? 84);
    else if (spec.chords) synth.playChords(spec.chords, spec.tempo ?? 0.8);
    else if (spec.mode === 'chord') synth.playChords([spec.notes], spec.tempo ?? 1.1);
    else synth.playSequence(spec.notes, 'sequence', spec.tempo ?? 0.5);
  };

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
        <button type="button" className="button secondary small lesson-instrument-play" onClick={play}>
          <Icon name="play" size={14} />
          {t('Hear it')}
        </button>
      </div>

      {spec.body && <RichText body={spec.body} className="lesson-instrument-body" />}

      <div className="lesson-instrument-surface">
        <InstrumentSurface
          marks={{}}
          showLabelsOverride={settings.showLabels}
          label={settings.instrument === 'both'}
          pianoKeys={spec.notes}
          pianoStart={spec.pianoStart}
          pianoEnd={spec.pianoEnd}
          guitarSpots={spec.guitarSpots}
          rootPitchClasses={spec.rootPitchClasses}
          preferFlats={spec.preferFlats}
        />
      </div>

      {spec.caption && (
        <p className="lesson-instrument-caption">
          <NoteText text={spec.caption} />
        </p>
      )}
    </aside>
  );
}
