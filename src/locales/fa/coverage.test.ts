import { describe, expect, it } from 'vitest';
import { fa } from './index';
import { COURSES, LEVELS, SKILL_BLUEPRINTS } from '../../data/curriculum';
import { LESSON_INSTRUMENT_DEMOS } from '../../data/instrumentExamples';
import { EXPANSION_LESSON_INSTRUMENT_DEMOS } from '../../data/expansion';
import { EXERCISE_LABELS, STARTER_SPECS, TOPIC_SPECS } from '../../lib/exercises';
import { INSTRUMENTS } from '../../lib/tunings';
import { ANALYSIS_PROGRESSIONS } from '../../lib/analysis';
import { STYLE_PATHS } from '../../data/stylePaths';
import { GLOSSARY } from '../../data/glossary';
import { WORKSHEET_ACTIVITIES, WORKSHEET_FOCUS } from '../../lib/worksheet';

const missing = new Set<string>();

function check(value?: string) {
  if (!value || !value.trim()) return;
  const translated = fa[value];
  if (!translated || !translated.trim()) missing.add(value);
}

describe('Persian content coverage', () => {
  it('translates every level, course, lesson, section, demo, exercise, and skill', () => {
    LEVELS.forEach((level) => {
      check(level.title);
      check(level.blurb);
    });

    COURSES.forEach((course) => {
      check(course.title);
      check(course.subtitle);
      course.lessons.forEach((lesson) => {
        check(lesson.title);
        check(lesson.summary);
        check(lesson.guide?.idea);
        check(lesson.guide?.practice);
        lesson.sections.forEach((section) => {
          check(section.heading);
          check(section.body);
          check(section.audioLabel);
        });
        lesson.exercises.forEach((exercise) => {
          check(exercise.label);
          exercise.skills.forEach((skill) => check(skill));
        });
      });
    });

    Object.entries({ ...LESSON_INSTRUMENT_DEMOS, ...EXPANSION_LESSON_INSTRUMENT_DEMOS }).forEach(
      ([, entries]) => {
        entries.forEach(({ spec }) => {
          check(spec.title);
          check(spec.body);
          check(spec.caption);
        });
      },
    );

    Object.values(TOPIC_SPECS).forEach((topic) => {
      check(topic.label);
      check(topic.description);
    });
    STARTER_SPECS.forEach((spec) => check(spec.label));
    Object.values(EXERCISE_LABELS).forEach((label) => check(label));
    Object.keys(SKILL_BLUEPRINTS).forEach((skill) => check(skill));

    INSTRUMENTS.forEach((instrument) => {
      check(instrument.name);
      check(instrument.family);
      instrument.tunings.forEach((tuning) => {
        check(tuning.name);
        check(tuning.description);
      });
    });

    ANALYSIS_PROGRESSIONS.forEach((progression) => {
      check(progression.title);
      check(progression.blurb);
      check(progression.keyLabel);
    });

    STYLE_PATHS.forEach((path) => {
      check(path.title);
      check(path.tagline);
      check(path.description);
      check(path.level);
    });

    GLOSSARY.forEach((entry) => {
      check(entry.term);
      check(entry.category);
      check(entry.definition);
    });

    WORKSHEET_ACTIVITIES.forEach((activity) => {
      check(activity.title);
      check(activity.instruction);
    });

    WORKSHEET_FOCUS.forEach((focus) => {
      check(focus.title);
      check(focus.description);
    });

    // Labels passed to t() through variables rather than literals.
    [
      'Read four bars, play them back in order, and check every pitch.',
      'Echo a two-bar pattern by tapping, then play the same rhythm on one note.',
      'Build a short drill on the topic this path is developing.',
      'Choose another piece at the same level and read it once without stopping.',
      'Lesson',
      'Backing loop',
      'Analysis',
      'Practice room',
    ].forEach(check);

    expect([...missing], `Missing Persian translations (${missing.size})`).toEqual([]);
  });
});
