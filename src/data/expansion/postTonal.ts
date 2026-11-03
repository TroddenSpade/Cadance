import type { Course } from '../curriculum';
import { N, chord, demo, line, progression, rhythmSpec, spots, type ExpansionDemo } from './demoHelpers';
import { earChords, lesson, melodyDictation, progressions, section, writtenIntervals } from './helpers';

const course: Course = {
  id: 'post-tonal-composition',
  title: 'Post-Tonal & Composition',
  subtitle: 'Symmetry, sets, texture, and the tools of the modern composer.',
  level: 'master',
  glyph: '𝄫',
  color: '#6f8fb0',
  lessons: [
    lesson(
      'symmetrical-quartal',
      'Symmetrical Scales & Quartal Harmony',
      'Whole-tone, octatonic, and stacked-fourths colours.',
      12,
      [
        section(
          'Symmetrical scales',
          `A **symmetrical scale** repeats the same interval pattern, so it has fewer than twelve distinct transpositions. The **whole-tone scale** alternates whole steps: C–D–E–F♯–G♯–A♯. The **octatonic scale** alternates whole and half steps, producing a diminished-seventh frame. The **augmented scale** alternates minor thirds and semitones.

Messiaen's **modes of limited transposition** systematize these symmetries. Because the scale repeats, it can sound static or floating — useful for dreamlike, mechanical, or uncertain moods.`,
        ),
        section(
          'Quartal and quintal harmony',
          `**Quartal harmony** stacks fourths: C–F–B♭–E♭. **Quintal harmony** stacks fifths. Neither uses the third as the defining interval, so the chord sounds open and ambiguous.

Quartal voicings are common in jazz (McCoy Tyner, Herbie Hancock) and in Impressionist music. They can **plane** — move in parallel — without the functional obligations of tonal harmony. The result is colour first, function second.`,
        ),
      ],
      [earChords(5, 'chord-ear-symmetrical', ['Augmented', 'Diminished 7th', 'Sus4']), writtenIntervals(5, 'interval-id-symmetrical')],
    ),
    lesson(
      'polytonality-pandiatonicism',
      'Polytonality & Pandiatonicism',
      'Two keys at once, and music that uses the white keys without a tonic.',
      11,
      [
        section(
          'Polytonality and bitonality',
          `**Polytonality** presents two or more keys simultaneously. **Bitonal** music often layers a C major triad over an F♯ major triad, or puts a melody in one key against accompaniment in another.

The effect depends on separation: register, timbre, and rhythm keep the layers audible. If the keys blur into one chromatic mass, the listener hears dissonance rather than two competing homes.`,
        ),
        section(
          'Pandiatonicism',
          `**Pandiatonicism** uses the diatonic scale freely without functional harmony. Any white-key note can combine with any other; chords are built from seconds, fourths, and fifths rather than functional triads.

The result can sound open, folk-like, or ceremonial. Stravinsky and Copland used it to escape the pull of V–I. Analyse it by texture, spacing, and recurring cells rather than by Roman numerals.`,
        ),
      ],
      [progressions(5, 'progression-ear-polytonal'), earChords(4, 'chord-ear-pandiatonic', ['Major', 'Sus2', 'Sus4'])],
    ),
    lesson(
      'set-theory-serialism',
      'Set Theory & Serialism',
      'Pitch-class sets, interval vectors, and twelve-tone rows.',
      14,
      [
        section(
          'Pitch-class set theory',
          `A **pitch-class set** is an unordered collection of notes, reduced to the twelve pitch classes. Its **normal form** is the most compact ordering; its **prime form** is the normal form or its inversion, transposed to begin on 0.

The **interval vector** counts the interval classes between members. It describes the set's sound: a major triad and a minor triad share a vector because they are inversionally related. Set theory is a tool for comparison, not a replacement for listening.`,
        ),
        section(
          'Twelve-tone serialism',
          `A **twelve-tone row** orders all twelve pitch classes. The row can appear in **prime** (P), **retrograde** (R), **inversion** (I), and **retrograde-inversion** (RI) forms, each transposable to any starting pitch.

Schoenberg, Berg, and Webern used rows to generate melodies, harmonies, and large forms. **Integral serialism** extends the principle to rhythm, dynamics, and timbre. The row is a source of relationships, not a guarantee of quality.`,
        ),
      ],
      [writtenIntervals(6, 'interval-id-serialism'), earChords(4, 'chord-ear-sets', ['Diminished 7th', 'Augmented', 'Major 7th'])],
    ),
    lesson(
      'minimalism-aleatory-microtonality',
      'Minimalism, Aleatory & Microtonality',
      'Process, chance, and the spaces between the piano keys.',
      12,
      [
        section(
          'Minimalism and process music',
          `**Minimalism** reduces material to a few cells and lets repetition, phase, and gradual change do the work. Steve Reich's **phase music** has two identical lines drift out of sync; Terry Riley's *In C* builds a texture from short patterns.

**Aleatory** introduces chance: the performer may choose order, duration, or material. **Graphic notation** replaces standard staves with shapes, lines, or instructions. The composer sets boundaries; the performer completes the piece.`,
        ),
        section(
          'Microtonality and extended techniques',
          `**Microtonality** uses intervals smaller than a semitone. **Just intonation** tunes intervals to simple frequency ratios; **equal temperament** divides the octave into twelve equal parts. Historical temperaments sit between the two.

**Extended techniques** include harmonics, col legno, prepared piano, multiphonics, and breath sounds. They expand the instrument's colour without changing its identity. Notate them clearly, and only when the sound is the point.`,
        ),
      ],
      [earChords(5, 'chord-ear-contemporary', ['Augmented', 'Diminished 7th', 'Sus2']), melodyDictation(4, 'melody-dictation-minimalism')],
    ),
    lesson(
      'orchestration-analysis',
      'Orchestration, Motives & Modern Analysis',
      'Write for instruments, develop an idea, and choose an analytical lens.',
      14,
      [
        section(
          'Orchestration and instrumental writing',
          `**Orchestration** assigns musical material to instruments. Know the ranges, transpositions, and idiomatic strengths of each family: strings sustain and divide, woodwinds blend and articulate, brass project, percussion defines attack.

Write for the instrument, not the piano. A passage that lies well under the hands may be awkward on a string instrument or impossible on a horn. Check balance, doubling, and register before adding colour.`,
        ),
        section(
          'Motivic development and analytical lenses',
          `**Motivic development** transforms a short idea through sequence, inversion, augmentation, diminution, fragmentation, and reharmonization. It is the composer's main tool for making a long piece cohere.

Analysis can focus on **Schenkerian** voice leading (foreground, middleground, background), **form**, **topic** and semiotics, **film-music synchronization**, or **popular-music** groove and production. Choose the lens that answers your question. **Score preparation** — clean notation, parts, cues, page turns — is part of composing, not an afterthought.`,
        ),
      ],
      [progressions(5, 'progression-ear-analysis'), melodyDictation(4, 'melody-dictation-development')],
    ),
    lesson(
      'world-music',
      'World Music Traditions',
      'Maqam, raga, gamelan, clave, and interlocking rhythm.',
      13,
      [
        section(
          'Maqam and raga',
          `A **maqam** is a modal system used across the Arab world, Turkey, and Central Asia. It specifies a scale, habitual melodic phrases, and a hierarchy of stable and unstable notes. Some maqamat use intervals smaller than a semitone, which equal-tempered instruments approximate rather than reproduce.

A **raga** is a melodic framework in Indian classical music. It defines ascending and descending lines, a tonic drone, characteristic ornaments, and a mood. **Tala** organizes rhythm in cycles. In both traditions, the scale is a starting point; the performed melody is the knowledge.`,
        ),
        section(
          'Gamelan, clave, and polyrhythm',
          `**Gamelan** ensembles from Indonesia use layered, interlocking parts around a slow nuclear melody. **Colotomic** instruments mark the cycle's large and small divisions; **kotekan** splits a fast line between players.

In Afro-Cuban music the **clave** is a two-bar rhythmic key, usually 3–2 or 2–3. West African drumming builds **polyrhythm** from independent cycles. Listen for the repeating timeline before you count the individual parts.`,
        ),
      ],
      [earChords(4, 'chord-ear-world', ['Major', 'Minor', 'Sus4']), melodyDictation(4, 'melody-dictation-world')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'symmetrical-quartal': [
    demo(
      0,
      line(
        N('C4 D4 E4 F♯4 G♯4 A♯4 C5'),
        `The **whole-tone scale** on C: **C–D–E–F♯–G♯–A♯–C**. Every step is the same size, so there is no leading tone and no clear tonic. Play it on piano and notice how it floats. On guitar, use the high E string at frets 8, 10, 12, then the B string 2, 4, 6, and high E 8.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 7], [1, 9], [1, 11], [0, 8]),
          rootPitchClasses: [0, 2, 4, 6, 8, 10],
          caption: 'Whole-tone scale: equal steps, no leading tone.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 F4 B♭4 E♭5'),
        `A **quartal** stack on C: **C–F–B♭–E♭**. Each interval is a perfect fourth, so the chord has no third and no major/minor identity. Play it on piano and then move the whole shape up a tone. On guitar, use the D string 3rd fret, G string 3rd, B string 6th, and high E string 6th.`,
        {
          tempo: 0.7,
          pianoEnd: 84,
          guitarSpots: spots([3, 3], [2, 3], [1, 6], [0, 6]),
          rootPitchClasses: [0, 5, 10, 3],
          caption: 'Quartal harmony: stacked fourths, open and ambiguous.',
        },
      ),
    ),
  ],
  'polytonality-pandiatonicism': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('F♯4 A♯4 C♯5')],
        N('C4 E4 G4 F♯4 A♯4 C♯5'),
        `Layer **C major** and **F♯ major** triads. The two keys share no common tones, so the bitonal clash is immediate. Play C–E–G with the left hand and F♯–A♯–C♯ with the right. On guitar, use the open C shape and an F♯ barre at the 2nd fret; keep the layers in separate registers.`,
        {
          tempo: 0.8,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [5, 2], [4, 4], [3, 4], [2, 3], [1, 2]),
          rootPitchClasses: [0, 6],
          caption: 'Bitonal layers: C major against F♯ major.',
        },
      ),
    ),
    demo(
      1,
      chord(
        N('C4 D4 G4 A4 E5'),
        `A **pandiatonic** sonority built from white keys: **C–D–G–A–E**. There is no third and no functional root, so the chord is open rather than major or minor. Play it on piano and let the seconds ring. On guitar, use the open C, G, and high E strings plus the D string 2nd fret and B string 3rd fret.`,
        {
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 0], [2, 0], [1, 3], [0, 0]),
          rootPitchClasses: [0, 2, 7, 9, 4],
          caption: 'Pandiatonicism: white-key colour without a tonic.',
        },
      ),
    ),
  ],
  'set-theory-serialism': [
    demo(
      0,
      line(
        N('C4 C♯4 E4'),
        `The set **{0, 1, 4}** is a compact chromatic cell: **C–C♯–E**. Its prime form is (0,1,4), and its interval vector describes the tensions inside it. Play the cell, then transpose it up a fourth. On guitar, use the B string at frets 1, 2, and 5; the fret distances mirror the interval content.`,
        {
          tempo: 0.7,
          guitarSpots: spots([1, 1], [1, 2], [1, 5]),
          rootPitchClasses: [0, 1, 4],
          caption: 'Pitch-class set {0,1,4}: a three-note cell with a distinctive vector.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 E4 G♯4 B4 D4 F4'),
        `A twelve-tone row fragment: **C–E–G♯–B–D–F**. The intervals are deliberately wide and avoid a tonal centre. Play the prime form, then play it backwards as the **retrograde**. On guitar, use the B and high E strings; the point is the ordered intervals, not a singable tune.`,
        {
          tempo: 0.5,
          pianoEnd: 84,
          guitarSpots: spots([1, 1], [1, 5], [1, 9], [0, 7], [0, 10], [1, 6]),
          rootPitchClasses: [0, 4, 8, 11, 2, 5],
          caption: 'Serialism: a row is an ordered set of intervals, not a scale.',
        },
      ),
    ),
  ],
  'minimalism-aleatory-microtonality': [
    demo(
      0,
      line(
        N('C4 E4 G4 C4 E4 G4 C4 E4 G4'),
        `A **minimalist** cell repeats **C–E–G** while the ear starts to hear changing accents. Play the pattern steadily and shift the accent by one note every cycle. On piano, keep the same fingering and let the grouping change. On guitar, repeat the C chord tones on the A, D, and G strings.`,
        {
          tempo: 0.6,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [4, 3], [3, 2], [2, 0], [4, 3], [3, 2], [2, 0]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Minimalism: repetition plus a shifting accent creates change.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 C♯4 D4 E♭4 E4'),
        `A **microtonal** cluster approaches a semitone from below: **C–C♯–D–E♭–E**. On piano, the equal-tempered keys approximate the space; on guitar, bend the string slightly to hear the continuous pitch between frets. The notation may use arrows or cents to show the exact inflection.`,
        {
          tempo: 0.7,
          guitarSpots: spots([1, 1], [1, 2], [1, 3], [1, 4], [1, 5]),
          rootPitchClasses: [0, 1, 2, 3, 4],
          caption: 'Microtonality: the space between the keys is part of the material.',
        },
      ),
    ),
  ],
  'orchestration-analysis': [
    demo(
      0,
      chord(
        N('C3 G3 C4 E4 G4 C5'),
        `An orchestral **C major** sonority spread across registers: **C3–G3–C4–E4–G4–C5**. Low strings or bassoon take the bottom, horns fill the middle, and violins or flutes take the top. Play the stack on piano and notice how spacing changes the colour. On guitar, use the open C shape and let the bass note ring.`,
        {
          pianoStart: 36,
          pianoEnd: 84,
          guitarSpots: spots([5, 3], [4, 3], [3, 2], [2, 0], [1, 1], [0, 0]),
          rootPitchClasses: [0, 7, 4],
          caption: 'Orchestration: register and spacing are part of the harmony.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('E4 G4 A4 G4 E4 D4 C4'),
        `A **motive** **E–G–A–G–E–D–C** is developed by changing its rhythm, then its direction. Play it as written, then backwards, then in augmentation. On piano, keep the same fingering and change only the timing. On guitar, use the B and high E strings; the identity survives the transformation.`,
        {
          tempo: 0.55,
          guitarSpots: spots([0, 0], [0, 3], [0, 5], [0, 3], [0, 0], [1, 3], [1, 1]),
          rootPitchClasses: [0, 4, 7, 9],
          caption: 'Motivic development: same idea, new rhythm or direction.',
        },
      ),
    ),
  ],
  'world-music': [
    demo(
      0,
      line(
        N('D4 E♭4 F♯4 G4 A4 B♭4 C5 D5'),
        `A **Hijaz**-like maqam on D: **D–E♭–F♯–G–A–B♭–C–D**. The augmented second between E♭ and F♯ gives the mode its characteristic colour. Play it on piano and let the final D ring against a drone. On guitar, use the D string at frets 0, 1, 4, the G string at 0, 2, 3, and the B string at 1, 3.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([3, 0], [3, 1], [3, 4], [2, 0], [2, 2], [2, 3], [1, 1], [1, 3]),
          rootPitchClasses: [2, 3, 6, 7, 9, 10, 0],
          caption: 'Maqam colour: the augmented second between E♭ and F♯.',
        },
      ),
    ),
    demo(
      1,
      rhythmSpec(
        [1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1],
        N('C4 E4 G4 C5 G4 E4 C4'),
        `A **3–2 clave** feel: three strokes in the first bar, two in the second. Play the pattern on a single pitch first, then add **C–E–G–C5** on the strong strokes. On piano, tap the clave with the left hand and play the chord with the right. On guitar, mute the strings and tap the rhythm, then let the C chord ring.`,
        {
          tempo: 0.6,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [2, 0], [3, 2], [4, 3]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Clave: a two-bar timeline that organizes the groove.',
        },
      ),
    ),
  ],
};

export const postTonalCourse = course;
export const postTonalDemos = demos;
