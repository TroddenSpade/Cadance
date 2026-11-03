import type { Course } from '../curriculum';
import { N, chord, demo, progression, spots, type ExpansionDemo } from './demoHelpers';
import { buildChords, earChords, lesson, progressions, section, writtenIntervals } from './helpers';

const course: Course = {
  id: 'chromatic-harmony-two',
  title: 'Chromatic Harmony II',
  subtitle: 'Six-four chords, Neapolitans, augmented sixths, and enharmonic turns.',
  level: 'advanced',
  glyph: '♯',
  color: '#b46b7a',
  lessons: [
    lesson(
      'cadential-six-four',
      'Cadential 6/4 & Harmonic Rhythm',
      'The most important six-four chord, and the pace at which harmony moves.',
      11,
      [
        section(
          'The cadential six-four',
          `A **cadential 6/4** looks like a tonic chord in second inversion but functions as a decoration of the dominant. The bass is scale degree 5; the upper voices are 6 and 4 above it. They resolve to 5 and 3 over the same bass, producing V.

Double the bass and treat the 6/4 as accented. The progression is usually written **I6/4–V**, not I–V with a random inversion. In C: G–C–E moves to G–B–D.`,
        ),
        section(
          'Passing, neighbour, and harmonic rhythm',
          `A **passing 6/4** connects a root-position chord to its first inversion over a stepping bass; a **neighbour 6/4** decorates a stationary bass. Both are weaker than the cadential type and should not be accented like it.

**Harmonic rhythm** is the rate at which chords change. A phrase often begins with slow harmonic rhythm and accelerates toward the cadence. When you analyze, mark chord changes above the staff; the pattern of long and short harmonic spans explains the phrase's momentum.`,
        ),
      ],
      [earChords(5, 'chord-ear-six-four', ['Major', 'Minor']), progressions(5, 'progression-ear-six-four')],
    ),
    lesson(
      'neapolitan-augmented-sixths',
      'Neapolitan & Augmented Sixths',
      'Two pre-dominant families that intensify the approach to V.',
      12,
      [
        section(
          'The Neapolitan sixth',
          `The **Neapolitan sixth** is a major triad on the lowered second scale degree, normally in first inversion: in C, **D♭–F–A♭** with F in the bass. It functions as a pre-dominant and usually moves to V.

The lowered sixth scale degree (A♭ in C) resolves down to 5 (G), and the lowered second (D♭) resolves to 1 or 7. The chord is rarely used in root position in common-practice harmony because the doubled flat second sounds heavy.`,
        ),
        section(
          'Augmented sixth chords',
          `All three augmented sixths place **♭6** and **♯4** in the outer voices, expanding to the octave on 5. In C:

- **Italian:** A♭–C–F♯.
- **French:** A♭–C–D–F♯.
- **German:** A♭–C–E♭–F♯.

The German sixth sounds like a dominant seventh and can be respelled enharmonically. Resolve it carefully: in C, the E♭ usually moves to D or is treated as part of a passing motion to avoid parallel fifths.`,
        ),
      ],
      [earChords(5, 'chord-ear-neapolitan', ['Major', 'Minor', 'Dominant 7th']), writtenIntervals(5, 'interval-id-augmented-sixths')],
    ),
    lesson(
      'chromatic-mediants-dim7',
      'Chromatic Mediants & Common-Tone Dim7',
      'Chords a third apart, and a diminished seventh that shares its destination.',
      12,
      [
        section(
          'Chromatic mediants',
          `A **chromatic mediant** is a chord whose root lies a third above or below the previous root, with at least one accidental changing the quality. In C, **C major to A♭ major** and **C major to E major** are the classic pairs.

These chords are common in film, musical theatre, and late-Romantic music. They often share one or two common tones, so the voice leading can be smooth even when the root motion is distant. Name the relationship by root and quality, not just by Roman numeral.`,
        ),
        section(
          'The common-tone diminished seventh',
          `A **common-tone diminished seventh** shares one or more notes with the chord it decorates. In C, **C°7 (C–E♭–G♭–A)** can resolve to **C major**: C and G are common, E♭ rises to E, and G♭ rises to G.

The chord is often built on ♯ii°7 or ♯iv°7 and resolves to I. It is a colour chord, not a functional dominant. Listen for the common tone holding while the other voices resolve by step.`,
        ),
      ],
      [earChords(5, 'chord-ear-mediants', ['Major', 'Minor', 'Diminished 7th']), buildChords(4, ['Major', 'Diminished 7th'], 'chord-build-dim7')],
    ),
    lesson(
      'enharmonic-modulation-pedal',
      'Enharmonic Modulation & Pedal Points',
      'Respelling a chord to change key, and holding one note while harmony moves.',
      13,
      [
        section(
          'Enharmonic modulation',
          `**Enharmonic modulation** reinterprets a chord's spelling so it functions in a new key. A German sixth in C (A♭–C–E♭–F♯) sounds like a dominant seventh in B (F♯–A♯–C♯–E), so respelling it can pivot to B minor. A diminished seventh is symmetrical and can resolve to four different tonics.

The pivot must be prepared by the ear, not only by the spelling. Spell the chord according to its new function, then resolve the tendency tones correctly.`,
        ),
        section(
          'Pedal points',
          `A **pedal point** holds one note, usually in the bass, while the harmony changes above it. A **tonic pedal** prolongs home; a **dominant pedal** builds tension before the return. An **inverted pedal** holds a note in an upper voice.

Pedal points can make otherwise unrelated chords cohere. They also create dissonance: the held note may clash with the chords above until the harmony resolves. Identify the pedal's function, not just its pitch.`,
        ),
      ],
      [progressions(5, 'progression-ear-enharmonic'), earChords(4, 'chord-ear-pedal', ['Major', 'Minor', 'Dominant 7th'])],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'cadential-six-four': [
    demo(
      0,
      progression(
        [N('G3 C4 E4 G4'), N('G3 B3 D4 G4'), N('C4 E4 G4')],
        N('G3 C4 E4 G4 B3 D4 C4 E4 G4'),
        `Play **C/G–G–C**. The first chord is the cadential 6/4: G in the bass, C and E above. The upper voices fall to B and D over the same G bass, making V, then resolve to C. On guitar, use the C/G shape at the 3rd fret, the open G chord, and the open C chord. Hold the bass G through the first two chords.`,
        {
          tempo: 0.8,
          pianoEnd: 84,
          guitarSpots: spots([5, 3], [4, 3], [3, 0], [2, 0], [1, 1], [5, 3], [4, 2], [3, 0], [2, 0], [1, 0], [4, 3], [3, 2], [2, 0], [1, 1]),
          rootPitchClasses: [7, 0],
          caption: 'I6/4–V–I: the six-four resolves over a held dominant bass.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('E4 G4 C5'), N('F4 A4 C5')],
        N('C4 E4 G4 E4 G4 C5 F4 A4 C5'),
        `A **passing 6/4** connects C major to C/E and then to F. The bass steps C–E–F while the upper voices move smoothly. On piano, keep the top voice moving by step. On guitar, play C, C/E (0 3 2 0 1 0), and F (1 3 3 2 1 1); the bass line is the point, not the chord names alone.`,
        {
          tempo: 0.75,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [4, 3], [3, 2], [2, 0], [1, 1], [5, 1], [4, 3], [3, 3], [2, 2], [1, 1]),
          rootPitchClasses: [0, 4, 5],
          caption: 'Passing 6/4: a stepping bass smooths the chord change.',
        },
      ),
    ),
  ],
  'neapolitan-augmented-sixths': [
    demo(
      0,
      progression(
        [N('F3 A♭3 D♭4'), N('G3 B3 D4 G4')],
        N('F3 A♭3 D♭4 G3 B3 D4 G4'),
        `In C, the **Neapolitan sixth** is **F–A♭–D♭** resolving to **G–B–D**. The bass F is the third of D♭ major, so the chord is in first inversion. A♭ falls to G and D♭ falls to D. On guitar, F3 is the low E string 1st fret, A♭3 the low E 4th fret, D♭4 the A string 4th fret; then the open G chord.`,
        {
          tempo: 0.8,
          guitarSpots: spots([5, 1], [5, 4], [4, 4], [5, 3], [4, 2], [3, 0], [2, 0]),
          rootPitchClasses: [5, 1, 7],
          caption: '♭II6–V: the Neapolitan sixth leans into the dominant.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('A♭3 C4 E♭4 F♯4'), N('G3 B3 D4 G4')],
        N('A♭3 C4 E♭4 F♯4 G3 B3 D4 G4'),
        `The **German sixth** in C is **A♭–C–E♭–F♯**. The outer voices, A♭ and F♯, expand to the octave G. Play the chord slowly and listen to the two tendency tones. On guitar, use low E 4, A string 3, D string 1, and D string 4; then the open G chord. The E♭ should move to D, not double the G.`,
        {
          tempo: 0.75,
          guitarSpots: spots([5, 4], [4, 3], [3, 1], [3, 4], [5, 3], [4, 2], [3, 0], [2, 0]),
          rootPitchClasses: [8, 0, 3, 6, 7],
          caption: 'German sixth: ♭6 and ♯4 expand to the dominant octave.',
        },
      ),
    ),
  ],
  'chromatic-mediants-dim7': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('A♭3 C4 E♭4'), N('E4 G♯4 B4')],
        N('C4 E4 G4 A♭3 C4 E♭4 E4 G♯4 B4'),
        `Move from **C major** to **A♭ major** and then to **E major**. Both arrivals are **chromatic mediants**: the root moves by a third and the quality changes. C is common to C and A♭; E is common to C and E major. On guitar, use open C, an A♭ barre chord at the 4th fret, and an E major shape at the 4th fret.`,
        {
          tempo: 0.8,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [5, 4], [4, 6], [3, 6], [2, 5], [1, 4], [5, 0], [4, 2], [3, 2], [2, 1], [1, 0], [0, 0]),
          rootPitchClasses: [0, 8, 4],
          caption: 'C–A♭–E: roots a third apart, with common tones holding the line.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E♭4 G♭4 A4'), N('C4 E4 G4')],
        N('C4 E♭4 G♭4 A4 C4 E4 G4'),
        `**C°7** is C–E♭–G♭–A. It resolves to **C major** because C and G are common tones; E♭ rises to E and G♭ rises to G. Play the diminished seventh slowly, then release it into the plain triad. On guitar, use A string 3, D string 4, G string 5, B string 4 for the dim7, then the open C chord.`,
        {
          tempo: 0.85,
          guitarSpots: spots([4, 3], [3, 4], [2, 5], [1, 4], [4, 3], [3, 2], [2, 0], [1, 1]),
          rootPitchClasses: [0, 3, 6, 9],
          caption: 'Common-tone diminished seventh: two notes stay, two resolve by step.',
        },
      ),
    ),
  ],
  'enharmonic-modulation-pedal': [
    demo(
      0,
      progression(
        [N('A♭3 C4 E♭4 F♯4'), N('F♯3 A♯3 C♯4 E4'), N('B3 D♯4 F♯4')],
        N('A♭3 C4 E♭4 F♯4 F♯3 A♯3 C♯4 E4 B3 D♯4 F♯4'),
        `The **German sixth** in C, **A♭–C–E♭–F♯**, is enharmonically the **dominant seventh** of B, **F♯–A♯–C♯–E**. Respell the chord and it pulls to B minor. Play the same four pitches twice, then resolve to B–D♯–F♯. On piano, notice that the sound barely changes; only the spelling and destination change.`,
        {
          tempo: 0.8,
          guitarSpots: spots([5, 4], [4, 3], [3, 1], [3, 4], [5, 2], [4, 4], [3, 4], [2, 3], [5, 2], [4, 4], [3, 4], [2, 4]),
          rootPitchClasses: [8, 0, 3, 6, 11, 2, 4],
          caption: 'One chord, two spellings: German sixth becomes V7 of B.',
        },
      ),
    ),
    demo(
      1,
      progression(
        [N('C4 E4 G4'), N('C4 F4 A4'), N('C4 G4 B4'), N('C4 E4 G4')],
        N('C4 E4 G4 F4 A4 G4 B4 D4 E4 G4'),
        `Hold **C4** in the bass while the harmony moves **C–F/C–G/C–C**. The bass note is a **tonic pedal**: it stays home while the upper chords create tension and release. On piano, keep the left-hand C held through all four chords. On guitar, use a C shape and move the upper voices; the open C string can ring as the pedal.`,
        {
          tempo: 0.7,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [3, 3], [2, 2], [1, 1], [4, 3], [3, 0], [2, 0], [1, 0], [4, 3], [3, 2], [2, 0], [1, 1]),
          rootPitchClasses: [0, 5, 7],
          caption: 'Tonic pedal: one bass note anchors changing harmony.',
        },
      ),
    ),
  ],
};

export const chromaticCourse = course;
export const chromaticDemos = demos;
