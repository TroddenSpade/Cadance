import { useCallback, useEffect, useRef, useState } from 'react';
import { synth } from './audio';
import { clamp, type RhythmItem } from './music';
import type { InstrumentDemoSpec } from './types';

/** One sounding event in a practice pattern. `beat` is measured from the start. */
export interface PlayAlongEvent {
  beat: number;
  notes: number[];
  /** How long the event sounds, in beats. */
  beats: number;
  velocity?: number;
}

export interface PlayAlongPattern {
  events: PlayAlongEvent[];
  /** Length of one pass through the pattern, in beats. */
  totalBeats: number;
  beatsPerBar: number;
}

export const MIN_PLAY_ALONG_BPM = 30;
export const MAX_PLAY_ALONG_BPM = 220;

export function clampPlayAlongBpm(value: number): number {
  if (!Number.isFinite(value)) return 72;
  return Math.round(clamp(value, MIN_PLAY_ALONG_BPM, MAX_PLAY_ALONG_BPM));
}

/** Convert the app's seconds-per-beat demo tempo into beats per minute. */
export function bpmFromSecondsPerBeat(seconds: number, fallback = 72): number {
  if (!Number.isFinite(seconds) || seconds <= 0) return fallback;
  return clampPlayAlongBpm(60 / seconds);
}

export function sequencePattern(midis: number[], beatsPerBar = 4): PlayAlongPattern {
  const events = midis.map((midi, index) => ({
    beat: index,
    notes: [midi],
    beats: 0.92,
    velocity: 0.78,
  }));
  return { events, totalBeats: Math.max(1, midis.length), beatsPerBar };
}

export function chordPattern(chords: number[][], beatsPerChord = 4, beatsPerBar = 4): PlayAlongPattern {
  const events = chords.map((notes, index) => ({
    beat: index * beatsPerChord,
    notes,
    beats: beatsPerChord * 0.94,
    velocity: 0.72,
  }));
  return {
    events,
    totalBeats: Math.max(beatsPerChord, chords.length * beatsPerChord),
    beatsPerBar,
  };
}

export function rhythmPattern(
  items: RhythmItem[],
  midi = 84,
  beatsPerBar = 4,
): PlayAlongPattern {
  let cursor = 0;
  const events: PlayAlongEvent[] = [];
  items.forEach((item) => {
    const length = Math.abs(item.beats) || 1;
    if (!item.rest) {
      events.push({
        beat: cursor,
        notes: [midi],
        beats: length * 0.92,
        velocity: 0.7,
      });
    }
    cursor += length;
  });
  return { events, totalBeats: Math.max(beatsPerBar, cursor), beatsPerBar };
}

/** Adapt a lesson demonstration to the shared practice transport. */
export function patternFromDemo(spec: InstrumentDemoSpec, beatsPerBar = 4): PlayAlongPattern {
  if (spec.rhythm) return rhythmPattern(spec.rhythm, spec.notes[0] ?? 84, beatsPerBar);
  // Lesson progressions list one chord per `tempo` second, so each chord is
  // one beat of the transport rather than a full bar.
  if (spec.chords) return chordPattern(spec.chords, 1, beatsPerBar);
  if (spec.mode === 'chord') return chordPattern([spec.notes], 4, beatsPerBar);
  return sequencePattern(spec.notes, beatsPerBar);
}

export function demoBpm(spec: InstrumentDemoSpec): number {
  if (spec.rhythm) return bpmFromSecondsPerBeat(spec.tempo ?? 0.46);
  if (spec.chords) return bpmFromSecondsPerBeat(spec.tempo ?? 0.8);
  if (spec.mode === 'chord') return bpmFromSecondsPerBeat(spec.tempo ?? 1.1);
  return bpmFromSecondsPerBeat(spec.tempo ?? 0.5);
}

export interface PlayAlongControlsState {
  bpm: number;
  setBpm: (value: number) => void;
  nudgeBpm: (delta: number) => void;
  playing: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  loop: boolean;
  setLoop: (value: boolean) => void;
  countIn: number;
  setCountIn: (value: number) => void;
  click: boolean;
  setClick: (value: boolean) => void;
  /** Absolute beat since the pattern began, or -1 while stopped/counting in. */
  beat: number;
  /** Beat within the current bar, or -1. */
  barBeat: number;
  /** One-based count-in beat, or -1 when the count-in is finished. */
  countInBeat: number;
  totalBeats: number;
  beatsPerBar: number;
  beatSeconds: number;
}

interface Options {
  bpm?: number;
  countIn?: number;
  loop?: boolean;
  click?: boolean;
}

/**
 * A small AudioContext-clock transport shared by lesson examples, repertoire
 * pieces, and the explorer. Tempo, count-in, looping, and an optional click all
 * run from the same look-ahead scheduler, so the pulse stays steady while the
 * UI updates.
 */
export function usePlayAlong(
  pattern: PlayAlongPattern,
  options: Options = {},
): PlayAlongControlsState {
  const [bpm, setBpmState] = useState(() => clampPlayAlongBpm(options.bpm ?? 72));
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(options.loop ?? true);
  const [countIn, setCountInState] = useState(options.countIn ?? 0);
  const [click, setClick] = useState(options.click ?? true);
  const [beat, setBeat] = useState(-1);
  const [barBeat, setBarBeat] = useState(-1);
  const [countInBeat, setCountInBeat] = useState(-1);

  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpm);
  const loopRef = useRef(loop);
  const clickRef = useRef(click);
  const countInRef = useRef(countIn);
  const playingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const beatTimersRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);
  useEffect(() => {
    clickRef.current = click;
  }, [click]);
  useEffect(() => {
    countInRef.current = countIn;
  }, [countIn]);

  const clearBeatTimers = useCallback(() => {
    beatTimersRef.current.forEach((id) => window.clearTimeout(id));
    beatTimersRef.current.clear();
  }, []);

  const stop = useCallback(() => {
    playingRef.current = false;
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    clearBeatTimers();
    synth.stopAll();
    setPlaying(false);
    setBeat(-1);
    setBarBeat(-1);
    setCountInBeat(-1);
  }, [clearBeatTimers]);

  const start = useCallback(() => {
    const currentPattern = patternRef.current;
    if (!currentPattern.events.length) return;

    synth.unlock();
    synth.stopAll();
    clearBeatTimers();
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);

    playingRef.current = true;
    setPlaying(true);
    setBeat(-1);
    setBarBeat(-1);

    const beatsPerBar = Math.max(1, currentPattern.beatsPerBar);
    const totalBeats = Math.max(1, currentPattern.totalBeats);

    const scheduleBeat = (time: number, absoluteBeat: number, countBeat: number) => {
      const delay = Math.max(0, (time - synth.currentTime) * 1000);
      const id = window.setTimeout(() => {
        beatTimersRef.current.delete(id);
        if (!playingRef.current) return;
        if (countBeat >= 0) {
          setCountInBeat(countBeat);
          setBeat(-1);
          setBarBeat(-1);
        } else {
          const patternBeat = absoluteBeat % totalBeats;
          setCountInBeat(-1);
          setBeat(patternBeat);
          setBarBeat(patternBeat % beatsPerBar);
        }
      }, delay);
      beatTimersRef.current.add(id);
    };

    const beatSecondsNow = () => 60 / bpmRef.current;
    const countInBeats = Math.max(0, Math.min(8, Math.round(countInRef.current)));
    const startAt = synth.currentTime + 0.16 + countInBeats * beatSecondsNow();

    // Count-in clicks always sound, even when the practice click is off.
    for (let index = 0; index < countInBeats; index += 1) {
      const time = startAt - (countInBeats - index) * beatSecondsNow();
      synth.scheduleMetronomeClick(time, index === 0, 0.9);
      scheduleBeat(time, -1, index + 1);
    }

    let nextEventIndex = 0;
    let nextEventTime = startAt;
    let nextClickBeat = 0;
    let nextClickTime = startAt;
    let stoppedAtEnd = false;

    const scheduleStopAt = (time: number) => {
      if (stoppedAtEnd) return;
      stoppedAtEnd = true;
      const delay = Math.max(0, (time - synth.currentTime) * 1000);
      const id = window.setTimeout(() => {
        beatTimersRef.current.delete(id);
        if (playingRef.current) stop();
      }, delay);
      beatTimersRef.current.add(id);
    };

    const schedule = () => {
      if (!playingRef.current) return;
      const horizon = synth.currentTime + 0.15;

      // Notes. Events carry absolute beats, so gaps and rests stay honest.
      let guard = 0;
      while (nextEventTime < horizon && guard < 200) {
        guard += 1;

        if (nextEventIndex >= currentPattern.events.length) {
          if (!loopRef.current) {
            scheduleStopAt(nextEventTime);
            nextEventTime = Number.POSITIVE_INFINITY;
            break;
          }
          nextEventIndex = 0;
        }

        const event = currentPattern.events[nextEventIndex];
        const beatSeconds = beatSecondsNow();
        const lead = Math.max(0, nextEventTime - synth.currentTime);
        event.notes.forEach((midi, index) => {
          synth.playNote(
            midi,
            lead + index * 0.012,
            Math.max(0.1, event.beats * beatSeconds * 0.92),
            event.velocity ?? 0.78,
          );
        });

        const nextIndex = nextEventIndex + 1;
        const nextBeat =
          nextIndex < currentPattern.events.length
            ? currentPattern.events[nextIndex].beat
            : totalBeats;
        const gap = Math.max(0.03, (nextBeat - event.beat) * beatSeconds);
        nextEventTime += gap;
        nextEventIndex = nextIndex;
      }

      // Click track and visible beat cursor.
      let clickGuard = 0;
      while (nextClickTime < horizon && clickGuard < 200) {
        clickGuard += 1;
        if (!loopRef.current && nextClickBeat >= totalBeats) break;
        if (clickRef.current) {
          synth.scheduleMetronomeClick(
            nextClickTime,
            nextClickBeat % beatsPerBar === 0,
            0.65,
          );
        }
        scheduleBeat(nextClickTime, nextClickBeat, -1);
        nextClickBeat += 1;
        nextClickTime += beatSecondsNow();
      }
    };

    schedule();
    intervalRef.current = window.setInterval(schedule, 25);
  }, [clearBeatTimers, stop]);

  const toggle = useCallback(() => {
    if (playingRef.current) stop();
    else start();
  }, [start, stop]);

  const setBpm = useCallback((value: number) => {
    setBpmState(clampPlayAlongBpm(value));
  }, []);

  const nudgeBpm = useCallback((delta: number) => {
    setBpmState((current) => clampPlayAlongBpm(current + delta));
  }, []);

  const setCountIn = useCallback((value: number) => {
    setCountInState(Math.max(0, Math.min(8, Math.round(value))));
  }, []);

  useEffect(() => () => {
    playingRef.current = false;
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    clearBeatTimers();
  }, [clearBeatTimers]);

  return {
    bpm,
    setBpm,
    nudgeBpm,
    playing,
    start,
    stop,
    toggle,
    loop,
    setLoop,
    countIn,
    setCountIn,
    click,
    setClick,
    beat,
    barBeat,
    countInBeat,
    totalBeats: pattern.totalBeats,
    beatsPerBar: pattern.beatsPerBar,
    beatSeconds: 60 / bpm,
  };
}
