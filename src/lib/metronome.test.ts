import { describe, expect, it } from 'vitest';
import { MAX_BPM, MIN_BPM, clampBpm, isStrongBeat, meterLabel, subdivisionCount } from './metronome';

describe('metronome helpers', () => {
  it('clamps tempo to the supported range', () => {
    expect(clampBpm(12)).toBe(MIN_BPM);
    expect(clampBpm(500)).toBe(MAX_BPM);
    expect(clampBpm(Number.NaN)).toBe(72);
    expect(clampBpm(119.6)).toBe(120);
  });

  it('counts clicks per beat for each subdivision', () => {
    expect(subdivisionCount('none')).toBe(1);
    expect(subdivisionCount('eighth')).toBe(2);
    expect(subdivisionCount('triplet')).toBe(3);
  });

  it('accents the downbeat, and beats 1 and 4 in 6/8', () => {
    expect(isStrongBeat(0, 4)).toBe(true);
    expect(isStrongBeat(1, 4)).toBe(false);
    expect(isStrongBeat(0, 6)).toBe(true);
    expect(isStrongBeat(3, 6)).toBe(true);
    expect(isStrongBeat(4, 6)).toBe(false);
    expect(isStrongBeat(0, 5)).toBe(true);
  });

  it('labels common and odd meters', () => {
    expect(meterLabel(4)).toBe('4/4');
    expect(meterLabel(3)).toBe('3/4');
    expect(meterLabel(6)).toBe('6/8');
    expect(meterLabel(5)).toBe('5/4');
    expect(meterLabel(7)).toBe('7/8');
  });
});
