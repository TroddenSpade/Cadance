import { describe, expect, it } from 'vitest';
import {
  createDefaultState,
  finalizeState,
  mergeStates,
  normalizeState,
  shiftDay,
  streakEndingOn,
  todayKey,
  type AppState,
} from './progressState';

function makeState(overrides: Partial<AppState> = {}): AppState {
  return finalizeState({ ...createDefaultState(), ...overrides });
}

describe('streakEndingOn', () => {
  it('counts consecutive days ending on the given date', () => {
    const today = todayKey();
    const dates = [shiftDay(today, -2), shiftDay(today, -1), today];
    expect(streakEndingOn(dates, today)).toBe(3);
    expect(streakEndingOn(dates, shiftDay(today, -1))).toBe(2);
    expect(streakEndingOn([], today)).toBe(0);
  });
});

describe('finalizeState', () => {
  it('sums XP across devices', () => {
    const state = makeState({ xpByDevice: { phone: 100, laptop: 60 } });
    expect(state.xp).toBe(160);
  });

  it('sums only today across devices', () => {
    const today = todayKey();
    const state = makeState({
      dailyByDevice: {
        phone: { date: today, count: 4, correct: 3 },
        laptop: { date: today, count: 6, correct: 5 },
        old: { date: shiftDay(today, -1), count: 20, correct: 20 },
      },
    });
    expect(state.daily).toEqual({ date: today, count: 10, correct: 8 });
  });

  it('resets a stale streak but keeps the best streak', () => {
    const state = makeState({
      lastActive: shiftDay(todayKey(), -5),
      practiceDates: [shiftDay(todayKey(), -6), shiftDay(todayKey(), -5)],
      streak: 2,
      bestStreak: 9,
    });
    expect(state.streak).toBe(0);
    expect(state.bestStreak).toBe(9);
  });

  it('keeps a streak that is still alive from yesterday', () => {
    const today = todayKey();
    const state = makeState({
      lastActive: shiftDay(today, -1),
      practiceDates: [shiftDay(today, -2), shiftDay(today, -1)],
    });
    expect(state.streak).toBe(2);
  });
});

describe('normalizeState', () => {
  it('migrates version 1 progress onto the current device', () => {
    const today = todayKey();
    const state = normalizeState(
      {
        version: 1,
        settings: { instrument: 'piano', dailyGoal: 30 },
        xp: 120,
        daily: { date: today, count: 3, correct: 2 },
        lastActive: today,
        practiceDates: [today],
        lessons: { 'lesson-1': { completedAt: 100, bestScore: 80, attempts: 2 } },
      },
      'device-a',
    );

    expect(state.version).toBe(2);
    expect(state.xp).toBe(120);
    expect(state.xpByDevice).toEqual({ 'device-a': 120 });
    expect(state.daily.count).toBe(3);
    expect(state.dailyByDevice['device-a']).toEqual({ date: today, count: 3, correct: 2 });
    expect(state.settings.instrument).toBe('piano');
    expect(state.settings.dailyGoal).toBe(30);
    expect(state.lessons['lesson-1'].bestScore).toBe(80);
  });

  it('falls back to defaults for malformed input', () => {
    const state = normalizeState(null, 'device-a');
    expect(state.xp).toBe(0);
    expect(state.lessons).toEqual({});
    expect(state.settings.instrument).toBe('both');
  });
});

describe('mergeStates', () => {
  it('merges lessons by earliest completion and best score', () => {
    const local = makeState({
      lessons: { lesson: { completedAt: 2_000, bestScore: 80, attempts: 3 } },
    });
    const remote = makeState({
      lessons: {
        lesson: { completedAt: 1_000, bestScore: 90, attempts: 1 },
        extra: { completedAt: 1_500, bestScore: 70, attempts: 1 },
      },
    });

    const merged = mergeStates(local, remote);
    expect(merged.lessons.lesson).toEqual({ completedAt: 1_000, bestScore: 90, attempts: 3 });
    expect(merged.lessons.extra.bestScore).toBe(70);
  });

  it('sums XP once per device, even after repeated merges', () => {
    const phone = makeState({ xpByDevice: { phone: 100, laptop: 40 } });
    const laptop = makeState({ xpByDevice: { phone: 60, laptop: 70, tablet: 5 } });

    const merged = mergeStates(phone, laptop);
    expect(merged.xpByDevice).toEqual({ phone: 100, laptop: 70, tablet: 5 });
    expect(merged.xp).toBe(175);

    const again = mergeStates(merged, laptop);
    expect(again.xp).toBe(175);
    expect(again.xpByDevice).toEqual(merged.xpByDevice);
  });

  it('adds each device’s questions for today', () => {
    const today = todayKey();
    const phone = makeState({ dailyByDevice: { phone: { date: today, count: 5, correct: 4 } } });
    const laptop = makeState({ dailyByDevice: { laptop: { date: today, count: 3, correct: 3 } } });

    expect(mergeStates(phone, laptop).daily).toEqual({ date: today, count: 8, correct: 7 });
  });

  it('keeps the most recently reviewed skill record', () => {
    const local = makeState({
      skills: {
        intervals: { id: 'intervals', strength: 0.9, reviews: 4, streak: 3, lastSeen: 300, dueAt: 900 },
      },
    });
    const remote = makeState({
      skills: {
        intervals: { id: 'intervals', strength: 0.6, reviews: 2, streak: 1, lastSeen: 500, dueAt: 700 },
      },
    });

    expect(mergeStates(local, remote).skills.intervals.strength).toBe(0.6);
    expect(mergeStates(remote, local).skills.intervals.strength).toBe(0.6);
  });

  it('takes settings from the most recent change', () => {
    const local = makeState({
      settings: { ...createDefaultState().settings, dailyGoal: 10 },
      settingsUpdatedAt: 10,
    });
    const remote = makeState({
      settings: { ...createDefaultState().settings, dailyGoal: 40 },
      settingsUpdatedAt: 20,
    });

    expect(mergeStates(local, remote).settings.dailyGoal).toBe(40);
  });

  it('lets a reset clear progress saved on another device', () => {
    const remote = makeState({
      lessons: { old: { completedAt: 100, bestScore: 90, attempts: 4 } },
      xpByDevice: { phone: 500 },
      lastActive: todayKey(),
      practiceDates: [todayKey()],
    });
    const reset = makeState({ resetAt: 5_000 });

    const merged = mergeStates(reset, remote);
    expect(merged.lessons).toEqual({});
    expect(merged.xp).toBe(0);
    expect(merged.resetAt).toBe(5_000);
  });

  it('adopts account settings when a new device signs in', () => {
    const fresh = makeState();
    const remote = makeState({
      settings: { ...createDefaultState().settings, instrument: 'guitar' },
      settingsUpdatedAt: 0,
    });

    // Local state is always the first argument: a fresh device must not
    // overwrite the account's saved settings with its defaults.
    expect(mergeStates(fresh, remote).settings.instrument).toBe('guitar');
  });
});
