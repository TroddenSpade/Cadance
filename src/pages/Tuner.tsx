import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { synth } from '../lib/audio';
import { useMetronome } from '../lib/metronome';
import { midiToFullName } from '../lib/music';
import {
  DEFAULT_CUSTOM_STRINGS,
  INSTRUMENTS,
  STRING_NOTE_OPTIONS,
  customTuning,
  instrumentById,
  stringLabel,
  tuningById,
} from '../lib/tunings';
import {
  detectPitch,
  formatCents,
  medianFrequency,
  midiToFrequencyWithReference,
  resolveTarget,
  tuningStatus,
  type TunerMode,
  type TuningStatus,
} from '../lib/tuner';

interface LiveReading {
  frequency: number;
  clarity: number;
  midi: number;
  targetFrequency: number;
  cents: number;
  stringIndex: number | null;
}

interface TunerPrefs {
  instrumentId: string;
  tuningId: string;
  mode: TunerMode;
  reference: number;
  customStrings: number[];
  selectedString: number;
}

const STORAGE_KEY = 'cadence.tuner.v1';

function loadPrefs(): TunerPrefs {
  const fallback: TunerPrefs = {
    instrumentId: 'guitar',
    tuningId: 'standard',
    mode: 'auto',
    reference: 440,
    customStrings: DEFAULT_CUSTOM_STRINGS,
    selectedString: 0,
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<TunerPrefs>;
    const instrument = INSTRUMENTS.find((entry) => entry.id === parsed.instrumentId);
    const customStrings =
      Array.isArray(parsed.customStrings) && parsed.customStrings.length > 0
        ? parsed.customStrings
            .filter((midi): midi is number => Number.isInteger(midi) && midi >= 12 && midi <= 108)
            .slice(0, 12)
        : fallback.customStrings;
    return {
      instrumentId: instrument?.id ?? fallback.instrumentId,
      tuningId:
        instrument?.tunings.find((entry) => entry.id === parsed.tuningId)?.id ??
        instrument?.tunings[0].id ??
        'standard',
      mode: parsed.mode === 'string' || parsed.mode === 'chromatic' ? parsed.mode : 'auto',
      reference:
        typeof parsed.reference === 'number' && parsed.reference >= 415 && parsed.reference <= 450
          ? parsed.reference
          : 440,
      customStrings: customStrings.length ? customStrings : fallback.customStrings,
      selectedString:
        typeof parsed.selectedString === 'number' && parsed.selectedString >= 0 ? parsed.selectedString : 0,
    };
  } catch {
    return fallback;
  }
}

const MODES: Array<{ id: TunerMode; label: string; hint: string }> = [
  { id: 'auto', label: 'Auto string', hint: 'Snap to the nearest string in the tuning' },
  { id: 'string', label: 'Fixed string', hint: 'Measure against the selected string' },
  { id: 'chromatic', label: 'Chromatic', hint: 'Nearest semitone, any note' },
];

const STATUS_TEXT: Record<TuningStatus, string> = {
  'in-tune': 'In tune',
  close: 'Almost there',
  off: 'Out of tune',
};

export default function Tuner() {
  const { running: metronomeRunning, stop: stopMetronome } = useMetronome();
  const [initial] = useState(loadPrefs);
  const [instrumentId, setInstrumentId] = useState(initial.instrumentId);
  const [tuningId, setTuningId] = useState(initial.tuningId);
  const [mode, setMode] = useState<TunerMode>(initial.mode);
  const [reference, setReference] = useState(initial.reference);
  const [customStrings, setCustomStrings] = useState<number[]>(initial.customStrings);
  const [selectedString, setSelectedString] = useState(initial.selectedString);

  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState<LiveReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tonePlaying, setTonePlaying] = useState(false);
  const [toneMidi, setToneMidi] = useState<number | null>(null);

  const instrument = instrumentById(instrumentId);
  const tuning = useMemo(
    () => (instrumentId === 'custom' ? customTuning(customStrings) : tuningById(instrumentId, tuningId)),
    [instrumentId, tuningId, customStrings],
  );
  const stringMidis = useMemo(() => tuning.strings.map((entry) => entry.midi), [tuning]);
  const chromaticOnly = stringMidis.length === 0;
  const effectiveMode: TunerMode = chromaticOnly ? 'chromatic' : mode;

  // The analysis loop reads these refs so changing a setting does not restart
  // the microphone or lose the AudioContext.
  const stringMidisRef = useRef(stringMidis);
  stringMidisRef.current = stringMidis;
  const modeRef = useRef(effectiveMode);
  modeRef.current = effectiveMode;
  const selectedRef = useRef(selectedString);
  selectedRef.current = selectedString;
  const referenceRef = useRef(reference);
  referenceRef.current = reference;

  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const samplesRef = useRef<number[]>([]);
  const silenceRef = useRef(0);
  const toneRef = useRef(false);
  const toneTimerRef = useRef<number | null>(null);
  const startingRef = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ instrumentId, tuningId, mode, reference, customStrings, selectedString }),
      );
    } catch {
      /* storage may be unavailable */
    }
  }, [instrumentId, tuningId, mode, reference, customStrings, selectedString]);

  useEffect(() => {
    if (selectedString >= stringMidis.length && stringMidis.length > 0) {
      setSelectedString(stringMidis.length - 1);
    }
  }, [selectedString, stringMidis.length]);

  const stopListening = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    try {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
    } catch {
      /* already disconnected */
    }
    sourceRef.current = null;
    analyserRef.current = null;
    bufferRef.current = null;
    if (contextRef.current) {
      void contextRef.current.close().catch(() => undefined);
      contextRef.current = null;
    }
    samplesRef.current = [];
    silenceRef.current = 0;
    setListening(false);
    setReading(null);
  }, []);

  const startListening = useCallback(async () => {
    if (listening || startingRef.current) return;
    startingRef.current = true;
    if (!navigator.mediaDevices?.getUserMedia) {
      startingRef.current = false;
      setError('This browser does not expose microphone input. Try Chrome, Safari, or Edge over HTTPS.');
      return;
    }
    setError(null);
    setReading(null);
    setTonePlaying(false);
    toneRef.current = false;
    setToneMidi(null);
    if (toneTimerRef.current) window.clearTimeout(toneTimerRef.current);
    if (metronomeRunning) stopMetronome();
    synth.stopAll();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const Ctor: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const context = new Ctor();
      await context.resume();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);

      streamRef.current = stream;
      contextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
      bufferRef.current = new Float32Array(analyser.fftSize);
      samplesRef.current = [];
      silenceRef.current = 0;
      lastFrameRef.current = 0;
      setListening(true);
      startingRef.current = false;

      const loop = () => {
        rafRef.current = window.requestAnimationFrame(loop);
        const activeAnalyser = analyserRef.current;
        const activeContext = contextRef.current;
        const buffer = bufferRef.current;
        if (!activeAnalyser || !activeContext || !buffer || toneRef.current) return;

        const now = performance.now();
        if (now - lastFrameRef.current < 70) return;
        lastFrameRef.current = now;

        activeAnalyser.getFloatTimeDomainData(buffer);
        const pitch = detectPitch(buffer, activeContext.sampleRate);
        if (!pitch || pitch.clarity < 0.55) {
          silenceRef.current += 1;
          if (silenceRef.current > 5) {
            samplesRef.current = [];
            setReading(null);
          }
          return;
        }

        silenceRef.current = 0;
        const samples = samplesRef.current;
        samples.push(pitch.frequency);
        if (samples.length > 6) samples.shift();
        const smoothed = medianFrequency(samples) ?? pitch.frequency;
        const target = resolveTarget(
          smoothed,
          stringMidisRef.current,
          modeRef.current,
          selectedRef.current,
          referenceRef.current,
        );
        setReading({ ...target, frequency: smoothed, clarity: pitch.clarity });
      };
      loop();
    } catch (caught) {
      startingRef.current = false;
      const name = caught instanceof DOMException ? caught.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setError('Microphone access was blocked. Allow it in the browser address bar, then try again.');
      } else if (name === 'NotFoundError') {
        setError('No microphone was found. Connect one and try again.');
      } else {
        setError('The microphone could not be started. Close other audio apps and try again.');
      }
      stopListening();
    }
  }, [listening, stopListening, metronomeRunning, stopMetronome]);

  useEffect(() => () => stopListening(), [stopListening]);

  useEffect(
    () => () => {
      if (toneTimerRef.current) window.clearTimeout(toneTimerRef.current);
    },
    [],
  );

  const status: TuningStatus | null = reading ? tuningStatus(reading.cents) : null;
  const clampedCents = reading ? Math.max(-50, Math.min(50, reading.cents)) : 0;
  const needlePercent = 50 + (clampedCents / 50) * 46;
  const activeStringIndex = reading?.stringIndex ?? (effectiveMode === 'string' ? selectedString : null);
  const fallbackMidi = stringMidis.length ? stringMidis[Math.min(selectedString, stringMidis.length - 1)] : 69;
  const targetMidi = reading?.midi ?? fallbackMidi;
  const displayMidi = tonePlaying && toneMidi !== null ? toneMidi : targetMidi;
  const targetNote = midiToFullName(displayMidi);
  const targetLabel = tonePlaying
    ? 'Reference tone'
    : activeStringIndex !== null && tuning.strings[activeStringIndex]
      ? `${stringLabel(activeStringIndex, tuning.strings.length)} string`
      : chromaticOnly
        ? 'Chromatic'
        : null;

  const selectInstrument = (id: string) => {
    const next = instrumentById(id);
    setInstrumentId(id);
    setTuningId(next.tunings[0].id);
    setSelectedString(0);
    setReading(null);
    setMode(next.tunings[0].chromatic ? 'chromatic' : mode === 'chromatic' ? 'auto' : mode);
  };

  const playTarget = (midi = targetMidi) => {
    synth.unlock();
    if (toneTimerRef.current) window.clearTimeout(toneTimerRef.current);
    setReading(null);
    setTonePlaying(true);
    setToneMidi(midi);
    toneRef.current = true;
    synth.playTone(midiToFrequencyWithReference(midi, reference));
    toneTimerRef.current = window.setTimeout(() => {
      toneRef.current = false;
      setTonePlaying(false);
      setToneMidi(null);
      toneTimerRef.current = null;
    }, 1850);
  };

  const updateCustomString = (index: number, midi: number) => {
    setCustomStrings((current) => current.map((value, position) => (position === index ? midi : value)));
  };

  const addCustomString = () => {
    setCustomStrings((current) => {
      if (current.length >= 12) return current;
      const last = current[current.length - 1] ?? 64;
      return [...current, Math.min(108, last + 5)];
    });
  };

  const removeCustomString = (index: number) => {
    setCustomStrings((current) => (current.length <= 1 ? current : current.filter((_, position) => position !== index)));
  };

  return (
    <div className="page tuner-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Today</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">Tools</Link>
        <Icon name="chevron" size={13} />
        <span>Tuner</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">Practice tool</span>
          <h1>Tuner</h1>
          <p>
            A microphone tuner for guitar, bass, orchestral strings, and piano. Pick an instrument and tuning, watch the
            needle, or play a reference tone and tune by ear.
          </p>
        </div>
        <div className="header-stat">
          <span>{instrument.name}</span>
          <strong>{tuning.name}</strong>
        </div>
      </header>

      <section className={`tuner-stage panel ${status ?? 'idle'} ${listening ? 'listening' : ''}`}>
        <div className="tuner-readout">
          <div className="tuner-note-block">
            <span className={`tuner-status-pill ${status ?? 'idle'}`}>
              {tonePlaying ? 'Reference tone' : !listening ? 'Microphone off' : reading ? STATUS_TEXT[status!] : 'Listening…'}
            </span>
            <strong className={`tuner-note ${status ?? 'idle'}`}>{reading || tonePlaying || listening ? targetNote : '—'}</strong>
            <span className="tuner-note-sub">
              {tonePlaying
                ? 'Playing the target pitch'
                : targetLabel
                  ? `${targetLabel} · target ${targetNote}`
                  : 'Play a note to begin'}
            </span>
          </div>

          <div className="tuner-cents">
            <strong className={status ?? 'idle'}>
              {reading ? formatCents(reading.cents) : '0'}
              <small>¢</small>
            </strong>
            <span>{reading ? `${reading.frequency.toFixed(1)} Hz` : '— Hz'}</span>
            <span>
              {reading
                ? reading.cents > 5
                  ? 'Tune down'
                  : reading.cents < -5
                    ? 'Tune up'
                    : 'On pitch'
                : `A4 = ${reference.toFixed(1)} Hz`}
            </span>
          </div>
        </div>

        <div className="tuner-gauge" aria-hidden="true">
          <div className="tuner-gauge-labels">
            <span>−50</span>
            <span>−25</span>
            <span>0</span>
            <span>+25</span>
            <span>+50</span>
          </div>
          <div className="tuner-gauge-track">
            <span className="tuner-gauge-zone" />
            <span className="tuner-gauge-center" />
            <span
              className={`tuner-needle ${status ?? 'idle'}`}
              style={{ left: `${needlePercent}%` }}
            />
          </div>
          <div className="tuner-gauge-leds">
            {[-2, -1, 0, 1, 2].map((value) => (
              <span
                key={value}
                className={`tuner-led ${status === 'in-tune' && value === 0 ? 'on' : ''} ${
                  status === 'close' && Math.abs(value) === 1 ? 'warm' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="tuner-actions">
          <button
            className={`button ${listening ? 'secondary' : 'primary'} tuner-listen`}
            onClick={listening ? stopListening : startListening}
          >
            <Icon name={listening ? 'pause' : 'headphones'} size={18} />
            {listening ? 'Stop listening' : 'Start listening'}
          </button>
          <button className="button ghost tuner-target" onClick={() => playTarget()}>
            <Icon name="sound" size={17} />
            Play {targetNote}
          </button>
          <button className="button ghost tuner-target" onClick={() => playTarget(69)}>
            A4 {reference.toFixed(1)}
          </button>
        </div>

        {error && <p className="tuner-error">{error}</p>}
        {!error && (
          <p className="tuner-note-line">
            Pitch is detected from the microphone on this device. Nothing is recorded or uploaded; audio is analysed in
            the browser and discarded immediately.
          </p>
        )}
      </section>

      <div className="tuner-controls">
        <section className="panel tuner-instrument-panel">
          <div className="panel-head">
            <h2>Instrument</h2>
            <span className="panel-note">{instrument.family}</span>
          </div>
          <div className="tuner-instruments">
            {INSTRUMENTS.map((entry) => (
              <button
                key={entry.id}
                className={`tuner-instrument ${instrumentId === entry.id ? 'active' : ''}`}
                onClick={() => selectInstrument(entry.id)}
                aria-pressed={instrumentId === entry.id}
              >
                <span>{entry.name}</span>
                <small>{entry.family}</small>
              </button>
            ))}
          </div>

          <div className="tuner-field">
            <label htmlFor="tuner-tuning">Tuning</label>
            {instrumentId === 'custom' ? (
              <div className="tuner-fixed-value">Your custom string set ({customStrings.length} strings)</div>
            ) : (
              <select
                id="tuner-tuning"
                className="tuner-select"
                value={tuningId}
                onChange={(event) => {
                  setTuningId(event.target.value);
                  setSelectedString(0);
                  setReading(null);
                }}
              >
                {instrument.tunings.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            )}
            <p className="metronome-note">{tuning.description}</p>
          </div>
        </section>

        <section className="panel tuner-strings-panel">
          <div className="panel-head">
            <h2>Strings</h2>
            <span className="panel-note">{chromaticOnly ? 'Any note' : `${tuning.strings.length} strings`}</span>
          </div>

          {chromaticOnly ? (
            <p className="tuner-empty">
              Piano and chromatic mode detect any semitone. Play a key and the nearest equal-tempered note appears above.
            </p>
          ) : (
            <div className="tuner-string-list">
              {tuning.strings.map((entry, index) => (
                <div
                  key={`${entry.midi}-${index}`}
                  className={`tuner-string ${effectiveMode === 'string' && selectedString === index ? 'selected' : ''} ${
                    reading?.stringIndex === index ? 'heard' : ''
                  }`}
                >
                  <button className="tuner-string-main" onClick={() => { setSelectedString(index); setMode('string'); }}>
                    <span className="tuner-string-index">{stringLabel(index, tuning.strings.length)}</span>
                    <strong>{midiToFullName(entry.midi)}</strong>
                    <small>{midiToFrequencyWithReference(entry.midi, reference).toFixed(1)} Hz</small>
                  </button>
                  <button
                    className="tuner-string-play"
                    onClick={() => playTarget(entry.midi)}
                    aria-label={`Play ${midiToFullName(entry.midi)}`}
                    title={`Play ${midiToFullName(entry.midi)}`}
                  >
                    <Icon name="sound" size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="tuner-mode">
            {MODES.map((entry) => (
              <button
                key={entry.id}
                className={effectiveMode === entry.id ? 'active' : ''}
                onClick={() => setMode(entry.id)}
                disabled={chromaticOnly && entry.id !== 'chromatic'}
                title={entry.hint}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <p className="metronome-note">
            {chromaticOnly
              ? 'Chromatic mode is always used for instruments without strings.'
              : MODES.find((entry) => entry.id === effectiveMode)?.hint}
          </p>
        </section>
      </div>

      {instrumentId === 'custom' ? (
        <section className="panel tuner-custom-panel">
          <div className="panel-head">
            <h2>Custom strings</h2>
            <span className="panel-note">{customStrings.length} of 12</span>
          </div>
          <p className="metronome-note">
            Order the strings from lowest to highest. The number on the left counts down from the highest string, the way
            guitar and bass strings are normally numbered.
          </p>
          <div className="tuner-custom-list">
            {customStrings.map((midi, index) => (
              <div className="tuner-custom-row" key={`${index}-${midi}`}>
                <span className="tuner-string-index">{stringLabel(index, customStrings.length)}</span>
                <select
                  className="tuner-select"
                  value={midi}
                  onChange={(event) => updateCustomString(index, Number(event.target.value))}
                  aria-label={`String ${index + 1} note`}
                >
                  {STRING_NOTE_OPTIONS.map((option) => (
                    <option key={option.midi} value={option.midi}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="tuner-custom-hz">{midiToFrequencyWithReference(midi, reference).toFixed(1)} Hz</span>
                <button
                  className="metronome-dock-icon"
                  onClick={() => removeCustomString(index)}
                  disabled={customStrings.length <= 1}
                  aria-label="Remove string"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="tuner-custom-actions">
            <button className="button ghost small" onClick={addCustomString} disabled={customStrings.length >= 12}>
              Add string
            </button>
            <button className="button ghost small" onClick={() => setCustomStrings(DEFAULT_CUSTOM_STRINGS)}>
              Reset to guitar standard
            </button>
          </div>
        </section>
      ) : (
        <section className="panel tuner-custom-panel">
          <div className="panel-head">
            <h2>Custom string set</h2>
            <span className="panel-note">Build any tuning</span>
          </div>
          <p className="tuner-empty">
            Choose <strong>Custom strings</strong> above to build a tuning note by note. It is useful for extended-range
            guitars, lute-family instruments, and any experiment that does not fit a preset.
          </p>
          <button className="button ghost small" onClick={() => selectInstrument('custom')}>
            Start a custom tuning
            <Icon name="arrow" size={15} />
          </button>
        </section>
      )}

      <section className="panel tuner-reference-panel">
        <div className="panel-head">
          <h2>Reference pitch</h2>
          <span className="panel-note">A4 = {reference.toFixed(1)} Hz</span>
        </div>
        <div className="tuner-reference-row">
          <input
            className="bpm-slider"
            type="range"
            min={415}
            max={450}
            step={0.5}
            value={reference}
            onChange={(event) => setReference(Number(event.target.value))}
            aria-label="Reference pitch for A4 in hertz"
          />
          <strong className="tuner-reference-value">{reference.toFixed(1)}</strong>
        </div>
        <div className="tuner-reference-presets">
          {[415, 432, 440, 442].map((value) => (
            <button
              key={value}
              className={`button ghost small ${reference === value ? 'active' : ''}`}
              onClick={() => setReference(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="metronome-note">
          Orchestras often tune to 442 or 443 Hz; period-instrument ensembles sometimes use 415 or 430 Hz. Every target
          note and reference tone follows this setting.
        </p>
      </section>

      <div className="tool-crosslink">
        <div>
          <strong>Keep the pulse steady</strong>
          <p>Open the metronome while you warm up, then leave it running in the dock.</p>
        </div>
        <Link className="button secondary small" to="/metronome">
          Open the metronome
          <Icon name="arrow" size={15} />
        </Link>
      </div>
    </div>
  );
}
