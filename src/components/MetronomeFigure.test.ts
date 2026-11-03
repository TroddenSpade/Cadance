import { describe, expect, it } from 'vitest';
import { weightYForTempo } from './MetronomeFigure';

describe('metronome weight', () => {
  it('rides high for slow tempos and drops toward the pivot as tempo rises', () => {
    const slow = weightYForTempo(40);
    const medium = weightYForTempo(120);
    const fast = weightYForTempo(220);

    expect(slow).toBeLessThan(medium);
    expect(medium).toBeLessThan(fast);
    expect(slow).toBeGreaterThan(40);
    expect(fast).toBeLessThan(220);
  });

  it('clamps tempos outside the supported range', () => {
    expect(weightYForTempo(10)).toBe(weightYForTempo(30));
    expect(weightYForTempo(999)).toBe(weightYForTempo(260));
    expect(Number.isFinite(weightYForTempo(Number.NaN))).toBe(true);
  });
});
