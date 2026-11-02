import { synth } from '../lib/audio';
import { useProgress } from '../lib/progress';
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
}

export default function InstrumentSurface({
  onNote,
  marks = {},
  disabled = false,
  showLabelsOverride,
  label = true,
  preferFlats = false,
}: InstrumentSurfaceProps) {
  const { settings } = useProgress();
  const showLabels = showLabelsOverride ?? settings.showLabels;
  const mode = settings.instrument;

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
              <span>Piano</span>
            </div>
          )}
          <Piano
            onNote={handleNote}
            marks={marks}
            showLabels={showLabels}
            disabled={disabled}
            preferFlats={preferFlats}
          />
        </div>
      )}
      {(mode === 'guitar' || mode === 'both') && (
        <div className="instrument-block">
          {label && mode === 'both' && (
            <div className="instrument-heading">
              <Icon name="guitar" size={18} />
              <span>Guitar · standard tuning</span>
            </div>
          )}
          <Fretboard
            onNote={handleNote}
            marks={marks}
            showLabels={showLabels}
            disabled={disabled}
            preferFlats={preferFlats}
          />
        </div>
      )}
      {mode === 'guitar' && label && (
        <p className="instrument-caption">
          High E is the top line. Each fret is one semitone. Open strings are clickable to the left of the nut.
        </p>
      )}
      {mode === 'piano' && label && (
        <p className="instrument-caption">Two octaves, C3–C5. Click any key to answer.</p>
      )}
    </div>
  );
}
