import type { Course } from '../curriculum';
import { N, demo, line, progression, spots, type ExpansionDemo } from './demoHelpers';
import { earChords, lesson, melodyDictation, progressions, section, writtenIntervals } from './helpers';

const course: Course = {
  id: 'counterpoint-form-two',
  title: 'Counterpoint & Form II',
  subtitle: 'Florid lines, fugue, ground bass, and the large shapes of music.',
  level: 'advanced',
  glyph: '𝄆',
  color: '#7f9f7a',
  lessons: [
    lesson(
      'florid-invertible',
      'Florid & Invertible Counterpoint',
      'Combine species into a singing line, then turn the voices upside down.',
      12,
      [
        section(
          'Fourth and fifth species',
          `**Fourth species** adds syncopation and suspension: a note is held across the beat while the other voice moves, then resolves down by step. **Fifth species**, or florid counterpoint, combines all the earlier species into a free melodic line.

A florid line needs direction, not just correct intervals. Shape it with stepwise motion, a single climax, and clear cadential preparation. Dissonances are prepared, suspended, and resolved; they are not accidents.`,
        ),
        section(
          'Invertible counterpoint',
          `**Invertible counterpoint** still works when the voices swap. At the octave, a fifth becomes a fourth and a third becomes a sixth; at the tenth or twelfth the interval changes differently. The danger is that a legal interval becomes a forbidden parallel after inversion.

Before writing, test the vertical intervals in both positions. Keep perfect fifths and octaves out of the strong-beat framework, and make sure the bass remains a bass when it becomes the upper voice.`,
        ),
      ],
      [writtenIntervals(5, 'interval-id-florid'), melodyDictation(4, 'melody-dictation-florid')],
    ),
    lesson(
      'fugue-canon-ground',
      'Fugue, Canon & Ground Bass',
      'Subject, answer, episode, stretto — and the art of repeating a line.',
      13,
      [
        section(
          'Fugue',
          `A **fugue** begins with a **subject** in one voice. The **answer** enters in another voice, usually at the dominant; it may be **real** (exact transposition) or **tonal** (adjusted to stay in key). A **countersubject** accompanies the answer, and the **exposition** presents all voices.

**Episodes** develop motives and modulate. **Stretto** overlaps subject entries; a **pedal** holds the dominant or tonic beneath the counterpoint. Label the subject every time it returns — the form is a conversation, not a theme with accompaniment.`,
        ),
        section(
          'Canon and ground bass',
          `A **canon** repeats a line in imitation. The follower may be at the unison, octave, fifth, or another interval; it may also be **crab** (backwards), **mirror** (inverted), or **mensuration** (at a different speed). A **round** is a canon at the unison with a repeating cycle.

A **ground bass** repeats a short bass pattern while the upper voices vary. The **passacaglia** and **chaconne** are related forms. The bass is the foundation, but the interest comes from what changes above it.`,
        ),
      ],
      [melodyDictation(4, 'melody-dictation-fugue'), progressions(5, 'progression-ear-ground-bass')],
    ),
    lesson(
      'binary-ternary-rondo-variations',
      'Binary, Ternary, Rondo & Variations',
      'Map a piece by its returns, contrasts, and transformations.',
      12,
      [
        section(
          'Binary and ternary',
          `**Binary form** has two sections, usually repeated: A–B. It may be **simple** (the B section is new) or **rounded** (A returns at the end of B). **Ternary form** is A–B–A, with a full return of the opening.

Listen for the cadence that closes A and the key that opens B. In a **balanced binary** the second section mirrors the first; in a **rounded binary** the opening material returns before the final cadence.`,
        ),
        section(
          'Rondo and theme-and-variations',
          `A **rondo** alternates a refrain with contrasting episodes: ABACA, ABACABA, or a sonata-rondo. The refrain is the anchor; the episodes provide key and character contrast.

**Theme and variations** keeps a recognizable frame while changing rhythm, harmony, texture, mode, register, or orchestration. Name what stays constant before naming what changes. A variation that loses the theme entirely is a new piece, not a variation.`,
        ),
      ],
      [progressions(5, 'progression-ear-rondo'), earChords(4, 'chord-ear-variations', ['Major', 'Minor'])],
    ),
    lesson(
      'concerto-da-capo-programme',
      'Concerto, Da Capo & Programme Music',
      'Ritornello, aria, leitmotif, and the forms of songs and stories.',
      12,
      [
        section(
          'Concerto and da capo aria',
          `A **concerto** often uses **ritornello** form: the orchestra states a refrain, the soloist interrupts and expands it, and the refrain returns in different keys. A **cadenza** suspends the meter for solo display before the final tutti.

A **da capo aria** is A–B–A. The singer returns to A and ornaments it, so the repeat is not a copy. The form is built on contrast: affect, key, and texture change in B, then the opening returns transformed.`,
        ),
        section(
          'Programme music, leitmotif, and pop forms',
          `**Programme music** tells a story or paints a scene without words. A **leitmotif** is a short musical idea associated with a character, object, or idea; it can be transformed as the story changes.

Popular song forms are equally architectural: **verse–chorus–bridge**, **AABA**, **12-bar blues**, and **through-composed** forms. Label the sections by function and listen for the hook's return. A form is a promise about what will come back.`,
        ),
      ],
      [progressions(5, 'progression-ear-pop-forms'), melodyDictation(4, 'melody-dictation-leitmotif')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'florid-invertible': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 E4 D4 C4 B3 C4'),
        `A florid line over a C pedal: **C–D–E–F–E–D–C–B–C**. The passing tones fill the spaces between chord tones, and the line has one clear peak on F4. Play it on piano with a smooth legato. On guitar, use the B string at frets 1, 3, 5, 6, 5, 3, 1 and the open B string for B3 before returning to C4.`,
        {
          tempo: 0.45,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 6], [1, 5], [1, 3], [1, 1], [1, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Florid counterpoint: stepwise motion, one climax, clear return.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4'), N('E4 C5')],
        N('C4 E4 E4 C5'),
        `Invert the two voices: **C4–E4** becomes **E4–C5**. The third remains a sixth when inverted at the octave, so the counterpoint survives the swap. Play the dyad, then swap the hands. On guitar, play C4 on the B string 1st fret with E4 open, then E4 open with C5 on the B string 1st fret one octave higher.`,
        {
          tempo: 0.8,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [0, 0], [0, 0], [0, 8]),
          rootPitchClasses: [0, 4],
          caption: 'Invertible at the octave: the third becomes a sixth.',
        },
      ),
    ),
  ],
  'fugue-canon-ground': [
    demo(
      0,
      line(
        N('C4 D4 E4 G4 G4 A4 B4 D5'),
        `A fugue subject **C–D–E–G** is answered at the dominant as **G–A–B–D**. Play the subject, then the answer, then overlap them. On piano, give the subject to the left hand and the answer to the right. On guitar, the subject is B string 1, 3, 5 and high E 3; the answer is high E 3, 5, 7, 10.`,
        {
          tempo: 0.55,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [0, 3], [0, 3], [0, 5], [0, 7], [0, 10]),
          rootPitchClasses: [0, 7],
          caption: 'Subject and answer: the same shape at the dominant.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C3 E3 G3'), N('G3 B3 D4'), N('A3 C4 E4'), N('F3 A3 C4')],
        N('C3 E3 G3 G3 B3 D4 A3 C4 E4 F3 A3 C4'),
        `A **ground bass** repeats **C–G–A–F** while the chords change above it. This is the harmonic frame of countless passacaglias and pop songs. Play the bass line with the left hand and the chords with the right. On guitar, play the roots on the low E and A strings and let the upper strings ring.`,
        {
          tempo: 0.7,
          pianoStart: 36,
          pianoEnd: 72,
          guitarSpots: spots([4, 3], [5, 3], [4, 0], [5, 1]),
          rootPitchClasses: [0, 7, 9, 5],
          caption: 'Ground bass: a repeating foundation under changing harmony.',
        },
      ),
    ),
  ],
  'binary-ternary-rondo-variations': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('A3 C4 E4'), N('C4 E4 G4')],
        N('C4 E4 G4 G3 B3 D4 A3 C4 E4 C4 E4 G4'),
        `A **rounded binary** shape: A opens with C, B moves to G and Am, and A returns at the end. Play the four chords and listen for the homecoming. On guitar, use C, G, Am, and C shapes; the return of the first chord is the form's signal, not just another chord.`,
        {
          tempo: 0.75,
          guitarSpots: spots([4, 3], [5, 3], [4, 0], [4, 3]),
          rootPitchClasses: [0, 7, 9],
          caption: 'Rounded binary: the opening returns before the final cadence.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('C4 E4 A4'), N('C4 E4 G4'), N('C4 F4 A4')],
        N('C4 E4 G4 C4 E4 A4 C4 E4 G4 C4 F4 A4'),
        `A **rondo** refrain returns between contrasting episodes. Play **C–C–C–F** as a miniature ABACA frame: the C chord is the refrain, and the A minor and F colours are the episodes. On guitar, keep the C shape as the anchor and move only the upper voices.`,
        {
          tempo: 0.75,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [3, 2], [2, 2], [1, 1], [3, 3], [2, 2], [1, 1]),
          rootPitchClasses: [0, 9, 5],
          caption: 'Rondo: the refrain returns, the episodes contrast.',
        },
      ),
    ),
  ],
  'concerto-da-capo-programme': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('A3 C4 E4'), N('F3 A3 C4'), N('C4 E4 G4')],
        N('C4 E4 G4 G3 B3 D4 A3 C4 E4 F3 A3 C4 C4 E4 G4'),
        `A **ritornello** frame: the orchestra states C, the solo episode moves through G and Am, and the refrain returns at the end. Play the progression and mark each return of C. On guitar, use open shapes and let the final C ring. The form is the pattern of returns, not the chord list alone.`,
        {
          tempo: 0.7,
          guitarSpots: spots([4, 3], [5, 3], [4, 0], [5, 1], [4, 3]),
          rootPitchClasses: [0, 7, 9, 5],
          caption: 'Ritornello: refrain, episode, refrain.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('C4 E4 G4'), N('A3 C4 E4'), N('F3 A3 C4'), N('C4 E4 G4')],
        N('C4 E4 G4 B♭3 F4 A4 E♭4 D4 B3'),
        `A **12-bar blues** uses three chords: I, IV, and V. In C that is **C7–F7–G7**. Play the first four bars on C, the next two on F, then return to C before the turnaround. On guitar, use dominant-seventh shapes and keep a steady shuffle. The form is a fixed map for improvisation.`,
        {
          tempo: 0.7,
          guitarSpots: spots([4, 3], [3, 2], [2, 3], [1, 1], [0, 0], [5, 1], [4, 3], [3, 1], [2, 2], [1, 1], [5, 3], [4, 5], [3, 3], [2, 4], [1, 3], [4, 3], [3, 2], [2, 3], [1, 1]),
          rootPitchClasses: [0, 5, 7],
          caption: 'Twelve-bar blues: I–IV–I–V–I, a fixed frame for improvisation.',
        },
      ),
    ),
  ],
};

export const counterpointFormCourse = course;
export const counterpointFormDemos = demos;
