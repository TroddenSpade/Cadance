import { describe, expect, it } from 'vitest';
import {
  ANALYSIS_MAP,
  ANALYSIS_PROGRESSIONS,
  CADENCES,
  detectCadence,
  normalizeRoman,
  progressionChords,
  progressionPattern,
  progressionPitchClasses,
} from './analysis';

const EXPECTED_CADENCE: Record<string, string> = {
  'classical-period': 'authentic',
  'deceptive-resolution': 'deceptive',
  'half-cadence': 'half',
  'plagal-amen': 'plagal',
  'two-five-one': 'authentic',
  'minor-lament': 'authentic',
  'secondary-dominant': 'authentic',
  'modal-rock': 'plagal',
};

describe('analysis progressions', () => {
  it('has eight unique examples, each with a key and at least four chords', () => {
    expect(ANALYSIS_PROGRESSIONS).toHaveLength(8);
    expect(new Set(ANALYSIS_PROGRESSIONS.map((item) => item.id)).size).toBe(8);
    for (const progression of ANALYSIS_PROGRESSIONS) {
      expect(progression.chords.length).toBeGreaterThanOrEqual(4);
      expect(progression.lessonIds.length).toBeGreaterThan(0);
      expect(ANALYSIS_MAP[progression.id]).toBe(progression);
      expect(progression.keyLabel.length).toBeGreaterThan(0);
      expect(progression.tonicPc).toBeGreaterThanOrEqual(0);
      expect(progression.tonicPc).toBeLessThan(12);
    }
  });

  it('strips sevenths, qualities, and applied chords before naming a cadence', () => {
    expect(normalizeRoman('V7')).toBe('V');
    expect(normalizeRoman('ii7')).toBe('ii');
    expect(normalizeRoman('Imaj7')).toBe('I');
    expect(normalizeRoman('V/V')).toBe('V');
    expect(normalizeRoman('♭VII')).toBe('♭VII');
  });

  it('names every exemplar with one of the four taught cadences', () => {
    expect(CADENCES).toEqual(['authentic', 'plagal', 'deceptive', 'half']);
    for (const progression of ANALYSIS_PROGRESSIONS) {
      const cadence = detectCadence(progression.chords.map((chord) => chord.roman));
      expect(cadence, progression.id).toBe(EXPECTED_CADENCE[progression.id]);
      expect(CADENCES).toContain(cadence);
    }
  });

  it('reads a held tonic as the end of a ii–V–I cadence', () => {
    expect(detectCadence(['ii7', 'V7', 'Imaj7', 'Imaj7'])).toBe('authentic');
    expect(detectCadence(['I', 'IV', 'V7', 'I'])).toBe('authentic');
    expect(detectCadence(['I', 'vi', 'IV', 'I'])).toBe('plagal');
    expect(detectCadence(['I', 'IV', 'V', 'vi'])).toBe('deceptive');
    expect(detectCadence(['I', 'vi', 'ii', 'V'])).toBe('half');
    expect(detectCadence(['I', 'vi'])).toBe('none');
    expect(detectCadence([])).toBe('none');
  });

  it('voices each chord as an ascending stack rooted near middle C', () => {
    for (const progression of ANALYSIS_PROGRESSIONS) {
      const stacks = progressionChords(progression);
      expect(stacks).toHaveLength(progression.chords.length);
      stacks.forEach((stack) => {
        expect(stack.length).toBeGreaterThanOrEqual(3);
        for (let index = 1; index < stack.length; index += 1) {
          expect(stack[index]).toBeGreaterThan(stack[index - 1]);
        }
        expect(stack[0]).toBeGreaterThanOrEqual(60);
        expect(stack[stack.length - 1]).toBeLessThan(84);
      });
    }
  });

  it('builds a four-bar transport pattern and a pitch-class set', () => {
    for (const progression of ANALYSIS_PROGRESSIONS) {
      const pattern = progressionPattern(progression);
      expect(pattern.totalBeats).toBe(progression.chords.length * 4);
      expect(pattern.beatsPerBar).toBe(4);
      expect(pattern.events).toHaveLength(progression.chords.length);
      expect(pattern.events[0].beat).toBe(0);

      const pitchClasses = progressionPitchClasses(progression);
      expect(pitchClasses.length).toBeGreaterThan(0);
      expect(pitchClasses).toEqual([...pitchClasses].sort((a, b) => a - b));
      for (const pc of pitchClasses) {
        expect(pc).toBeGreaterThanOrEqual(0);
        expect(pc).toBeLessThan(12);
      }
    }
  });
});
