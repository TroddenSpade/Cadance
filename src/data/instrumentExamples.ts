import type { RhythmItem } from '../lib/music';
import type { GuitarSpot, InstrumentDemoSpec } from '../lib/types';

/**
 * Guided keyboard and fretboard examples for the lesson explanations.
 *
 * They live beside the curriculum rather than inside every section object so
 * that the practical layer can grow without turning the course data into a
 * wall of MIDI numbers. `afterSection` is zero-based and places the card
 * directly after that section's prose and notation.
 */
export interface LessonInstrumentDemo {
  afterSection: number;
  spec: InstrumentDemoSpec;
}

const LETTER_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Parse a written note such as C4, F♯3, or B♭4 into MIDI. */
function note(name: string): number {
  const match = /^([A-G])([♯#♭b]?)(-?\d+)$/.exec(name.trim());
  if (!match) throw new Error(`Cannot parse note: ${name}`);
  const [, letter, accidental, octave] = match;
  const offset = accidental === '♯' || accidental === '#' ? 1 : accidental === '♭' || accidental === 'b' ? -1 : 0;
  return 12 * (Number(octave) + 1) + LETTER_SEMITONES[letter] + offset;
}

/** Read a space-separated list of notes: `N('C4 E4 G4')`. */
const N = (names: string): number[] => names.trim().split(/\s+/).map(note);

/**
 * Guitar shape from low E to high E. `x` mutes a string.
 * Example: `shape('x 3 2 0 1 0')` is the open C chord.
 */
function shape(values: string): GuitarSpot[] {
  const tokens = values.trim().split(/\s+/);
  if (tokens.length !== 6) throw new Error(`Guitar shape needs six strings: ${values}`);
  return tokens.flatMap((token, index) => {
    if (token === 'x' || token === '-') return [];
    const fret = Number(token);
    if (!Number.isInteger(fret) || fret < 0 || fret > 12) {
      throw new Error(`Guitar fret out of range: ${token}`);
    }
    return [{ string: 5 - index, fret }];
  });
}

/** Explicit [string, fret] pairs. String 0 is high E. */
function spots(...pairs: Array<[number, number]>): GuitarSpot[] {
  return pairs.map(([string, fret]) => ({ string, fret }));
}

function rhythm(...beats: number[]): RhythmItem[] {
  return beats.map((value) => ({
    beats: Math.abs(value),
    dotted: Math.abs(value) === 1.5 || Math.abs(value) === 3,
    rest: value < 0,
  }));
}

const line = (
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'sequence', ...extra });

const chord = (
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'chord', ...extra });

const progression = (
  chords: number[][],
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, mode: 'sequence', chords, ...extra });

const pulse = (
  items: RhythmItem[],
  notes: number[],
  body: string,
  extra: Partial<InstrumentDemoSpec> = {},
): InstrumentDemoSpec => ({ notes, body, rhythm: items, ...extra });

const demo = (afterSection: number, spec: InstrumentDemoSpec): LessonInstrumentDemo => ({
  afterSection,
  spec,
});

const CORE_LESSON_INSTRUMENT_DEMOS: Record<string, LessonInstrumentDemo[]> = {
  // ───────────────────────────── Pitch & the Staff ─────────────────────────────
  'sound-pitch-keyboard': [
    demo(
      0,
      line(
        N('A3 A4'),
        `Play **A3** and then **A4**. On the piano, A3 is the A below middle C and A4 is the A above it; count every key, black and white, and you will find exactly twelve steps between them. On guitar, A3 is the G string at the 2nd fret and A4 is the high E string at the 5th fret. The two pitches sound like the same note because the upper one vibrates at twice the frequency.`,
        {
          tempo: 0.9,
          guitarSpots: spots([2, 2], [0, 5]),
          rootPitchClasses: [9],
          caption: 'Octave: twelve semitones, the same letter name in a new register.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5'),
        `Find **C4** at the left of a two-black-key group, then play only white keys up to the next C. The pattern of two black keys and three black keys repeats at every octave. On guitar, play the same scale in open position: A string 3rd fret, D open, D 2nd fret, D 3rd fret, G open, G 2nd fret, B open, B 1st fret. The fretboard has no black keys, so the half steps simply appear as adjacent frets.`,
        {
          tempo: 0.38,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'C major: seven white keys, or eight notes from C4 to C5.',
        },
      ),
    ),
  ],

  'staff-and-clefs': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4'),
        `Play **C4–D4–E4–F4–G4** as a ladder. Each move to the next line or space on the staff is exactly one of these steps. On piano the five notes are five adjacent white keys; on guitar they are B string 1st fret, B string 3rd fret, high E open, high E 1st fret, and high E 3rd fret. Notice that E–F is the only half step in this group.`,
        {
          tempo: 0.45,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 1], [0, 3]),
          rootPitchClasses: [0],
          caption: 'Line–space–line–space is a diatonic ladder, not a semitone ruler.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('F3 C4'),
        `The bass clef puts **F3** on the fourth line; the treble clef puts **C4** on the first ledger line below it. Play F3 and C4 together on the piano: the interval is a perfect fifth. On guitar, F3 is the D string at the 3rd fret and C4 is the B string at the 1st fret. The same two pitches are the hinge between the two clefs.`,
        {
          tempo: 0.8,
          guitarSpots: spots([3, 3], [1, 1]),
          rootPitchClasses: [5],
          caption: 'F3 to C4: a perfect fifth across the grand staff.',
        },
      ),
    ),
  ],

  'treble-clef-reading': [
    demo(
      0,
      line(
        N('E4 G4 B4 D5 F5'),
        `Play the five treble lines from bottom to top: **E4, G4, B4, D5, F5**. On the piano they are all white keys; say the letter aloud as you play. On guitar, find each letter somewhere on the neck rather than only in one octave: E4 is the open high E, G4 is the high E 3rd fret, B4 is the high E 7th fret, D5 is the high E 10th fret, and F5 lies beyond the twelfth fret.`,
        {
          pianoEnd: 80,
          tempo: 0.5,
          rootPitchClasses: [4],
          caption: 'The treble lines are every other letter: E–G–B–D–F.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('C4 A5'),
        `Middle C, **C4**, sits on the first ledger line below the treble staff. **A5** sits on the first ledger line above it. Play C4 and A5 on the piano and notice that the distance is a major sixth plus an octave — a wide, open sound. On guitar, C4 is the B string 1st fret; A5 is far above the twelfth fret, so use the keyboard to see the ledger-line register.`,
        {
          pianoEnd: 84,
          tempo: 0.9,
          guitarSpots: spots([1, 1]),
          rootPitchClasses: [0],
          caption: 'Ledger lines extend the same line–space pattern beyond the staff.',
        },
      ),
    ),
  ],

  'bass-clef-reading': [
    demo(
      0,
      line(
        N('G2 B2 D3 F3 A3'),
        `Play the five bass lines from bottom to top: **G2, B2, D3, F3, A3**. On guitar the whole set sits comfortably in open position: low E 3rd fret, A string 2nd fret, D open, D 3rd fret, G 2nd fret. On piano, put your left hand over the lower keys and say each letter as it sounds.`,
        {
          pianoStart: 36,
          tempo: 0.5,
          guitarSpots: spots([5, 3], [4, 2], [3, 0], [3, 3], [2, 2]),
          rootPitchClasses: [7],
          caption: 'Bass lines: G–B–D–F–A, the same “every other letter” pattern as the treble.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('C3 F3 C4'),
        `Play **C3, F3, and C4** with the left hand. C3 is the second space from the bottom of the bass staff, F3 is the fourth line, and C4 is the first ledger line above. On guitar, C3 is the A string 3rd fret, F3 is the D string 3rd fret, and C4 is the B string 1st fret. The shared C4 is the note that joins the two hands and the two clefs.`,
        {
          pianoStart: 36,
          tempo: 0.6,
          guitarSpots: spots([4, 3], [3, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'C3–F3–C4: two bass landmarks and the middle-C bridge.',
        },
      ),
    ),
  ],

  'accidentals-enharmonics': [
    demo(
      0,
      line(
        N('F4 F#4 G4 Gb4'),
        `Play **F4, F♯4, G4, G♭4**. On the piano, F♯ is the black key immediately to the right of F, and G♭ is the same black key immediately to the left of G. On guitar, F4 is the high E 1st fret, F♯4 is the 2nd fret, G4 is the 3rd fret, and G♭4 is again the 2nd fret. A sharp moves one semitone higher; a flat moves one semitone lower.`,
        {
          tempo: 0.55,
          guitarSpots: spots([0, 1], [0, 2], [0, 3], [0, 2]),
          rootPitchClasses: [5],
          caption: 'F♯ and G♭ are the same pitch with two different jobs.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C#4 Db4'),
        `Find the black key between C and D. It is **C♯** when you are rising toward D and **D♭** when you are falling toward C. On guitar it is the B string 2nd fret under either name. Play it twice and listen: the sound does not change, only the spelling does.`,
        {
          tempo: 0.9,
          preferFlats: false,
          guitarSpots: spots([1, 2]),
          rootPitchClasses: [1],
          caption: 'One key, one fret, two names: C♯ = D♭.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Rhythm & Meter ─────────────────────────────
  'beat-note-values': [
    demo(
      1,
      pulse(
        rhythm(4, 2, 1, 0.5, 0.5),
        N('G3'),
        `Set a slow pulse and play **G3** on every click. Then change the length: hold for four beats (whole note), two beats (half), one beat (quarter), and two eighth notes inside one beat. On guitar, use the open G string or any comfortable open string; the rhythm matters more than the pitch. Count aloud while you play so the note value and the silence between events stay distinct.`,
        {
          tempo: 0.55,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'One pitch, five durations: the note value is the length, not the key.',
        },
      ),
    ),
  ],

  'rests-dotted-notes': [
    demo(
      0,
      pulse(
        rhythm(1, -1, 1, 1),
        N('G3'),
        `Play a steady pulse on **G3**, but leave the second beat silent. The rest is measured silence, not a gap to rush. On guitar, tap the open G string for the sounded beats and keep your hand moving through the silent beat. Count **1 – (rest) – 3 – 4** so the missing sound still has a place in the grid.`,
        {
          tempo: 0.55,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'A rest is an event with a duration, not empty space.',
        },
      ),
    ),
    demo(
      1,
      pulse(
        rhythm(3, 1),
        N('G3'),
        `A dotted half note lasts **three beats**, then the bar needs one more beat to complete 4/4. Play and hold G3 for three counts, release, and let the final quarter note answer it. On guitar, hold the open G string for three counts and play it once more on beat 4. The dot adds half of the note's value: 2 + 1 = 3.`,
        {
          tempo: 0.55,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Dotted half (3) + quarter (1) = one complete 4/4 bar.',
        },
      ),
    ),
  ],

  'time-signatures': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('C4 E4 G4'), N('C4 E4 G4'), N('C4 E4 G4')],
        N('C4 E4 G4'),
        `Play the C major triad once per beat and count **1 2 3 4**. The top number tells you there are four beats; the bottom number tells you a quarter note gets one beat. On guitar, strum the open C shape once per count. Then try the same chord with three counts (3/4) and two counts (2/4): the chord does not change, but the bar and the accent do.`,
        {
          tempo: 0.55,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: '4/4: four quarter-note beats, strongest on 1 and secondary on 3.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('C4 E4 G4')],
        N('C4 E4 G4'),
        `In **6/8**, six eighth notes are grouped as two broad beats of three, not three beats of two. Count **1 – 2 – 3 – 4 – 5 – 6** with a stronger accent on 1 and 4. Play a C major chord on those two accents and let the other eighths pass. On guitar, strum the C shape twice per bar and feel the lilt; it should not feel like a waltz.`,
        {
          tempo: 0.7,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: '6/8 is compound: two broad beats, each divided into three.',
        },
      ),
    ),
  ],

  'subdivision-counting': [
    demo(
      0,
      pulse(
        rhythm(0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5),
        N('G3'),
        `Count **1 & 2 & 3 & 4 &** aloud and play G3 on every “and” as well as every number. On the piano, use one key and let the hand bounce; on guitar, mute the strings and tap the open G string with the right hand. The spoken grid is the skill: the notes are placed on it, not guessed around it.`,
        {
          tempo: 0.5,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Eighth notes live on the numbers and the “and”s.',
        },
      ),
    ),
    demo(
      1,
      pulse(
        rhythm(0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25),
        N('G3'),
        `Divide each eighth in half and count **1 e & a 2 e & a 3 e & a 4 e & a**. Play G3 on each sixteenth, then stop and clap the same figure. On guitar, use a single muted string and alternate down-up strokes; the picking hand keeps the grid even while the count does the thinking. Slow the tempo until every subdivision is visible.`,
        {
          tempo: 0.34,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Sixteenths: four events inside one quarter-note beat.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Intervals & Scales ─────────────────────────────
  'half-whole-steps': [
    demo(
      0,
      line(
        N('E4 F4 B4 C5'),
        `Play **E4–F4** and **B4–C5**. On the piano these are adjacent white keys with no black key between them; each pair is one semitone. On guitar, E4 is the open high E and F4 is its 1st fret; B4 is the high E 7th fret and C5 is the 8th fret. One fret is always one semitone on the same string.`,
        {
          tempo: 0.65,
          guitarSpots: spots([0, 0], [0, 1], [0, 7], [0, 8]),
          rootPitchClasses: [4],
          caption: 'The natural semitones: E–F and B–C.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 F4 G4'),
        `Play **C4–D4** and **F4–G4**. Each pair skips exactly one key on the piano and two frets on the guitar. On guitar, C4 is the B string 1st fret, D4 is the 3rd fret, F4 is the high E 1st fret, and G4 is the 3rd fret. A whole tone is two semitones, not two letter names.`,
        {
          tempo: 0.65,
          guitarSpots: spots([1, 1], [1, 3], [0, 1], [0, 3]),
          rootPitchClasses: [0],
          caption: 'Whole tones: two frets, or two keys including the black key between.',
        },
      ),
    ),
  ],

  'major-perfect-intervals': [
    demo(
      0,
      chord(
        N('C4 E4 G4 C5'),
        `Build the intervals from **C4**. C–E is a major third (four semitones), C–G is a perfect fifth (seven), and C–C5 is an octave (twelve). Play them one at a time, then together. On guitar, the open C shape contains all four notes; arpeggiate it from the A string to the high E and listen for the third, fifth, and octave.`,
        {
          tempo: 0.8,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: 'C–E (M3), C–G (P5), C–C5 (P8).',
        },
      ),
    ),
    demo(
      2,
      line(
        N('C4 E4 E4 C5'),
        `Invert **C–E** by moving the C above the E. The major third becomes a minor sixth: E4 to C5 is eight semitones. Play C4–E4, then E4–C5, and hear how the same two letter names change colour when their order flips. On guitar, C4 is the B string 1st fret, E4 is the open high E, and C5 is the high E 8th fret.`,
        {
          tempo: 0.75,
          guitarSpots: spots([1, 1], [0, 0], [0, 8]),
          rootPitchClasses: [4],
          caption: 'A major third inverts to a minor sixth; 3 + 6 = 9.',
        },
      ),
    ),
  ],

  'minor-diminished-intervals': [
    demo(
      0,
      chord(
        N('C4 E4 Eb4'),
        `Play **C–E** (major third, four semitones), then lower the E by one key to **E♭** (minor third, three semitones). On guitar, C4 is the B string 1st fret, E4 is the open high E, and E♭4 is the B string 4th fret. The third is the note that decides major or minor, and it is only one fret or one key away.`,
        {
          tempo: 0.85,
          guitarSpots: spots([1, 1], [0, 0], [1, 4]),
          rootPitchClasses: [0],
          caption: 'Lower the third by one semitone and the major third becomes minor.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 F#4'),
        `The **tritone** is six semitones: three whole tones. On piano, C–F♯ divides the octave exactly in half. On guitar, C4 is the B string 1st fret and F♯4 is the high E 2nd fret. Play the two notes together and hold them; the interval refuses to settle, which is why it powers dominant seventh chords.`,
        {
          tempo: 1.1,
          guitarSpots: spots([1, 1], [0, 2]),
          rootPitchClasses: [0],
          caption: 'C–F♯: an augmented fourth, or the same six semitones as C–G♭.',
        },
      ),
    ),
  ],

  'interval-ear-lab': [
    demo(
      0,
      line(
        N('C4 G4 C4 Eb4 C4 Ab4'),
        `Listen to three intervals from **C4**: a perfect fifth (C–G), a minor third (C–E♭), and a minor sixth (C–A♭). Use the three-pass routine: shape first, then size, then colour. On guitar, C4 is the B string 1st fret; G4 is the high E 3rd fret, E♭4 the B string 4th fret, and A♭4 the high E 4th fret. Sing the lower note, then find the upper one.`,
        {
          tempo: 0.85,
          guitarSpots: spots([1, 1], [0, 3], [1, 4], [0, 4]),
          rootPitchClasses: [0],
          caption: 'Three intervals to classify: P5, m3, m6.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4'),
        `Hold **C4** as a drone and sing each scale degree above it: C–D, C–E, C–F, C–G, C–A, C–B, C–C. On piano, keep C4 sounding with the sustain pedal or play it again on every bar. On guitar, let the B string 1st fret ring and sing against it. The drone gives your ear a fixed home, so the interval becomes a distance rather than a guess.`,
        {
          tempo: 1.1,
          guitarSpots: spots([1, 1]),
          rootPitchClasses: [0],
          caption: 'A C drone turns every note into a measurable interval.',
        },
      ),
    ),
  ],

  'major-scale': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5'),
        `Play the C major scale and name the pattern **W–W–H–W–W–W–H**. The half steps land between E–F and B–C; on the piano those are the adjacent white keys, and on guitar they are adjacent frets. In open position the guitar fingering is A string 3rd fret, D open, D 2nd fret, D 3rd fret, G open, G 2nd fret, B open, B 1st fret.`,
        {
          tempo: 0.38,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'C major: all white keys, with half steps at E–F and B–C.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('G3 A3 B3 C4 D4 E4 F#4 G4'),
        `Start the same pattern on **G3** and the seventh degree must be raised to **F♯**. On piano, play G major and notice the one black key, F♯. On guitar, use this compact shape: D string 5th fret, G string 2nd fret, B open, B 1st fret, B 3rd fret, high E open, high E 2nd fret, high E 3rd fret. One scale recipe, one new key.`,
        {
          pianoEnd: 84,
          tempo: 0.38,
          guitarSpots: spots([3, 5], [2, 2], [1, 0], [1, 1], [1, 3], [0, 0], [0, 2], [0, 3]),
          rootPitchClasses: [7],
          caption: 'G major: the same W–W–H–W–W–W–H pattern with F♯.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Key Signatures ─────────────────────────────
  'order-of-sharps': [
    demo(
      0,
      line(
        N('G4 A4 B4 C5 D5 E5 F#5 G5'),
        `Play **G major** and find the one sharp: **F♯**. On the piano it is the black key immediately below G; on guitar it is the D string 4th fret in this open-position scale. The key signature does not change the pattern, it preserves it. Play the scale before reading a piece in G so the hand learns the shape of the key.`,
        {
          pianoEnd: 84,
          tempo: 0.38,
          guitarSpots: spots([5, 3], [4, 0], [4, 2], [4, 3], [3, 0], [3, 2], [3, 4], [2, 0]),
          rootPitchClasses: [7],
          caption: 'One sharp, F♯, creates G major.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('F#4 G4 C#4 D4'),
        `The **last sharp** is the leading tone of the major key. Play **F♯4–G4** and hear it rise into the tonic; then play **C♯4–D4** in D major. On piano, F♯ and C♯ are the black keys just below G and D. On guitar, F♯4 is the high E 2nd fret, G4 the 3rd, C♯4 the B string 2nd fret, and D4 the 3rd. The earlier sharps are the other raised notes of the scale, so read the signature as a set, not as isolated accidents.`,
        {
          tempo: 0.7,
          guitarSpots: spots([0, 2], [0, 3], [1, 2], [1, 3]),
          rootPitchClasses: [7, 2],
          caption: 'F♯ resolves to G; C♯ resolves to D.',
        },
      ),
    ),
  ],

  'order-of-flats': [
    demo(
      0,
      line(
        N('F3 G3 A3 Bb3 C4 D4 E4 F4'),
        `Play **F major** and find the one flat: **B♭**. On piano it is the black key immediately to the left of B; on guitar, use low E 1st fret, low E 3rd fret, A open, A 1st fret, A 3rd fret, D open, D 2nd fret, D 3rd fret. The flat keeps the major pattern intact by lowering the fourth degree.`,
        {
          pianoStart: 36,
          tempo: 0.38,
          guitarSpots: spots([5, 1], [5, 3], [4, 0], [4, 1], [4, 3], [3, 0], [3, 2], [3, 3]),
          rootPitchClasses: [5],
          caption: 'One flat, B♭, creates F major.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('Bb3 D4 F4'),
        `Build a **B♭ major triad** from the flat key: B♭–D–F. On piano, find B♭ immediately left of B, then D and F. On guitar, the A-string barre shape at the 1st fret is \`x 1 3 3 3 1\`; the root is on the A string and the same shape moves to any fret. The second-to-last flat in the signature is the tonic, and here it is B♭.`,
        {
          tempo: 0.9,
          guitarSpots: shape('x 1 3 3 3 1'),
          rootPitchClasses: [10],
          caption: 'B♭–D–F: the tonic triad of B♭ major.',
        },
      ),
    ),
  ],

  'circle-of-fifths': [
    demo(
      0,
      line(
        N('C3 G3 D3 A2 E2 B2 F#2'),
        `The circle of fifths orders the keys by perfect fifths: **C → G → D → A → E → B → F♯ → …**. On piano, play C3 then G3 and hear the seventh; continue around in any octave. On guitar, trace the roots on the low strings: C on the A string 3rd fret, G on the low E 3rd fret, D open, A open, E open, B on the A string 2nd fret, F♯ on the low E 2nd fret. The octave shifts to keep the hand in position; the pitch classes are what follow the circle.`,
        {
          pianoStart: 36,
          tempo: 0.55,
          guitarSpots: spots([4, 3], [5, 3], [3, 0], [4, 0], [5, 0], [4, 2], [5, 2]),
          rootPitchClasses: [0, 7, 2, 9, 4, 11, 6],
          caption: 'Clockwise by perfect fifths: each step adds one sharp.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('A3 C4 E4')],
        N('C4 E4 G4 A3 C4 E4'),
        `C major and A minor share the same notes. Play a **C major** chord, then an **A minor** chord: the bass moves C→A and the chord tones re-stack as A–C–E. On guitar, compare the open C shape \`x 3 2 0 1 0\` with the open A minor shape \`x 0 2 2 1 0\`. Same key signature, different home.`,
        {
          tempo: 0.9,
          guitarSpots: shape('x 0 2 2 1 0'),
          rootPitchClasses: [0, 9],
          caption: 'Relative keys: C major and A minor share a signature but not a tonic.',
        },
      ),
    ),
  ],

  'relative-keys-reading': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5 A4 G4 F4 E4 D4 C4 B3 A3'),
        `Play **C major** up, then **A natural minor** down. The notes are identical; only the home changes. On piano, start C major on C4 and A minor on A3. On guitar, C major open position is the scale you already know; A minor uses A open, A string 2nd and 3rd frets, D open, D 2nd and 3rd frets, G open, G 2nd fret. Listen for which note feels final.`,
        {
          tempo: 0.32,
          guitarSpots: spots([4, 0], [4, 2], [4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2]),
          rootPitchClasses: [0, 9],
          caption: 'Same seven notes, two different tonics.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('G4 B4 D5'), N('E4 G4 B4')],
        N('G4 B4 D5 E4 G4 B4'),
        `In a key signature, the final bass note and the first strong chord tell you which relative key is home. Play **G major** then **E minor**. On guitar, G is \`3 2 0 0 0 3\` and E minor is \`0 2 2 0 0 0\`; the shared notes are G, B, and E. The signature alone cannot decide between them — your ear and the bass can.`,
        {
          pianoEnd: 84,
          tempo: 0.9,
          guitarSpots: shape('0 2 2 0 0 0'),
          rootPitchClasses: [7, 4],
          caption: 'G major and E minor: one signature, two possible homes.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Triads & Chords ─────────────────────────────
  'major-minor-triads': [
    demo(
      0,
      chord(
        N('C4 E4 G4'),
        `Build a **C major triad** from the root: C, skip a white key to E, skip another to G. On piano, that is three white keys with a black key between each pair. On guitar, the open C shape \`x 3 2 0 1 0\` contains C, E, and G; strum it and name the three chord tones. The third, E, is what makes it major.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: 'C–E–G: root, major third, perfect fifth.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 Eb4 G4'),
        `Now lower **E** by one semitone to **E♭**. The chord becomes C minor: C–E♭–G. On piano, move the middle key one step left. On guitar, the movable minor shape is \`x 3 5 5 4 3\` at the 3rd fret; the same shape moved to another fret gives another minor chord. One note changes, and the whole colour changes.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 3 5 5 4 3'),
          rootPitchClasses: [0],
          caption: 'C–E♭–G: the minor third is the only difference.',
        },
      ),
    ),
  ],

  'diminished-augmented': [
    demo(
      0,
      chord(
        N('B3 D4 F4'),
        `Build **B diminished** from two minor thirds: B–D and D–F. On piano, play B, D, F; the interval from B to F is a diminished fifth, six semitones. On guitar, \`x 2 3 4 3 x\` is a compact B diminished shape. In C major this is vii°, and it leans strongly toward C.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 2 3 4 3 x'),
          rootPitchClasses: [11],
          caption: 'B–D–F: two minor thirds, a diminished fifth.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 E4 G#4'),
        `Build **C augmented** from two major thirds: C–E and E–G♯. On piano, play C, E, G♯; the outer interval is an augmented fifth, eight semitones. On guitar, \`x 3 2 1 1 x\` gives C, E, G♯, C. The chord is symmetrical, so it can be reinterpreted from several roots — a favourite colour for modulation and suspense.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 3 2 1 1 x'),
          rootPitchClasses: [0],
          caption: 'C–E–G♯: two major thirds, an augmented fifth.',
        },
      ),
    ),
  ],

  'chord-inversions': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('E4 G4 C5'), N('G4 C5 E5')],
        N('C4 E4 G4 E4 G4 C5 G4 C5 E5'),
        `Play C major in three positions: **C–E–G** (root), **E–G–C** (first inversion), **G–C–E** (second inversion). The chord tones never change; only the bass note does. On piano, keep the same three keys and rotate them. On guitar, the open C shape is root position; \`x 7 5 5 8 x\` puts E in the bass for a first-inversion C/E.`,
        {
          pianoEnd: 80,
          tempo: 0.55,
          guitarSpots: shape('x 7 5 5 8 x'),
          rootPitchClasses: [0],
          caption: 'Root, first inversion, second inversion: same chord, different bass.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [
          N('C4 E4 G4'),
          N('A3 C4 F4'),
          N('G3 B3 D4'),
          N('E3 G3 C4'),
        ],
        N('C3 A2 G2 E2'),
        `Make the bass move by step instead of jumping in root position: **C – F/A – G – C/E**. On piano, keep the upper voices close and let the bass line C–A–G–E pull the progression forward. On guitar, the bass roots are A string 3rd fret (C), open A (F/A), low E 3rd fret (G), and open low E (C/E); strum the full shapes above each bass note.`,
        {
          pianoStart: 36,
          tempo: 0.85,
          guitarSpots: spots([4, 3], [4, 0], [5, 3], [5, 0]),
          rootPitchClasses: [0, 7],
          caption: 'Slash chords name the bass: F/A, C/E.',
        },
      ),
    ),
  ],

  'diatonic-chords': [
    demo(
      0,
      progression(
        [
          N('C4 E4 G4'),
          N('D4 F4 A4'),
          N('E4 G4 B4'),
          N('F4 A4 C5'),
          N('G4 B4 D5'),
          N('A4 C5 E5'),
          N('B4 D5 F5'),
          N('C4 E4 G4'),
        ],
        N('C4 D4 E4 F4 G4 A4 B4'),
        `Harmonise the C major scale with a triad on every degree. The qualities come out in a fixed order: **I – ii – iii – IV – V – vi – vii°**. On piano, play each triad in root position and name its quality. On guitar, the roots are the C major scale; build the chord above each root and listen to where the diminished chord appears.`,
        {
          pianoEnd: 84,
          tempo: 0.5,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0]),
          rootPitchClasses: [0, 2, 4, 5, 7, 9, 11],
          caption: 'One scale, seven triads: major, minor, minor, major, major, minor, diminished.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('F4 A4 C5'), N('G4 B4 D5'), N('C4 E4 G4')],
        N('C3 F2 G2 C3'),
        `Play the three pillars **I–IV–V–I** in C: C, F, G, C. On piano, listen to the bass root movement and the way V pulls back to I. On guitar, strum C, F, G, and C; the bass roots are A string 3rd fret, low E 1st fret, low E 3rd fret, and A string 3rd fret. This is the harmonic skeleton under countless songs.`,
        {
          pianoStart: 36,
          tempo: 0.9,
          guitarSpots: spots([4, 3], [5, 1], [5, 3], [4, 3]),
          rootPitchClasses: [0, 5, 7],
          caption: 'I–IV–V–I: home, departure, tension, return.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Minor Keys ─────────────────────────────
  'natural-minor': [
    demo(
      0,
      line(
        N('A3 B3 C4 D4 E4 F4 G4 A4'),
        `Play **A natural minor**: A–B–C–D–E–F–G–A. On piano, start on A3 and use only white keys; the pattern is **W–H–W–W–H–W–W**. On guitar, open position gives A open, A string 2nd and 3rd frets, D open, D 2nd and 3rd frets, G open, G 2nd fret. The same notes as C major, but A is home.`,
        {
          tempo: 0.38,
          guitarSpots: spots([4, 0], [4, 2], [4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2]),
          rootPitchClasses: [9],
          caption: 'A natural minor: the relative minor of C major.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('A3 C#4 E4'), N('A3 C4 E4')],
        N('A3 C#4 E4 A3 C4 E4'),
        `Compare **A major** (A–C♯–E) with **A minor** (A–C–E). On piano, the middle note moves down one key from C♯ to C. On guitar, A major is \`x 0 2 2 2 0\` and A minor is \`x 0 2 2 1 0\`; the only change is the B string, from the 2nd fret to the 1st. That single semitone is the whole emotional shift.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 0 2 2 1 0'),
          rootPitchClasses: [9],
          caption: 'A major to A minor: lower the third by one semitone.',
        },
      ),
    ),
  ],

  'harmonic-melodic-minor': [
    demo(
      0,
      line(
        N('A2 B2 C3 D3 E3 F3 G#3 A3'),
        `Play **A harmonic minor** on one string so the altered note is unmistakable. On the A string: open A, 2nd fret B, 3rd fret C, 5th fret D, 7th fret E, 8th fret F, **11th fret G♯**, 12th fret A. On piano, the same scale is all white keys except G♯. The raised seventh creates the leading tone and a major V chord.`,
        {
          pianoStart: 36,
          tempo: 0.38,
          guitarSpots: spots([4, 0], [4, 2], [4, 3], [4, 5], [4, 7], [4, 8], [4, 11], [4, 12]),
          rootPitchClasses: [9],
          caption: 'A harmonic minor: raise the seventh to G♯.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('A2 B2 C3 D3 E3 F#3 G#3 A3 G3 F3 E3 D3 C3 B2 A2'),
        `Ascending **A melodic minor** raises both the sixth and seventh: F♯ and G♯. On the A string, F♯ is the 9th fret and G♯ the 11th; descending, the scale reverts to F♮ (8th fret) and G♮ (10th fret). On piano, play the ascending form, then let the upper half relax back to natural minor on the way down.`,
        {
          pianoStart: 36,
          tempo: 0.3,
          guitarSpots: spots([4, 9], [4, 11], [4, 8], [4, 10]),
          rootPitchClasses: [9],
          caption: 'Melodic minor: F♯ and G♯ ascending; F♮ and G♮ descending.',
        },
      ),
    ),
  ],

  'minor-progressions': [
    demo(
      0,
      progression(
        [N('A3 C4 E4'), N('D4 F4 A4'), N('E4 G#4 B4'), N('A3 C4 E4')],
        N('A2 D3 E3 A2'),
        `Play the minor cadence **i–iv–V–i** in A minor: Am–Dm–E–Am. The E major chord borrows G♯ from harmonic minor and gives the cadence its strong leading tone. On piano, keep the bass roots A–D–E–A. On guitar, the bass roots are open A, open D, D string 2nd fret (E), and open A again; play Am, Dm, E, and Am above them.`,
        {
          pianoStart: 36,
          tempo: 0.9,
          guitarSpots: spots([4, 0], [3, 0], [3, 2], [4, 0]),
          rootPitchClasses: [9, 2, 4],
          caption: 'i–iv–V–i: the major V comes from harmonic minor.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('A3 C4 E4'), N('F3 A3 C4'), N('C4 E4 G4'), N('G3 B3 D4')],
        N('A2 F2 C3 G2'),
        `The modal loop **i–VI–III–VII** in A minor is Am–F–C–G. It avoids the leading tone, so the key feels open rather than fully resolved. On piano, play the four triads and listen to the bass A–F–C–G. On guitar, the bass roots are open A, low E 1st fret (F), A string 3rd fret (C), and low E 3rd fret (G); let those notes ring under the chord shapes.`,
        {
          pianoStart: 36,
          tempo: 0.9,
          guitarSpots: spots([4, 0], [5, 1], [4, 3], [5, 3]),
          rootPitchClasses: [9, 5, 0, 7],
          caption: 'i–VI–III–VII: a cinematic minor loop without a functional dominant.',
        },
      ),
    ),
  ],

  'grand-staff-reading': [
    demo(
      0,
      line(
        N('C4 E4 F3 G4'),
        `Use four landmarks to bridge the grand staff: **C4** (ledger line between the staves), **E4** (first line of treble), **F3** (fourth line of bass), and **G4** (second line of treble). On piano, play them with the hand that owns each staff. On guitar, C4 is the B string 1st fret, E4 the open high E, F3 the D string 3rd fret, and G4 the high E 3rd fret.`,
        {
          pianoStart: 36,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [0, 0], [3, 3], [0, 3]),
          rootPitchClasses: [0, 4, 5, 7],
          caption: 'Four landmarks that make the two clefs one map.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C3 E4 G4 C5'), N('G2 D4 G4 B4'), N('C3 E4 G4 C5')],
        N('C3 G2 C3'),
        `Read in chunks, not one note at a time. Play a **I–V–I** cadence with the left hand on the bass roots and the right hand holding the upper chord. On guitar, the bass roots are A string 3rd fret (C), low E 3rd fret (G), and A string 3rd fret (C); play C–G–C shapes above them. Keep a slow metronome going; steady reading is more valuable than stopping at every note.`,
        {
          pianoStart: 36,
          tempo: 0.85,
          guitarSpots: spots([4, 3], [5, 3], [4, 3]),
          rootPitchClasses: [0, 7],
          caption: 'I–V–I: read the chord shape and the bass motion together.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Harmony & Progressions ─────────────────────────────
  'diatonic-functions': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('A3 C4 E4'), N('F3 A3 C4'), N('G3 B3 D4')],
        N('C3 A2 F2 G2'),
        `Hear the three jobs. **I** is home, **vi** is a soft tonic substitute, **IV** departs, and **V** creates the pull home. On piano, play C–Am–F–G and name the function of each chord before you play it. On guitar, the bass roots are A string 3rd fret (C), open A (Am), low E 1st fret (F), and low E 3rd fret (G); use C, Am, F, and G shapes above them.`,
        {
          pianoStart: 36,
          tempo: 0.9,
          guitarSpots: spots([4, 3], [4, 0], [5, 1], [5, 3]),
          rootPitchClasses: [0, 9, 5, 7],
          caption: 'Tonic → subdominant → dominant: the archetypal journey.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('F4 A4 C5'), N('G4 B4 D5'), N('C4 E4 G4')],
        N('C3 F2 G2 C3'),
        `Play **I–IV–V–I** slowly and notice the stations: settled, departure, urgency, release. On piano, hold each chord for a full bar and sing the bass line. On guitar, strum each chord once and let it ring; the bass roots are A string 3rd fret, low E 1st fret, low E 3rd fret, and A string 3rd fret. Once you can hear the four stations, chord identification becomes contextual rather than a guess.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([4, 3], [5, 1], [5, 3], [4, 3]),
          rootPitchClasses: [0, 5, 7],
          caption: 'T–S–D–T in C: C–F–G–C.',
        },
      ),
    ),
  ],

  'cadences-ii-v-i': [
    demo(
      0,
      progression(
        [N('F4 A4 C5'), N('C4 E4 G4'), N('G4 B4 D5'), N('C4 E4 G4')],
        N('F2 C3 G2 C3'),
        `Compare the **plagal** cadence IV–I with the **authentic** cadence V–I. On piano, play F–C, then G–C; the first feels soft, the second final. On guitar, the bass roots are low E 1st fret (F), A string 3rd fret (C), low E 3rd fret (G), and A string 3rd fret (C); play F–C and G–C shapes above them. The bass motion is the punctuation; the upper voices decide how strong the stop feels.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([5, 1], [4, 3], [5, 3], [4, 3]),
          rootPitchClasses: [5, 0, 7],
          caption: 'IV–I (plagal) and V–I (authentic) in C.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('D4 F4 A4 C5'), N('G3 B3 D4 F4'), N('C4 E4 G4 B4')],
        N('D3 G2 C3'),
        `The **ii–V–I** in C is Dm7–G7–Cmaj7. On piano, keep the common tones and let the sevenths resolve: the C in Dm7 falls to B in G7, and the F in G7 falls to E in Cmaj7. On guitar, the bass roots are open D, low E 3rd fret (G), and A string 3rd fret (C); use Dm7 \`x x 0 2 1 1\`, G7 \`3 2 0 0 0 1\`, and Cmaj7 \`x 3 2 0 0 0\` above them.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([3, 0], [5, 3], [4, 3]),
          rootPitchClasses: [2, 7, 0],
          caption: 'ii–V–I: bass down by fifths, sevenths resolving by step.',
        },
      ),
    ),
  ],

  'seventh-chords': [
    demo(
      0,
      progression(
        [N('C4 E4 G4 B4'), N('C4 E4 G4 Bb4')],
        N('C4 E4 G4 B4 Bb4'),
        `Compare **Cmaj7** (C–E–G–B) with **C7** (C–E–G–B♭). On piano, the only change is B down to B♭; play them back to back and hold the last chord. On guitar, Cmaj7 is \`x 3 2 0 0 0\` and C7 is \`x 3 2 3 1 0\`. That one semitone turns a dreamy chord into a dominant that wants to resolve.`,
        {
          tempo: 1.0,
          guitarSpots: shape('x 3 2 3 1 0'),
          rootPitchClasses: [0],
          caption: 'Cmaj7 vs C7: one semitone changes the function.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [
          N('C4 E4 G4 B4'),
          N('D4 F4 A4 C5'),
          N('E4 G4 B4 D5'),
          N('F4 A4 C5 E5'),
          N('G4 B4 D5 F5'),
          N('A4 C5 E5 G5'),
          N('B4 D5 F5 A5'),
        ],
        N('C4 D4 E4 F4 G4 A4 B4'),
        `In C major the diatonic sevenths are **Imaj7 – ii7 – iii7 – IVmaj7 – V7 – vi7 – viiø7**. Play them from C to B and listen for the one dominant seventh: G7 is the only major-minor seventh in the set. On guitar, build each seventh above the corresponding scale root; the quality pattern is the same in every key.`,
        {
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0]),
          rootPitchClasses: [0, 2, 4, 5, 7, 9, 11],
          caption: 'Diatonic sevenths in C: the V7 is the unique dominant seventh.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Modes ─────────────────────────────
  'seven-modes': [
    demo(
      0,
      line(
        N('D4 E4 F4 G4 A4 B4 C5 D5'),
        `Play **D Dorian**: D–E–F–G–A–B–C–D. On piano, use only white keys but start and end on D. On guitar, the D string gives the whole mode in one position: open D, 2nd fret E, 3rd fret F, 5th fret G, 7th fret A, 9th fret B, 10th fret C, 12th fret D. The notes are C major's notes; the home is D.`,
        {
          pianoEnd: 84,
          tempo: 0.38,
          guitarSpots: spots([3, 0], [3, 2], [3, 3], [3, 5], [3, 7], [3, 9], [3, 10], [3, 12]),
          rootPitchClasses: [2],
          caption: "D Dorian: C major's white keys with D as home.",
        },
      ),
    ),
    demo(
      2,
      line(
        N('D4 E4 F4 G4 A4 B4 C5 D5 D4 E4 F4 G4 A4 Bb4 C5 D5'),
        `Compare **D Dorian** with **D Aeolian**. The only difference is the sixth: B natural in Dorian, B♭ in Aeolian. On piano, play the two scales and stop on the sixth degree. On guitar, B is the G string 4th fret and B♭ is the 3rd fret. That single fret changes the mode's colour.`,
        {
          pianoEnd: 84,
          tempo: 0.35,
          guitarSpots: spots([2, 4], [2, 3]),
          rootPitchClasses: [2, 11],
          caption: 'Dorian vs Aeolian: B natural vs B♭.',
        },
      ),
    ),
  ],

  'modal-ear': [
    demo(
      0,
      line(
        N('D4 E4 F4 G4 A4 B4 C5 D5 D4 E4 F4 G4 A4 Bb4 C5 D5'),
        `Listen for the characteristic note. **D Dorian** has B natural; **D Aeolian** has B♭. On piano, play each scale and pause on the sixth. On guitar, the two candidates sit on the G string at the 4th and 3rd frets. Sing the tonic D first, then the sixth, then decide which mode you are hearing.`,
        {
          pianoEnd: 84,
          tempo: 0.35,
          guitarSpots: spots([2, 4], [2, 3]),
          rootPitchClasses: [2, 11],
          caption: 'The sixth degree is the doorway between Dorian and Aeolian.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('D4 F4 A4'), N('G3 B3 D4'), N('G3 B3 D4'), N('F3 A3 C4')],
        N('D3 G2 G2 F2'),
        `A modal vamp repeats a small set of chords without a functional dominant. Play **Dm–G** for Dorian, then **G–F** for Mixolydian. On piano, keep the bass roots D–G and G–F. On guitar, the bass roots are open D, low E 3rd fret (G), low E 3rd fret (G), and low E 1st fret (F); use Dm, G, and F shapes above them. The repetition lets the ear settle on the modal tonic.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([3, 0], [5, 3], [5, 3], [5, 1]),
          rootPitchClasses: [2, 7, 5],
          caption: 'Dorian i–IV (Dm–G) and Mixolydian I–♭VII (G–F).',
        },
      ),
    ),
  ],

  // ───────────────────────────── Ear Training ─────────────────────────────
  'melodic-dictation': [
    demo(
      0,
      line(
        N('G4 E4 F4 D4 C4'),
        `Listen to the contour first: **G–E–F–D–C** falls, rises once, then settles. In C major these are scale degrees 5–3–4–2–1. On piano, play the phrase slowly and sing it back before naming a note. On guitar, the same phrase is high E 3rd fret, open high E, 1st fret, B string 3rd fret, B string 1st fret.`,
        {
          tempo: 0.65,
          guitarSpots: spots([0, 3], [0, 0], [0, 1], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Contour first, scale degrees second, note names last.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('C4 D4 E4 G4 E4 D4 C4'),
        `A short two-bar phrase is easier to hold than a long stream. Play **C–D–E–G–E–D–C**, sing it on a neutral syllable, then write the rhythm before the pitches. On piano, use one hand; on guitar, stay in the B-string/high-E region so the hand does not distract from the ear.`,
        {
          tempo: 0.6,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 3], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'A two-bar phrase: rhythm first, then pitch.',
        },
      ),
    ),
  ],

  'chord-progression-recognition': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('A3 C4 E4'), N('F3 A3 C4')],
        N('C3 G2 A2 F2'),
        `Listen in order: quality, bass, function. In **I–V–vi–IV** the qualities are major, major, minor, major; the bass is C–G–A–F. On piano, play the progression and sing the bass line. On guitar, the bass roots are A string 3rd fret (C), low E 3rd fret (G), open A (Am), and low E 1st fret (F); use C–G–Am–F shapes above them.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [5, 3], [4, 0], [5, 1]),
          rootPitchClasses: [0, 7, 9, 5],
          caption: 'I–V–vi–IV: quality first, then bass, then function.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('B3 D4 G4'), N('A3 C4 E4'), N('F3 A3 C4')],
        N('C3 B2 A2 F2'),
        `Follow a descending bass line: **C – B – A – F** under C – G/B – Am – F. On piano, keep the upper voices close and let the bass step down. On guitar, the bass notes are A string 3rd fret, A string 2nd fret, open A, and low E 1st fret. A stepwise bass is one of the strongest maps through a progression.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [4, 2], [4, 0], [5, 1]),
          rootPitchClasses: [0, 7, 9, 5],
          caption: 'C–G/B–Am–F: a descending bass line anchors the ear.',
        },
      ),
    ),
  ],

  'rhythmic-dictation': [
    demo(
      0,
      pulse(
        rhythm(1, 1, 1, 1),
        N('G3'),
        `Tap the pulse before writing anything. Play **G3** on four steady beats, then decide whether the bar is 4/4 or 3/4. On guitar, mute the strings and tap the open G string; the pitch is irrelevant, the grid is the point. Once the pulse is in your body, the offbeats have somewhere to land.`,
        {
          tempo: 0.55,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Find the pulse before you notate a single event.',
        },
      ),
    ),
    demo(
      1,
      pulse(
        rhythm(0.5, 0.5, 1, 1.5, 0.5),
        N('G3'),
        `Notate in layers. Start with the strong beats, then add the offbeats: **1 & 2 – 3 & a 4**. Play the figure on G3 and clap it back. On guitar, keep a muted string under the right hand and let the picking pattern place the events. Mark the rests explicitly; silence is part of the rhythm.`,
        {
          tempo: 0.5,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Strong beats first, then subdivisions, then rests.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Voice Leading ─────────────────────────────
  'voice-leading-principles': [
    demo(
      0,
      progression(
        [
          N('C3 G3 E4 C5'),
          N('F3 A3 F4 C5'),
          N('G3 B3 D4 B4'),
          N('C3 G3 E4 C5'),
        ],
        N('C3 F2 G2 C3'),
        `Play a four-voice **I–IV–V–I** and keep the common tones. C stays in the top voice through I–IV; E moves to F, G moves to A. On piano, watch each voice move by step rather than jumping to the next chord shape. On guitar, the bass roots are A string 3rd fret, low E 1st fret, low E 3rd fret, and A string 3rd fret; above them, listen for the smallest possible motion in the top notes.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [5, 1], [5, 3], [4, 3]),
          rootPitchClasses: [0, 5, 7],
          caption: 'Common tones stay, other voices move by step.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 G4'), N('D4 F4'), N('E4 E4'), N('C4 C5')],
        N('C4 D4 E4 C4 G4 F4 E4 C5'),
        `Two voices can move in **contrary** motion: the lower voice rises C–D–E–C while the upper voice falls G–F–E–C. On piano, play each dyad and name the interval: perfect fifth, minor third, unison, octave. On guitar, C4 is the B string 1st fret, G4 the high E 3rd fret, D4 the B string 3rd fret, F4 the high E 1st fret.`,
        {
          tempo: 0.85,
          guitarSpots: spots([1, 1], [0, 3], [1, 3], [0, 1], [0, 0], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Contrary motion: one voice up, one voice down.',
        },
      ),
    ),
  ],

  'part-writing-doubling': [
    demo(
      0,
      chord(
        N('C3 G3 C4 E4'),
        `Spread a C major chord across **SATB**: bass C3, tenor G3, alto C4, soprano E4. On piano, play the four notes with two hands and check the ranges: soprano C4–A5, alto G3–D5, tenor C3–A4, bass E2–E4. On guitar, the same chord appears as the open C shape; the bass note is the root on the A string.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 1.1,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: 'SATB spacing: wide at the bottom, closer at the top.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('G3 B3 D4 F4'), N('C3 G3 C4 E4')],
        N('G2 C3'),
        `Resolve **G7 to C** with four voices. The leading tone B rises to C; the seventh F falls to E; D falls to C; the bass G falls to C. On piano, play the two chords and listen to each voice. On guitar, the bass roots are low E 3rd fret (G) and A string 3rd fret (C); the full shapes G7 \`3 2 0 0 0 1\` and C \`x 3 2 0 1 0\` give the same resolution above them.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([5, 3], [4, 3]),
          rootPitchClasses: [7, 0],
          caption: 'G7 → C: B rises, F falls, the bass drops a fifth.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Chromatic Harmony ─────────────────────────────
  'secondary-dominants': [
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('E4 G#4 B4 D5'), N('A3 C4 E4')],
        N('C3 E3 A2'),
        `**E7** is the dominant of A minor, so it is labelled **V7/vi** in C major. Play C–E7–Am. On piano, the G♯ in E7 rises to A, and the D falls to C. On guitar, the bass roots are A string 3rd fret (C), D string 2nd fret (E), and open A (Am); use C \`x 3 2 0 1 0\`, E7 \`0 2 0 1 0 0\`, and Am \`x 0 2 2 1 0\` above them. The chromatic G♯ is the clue that a local dominant has arrived.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [3, 2], [4, 0]),
          rootPitchClasses: [0, 4, 9],
          caption: 'C–E7–Am: V7/vi resolving to vi.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [N('A3 C#4 E4 G4'), N('D4 F4 A4')],
        N('A2 D3'),
        `In C major, an **A7** chord is not diatonic: A–C♯–E–G points to D minor. That makes it **V7/ii**. On piano, play A7–Dm and hear C♯ rise to D. On guitar, the bass roots are open A and open D; A7 is \`x 0 2 0 2 0\` and Dm is \`x x 0 2 3 1\`. The raised third, C♯, is the accidental that gives the game away.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([4, 0], [3, 0]),
          rootPitchClasses: [9, 2],
          caption: 'A7–Dm: V7/ii in C major.',
        },
      ),
    ),
  ],

  'modulation-tonicization': [
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('A3 C4 E4'), N('D4 F#4 A4 C5'), N('G3 B3 D4')],
        N('C3 A2 D3 G2'),
        `Modulate from C major to G major with a pivot: **C – Am – D7 – G**. Am is vi in C and ii in G; D7 is the dominant of G. On piano, play the bass C–A–D–G and listen for G becoming home. On guitar, the bass roots are A string 3rd fret, open A, open D, and low E 3rd fret; use C, Am, D7, and G shapes above them. The pivot is shared; the dominant seals the new key.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [4, 0], [3, 0], [5, 3]),
          rootPitchClasses: [0, 9, 2, 7],
          caption: 'C–Am–D7–G: pivot chord plus the new dominant.',
        },
      ),
    ),
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4')],
        N('C3 G2'),
        `A **direct modulation** arrives in the new key without a pivot. Play C major, then G major, and let the ear accept the new tonic. On piano, the bass C–G is a fifth; on guitar, the bass roots are A string 3rd fret (C) and low E 3rd fret (G). C \`x 3 2 0 1 0\` to G \`3 2 0 0 0 3\` makes the key change plain. The stronger the new dominant, the more complete the key change feels.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([4, 3], [5, 3]),
          rootPitchClasses: [0, 7],
          caption: 'Direct modulation: C major to G major.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Counterpoint ─────────────────────────────
  'species-counterpoint': [
    demo(
      0,
      progression(
        [N('C4 G4'), N('D4 F4'), N('E4 E4'), N('C4 C5')],
        N('C4 D4 E4 C4 G4 F4 E4 C5'),
        `A first-species exercise is note against note. Play the lower line **C–D–E–C** and the upper line **G–F–E–C**. The vertical intervals are a fifth, a minor third, a unison, and an octave. On piano, play one dyad per count. On guitar, put the lower voice on the B string and the upper voice on the high E string.`,
        {
          tempo: 0.8,
          guitarSpots: spots([1, 1], [0, 3], [1, 3], [0, 1], [0, 0], [0, 8]),
          rootPitchClasses: [0],
          caption: 'First species: consonant dyads, one note against one.',
        },
      ),
    ),
    demo(
      2,
      line(
        N('C4 D4 E4 C4 G4 F4 E4 C5'),
        `Sing each voice alone before playing them together. The lower line C–D–E–C and the upper line G–F–E–C both need a clear shape. On piano, play the lower voice, sing it, then add the upper voice. On guitar, play the two lines on adjacent strings and listen for the moment the voices move in contrary motion.`,
        {
          tempo: 0.7,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [1, 1], [0, 3], [0, 1], [0, 0], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Each line must be singable on its own.',
        },
      ),
    ),
  ],

  'imitation-canon': [
    demo(
      0,
      line(
        N('C4 D4 E4 G4 G4 A4 B4 D5'),
        `A motive and its answer. Play **C–D–E–G**, then answer it a fifth higher: **G–A–B–D**. On piano, play the first phrase, then the second, then overlap them. On guitar, the motive is B string 1st fret, 3rd fret, high E open, high E 3rd fret; the answer moves to high E 3rd, 5th, 7th, and 10th frets.`,
        {
          pianoEnd: 80,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 3], [0, 5], [0, 7], [0, 10]),
          rootPitchClasses: [0, 7],
          caption: 'Imitation at the fifth: the same motive, a new starting pitch.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 G4 G4 C5'),
        `Invert a fifth and it becomes a fourth: **C–G** becomes **G–C**. Play the two intervals and notice that the same two pitch classes change their vertical order. On piano, C4–G4 then G4–C5. On guitar, C4 is the B string 1st fret, G4 the high E 3rd fret, and C5 the high E 8th fret. Invertible counterpoint depends on this kind of interval flip.`,
        {
          tempo: 0.75,
          guitarSpots: spots([1, 1], [0, 3], [0, 8]),
          rootPitchClasses: [0, 7],
          caption: 'A fifth inverts to a fourth; the two lines swap roles.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Form & Analysis ─────────────────────────────
  'phrase-period-form': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('C4 E4 G4'), N('C4 E4 G4')],
        N('E4 D4 C4 D4 E4 F4 G4 E4 D4 C4 D4 E4 D4 C4'),
        `A period asks a question and answers it. The antecedent **E–D–C–D–E–F–G** ends on G, the dominant, for a half cadence. The consequent begins the same way but ends **E–D–C** on the tonic for an authentic cadence. On piano, play the melody with simple chords underneath; on guitar, let the last note of each phrase decide the punctuation.`,
        {
          tempo: 0.55,
          guitarSpots: spots([0, 0], [1, 3], [1, 1], [1, 3], [0, 0], [0, 1], [0, 3], [0, 0], [1, 3], [1, 1], [1, 3], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Antecedent ends on V; consequent ends on I.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 E4 C4 F4 G4 F4 C4 D4 E4 C4'),
        `**Ternary form** is statement–contrast–return: A–B–A. Play the A phrase **C–D–E–C**, contrast with **F–G–F**, then return to A. On piano, change the texture or register for B so the return feels like an arrival. On guitar, play A low on the neck and B higher, then bring A back.`,
        {
          tempo: 0.6,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [1, 1], [0, 1], [0, 3], [0, 1], [1, 1], [1, 3], [0, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'ABA: departure makes the return meaningful.',
        },
      ),
    ),
  ],

  'sonata-large-forms': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('C4 E4 G4')],
        N('C3 G2 C3'),
        `Sonata form is a drama of keys. The exposition presents the home key **C** and a contrasting second theme in **G**; the recapitulation brings the second theme back to C. Play C–G–C and hear the tension and resolution. On guitar, the bass roots are A string 3rd fret (C), low E 3rd fret (G), and A string 3rd fret (C); play C–G–C shapes above them.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([4, 3], [5, 3], [4, 3]),
          rootPitchClasses: [0, 7],
          caption: 'Home key, contrasting key, home again.',
        },
      ),
    ),
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('F3 A3 C4'), N('C4 E4 G4'), N('G3 B3 D4'), N('C4 E4 G4')],
        N('C3 F2 C3 G2 C3'),
        `A **rondo** keeps returning to its refrain: A–B–A–C–A. Play C–F–C–G–C and feel the home chord reopen the form each time. On piano, keep the refrain identical and let the episodes change key or texture. On guitar, the bass roots are A string 3rd fret, low E 1st fret, A string 3rd fret, low E 3rd fret, A string 3rd fret; the C, F, and G shapes make the returns easy to hear.`,
        {
          pianoStart: 36,
          tempo: 0.95,
          guitarSpots: spots([4, 3], [5, 1], [4, 3], [5, 3], [4, 3]),
          rootPitchClasses: [0, 5, 7],
          caption: 'Rondo: the refrain returns after each episode.',
        },
      ),
    ),
  ],

  // ───────────────────────────── Advanced Harmony ─────────────────────────────
  'extensions-alterations': [
    demo(
      0,
      progression(
        [N('C4 E4 G4 Bb4'), N('C4 E4 G4 Bb4 D5'), N('C4 E4 G4 Bb4 A4')],
        N('C4 E4 G4 Bb4 D5 A4'),
        `Stack thirds above C7. **C9** adds D; **C13** adds A. On piano, play C7, then C9, then C13, and listen to how the colour rises. On guitar, C9 is \`x 3 2 3 3 3\`; the root is on the A string and the extensions sit above it. In a real voicing, some lower notes are omitted to keep the texture clear.`,
        {
          pianoEnd: 84,
          tempo: 0.95,
          guitarSpots: shape('x 3 2 3 3 3'),
          rootPitchClasses: [0],
          caption: 'C7 → C9 → C13: extensions stack above the seventh.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4 Bb4'), N('C4 E4 G4 Bb4 Db5')],
        N('C4 E4 G4 Bb4 Db5'),
        `An **altered dominant** keeps the third and seventh but changes the upper colour. **C7♭9** adds D♭; the tritone between E and B♭ still drives the resolution. On piano, play C7 then C7♭9 and hear the extra bite. On guitar, \`x 3 2 3 2 3\` is a compact C7♭9 shape.`,
        {
          pianoEnd: 84,
          tempo: 1.1,
          guitarSpots: shape('x 3 2 3 2 3'),
          rootPitchClasses: [0],
          caption: 'C7♭9: the dominant function stays, the colour darkens.',
        },
      ),
    ),
    demo(
      2,
      chord(
        N('E4 A4 Bb4 D5'),
        `A rootless **C13** voicing contains the essential colour: E (third), A (thirteenth), B♭ (seventh), and D (ninth). On piano, play these four notes and let the bass player or left hand imply C. On guitar, \`x 0 2 3 3 x\` is a rootless voicing: open A, E, B♭, and D. Drop the root when another instrument covers it; the upper structure is what the listener hears.`,
        {
          pianoEnd: 84,
          tempo: 1.1,
          guitarSpots: shape('x 0 2 3 3 x'),
          rootPitchClasses: [0],
          caption: 'Rootless C13: E–A–B♭–D implies the whole chord.',
        },
      ),
    ),
  ],

  'reharmonization-capstone': [
    demo(
      0,
      progression(
        [N('D4 F4 A4 C5'), N('Db4 F4 Ab4 B3'), N('C4 E4 G4 B4')],
        N('D3 Db3 C3'),
        `A **tritone substitution** replaces G7 with D♭7 because both chords contain the same tritone, B–F. Play **Dm7–D♭7–Cmaj7**: the bass moves D–D♭–C by semitone while the essential tritone resolves into C major. On guitar, the bass roots are open D, A string 4th fret (D♭), and A string 3rd fret (C); use Dm7 \`x x 0 2 1 1\`, D♭7 \`x 4 3 4 2 x\`, and Cmaj7 \`x 3 2 0 0 0\` above them.`,
        {
          tempo: 0.95,
          guitarSpots: spots([3, 0], [4, 4], [4, 3]),
          rootPitchClasses: [2, 1, 0],
          caption: 'ii–♭II7–I: the tritone survives, the bass slides.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('F3 Ab3 C4'), N('C4 E4 G4')],
        N('C3 F2 C3'),
        `**Modal interchange** borrows a chord from the parallel minor. In C major, **iv** is F minor (F–A♭–C), a soft, nostalgic colour. Play C–Fm–C and hear the A♭ lean downward. On guitar, the bass roots are A string 3rd fret (C), low E 1st fret (F), and A string 3rd fret (C); use C \`x 3 2 0 1 0\`, Fm \`1 3 3 1 1 1\`, and C above them.`,
        {
          pianoStart: 36,
          tempo: 1.0,
          guitarSpots: spots([4, 3], [5, 1], [4, 3]),
          rootPitchClasses: [0, 5],
          caption: 'Borrowed iv: F minor in a C major context.',
        },
      ),
    ),
  ],
};

/**
 * Practical examples for the sections that previously carried prose only.
 * They are merged with the core set so every lesson section has an
 * instrument card directly after its explanation.
 */
const EXTRA_LESSON_INSTRUMENT_DEMOS: Record<string, LessonInstrumentDemo[]> = {
  'sound-pitch-keyboard': [
    demo(
      2,
      line(
        N('C3 E2 C4 E4'),
        `Put your left hand on **C3** and your right on **C4**. On the piano, C4 is the white key at the centre of the keyboard; count twelve keys up from C3 and you land on it. The guitar's six open strings span E2 to E4: low E is E2 and high E is E4, so the open strings already cover two octaves. Every instrument lays out the same pitch classes differently, but middle C stays the bridge between low and high registers.`,
        {
          pianoStart: 36,
          pianoEnd: 72,
          tempo: 0.75,
          guitarSpots: spots([4, 3], [5, 0], [1, 1], [0, 0]),
          rootPitchClasses: [0, 4],
          caption: 'Middle C (C4) sits between the hands; the open guitar strings span E2–E4.',
        },
      ),
    ),
  ],

  'staff-and-clefs': [
    demo(
      1,
      line(
        N('E4 G4 B4 D5'),
        `Play the treble lines **E4–G4–B4–D5**. The clef spiral circles the second line, fixing it as G4. On piano, G4 is the G above middle C; on guitar, the same line is high E open, 3rd, 7th, and 10th frets. The top line F5 lies just past the 12th fret shown here, and guitar music is written an octave higher than it sounds — two reasons the fretboard and the staff need translating.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.6,
          guitarSpots: spots([0, 0], [0, 3], [0, 7], [0, 10]),
          rootPitchClasses: [4, 7, 11, 2],
          caption: 'Treble lines from bottom: E4–G4–B4–D5–F5. The clef marks G4.',
        },
      ),
    ),
  ],

  'treble-clef-reading': [
    demo(
      1,
      line(
        N('C4 G4 C5 E5'),
        `Use **G4** on the second line, **C5** in the third space, and **F5** on the top line as landmarks. On piano, find C5 one octave above middle C. On guitar, G4 is the high E 3rd fret, C5 the 8th, and E5 the 12th; F5 is one fret beyond the board. From any landmark, move line-to-space to read the next note instead of reciting a mnemonic for every pitch.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.7,
          guitarSpots: spots([1, 1], [0, 3], [0, 8], [0, 12]),
          rootPitchClasses: [0, 7, 4],
          caption: 'Landmarks G4, C5, F5: step line-to-space from each one.',
        },
      ),
    ),
  ],

  'bass-clef-reading': [
    demo(
      1,
      line(
        N('C3 F3 C4'),
        `**C4** is the first ledger line above the bass staff. Play C3 (second space from the bottom), F3 (fourth line, between the clef dots), then C4. On piano, the hand climbs from the bass register to middle C. On guitar, C3 is the A string 3rd fret, F3 the low E 1st fret, and C4 the B string 1st fret. That shared ledger line is where the two clefs meet.`,
        {
          pianoStart: 36,
          pianoEnd: 72,
          tempo: 0.7,
          guitarSpots: spots([4, 3], [5, 1], [1, 1]),
          rootPitchClasses: [0, 5],
          caption: 'C3 and F3 are bass landmarks; C4 is the shared middle note.',
        },
      ),
    ),
  ],

  'accidentals-enharmonics': [
    demo(
      2,
      line(
        N('F4 F#4 G4 Gb4'),
        `Read the key signature first, then treat each accidental as a local change. Play **F4–F♯4–G4–G♭4**. On piano, F♯ is one key to the right of F and G♭ is one key to the left of G; both are the same black key. On guitar, F♯4 is the B string 7th fret and G♭4 is the high E 2nd fret — same pitch, different string. The spelling tells you which direction the line is heading.`,
        {
          pianoStart: 48,
          pianoEnd: 72,
          tempo: 0.65,
          guitarSpots: spots([1, 6], [1, 7], [1, 8], [0, 2]),
          rootPitchClasses: [5, 6, 7],
          caption: 'F♯ and G♭ are one pitch with two spellings.',
        },
      ),
    ),
  ],

  'beat-note-values': [
    demo(
      0,
      pulse(
        rhythm(1, 1, 1, 1),
        N('G3'),
        `Set a slow tempo and tap your foot on every beat. Play the open G string once per tap and count **1 2 3 4**. On piano, use G3 just below middle C. The barline after four beats is a grouping, not a new tempo; the pulse keeps running through it. Stay on one note until the count feels automatic.`,
        {
          tempo: 0.5,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Pulse: one attack per beat, counted 1–2–3–4.',
        },
      ),
    ),
    demo(
      2,
      pulse(
        rhythm(2, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5),
        N('G3'),
        `Keep the foot tapping and change only how often you play. Two half notes take two beats each, four quarters take one each, and eight eighths take half a beat each. On guitar, play open G for every level; on piano, use G3. The pulse never moves — the surface simply gets busier.`,
        {
          tempo: 0.45,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Same pulse, three levels: half notes, quarters, eighths.',
        },
      ),
    ),
  ],

  'rests-dotted-notes': [
    demo(
      2,
      pulse(
        rhythm(4),
        N('G3'),
        `Two half notes tied across a barline are played as one four-beat sound: press once and hold. This example plays that sustained result. On piano, hold G3 through the whole bar without re-striking; on guitar, let the open G ring. A tie differs from a dot because it can cross a barline and because the second note is not articulated.`,
        {
          tempo: 0.7,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'A tie produces one attack, not two.',
        },
      ),
    ),
  ],

  'time-signatures': [
    demo(
      1,
      pulse(
        rhythm(1, 1, 1, 1),
        N('C4 E4 G4'),
        `Count **1 2 3 4** and give beat 1 the most weight, beat 3 a little, and beats 2 and 4 the least. Strum a C chord once per beat and exaggerate the difference; then try accenting the “and” of 2 for syncopation. On piano, play the same C triad with a stronger attack on 1. Meter is a hierarchy of accents, not just a count.`,
        {
          tempo: 0.55,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: '4/4 weight: strong 1, secondary 3, weak 2 and 4.',
        },
      ),
    ),
  ],

  'subdivision-counting': [
    demo(
      2,
      pulse(
        rhythm(1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2, 2, 4),
        N('G3'),
        `Set the metronome to 60–70 BPM and count one full bar aloud before playing. This loop moves from quarters to eighths to halves to a whole note while the bar length stays the same. On piano, play G3; on guitar, the open G string. Keep counting when you stop playing — the internal clock is what the metronome is training.`,
        {
          tempo: 0.4,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Quarter → eighth → half → whole: same bar length throughout.',
        },
      ),
    ),
  ],

  'half-whole-steps': [
    demo(
      2,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5'),
        `Measure the steps inside C major. Whole tones skip a key: C–D, D–E, F–G, G–A, and A–B. Half steps are adjacent: E–F and B–C. On guitar, a whole step is two frets on the same string — C4 on the B string 1st fret to D4 on the 3rd — while a half step is one fret, as in E4 open to F4 on the high E 1st fret. Change one step and the scale changes character.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.4,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 1], [0, 3], [0, 5], [0, 7], [0, 8]),
          rootPitchClasses: [0],
          caption: 'W–W–H–W–W–W–H builds the major scale.',
        },
      ),
    ),
  ],

  'major-perfect-intervals': [
    demo(
      1,
      line(
        N('C4 D4 C4 E4 C4 F4 C4 G4 C4 C5'),
        `Keep **C4** as the lower anchor and play each reference interval above it. On piano, hold C4 with the left hand and find D, E, F, G, and C5 with the right. On guitar, C4 is the B string 1st fret; D4 is the 3rd fret, E4 the open high E, F4 the high E 1st fret, G4 the 3rd, and C5 the 8th. Sing each upper note after you play it, then remove the song reference and hear the distance directly.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.5,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 1], [0, 3], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Reference intervals from C4: M2, M3, P4, P5, P8.',
        },
      ),
    ),
  ],

  'minor-diminished-intervals': [
    demo(
      2,
      line(
        N('C4 F#4 C4 G#4 C4 A4'),
        `Alter C4's upper note and name the result. **C–F♯** is an augmented 4th (six semitones), **C–G♯** an augmented 5th (eight), and **C–B𝄫** a diminished 7th (nine; it sounds like C–A). On piano, each upper note is a black key. On guitar, C4 is the B string 1st fret, F♯4 the high E 2nd, G♯4 the 4th, and A4 the 5th. Same distance, different spelling, different meaning.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.65,
          guitarSpots: spots([1, 1], [0, 2], [0, 4], [0, 5]),
          rootPitchClasses: [0],
          caption: 'Augmented and diminished intervals: count semitones, then name the spelling.',
        },
      ),
    ),
  ],

  'interval-ear-lab': [
    demo(
      2,
      line(
        N('C4 E4 C4 F4 C4 G4'),
        `A daily set of three intervals is enough. Play **C4–E4**, **C4–F4**, and **C4–G4**, then sing each one back before naming it. On piano, keep C4 under the left hand so the lower note never changes. On guitar, use the B string 1st fret as the anchor and move only the upper voice. Ten focused minutes beats an hour once a week; add a new interval only when these three feel solid.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [0, 0], [1, 1], [0, 1], [1, 1], [0, 3]),
          rootPitchClasses: [0],
          caption: 'A ten-minute daily set: M3, P4, P5 from C4.',
        },
      ),
    ),
  ],

  'major-scale': [
    demo(
      1,
      line(
        N('C4 E4 G4 B4 C5'),
        `Hear the degrees that carry the most weight. **C4** is the tonic, **E4** the mediant that makes the scale major, **G4** the dominant, and **B4** the leading tone. Play C–E–G–B–C and stop on B before resolving; the ear expects C. On piano, B4 is the white key just below C5. On guitar, C4 is the B string 1st fret, E4 the open high E, G4 the 3rd fret, B4 the 7th, and C5 the 8th.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [0, 0], [0, 3], [0, 7], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Degrees 1–3–5–7–1: tonic, mediant, dominant, leading tone.',
        },
      ),
    ),
  ],

  'order-of-sharps': [
    demo(
      1,
      line(
        N('F#4 G4 C#4 D4 G#4 A4 D#4 E4'),
        `The last sharp is the leading tone, so go up one semitone to name the major key. Play **F♯4–G4** (one sharp, G major), **C♯4–D4** (two, D major), **G♯4–A4** (three, A major), and **D♯4–E4** (four, E major). On piano, each tonic is the white key just above the last sharp. On guitar, F♯4 is the high E 2nd fret, G4 the 3rd; C♯4 is the B string 2nd, D4 the 3rd.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.6,
          guitarSpots: spots([0, 2], [0, 3], [1, 2], [1, 3], [0, 4], [0, 5], [1, 4], [0, 0]),
          rootPitchClasses: [7, 2, 9, 4],
          caption: 'The last sharp rises a semitone to the tonic.',
        },
      ),
    ),
  ],

  'order-of-flats': [
    demo(
      2,
      line(
        N('Bb2 C3 D3 Eb3 F3 G3 A3 Bb3'),
        `Play **B♭ major** from the A string 1st fret to the D string 8th fret. On piano, the scale uses two black keys, B♭ and E♭. Move the same pattern up one fret and you have B major, which uses all five black keys; on guitar the hand shifts one fret higher. The pattern is identical, but the physical layout changes how the key feels under the fingers.`,
        {
          pianoStart: 36,
          pianoEnd: 72,
          tempo: 0.4,
          guitarSpots: spots([4, 1], [4, 3], [4, 5], [3, 1], [3, 3], [3, 5], [3, 7], [3, 8]),
          rootPitchClasses: [10],
          preferFlats: true,
          caption: 'B♭ major: two black keys; B major shifts the same shape up one fret.',
        },
      ),
    ),
  ],

  'circle-of-fifths': [
    demo(
      2,
      line(
        N('C3 G2 D3 A2'),
        `The circle predicts four things: which chords are diatonic, where modulation is easy, which accidentals a key needs, and how far a key is from home. Play **C–G–D–A** as roots and hear each step move up a fifth. On piano, the bass notes are C3, G2, D3, and A2. On guitar, the roots are the A string 3rd fret, low E 3rd fret, open D, and open A. Neighbouring keys share six of seven notes.`,
        {
          pianoStart: 36,
          pianoEnd: 72,
          tempo: 0.55,
          guitarSpots: spots([4, 3], [5, 3], [3, 0], [4, 0]),
          rootPitchClasses: [0, 7, 2, 9],
          caption: 'Clockwise fifths: C–G–D–A, each a perfect fifth higher.',
        },
      ),
    ),
  ],

  'relative-keys-reading': [
    demo(
      2,
      line(
        N('G3 B3 D4 G4 E3 G3 B3 E4'),
        `Apply the four-step reading routine. First name the signature: one sharp is **G major** or **E minor**. Then scan for accidentals, find the hardest bar, and read slowly enough that mistakes are rare. Play the G major arpeggio **G–B–D–G**, then the E minor arpeggio **E–G–B–E**. On piano they use the same white keys; on guitar the roots are the D string 5th fret and the D string 2nd fret. The bass note and final chord decide which home you are in.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.65,
          guitarSpots: spots([3, 5], [2, 4], [1, 3], [0, 3], [3, 2], [3, 5], [2, 4], [0, 0]),
          rootPitchClasses: [7, 4],
          caption: 'One sharp, two homes: G major and E minor.',
        },
      ),
    ),
  ],

  'major-minor-triads': [
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('C4 Eb4 G4'), N('C4 Eb4 Gb4'), N('C4 E4 G#4')],
        N('C4 E4 G4 Eb4 Gb4 G#4'),
        `Chord symbols are shorthand for a stack of thirds. Play **C** (C–E–G), **Cm** (C–E♭–G), **C°** (C–E♭–G♭), and **C+** (C–E–G♯). On piano, only the third and fifth move. On guitar, C is \`x 3 2 0 1 0\`, Cm is \`x 3 5 5 4 3\`, C° is \`x x 5 4 2 x\`, and C+ is \`x 3 2 1 1 0\`. Lead sheets place these symbols above the melody; the symbol tells you the quality before you choose a voicing.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.85,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: 'C, Cm, C°, C+: the symbol names the quality.',
        },
      ),
    ),
  ],

  'diminished-augmented': [
    demo(
      2,
      progression(
        [N('B3 D4 F4'), N('C4 E4 G4'), N('C4 E4 G#4'), N('A3 C4 E4')],
        N('B3 D4 F4 C4 E4 G4 G#4 A3'),
        `In C major the diatonic diminished chord is **vii°**, B–D–F, and it pulls to C. Play **B°–C**. The augmented triad is chromatic: **C–E–G♯** appears on the third degree of A harmonic minor and resolves to A minor. On piano, B° is all white keys, while C+ needs the black key G♯. On guitar, B° is \`x x 4 3 1 x\`, C is \`x 3 2 0 1 0\`, and C+ is \`x 3 2 1 1 0\`.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.85,
          guitarSpots: spots([2, 4], [1, 3], [0, 1]),
          rootPitchClasses: [11],
          caption: 'vii° lives in the key; augmented triads are usually chromatic.',
        },
      ),
    ),
  ],

  'chord-inversions': [
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('E4 G4 C5'), N('G4 C5 E5')],
        N('C4 E4 G4 C5 E5'),
        `Figured bass counts intervals above the bass. Play **C** root position (5/3), **C/E** first inversion (6), and **C/G** second inversion (6/4). On piano, keep the same three chord tones and rotate which one is lowest. On guitar, C is \`x 3 2 0 1 0\`, C/E is \`x 7 5 5 8 x\`, and C/G is \`3 3 2 0 1 0\`. A figure describes the bass intervals, not the chord quality.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0],
          caption: 'Root position 5/3, first inversion 6, second inversion 6/4.',
        },
      ),
    ),
  ],

  'diatonic-chords': [
    demo(
      2,
      progression(
        [
          N('C4 E4 G4'),
          N('A3 C4 E4'),
          N('F3 A3 C4'),
          N('G3 B3 D4'),
          N('D4 F#4 A4'),
          N('B3 D4 F#4'),
          N('G3 B3 D4'),
          N('A3 C#4 E4'),
        ],
        N('C3 A2 F2 G2 D3 B2 G2 A2'),
        `Roman numerals describe function relative to the key, so the same progression transposes instantly. **I–vi–IV–V** is C–Am–F–G in C and D–Bm–G–A in D. Uppercase means major, lowercase means minor, and ° means diminished. On piano, play both versions and watch the same shape move to a new starting key. On guitar, the roots are A string 3rd fret, open A, low E 1st fret, low E 3rd fret for C; open D, A string 2nd fret, low E 3rd fret, open A for D.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.7,
          guitarSpots: spots([4, 3], [4, 0], [5, 1], [5, 3], [3, 0], [4, 2], [5, 3], [4, 0]),
          rootPitchClasses: [0, 9, 5, 7, 2, 11],
          caption: 'I–vi–IV–V in C, then the same numerals in D.',
        },
      ),
    ),
  ],

  'natural-minor': [
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('C4 Eb4 G4'), N('A3 C4 E4')],
        N('C4 E4 G4 Eb4 A3'),
        `**Relative minor** shares a signature; **parallel minor** shares a tonic. C major and A minor are relative: same white keys, different home. C major and C minor are parallel: same tonic, but E becomes E♭, A becomes A♭, and B becomes B♭. On piano, play C–Cm–Am and hear one key move in the middle of the first change. On guitar, C is \`x 3 2 0 1 0\` and Cm is \`x 3 5 5 4 3\`; Am is \`x 0 2 2 1 0\`.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.85,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0, 9],
          caption: 'Relative shares a signature; parallel shares a tonic.',
        },
      ),
    ),
  ],

  'harmonic-melodic-minor': [
    demo(
      2,
      line(
        N('E4 F4 G4 A4 E4 F4 G#4 A4 E4 F#4 G#4 A4'),
        `Compare the upper tetrachord of A minor in its three forms. **Natural:** E–F–G–A. **Harmonic:** E–F–G♯–A, where G♯ becomes the leading tone and makes E major available. **Melodic ascending:** E–F♯–G♯–A, which avoids the augmented second between F and G♯. On piano, G♯ and F♯ are black keys. On guitar, they are one fret above G and F. Choose natural for modal colour, harmonic for a strong V–i, and melodic for a smooth rising line.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([0, 0], [0, 1], [0, 3], [0, 5], [0, 4], [0, 2]),
          rootPitchClasses: [9],
          caption: 'Natural, harmonic, melodic: the sixth and seventh decide the colour.',
        },
      ),
    ),
  ],

  'minor-progressions': [
    demo(
      2,
      progression(
        [N('A3 C4 E4'), N('D4 F4 A4'), N('E4 G#4 B4'), N('A3 C#4 E4')],
        N('A3 C4 E4 D4 F4 G#4 B4 C#4'),
        `The **Picardy third** raises the final tonic triad from minor to major. Play **Am–Dm–E–A**: the last chord changes C to C♯ and turns the ending bright. On piano, the third of the final chord moves up one key. On guitar, Am is \`x 0 2 2 1 0\` and A is \`x 0 2 2 2 0\`; only the B string moves. In major keys, ♭VI and ♭VII are borrowed from the parallel minor for the same kind of colour shift.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.85,
          guitarSpots: shape('x 0 2 2 1 0'),
          rootPitchClasses: [9, 2, 4],
          caption: 'Picardy third: the final i becomes I.',
        },
      ),
    ),
  ],

  'grand-staff-reading': [
    demo(
      2,
      line(
        N('C3 G3 E4 C5'),
        `Before playing, run the pre-read: name the key, scan the rhythm, find the highest and lowest notes, and mark the hard bar. This two-hand chunk puts **C3–G3** in the left hand and **E4–C5** in the right. On piano, read the bass clef and treble clef as one continuous space. On guitar, the same notes are A string 3rd fret, D string 5th fret, open high E, and high E 8th fret. Five minutes of unfamiliar music a day beats an hour of repeating one piece.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.6,
          guitarSpots: spots([4, 3], [3, 5], [0, 0], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Read the bass and treble as one map, then play without stopping.',
        },
      ),
    ),
  ],

  'diatonic-functions': [
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('A3 C4 E4'), N('F3 A3 C4'), N('D4 F4 A4')],
        N('C3 A2 F2 D3'),
        `**vi** can substitute for **I** because it shares two notes: C major is C–E–G and A minor is A–C–E. **ii** can substitute for **IV** because D minor is D–F–A and F major is F–A–C. Play **C–Am–F–Dm** and hear how the substitutions soften the journey without leaving the key. On piano, keep the common tones and move the other voices by step. On guitar, C to Am keeps two open strings; F to Dm keeps F and A.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.8,
          guitarSpots: spots([4, 3], [4, 0], [5, 1], [3, 0]),
          rootPitchClasses: [0, 9, 5, 2],
          caption: 'vi substitutes for I; ii substitutes for IV.',
        },
      ),
    ),
  ],

  'cadences-ii-v-i': [
    demo(
      2,
      progression(
        [N('G2 D4 F4 B4'), N('C3 C4 E4 C5')],
        N('G2 D4 F4 B4 C3 C4 E4 C5'),
        `Voice-lead **G7 to C** one line at a time. The leading tone **B** rises to **C**; the seventh **F** falls to **E**; **D** falls to **C**; the bass **G** falls to **C**. On piano, play the four voices together and listen for each resolution. On guitar, G7 is \`3 2 0 0 0 1\` and C is \`x 3 2 0 1 0\`. The fifth can be omitted, which is why the final chord may double the root instead of containing G.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.8,
          guitarSpots: spots([5, 3], [4, 3]),
          rootPitchClasses: [7, 0],
          caption: 'G7 → C: B rises, F falls, the bass drops a fifth.',
        },
      ),
    ),
  ],

  'seventh-chords': [
    demo(
      1,
      progression(
        [N('B3 F4'), N('C4 E4')],
        N('B3 F4 C4 E4'),
        `The engine inside **G7** is the tritone **B–F**. Play the two notes together, then resolve them outward to **C–E**. On piano, B3 is just below middle C and F4 is above it; the interval contracts into a third. On guitar, B3 is the G string 4th fret, F4 the high E 1st fret, C4 the B string 1st fret, and E4 the open high E. The same tritone can resolve inward instead, which is why diminished and dominant chords can point in more than one direction.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.85,
          guitarSpots: spots([2, 4], [0, 1], [1, 1], [0, 0]),
          rootPitchClasses: [0],
          caption: 'B–F resolves to C–E: the tritone engine of V7.',
        },
      ),
    ),
  ],

  'seven-modes': [
    demo(
      1,
      line(
        N('C4 F#4 C4 Bb4 C4 Ab4'),
        `Each mode is a major scale with one or more altered degrees. Play **C–F♯** for Lydian's raised fourth, **C–B♭** for Mixolydian's lowered seventh, and **C–A♭** for Aeolian's lowered sixth. On piano, F♯, B♭, and A♭ are the black keys that create those colours. On guitar, C4 is the B string 1st fret, F♯4 the high E 2nd, B♭4 the 6th, and A♭4 the 4th. The characteristic note is what your ear remembers, not the whole scale.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.65,
          guitarSpots: spots([1, 1], [0, 2], [0, 6], [0, 4]),
          rootPitchClasses: [0],
          caption: 'Lydian ♯4, Mixolydian ♭7, Aeolian ♭6: one degree changes the mode.',
        },
      ),
    ),
  ],

  'modal-ear': [
    demo(
      2,
      line(
        N('D4 E4 F4 G4 A4 B4 A4 G4 F4 E4 D4'),
        `Set a **D** drone or a Dm–G vamp, then improvise with D Dorian: D–E–F–G–A–B–C. Aim for the tonic **D** and the characteristic **B natural**, not a scale run. This phrase rises to B and returns home. On piano, use only white keys but treat D as the centre. On guitar, D4 is the D string 12th fret, E4 the open high E, F4 the 1st fret, G4 the 3rd, A4 the 5th, and B4 the 7th. Sing D first, then land on B.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.5,
          guitarSpots: spots([3, 12], [0, 0], [0, 1], [0, 3], [0, 5], [0, 7]),
          rootPitchClasses: [2],
          caption: 'D Dorian: improvise toward D and the natural sixth, B.',
        },
      ),
    ),
  ],

  'melodic-dictation': [
    demo(
      1,
      line(
        N('C4 D4 E4 F4 G4 F4 E4 D4 C4'),
        `Hear the phrase in chunks, not as nine separate events. The first phrase rises **C–D–E–F**; the answer turns back **G–F–E–D–C**. Clap the rhythm first, then name the pitches. On piano, the first chunk is all white keys under the right hand. On guitar, the phrase sits on the B string 1st and 3rd frets and the high E open, 1st, and 3rd. Strong beats are the scaffold; the passing notes hang from them.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 1], [0, 3], [0, 1], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Chunk by beat, write the rhythm first, then the pitches.',
        },
      ),
    ),
  ],

  'chord-progression-recognition': [
    demo(
      2,
      progression(
        [N('G3 B3 D4'), N('C4 E4 G4'), N('F3 A3 C4'), N('C4 E4 G4'), N('G3 B3 D4'), N('A3 C4 E4')],
        N('G2 C3 F2 C3 G2 A2'),
        `Listen only to the last two chords of each phrase. **G–C** is an authentic cadence; **F–C** is plagal; **G–Am** is deceptive. On piano, play the three pairs and name the punctuation before you name the chords. On guitar, the bass roots are low E 3rd fret, A string 3rd fret, low E 1st fret, A string 3rd fret, low E 3rd fret, and open A. Cadence spotting turns full-progression dictation into a manageable habit.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.8,
          guitarSpots: spots([5, 3], [4, 3], [5, 1], [4, 3], [5, 3], [4, 0]),
          rootPitchClasses: [7, 0, 5, 9],
          caption: 'Authentic, plagal, deceptive: name the final two chords first.',
        },
      ),
    ),
  ],

  'rhythmic-dictation': [
    demo(
      2,
      pulse(
        rhythm(1, 0.5, 0.5, 2, 1, 0.5, 0.5, 2),
        N('G3'),
        `Use the four-step dictation routine: listen once for the pulse, listen again and clap, write the rhythm, then check by tapping your notation. This two-bar pattern is quarter, two eighths, half | quarter, two eighths, half. Count **1 & 2 & 3 & 4 &** aloud while you clap. On piano, play G3 on every event; on guitar, the open G string. Five short dictations a day beat one long marathon.`,
        {
          tempo: 0.45,
          guitarSpots: spots([2, 0]),
          rootPitchClasses: [7],
          caption: 'Two bars of 4/4: write the grid before the notes.',
        },
      ),
    ),
  ],

  'voice-leading-principles': [
    demo(
      2,
      progression(
        [N('C3 G3 C4 E4'), N('C3 A3 C4 F4'), N('B2 G3 B3 D4'), N('C3 G3 C4 E4')],
        N('C3 G3 C4 E4 A3 F4 B2 B3 D4'),
        `Good voicings keep common tones and move the other voices by step. In **C–F–G/B–C**, C stays common, G moves to A, E moves to F, and the bass walks C–C–B–C. On piano, play the four voices and watch each line rather than jumping between chord shapes. On guitar, use C, F, G/B, and C and listen to the top note; the smoother the top line, the more the progression sounds composed rather than strummed.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: spots([4, 3], [5, 1], [4, 2], [4, 3]),
          rootPitchClasses: [0, 5, 7],
          caption: 'Common tones stay; other voices move by step.',
        },
      ),
    ),
  ],

  'part-writing-doubling': [
    demo(
      2,
      line(
        N('B3 C4 F4 E4 D4 C4'),
        `Resolve tendency tones deliberately. The leading tone **B3** rises to **C4**; the seventh **F4** falls to **E4**; the fifth **D4** falls to **C4**. Play each pair, then combine them. On piano, hold the destination note and listen for the pull. On guitar, B3 is the G string 4th fret, C4 the B string 1st, F4 the high E 1st, E4 the open high E, and D4 the B string 3rd. Breaking these resolutions may still sound plausible, but the cadence loses its grip.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.7,
          guitarSpots: spots([2, 4], [1, 1], [0, 1], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Leading tone up, seventh down: tendency tones resolve by step.',
        },
      ),
    ),
  ],

  'secondary-dominants': [
    demo(
      0,
      progression(
        [
          N('D4 F#4 A4'),
          N('G3 B3 D4'),
          N('E4 G#4 B4 D5'),
          N('A3 C4 E4'),
          N('A3 C#4 E4 G4'),
          N('D4 F4 A4'),
        ],
        N('D3 G2 E3 A2 A2 D3'),
        `Any diatonic chord can be preceded by its own dominant. **V/V** is D major to G, **V7/vi** is E7 to A minor, and **V7/ii** is A7 to D minor. The raised third of each secondary dominant — F♯, G♯, C♯ — is the accidental that gives it away. On piano, play each pair and listen for the local leading tone. On guitar, D \`x x 0 2 3 2\`, G \`3 2 0 0 0 3\`, E7 \`0 2 0 1 0 0\`, Am \`x 0 2 2 1 0\`, A7 \`x 0 2 0 2 0\`, Dm \`x x 0 2 3 1\`.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: spots([3, 0], [5, 3], [3, 2], [4, 0], [4, 0], [3, 0]),
          rootPitchClasses: [2, 7, 4, 9],
          caption: 'V/V, V7/vi, V7/ii: a local dominant for three different targets.',
        },
      ),
    ),
  ],

  'modulation-tonicization': [
    demo(
      2,
      progression(
        [N('C4 E4 G4'), N('E4 G#4 B4 D5'), N('A3 C4 E4'), N('D4 F#4 A4 C5'), N('G3 B3 D4')],
        N('C3 E3 A2 D3 G2'),
        `Analyse in three questions: which key is active, which chord is the local dominant, and is a new tonic confirmed? In **C–E7–Am**, E7 tonicses A minor for a moment: label it **V7/vi**. Then **D7–G** strongly tonicises G; a continued G tonic would confirm a full modulation. On piano, G♯ and F♯ are the accidentals to track. On guitar, the bass roots are A string 3rd fret, D string 2nd fret, open A, open D, and low E 3rd fret.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: spots([4, 3], [3, 2], [4, 0], [3, 0], [5, 3]),
          rootPitchClasses: [0, 4, 9, 2, 7],
          caption: 'Tonicisation colours a chord; modulation confirms a new tonic.',
        },
      ),
    ),
  ],

  'species-counterpoint': [
    demo(
      1,
      progression(
        [N('C4 E4'), N('D4 F4'), N('E4 G4'), N('C4 A4'), N('D4 B4'), N('C4 C5')],
        N('C4 E4 D4 F4 E4 G4 C4 A4 D4 B4 C4 C5'),
        `Perfect consonances frame a first-species line; imperfect consonances carry the motion. Play the dyads **C–E**, **D–F**, **E–G**, **C–A**, **D–B**, and **C–C5**: major third, minor third, minor third, major sixth, major sixth, octave. On piano, play one dyad per count and name each interval. On guitar, put the lower voice on the B string and the upper voice on the high E string. Approach the final octave by contrary or oblique motion, never by parallel fifths or octaves.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: spots([1, 1], [0, 0], [1, 3], [0, 1], [0, 0], [0, 3], [1, 1], [0, 5], [1, 3], [0, 7], [1, 1], [0, 8]),
          rootPitchClasses: [0],
          caption: 'Thirds and sixths carry motion; perfect intervals frame the phrase.',
        },
      ),
    ),
  ],

  'imitation-canon': [
    demo(
      2,
      line(
        N('C4 D4 E4 G4 G4 A4 B4 D5 G3 A3 B3 D4'),
        `Build a canon from a two-bar motive. Play **C–D–E–G**, answer it a fifth higher with **G–A–B–D**, then answer a fourth below with **G–A–B–D** in the lower octave. On piano, play each line alone before overlapping the entries. On guitar, the first motive is B string 1st and 3rd frets plus high E open and 3rd; the fifth answer moves to high E 3rd, 5th, 7th, and 10th. Check every vertical interval and every voice crossing.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([1, 1], [1, 3], [0, 0], [0, 3], [0, 3], [0, 5], [0, 7], [0, 10], [3, 5], [3, 7], [2, 4], [1, 3]),
          rootPitchClasses: [0, 7],
          caption: 'Motive, answer at the fifth, answer at the fourth below.',
        },
      ),
    ),
  ],

  'phrase-period-form': [
    demo(
      2,
      line(
        N('E4 D4 C4 D4 E4 F4 G4 E4 D4 C4 D4 E4 D4 C4'),
        `Label by function, not by bar count. The antecedent **E–D–C–D–E–F–G** ends on G, the dominant, so it is an **A** phrase with a half cadence. The consequent **E–D–C–D–E–D–C** ends on C, so it is **A′** with an authentic cadence. On piano, hold the final note of each phrase and listen to the punctuation. On guitar, the whole example sits on the high E and B strings. The label should describe what you hear: new texture, new key, new cadence.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.55,
          guitarSpots: spots([0, 0], [1, 3], [1, 1], [1, 3], [0, 0], [0, 1], [0, 3], [0, 0], [1, 3], [1, 1], [1, 3], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'A (half cadence) – A′ (authentic cadence).',
        },
      ),
    ),
  ],

  'sonata-large-forms': [
    demo(
      1,
      line(
        N('G4 A4 B4 D5 C4 D4 E4 G4'),
        `The second theme first appears in the dominant. Play its shape **1–2–3–5** in G: **G–A–B–D**. In the recapitulation the same shape returns in the home key: **C–D–E–G**. On piano, hear G become the temporary home, then C reclaim it. On guitar, the G version is high E 3rd, 5th, 7th, and 10th frets; the C version is B string 1st and 3rd plus high E open and 3rd. That key journey is the form.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          tempo: 0.65,
          guitarSpots: spots([0, 3], [0, 5], [0, 7], [0, 10], [1, 1], [1, 3], [0, 0], [0, 3]),
          rootPitchClasses: [7, 0],
          caption: 'Second theme in the dominant, then home in the recapitulation.',
        },
      ),
    ),
  ],

  'reharmonization-capstone': [
    demo(
      2,
      progression(
        [
          N('C4 E4 G4'),
          N('A3 C4 E4'),
          N('F3 A3 C4'),
          N('G3 B3 D4'),
          N('D4 F4 A4 C5'),
          N('G3 B3 D4 F4'),
          N('C4 E4 G4 B4'),
          N('C4 E4 G4'),
          N('F3 Ab3 C4'),
          N('C4 E4 G4'),
        ],
        N('C3 A2 F2 G2 D3 G2 C3 C3 F2 C3'),
        `Harmonise the same melody three ways. **Diatonic:** C–Am–F–G, the I–vi–IV–V family. **Functional chromatic:** Dm7–G7–Cmaj7, a ii–V–I with sevenths resolving by step. **Modal colour:** C–Fm–C, where the borrowed minor iv adds A♭. On piano, play all three and notice how much “home” each version keeps. On guitar, the bass roots are A string 3rd fret, open A, low E 1st fret, low E 3rd fret, open D, low E 3rd fret, A string 3rd fret. Choose the version that tells the story you intend, then explain why.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          tempo: 0.75,
          guitarSpots: spots([4, 3], [4, 0], [5, 1], [5, 3], [3, 0], [5, 3], [4, 3], [4, 3], [5, 1], [4, 3]),
          rootPitchClasses: [0, 9, 5, 7, 2],
          caption: 'Diatonic, functional chromatic, modal colour: three harmonisations.',
        },
      ),
    ),
  ],
};

export const LESSON_INSTRUMENT_DEMOS: Record<string, LessonInstrumentDemo[]> = Object.fromEntries(
  Object.entries(CORE_LESSON_INSTRUMENT_DEMOS).map(([lessonId, demos]) => [
    lessonId,
    [...demos, ...(EXTRA_LESSON_INSTRUMENT_DEMOS[lessonId] ?? [])].sort(
      (a, b) => a.afterSection - b.afterSection,
    ),
  ]),
);
