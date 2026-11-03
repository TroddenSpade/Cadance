import type { Course } from '../curriculum';
import { N, chord, demo, line, progression, shape, spots, type ExpansionDemo } from './demoHelpers';
import { buildChords, buildScales, earChords, findNote, inversions, lesson, progressions, section } from './helpers';

const course: Course = {
  id: 'jazz-fretboard-lab',
  title: 'Jazz & Fretboard Lab',
  subtitle: 'CAGED shapes, chord scales, voicings, and the language of improvisation.',
  level: 'intermediate',
  glyph: '♭',
  color: '#d19a5b',
  lessons: [
    lesson(
      'caged-barre-capo',
      'CAGED, Barre Chords & Capo',
      'Five shapes that map the whole neck — and how to move them anywhere.',
      11,
      [
        section(
          'The CAGED system',
          `**CAGED** names five open chord shapes: C, A, G, E, D. Each shape can be moved up the neck with a barre, and together they cover the same chord in five positions. The root of each shape tells you where the chord lives.

The system is a map, not a rule. Learn the shape, the root, and the arpeggio inside it. Then you can find a chord, a scale, or a melody in the same region instead of jumping between unrelated patterns.`,
        ),
        section(
          'Barre chords, power chords, and capo',
          `A **barre chord** uses one finger to press several strings at once, transposing an open shape. An E-shape barre at the 1st fret gives F major; an A-shape barre at the 3rd fret gives C major.

A **power chord** is root, fifth, and often the octave. It has no third, so it works in rock without committing to major or minor. A **capo** clamps the strings and transposes open shapes: capo 2 with a C shape sounds D.`,
        ),
      ],
      [buildChords(6, ['Major', 'Minor', 'Dominant 7th'], 'chord-build-caged'), findNote(6, 'find-note-caged')],
    ),
    lesson(
      'fingerstyle-neck-piano',
      'Fingerstyle, Neck Scales & Piano Accompaniment',
      'Make one instrument sound like a whole band.',
      12,
      [
        section(
          'Fingerstyle and the whole neck',
          `**Fingerstyle** guitar assigns the thumb to the bass strings and the fingers to the upper strings. **Travis picking** alternates the thumb between two bass notes while the fingers play melody or chords. The pattern should stay steady while the harmony changes.

**Neck scales** connect the CAGED positions into one continuous map. Practise a scale in one position, then shift to the next shape on the same root. The goal is to see the fretboard as a grid of intervals, not five separate boxes.`,
        ),
        section(
          'Piano accompaniment and pedalling',
          `Piano accompaniment can be **block chords**, **broken chords**, or **Alberti bass** (low–high–middle–high). The left hand supplies the bass and harmony; the right hand carries melody or rhythm.

The **sustain pedal** lifts the dampers, letting notes ring. Change the pedal at each harmony change, not on every beat. **Hand independence** comes from practising each hand alone, then combining them at a speed where neither hand rushes.`,
        ),
      ],
      [inversions(5, ['Major', 'Minor', 'Dominant 7th'], 'chord-inversion-accompaniment'), buildScales(4, 'scale-build-neck', ['Major', 'Mixolydian'])],
    ),
    lesson(
      'chord-scale-blues-bebop',
      'Chord-Scale Theory, Blues & Bebop',
      'Choose the right scale for the chord, then add the blue notes.',
      13,
      [
        section(
          'Chord-scale theory',
          `A **chord scale** is the scale that fits a chord. Cmaj7 takes C Ionian; Dm7 takes D Dorian; G7 takes G Mixolydian; a m7♭5 takes Locrian. Altered dominants take the altered scale (the seventh mode of melodic minor).

**Avoid notes** are scale tones that clash with a chord tone, usually a minor second above a chord tone. They can still pass quickly. **Guide tones** — the third and seventh — define the chord quality and make the progression hearable.`,
        ),
        section(
          'Pentatonic, blues, and bebop scales',
          `The **major pentatonic** is 1–2–3–5–6; the **minor pentatonic** is 1–♭3–4–5–♭7. The **blues scale** adds the lowered fifth, the “blue note,” to the minor pentatonic.

**Bebop scales** add a chromatic passing tone to a seven-note scale so that chord tones land on strong beats: bebop dominant adds ♮7 to Mixolydian, bebop major adds ♯5 to Ionian. The **octatonic** scale alternates whole and half steps and fits diminished and altered dominant sounds.`,
        ),
      ],
      [buildScales(5, 'scale-build-jazz', ['Major', 'Mixolydian', 'Dorian']), earChords(5, 'chord-ear-jazz', ['Major 7th', 'Dominant 7th', 'Minor 7th', 'Half-diminished 7th'])],
    ),
    lesson(
      'voicings-improvisation',
      'Voicings, Comping & Improvisation',
      'Drop the root, find the guide tones, and build a solo from a motive.',
      14,
      [
        section(
          'Jazz voicings',
          `A **drop-2** voicing takes a close-position chord and drops the second-highest voice an octave. **Drop-3** does the same with the third-highest. **Rootless voicings** leave the root to the bass and stack thirds, sevenths, and extensions in the middle register.

**Quartal voicings** stack fourths instead of thirds, producing an open, ambiguous sound. **Upper-structure triads** place a triad above a dominant chord to imply its alterations. The best voicing depends on register, voice leading, and what the bass is playing.`,
        ),
        section(
          'Comping, walking bass, and improvisation',
          `**Comping** is accompaniment: short chordal jabs, sustained pads, or rhythmic patterns that leave room for the soloist. A **walking bass** connects chord roots with stepwise motion and chromatic approach notes.

Improvisation starts with a **motive**, not a scale. Develop the motive by sequence, inversion, rhythmic displacement, and repetition. Transcribe solos by ear, sing them, then play them in twelve keys. **Arranging** assigns roles: melody, harmony, bass, rhythm, and space.`,
        ),
      ],
      [progressions(5, 'progression-ear-jazz'), inversions(5, ['Major 7th', 'Minor 7th', 'Dominant 7th'], 'chord-inversion-voicings')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'caged-barre-capo': [
    demo(
      0,
      chord(
        N('C4 E4 G4 C5 E5'),
        `The open **C shape** is the first stop in CAGED: **x 3 2 0 1 0**. Its root is on the A string at the 3rd fret. Move the same shape up two frets with a barre and you have D; move it to the 5th fret and you have E. On piano, the chord is C–E–G–C5–E5. Learn the root first, then the shape.`,
        {
          pianoEnd: 84,
          guitarSpots: shape('x 3 2 0 1 0'),
          rootPitchClasses: [0, 4, 7],
          caption: 'CAGED C shape: root on the A string, 3rd fret.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('F3 C4 F4 A4 C5 F5'),
        `An **E-shape barre** at the 1st fret gives **F major**: **1 3 3 2 1 1**. The index finger bars the whole fret; the other fingers make the E-major shape. On piano, play F3–C4–F4–A4–C5–F5. A capo does the same job without the barre: clamp fret 1 and play an E shape.`,
        {
          pianoStart: 48,
          pianoEnd: 84,
          guitarSpots: shape('1 3 3 2 1 1'),
          rootPitchClasses: [5, 0, 9],
          caption: 'E-shape barre at fret 1: F major across all six strings.',
        },
      ),
    ),
  ],
  'fingerstyle-neck-piano': [
    demo(
      0,
      line(
        N('C3 G3 E4 G4 C3 G3 E4 G4'),
        `A **Travis picking** pattern: the thumb alternates C3 and G3 while the fingers play E4 and G4. Play it slowly and keep the thumb steady. On guitar, use the low E string 3rd fret and open G for the bass, then the D string 2nd fret and open G for the upper notes. The thumb is the metronome; the fingers are the melody.`,
        {
          tempo: 0.55,
          pianoStart: 36,
          pianoEnd: 72,
          guitarSpots: spots([5, 3], [2, 0], [3, 2], [2, 0], [5, 3], [2, 0], [3, 2], [2, 0]),
          rootPitchClasses: [0, 7, 4],
          caption: 'Travis picking: steady thumb, moving fingers.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C3 G3 E3 G3 C4 E4 G4 E4'),
        `**Alberti bass** in the left hand: **C3–G3–E3–G3**, repeated, while the right hand plays **C4–E4–G4–E4**. Play the left-hand pattern alone until it is even, then add the melody. On guitar, the same idea is a broken C chord: A string 3, G open, D string 2, G open, then the upper strings.`,
        {
          tempo: 0.5,
          pianoStart: 36,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [2, 0], [3, 2], [2, 0], [1, 1], [0, 0], [0, 3], [0, 0]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Alberti bass: low–high–middle–high under a melody.',
        },
      ),
    ),
  ],
  'chord-scale-blues-bebop': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4 A4 B♭4 C5'),
        `Over **C7**, use **C Mixolydian**: C–D–E–F–G–A–B♭–C. The B♭ is the seventh that makes the chord dominant. Play the scale on piano and land on E and B♭, the guide tones. On guitar, use the B string and high E string; the same scale continues through the CAGED positions.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 6], [1, 8], [1, 10], [1, 11], [0, 8]),
          rootPitchClasses: [0, 4, 7, 10],
          caption: 'C Mixolydian over C7: the flat seventh defines the sound.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 E♭4 F4 F♯4 G4 B♭4 C5'),
        `The **C blues scale**: **C–E♭–F–F♯–G–B♭–C**. The F♯ is the blue note, a lowered fifth that slides between G and F. Play it on piano with a relaxed swing. On guitar, shift to the B string and play frets 1, 4, 6, 7, 8, and 11, then the high E string at fret 8.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 4], [1, 6], [1, 7], [1, 8], [1, 11], [0, 8]),
          rootPitchClasses: [0, 3, 5, 6, 7, 10],
          caption: 'Blues scale: minor pentatonic plus the lowered fifth.',
        },
      ),
    ),
  ],
  'voicings-improvisation': [
    demo(
      0,
      chord(
        N('E4 G4 B4 D5'),
        `A **rootless Cmaj9** voicing: **E–G–B–D**, the third, fifth, seventh, and ninth. The bass player supplies C, so the pianist or guitarist can leave it out. Play the four notes on piano with the left hand below and the right hand above. On guitar, use the A string 7th fret, D string 5th, G string 4th, and B string 5th.`,
        {
          pianoEnd: 84,
          guitarSpots: spots([4, 7], [3, 5], [2, 4], [1, 5]),
          rootPitchClasses: [4, 7, 11, 2],
          caption: 'Rootless Cmaj9: the root is implied, the colour is explicit.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('D4 F4 A4 C5'), N('D4 F4 G4 B4'), N('E4 G4 B4 D5')],
        N('D4 F4 A4 C5 G4 B4 F4 E4 G4 B4 D5'),
        `A **ii–V–I** in C: **Dm7–G7–Cmaj7**. The guide tones move smoothly: F–F–E and C–B–B. Play the progression on piano and hold the common tones. On guitar, use the Dm7 shape at the 5th fret, G7 at the 3rd, and Cmaj7 at the 3rd. Listen for the seventh resolving to the third.`,
        {
          tempo: 0.75,
          pianoEnd: 84,
          guitarSpots: spots([4, 5], [3, 7], [2, 5], [1, 5], [5, 3], [4, 5], [3, 3], [2, 4], [1, 3], [4, 3], [3, 2], [2, 0], [1, 0]),
          rootPitchClasses: [2, 5, 7, 11, 0, 4],
          caption: 'ii–V–I: guide tones carry the voice leading.',
        },
      ),
    ),
  ],
};

export const jazzCourse = course;
export const jazzDemos = demos;
