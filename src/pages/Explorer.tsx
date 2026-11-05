import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ChordDiagram from '../components/ChordDiagram';
import Icon from '../components/Icons';
import InstrumentSurface from '../components/InstrumentSurface';
import MelodyScore from '../components/MelodyScore';
import PlayAlongControls from '../components/PlayAlongControls';
import Staff from '../components/Staff';
import { CHORDS, SCALES, SHARP_NAMES, FLAT_NAMES, pitchClass, scaleByName, chordByName } from '../lib/music';
import { cagedPositions } from '../lib/caged';
import { useI18n } from '../lib/i18n';
import { spellMidi } from '../lib/notation';
import { chordPattern, sequencePattern, usePlayAlong } from '../lib/playAlong';

type KindGroup = 'Scales' | 'Chords';

interface ExplorerKind {
  id: string;
  group: KindGroup;
  name: string;
  intervals: number[];
}

const KINDS: ExplorerKind[] = [
  ...SCALES.map((scale) => ({
    id: `scale:${scale.name}`,
    group: 'Scales' as const,
    name: scale.name,
    intervals: scale.intervals,
  })),
  ...CHORDS.map((chord) => ({
    id: `chord:${chord.name}`,
    group: 'Chords' as const,
    name: chord.name,
    intervals: chord.intervals,
  })),
];

const SCALE_FINGERS = [1, 2, 3, 1, 2, 3, 4, 5];
const CHORD_FINGERS = [1, 3, 5, 1, 2, 4, 5];

export default function Explorer() {
  const { t } = useI18n();
  const [rootPitchClass, setRootPitchClass] = useState(0);
  const [kindId, setKindId] = useState('scale:Major');
  const [preferFlats, setPreferFlats] = useState(false);

  const kind = KINDS.find((item) => item.id === kindId) ?? KINDS[0];
  const isChord = kind.group === 'Chords';
  const rootMidi = 60 + rootPitchClass;
  const rootName = (preferFlats ? FLAT_NAMES : SHARP_NAMES)[rootPitchClass];

  const midis = useMemo(() => {
    const notes = kind.intervals.map((interval) => rootMidi + interval);
    if (!isChord) notes.push(rootMidi + 12);
    return notes;
  }, [isChord, kind.intervals, rootMidi]);

  const pattern = useMemo(
    () => (isChord ? chordPattern([midis]) : sequencePattern(midis)),
    [isChord, midis],
  );
  const controls = usePlayAlong(pattern, {
    bpm: isChord ? 70 : 88,
    countIn: 4,
    loop: true,
    click: false,
  });

  const marks = useMemo(() => {
    const result: Record<number, 'root' | 'lesson'> = {};
    midis.forEach((midi) => {
      const pc = pitchClass(midi);
      result[pc] = pc === rootPitchClass ? 'root' : 'lesson';
    });
    return result;
  }, [midis, rootPitchClass]);

  const fingers = useMemo(() => {
    const result: Record<number, number> = {};
    midis.forEach((midi, index) => {
      result[midi] = isChord
        ? CHORD_FINGERS[index] ?? 5
        : SCALE_FINGERS[index] ?? 5;
    });
    return result;
  }, [isChord, midis]);

  const spelled = useMemo(
    () => midis.map((midi) => spellMidi(midi, preferFlats)),
    [midis, preferFlats],
  );

  const scale = kind.group === 'Scales' ? scaleByName(kind.name as Parameters<typeof scaleByName>[0]) : null;
  const chord = kind.group === 'Chords' ? chordByName(kind.name) : null;
  const caged =
    isChord && (kind.name === 'Major' || kind.name === 'Minor')
      ? cagedPositions(rootPitchClass, kind.name)
      : [];

  const transpose = (delta: number) => {
    setRootPitchClass((current) => ((current + delta) % 12 + 12) % 12);
  };

  return (
    <div className="page explorer-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Reference')}</span>
          <h1>{t('Scale & chord explorer')}</h1>
          <p>
            {t(
              'Choose a root and a type to see it on the staff, piano, and fretboard, hear it, transpose it, and map the CAGED chord shapes.',
            )}
          </p>
        </div>
      </header>

      <section className="panel explorer-controls">
        <div className="explorer-control">
          <label htmlFor="explorer-root">{t('Root')}</label>
          <div className="explorer-root-row">
            <button
              type="button"
              className="explorer-step"
              aria-label={t('Transpose down one semitone')}
              onClick={() => transpose(-1)}
            >
              −
            </button>
            <select
              id="explorer-root"
              value={rootPitchClass}
              onChange={(event) => setRootPitchClass(Number(event.target.value))}
            >
              {(preferFlats ? FLAT_NAMES : SHARP_NAMES).map((name, pc) => (
                <option key={name} value={pc}>
                  {name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="explorer-step"
              aria-label={t('Transpose up one semitone')}
              onClick={() => transpose(1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="explorer-control">
          <label htmlFor="explorer-kind">{t('Type')}</label>
          <select
            id="explorer-kind"
            value={kindId}
            onChange={(event) => setKindId(event.target.value)}
          >
            <optgroup label={t('Scales')}>
              {KINDS.filter((item) => item.group === 'Scales').map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name)}
                </option>
              ))}
            </optgroup>
            <optgroup label={t('Chords')}>
              {KINDS.filter((item) => item.group === 'Chords').map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name)}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="explorer-control">
          <span className="explorer-control-label">{t('Spelling')}</span>
          <button
            type="button"
            className={`explorer-spelling ${preferFlats ? 'active' : ''}`}
            aria-pressed={preferFlats}
            onClick={() => setPreferFlats((current) => !current)}
          >
            {preferFlats ? t('Flats') : t('Sharps')}
          </button>
        </div>
      </section>

      <section className="panel explorer-view">
        <div className="explorer-view-head">
          <div>
            <span className="eyebrow">{isChord ? t('Chord') : t('Scale')}</span>
            <h2>
              {rootName} {t(kind.name)}
            </h2>
          </div>
          <button
            type="button"
            className="button secondary small"
            onClick={controls.start}
            disabled={controls.playing}
          >
            <Icon name="play" size={14} /> {t('Hear it')}
          </button>
        </div>

        <PlayAlongControls controls={controls} label={t('Practice tempo')} compact />

        <div className="explorer-score">
          {isChord ? (
            <Staff
              spec={{
                clef: 'treble',
                notes: spelled,
                chord: true,
              }}
            />
          ) : (
            <MelodyScore
              notes={midis.map((midi) => ({ midi, beats: 1 }))}
              clef="treble"
              beatsPerBar={4}
              time={[4, 4]}
              preferFlats={preferFlats}
              activeBeat={controls.beat}
            />
          )}
        </div>

        <div className="explorer-notes">
          {(scale?.degrees ?? chord?.letterSteps.map((_, index) => `${index + 1}`) ?? []).map(
            (degree, index) => {
              const midi = midis[index];
              if (midi === undefined) return null;
              const name = (preferFlats ? FLAT_NAMES : SHARP_NAMES)[pitchClass(midi)];
              return (
                <span key={`${degree}-${index}`}>
                  <strong>{degree}</strong>
                  {name}
                </span>
              );
            },
          )}
        </div>

        <div className="explorer-surface">
          <InstrumentSurface
            marks={marks}
            pianoKeys={midis}
            pianoStart={Math.max(21, midis[0] - 2)}
            pianoEnd={Math.min(108, midis[midis.length - 1] + 2)}
            rootPitchClasses={[rootPitchClass]}
            fingers={fingers}
            preferFlats={preferFlats}
          />
        </div>
      </section>

      {caged.length > 0 && (
        <section className="panel explorer-caged">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Guitar')}</span>
              <h2>{t('CAGED positions for {chord}', { chord: `${rootName}${kind.name === 'Minor' ? 'm' : ''}` })}</h2>
            </div>
          </div>
          <div className="chord-diagram-grid">
            {caged.map((shape) => (
              <ChordDiagram
                key={shape.shape}
                shape={{
                  name: `${rootName}${kind.name === 'Minor' ? 'm' : ''} · ${shape.shape}`,
                  frets: shape.frets,
                  fingers: shape.fingers,
                  baseFret: shape.baseFret,
                  barre: shape.barre,
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="panel explorer-links-panel">
        <div className="loop-links">
          <Link className="text-link" to="/loops">
            {t('Backing loops')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/repertoire">
            {t('Play a piece')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/sight-reading">
            {t('Practice reading')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
