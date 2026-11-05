import { describe, expect, it } from 'vitest';
import { ALL_LESSONS } from './curriculum';
import { REPERTOIRE_MAP } from './repertoire';
import {
  STYLE_PATH_MAP,
  STYLE_PATHS,
  pathLessonIds,
  stylePathProgress,
  type StylePathStep,
} from './stylePaths';
import { ANALYSIS_MAP } from '../lib/analysis';
import { LOOP_KEYS, LOOP_STYLES } from '../lib/loops';

const lessonIds = new Set(ALL_LESSONS.map((lesson) => lesson.id));
const rooms = new Set(['sight-reading', 'rhythm', 'trainer', 'repertoire']);

describe('style paths', () => {
  it('defines four unique paths with a title and a route', () => {
    expect(STYLE_PATHS).toHaveLength(4);
    expect(new Set(STYLE_PATHS.map((path) => path.id)).size).toBe(4);
    for (const path of STYLE_PATHS) {
      expect(STYLE_PATH_MAP[path.id]).toBe(path);
      expect(path.steps.length).toBeGreaterThanOrEqual(5);
      expect(path.title.length).toBeGreaterThan(0);
      expect(path.tagline.length).toBeGreaterThan(0);
      expect(path.description.length).toBeGreaterThan(0);
    }
  });

  it('only points at content that exists', () => {
    for (const path of STYLE_PATHS) {
      for (const step of path.steps) {
        if (step.kind === 'lesson') {
          expect(lessonIds.has(step.lessonId), `${path.id}: ${step.lessonId}`).toBe(true);
        } else if (step.kind === 'piece') {
          expect(REPERTOIRE_MAP[step.pieceId], `${path.id}: ${step.pieceId}`).toBeDefined();
        } else if (step.kind === 'analysis') {
          expect(ANALYSIS_MAP[step.progressionId], `${path.id}: ${step.progressionId}`).toBeDefined();
        } else if (step.kind === 'loop') {
          expect(LOOP_STYLES.some((style) => style.id === step.styleId)).toBe(true);
          expect(LOOP_KEYS.some((key) => key.pc === step.keyPc)).toBe(true);
        } else {
          expect(rooms.has(step.room), `${path.id}: ${step.room}`).toBe(true);
        }
      }
    }
  });

  it('counts only lesson steps toward progress', () => {
    for (const path of STYLE_PATHS) {
      const ids = pathLessonIds(path);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids.length).toBe(
        path.steps.filter((step) => step.kind === 'lesson').length,
      );

      const empty = stylePathProgress(path, {});
      expect(empty).toEqual({ done: 0, total: ids.length });

      const lessons = Object.fromEntries(
        ids.map((id, index) => [id, index === 0 ? { completedAt: Date.now() } : {}]),
      );
      expect(stylePathProgress(path, lessons)).toEqual({ done: 1, total: ids.length });
    }
  });

  it('starts every path with a lesson so the first next step is actionable', () => {
    for (const path of STYLE_PATHS) {
      const first = path.steps[0] as StylePathStep;
      expect(first.kind).toBe('lesson');
    }
  });
});
