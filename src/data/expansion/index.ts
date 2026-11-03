import type { Course } from '../curriculum';
import type { ExpansionDemo } from './demoHelpers';
import { readingCourse, readingDemos } from './reading';
import { rhythmCourse, rhythmDemos } from './rhythm';
import { melodyCourse, melodyDemos } from './melody';
import { chromaticCourse, chromaticDemos } from './chromatic';
import { counterpointFormCourse, counterpointFormDemos } from './counterpointForm';
import { jazzCourse, jazzDemos } from './jazz';
import { musicianshipCourse, musicianshipDemos } from './musicianship';
import { postTonalCourse, postTonalDemos } from './postTonal';

export const EXPANSION_COURSES: Course[] = [
  readingCourse,
  rhythmCourse,
  melodyCourse,
  chromaticCourse,
  counterpointFormCourse,
  jazzCourse,
  musicianshipCourse,
  postTonalCourse,
];

export const EXPANSION_LESSON_INSTRUMENT_DEMOS: Record<string, ExpansionDemo[]> = {
  ...readingDemos,
  ...rhythmDemos,
  ...melodyDemos,
  ...chromaticDemos,
  ...counterpointFormDemos,
  ...jazzDemos,
  ...musicianshipDemos,
  ...postTonalDemos,
};
