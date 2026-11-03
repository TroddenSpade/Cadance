import type { Course } from '../curriculum';
import { N, chord, demo, line, progression, spots, type ExpansionDemo } from './demoHelpers';
import { lesson, melodyDictation, progressions, section, earChords } from './helpers';

const course: Course = {
  id: 'melody-texture',
  title: 'Melody & Texture',
  subtitle: 'Non-chord tones, motives, countermelody, and the surface of a phrase.',
  level: 'intermediate',
  glyph: '𝄐',
  color: '#9a8fc4',
  lessons: [
    lesson(
      'non-chord-tones',
      'Non-Chord Tones',
      'Name every note that is not part of the chord — and hear how it resolves.',
      11,
      [
        section(
          'The vocabulary of decoration',
          `A **non-chord tone** is a melodic note that does not belong to the harmony at that moment. The common types are:

- **Passing tone:** steps between two chord tones.
- **Neighbour tone:** steps away and returns.
- **Escape tone:** steps away, then leaps to a chord tone in the opposite direction.
- **Appoggiatura:** approached by leap, resolved by step.
- **Suspension:** held from the previous chord, then resolved downward by step.
- **Retardation:** like a suspension, but resolved upward.
- **Anticipation:** arrives before the chord it belongs to.
- **Pedal:** held while the harmony changes around it.`,
        ),
        section(
          'Analysis by preparation and resolution',
          `Label a non-chord tone by asking three questions: How was it approached? Is it accented or unaccented? How does it resolve?

Strong-beat dissonances usually resolve by step and demand attention. Weak-beat passing and neighbour tones decorate without changing the harmony. A suspension has three stages — preparation, suspension, resolution — and is written with a figured-bass interval such as 4–3 or 7–6.`,
        ),
      ],
      [melodyDictation(4, 'melody-dictation-nct'), progressions(5, 'progression-ear-nct')],
    ),
    lesson(
      'contour-motive',
      'Contour, Motive & Sequence',
      'Shape a line, then develop it with the smallest possible idea.',
      10,
      [
        section(
          'Contour and phrase shape',
          `**Contour** is the graphic shape of a melody: ascending, descending, arch, inverted arch, or wave. **Conjunct** motion moves by step; **disjunct** motion leaps. A melody that climbs and then falls feels closed; one that ends higher feels open.

Mark the highest and lowest points, the climax, and the cadence. Those three landmarks explain more about a phrase than a note-by-note list.`,
        ),
        section(
          'Motivic development',
          `A **motive** is a short rhythmic and melodic cell. Composers develop it by **repetition**, **sequence** (restatement at a new pitch), **inversion** (upside down), **retrograde** (backwards), **augmentation** (longer values), **diminution** (shorter values), and **fragmentation** (using only part of it).

A sequence is not a new idea; it is the same idea in a new position. Label the transformation so you can hear the family resemblance rather than a string of unrelated tunes.`,
        ),
      ],
      [melodyDictation(4, 'melody-dictation-contour'), earChords(4, 'chord-ear-motive', ['Major', 'Minor'])],
    ),
    lesson(
      'harmonization-texture',
      'Harmonizing, Countermelody & Texture',
      'Choose chords for a tune, add a second line, and name the fabric.',
      12,
      [
        section(
          'Harmonizing a melody',
          `Start with the melody's strong-beat notes and match them to chord tones. A bass line that moves by step or by fifth gives the progression direction; the inner voices fill in. Keep the melody's contour intact and let non-chord tones fall on weak beats.

The same tune can support different harmonies. **Diatonic** choices stay in the key; **modal mixture** borrows from the parallel minor; **reharmonization** changes the chord under a familiar note. Always sing the melody against the new chord before committing.`,
        ),
        section(
          'Countermelody, texture, and phrase',
          `A **countermelody** is a second line that is interesting on its own but subordinate to the main tune. Use contrary motion, rhythmic complement, and a different register. Avoid competing climaxes.

**Texture** describes how the lines are combined: **monophony** (one line), **homophony** (melody plus accompaniment), **polyphony** (independent lines), and **heterophony** (simultaneous variants of one line). **Phrase rhythm** describes how phrases overlap, elide, or expand. In vocal music, **prosody** is the fit between stressed syllables and musical accents.`,
        ),
      ],
      [progressions(5, 'progression-ear-harmonization'), melodyDictation(4, 'melody-dictation-countermelody')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'non-chord-tones': [
    demo(
      0,
      line(
        N('C4 D4 E4 D4 C4'),
        `Over a C major chord, **D4** is a passing tone between C4 and E4, and the second D4 is a neighbour tone returning to C4. Play **C–D–E–D–C** on piano and hold the C chord in the left hand. On guitar, play the same line on the B string at frets 1, 3, 5, 3, 1 while letting the open G and high E strings ring as the chord.`,
        {
          tempo: 0.55,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 3], [1, 1]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Passing D between C and E; neighbour D returns to C.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('G4 F4 E4 D4 C4'),
        `A **suspension** holds a note from the previous chord before resolving down. Play **G–F–E** over a C chord: G is the preparation, F is the suspended fourth, and E is the resolution. On piano, hold the C chord and let the top voice move. On guitar, use the high E string at frets 3, 1, and 0; the final E belongs to the chord.`,
        {
          tempo: 0.85,
          guitarSpots: spots([0, 3], [0, 1], [0, 0]),
          rootPitchClasses: [0, 4, 7],
          caption: '4–3 suspension: preparation, suspension, stepwise resolution.',
        },
      ),
    ),
  ],
  'contour-motive': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4 A4 G4 F4 E4 D4 C4'),
        `Trace the **arch**: the line rises from C4 to A4, then falls back to C4. Play it on piano with a single crescendo to the peak and a diminuendo on the way down. On guitar, use the B string for the lower half and the high E string for the top, or stay on the high E from the 8th fret upward. The contour, not the speed, is what the listener remembers.`,
        {
          tempo: 0.42,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 6], [1, 8], [1, 10], [1, 8], [1, 6], [1, 5], [1, 3], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Arch contour: one climax, then a stepwise return.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 E4 G4 D4 E4 F♯4 A4'),
        `The motive **C–D–E–G** is repeated a step higher as **D–E–F♯–A**. That is a **sequence**. Play both cells on piano and notice that the shape is identical even though the pitches changed. On guitar, the first cell is B string 1, 3, 5 and high E 3; the second is B string 3, 5, 7 and high E 5.`,
        {
          tempo: 0.5,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [0, 3], [1, 3], [1, 5], [1, 7], [0, 5]),
          rootPitchClasses: [0, 2],
          caption: 'Sequence: the same motive restated one step higher.',
        },
      ),
    ),
  ],
  'harmonization-texture': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('A3 C4 E4'), N('F3 A3 C4'), N('G3 B3 D4')],
        N('C4 D4 E4 D4 A3 F3 G3'),
        `Harmonize **C–D–E–D** with **C–Am–F–G**. On the strong beats the melody notes are chord tones: C over C, E over Am, E over F, D over G. The passing D on beat 2 is a non-chord tone. Play the progression on piano with the melody on top; on guitar, use open C, Am, F, and G shapes and let the melody note ring on the top string.`,
        {
          tempo: 0.75,
          guitarSpots: spots([4, 3], [4, 0], [5, 1], [5, 3]),
          rootPitchClasses: [0, 9, 5, 7],
          caption: 'Strong-beat chord tones, weak-beat passing motion.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 E4 G4 B4 D5'),
        `**Texture** is the fabric made by the lines. A single C–E–G–B–D5 stack is **homophonic** when the melody sits on top and the lower notes accompany it; it becomes **polyphonic** when each voice moves independently. Play the stack on piano, then arpeggiate it slowly on guitar from the A string 3rd fret to the high E 3rd fret. Name what you hear before you name the chord.`,
        {
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 0], [0, 3]),
          rootPitchClasses: [0, 4, 7, 11, 2],
          caption: 'A chord is a vertical slice; texture is how the slice is lived.',
        },
      ),
    ),
  ],
};

export const melodyCourse = course;
export const melodyDemos = demos;
