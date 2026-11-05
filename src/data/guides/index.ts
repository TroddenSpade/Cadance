import type { LessonGuide } from '../curriculum';
import { ADVANCED_GUIDES } from './advanced';
import { BEGINNER_GUIDES } from './beginner';
import { FOUNDATIONS_GUIDES } from './foundations';
import { INTERMEDIATE_GUIDES } from './intermediate';
import { MASTER_GUIDES } from './master';
import type { GuideContent } from './types';

export const ALL_GUIDES: GuideContent[] = [
  ...FOUNDATIONS_GUIDES,
  ...BEGINNER_GUIDES,
  ...INTERMEDIATE_GUIDES,
  ...ADVANCED_GUIDES,
  ...MASTER_GUIDES,
];

export const LESSON_GUIDES: Record<string, LessonGuide> = Object.fromEntries(
  ALL_GUIDES.map(({ id, idea, practice }) => [id, { idea, practice }]),
);

/** Persian translations keyed by the exact English display text. */
export const GUIDE_FA: Record<string, string> = Object.fromEntries(
  ALL_GUIDES.flatMap(({ idea, practice, faIdea, faPractice }) => [
    [idea, faIdea],
    [practice, faPractice],
  ]),
);
