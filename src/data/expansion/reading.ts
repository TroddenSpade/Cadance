import type { Course } from '../curriculum';
import { N, chord, demo, line, shape, spots, type ExpansionDemo } from './demoHelpers';
import {
  chordStaff,
  earIntervals,
  findNote,
  keySigs,
  lesson,
  melodyDictation,
  n,
  noteReading,
  progressions,
  rhythmCount,
  section,
  treble,
  writtenIntervals,
  buildChords,
} from './helpers';

const course: Course = {
  id: 'reading-the-score',
  title: 'Reading the Score',
  subtitle: 'Clefs, expression, ornaments, and the maps professionals read from.',
  level: 'beginner',
  glyph: '𝄡',
  color: '#d08c60',
  lessons: [
    lesson(
      'alto-tenor-clefs',
      'Alto & Tenor Clefs',
      'Move the C clef and unlock viola, cello, bassoon, and trombone parts.',
      9,
      [
        section(
          'One clef, two homes',
          `The **C clef** points at middle C. Put it on the third line and you have the **alto clef**, the viola's home. Put it on the fourth line and you have the **tenor clef**, used by cello, bassoon, and trombone.

Alto-clef lines from bottom to top are **F–A–C–E–G**; the spaces are **G–B–D–F**. Tenor-clef lines are **D–F–A–C–E**; the spaces are **E–G–B–D**. In both clefs the marked line is C4, so every other note is measured from that landmark.`,
        ),
        section(
          'Reading by interval, not by poem',
          `Do not memorize a new mnemonic for every clef. Find C4 on the clef's middle line, then step up or down by line and space. A third above C4 is E4; a fifth below is F3.

When a passage switches clefs, keep your attention on the register. The same pitch can appear in treble, alto, or tenor clef, but its staff position changes. Instrumentalists often read two clefs in one piece — cellists switch between bass and tenor, and bassoonists between bass and tenor.`,
        ),
      ],
      [
        noteReading(8, 'note-reading-alto-tenor', 'both'),
        writtenIntervals(5, 'interval-id-clefs'),
      ],
    ),
    lesson(
      'expression-marks',
      'Dynamics, Articulation & Tempo',
      'Read the instructions that turn correct notes into music.',
      9,
      [
        section(
          'Dynamics and articulation',
          `**Dynamics** tell you how loud: *piano* (soft), *mezzo-piano*, *mezzo-forte*, *forte* (loud), and the extremes *ppp* and *fff*. A **crescendo** grows; a **diminuendo** fades.

**Articulation** tells you how a note begins and ends. *Staccato* is detached, *legato* is connected, an *accent* leans into the attack, *marcato* is strongly marked, and a *tenuto* line asks for full value. A **slur** connects different notes; a **tie** joins two notes of the same pitch into one longer sound.`,
        ),
        section(
          'Tempo and character',
          `Tempo is measured in **beats per minute**, but scores usually name a character instead: *adagio* (slow), *andante* (walking), *moderato* (moderate), *allegro* (fast), *presto* (very fast). Changes have names too: *ritardando* slows, *accelerando* speeds up, *rubato* borrows time and gives it back, and a *fermata* holds a note beyond its written value.

Treat these marks as phrasing decisions, not decoration. The same four notes can be a march, a lullaby, or a sigh depending on dynamics, articulation, and tempo.`,
        ),
      ],
      [rhythmCount(8, 'rhythm-count-expression'), earIntervals(5, 'interval-ear-expression', [2, 3, 4, 5, 7, 12])],
    ),
    lesson(
      'ornaments',
      'Ornaments & Grace Notes',
      'Trills, mordents, turns, and the art of adding without crowding.',
      10,
      [
        section(
          'The standard ornaments',
          `An **ornament** decorates a principal note. A **trill** alternates quickly with the note above. A **mordent** flicks to the neighbour and back. A **turn** circles the main note from above and below. An **appoggiatura** takes time from the principal note; an **acciaccatura** is a quick grace note crushed before it.

Ornaments were partly improvised in the Baroque and are written out more precisely in later music. In exams and editions, realize them in the style of the period rather than at random.`,
        ),
        section(
          'Ornamenting without clutter',
          `An ornament should clarify the line, not hide it. Put it on a long note, at a cadence, or where the melody needs energy. Keep the main beat audible and return to the principal pitch cleanly.

In jazz and popular music the same instinct appears as **fills**, **bends**, **slides**, and **vibrato**. The notation changes; the job does not: decorate a structural note without losing the phrase.`,
        ),
      ],
      [writtenIntervals(5, 'interval-id-ornaments'), melodyDictation(3, 'melody-dictation-ornaments')],
    ),
    lesson(
      'repeats-tab-lead-sheets',
      'Repeats, Tablature & Lead Sheets',
      'Navigate a score, read a fretboard map, and follow a chord chart.',
      10,
      [
        section(
          'Finding your way through a score',
          `A **repeat sign** sends you back to the matching sign or the beginning. **First and second endings** tell you what to play on each pass. **D.C.** (*da capo*) means go back to the top; **D.S.** (*dal segno*) means go back to the sign; *al Fine* means stop at the word *Fine*; *al Coda* means jump to the coda.

Read navigation marks before you play. A short piece can contain three different routes, and stopping at the wrong bar is a reading error, not a memory slip.`,
        ),
        section(
          'Tablature and lead sheets',
          `**Tablature** uses six lines for the guitar's strings and numbers for frets. The top line is the high E string; a 0 means open. Tab tells you where to put your fingers, but it does not show rhythm as clearly as staff notation.

A **lead sheet** gives a melody in staff notation with chord symbols above it. The player supplies the accompaniment, voicing, and rhythm. **Nashville numbers** replace chord letters with scale degrees — I–V–vi–IV works in every key — which is why session players can transpose a chart at sight.`,
        ),
      ],
      [noteReading(6, 'note-reading-lead-sheets', 'both'), buildChords(5, ['Major', 'Minor', 'Dominant 7th'], 'chord-build-lead-sheets')],
    ),
    lesson(
      'transposition-score',
      'Transposing Instruments & Score Reading',
      'Why a written C can sound as B♭ or F — and how to read the full score.',
      11,
      [
        section(
          'Written pitch versus concert pitch',
          `Some instruments sound a different pitch from the one written. A **B♭ clarinet** or **B♭ trumpet** sounds a major second lower than written: written C4 sounds B♭3. An **E♭ alto saxophone** sounds a major sixth lower. A **horn in F** sounds a perfect fifth lower. Piccolo and double bass transpose by octaves.

Scores for these instruments are written in **transposing pitch** so the player can use familiar fingerings. The conductor and the analyst think in **concert pitch**. To reduce a score to piano, transpose each part into concert pitch first.`,
          { staff: treble([n('C', 4)]) },
        ),
        section(
          'Reading the full score',
          `A full score stacks instrument families from top to bottom: woodwinds, brass, percussion, harp and keyboard, then strings. Brackets group sections; a **system** is one vertical slice of time across all staves.

Follow one line horizontally, then compare it vertically with the bass. Notice doublings, octave displacements, and cues. **Figured bass** in Baroque scores is a shorthand: the bass note plus numbers tells the continuo player which intervals to realize above it.`,
        ),
      ],
      [keySigs(6, 'key-signature-transposition', 7, 'mixed'), writtenIntervals(5, 'interval-id-transposition')],
    ),
    lesson(
      'figured-bass',
      'Figured Bass & Continuo',
      'Turn a bass line and a few numbers into a full accompaniment.',
      12,
      [
        section(
          'Reading the figures',
          `**Figured bass** is a shorthand for intervals above the bass. A bare note means a root-position triad; **6** means first inversion; **6/4** means second inversion; **7** adds the seventh. Numbers stacked vertically are sung or played together: 6 over 4 means a sixth and a fourth above the bass.

A dash means hold the previous chord. A **4–3** suspension resolves the fourth to a third; **9–8** resolves the ninth to an octave. The figures describe intervals, not chord names, so the same figure can produce different qualities depending on the key.`,
        ),
        section(
          'Realizing and improvising',
          `To realize a figured bass, play the bass with the left hand and build the indicated intervals above it with the right. Keep the voices within reach, double the bass in root position, and prepare suspensions.

**Partimento** takes the idea further: a bass line plus figures or schemata teaches improvisation, counterpoint, and composition at the keyboard. The player learns to recognize cadences, sequences, and harmonic patterns, then realizes them in real time.`,
        ),
      ],
      [writtenIntervals(6, 'interval-id-figured-bass'), progressions(5, 'progression-ear-figured-bass')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'alto-tenor-clefs': [
    demo(
      0,
      line(
        N('F3 A3 C4 E4 G4'),
        `Play the five alto-clef lines: **F3, A3, C4, E4, G4**. On piano they are five white keys with C4 in the middle. On guitar, F3 is the D string at the 3rd fret, A3 the G string at the 2nd, C4 the B string at the 1st, E4 the open high E, and G4 the high E at the 3rd fret. Say the letter and the line number together.`,
        {
          tempo: 0.5,
          guitarSpots: spots([3, 3], [2, 2], [1, 1], [0, 0], [0, 3]),
          rootPitchClasses: [0],
          caption: 'Alto clef: C4 sits on the middle line.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('D3 F3 A3 C4 E4'),
        `Now the tenor-clef lines: **D3, F3, A3, C4, E4**. The same C4 has moved up one line, so every other note shifts with it. On guitar, D3 is the open D string, F3 the D string 3rd fret, A3 the G string 2nd fret, C4 the B string 1st fret, and E4 the open high E. Compare the two sets and notice that only the staff position changed, not the pitch.`,
        {
          tempo: 0.5,
          guitarSpots: spots([3, 0], [3, 3], [2, 2], [1, 1], [0, 0]),
          rootPitchClasses: [2],
          caption: 'Tenor clef: the C clef moves to the fourth line.',
        },
      ),
    ),
  ],
  'expression-marks': [
    demo(
      0,
      line(
        N('C4 E4 G4 C5 G4 E4 C4'),
        `Play the arpeggio **C–E–G–C5–G–E–C** twice. First let every note ring into the next for a **legato** line; then release each note early for **staccato**. The pitches are identical, so the difference you hear is entirely articulation. On guitar the shape is the C chord rolled upward and back down: A string 3rd fret, D 2nd, G open, B 1st, and back.`,
        {
          tempo: 0.55,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [2, 0], [3, 2], [4, 3]),
          rootPitchClasses: [0],
          caption: 'Same notes, different attack: legato connects, staccato separates.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5'),
        `Play a C major scale slowly, then imagine the same scale at twice the speed. **Adagio** and **allegro** use the same finger pattern; tempo changes the character. On piano, keep the thumb crossing quiet as you ascend. On guitar, use the open-position scale from the A string 3rd fret to the B string 1st fret, and let the last note ring.`,
        {
          tempo: 0.42,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Tempo is part of the character, not an afterthought.',
        },
      ),
    ),
  ],
  ornaments: [
    demo(
      0,
      line(
        N('C5 D5 C5 B4 C5'),
        `A **trill** on C5 alternates with the note above, D5, and returns to C5. Play **C–D–C–B–C** slowly, then speed up the alternation. On piano use fingers 3–4 on C5 and D5. On guitar the whole figure sits on the high E string: 8th fret, 10th, 8th, 7th, 8th. Keep the final C5 on the beat.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([0, 8], [0, 10], [0, 8], [0, 7], [0, 8]),
          rootPitchClasses: [0],
          caption: 'A trill is a measured oscillation, not a blur.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('G4 A4 G4 F♯4 G4'),
        `A **turn** on G4 visits the upper neighbour A4 and the lower neighbour F♯4 before settling back on G4. Play **G–A–G–F♯–G**. On guitar, use the high E string at frets 3, 5, 3, 2, 3. On piano, keep the wrist loose and let the principal note land clearly at the end.`,
        {
          tempo: 0.45,
          guitarSpots: spots([0, 3], [0, 5], [0, 3], [0, 2], [0, 3]),
          rootPitchClasses: [7],
          caption: 'A turn circles the principal note from above and below.',
        },
      ),
    ),
  ],
  'repeats-tab-lead-sheets': [
    demo(
      0,
      chord(
        N('C4 E4 G4 C5 E5'),
        `Read the open C chord as tab: **x 3 2 0 1 0** from low E to high E. The numbers are frets, not fingers, and the x means do not play that string. On piano, the same chord is C4–E4–G4–C5–E5. A lead sheet would show the melody on the staff and write simply “C” above it; the guitarist chooses this shape and the pianist chooses this voicing.`,
        {
          pianoEnd: 84,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0, 4, 7],
          caption: 'Tab shows where; chord symbols show what; the player chooses how.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('G3 B3 D4 G4 B4 G5'),
        `The open G chord is **3 2 0 0 0 3** in tab. On piano, play G3–B3–D4–G4–B4 and add G5 on top if you want the full guitar spread. Notice that the guitar doubles G in three octaves while the piano can choose a lighter voicing. That freedom is exactly what a lead sheet leaves open.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          guitarSpots: shape('3 2 0 0 0 3'),
          rootPitchClasses: [7, 11, 2],
          caption: 'A chord symbol is a promise, not a fixed arrangement.',
        },
      ),
    ),
  ],
  'transposition-score': [
    demo(
      0,
      line(
        N('B♭3 C4'),
        `A B♭ trumpet reading **C4** sounds **B♭3**. Play the two pitches in that order and hear the major second drop. On piano, B♭3 is the black key below middle C. On guitar, B♭3 is the A string at the 1st fret and C4 is the B string at the 1st fret. The written note is not the sounding note.`,
        {
          tempo: 0.8,
          guitarSpots: spots([4, 1], [1, 1]),
          rootPitchClasses: [10, 0],
          caption: 'B♭ instrument: written C4 sounds B♭3.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('F3 C4'),
        `A horn in F reading **C4** sounds **F3**, a perfect fifth lower. Play F3 and C4 together: the interval is a perfect fifth, the same distance that separates the instrument's written and sounding pitch. On guitar, F3 is the D string 3rd fret and C4 is the B string 1st fret. When you read a transposing score, apply that interval before comparing it with the piano reduction.`,
        {
          tempo: 0.8,
          guitarSpots: spots([3, 3], [1, 1]),
          rootPitchClasses: [5, 0],
          caption: 'Horn in F: written C4 sounds F3.',
        },
      ),
    ),
  ],
  'figured-bass': [
    demo(
      0,
      line(
        N('G3 C4 E4 G3 B3 D4'),
        `A **6/4** figure over G means play a sixth and a fourth above the bass: **G–C–E**. The figures then resolve to **5/3** on the same bass, giving **G–B–D**. On piano, hold G3 in the left hand and move the right hand from C–E to B–D. On guitar, use low E 3, A 3, D 2, then low E 3, A 2, D 0.`,
        {
          tempo: 0.75,
          guitarSpots: spots([5, 3], [4, 3], [3, 2], [5, 3], [4, 2], [3, 0]),
          rootPitchClasses: [7, 0, 4],
          caption: '6/4 resolving to 5/3 over a held bass.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 E4 G4 B3 D4 F4 A3 C4 E4 G3 B3 D4'),
        `A **partimento** pattern: a descending bass **C–B–A–G** with a chord above each step. Realize it as C major, G major, A minor, and G major, keeping the upper voices close. On piano, let the left hand walk down while the right hand holds common tones. On guitar, play the bass on the A and low E strings and let the upper strings ring.`,
        {
          tempo: 0.55,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [5, 1], [4, 0], [3, 0], [2, 0], [4, 0], [3, 2], [2, 2], [1, 1], [5, 3], [4, 2], [3, 0], [2, 0]),
          rootPitchClasses: [0, 11, 9, 7],
          caption: 'Partimento: a bass line plus schemata becomes an accompaniment.',
        },
      ),
    ),
  ],
};

export const readingCourse = course;
export const readingDemos = demos;
