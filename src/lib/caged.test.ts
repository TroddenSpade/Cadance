import { describe, expect, it } from 'vitest';
import { cagedPositions } from './caged';

const inRange = (fret: number | null) => fret === null || (fret >= 0 && fret <= 16);

describe('CAGED positions', () => {
  it('returns the five shapes in order', () => {
    const positions = cagedPositions(0, 'Major');
    expect(positions.map((position) => position.shape)).toEqual(['C', 'A', 'G', 'E', 'D']);
  });

  it('reproduces the open major shapes at their natural roots', () => {
    const c = cagedPositions(0, 'Major').find((position) => position.shape === 'C')!;
    expect(c.frets).toEqual([null, 3, 2, 0, 1, 0]);
    expect(c.baseFret).toBe(1);

    const a = cagedPositions(9, 'Major').find((position) => position.shape === 'A')!;
    expect(a.frets).toEqual([null, 0, 2, 2, 2, 0]);

    const g = cagedPositions(7, 'Major').find((position) => position.shape === 'G')!;
    expect(g.frets).toEqual([3, 2, 0, 0, 0, 3]);

    const e = cagedPositions(4, 'Major').find((position) => position.shape === 'E')!;
    expect(e.frets).toEqual([0, 2, 2, 1, 0, 0]);

    const d = cagedPositions(2, 'Major').find((position) => position.shape === 'D')!;
    expect(d.frets).toEqual([null, null, 0, 2, 3, 2]);
  });

  it('transposes a shape to a new root', () => {
    const shape = cagedPositions(2, 'Major').find((position) => position.shape === 'C')!;
    expect(shape.baseFret).toBe(2);
    expect(shape.frets).toEqual([null, 5, 4, 2, 3, 2]);
    expect(shape.fingers).toEqual([null, 3, 2, null, 1, null]);
  });

  it('reproduces the open minor shapes and adds barres when movable', () => {
    const aMinor = cagedPositions(9, 'Minor').find((position) => position.shape === 'A')!;
    expect(aMinor.frets).toEqual([null, 0, 2, 2, 1, 0]);
    expect(aMinor.barre).toBeUndefined();

    const eMinor = cagedPositions(4, 'Minor').find((position) => position.shape === 'E')!;
    expect(eMinor.frets).toEqual([0, 2, 2, 0, 0, 0]);

    const cMinor = cagedPositions(0, 'Minor').find((position) => position.shape === 'C')!;
    expect(cMinor.frets).toEqual([null, 3, 5, 5, 4, 3]);
    expect(cMinor.barre).toBe(3);
  });

  it('keeps every shape on the playable neck', () => {
    for (let root = 0; root < 12; root += 1) {
      for (const quality of ['Major', 'Minor'] as const) {
        const positions = cagedPositions(root, quality);
        expect(positions).toHaveLength(5);
        for (const position of positions) {
          expect(position.baseFret).toBeGreaterThanOrEqual(1);
          expect(position.baseFret).toBeLessThanOrEqual(12);
          expect(position.frets.every(inRange), `${quality} ${root} ${position.shape}`).toBe(true);
        }
      }
    }
  });
});
