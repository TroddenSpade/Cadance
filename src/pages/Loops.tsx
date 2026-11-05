import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import InstrumentSurface from '../components/InstrumentSurface';
import MelodyScore from '../components/MelodyScore';
import PlayAlongControls from '../components/PlayAlongControls';
import type { MarkState } from '../components/Piano';
import { useI18n } from '../lib/i18n';
import { midiToName } from '../lib/music';
import { LOOP_KEYS, LOOP_STYLES, buildLoop, loopScaleMidis, type LoopStyleId } from '../lib/loops';
import { usePlayAlong } from '../lib/playAlong';

export default function Loops() {
  const { t } = useI18n();
  const [styleId, setStyleId] = useState<LoopStyleId>('pop');
  const [keyPc, setKeyPc] = useState(0);

  const style = LOOP_STYLES.find((candidate) => candidate.id === styleId) ?? LOOP_STYLES[0];
  const key = LOOP_KEYS.find((candidate) => candidate.pc === keyPc) ?? LOOP_KEYS[0];
  const loop = useMemo(() => buildLoop(styleId, keyPc), [styleId, keyPc]);
  const controls = usePlayAlong(loop, {
    bpm: style.bpm,
    loop: true,
    countIn: 4,
    click: true,
  });

  const scaleMidis = useMemo(() => loopScaleMidis(styleId, keyPc), [styleId, keyPc]);
  const preferFlats = [1, 3, 8, 10].includes(keyPc);
  const scaleMarks = useMemo(() => {
    const marks: Record<number, MarkState> = {};
    style.scale.intervals.forEach((interval) => {
      marks[(keyPc + interval) % 12] = interval === 0 ? 'root' : 'lesson';
    });
    return marks;
  }, [keyPc, style]);

  const activeIndex =
    controls.beat >= 0
      ? Math.floor(controls.beat / loop.beatsPerBar) % loop.chords.length
      : -1;
  const activeChord = activeIndex >= 0 ? loop.chords[activeIndex] : null;

  const chooseStyle = (id: LoopStyleId) => {
    const next = LOOP_STYLES.find((candidate) => candidate.id === id) ?? LOOP_STYLES[0];
    controls.stop();
    controls.setBpm(next.bpm);
    setStyleId(id);
  };

  const chooseKey = (pc: number) => {
    controls.stop();
    setKeyPc(pc);
  };

  const scaleNotes = scaleMidis.map((midi) => ({ midi, beats: 0.5 }));
  const pianoStart = Math.max(21, Math.min(...scaleMidis) - 2);
  const pianoEnd = Math.min(108, Math.max(...scaleMidis) + 2);
  const chordLabel = activeChord ? activeChord.name : loop.chords[0]?.name;

  return (
    <div className="page loop-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Backing loops')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Play over a band')}</span>
          <h1>{t('Backing loops')}</h1>
          <p>
            {t(
              'A bass line and chords in a repeating four-bar progression. Pick a style and key, start the loop, then solo with the scale shown.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Now playing')}</span>
          <strong>{chordLabel}</strong>
          <small>
            {t('{key} · {style}', { key: t(key.label), style: t(style.label) })}
          </small>
        </div>
      </header>

      <section className="panel loop-setup">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Choose a style')}</span>
            <h2>{t('Six feels, one transport')}</h2>
          </div>
        </div>
        <div className="loop-styles">
          {LOOP_STYLES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`loop-style ${styleId === option.id ? 'selected' : ''}`}
              aria-pressed={styleId === option.id}
              onClick={() => chooseStyle(option.id)}
            >
              <strong>{t(option.label)}</strong>
              <small>{t(option.description)}</small>
              <span className="loop-style-tempo">{t('{bpm} BPM', { bpm: option.bpm })}</span>
            </button>
          ))}
        </div>

        <div className="loop-key-row">
          <span className="loop-key-label">{t('Key')}</span>
          <div className="loop-keys" role="group" aria-label={t('Key')}>
            {LOOP_KEYS.map((option) => (
              <button
                key={option.pc}
                type="button"
                className={`loop-key ${keyPc === option.pc ? 'selected' : ''}`}
                aria-pressed={keyPc === option.pc}
                onClick={() => chooseKey(option.pc)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel loop-room">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Practice loop')}</span>
            <h2>{t('{style} in {key}', { style: t(style.label), key: key.label })}</h2>
            <p className="room-note">{t(style.tip)}</p>
          </div>
        </div>

        <PlayAlongControls controls={controls} label={t('Loop tempo')} />

        <div className="loop-chords" role="list" aria-label={t('Chord progression')}>
          {loop.chords.map((chord, index) => (
            <div
              key={`${chord.name}-${index}`}
              role="listitem"
              className={`loop-chord ${activeIndex === index ? 'active' : ''}`}
            >
              <span className="loop-chord-bar">{t('Bar {n}', { n: index + 1 })}</span>
              <strong>{chord.name}</strong>
              <small>
                {chord.midis
                  .map((midi) => midiToName(midi, preferFlats))
                  .join(' · ')}
              </small>
            </div>
          ))}
        </div>

        <div className="loop-progress" aria-hidden="true">
          {loop.chords.map((chord, index) => (
            <span
              key={`${chord.name}-progress-${index}`}
              className={activeIndex === index ? 'active' : ''}
            />
          ))}
        </div>

        <div className="loop-solo">
          <div className="loop-solo-score">
            <span className="eyebrow">{t('Solo scale')}</span>
            <h3>{t(style.scale.label)}</h3>
            <MelodyScore
              notes={scaleNotes}
              clef="treble"
              beatsPerBar={4}
              time={[4, 4]}
              preferFlats={preferFlats}
              className="loop-score"
            />
          </div>
          <div className="loop-solo-surface">
            <InstrumentSurface
              marks={scaleMarks}
              rootPitchClasses={[keyPc]}
              pianoStart={pianoStart}
              pianoEnd={pianoEnd}
              preferFlats={preferFlats}
            />
          </div>
        </div>
      </section>

      <section className="panel loop-tips">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('How to practice')}</span>
            <h2>{t('From roots to a solo')}</h2>
          </div>
        </div>
        <ol>
          <li>{t('Play only the root of each chord for one full pass.')}</li>
          <li>{t('Add the fifth, then the third, until you can outline every chord.')}</li>
          <li>{t('Improvise with two notes from the scale, then four, then the whole scale.')}</li>
          <li>{t('Loop one chord change until the voice leading is smooth, then add the next.')}</li>
        </ol>
        <div className="loop-links">
          <Link className="text-link" to="/explorer">
            {t('Explore the scale')} <Icon name="arrow" size={14} />
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
