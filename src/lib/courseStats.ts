import { ALL_LESSONS, COURSES, LEVELS, type Course } from '../data/curriculum';
import { todayKey, type AppState } from './progress';

export function completedLessonsInCourse(course: Course, state: AppState): number {
  return course.lessons.filter((lesson) => state.lessons[lesson.id]?.completedAt).length;
}

export function coursePercent(course: Course, state: AppState): number {
  if (!course.lessons.length) return 0;
  return completedLessonsInCourse(course, state) / course.lessons.length;
}

export function totalCompleted(state: AppState): number {
  return ALL_LESSONS.filter((lesson) => state.lessons[lesson.id]?.completedAt).length;
}

export function overallPercent(state: AppState): number {
  return totalCompleted(state) / ALL_LESSONS.length;
}

export function currentLesson(state: AppState) {
  return (
    ALL_LESSONS.find((lesson) => !state.lessons[lesson.id]?.completedAt) ??
    ALL_LESSONS[ALL_LESSONS.length - 1]
  );
}

export function lessonsCompletedByLevel(state: AppState) {
  return LEVELS.map((level) => {
    const courses = COURSES.filter((course) => course.level === level.id);
    const lessons = courses.flatMap((course) => course.lessons);
    const completed = lessons.filter((lesson) => state.lessons[lesson.id]?.completedAt).length;
    return { level, total: lessons.length, completed };
  });
}

export function todayCount(state: AppState): number {
  return state.daily.date === todayKey() ? state.daily.count : 0;
}
