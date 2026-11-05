import { describe, expect, it } from 'vitest';
import { LOOP_KEYS, LOOP_STYLES, buildLoop, loopScaleMidis } from './loops';
import { pitchClass } from './music';

describe('backing loops', () => {
  it('builds four complete bars for every style and key', () => {
    for (const style of LOOP_STYLES) {
      for (const key of LOOP_KEYS) {
        const loop = buildLoop(style.id, key.pc);
        expect(loop.chords, `${style.id}/${key.label}`).toHaveLength(4);
        expect(loop.totalBeats).toBe(style.progression.length * style.beatsPerBar);
        expect(loop.beatsPerBar).toBe(style.beatsPerBar);
        expect(loop.events.length).toBeGreaterThan(0);
        for (const event of loop.events) {
          expect(event.beat).toBeGreaterThanOrEqual(0);
          expect(event.beat).toBeLessThan(loop.totalBeats);
          expect(event.beats).toBeGreaterThan(0);
          expect(event.beat + event.beats).toBeLessThanOrEqual(loop.totalBeats + 0.001);
          for (const midi of event.notes) {
            expect(midi).toBeGreaterThanOrEqual(24);
            expect(midi).toBeLessThanOrEqual(90);
          }
        }
      }
    }
  });

  it('names the pop loop in C as C–G–Am–F', () => {
    const loop = buildLoop('pop', 0);
    expect(loop.chords.map((chord) => chord.name)).toEqual(['C', 'G', 'Am', 'F']);
    expect(loop.chords.map((chord) => chord.beat)).toEqual([0, 4, 8, 12]);
    expect(loop.chords[0].midis.map(pitchClass)).toEqual([0, 4, 7]);
  });

  it('uses seventh chords for jazz and blues', () => {
    const jazz = buildLoop('jazz', 0);
    expect(jazz.chords.map((chord) => chord.name)).toEqual(['Dm7', 'G7', 'Cmaj7', 'Cmaj7']);

    const blues = buildLoop('blues', 0);
    expect(blues.chords.map((chord) => chord.name)).toEqual(['C7', 'F7', 'C7', 'G7']);
    expect(blues.chords[0].midis).toEqual([48, 52, 55, 58]);
  });

  it('waltzes in three and keeps every chord inside its bar', () => {
    const waltz = buildLoop('waltz', 0);
    expect(waltz.beatsPerBar).toBe(3);
    expect(waltz.totalBeats).toBe(12);
    expect(waltz.events.every((event) => event.beat + event.beats <= 12.001)).toBe(true);
  });

  it('transposes the loop to the chosen key', () => {
    const c = buildLoop('pop', 0);
    const d = buildLoop('pop', 2);
    expect(d.chords.map((chord) => chord.name)).toEqual(['D', 'A', 'Bm', 'G']);
    expect(d.chords[0].midis).toEqual(c.chords[0].midis.map((midi) => midi + 2));
  });

  it('returns a two-octave solo scale rooted on the key', () => {
    for (const style of LOOP_STYLES) {
      const midis = loopScaleMidis(style.id, 0);
      expect(midis.length).toBeGreaterThanOrEqual(style.scale.intervals.length);
      expect(new Set(midis).size).toBe(midis.length);
      expect(midis[0]).toBe(48);
      expect(midis.every((midi, index) => index === 0 || midi > midis[index - 1])).toBe(true);
    }
  });
});
