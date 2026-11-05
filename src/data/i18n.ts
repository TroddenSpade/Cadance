import { useMemo } from 'react';
import { fa } from '../locales/fa';
import {
  ALL_LESSONS,
  COURSES,
  COURSE_MAP,
  LESSON_MAP,
  LEVELS,
  nextLesson as nextEnglishLesson,
  previousLesson as previousEnglishLesson,
  type Course,
  type Lesson,
  type Level,
  type LevelId,
  type LessonSection,
} from '../data/curriculum';
import { EXPANSION_LESSON_INSTRUMENT_DEMOS } from '../data/expansion';
import { LESSON_INSTRUMENT_DEMOS, type LessonInstrumentDemo } from '../data/instrumentExamples';
import type { ExerciseSpec, InstrumentDemoSpec } from '../lib/types';
import { getLanguage, useI18n } from '../lib/i18n';

export type LessonWithCourse = Lesson & {
  courseId: string;
  courseTitle: string;
  level: LevelId;
};

function tx(value: string): string {
  if (getLanguage() !== 'fa') return value;
  return fa[value] ?? value;
}

function txOptional(value: string | undefined): string | undefined {
  return value === undefined ? undefined : tx(value);
}

function localizeSection(section: LessonSection): LessonSection {
  return {
    ...section,
    heading: txOptional(section.heading),
    body: tx(section.body),
    audioLabel: txOptional(section.audioLabel),
  };
}

function localizeExercise(exercise: ExerciseSpec): ExerciseSpec {
  return { ...exercise, label: txOptional(exercise.label) };
}

export function localizeLesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    title: tx(lesson.title),
    summary: tx(lesson.summary),
    sections: lesson.sections.map(localizeSection),
    exercises: lesson.exercises.map(localizeExercise),
    guide: lesson.guide
      ? { idea: tx(lesson.guide.idea), practice: tx(lesson.guide.practice) }
      : undefined,
  };
}

export function localizeCourse(course: Course): Course {
  return {
    ...course,
    title: tx(course.title),
    subtitle: tx(course.subtitle),
    lessons: course.lessons.map(localizeLesson),
  };
}

function localizeLevel(level: Level): Level {
  return { ...level, title: tx(level.title), blurb: tx(level.blurb) };
}

export function localizeDemoSpec(spec: InstrumentDemoSpec): InstrumentDemoSpec {
  return {
    ...spec,
    title: txOptional(spec.title),
    body: txOptional(spec.body),
    caption: txOptional(spec.caption),
  };
}

function localizeDemoEntries(entries: LessonInstrumentDemo[]): LessonInstrumentDemo[] {
  return entries.map((entry) => ({ ...entry, spec: localizeDemoSpec(entry.spec) }));
}

const ALL_DEMOS: Record<string, LessonInstrumentDemo[]> = {
  ...LESSON_INSTRUMENT_DEMOS,
  ...EXPANSION_LESSON_INSTRUMENT_DEMOS,
};

export interface CurriculumLibrary {
  courses: Course[];
  levels: Level[];
  allLessons: LessonWithCourse[];
  courseMap: Record<string, Course>;
  lessonMap: Record<string, LessonWithCourse>;
  lessonDemos: Record<string, LessonInstrumentDemo[]>;
  nextLesson: (lessonId: string) => LessonWithCourse | undefined;
  previousLesson: (lessonId: string) => LessonWithCourse | undefined;
}

function englishLibrary(): CurriculumLibrary {
  return {
    courses: COURSES,
    levels: LEVELS,
    allLessons: ALL_LESSONS,
    courseMap: COURSE_MAP,
    lessonMap: LESSON_MAP,
    lessonDemos: ALL_DEMOS,
    nextLesson: nextEnglishLesson,
    previousLesson: previousEnglishLesson,
  };
}

function localizedLibrary(): CurriculumLibrary {
  const courses = COURSES.map(localizeCourse);
  const allLessons: LessonWithCourse[] = courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      ...lesson,
      courseId: course.id,
      courseTitle: course.title,
      level: course.level,
    })),
  );
  const lessonDemos: Record<string, LessonInstrumentDemo[]> = {};
  for (const [lessonId, entries] of Object.entries(ALL_DEMOS)) {
    lessonDemos[lessonId] = localizeDemoEntries(entries);
  }
  return {
    courses,
    levels: LEVELS.map(localizeLevel),
    allLessons,
    courseMap: Object.fromEntries(courses.map((course) => [course.id, course])),
    lessonMap: Object.fromEntries(allLessons.map((lesson) => [lesson.id, lesson])),
    lessonDemos,
    nextLesson: (lessonId) => {
      const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
      return index >= 0 ? allLessons[index + 1] : undefined;
    },
    previousLesson: (lessonId) => {
      const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
      return index > 0 ? allLessons[index - 1] : undefined;
    },
  };
}

export function useCurriculum(): CurriculumLibrary {
  const { language } = useI18n();
  return useMemo(() => (language === 'fa' ? localizedLibrary() : englishLibrary()), [language]);
}
