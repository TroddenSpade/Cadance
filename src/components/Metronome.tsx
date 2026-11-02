import { useEffect, useRef, useState } from 'react';
import { synth } from '../lib/audio';
import Icon from './Icons';

export default function Metronome({ initialBpm = 72 }: { initialBpm?: number }) {
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      setBeat(0);
      beatRef.current = 0;
      return;
    }
    const tick = () => {
      const next = beatRef.current % beatsPerBar;
      const strong = beatsPerBar === 6 ? next === 0 || next === 3 : next === 0;
      synth.playMetronomeClick(strong);
      setBeat(next);
      beatRef.current += 1;
    };
    tick();
    timerRef.current = window.setInterval(tick, 60000 / bpm);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running, bpm, beatsPerBar]);

  return (
    <div className="metronome">
      <div className="metronome-top">
        <div className="metronome-label">
          <Icon name="metronome" size={20} />
          <span>Metronome</span>
        </div>
        <div className="metronome-beats">
          {Array.from({ length: beatsPerBar }, (_, value) => (
            <span
              key={value}
              className={`metronome-beat ${running && beat === value ? 'active' : ''} ${
                value === 0 || (beatsPerBar === 6 && value === 3) ? 'strong' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className="metronome-meters" aria-label="Beats per bar">
        {[2, 3, 4, 6].map((value) => (
          <button
            key={value}
            className={`meter-button ${beatsPerBar === value ? 'active' : ''}`}
            onClick={() => {
              setBeatsPerBar(value);
              beatRef.current = 0;
              setBeat(0);
            }}
            aria-pressed={beatsPerBar === value}
          >
            {value === 6 ? '6/8' : `${value}/4`}
          </button>
        ))}
      </div>
      <div className="metronome-controls">
        <button className="icon-button" onClick={() => setBpm((value) => Math.max(40, value - 4))} aria-label="Slower">
          −
        </button>
        <div className="bpm-display">
          <strong>{bpm}</strong>
          <span>BPM</span>
        </div>
        <button className="icon-button" onClick={() => setBpm((value) => Math.min(208, value + 4))} aria-label="Faster">
          +
        </button>
        <button className={`button small ${running ? 'secondary' : 'primary'}`} onClick={() => setRunning((value) => !value)}>
          <Icon name={running ? 'pause' : 'play'} size={16} />
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
      <input
        className="bpm-slider"
        type="range"
        min={40}
        max={208}
        value={bpm}
        onChange={(event) => setBpm(Number(event.target.value))}
        aria-label="Tempo in beats per minute"
      />
    </div>
  );
}
