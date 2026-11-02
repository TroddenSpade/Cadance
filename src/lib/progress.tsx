import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { synth, type Timbre } from './audio';
import { clamp } from './music';

export type InstrumentMode = 'piano' | 'guitar' | 'both';

export interface Settings {
  instrument: InstrumentMode;
  timbre: Timbre;
  showLabels: boolean;
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
  daily: { date: string; count: number; correct: number };
}

const STORAGE_KEY = 'cadence.progress.v1';
const DAY = 24 * 60 * 60 * 1000;

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return todayKey(date);
}

const defaultSettings: Settings = {
  instrument: 'both',
  timbre: 'piano',
  showLabels: true,
  autoPlay: true,
  dailyGoal: 20,
  sound: true,
};

const defaultState: AppState = {
  version: 1,
  settings: defaultSettings,
  lessons: {},
  skills: {},
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActive: '',
  practiceDates: [],
  daily: { date: todayKey(), count: 0, correct: 0 },
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const today = todayKey();
    const staleStreak = Boolean(
      parsed.lastActive && parsed.lastActive !== today && parsed.lastActive !== yesterdayKey(),
    );
    return {
      ...defaultState,
      ...parsed,
      streak: staleStreak ? 0 : (parsed.streak ?? 0),
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      lessons: parsed.lessons ?? {},
      skills: parsed.skills ?? {},
      daily:
        parsed.daily && parsed.daily.date === today
          ? parsed.daily
          : { date: today, count: 0, correct: 0 },
      practiceDates: parsed.practiceDates ?? [],
    };
  } catch {
    return defaultState;
  }
}

function activityUpdate(state: AppState): Pick<AppState, 'streak' | 'bestStreak' | 'lastActive' | 'practiceDates'> {
  const today = todayKey();
  if (state.lastActive === today) {
    return {
      streak: state.streak,
      bestStreak: state.bestStreak,
      lastActive: state.lastActive,
      practiceDates: state.practiceDates.includes(today)
        ? state.practiceDates
        : [...state.practiceDates, today].slice(-400),
    };
  }
  const nextStreak = state.lastActive === yesterdayKey() ? state.streak + 1 : 1;
  return {
    streak: nextStreak,
    bestStreak: Math.max(state.bestStreak, nextStreak),
    lastActive: today,
    practiceDates: [...state.practiceDates, today].slice(-400),
  };
}

const REVIEW_INTERVALS = [0.25, 1, 2, 4, 7, 14, 30, 60];

interface ProgressApi {
  state: AppState;
  settings: Settings;
  dueSkills: SkillProgress[];
  updateSettings: (partial: Partial<Settings>) => void;
  recordAnswer: (skillIds: string[], correct: boolean) => void;
  finishLesson: (lessonId: string, score: number, passed: boolean) => void;
  resetProgress: () => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.instrument = state.settings.instrument;
  }, [state.settings.instrument]);

  useEffect(() => {
    synth.setTimbre(state.settings.timbre);
    synth.setMuted(!state.settings.sound);
  }, [state.settings.timbre, state.settings.sound]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...partial } }));
  }, []);

  const recordAnswer = useCallback((skillIds: string[], correct: boolean) => {
    setState((prev) => {
      const now = Date.now();
      const skills = { ...prev.skills };
      skillIds.forEach((id) => {
        const existing = skills[id];
        const reviews = (existing?.reviews ?? 0) + 1;
        // Several questions can hit the same skill in one sitting. Only a new
        // session may advance the spaced-repetition interval.
        const sameSession = existing !== undefined && now - existing.lastSeen < 10 * 60 * 1000;
        const streak = correct
          ? sameSession
            ? Math.max(existing.streak, 1)
            : (existing?.streak ?? 0) + 1
          : 0;
        const baseStrength = existing?.strength ?? 0.45;
        const strength = clamp(
          correct ? baseStrength + (1 - baseStrength) * 0.22 : baseStrength - 0.18,
          0.05,
          1,
        );
        const intervalDays = correct
          ? REVIEW_INTERVALS[Math.min(streak - 1, REVIEW_INTERVALS.length - 1)]
          : REVIEW_INTERVALS[0];
        skills[id] = {
          id,
          strength,
          reviews,
          streak,
          lastSeen: now,
          dueAt: now + intervalDays * DAY,
        };
      });
      const today = todayKey();
      const daily =
        prev.daily.date === today
          ? { ...prev.daily, count: prev.daily.count + 1, correct: prev.daily.correct + (correct ? 1 : 0) }
          : { date: today, count: 1, correct: correct ? 1 : 0 };
      return {
        ...prev,
        ...activityUpdate(prev),
        skills,
        daily,
        xp: prev.xp + (correct ? 10 : 2),
      };
    });
  }, []);

  const finishLesson = useCallback((lessonId: string, score: number, passed: boolean) => {
    setState((prev) => {
      const existing = prev.lessons[lessonId];
      const firstCompletion = passed && !existing?.completedAt;
      return {
        ...prev,
        ...activityUpdate(prev),
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            completedAt: existing?.completedAt ?? (passed ? Date.now() : undefined),
            bestScore: Math.max(existing?.bestScore ?? 0, score),
            attempts: (existing?.attempts ?? 0) + 1,
          },
        },
        xp: prev.xp + (firstCompletion ? 60 : 10),
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...defaultState,
      settings: prev.settings,
      daily: { date: todayKey(), count: 0, correct: 0 },
    }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultState, daily: { date: todayKey(), count: 0, correct: 0 } });
  }, []);

  const dueSkills = useMemo(() => {
    const now = Date.now();
    return Object.values(state.skills)
      .filter((skill) => skill.dueAt <= now)
      .sort((a, b) => a.strength - b.strength);
  }, [state.skills, state.lastActive]);

  const value = useMemo<ProgressApi>(
    () => ({
      state,
      settings: state.settings,
      dueSkills,
      updateSettings,
      recordAnswer,
      finishLesson,
      resetProgress,
      resetAll,
    }),
    [state, dueSkills, updateSettings, recordAnswer, finishLesson, resetProgress, resetAll],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used inside ProgressProvider');
  return context;
}

export function levelFromXp(xp: number): { level: number; title: string; progress: number; next: number } {
  const titles = ['Curious Ear', 'Apprentice', 'Sight Reader', 'Harmonist', 'Analyst', 'Composer', 'Master'];
  const thresholds = [0, 250, 700, 1500, 2800, 4500, 7000];
  let index = 0;
  thresholds.forEach((threshold, i) => {
    if (xp >= threshold) index = i;
  });
  const start = thresholds[index];
  const end = thresholds[Math.min(index + 1, thresholds.length - 1)] ?? start + 1000;
  const progress = index === thresholds.length - 1 ? 1 : (xp - start) / (end - start);
  return { level: index + 1, title: titles[index], progress: clamp(progress, 0, 1), next: end };
}
