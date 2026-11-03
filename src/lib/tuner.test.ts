import { describe, expect, it } from 'vitest';
import {
  centsFromFrequency,
  detectPitch,
  formatCents,
  frequencyToMidi,
  medianFrequency,
  midiToFrequencyWithReference,
  resolveTarget,
  tuneReading,
  tuningStatus,
} from './tuner';

const SAMPLE_RATE = 44100;

function sine(frequency: number, seconds = 0.12, amplitude = 0.4): Float32Array<ArrayBuffer> {
  const length = Math.floor(SAMPLE_RATE * seconds);
  const buffer = new Float32Array(length);
  for (let index = 0; index < length; index += 1) {
    buffer[index] = Math.sin((2 * Math.PI * frequency * index) / SAMPLE_RATE) * amplitude;
  }
  return buffer;
}

describe('pitch detection', () => {
  it('finds a pure 440 Hz tone', () => {
    const reading = detectPitch(sine(440), SAMPLE_RATE);
    expect(reading).not.toBeNull();
    expect(reading!.frequency).toBeCloseTo(440, 0);
    expect(reading!.clarity).toBeGreaterThan(0.8);
  });

  it('finds a low guitar E2-ish tone', () => {
    const reading = detectPitch(sine(82.41), SAMPLE_RATE);
    expect(reading).not.toBeNull();
    expect(reading!.frequency).toBeGreaterThan(80);
    expect(reading!.frequency).toBeLessThan(85);
  });

  it('finds a high violin E6-ish tone', () => {
    const reading = detectPitch(sine(1318.5), SAMPLE_RATE);
    expect(reading).not.toBeNull();
    expect(reading!.frequency).toBeGreaterThan(1300);
    expect(reading!.frequency).toBeLessThan(1335);
  });

  it('returns null for silence', () => {
    expect(detectPitch(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
  });
});

describe('tuner maths', () => {
  it('converts frequencies to cents around a target', () => {
    expect(centsFromFrequency(440, 440)).toBeCloseTo(0, 6);
    expect(centsFromFrequency(466.1638, 440)).toBeCloseTo(100, 1);
    expect(centsFromFrequency(415.3047, 440)).toBeCloseTo(-100, 1);
  });

  it('uses the reference pitch for MIDI and frequencies', () => {
    expect(frequencyToMidi(432, 432)).toBeCloseTo(69, 6);
    expect(midiToFrequencyWithReference(69, 432)).toBeCloseTo(432, 6);
    const reading = tuneReading(432, 432);
    expect(reading.midi).toBe(69);
    expect(reading.cents).toBeCloseTo(0, 6);
  });

  it('classifies tuning accuracy', () => {
    expect(tuningStatus(0)).toBe('in-tune');
    expect(tuningStatus(4.9)).toBe('in-tune');
    expect(tuningStatus(-12)).toBe('close');
    expect(tuningStatus(26)).toBe('off');
  });

  it('formats signed cents', () => {
    expect(formatCents(0)).toBe('0');
    expect(formatCents(12.4)).toBe('+12');
    expect(formatCents(-9.6)).toBe('-10');
  });

  it('takes the median of recent readings', () => {
    expect(medianFrequency([440, 442, 441])).toBe(441);
    expect(medianFrequency([440, 442, 441, 443])).toBe(441.5);
    expect(medianFrequency([])).toBeNull();
  });
});

describe('target selection', () => {
  const dropD = [38, 45, 50, 55, 59, 64];

  it('snaps to the nearest string in auto mode', () => {
    const reading = resolveTarget(73.42, dropD, 'auto');
    expect(reading.midi).toBe(38);
    expect(reading.stringIndex).toBe(0);
    expect(Math.abs(reading.cents)).toBeLessThan(2);
  });

  it('uses the selected string in fixed mode', () => {
    const reading = resolveTarget(110, dropD, 'string', 1);
    expect(reading.midi).toBe(45);
    expect(reading.stringIndex).toBe(1);
    expect(Math.abs(reading.cents)).toBeLessThan(2);
  });

  it('falls back to the nearest semitone in chromatic mode', () => {
    const reading = resolveTarget(261.63, dropD, 'chromatic');
    expect(reading.midi).toBe(60);
    expect(reading.stringIndex).toBeNull();
  });

  it('honours a non-440 reference', () => {
    const reading = resolveTarget(432, dropD, 'chromatic', 0, 432);
    expect(reading.midi).toBe(69);
    expect(Math.abs(reading.cents)).toBeLessThan(0.01);
  });
});
