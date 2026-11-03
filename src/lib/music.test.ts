import { describe, expect, it } from 'vitest';
import {
  annotateNoteNames,
  keyNoteName,
  midiNoteName,
  midiNoteNameFull,
  noteLabelLines,
  noteName,
  noteNameFull,
  noteSequence,
} from './music';
import { defaultSettings, normalizeState } from './progressState';

describe('note names', () => {
  it('keeps letter names in letters mode', () => {
    expect(noteName('C', 0, 'letters')).toBe('C');
    expect(noteName('B', -1, 'letters')).toBe('B♭');
    expect(noteNameFull('F', 1, 4, 'letters')).toBe('F♯4');
  });

  it('uses fixed-do solfège in solfege mode', () => {
    expect(noteName('C', 0, 'solfege')).toBe('Do');
    expect(noteName('B', -1, 'solfege')).toBe('Si♭');
    expect(noteNameFull('F', 1, 4, 'solfege')).toBe('Fa♯4');
  });

  it('shows the letter with solfège in parentheses in both mode', () => {
    expect(noteName('C', 0, 'both')).toBe('C (Do)');
    expect(noteName('B', -1, 'both')).toBe('B♭ (Si♭)');
    expect(noteNameFull('A', 0, 4, 'both')).toBe('A4 (La4)');
  });

  it('formats MIDI notes with the requested spelling and naming', () => {
    expect(midiNoteName(61, 'letters')).toBe('C♯');
    expect(midiNoteName(61, 'letters', true)).toBe('D♭');
    expect(midiNoteName(61, 'both', true)).toBe('D♭ (Re♭)');
    expect(midiNoteNameFull(60, 'solfege')).toBe('Do4');
  });

  it('joins chords and scales as a sequence', () => {
    const triad = [
      { letter: 'C' as const },
      { letter: 'E' as const },
      { letter: 'G' as const },
    ];
    expect(noteSequence(triad, 'letters')).toBe('C–E–G');
    expect(noteSequence(triad, 'solfege')).toBe('Do–Mi–Sol');
    expect(noteSequence(triad, 'both')).toBe('C–E–G (Do–Mi–Sol)');
  });

  it('stacks labels for keys and strings', () => {
    expect(noteLabelLines('D', -1, 'both')).toEqual(['D♭', 'Re♭']);
    expect(noteLabelLines('D', -1, 'letters')).toEqual(['D♭']);
  });

  it('translates key names without losing the mode suffix', () => {
    expect(keyNoteName('B♭ major', 'letters')).toBe('B♭ major');
    expect(keyNoteName('B♭ major', 'solfege')).toBe('Si♭ major');
    expect(keyNoteName('B♭ major', 'both')).toBe('B♭ (Si♭) major');
    expect(keyNoteName('F♯m', 'both')).toBe('F♯ (Fa♯)m');
  });
});

describe('annotateNoteNames', () => {
  it('leaves prose untouched in letters mode', () => {
    const text = 'C is the white key before D.';
    expect(annotateNoteNames(text, 'letters')).toBe(text);
  });

  it('adds solfège to note names inside prose', () => {
    expect(annotateNoteNames('C is always the white key.', 'both')).toBe(
      'C (Do) is always the white key.',
    );
    expect(annotateNoteNames('The notes are C, E, and G.', 'solfege')).toBe(
      'The notes are Do, Mi, and Sol.',
    );
    expect(annotateNoteNames('Play B♭ major.', 'both')).toBe('Play B♭ (Si♭) major.');
  });

  it('treats a lone A at the start of a sentence as the article', () => {
    expect(annotateNoteNames('A string vibrates to make pitch.', 'both')).toBe(
      'A string vibrates to make pitch.',
    );
    expect(annotateNoteNames('Pitch is a wave. A column of air moves too.', 'both')).toBe(
      'Pitch is a wave. A column of air moves too.',
    );
    expect(annotateNoteNames("A chord's inversion matters.", 'both')).toBe(
      "A chord's inversion matters.",
    );
    expect(annotateNoteNames('A key with one sharp has F♯.', 'both')).toBe(
      'A key with one sharp has F♯ (Fa♯).',
    );
    expect(annotateNoteNames('A sharp in front of F means F♯.', 'both')).toBe(
      'A sharp in front of F (Fa) means F♯ (Fa♯).',
    );
    expect(annotateNoteNames('- Whole note\n- Half note\n\nA note head tells the pitch.', 'both')).toBe(
      '- Whole note\n- Half note\n\nA note head tells the pitch.',
    );
    expect(annotateNoteNames('A major 3rd inverts to a minor 6th.', 'both')).toBe(
      'A major 3rd inverts to a minor 6th.',
    );
    expect(annotateNoteNames('A minor triad lowers the third by one fret.', 'both')).toBe(
      'A minor triad lowers the third by one fret.',
    );
    expect(annotateNoteNames('A major scale starting on the sixth degree.', 'both')).toBe(
      'A major scale starting on the sixth degree.',
    );
    expect(annotateNoteNames('**A (4 bars, HC) – A′ (4 bars, PAC)**', 'both')).toBe(
      '**A (4 bars, HC) – A′ (4 bars, PAC)**',
    );
    expect(annotateNoteNames('AB with a shortened return of A.', 'both')).toBe(
      'AB with a shortened return of A.',
    );
  });

  it('still treats A as a note when a music term or sequence follows', () => {
    expect(annotateNoteNames('A major scale starts on A.', 'both')).toBe(
      'A (La) major scale starts on A (La).',
    );
    expect(annotateNoteNames('The pattern is A–B–C.', 'both')).toBe(
      'The pattern is A (La)–B (Si)–C (Do).',
    );
  });

  it('keeps chord qualities attached to their root', () => {
    expect(annotateNoteNames('In C major: C – Dm – Em – F – G – Am – B°.', 'both')).toBe(
      'In C (Do) major: C (Do) – Dm (Rem) – Em (Mim) – F (Fa) – G (Sol) – Am (Lam) – B° (Si°).',
    );
    expect(annotateNoteNames('Try Cmaj7, G7, D♭7, and C7♯11.', 'both')).toBe(
      'Try Cmaj7 (Domaj7), G7 (Sol7), D♭7 (Re♭7), and C7♯11 (Do7♯11).',
    );
    expect(annotateNoteNames('Am–F–C–G', 'solfege')).toBe('Lam–Fa–Do–Sol');
  });

  it('annotates octaves from every digit', () => {
    expect(annotateNoteNames('The lines are E4, G4, B4, D5, F5.', 'both')).toBe(
      'The lines are E4 (Mi4), G4 (Sol4), B4 (Si4), D5 (Re5), F5 (Fa5).',
    );
  });

  it('formats whole-token answers, including a bare A', () => {
    expect(annotateNoteNames('A', 'both')).toBe('A (La)');
    expect(annotateNoteNames('A ', 'both')).toBe('A ');
    expect(annotateNoteNames(' A ', 'both')).toBe(' A ');
    expect(annotateNoteNames(' A4 ', 'both')).toBe(' A4 (La4) ');
    expect(annotateNoteNames('A4', 'solfege')).toBe('La4');
    expect(annotateNoteNames('B♭', 'both')).toBe('B♭ (Si♭)');
  });
});

describe('note naming settings', () => {
  it('defaults to showing both letter and solfège names', () => {
    expect(defaultSettings.noteNaming).toBe('both');
  });

  it('migrates missing or invalid values back to both', () => {
    expect(normalizeState({ settings: {} }, 'device-a').settings.noteNaming).toBe('both');
    expect(normalizeState({ settings: { noteNaming: 'do-re-mi' } }, 'device-a').settings.noteNaming).toBe(
      'both',
    );
    expect(normalizeState({ settings: { noteNaming: 'solfege' } }, 'device-a').settings.noteNaming).toBe(
      'solfege',
    );
  });
});
