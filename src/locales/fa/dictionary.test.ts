import { describe, expect, it } from 'vitest';
import * as common from './common';
import { faCourses } from './courses';
import { faDashboard } from './dashboard';
import { faExercisePrompts, faExercisePromptsPartTwo } from './exercisePrompts';
import { faExerciseUi } from './exercises';
import { faLesson } from './lesson';
import { faMetronome } from './metronome';
import { faMusicTerms } from './music';
import { faPractice } from './practice';
import { faSettings } from './settings';
import { faTools } from './tools';
import { faTrainer } from './trainer';
import { faTuner } from './tuner';

function collect(namespace: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const value of Object.values(namespace)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    for (const [key, text] of Object.entries(value)) {
      if (typeof text === 'string') result[key] = text;
    }
  }
  return result;
}

/**
 * The merged dictionary is keyed by the exact English text, so if two modules
 * translate the same key differently, the last spread silently wins and one
 * of the screens shows a translation written for the other context.
 * Keep shared keys identical across modules.
 */
const modules: Array<[string, Record<string, string>]> = [
  ['common', collect(common)],
  ['courses', faCourses],
  ['dashboard', faDashboard],
  ['exercisePrompts', { ...faExercisePrompts, ...faExercisePromptsPartTwo }],
  ['exercises', faExerciseUi],
  ['lesson', faLesson],
  ['metronome', faMetronome],
  ['music', faMusicTerms],
  ['practice', faPractice],
  ['settings', faSettings],
  ['tools', faTools],
  ['trainer', faTrainer],
  ['tuner', faTuner],
];

describe('Persian dictionary', () => {
  it('defines every shared key with the same translation in every module', () => {
    const seen = new Map<string, { module: string; value: string }>();
    const conflicts: string[] = [];

    for (const [module, entries] of modules) {
      for (const [key, value] of Object.entries(entries)) {
        const previous = seen.get(key);
        if (!previous) {
          seen.set(key, { module, value });
        } else if (previous.value !== value) {
          conflicts.push(
            `${JSON.stringify(key)}: ${previous.module} = ${JSON.stringify(previous.value)} but ${module} = ${JSON.stringify(value)}`,
          );
        }
      }
    }

    expect(conflicts).toEqual([]);
  });
});
