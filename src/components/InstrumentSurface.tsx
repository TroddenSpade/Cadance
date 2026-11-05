import { synth } from '../lib/audio';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';
import { tuningById } from '../lib/tunings';
import type { GuitarSpot } from '../lib/types';
import Fretboard from './Fretboard';
import Icon from './Icons';
import Piano, { type MarkState } from './Piano';

interface InstrumentSurfaceProps {
  onNote?: (midi: number) => void;
  marks?: Record<number, MarkState>;
  disabled?: boolean;
  showLabelsOverride?: boolean;
  label?: boolean;
  preferFlats?: boolean;
  pianoKeys?: number[];
  pianoStart?: number;
  pianoEnd?: number;
  guitarSpots?: GuitarSpot[];
  rootPitchClasses?: number[];
  /** Suggested finger per MIDI note. */
  fingers?: Record<number, number>;
  /** Override the open strings (high string first). */
  tuning?: number[];
  tuningLabel?: string;
}

export default function InstrumentSurface({
  onNote,
  marks = {},
  disabled = false,
  showLabelsOverride,
  label = true,
  preferFlats = false,
  pianoKeys,
  pianoStart,
  pianoEnd,
  guitarSpots,
  rootPitchClasses,
  fingers,
  tuning,
  tuningLabel,
}: InstrumentSurfaceProps) {
  const { settings } = useProgress();
  const { t } = useI18n();
  const showLabels = showLabelsOverride ?? settings.showLabels;
  const mode = settings.instrument;

  const selectedTuning = tuningById('guitar', settings.guitarTuning);
  const tuningMidi =
    tuning ?? [...selectedTuning.strings].reverse().map((string) => string.midi);
  const activeTuningLabel = tuningLabel ?? t(selectedTuning.name);

  const handleNote = (midi: number) => {
    if (disabled) return;
    synth.playNote(midi, 0, 1.1, 0.72);
    onNote?.(midi);
  };

  return (
    <div className="instrument-surface">
      {(mode === 'piano' || mode === 'both') && (
        <div className="instrument-block">
          {label && mode === 'both' && (
            <div className="instrument-heading">
              <Icon name="piano" size={18} />
              <span>{t('Piano')}</span>
            </div>
          )}
          <Piano
            onNote={handleNote}
            marks={marks}
            showLabels={showLabels}
            naming={settings.noteNaming}
            disabled={disabled}
            preferFlats={preferFlats}
            startMidi={pianoStart}
            endMidi={pianoEnd}
            markedKeys={pianoKeys}
            rootPitchClasses={rootPitchClasses}
            fingers={fingers}
          />
        </div>
      )}
      {(mode === 'guitar' || mode === 'both') && (
        <div className="instrument-block">
          {label && mode === 'both' && (
            <div className="instrument-heading">
              <Icon name="guitar" size={18} />
              <span>{t('Guitar · {tuning}', { tuning: activeTuningLabel })}</span>
            </div>
          )}
          <Fretboard
            onNote={handleNote}
            marks={marks}
            showLabels={showLabels}
            naming={settings.noteNaming}
            disabled={disabled}
            preferFlats={preferFlats}
            spots={guitarSpots}
            rootPitchClasses={rootPitchClasses}
            tuning={tuningMidi}
            tuningLabel={activeTuningLabel}
          />
        </div>
      )}
      {mode === 'guitar' && label && (
        <p className="instrument-caption">
          {t('High E is the top line. Each fret is one semitone. Open strings are clickable to the left of the nut.')}
        </p>
      )}
      {mode === 'piano' && label && (
        <p className="instrument-caption">{t('Two octaves, C3–C5. Click any key to answer.')}</p>
      )}
    </div>
  );
}
