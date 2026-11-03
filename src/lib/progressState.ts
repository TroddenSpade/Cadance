import type { Timbre } from './audio';
import { clamp, type NoteNaming } from './music';

export type InstrumentMode = 'piano' | 'guitar' | 'both';

export interface Settings {
  instrument: InstrumentMode;
  timbre: Timbre;
  showLabels: boolean;
  noteNaming: NoteNaming;
  autoPlay: boolean;
  dailyGoal: number;
  sound: boolean;
}

export interface LessonProgress {
  completedAt?: number;
  bestScore: number;
  attempts: number;
}

export interface SkillProgress {
  id: string;
  strength: number;
  reviews: number;
  streak: number;
  lastSeen: number;
  dueAt: number;
}

export interface DailyTotals {
  date: string;
  count: number;
  correct: number;
}

/**
 * Whole-app progress document.
 *
 * `xp` and `daily` are derived totals so the UI can read them directly. The
 * authoritative numbers used for syncing live in `xpByDevice` and
 * `dailyByDevice`: each device only ever increments its own entry, so merging
 * two devices can take the maximum per device without double counting.
 */
export interface AppState {
  version: number;
  settings: Settings;
  lessons: Record<string, LessonProgress>;
  skills: Record<string, SkillProgress>;
  xp: number;
  streak: number;
  bestStreak: number;
  lastActive: string;
  practiceDates: string[];
  daily: DailyTotals;
  xpByDevice: Record<string, number>;
  dailyByDevice: Record<string, DailyTotals>;
  /** Last time settings changed, used to decide which side wins on merge. */
  settingsUpdatedAt: number;
  /** Timestamp of the last "reset progress" action, so resets propagate. */
  resetAt: number;
}

export const STATE_VERSION = 2;
export const STORAGE_KEY = 'cadence.progress.v1';
export const DEVICE_KEY = 'cadence.device.v1';
export const DAY = 24 * 60 * 60 * 1000;
export const MAX_PRACTICE_DATES = 400;

export const defaultSettings: Settings = {
  instrument: 'both',
  timbre: 'piano',
  showLabels: true,
  noteNaming: 'both',
  autoPlay: true,
  dailyGoal: 20,
  sound: true,
};

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return todayKey(date);
}

export function shiftDay(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return todayKey(date);
}

export function createDefaultState(): AppState {
  return {
    version: STATE_VERSION,
    settings: { ...defaultSettings },
    lessons: {},
    skills: {},
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastActive: '',
    practiceDates: [],
    daily: { date: todayKey(), count: 0, correct: 0 },
    xpByDevice: {},
    dailyByDevice: {},
    settingsUpdatedAt: 0,
    resetAt: 0,
  };
}

/** Stable id for this browser/install, used for per-device counters. */
export function getDeviceId(): string {
  const fallback = `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    const existing = localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : fallback;
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return fallback;
  }
}

export function loadState(deviceId: string): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return normalizeState(JSON.parse(raw), deviceId);
  } catch {
    return createDefaultState();
  }
}

export function uniqueDates(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  values.forEach((value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) seen.add(value);
  });
  return [...seen].sort();
}

/** Number of consecutive practice days ending on `end`. */
export function streakEndingOn(dates: string[], end: string): number {
  if (!end) return 0;
  const set = new Set(dates);
  let cursor = end;
  let count = 0;
  while (set.has(cursor)) {
    count += 1;
    cursor = shiftDay(cursor, -1);
  }
  return count;
}

/**
 * Recompute everything that is derived: XP, today's question totals, and the
 * streak. Safe to call on every load, merge, and mutation.
 */
export function finalizeState(state: AppState): AppState {
  const today = todayKey();
  const dates = uniqueDates(state.practiceDates);

  const xp = Object.values(state.xpByDevice).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);

  const totals = Object.values(state.dailyByDevice).reduce(
    (acc, entry) => {
      if (!entry || entry.date !== today) return acc;
      return { count: acc.count + entry.count, correct: acc.correct + entry.correct };
    },
    { count: 0, correct: 0 },
  );

  const active = state.lastActive === today || state.lastActive === yesterdayKey();
  const computed = state.lastActive ? streakEndingOn(dates, state.lastActive) : 0;
  const streak = active ? computed : 0;
  const bestStreak = Math.max(state.bestStreak, streak, computed);

  return {
    ...state,
    version: STATE_VERSION,
    xp: Math.round(xp),
    streak,
    bestStreak,
    practiceDates: dates.slice(-MAX_PRACTICE_DATES),
    daily: { date: today, count: totals.count, correct: totals.correct },
  };
}

/** Mark today as active and keep the practice calendar in sync. */
export function touchActivity(state: AppState): AppState {
  const today = todayKey();
  const dates = state.practiceDates.includes(today) ? state.practiceDates : [...state.practiceDates, today];
  return { ...state, lastActive: today, practiceDates: dates.slice(-MAX_PRACTICE_DATES) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function sanitizeSettings(raw: unknown): Settings {
  const value = isRecord(raw) ? raw : {};
  const instrument =
    value.instrument === 'piano' || value.instrument === 'guitar' || value.instrument === 'both'
      ? value.instrument
      : defaultSettings.instrument;
  return {
    instrument,
    timbre: value.timbre === 'guitar' ? 'guitar' : 'piano',
    showLabels: value.showLabels !== false,
    noteNaming:
      value.noteNaming === 'letters' || value.noteNaming === 'solfege' ? value.noteNaming : 'both',
    autoPlay: value.autoPlay !== false,
    dailyGoal: Math.round(clamp(asNumber(value.dailyGoal, defaultSettings.dailyGoal), 5, 200)),
    sound: value.sound !== false,
  };
}

function sanitizeLessons(raw: unknown): Record<string, LessonProgress> {
  if (!isRecord(raw)) return {};
  const lessons: Record<string, LessonProgress> = {};
  Object.entries(raw).forEach(([id, value]) => {
    if (!isRecord(value)) return;
    lessons[id] = {
      completedAt: typeof value.completedAt === 'number' ? value.completedAt : undefined,
      bestScore: asNumber(value.bestScore),
      attempts: asNumber(value.attempts),
    };
  });
  return lessons;
}

function sanitizeSkills(raw: unknown): Record<string, SkillProgress> {
  if (!isRecord(raw)) return {};
  const skills: Record<string, SkillProgress> = {};
  Object.entries(raw).forEach(([id, value]) => {
    if (!isRecord(value)) return;
    skills[id] = {
      id: typeof value.id === 'string' ? value.id : id,
      strength: clamp(asNumber(value.strength), 0, 1),
      reviews: asNumber(value.reviews),
      streak: asNumber(value.streak),
      lastSeen: asNumber(value.lastSeen),
      dueAt: asNumber(value.dueAt),
    };
  });
  return skills;
}

function sanitizeXpByDevice(raw: unknown): Record<string, number> {
  if (!isRecord(raw)) return {};
  const result: Record<string, number> = {};
  Object.entries(raw).forEach(([device, value]) => {
    const xp = asNumber(value, Number.NaN);
    if (Number.isFinite(xp) && xp >= 0) result[device] = xp;
  });
  return result;
}

function sanitizeDailyByDevice(raw: unknown): Record<string, DailyTotals> {
  if (!isRecord(raw)) return {};
  const result: Record<string, DailyTotals> = {};
  Object.entries(raw).forEach(([device, value]) => {
    if (!isRecord(value) || typeof value.date !== 'string') return;
    result[device] = {
      date: value.date,
      count: Math.max(0, asNumber(value.count)),
      correct: Math.max(0, asNumber(value.correct)),
    };
  });
  return result;
}

/**
 * Upgrade a stored or remote document to the current shape. Version 1 kept a
 * single `xp` and `daily` value, which are attributed to the current device on
 * first load; from then on the per-device maps are authoritative.
 */
export function normalizeState(raw: unknown, deviceId: string): AppState {
  if (!isRecord(raw)) return createDefaultState();
  const parsed = raw as Record<string, unknown> & Partial<AppState>;
  const legacy = asNumber(parsed.version, 1) < STATE_VERSION;

  const xpByDevice = sanitizeXpByDevice(parsed.xpByDevice);
  if (legacy && Object.keys(xpByDevice).length === 0) {
    const xp = asNumber(parsed.xp);
    if (xp > 0) xpByDevice[deviceId] = xp;
  }

  const dailyByDevice = sanitizeDailyByDevice(parsed.dailyByDevice);
  if (legacy && Object.keys(dailyByDevice).length === 0 && isRecord(parsed.daily)) {
    const legacyDaily = parsed.daily;
    if (typeof legacyDaily.date === 'string') {
      dailyByDevice[deviceId] = {
        date: legacyDaily.date,
        count: asNumber(legacyDaily.count),
        correct: asNumber(legacyDaily.correct),
      };
    }
  }

  return finalizeState({
    version: STATE_VERSION,
    settings: sanitizeSettings(parsed.settings),
    lessons: sanitizeLessons(parsed.lessons),
    skills: sanitizeSkills(parsed.skills),
    xp: 0,
    streak: asNumber(parsed.streak),
    bestStreak: asNumber(parsed.bestStreak),
    lastActive: typeof parsed.lastActive === 'string' ? parsed.lastActive : '',
    practiceDates: uniqueDates(parsed.practiceDates),
    daily: { date: todayKey(), count: 0, correct: 0 },
    xpByDevice,
    dailyByDevice,
    settingsUpdatedAt: asNumber(parsed.settingsUpdatedAt),
    resetAt: asNumber(parsed.resetAt),
  });
}

function mergeLessons(
  left: Record<string, LessonProgress>,
  right: Record<string, LessonProgress>,
): Record<string, LessonProgress> {
  const merged: Record<string, LessonProgress> = { ...left };
  Object.entries(right).forEach(([id, entry]) => {
    const existing = merged[id];
    if (!existing) {
      merged[id] = { ...entry };
      return;
    }
    const completed = [existing.completedAt, entry.completedAt].filter(
      (value): value is number => typeof value === 'number',
    );
    merged[id] = {
      completedAt: completed.length ? Math.min(...completed) : undefined,
      bestScore: Math.max(existing.bestScore, entry.bestScore),
      // Attempts are only merged by maximum: summing would double count every
      // time the same two devices sync again.
      attempts: Math.max(existing.attempts, entry.attempts),
    };
  });
  return merged;
}

function pickSkill(a: SkillProgress, b: SkillProgress): SkillProgress {
  if (a.lastSeen !== b.lastSeen) return a.lastSeen > b.lastSeen ? a : b;
  return a.reviews >= b.reviews ? a : b;
}

function mergeSkills(
  left: Record<string, SkillProgress>,
  right: Record<string, SkillProgress>,
): Record<string, SkillProgress> {
  const merged: Record<string, SkillProgress> = { ...left };
  Object.entries(right).forEach(([id, entry]) => {
    const existing = merged[id];
    merged[id] = existing ? pickSkill(existing, entry) : { ...entry };
  });
  return merged;
}

function mergeMaxMap(left: Record<string, number>, right: Record<string, number>): Record<string, number> {
  const merged: Record<string, number> = { ...left };
  Object.entries(right).forEach(([key, value]) => {
    merged[key] = Math.max(merged[key] ?? 0, value);
  });
  return merged;
}

function mergeDaily(
  left: Record<string, DailyTotals>,
  right: Record<string, DailyTotals>,
): Record<string, DailyTotals> {
  const merged: Record<string, DailyTotals> = { ...left };
  Object.entries(right).forEach(([device, entry]) => {
    const existing = merged[device];
    if (!existing || entry.date > existing.date) {
      merged[device] = { ...entry };
      return;
    }
    if (entry.date === existing.date) {
      merged[device] = {
        date: entry.date,
        count: Math.max(existing.count, entry.count),
        correct: Math.max(existing.correct, entry.correct),
      };
    }
  });
  return merged;
}

/**
 * Merge two copies of the progress document.
 *
 * Rules:
 * - A newer `resetAt` wins outright for learning data, so a reset propagates.
 * - Settings follow the later `settingsUpdatedAt`.
 * - Lessons keep the earliest completion and best score.
 * - Skills keep the record seen most recently.
 * - XP and daily totals are per device, merged by maximum, then summed.
 */
export function mergeStates(local: AppState, remote: AppState): AppState {
  const resetAt = Math.max(local.resetAt, remote.resetAt);
  const newerReset = local.resetAt === remote.resetAt ? null : local.resetAt > remote.resetAt ? local : remote;
  // Ties go to the remote copy: a device signing in for the first time still
  // has default settings and must not overwrite the account's saved ones.
  const settingsSource = local.settingsUpdatedAt > remote.settingsUpdatedAt ? local : remote;
  const left = local;
  const right = remote;

  const merged: AppState = {
    version: STATE_VERSION,
    settings: settingsSource.settings,
    settingsUpdatedAt: settingsSource.settingsUpdatedAt,
    lessons: newerReset ? newerReset.lessons : mergeLessons(left.lessons, right.lessons),
    skills: newerReset ? newerReset.skills : mergeSkills(left.skills, right.skills),
    xpByDevice: newerReset ? newerReset.xpByDevice : mergeMaxMap(left.xpByDevice, right.xpByDevice),
    dailyByDevice: newerReset ? newerReset.dailyByDevice : mergeDaily(left.dailyByDevice, right.dailyByDevice),
    practiceDates: newerReset
      ? newerReset.practiceDates
      : uniqueDates([...left.practiceDates, ...right.practiceDates]).slice(-MAX_PRACTICE_DATES),
    lastActive: newerReset
      ? newerReset.lastActive
      : left.lastActive > right.lastActive
        ? left.lastActive
        : right.lastActive,
    streak: newerReset ? newerReset.streak : Math.max(left.streak, right.streak),
    bestStreak: newerReset ? newerReset.bestStreak : Math.max(left.bestStreak, right.bestStreak),
    resetAt,
    // Derived below.
    xp: 0,
    daily: { date: todayKey(), count: 0, correct: 0 },
  };

  return finalizeState(merged);
}
