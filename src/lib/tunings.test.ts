import { describe, expect, it } from 'vitest';
import {
  INSTRUMENTS,
  STRING_NOTE_OPTIONS,
  customTuning,
  instrumentById,
  noteOptions,
  stringLabel,
  stringNote,
  tuningById,
} from './tunings';

describe('tuning presets', () => {
  it('includes the expected instruments', () => {
    const ids = INSTRUMENTS.map((instrument) => instrument.id);
    for (const id of [
      'guitar',
      'bass',
      'ukulele',
      'violin',
      'viola',
      'cello',
      'double-bass',
      'mandolin',
      'banjo',
      'piano',
      'custom',
    ]) {
      expect(ids).toContain(id);
    }
  });

  it('provides the guitar alternate tunings, including Drop D', () => {
    const guitar = instrumentById('guitar');
    const dropD = guitar.tunings.find((tuning) => tuning.id === 'drop-d');
    expect(dropD).toBeDefined();
    expect(dropD!.strings.map((entry) => entry.midi)).toEqual([38, 45, 50, 55, 59, 64]);
    expect(guitar.tunings.map((tuning) => tuning.id)).toEqual(
      expect.arrayContaining(['standard', 'dadgad', 'open-g', 'open-d', 'half-step-down']),
    );
  });

  it('keeps every preset string inside a playable MIDI range', () => {
    for (const instrument of INSTRUMENTS) {
      expect(instrument.tunings.length).toBeGreaterThan(0);
      for (const tuning of instrument.tunings) {
        for (const entry of tuning.strings) {
          expect(entry.midi).toBeGreaterThanOrEqual(12);
          expect(entry.midi).toBeLessThanOrEqual(108);
        }
      }
    }
  });

  it('marks the piano as chromatic', () => {
    const piano = instrumentById('piano');
    expect(piano.tunings[0].chromatic).toBe(true);
    expect(piano.tunings[0].strings).toHaveLength(0);
  });

  it('falls back safely for unknown ids', () => {
    expect(instrumentById('theremin').id).toBe('guitar');
    expect(tuningById('guitar', 'nope').id).toBe('standard');
  });
});

describe('custom tunings', () => {
  it('numbers strings from the highest down', () => {
    expect(stringLabel(0, 6)).toBe('6th');
    expect(stringLabel(5, 6)).toBe('1st');
  });

  it('builds labels and notes for a custom set', () => {
    const tuning = customTuning([38, 45, 50]);
    expect(tuning.strings).toHaveLength(3);
    expect(tuning.strings.map((entry) => entry.midi)).toEqual([38, 45, 50]);
    expect(tuning.strings.map((entry) => entry.label)).toEqual(['3rd', '2nd', '1st']);
    expect(stringNote(38)).toBe('D2');
  });

  it('offers a full chromatic range for custom strings', () => {
    const options = noteOptions();
    expect(options[0].midi).toBe(12);
    expect(options[options.length - 1].midi).toBe(108);
    expect(STRING_NOTE_OPTIONS).toEqual(options);
    expect(options.map((option) => option.label)).toContain('E2');
    expect(options.map((option) => option.label)).toContain('B0');
  });
});
