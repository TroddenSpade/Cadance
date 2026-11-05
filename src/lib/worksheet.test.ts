import { describe, expect, it } from 'vitest';
import {
  MAX_WORKSHEET_MINUTES,
  MIN_WORKSHEET_MINUTES,
  WORKSHEET_ACTIVITIES,
  WORKSHEET_ACTIVITY_MAP,
  WORKSHEET_FOCUS,
  WORKSHEET_FOCUS_MAP,
  WORKSHEET_MINUTES,
  buildWorksheet,
} from './worksheet';

describe('worksheet builder', () => {
  it('offers five focuses and four lengths', () => {
    expect(WORKSHEET_FOCUS).toHaveLength(5);
    expect(WORKSHEET_FOCUS.map((focus) => focus.id)).toEqual([
      'balanced',
      'reading',
      'rhythm',
      'repertoire',
      'harmony',
    ]);
    expect(WORKSHEET_MINUTES).toEqual([15, 30, 45, 60]);
    for (const focus of WORKSHEET_FOCUS) {
      expect(WORKSHEET_FOCUS_MAP[focus.id]).toBe(focus);
      expect(focus.activities.length).toBeGreaterThan(0);
      for (const id of focus.activities) {
        expect(WORKSHEET_ACTIVITY_MAP[id], `${focus.id}: ${id}`).toBeDefined();
      }
    }
  });

  it('builds tasks whose minutes add up exactly to the requested total', () => {
    for (const focus of WORKSHEET_FOCUS) {
      for (const minutes of WORKSHEET_MINUTES) {
        const worksheet = buildWorksheet({ focus: focus.id, minutes });
        const total = worksheet.tasks.reduce((sum, task) => sum + task.minutes, 0);
        expect(total, `${focus.id}/${minutes}`).toBe(minutes);
        expect(worksheet.minutes).toBe(minutes);
        expect(worksheet.focus).toBe(focus.id);
        expect(worksheet.tasks.length).toBeGreaterThan(0);
        for (const task of worksheet.tasks) {
          expect(task.minutes).toBeGreaterThanOrEqual(2);
          expect(task.route.startsWith('/')).toBe(true);
        }
      }
    }
  });

  it('deduplicates requested activities but keeps the focus order', () => {
    const worksheet = buildWorksheet({
      focus: 'balanced',
      minutes: 30,
      activities: ['warmup', 'reading', 'reading', 'rhythm', 'warmup'],
    });
    expect(worksheet.tasks.map((task) => task.id)).toEqual(['warmup', 'reading', 'rhythm']);
  });

  it('clamps the total to the supported window', () => {
    const short = buildWorksheet({ focus: 'balanced', minutes: 1 });
    expect(short.minutes).toBe(MIN_WORKSHEET_MINUTES);
    const long = buildWorksheet({ focus: 'balanced', minutes: 999 });
    expect(long.minutes).toBe(MAX_WORKSHEET_MINUTES);
    expect(long.tasks.reduce((sum, task) => sum + task.minutes, 0)).toBe(MAX_WORKSHEET_MINUTES);
  });

  it('returns an empty sheet when no activity is selected', () => {
    const worksheet = buildWorksheet({ focus: 'balanced', minutes: 30, activities: [] });
    expect(worksheet.tasks).toEqual([]);
    expect(worksheet.minutes).toBe(30);
  });

  it('exposes a unique, routable catalogue', () => {
    expect(new Set(WORKSHEET_ACTIVITIES.map((activity) => activity.id)).size).toBe(
      WORKSHEET_ACTIVITIES.length,
    );
    for (const activity of WORKSHEET_ACTIVITIES) {
      expect(activity.weight).toBeGreaterThan(0);
      expect(activity.route.startsWith('/')).toBe(true);
      expect(activity.instruction.length).toBeGreaterThan(0);
    }
  });
});
