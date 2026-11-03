import type { Course } from '../curriculum';
import { N, demo, line, rhythmSpec, spots, type ExpansionDemo } from './demoHelpers';
import { lesson, rhythmCount, rhythmDictation, section, seq, n, treble } from './helpers';

const course: Course = {
  id: 'rhythm-lab',
  title: 'Rhythm Lab',
  subtitle: 'Tuplets, syncopation, odd meters, and the feel behind the notes.',
  level: 'intermediate',
  glyph: '♬',
  color: '#c97b84',
  lessons: [
    lesson(
      'tuplets-syncopation',
      'Tuplets & Syncopation',
      'Fit three into two, then learn to lean on the spaces between beats.',
      10,
      [
        section(
          'Triplets, duplets, and tuplets',
          `A **triplet** fits three equal notes into the time normally taken by two. In 4/4, an eighth-note triplet divides one beat into three; a quarter-note triplet divides two beats into three. A **duplet** does the reverse in compound meter: two notes in the time of three.

The general term is **tuplet**. The ratio matters more than the bracket: 3:2, 2:3, 5:4, 7:4. Count the main beat steadily and subdivide it according to the ratio. Do not let the tuplet disturb the pulse.`,
          { rhythm: { items: [{ beats: 1 }, { beats: 1 }, { beats: 2 }] } },
        ),
        section(
          'Syncopation and anticipation',
          `**Syncopation** accents a weak beat or the space between beats. **Anticipation** arrives at the next chord early, usually on the last offbeat. A **tied** note across the barline is another way to hide the downbeat.

In pop, rock, and jazz the backbeat (beats 2 and 4) and the offbeat “and” carry the energy. In Latin music the **clave** organizes syncopation into a repeatable pattern. The test is simple: can you tap the pulse while the rhythm contradicts it?`,
          { rhythm: { items: [{ beats: 0.5 }, { beats: 0.5 }, { beats: 1 }, { beats: 0.5 }, { beats: 0.5 }, { beats: 1 }] } },
        ),
      ],
      [rhythmCount(8, 'rhythm-count-tuplets'), rhythmDictation(4, 'rhythm-dictation-syncopation')],
    ),
    lesson(
      'odd-meters-hemiola',
      'Odd Meters & Hemiola',
      'Count 5/8 and 7/8 without losing the pulse, then feel 3 against 2.',
      11,
      [
        section(
          'Additive meter',
          `**5/8** is usually grouped **2+3** or **3+2**, not five equal beats. **7/8** is commonly **2+2+3**, **3+2+2**, or **2+3+2**. The grouping is the meter's accent pattern, and it can change from bar to bar.

**Changing meter** (also called mixed meter) alternates bars of different lengths, as in much Balkan music and in Bartók. Write the grouping above the staff when it is not obvious, and count the larger beats rather than every eighth note.`,
          { rhythm: { items: [{ beats: 1 }, { beats: 1 }, { beats: 1.5 }, { beats: 1 }, { beats: 1 }, { beats: 1 }] } },
        ),
        section(
          'Hemiola',
          `A **hemiola** makes two bars of triple meter feel like three bars of duple, or vice versa. In 3/4, a 3:2 hemiola puts accents on beat 1 of the first bar and beat 2 of the second, creating a broad two-beat span.

The effect is common at cadences in Baroque and Classical music, and in salsa and Afro-Cuban music as a cross-rhythm. It is not a mistake in the meter; it is a temporary reinterpretation that resolves back into the written pulse.`,
        ),
      ],
      [rhythmCount(8, 'rhythm-count-odd-meters', [3, 4, 5]), rhythmDictation(4, 'rhythm-dictation-odd-meters')],
    ),
    lesson(
      'polyrhythm-groove',
      'Polyrhythm, Metric Modulation & Groove',
      'Layer conflicting pulses, then make a groove breathe.',
      12,
      [
        section(
          'Polyrhythm and polymeter',
          `**Polyrhythm** places two different subdivisions in the same span: the classic **3:2** puts three even notes against two. **Polymeter** goes further, layering two different meters at once — for example, 3/4 against 4/4 — so the barlines never align.

To practise 3:2, tap two slow beats with one hand and three even notes with the other. Say “not diff-i-cult” for the three and “pass the” for the two. Keep both patterns independent before adding instruments.`,
        ),
        section(
          'Swing, shuffle, and metric modulation',
          `**Swing** turns pairs of straight eighth notes into a long–short pattern. **Shuffle** is a similar trip feel, usually notated as a triplet with the middle note tied. The ratio is stylistic, not mathematical: it changes with tempo and genre.

**Metric modulation** changes tempo by reinterpreting a note value as the new beat — for example, a triplet eighth becomes the new quarter. **Rubato** is the opposite of a grid: time is stretched and returned expressively. Both require a pulse strong enough to be bent without collapsing.`,
          { rhythm: { items: [{ beats: 0.75 }, { beats: 0.25 }, { beats: 0.75 }, { beats: 0.25 }] } },
        ),
      ],
      [rhythmCount(8, 'rhythm-count-polyrhythm'), rhythmDictation(4, 'rhythm-dictation-groove')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'tuplets-syncopation': [
    demo(
      0,
      line(
        N('C4 D4 E4'),
        `Play **C–D–E** as a triplet in the space of one beat. On piano, use fingers 1–2–3 and keep the wrist steady. On guitar, play the high E string at frets 8, 10, and 12; the three notes should feel evenly spaced inside the same span that normally holds two eighth notes. Count “1–2–3” against a slow “1–2” pulse.`,
        {
          tempo: 0.33,
          pianoEnd: 84,
          guitarSpots: spots([0, 8], [0, 10], [0, 12]),
          rootPitchClasses: [0],
          caption: 'A triplet divides one beat into three equal parts.',
        },
      ),
    ),
    demo(
      1,
      rhythmSpec(
        [0.5, 0.5, 1, 0.5, 0.5, 1],
        N('C4 E4 G4 E4 C4 G3'),
        `Tap the pulse with your foot and play **C–E–G–E–C–G3** on the offbeats. The first two notes land between beats, so the rhythm pushes against the pulse before settling. On guitar, use the C chord shape and alternate the top two strings; on piano, keep the left hand playing steady quarter notes while the right hand syncopates.`,
        {
          tempo: 0.6,
          guitarSpots: spots([4, 3], [3, 2], [1, 1], [3, 2], [4, 3], [5, 3]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Syncopation accents the space between the beats.',
        },
      ),
    ),
  ],
  'odd-meters-hemiola': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4'),
        `Count **5/8** as **2+3**: play C–D, then E–F–G. On piano, accent the first note of each group and keep the five notes even. On guitar, play the same five notes on the high E string at frets 8, 10, 12, 13, and 15 — but the 15th fret is outside our displayed range, so use the B string 1st, 3rd, 5th, 6th, and 8th frets instead. The grouping, not the note count, creates the meter.`,
        {
          tempo: 0.45,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 6], [1, 8]),
          rootPitchClasses: [0],
          caption: '5/8 as 2+3: two-note group, then three-note group.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 D4 E4 F4 G4 A4 B4'),
        `Count **7/8** as **2+2+3**: C–D, E–F, G–A–B. Play it slowly and accent the first note of each group. On piano, the thumb lands on each group start. On guitar, use the B string at frets 1, 3, 5, 6, 8, 10, and 12; the last note is the octave C. Feel the three groups before you speed up.`,
        {
          tempo: 0.45,
          guitarSpots: spots([1, 1], [1, 3], [1, 5], [1, 6], [1, 8], [1, 10], [1, 12]),
          rootPitchClasses: [0],
          caption: '7/8 as 2+2+3: a broad three-note group closes the bar.',
        },
      ),
    ),
  ],
  'polyrhythm-groove': [
    demo(
      0,
      line(
        N('C4 D4 E4 G4 A4 B4'),
        `Layer **three** notes against **two**: play C–D–E while a partner taps two even beats, then G–A–B for the next cycle. A more practical version is to play the three-note group with the right hand and two bass notes with the left. On guitar, tap the low E string with the thumb on beats 1 and 2 while the fingers play the three-note group on the high strings.`,
        {
          tempo: 0.4,
          guitarSpots: spots([5, 3], [4, 2], [3, 0], [2, 0], [1, 1], [0, 0]),
          rootPitchClasses: [0],
          caption: '3:2 polyrhythm: three even notes against two beats.',
        },
      ),
    ),
    demo(
      1,
      rhythmSpec(
        [0.75, 0.25, 0.75, 0.25],
        N('C4 E4 G4 B4'),
        `Play a **swing** pair as long–short: C–E, then G–B. The first note takes roughly two thirds of the beat and the second one third. On piano, let the long note ring and release the short note early. On guitar, use the C and G chord tones on the B and high E strings; the rhythm should feel like a relaxed walk, not a triplet exercise.`,
        {
          tempo: 0.65,
          guitarSpots: spots([1, 1], [0, 0], [0, 3], [0, 7]),
          rootPitchClasses: [0, 4, 7, 11],
          caption: 'Swing: long–short pairs, not equal eighths.',
        },
      ),
    ),
  ],
};

export const rhythmCourse = course;
export const rhythmDemos = demos;
