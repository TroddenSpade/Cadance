import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { synth } from './audio';

export type Subdivision = 'none' | 'eighth' | 'triplet';

export interface MetronomeSettings {
  bpm: number;
  beatsPerBar: number;
  subdivision: Subdivision;
  accentFirst: boolean;
  volume: number;
}

export const MIN_BPM = 30;
export const MAX_BPM = 260;
const STORAGE_KEY = 'cadence.metronome.v1';
const LOOKAHEAD_SECONDS = 0.12;
const SCHEDULER_MS = 25;

const DEFAULTS: MetronomeSettings = {
  bpm: 72,
  beatsPerBar: 4,
  subdivision: 'none',
  accentFirst: true,
  volume: 0.8,
};

export const METERS = [2, 3, 4, 5, 6, 7] as const;

export const SUBDIVISIONS: Array<{ id: Subdivision; label: string; short: string }> = [
  { id: 'none', label: 'Quarter notes', short: '1' },
  { id: 'eighth', label: 'Eighth notes', short: '2' },
  { id: 'triplet', label: 'Triplets', short: '3' },
];

export function subdivisionCount(subdivision: Subdivision): number {
  if (subdivision === 'triplet') return 3;
  if (subdivision === 'eighth') return 2;
  return 1;
}

export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) return DEFAULTS.bpm;
  return Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(value)));
}

function loadSettings(): MetronomeSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<MetronomeSettings>;
    return {
      bpm: clampBpm(parsed.bpm ?? DEFAULTS.bpm),
      beatsPerBar: METERS.includes((parsed.beatsPerBar ?? 4) as (typeof METERS)[number])
        ? (parsed.beatsPerBar as number)
        : DEFAULTS.beatsPerBar,
      subdivision:
        parsed.subdivision === 'eighth' || parsed.subdivision === 'triplet' ? parsed.subdivision : 'none',
      accentFirst: parsed.accentFirst !== false,
      volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(1, parsed.volume)) : DEFAULTS.volume,
    };
  } catch {
    return DEFAULTS;
  }
}

interface MetronomeContextValue {
  settings: MetronomeSettings;
  running: boolean;
  /** Beat index that is currently sounding, or -1 when stopped. */
  beat: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setBpm: (bpm: number) => void;
  nudgeBpm: (delta: number) => void;
  setBeatsPerBar: (beats: number) => void;
  setSubdivision: (subdivision: Subdivision) => void;
  setAccentFirst: (accent: boolean) => void;
  setVolume: (volume: number) => void;
  tap: () => void;
}

const MetronomeContext = createContext<MetronomeContextValue | null>(null);

export function MetronomeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MetronomeSettings>(loadSettings);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(-1);

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  const timersRef = useRef<Set<number>>(new Set());
  const tapsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage can be unavailable; the metronome still works in memory */
    }
  }, [settings]);

  // One AudioContext-clock scheduler shared by the dock, the lesson widget and
  // the full page. The timer only queues clicks; it never plays them directly.
  useEffect(() => {
    if (!running) {
      clearTimers();
      setBeat(-1);
      return;
    }

    synth.unlock();
    let nextTime = synth.currentTime + 0.06;
    let beatIndex = 0;
    let subIndex = 0;

    const schedule = () => {
      const current = settingsRef.current;
      const perBeat = subdivisionCount(current.subdivision);
      const secondsPerSubdivision = 60 / current.bpm / perBeat;
      const horizon = synth.currentTime + LOOKAHEAD_SECONDS;

      while (nextTime < horizon) {
        const startOfBeat = subIndex === 0;
        const strong =
          startOfBeat &&
          current.accentFirst &&
          (current.beatsPerBar === 6 ? beatIndex === 0 || beatIndex === 3 : beatIndex === 0);

        synth.scheduleMetronomeClick(nextTime, strong, current.volume, !startOfBeat);

        if (startOfBeat) {
          const visibleBeat = beatIndex;
          const delay = Math.max(0, (nextTime - synth.currentTime) * 1000);
          const id = window.setTimeout(() => {
            timersRef.current.delete(id);
            setBeat(visibleBeat);
          }, delay);
          timersRef.current.add(id);
        }

        nextTime += secondsPerSubdivision;
        subIndex += 1;
        if (subIndex >= perBeat) {
          subIndex = 0;
          beatIndex = (beatIndex + 1) % Math.max(1, current.beatsPerBar);
        }
      }
    };

    schedule();
    const interval = window.setInterval(schedule, SCHEDULER_MS);
    return () => {
      window.clearInterval(interval);
      clearTimers();
    };
  }, [running, clearTimers]);

  const start = useCallback(() => {
    synth.unlock();
    tapsRef.current = [];
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    tapsRef.current = [];
  }, []);

  const toggle = useCallback(() => {
    if (running) stop();
    else start();
  }, [running, start, stop]);

  const update = useCallback((patch: Partial<MetronomeSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const setBpm = useCallback(
    (bpm: number) => {
      update({ bpm: clampBpm(bpm) });
    },
    [update],
  );

  const nudgeBpm = useCallback(
    (delta: number) => {
      setSettings((current) => ({ ...current, bpm: clampBpm(current.bpm + delta) }));
    },
    [],
  );

  const setBeatsPerBar = useCallback(
    (beats: number) => {
      update({ beatsPerBar: Math.max(1, Math.min(12, Math.round(beats))) });
    },
    [update],
  );

  const setSubdivision = useCallback(
    (subdivision: Subdivision) => {
      update({ subdivision });
    },
    [update],
  );

  const setAccentFirst = useCallback(
    (accentFirst: boolean) => {
      update({ accentFirst });
    },
    [update],
  );

  const setVolume = useCallback(
    (volume: number) => {
      update({ volume: Math.max(0, Math.min(1, volume)) });
    },
    [update],
  );

  /** Tap tempo: average the gaps between the last few taps, ignoring long pauses. */
  const tap = useCallback(() => {
    const now = performance.now();
    const taps = tapsRef.current.filter((time) => now - time < 2200);
    taps.push(now);
    if (taps.length > 7) taps.shift();
    tapsRef.current = taps;
    if (taps.length < 2) return;

    const intervals: number[] = [];
    for (let index = 1; index < taps.length; index += 1) intervals.push(taps[index] - taps[index - 1]);
    const average = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
    if (average <= 0) return;
    setSettings((current) => ({ ...current, bpm: clampBpm(60000 / average) }));
  }, []);

  const value = useMemo<MetronomeContextValue>(
    () => ({
      settings,
      running,
      beat,
      start,
      stop,
      toggle,
      setBpm,
      nudgeBpm,
      setBeatsPerBar,
      setSubdivision,
      setAccentFirst,
      setVolume,
      tap,
    }),
    [
      settings,
      running,
      beat,
      start,
      stop,
      toggle,
      setBpm,
      nudgeBpm,
      setBeatsPerBar,
      setSubdivision,
      setAccentFirst,
      setVolume,
      tap,
    ],
  );

  return <MetronomeContext.Provider value={value}>{children}</MetronomeContext.Provider>;
}

export function useMetronome(): MetronomeContextValue {
  const context = useContext(MetronomeContext);
  if (!context) throw new Error('useMetronome must be used inside MetronomeProvider');
  return context;
}

/** Accent pattern used by the beat dots: 6/8 leans on beats 1 and 4. */
export function isStrongBeat(index: number, beatsPerBar: number): boolean {
  if (beatsPerBar === 6) return index === 0 || index === 3;
  return index === 0;
}

export function meterLabel(beatsPerBar: number): string {
  if (beatsPerBar === 6) return '6/8';
  if (beatsPerBar === 5) return '5/4';
  if (beatsPerBar === 7) return '7/8';
  return `${beatsPerBar}/4`;
}
