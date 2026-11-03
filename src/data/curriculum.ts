import type { Accidental, Letter, RhythmItem } from '../lib/music';
import type { AudioSpec, ExerciseConfig, ExerciseSpec, StaffNoteSpec, StaffSpec } from '../lib/types';
import { EXPANSION_COURSES } from './expansion';

export type LevelId = 'foundations' | 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface LessonSection {
  heading?: string;
  body: string;
  staff?: StaffSpec;
  rhythm?: { items: RhythmItem[] };
  audio?: AudioSpec;
  audioLabel?: string;
  metronome?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  sections: LessonSection[];
  exercises: ExerciseSpec[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: LevelId;
  glyph: string;
  color: string;
  lessons: Lesson[];
}

export interface Level {
  id: LevelId;
  title: string;
  blurb: string;
}

export const LEVELS: Level[] = [
  { id: 'foundations', title: 'Foundations', blurb: 'Read the dots. Feel the pulse.' },
  { id: 'beginner', title: 'Beginner', blurb: 'Keys, chords, and the minor mode.' },
  { id: 'intermediate', title: 'Intermediate', blurb: 'Hear harmony. Name what you hear.' },
  { id: 'advanced', title: 'Advanced', blurb: 'Write and transcribe with intent.' },
  { id: 'master', title: 'Master', blurb: 'Think like a composer and analyst.' },
];

const note = (letter: Letter, octave: number, accidental: Accidental = 0): StaffNoteSpec => ({
  letter,
  accidental,
  octave,
});

const treble = (notes: StaffNoteSpec[], keySig?: StaffSpec['keySig']): StaffSpec => ({
  clef: 'treble',
  notes,
  keySig,
});

const bass = (notes: StaffNoteSpec[], keySig?: StaffSpec['keySig']): StaffSpec => ({
  clef: 'bass',
  notes,
  keySig,
});

const chordStaff = (clef: 'treble' | 'bass', notes: StaffNoteSpec[]): StaffSpec => ({
  clef,
  notes,
  chord: true,
});

const seq = (midis: number[], tempo = 0.6): AudioSpec => ({ midis, mode: 'sequence', tempo });
const block = (midis: number[]): AudioSpec => ({ midis, mode: 'chord' });
const chords = (items: number[][], tempo = 0.85): AudioSpec => ({ chords: items, mode: 'chord', tempo });
const rhythm = (...beats: number[]): { items: RhythmItem[] } => ({
  items: beats.map((value) => ({
    beats: value,
    dotted: value === 1.5 || value === 3,
    rest: value < 0,
  })),
});

const noteReading = (
  count: number,
  skill: string,
  clef: 'treble' | 'bass' | 'both',
  accidentals = false,
): ExerciseSpec => ({
  kind: 'note-reading',
  count,
  skills: [skill],
  config: { clef, accidentals },
  label: clef === 'both' ? 'Grand staff reading' : `${clef === 'treble' ? 'Treble' : 'Bass'} clef reading`,
});

const findNote = (count: number, skill: string, accidentals = false): ExerciseSpec => ({
  kind: 'find-note',
  count,
  skills: [skill],
  config: { accidentals },
  label: 'Find the note',
});

const earIntervals = (count: number, skill: string, intervals: number[]): ExerciseSpec => ({
  kind: 'interval-ear',
  count,
  skills: [skill],
  config: { intervals, direction: 'mixed' },
  label: 'Interval ear training',
});

const writtenIntervals = (count: number, writtenIntervals?: string[]): ExerciseSpec => ({
  kind: 'interval-id',
  count,
  skills: ['interval-id-written'],
  config: writtenIntervals ? { writtenIntervals } : {},
  label: 'Written intervals',
});

const earChords = (count: number, skill: string, qualities: string[]): ExerciseSpec => ({
  kind: 'chord-ear',
  count,
  skills: [skill],
  config: { qualities },
  label: 'Chord ear training',
});

const buildChords = (count: number, qualities: string[], skill = 'chord-build-triads'): ExerciseSpec => ({
  kind: 'chord-build',
  count,
  skills: [skill],
  config: { qualities },
  label: 'Build chords',
});

const inversions = (count: number, qualities: string[]): ExerciseSpec => ({
  kind: 'chord-inversion',
  count,
  skills: ['chord-inversion'],
  config: { qualities },
  label: 'Chord inversions',
});

const buildScales = (
  count: number,
  skill: string,
  scales: Array<'Major' | 'Natural minor' | 'Harmonic minor' | 'Melodic minor' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian' | 'Locrian'>,
): ExerciseSpec => ({
  kind: 'scale-build',
  count,
  skills: [skill],
  config: { scales },
  label: 'Build scales',
});

const keySigs = (
  count: number,
  skill: string,
  maxAccidentals: number,
  keyMode: 'major' | 'minor' | 'mixed' = 'major',
  keyType: 'sharp' | 'flat' | 'mixed' = 'mixed',
): ExerciseSpec => ({
  kind: 'key-signature',
  count,
  skills: [skill],
  config: { maxAccidentals, keyMode, keyType, clef: 'both' },
  label: 'Key signatures',
});

const rhythmCount = (count: number, skill: string, totalBeats = [2, 3, 4]): ExerciseSpec => ({
  kind: 'rhythm-count',
  count,
  skills: [skill],
  config: { totalBeats },
  label: 'Rhythm counting',
});

const rhythmDictation = (count: number): ExerciseSpec => ({
  kind: 'rhythm-dictation',
  count,
  skills: ['rhythm-dictation'],
  label: 'Rhythm dictation',
});

const melodyDictation = (count: number): ExerciseSpec => ({
  kind: 'melody-dictation',
  count,
  skills: ['melody-dictation'],
  label: 'Melodic dictation',
});

const degrees = (
  count: number,
  scale: 'Major' | 'Natural minor' | 'Dorian' | 'Mixolydian' = 'Major',
  skill = 'degree-ear-major',
): ExerciseSpec => ({
  kind: 'degree-ear',
  count,
  skills: [skill],
  config: { scales: [scale] },
  label: 'Scale degrees',
});

const progressions = (count: number, labels?: string[]): ExerciseSpec => ({
  kind: 'progression-ear',
  count,
  skills: ['progression-ear-cadences'],
  config: labels ? { progressions: labels } : {},
  label: 'Chord progressions',
});

export const COURSES: Course[] = [
  // ───────────────────────────── FOUNDATIONS ─────────────────────────────
  {
    id: 'staff-pitch',
    title: 'Pitch & the Staff',
    subtitle: 'From raw sound to notes you can name and find.',
    level: 'foundations',
    glyph: '𝄞',
    color: '#e6b566',
    lessons: [
      {
        id: 'sound-pitch-keyboard',
        title: 'Sound, Pitch & the Keyboard',
        summary: 'How pitch works, and how the twelve-note keyboard is laid out.',
        minutes: 8,
        sections: [
          {
            heading: 'Pitch is organized sound',
            body: `Music begins with vibration. A string, a column of air, or a speaker cone moves back and forth, and our ears read that motion as **pitch** — how high or low a sound feels.

Pitch is measured in hertz (Hz). The note we call A4 vibrates at 440 cycles per second, and the A an octave above it vibrates at 880 Hz. Double the frequency, and you get the same note in a higher register. That relationship — the **octave** — is the first map in music.`,
            audio: seq([57, 59, 61, 62, 64, 66, 68, 69], 0.32),
            audioLabel: 'Hear an A major scale from A3 to A4',
          },
          {
            heading: 'Twelve notes, repeating',
            body: `Western music divides each octave into **twelve equal steps** called semitones. On a piano you can see them directly: seven white keys and five black keys, then the pattern repeats.

- **Semitone:** the distance to the very next key, white or black.
- **Whole tone:** two semitones, skipping one key.
- **Octave:** twelve semitones; the same letter name returns.

The black keys come in groups of two and three. C is always the white key immediately to the left of a two-black-key group. From C, the white keys spell C–D–E–F–G–A–B and then C again.`,
            audio: seq([60, 62, 64, 65, 67, 69, 71, 72], 0.36),
            audioLabel: 'Hear C major, one octave',
          },
          {
            heading: 'Middle C and instrument ranges',
            body: `C4 — **middle C** — is the anchor between the piano's left and right hands. The piano runs from A0 to C8; the guitar's open strings sit between E2 and E4.

Every instrument lays the same twelve pitch classes out differently. A piano shows them as a keyboard; a guitar shows them as a grid of strings and frets. Learning one map deeply makes the other easier, because the notes themselves never change.`,
          },
        ],
        exercises: [
          findNote(6, 'find-note-natural', false),
          findNote(4, 'find-note-chromatic', true),
          noteReading(4, 'note-reading-treble', 'treble'),
        ],
      },
      {
        id: 'staff-and-clefs',
        title: 'The Five-Line Staff & Clefs',
        summary: 'How five lines turn pitch into a readable map.',
        minutes: 9,
        sections: [
          {
            heading: 'Lines, spaces, and height',
            body: `The **staff** is five horizontal lines with four spaces between them. Higher on the staff means higher in pitch. Notes on a line or in a space are placed according to their letter name.

A note on a line and the note in the space directly above it are one **diatonic step** apart — for example, C up to D. The staff shows letter relationships, not semitone distances; accidentals handle the half steps later.`,
            staff: treble([note('C', 4), note('D', 4), note('E', 4), note('F', 4), note('G', 4), note('A', 4), note('B', 4), note('C', 5)]),
          },
          {
            heading: 'The treble clef',
            body: `The **treble clef** (also called the G clef) spirals around the second line from the bottom and fixes that line as G4. It is used for higher sounds: the right hand of the piano, the violin, the flute, and most guitar music.

With G4 on the second line, the five lines from bottom to top spell **E–G–B–D–F**, and the four spaces spell **F–A–C–E**.`,
            staff: treble([note('G', 4)]),
          },
          {
            heading: 'The bass clef and the grand staff',
            body: `The **bass clef** (F clef) places F3 on the fourth line from the bottom; its two dots surround that line. It serves lower sounds: the piano's left hand, the cello, the bass, and the bassoon.

Stack treble and bass together and you get the **grand staff**. The gap between them is bridged by middle C, written on the first ledger line below the treble staff or the first ledger line above the bass staff.`,
            staff: bass([note('F', 3)]),
          },
        ],
        exercises: [
          noteReading(5, 'note-reading-treble', 'treble'),
          noteReading(5, 'note-reading-bass', 'bass'),
        ],
      },
      {
        id: 'treble-clef-reading',
        title: 'Reading the Treble Clef',
        summary: 'Lines, spaces, landmarks, and ledger lines — fluently.',
        minutes: 10,
        sections: [
          {
            heading: 'The five lines: E G B D F',
            body: `From bottom to top, the treble lines are **E4, G4, B4, D5, F5**. A common mnemonic is *Every Good Boy Deserves Fudge*.

The four spaces spell **F4, A4, C5, E5** — *FACE*. The space just below the staff is D4; the space just above is G5.`,
            staff: treble([note('E', 4), note('G', 4), note('B', 4), note('D', 5), note('F', 5)]),
          },
          {
            heading: 'Landmarks beat mnemonics',
            body: `Mnemonics help at first, but fluent readers use **landmarks**. Three are enough to start:

- **G4** sits on the second line, circled by the clef.
- **C5** sits in the third space, one octave above middle C.
- **F5** sits on the top line.

From a landmark, step up or down line-to-space. Reading becomes faster when you recognise intervals and shapes instead of reciting a poem for every note.`,
            staff: treble([note('C', 4), note('E', 4), note('G', 4), note('B', 4), note('D', 5), note('F', 5), note('A', 5)]),
          },
          {
            heading: 'Ledger lines',
            body: `Notes outside the five lines use **ledger lines** — short lines drawn above or below the staff. Middle C (C4) is the first ledger line below the treble staff; A5 is the first ledger line above.

Keep the line-space alternation going. C4 (ledger line), D4 (space below staff), E4 (first line), F4 (first space), and so on.`,
            staff: treble([note('C', 4), note('A', 5)]),
          },
        ],
        exercises: [noteReading(10, 'note-reading-treble', 'treble')],
      },
      {
        id: 'bass-clef-reading',
        title: 'Reading the Bass Clef',
        summary: 'The lower staff, from G2 to C4 and beyond.',
        minutes: 9,
        sections: [
          {
            heading: 'The five lines: G B D F A',
            body: `From bottom to top, the bass lines are **G2, B2, D3, F3, A3** — *Good Boys Do Fine Always*. The spaces spell **A2, C3, E3, G3** — *All Cows Eat Grass*.

The bass clef's F3 landmark sits on the fourth line, between the two dots of the clef symbol.`,
            staff: bass([note('G', 2), note('B', 2), note('D', 3), note('F', 3), note('A', 3)]),
          },
          {
            heading: 'Middle C from below',
            body: `The first ledger line above the bass staff is **C4**, the same middle C that appears below the treble staff. Learn that shared note and the two clefs stop feeling like separate languages.

Two more anchors: C3 is the second space from the bottom, and F3 is the fourth line. From those, step through the lines and spaces.`,
            staff: bass([note('C', 3), note('F', 3), note('C', 4)]),
          },
          {
            heading: 'Reading with both hands',
            body: `Piano music usually puts the melody in treble and the bass line in bass. When you read the grand staff, let your eyes settle on a landmark in each clef before you play.

- Left hand: bass clef, lower on the page.
- Right hand: treble clef, higher on the page.
- Middle C: the shared ledger-line meeting point.

Practice switching clefs in the same session. The mental gear-change is the skill.`,
          },
        ],
        exercises: [noteReading(10, 'note-reading-bass', 'bass')],
      },
      {
        id: 'accidentals-enharmonics',
        title: 'Accidentals & Enharmonics',
        summary: 'Sharps, flats, naturals — and two names for one key.',
        minutes: 9,
        sections: [
          {
            heading: 'Three accidentals',
            body: `An **accidental** changes a note by a semitone:

- **Sharp (♯)** raises the note by one semitone.
- **Flat (♭)** lowers it by one semitone.
- **Natural (♮)** cancels a previous sharp or flat within the bar.

Accidentals are written immediately before the note head. In modern notation they apply for the rest of the measure unless cancelled — a rule worth internalising early.`,
            staff: treble([note('F', 4), note('F', 4, 1), note('G', 4), note('G', 4, -1)]),
          },
          {
            heading: 'One pitch, two names',
            body: `C♯ and D♭ are the **same key** on a piano, and the same fret on a guitar. Notes with two names are called **enharmonic equivalents**.

- C♯ = D♭
- D♯ = E♭
- F♯ = G♭
- G♯ = A♭
- A♯ = B♭

The choice of spelling depends on context: a key signature, a chord, or the direction of a melodic line. E♭ is the flat third of C minor; D♯ is the raised fifth of G major. Same sound, different job.`,
            audio: seq([61, 61], 0.8),
            audioLabel: 'Hear C♯4 and D♭4 — the same pitch, played twice',
          },
          {
            heading: 'Reading accidentals in context',
            body: `When you read, first check the key signature, then respond to accidentals as local changes. A sharp in front of F means F♯ for that measure, regardless of the key signature.

On the instrument, find the accidental by moving one semitone from the natural note: sharp moves right/up, flat moves left/down on a piano; on guitar, sharp and flat move one fret up or down the same string.`,
          },
        ],
        exercises: [
          noteReading(6, 'note-reading-accidentals', 'both', true),
          findNote(5, 'find-note-chromatic', true),
        ],
      },
    ],
  },

  {
    id: 'rhythm-meter',
    title: 'Rhythm & Meter',
    subtitle: 'The pulse underneath every note.',
    level: 'foundations',
    glyph: '♩',
    color: '#79c7b8',
    lessons: [
      {
        id: 'beat-note-values',
        title: 'The Beat & Note Values',
        summary: 'Whole, half, quarter, and eighth notes — and how they relate.',
        minutes: 8,
        sections: [
          {
            heading: 'The pulse',
            body: `**Rhythm** is the organisation of sound in time. Its foundation is the **beat** — a steady pulse you could tap with your foot. Tempo tells you how fast that pulse moves; rhythm tells you what happens around it.

A **measure** (or bar) groups beats together. Barlines mark the groups, and the time signature tells you how many beats are in each one.`,
            metronome: true,
          },
          {
            heading: 'Note values are fractions',
            body: `Note values are relative: each one lasts half as long as the value above it.

- **Whole note** — 4 beats
- **Half note** — 2 beats
- **Quarter note** — 1 beat
- **Eighth note** — ½ beat
- **Sixteenth note** — ¼ beat

A note head tells you the pitch; the stem and flags tell you the duration. Hollow note heads are longer values; filled note heads are shorter.`,
            rhythm: rhythm(4, 2, 1, 0.5, 0.5),
          },
          {
            heading: 'Feel the hierarchy',
            body: `Clap a steady four-beat pulse. Now clap once every two beats (half notes), then once per beat (quarters), then twice per beat (eighths).

The pulse stays constant; the subdivision changes. Every rhythm exercise in this app is built on that idea: keep the grid, then place events on it.`,
            metronome: true,
          },
        ],
        exercises: [rhythmCount(8, 'rhythm-count-basic')],
      },
      {
        id: 'rests-dotted-notes',
        title: 'Rests, Dots & Ties',
        summary: 'Silence has rhythm too.',
        minutes: 8,
        sections: [
          {
            heading: 'Rests',
            body: `A **rest** is a measured silence. Each note value has a matching rest: whole rest, half rest, quarter rest, eighth rest.

Rests are not empty space to rush through. They shape phrasing and breathe life into a line. Count them exactly as you count notes.`,
            rhythm: rhythm(1, 1, 1, 1),
          },
          {
            heading: 'The dot adds half',
            body: `A dot after a note adds **half of that note's value**:

- Dotted half = 2 + 1 = **3 beats**
- Dotted quarter = 1 + ½ = **1.5 beats**
- Dotted whole = 4 + 2 = **6 beats**

In 4/4, a dotted half fills three beats and leaves one. A dotted quarter often pairs with an eighth to complete a beat.`,
            rhythm: rhythm(3, 1),
          },
          {
            heading: 'Ties',
            body: `A **tie** joins two notes of the same pitch into one longer sound. Unlike a dot, a tie can cross a barline. It is also how you write a duration that no single note value can express, such as a note lasting 1½ beats across two beats.

When counting, add the tied values together but do not re-articulate the second note.`,
          },
        ],
        exercises: [
          rhythmCount(6, 'rhythm-count-dotted'),
          rhythmCount(4, 'rhythm-count-basic'),
        ],
      },
      {
        id: 'time-signatures',
        title: 'Time Signatures',
        summary: '4/4, 3/4, 2/4, and the feel of a meter.',
        minutes: 9,
        sections: [
          {
            heading: 'Two numbers, two jobs',
            body: `A **time signature** appears at the start of a piece. The top number tells you how many beats are in a bar. The bottom number tells you which note value gets one beat.

- **4/4:** four quarter-note beats per bar — the common march/pop feel.
- **3/4:** three quarter-note beats — the waltz.
- **2/4:** two quarter-note beats — the march.
- **6/8:** six eighth-note beats, felt as two groups of three.

The bottom number is a fraction denominator: 4 means quarter notes, 8 means eighth notes.`,
            metronome: true,
          },
          {
            heading: 'Strong and weak beats',
            body: `Meter is more than counting. Beats have weight. In 4/4, beat 1 is strongest, beat 3 is secondary, and beats 2 and 4 are weaker. In 3/4, beat 1 leads and beats 2–3 follow.

Players naturally lean on strong beats. Composers play with that expectation through **syncopation** — accenting weak beats or offbeats.`,
            rhythm: rhythm(1, 1, 2),
          },
          {
            heading: 'Simple and compound',
            body: `Meters that divide the beat into two are **simple** (2/4, 3/4, 4/4). Meters that divide the beat into three are **compound** (6/8, 9/8, 12/8).

6/8 is not the same feel as 3/4. In 3/4 there are three quarter-note beats, each divisible into two eighths; in 6/8 there are six eighth-note units grouped into two broad beats, each split into three. Clap **1 – 2 – 3 – 4 – 5 – 6** with weight on 1 and 4, then compare it with **1 – 2 – 3** in 3/4. On guitar, strum a C chord twice per 6/8 bar and three times per 3/4 bar; the arm feels the difference immediately.`,
            audio: block([60, 64, 67]),
            audioLabel: 'Hear a C major triad — one pulse, many possible groupings',
          },
        ],
        exercises: [rhythmCount(8, 'rhythm-count-basic', [2, 3, 4])],
      },
      {
        id: 'subdivision-counting',
        title: 'Subdivision & Counting Aloud',
        summary: 'Eighth notes, the “and” grid, and steady internal time.',
        minutes: 9,
        sections: [
          {
            heading: 'The “and” grid',
            body: `Count quarter notes as **1 2 3 4**. Between each pair, place an eighth note on the **“and”**: **1 & 2 & 3 & 4 &**.

This spoken grid is the single most useful rhythm skill you can build. Every note value can be located on it:

- Quarter note: on the number.
- Eighth note: on the number or the “and”.
- Dotted quarter: on the number, held through the next “and”.
- Half note: on the number, held through the next number.`,
            rhythm: rhythm(0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1),
            metronome: true,
          },
          {
            heading: 'Sixteenths',
            body: `Divide each eighth in half again and you get sixteenths: **1 e & a 2 e & a**. You will not need to count sixteenths aloud forever, but the grid clarifies difficult figures.

When a rhythm looks confusing, slow the tempo until every subdivision is visible, then speed up without changing the proportions.`,
          },
          {
            heading: 'Practice with a metronome',
            body: `Set a slow tempo — around 60–70 BPM. Count one full bar aloud before playing. Keep the counting going even when you stop playing; the internal clock is the real instrument.

Try this loop: four quarter notes, eight eighth notes, two half notes, one whole note. Same bar length every time.`,
            metronome: true,
          },
        ],
        exercises: [
          rhythmCount(6, 'rhythm-count-dotted'),
          rhythmCount(4, 'rhythm-count-basic', [3, 4, 6]),
        ],
      },
    ],
  },

  {
    id: 'intervals-scales',
    title: 'Intervals & First Scales',
    subtitle: 'Distance is the grammar of melody.',
    level: 'foundations',
    glyph: '↕',
    color: '#d99a7a',
    lessons: [
      {
        id: 'half-whole-steps',
        title: 'Half Steps & Whole Steps',
        summary: 'The two smallest distances, and how scales are built from them.',
        minutes: 8,
        sections: [
          {
            heading: 'The semitone',
            body: `A **semitone** (half step) is the smallest distance in Western music. On a piano it is the very next key, black or white. On a guitar it is one fret.

E–F and B–C are the natural semitones among the white keys. Every other pair of adjacent white keys is two semitones apart.`,
            staff: treble([note('E', 4), note('F', 4), note('B', 4), note('C', 5)]),
            audio: seq([64, 65, 71, 72], 0.7),
            audioLabel: 'Hear E–F and B–C, each one semitone',
          },
          {
            heading: 'The whole tone',
            body: `Two semitones make a **whole tone** (whole step). C–D, D–E, F–G, G–A, and A–B are whole tones.

Think of it as skipping one key: C to D skips C♯/D♭. On guitar, a whole step is two frets.`,
            staff: treble([note('C', 4), note('D', 4), note('F', 4), note('G', 4)]),
            audio: seq([60, 62, 65, 67], 0.7),
            audioLabel: 'Hear C–D and F–G, each a whole tone',
          },
          {
            heading: 'Why steps matter',
            body: `Scales are recipes of whole and half steps. Change one step and the scale changes character. The major scale, for example, is:

**W–W–H–W–W–W–H**

That pattern is the source of every major key. Learn to hear and measure steps, and the rest of scale theory becomes bookkeeping rather than memorisation.`,
          },
        ],
        exercises: [writtenIntervals(6, ['Minor 2nd', 'Major 2nd']), findNote(4, 'find-note-chromatic', true)],
      },
      {
        id: 'major-perfect-intervals',
        title: 'Major & Perfect Intervals',
        summary: 'Seconds, thirds, fourths, fifths, and octaves.',
        minutes: 10,
        sections: [
          {
            heading: 'Number plus quality',
            body: `An **interval** is the distance between two pitches. Its name has two parts:

- The **number** counts letter names inclusively: C to E is a third (C–D–E).
- The **quality** (major, minor, perfect, augmented, diminished) measures the exact semitones.

The main perfect intervals are the **unison (0), perfect 4th (5), perfect 5th (7), and octave (12)** semitones. The major intervals are the **2nd (2), 3rd (4), 6th (9), and 7th (11)**.`,
            staff: treble([note('C', 4), note('E', 4), note('G', 4), note('C', 5)]),
            audio: seq([60, 64, 60, 67, 60, 72], 0.7),
            audioLabel: 'Hear C–E, C–G, and C–C — third, fifth, octave',
          },
          {
            heading: 'Anchor the sounds',
            body: `Ear training gets easier when each interval has a reference:

- **Major 2nd:** the first two notes of *Happy Birthday*.
- **Major 3rd:** the opening of *When the Saints Go Marching In*.
- **Perfect 4th:** *Here Comes the Bride*.
- **Perfect 5th:** *Twinkle, Twinkle, Little Star*.
- **Octave:** *Somewhere Over the Rainbow*.

Use references temporarily. The goal is to hear the distance directly, not to sing a song in your head forever.`,
            audio: seq([60, 62, 60, 64, 60, 65, 60, 67, 60, 72], 0.42),
            audioLabel: 'Hear the reference intervals from C',
          },
          {
            heading: 'Inverting intervals',
            body: `Flip an interval upside down and its number and quality transform. A major 3rd inverts to a minor 6th; a perfect 5th inverts to a perfect 4th; an octave inverts to a unison.

The rule: **number + inverted number = 9**, and major ↔ minor, augmented ↔ diminished, perfect stays perfect. This is why a chord's third and sixth can describe the same pair of notes from different roots.`,
          },
        ],
        exercises: [
          earIntervals(6, 'interval-ear-basic', [2, 3, 4, 5, 7, 12]),
          writtenIntervals(4, ['Major 2nd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave']),
        ],
      },
      {
        id: 'minor-diminished-intervals',
        title: 'Minor, Diminished & Augmented',
        summary: 'The darker, tenser colours of interval space.',
        minutes: 10,
        sections: [
          {
            heading: 'Minor intervals',
            body: `Lower a major interval by one semitone and it becomes **minor**:

- Major 2nd (2) → minor 2nd (1)
- Major 3rd (4) → minor 3rd (3)
- Major 6th (9) → minor 6th (8)
- Major 7th (11) → minor 7th (10)

Minor intervals carry much of the sadness and tension in tonal music. The minor 3rd is the core of every minor triad.`,
            audio: seq([60, 63, 60, 64], 0.7),
            audioLabel: 'Hear C–E♭ (minor 3rd) against C–E (major 3rd)',
          },
          {
            heading: 'The tritone',
            body: `Six semitones — three whole tones — make the **tritone**. It is exactly half an octave, and it sounds restless and unresolved.

The tritone is the engine of the dominant seventh chord: between the third and seventh of a V7, it wants to resolve inward or outward. It can be spelled as an **augmented 4th** (C–F♯) or a **diminished 5th** (C–G♭), depending on context.`,
            staff: treble([note('C', 4), note('F', 4, 1)]),
            audio: block([60, 66]),
            audioLabel: 'Hear the tritone C–F♯',
          },
          {
            heading: 'Augmented and diminished',
            body: `Widen a perfect or major interval by a semitone and it becomes **augmented**. Narrow a perfect or minor interval by a semitone and it becomes **diminished**.

- Augmented 4th: 6 semitones (C–F♯)
- Diminished 5th: 6 semitones (C–G♭)
- Augmented 5th: 8 semitones (C–G♯)
- Diminished 7th: 9 semitones (C–B𝄫, enharmonically C–A)

Same distance, different spelling, different musical meaning.`,
          },
        ],
        exercises: [
          earIntervals(6, 'interval-ear-all', [1, 3, 6, 8, 10, 11]),
          writtenIntervals(4, [
            'Minor 2nd',
            'Minor 3rd',
            'Minor 6th',
            'Minor 7th',
            'Augmented 4th',
            'Diminished 5th',
            'Augmented 5th',
            'Diminished 7th',
          ]),
        ],
      },
      {
        id: 'interval-ear-lab',
        title: 'Interval Ear Lab',
        summary: 'A focused session: hear it, name it, sing it back.',
        minutes: 12,
        sections: [
          {
            heading: 'Three listening passes',
            body: `When an interval plays, listen in three passes:

1. **Shape:** is the second note higher, lower, or simultaneous?
2. **Size:** small (2nd/3rd), medium (4th/5th), or wide (6th/7th/octave)?
3. **Colour:** major/minor or perfect/tritone?

Name the interval only after those passes. Guessing from a single impression trains nothing.`,
            audio: seq([60, 67, 60, 63, 60, 68], 0.75),
            audioLabel: 'Three intervals to classify',
          },
          {
            heading: 'Sing the bridge',
            body: `If two notes are played together, sing from the lower note to the upper note. The physical act of producing the interval builds an internal model that passive listening cannot.

Start with a drone on C. Sing and hold each interval above it: C–D, C–E, C–F, C–G, C–A, C–B, C–C. Then try naming random intervals while the drone continues.`,
            audio: seq([60], 1),
            audioLabel: 'A C4 drone to sing against',
          },
          {
            heading: 'Daily dose beats marathon',
            body: `Ten focused minutes a day outperforms an hour once a week. Keep a small set of intervals in rotation, add one new one only when the current set feels solid, and always revisit old ones.

Mistakes are information. Ask which part of the three-pass routine failed: did you misjudge size, or did you choose the wrong quality?`,
          },
        ],
        exercises: [earIntervals(10, 'interval-ear-all', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
      },
      {
        id: 'major-scale',
        title: 'The Major Scale',
        summary: 'Seven notes, one pattern, every key.',
        minutes: 10,
        sections: [
          {
            heading: 'The pattern',
            body: `The major scale is built with **W–W–H–W–W–W–H** — whole, whole, half, whole, whole, whole, half. Starting on C, that pattern uses only white keys: **C D E F G A B C**.

The half steps land between E–F and B–C, which is why those pairs sit a semitone apart on the keyboard.`,
            staff: treble([note('C', 4), note('D', 4), note('E', 4), note('F', 4), note('G', 4), note('A', 4), note('B', 4), note('C', 5)]),
            audio: seq([60, 62, 64, 65, 67, 69, 71, 72], 0.5),
            audioLabel: 'Hear the C major scale',
          },
          {
            heading: 'Scale degrees',
            body: `Each note of the scale has a **degree**:

1. **Tonic** — home.
2. **Supertonic** — a step away.
3. **Mediant** — defines major or minor.
4. **Subdominant** — moves away from home.
5. **Dominant** — the strongest pull back.
6. **Submediant** — relative minor territory.
7. **Leading tone** — a semitone below the tonic, leaning upward.

Melodies are stories told with these degrees. The tonic feels final; the leading tone feels unfinished.`,
          },
          {
            heading: 'Transposing the pattern',
            body: `Start the same pattern on G and you need F♯ to keep the half step in the right place: **G A B C D E F♯ G**. Start on F and you need B♭.

That is the origin of key signatures: the set of sharps or flats required to preserve the major pattern. Learn the pattern once and you can generate every major scale.`,
            staff: treble([note('G', 4), note('A', 4), note('B', 4), note('C', 5), note('D', 5), note('E', 5), note('F', 5, 1), note('G', 5)]),
          },
        ],
        exercises: [
          buildScales(6, 'scale-build-major', ['Major']),
          degrees(4),
          noteReading(3, 'note-reading-treble', 'treble'),
        ],
      },
    ],
  },

  // ───────────────────────────── BEGINNER ─────────────────────────────
  {
    id: 'key-signatures',
    title: 'Key Signatures & the Circle of Fifths',
    subtitle: 'The map that tells you which notes belong.',
    level: 'beginner',
    glyph: '♯',
    color: '#8fb8e8',
    lessons: [
      {
        id: 'order-of-sharps',
        title: 'The Order of Sharps',
        summary: 'One fixed sequence unlocks every sharp key.',
        minutes: 9,
        sections: [
          {
            heading: 'A shorthand, not decoration',
            body: `A **key signature** is the group of sharps or flats placed after the clef at the start of a piece. It tells you which notes are permanently altered in that key, so the music does not need an accidental on every F♯.

Sharps always appear in the same order: **F, C, G, D, A, E, B**. A key with one sharp has F♯; a key with two has F♯ and C♯; a key with three adds G♯, and so on.`,
            staff: treble([], { count: 3, type: 'sharp' }),
          },
          {
            heading: 'Finding the major key',
            body: `For sharp keys, the **last sharp is the leading tone** — a semitone below the tonic. Go up one semitone from the last sharp and you have the major key.

- 1 sharp (F♯) → **G major**
- 2 sharps (F♯, C♯) → **D major**
- 3 sharps (F♯, C♯, G♯) → **A major**
- 4 sharps (F♯, C♯, G♯, D♯) → **E major**

The sequence continues to B (5), F♯ (6), and C♯ (7).`,
            staff: treble([], { count: 4, type: 'sharp' }),
          },
          {
            heading: 'Reading tip',
            body: `Do not count sharps one by one while playing. Recognise the whole signature at a glance, then let the key's scale live in your hand.

At the instrument, play the major scale of the key before reading a piece in it. The signature stops being an abstract list and becomes a physical pattern.`,
          },
        ],
        exercises: [keySigs(7, 'key-signature-sharps', 4, 'major', 'sharp')],
      },
      {
        id: 'order-of-flats',
        title: 'The Order of Flats',
        summary: 'The mirror sequence, from B♭ to F♭.',
        minutes: 9,
        sections: [
          {
            heading: 'The flat order',
            body: `Flats appear in the reverse cycle: **B, E, A, D, G, C, F**.

- 1 flat (B♭) → **F major**
- 2 flats (B♭, E♭) → **B♭ major**
- 3 flats (B♭, E♭, A♭) → **E♭ major**
- 4 flats (B♭, E♭, A♭, D♭) → **A♭ major**`,
            staff: treble([], { count: 3, type: 'flat' }),
          },
          {
            heading: 'Finding the major key',
            body: `For two or more flats, the **second-to-last flat is the tonic**. With B♭ and E♭, the second-to-last flat is B♭ — so the key is B♭ major. With four flats, the second-to-last is A♭.

F major is the exception: with only one flat, there is no second-to-last flat. Memorise **one flat = F major** as a special case.`,
            staff: treble([], { count: 4, type: 'flat' }),
          },
          {
            heading: 'Hearing flat keys',
            body: `Flat keys have a distinct physical layout. B♭ major uses two black keys (B♭ and E♭), while B major uses all five; on the piano the hand sits differently even though the interval pattern is identical. On guitar, B♭ major can be played from the A string 1st fret through the D string 8th fret, while B major shifts the same shape up one fret.

Play a B♭ major scale and a B major scale back to back. Same pattern, different physical layout. Many players describe flat keys as rounder, but that impression comes from fingering and register as much as from the notes themselves.`,
            audio: seq([58, 60, 62, 63, 65, 67, 69, 70], 0.38),
            audioLabel: 'Hear a B♭ major scale',
          },
        ],
        exercises: [keySigs(7, 'key-signature-flats', 4, 'major', 'flat')],
      },
      {
        id: 'circle-of-fifths',
        title: 'The Circle of Fifths',
        summary: 'Twelve keys arranged by perfect fifths.',
        minutes: 10,
        sections: [
          {
            heading: 'Clockwise by fifths',
            body: `Move up a perfect fifth from C and you reach G. Another fifth gives D, then A, E, B, F♯, C♯. Each step adds one sharp on the way around.

Move in the other direction — down a fifth, or up a fourth — and you add flats: C, F, B♭, E♭, A♭, D♭, G♭, C♭.

The **circle of fifths** arranges all twelve major keys in that order. Neighbouring keys share six of their seven notes, which is why they sound closely related.`,
          },
          {
            heading: 'Relative minors inside the circle',
            body: `Every major key has a **relative minor** a minor third below, sharing its key signature. C major and A minor sit together; G major and E minor; F major and D minor.

The full circle therefore contains twenty-four labels — twelve major and twelve relative minor — but only twelve key signatures. The inner ring of the circle is the minor side.`,
          },
          {
            heading: 'Why it matters',
            body: `The circle predicts:

- **Which chords are diatonic** to a key.
- **Where modulation is easy** — to a neighbour, often via a pivot chord.
- **Which accidentals** a key needs.
- **How far** a key is from home: one step is close, six steps is maximally distant.

Memorise the circle as a shape, not a recitation. Sketch it once a day for a week and it will stick.`,
            staff: treble([], { count: 2, type: 'sharp' }),
          },
        ],
        exercises: [
          keySigs(6, 'key-signature-relative', 7, 'mixed'),
          earIntervals(4, 'interval-ear-basic', [7, 5]),
        ],
      },
      {
        id: 'relative-keys-reading',
        title: 'Relative Keys & Reading in Any Key',
        summary: 'Same signature, different home — plus a reading routine.',
        minutes: 10,
        sections: [
          {
            heading: 'Relative major and minor',
            body: `Relative keys share a key signature but have different tonics. To find the relative minor, go down a minor third from the major tonic — or to the sixth degree of the major scale.

- C major ↔ A minor
- G major ↔ E minor
- F major ↔ D minor
- B♭ major ↔ G minor

The tonic changes which note feels like home, even though the available notes are identical.`,
            staff: treble([], { count: 1, type: 'flat' }),
          },
          {
            heading: 'Signature first, tonic second',
            body: `When you open a piece, read the key signature before the first note. Then look at the final bass note and the first strong chord to confirm the key — the signature alone cannot distinguish a major key from its relative minor.

Accidentals still appear throughout the piece, usually as chromatic colour or as raised leading tones in minor.`,
          },
          {
            heading: 'A reading routine',
            body: `Use this four-step routine for every new piece:

1. Name the key signature and both relative keys.
2. Scan for accidentals and repeated rhythmic figures.
3. Find the hardest bar and isolate it.
4. Read slowly enough that mistakes are rare.

Speed is a by-product of accuracy, not a separate skill.`,
          },
        ],
        exercises: [
          keySigs(6, 'key-signature-relative', 4, 'mixed'),
          noteReading(4, 'note-reading-accidentals', 'both', true),
        ],
      },
    ],
  },

  {
    id: 'triads-chords',
    title: 'Triads & Chords',
    subtitle: 'Three notes that can carry a whole song.',
    level: 'beginner',
    glyph: '♬',
    color: '#c7a3e8',
    lessons: [
      {
        id: 'major-minor-triads',
        title: 'Major & Minor Triads',
        summary: 'Stacked thirds, two qualities, countless songs.',
        minutes: 10,
        sections: [
          {
            heading: 'What a triad is',
            body: `A **triad** is three notes stacked in thirds: a **root**, a **third**, and a **fifth**. The root gives the chord its name; the third decides major or minor; the fifth stabilises the sound.

- **Major triad:** root + major 3rd (4 semitones) + perfect 5th (7 semitones). Example: C–E–G.
- **Minor triad:** root + minor 3rd (3 semitones) + perfect 5th. Example: C–E♭–G.

The only difference is the third — one semitone changes the entire emotional colour.`,
            staff: chordStaff('treble', [note('C', 4), note('E', 4), note('G', 4)]),
            audio: chords([[60, 64, 67], [60, 63, 67]]),
            audioLabel: 'Hear C major then C minor',
          },
          {
            heading: 'Build them anywhere',
            body: `On a piano, find the root, count four semitones for a major third or three for a minor third, then count seven semitones from the root for the fifth.

On a guitar, the familiar open C, G, D, A, and E shapes are major triads. To hear the third move, compare A major \`x 0 2 2 2 0\` with A minor \`x 0 2 2 1 0\`: the only change is the B string, from the 2nd fret to the 1st. Barre chords move the same shapes across the neck, so one fingering gives you all twelve roots.

In notation, the root is not always the lowest note. That is a question of inversion, coming next.`,
          },
          {
            heading: 'Symbols you will see',
            body: `Chord symbols are shorthand:

- **C** = C major triad
- **Cm** = C minor triad
- **C°** = C diminished
- **C+** = C augmented
- **Cmaj7**, **C7**, **Cm7** = seventh chords (later)

Lead sheets use these symbols above the melody. Learning to read them is a separate skill from reading the staff, but both describe the same harmony.`,
          },
        ],
        exercises: [
          buildChords(6, ['Major', 'Minor']),
          earChords(4, 'chord-ear-triads', ['Major', 'Minor']),
        ],
      },
      {
        id: 'diminished-augmented',
        title: 'Diminished & Augmented Triads',
        summary: 'Two symmetrical chords that lean and destabilise.',
        minutes: 8,
        sections: [
          {
            heading: 'Diminished',
            body: `A **diminished triad** stacks two minor thirds: root + minor 3rd + diminished 5th. Example: **B–D–F**.

It sounds tense and unstable. In a major key it appears naturally on the seventh degree (vii°), where it functions as a dominant substitute pulling strongly to the tonic.`,
            staff: chordStaff('treble', [note('B', 3), note('D', 4), note('F', 4)]),
            audio: block([59, 62, 65]),
            audioLabel: 'Hear B diminished',
          },
          {
            heading: 'Augmented',
            body: `An **augmented triad** stacks two major thirds: root + major 3rd + augmented 5th. Example: **C–E–G♯**.

Both chords are symmetrical: a diminished triad stacks two minor thirds, and an augmented triad stacks two major thirds. Their seventh-chord forms extend the same pattern around the octave. Because of that symmetry, they can be reinterpreted in several keys, which makes them useful for modulations and film-score suspense.`,
            staff: chordStaff('treble', [note('C', 4), note('E', 4), note('G', 4, 1)]),
            audio: block([60, 64, 68]),
            audioLabel: 'Hear C augmented',
          },
          {
            heading: 'Where they live',
            body: `Diatonic triads in a major key give you exactly one diminished chord (vii°) and no augmented chord. Augmented triads usually appear as chromatic alterations, often on the dominant.

In a minor key, the raised seventh of harmonic minor creates an augmented chord on the third degree — one reason minor-key harmony feels richer than a simple scale suggests.`,
          },
        ],
        exercises: [
          earChords(6, 'chord-ear-triads', ['Major', 'Minor', 'Diminished', 'Augmented']),
          buildChords(4, ['Diminished', 'Augmented']),
        ],
      },
      {
        id: 'chord-inversions',
        title: 'Inversions',
        summary: 'Same chord, different bass note, different weight.',
        minutes: 9,
        sections: [
          {
            heading: 'Bass note decides',
            body: `A chord's **inversion** is determined by which chord tone is in the bass:

- **Root position:** root in the bass (C–E–G). Stable, final.
- **First inversion:** third in the bass (E–G–C). Lighter, mobile.
- **Second inversion:** fifth in the bass (G–C–E). Suspended, needing resolution.

The notes are the same; only their vertical order changes.`,
            staff: chordStaff('treble', [note('E', 4), note('G', 4), note('C', 5)]),
            audio: chords([[60, 64, 67], [64, 67, 72]]),
            audioLabel: 'Hear C major root position then first inversion',
          },
          {
            heading: 'Figured bass labels',
            body: `In classical notation, inversions are shown with figures:

- Root position: no figure (or 5/3).
- First inversion: **6**.
- Second inversion: **6/4**.

A "I6" is a tonic chord in first inversion. A "V6/4" is a dominant chord in second inversion. These labels describe intervals above the bass, not chord quality.`,
          },
          {
            heading: 'Why inversions matter',
            body: `Inversions create smooth bass lines. Instead of jumping C–F–G–C in root position, a pianist might play C–F/A–G–C/E, keeping the bass moving stepwise.

On guitar, inversions appear as smaller three-note shapes on the top strings. They are how you voice a chord progression without every chord sounding like a block.`,
          },
        ],
        exercises: [
          inversions(5, ['Major', 'Minor']),
          earChords(3, 'chord-ear-triads', ['Major', 'Minor']),
          buildChords(3, ['Major', 'Minor', 'Diminished']),
        ],
      },
      {
        id: 'diatonic-chords',
        title: 'Chords in a Key',
        summary: 'The seven triads every major key provides.',
        minutes: 10,
        sections: [
          {
            heading: 'One scale, seven triads',
            body: `Build a triad on each degree of a major scale using only notes from that scale, and you get a fixed pattern of qualities:

**I – ii – iii – IV – V – vi – vii°**

In C major: C – Dm – Em – F – G – Am – B°.

The major chords are I, IV, and V; the minor chords are ii, iii, and vi; vii° is diminished. Every major key follows this pattern.`,
          },
          {
            heading: 'The three pillars',
            body: `I, IV, and V are the primary chords. They contain every note of the scale and can harmonise most simple melodies.

- **I** feels like home.
- **IV** opens outward.
- **V** creates the strongest pull back to I.

The secondary chords ii, iii, and vi add colour and motion. ii–V–I is the backbone of jazz; I–vi–IV–V powers countless pop songs.`,
            audio: chords([[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]]),
            audioLabel: 'Hear I–IV–V–I in C major',
          },
          {
            heading: 'Roman numerals',
            body: `Roman numerals describe chords relative to the key, not absolute pitch. This lets you transpose a progression instantly: **I–V–vi–IV** means C–G–Am–F in C, and D–A–Bm–G in D.

Uppercase = major, lowercase = minor, ° = diminished. Later you will meet 7 after a numeral (V7) and accidentals before it (♭VII).`,
          },
        ],
        exercises: [
          earChords(5, 'chord-ear-triads', ['Major', 'Minor', 'Diminished']),
          buildChords(4, ['Major', 'Minor', 'Diminished']),
          progressions(4),
        ],
      },
    ],
  },

  {
    id: 'minor-reading',
    title: 'Minor Keys & Reading Fluency',
    subtitle: 'The other mode, and both hands together.',
    level: 'beginner',
    glyph: '♭',
    color: '#e8a3b8',
    lessons: [
      {
        id: 'natural-minor',
        title: 'The Natural Minor Scale',
        summary: 'A major scale starting on the sixth degree.',
        minutes: 10,
        sections: [
          {
            heading: 'Relative minor',
            body: `Every major scale contains a natural minor scale starting on its sixth degree. A minor uses the same notes as C major, but treats A as home: **A B C D E F G A**.

The step pattern is **W–H–W–W–H–W–W**, and the scale degrees are **1, 2, ♭3, 4, 5, ♭6, ♭7**. Those three flats relative to major — the third, sixth, and seventh — give minor its darker colour.`,
            staff: treble([note('A', 3), note('B', 3), note('C', 4), note('D', 4), note('E', 4), note('F', 4), note('G', 4), note('A', 4)]),
            audio: seq([57, 59, 60, 62, 64, 65, 67, 69], 0.5),
            audioLabel: 'Hear the A natural minor scale',
          },
          {
            heading: 'The ♭3 and ♭7',
            body: `The **minor third** distances the tonic from the mediant and is the defining sound of minor. The **minor seventh** (♭7) gives natural minor its open, modal quality, especially in rock and folk.

Compare A minor and A major:

- A major: A B C♯ D E F♯ G♯
- A minor: A B C D E F G

Three notes change, and the emotional world changes with them.`,
            audio: chords([[57, 61, 64], [57, 60, 64]], 1.0),
            audioLabel: 'Hear A major then A minor',
          },
          {
            heading: 'Relative vs parallel',
            body: `**Relative minor** shares a key signature with a major key (C major / A minor). **Parallel minor** shares the same tonic but changes the signature (C major / C minor).

Parallel minor requires three flats relative to the major scale: C minor is C D E♭ F G A♭ B♭. Composers often move between parallel keys for dramatic effect.`,
          },
        ],
        exercises: [
          buildScales(6, 'scale-build-minor', ['Natural minor']),
          degrees(4, 'Natural minor', 'degree-ear-minor'),
        ],
      },
      {
        id: 'harmonic-melodic-minor',
        title: 'Harmonic & Melodic Minor',
        summary: 'Raise the seventh, or the sixth and seventh.',
        minutes: 10,
        sections: [
          {
            heading: 'Harmonic minor',
            body: `**Harmonic minor** raises the seventh degree by a semitone: A harmonic minor is **A B C D E F G♯ A**. The raised seventh creates a **leading tone** that pulls strongly to the tonic and makes the V chord major.

The cost is an augmented second between ♭6 and ♮7 (F to G♯ in A minor), which gives harmonic minor its exotic, dramatic sound.`,
            staff: treble([note('A', 3), note('B', 3), note('C', 4), note('D', 4), note('E', 4), note('F', 4), note('G', 4, 1), note('A', 4)]),
            audio: seq([57, 59, 60, 62, 64, 65, 68, 69], 0.5),
            audioLabel: 'Hear A harmonic minor',
          },
          {
            heading: 'Melodic minor',
            body: `**Melodic minor** raises both the sixth and seventh degrees when ascending: **A B C D E F♯ G♯ A**. Descending, it usually reverts to natural minor: G♮ F♮ E D C B A.

The ascending form smooths out the augmented second and creates a singing, almost major-sounding upper half. Jazz treats melodic minor as a fixed ascending scale used for improvisation over altered chords.`,
            audio: seq([57, 59, 60, 62, 64, 66, 68, 69, 67, 65, 64, 62, 60, 59, 57], 0.32),
            audioLabel: 'Hear A melodic minor ascending and natural descending',
          },
          {
            heading: 'Which minor when?',
            body: `Composers choose the form that serves the harmony:

- **Natural minor** for modal colour and rock/folk.
- **Harmonic minor** when a strong V–i cadence is needed.
- **Melodic minor** for smooth melodic lines rising toward the tonic.

All three belong to the same key. The signature stays the same; accidentals do the work.`,
          },
        ],
        exercises: [
          buildScales(6, 'scale-build-minor', ['Harmonic minor', 'Melodic minor']),
          earIntervals(4, 'interval-ear-all', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        ],
      },
      {
        id: 'minor-progressions',
        title: 'Minor Key Progressions',
        summary: 'i–iv–V–i, i–VI–III–VII, and the Andalusian sound.',
        minutes: 10,
        sections: [
          {
            heading: 'The minor pillars',
            body: `In a minor key, the primary chords are **i, iv, and V** (or v). The major V comes from harmonic minor and gives the strongest cadence; the minor v comes from natural minor and feels softer.

A classic minor cadence is **i–iv–V–i** in A minor: Am–Dm–E–Am.`,
            audio: chords([[57, 60, 64], [62, 65, 69], [64, 68, 71], [57, 60, 64]]),
            audioLabel: 'Hear i–iv–V–i in A minor',
          },
          {
            heading: 'Modal minor loops',
            body: `Not every minor progression needs a dominant. Common modal loops:

- **i–VI–III–VII** (Am–F–C–G): epic, cinematic.
- **i–VII–VI–V** (Am–G–F–E): the Andalusian cadence, with a Phrygian flavour.
- **i–iv–VII–III**: floating, folk-like.

Most of these loops avoid the leading tone, so the key feels open rather than fully resolved. The Andalusian cadence is the exception: its major V contains the leading tone, which is exactly what gives it such a strong pull.`,
          },
          {
            heading: 'Borrowed colours',
            body: `Minor keys borrow from their parallel major and from modes. The **Picardy third** raises the final tonic triad to major (A minor ending on A major), a common Baroque gesture.

Modern songwriters borrow ♭VI and ♭VII from minor into major keys for a darker chorus. Once you know the diatonic chords, every borrowed chord stands out as intentional colour.`,
          },
        ],
        exercises: [
          keySigs(4, 'key-signature-relative', 4, 'minor'),
          earChords(5, 'chord-ear-triads', ['Major', 'Minor', 'Diminished']),
          buildChords(4, ['Minor', 'Diminished']),
        ],
      },
      {
        id: 'grand-staff-reading',
        title: 'Reading Fluency: The Grand Staff',
        summary: 'Both clefs, both hands, fewer surprises.',
        minutes: 12,
        sections: [
          {
            heading: 'One map, two clefs',
            body: `The grand staff joins treble and bass with middle C in between. Fluent readers stop translating "treble note" and "bass note" separately; they see one continuous pitch space.

Landmarks that bridge the clefs:

- **C4** — ledger line below treble, ledger line above bass.
- **E4** — first line of treble.
- **F3** — fourth line of bass.
- **G4** — second line of treble, a fifth above C4.

Use intervals from landmarks rather than counting from the clef every time.`,
          },
          {
            heading: 'Read in chunks',
            body: `Do not read one note at a time. Read the **shape** of a bar: a third up, a step down, a leap of a fifth. The eye should take in a beat or a chord at a glance.

Practice with a metronome at a tempo slow enough to keep going. Stopping to fix every note builds hesitation; steady, imperfect reading builds fluency faster.`,
          },
          {
            heading: 'A daily sight-reading habit',
            body: `Five minutes a day with unfamiliar music beats an hour of repeating the same piece. Choose material one level below your playing level so that reading — not technique — is the bottleneck.

Before playing: name the key, scan the rhythm, find the highest and lowest notes, and mark the hard bar. Then read once without stopping.`,
          },
        ],
        exercises: [
          noteReading(8, 'note-reading-wide', 'both'),
          noteReading(4, 'note-reading-bass', 'bass'),
        ],
      },
    ],
  },

  // ───────────────────────────── INTERMEDIATE ─────────────────────────────
  {
    id: 'harmony-progressions',
    title: 'Harmony & Progressions',
    subtitle: 'Function, tension, and the pull toward home.',
    level: 'intermediate',
    glyph: '𝄢',
    color: '#9ed3a3',
    lessons: [
      {
        id: 'diatonic-functions',
        title: 'Diatonic Functions',
        summary: 'Tonic, subdominant, dominant — three jobs, seven chords.',
        minutes: 10,
        sections: [
          {
            heading: 'Chords have jobs',
            body: `In tonal harmony, every diatonic chord belongs to one of three **functions**:

- **Tonic (T):** home, rest, arrival. I, vi, and often iii.
- **Subdominant (S):** departure, preparation, opening outward. IV and ii.
- **Dominant (D):** tension, instability, the pull home. V and vii°.

Progressions move through these functions: **T → S → D → T** is the archetypal journey.`,
          },
          {
            heading: 'Why vi can be tonic',
            body: `vi shares two notes with I and can substitute for it, especially at the start of a phrase. ii shares two notes with IV and often replaces it for a smoother bass line. V and vii° both contain the leading tone, so both create dominant tension.

Function is about behaviour, not just the chord symbol. A Dm chord can feel like a soft IV substitute in C major, or a true ii preparing V.`,
          },
          {
            heading: 'Hearing function',
            body: `Train your ear to hear **departure and return**, not isolated chords. Play I–IV–V–I slowly and notice:

1. I feels settled.
2. IV feels like leaving.
3. V feels urgent.
4. I feels like release.

Once you can hear the four stations, chord identification becomes contextual.`,
            audio: chords([[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]]),
            audioLabel: 'Hear the T–S–D–T journey in C',
          },
        ],
        exercises: [
          earChords(4, 'chord-ear-triads', ['Major', 'Minor', 'Diminished']),
          progressions(6),
        ],
      },
      {
        id: 'cadences-ii-v-i',
        title: 'Cadences & the ii–V–I',
        summary: 'How phrases end, and the most useful progression in music.',
        minutes: 12,
        sections: [
          {
            heading: 'Four cadences',
            body: `A **cadence** is a harmonic arrival that ends a phrase.

- **Authentic:** V → I. Strong and final.
- **Half:** any chord → V. Suspended, waiting.
- **Plagal:** IV → I. Soft, "Amen".
- **Deceptive:** V → vi. The expected home is denied.

Cadences are punctuation. A phrase ending on V asks a question; one ending on I answers it.`,
            audio: chords([[65, 69, 72], [60, 64, 67], [67, 71, 74], [60, 64, 67]]),
            audioLabel: 'Hear IV–I, then V–I in C',
          },
          {
            heading: 'ii–V–I',
            body: `**ii–V–I** is the strongest three-chord cadence in tonal music. In C: Dm7 – G7 – Cmaj7.

The bass moves down a fifth, then down another fifth (or up a fourth). The seventh of ii resolves down to the third of V; the seventh of V resolves down to the third of I. Everything moves by step.

This progression is the engine of jazz standards, but it also appears in classical sonatas and pop ballads.`,
            audio: seq([62, 65, 69, 72, 67, 71, 74, 77, 60, 64, 67, 71], 0.55),
            audioLabel: 'Hear Dm7–G7–Cmaj7, arpeggiated',
          },
          {
            heading: 'Voice-leading the cadence',
            body: `Good voice leading makes ii–V–I sound inevitable. Keep common tones, move other voices by step, and resolve tendency tones:

- The seventh of V (F in G7) falls to E, the third of I.
- The leading tone of V (B in G7) rises to C.
- The fifth can stay or move.

On guitar, learn the ii–V–I in one position with smooth top-note motion. On piano, practise it in all twelve keys.`,
          },
        ],
        exercises: [progressions(9)],
      },
      {
        id: 'seventh-chords',
        title: 'Seventh Chords',
        summary: 'Adding the fourth note complicates and enriches harmony.',
        minutes: 11,
        sections: [
          {
            heading: 'Five essential sevenths',
            body: `A **seventh chord** adds a fourth note, a seventh above the root.

- **Major 7th (Cmaj7):** C–E–G–B. Dreamy, stable.
- **Minor 7th (Cm7):** C–E♭–G–B♭. Smooth, soft.
- **Dominant 7th (C7):** C–E–G–B♭. Tense, wants to resolve.
- **Half-diminished 7th (Cø7):** C–E♭–G♭–B♭. Moody, unstable.
- **Diminished 7th (C°7):** C–E♭–G♭–B𝄫. Symmetrical, dramatic.

The difference between maj7 and dominant 7 is one semitone: B versus B♭. That single note changes the chord's function completely.`,
            staff: chordStaff('treble', [note('C', 4), note('E', 4), note('G', 4), note('B', 4, -1)]),
            audio: chords([[60, 64, 67, 70], [60, 64, 67, 71]]),
            audioLabel: 'Hear C7 then Cmaj7',
          },
          {
            heading: 'The tritone engine',
            body: `A dominant seventh contains a **tritone** between its third and seventh: in G7, B and F. That interval is inherently unstable, and both notes resolve by step into the tonic chord.

This is why V7 → I feels so strong, and why a chain of dominant sevenths can pull the ear through several keys.`,
          },
          {
            heading: 'In the key',
            body: `Seventh chords occur naturally on every scale degree, with a fixed quality pattern in major: **Imaj7 – ii7 – iii7 – IVmaj7 – V7 – vi7 – viiø7**.

The dominant seventh (V7) is the only major-minor seventh in the diatonic set, which is why it has a unique function.`,
          },
        ],
        exercises: [
          earChords(6, 'chord-ear-sevenths', [
            'Major 7th',
            'Dominant 7th',
            'Minor 7th',
            'Half-diminished 7th',
            'Diminished 7th',
          ]),
          buildChords(
            4,
            ['Major 7th', 'Dominant 7th', 'Minor 7th'],
            'chord-build-sevenths',
          ),
        ],
      },
    ],
  },

  {
    id: 'modes',
    title: 'Modes',
    subtitle: 'Seven colours hiding inside one scale.',
    level: 'intermediate',
    glyph: '☼',
    color: '#e8c97a',
    lessons: [
      {
        id: 'seven-modes',
        title: 'The Seven Modes',
        summary: 'Rotations of the major scale, each with a home.',
        minutes: 12,
        sections: [
          {
            heading: 'Same notes, new home',
            body: `Play the white keys from C to C and you have C major. Start on D and you have **D Dorian**. Start on E: **E Phrygian**. Each rotation of the same scale creates a different mode with a different tonic.

The seven modes, in order of brightness from darkest to brightest, are:

**Locrian → Phrygian → Aeolian → Dorian → Mixolydian → Ionian → Lydian.**`,
          },
          {
            heading: 'The formulas',
            body: `Each mode is a major scale with altered degrees:

- **Ionian:** major scale (1 2 3 4 5 6 7)
- **Dorian:** ♭3 ♭7 (minor with natural 6)
- **Phrygian:** ♭2 ♭3 ♭6 ♭7
- **Lydian:** ♯4
- **Mixolydian:** ♭7
- **Aeolian:** ♭3 ♭6 ♭7 (natural minor)
- **Locrian:** ♭2 ♭3 ♭5 ♭6 ♭7

The characteristic note is what gives each mode its flavour: Dorian's natural 6, Phrygian's ♭2, Lydian's ♯4.`,
            staff: treble([note('D', 4), note('E', 4), note('F', 4), note('G', 4), note('A', 4), note('B', 4), note('C', 5), note('D', 5)]),
            audio: seq([62, 64, 65, 67, 69, 71, 72, 74], 0.45),
            audioLabel: 'Hear D Dorian',
          },
          {
            heading: 'Modes vs keys',
            body: `A mode is not just a scale; it is a **tonal centre**. D Dorian and C major use the same notes, but they do not sound the same, because the harmony and melody treat D as home.

To make a mode sound like itself, avoid progressions that strongly establish a different tonic. A drone or a modal vamp works better than a functional V–I cadence.`,
          },
        ],
        exercises: [
          buildScales(6, 'scale-build-modes', ['Dorian', 'Phrygian', 'Lydian', 'Mixolydian']),
          degrees(4, 'Dorian', 'degree-ear-modal'),
        ],
      },
      {
        id: 'modal-ear',
        title: 'Modal Ear & Application',
        summary: 'Recognise each colour and use it deliberately.',
        minutes: 11,
        sections: [
          {
            heading: 'Characteristic notes',
            body: `Listen for the one note that separates a mode from its nearest neighbour:

- **Dorian:** natural 6 over minor (D–E–F–G–A–B–C).
- **Phrygian:** ♭2, a semitone above the tonic.
- **Lydian:** ♯4, floating and bright.
- **Mixolydian:** ♭7, major with a relaxed edge.
- **Locrian:** ♭5, unstable and rarely used as a stable home.

Compare Dorian and Aeolian on the same tonic: the only difference is the 6th.`,
            audio: seq([62, 64, 65, 67, 69, 71, 72, 62, 64, 65, 67, 69, 70, 72], 0.38),
            audioLabel: 'Hear D Dorian then D Aeolian',
          },
          {
            heading: 'Modal vamps',
            body: `A modal progression repeats a small set of chords without a functional dominant. Examples:

- **Dorian:** i–IV (Dm–G) or i–ii (Dm–Em).
- **Mixolydian:** I–♭VII (G–F).
- **Phrygian:** i–♭II (E–F).
- **Lydian:** I–II (F–G).

The repetition lets the ear settle on the modal tonic. Film scores, rock, and jazz all use this technique.`,
          },
          {
            heading: 'Improvise inside a mode',
            body: `Set a drone or loop, then improvise using only the mode's notes. Aim to land on the tonic and the characteristic note, not to run the scale up and down.

Sing the tonic first, then explore one degree at a time. Modes become useful only when you can hear their home.`,
          },
        ],
        exercises: [
          buildScales(6, 'scale-build-modes', [
            'Dorian',
            'Phrygian',
            'Lydian',
            'Mixolydian',
            'Locrian',
          ]),
          degrees(4, 'Mixolydian', 'degree-ear-modal'),
        ],
      },
    ],
  },

  {
    id: 'ear-training',
    title: 'Ear Training Lab',
    subtitle: 'Turn hearing into a reliable skill.',
    level: 'intermediate',
    glyph: '♪',
    color: '#79b8c7',
    lessons: [
      {
        id: 'melodic-dictation',
        title: 'Melodic Dictation Basics',
        summary: 'Hear a phrase, hold it, write it.',
        minutes: 12,
        sections: [
          {
            heading: 'Contour first',
            body: `When a melody plays, do not chase individual notes. Listen for **contour**: does it rise, fall, arc, or repeat? Hum it back before naming a single pitch.

Then locate the **scale degrees**. If the melody is in C major and the first note is G, you are on 5. The next note is a step above, so 6. Degrees are relative, so they transfer to any key.`,
          },
          {
            heading: 'Chunking',
            body: `Group notes into beats, not a stream. A bar of four eighth notes is one chunk, not four events. Use the rhythm as a scaffold: if you know where the strong beats land, the pitches hang from them.

Write rhythm first, then pitch. A melody without rhythm is not yet a melody.`,
          },
          {
            heading: 'Sing, then notate',
            body: `Sing the phrase back on a neutral syllable. If you cannot sing it, you cannot hold it long enough to notate it.

Start with two-bar phrases using only steps. Add leaps, then accidentals, then longer phrases. Accuracy at a slow tempo is worth more than guessing at speed.`,
          },
        ],
        exercises: [
          melodyDictation(5),
          degrees(4),
          earIntervals(3, 'interval-ear-all', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        ],
      },
      {
        id: 'chord-progression-recognition',
        title: 'Chord & Progression Recognition',
        summary: 'Quality first, then bass, then cadence.',
        minutes: 12,
        sections: [
          {
            heading: 'A listening order',
            body: `When a chord plays, ask three questions in order:

1. **Quality:** major, minor, diminished, augmented, or seventh?
2. **Bass:** which note is lowest? That tells you the inversion.
3. **Function:** where does it want to go?

Do not try to name all three at once. Quality is the most reliable first impression.`,
          },
          {
            heading: 'Follow the bass',
            body: `In a progression, the bass line is your map. Listen for stepwise motion, fifths, and repeated notes. A descending bass often signals a sequence; a bass cadence V–I is the strongest clue to the key.

Common progressions to internalise:

- **I–V–vi–IV** (pop)
- **vi–IV–I–V** (pop variant)
- **I–vi–IV–V** (50s)
- **ii–V–I** (jazz)`,
          },
          {
            heading: 'Cadence spotting',
            body: `Phrase endings reveal function. If the last two chords feel like tension → release, you have heard an authentic cadence. If the release feels soft, it may be plagal. If the expected home is replaced by a minor chord, it is deceptive.

Practice identifying only the final two chords of a phrase. That single skill makes full-progression dictation much easier.`,
          },
        ],
        exercises: [
          earChords(5, 'chord-ear-sevenths', [
            'Major 7th',
            'Dominant 7th',
            'Minor 7th',
            'Half-diminished 7th',
          ]),
          progressions(5),
        ],
      },
      {
        id: 'rhythmic-dictation',
        title: 'Rhythmic Dictation',
        summary: 'Build the grid, then place the sounds.',
        minutes: 10,
        sections: [
          {
            heading: 'Find the pulse',
            body: `Before writing anything, tap the pulse and decide how many beats are in the bar. Then decide the subdivision: are you counting eighths or sixteenths?

A rhythmic dictation is a grid with events placed on it. The grid must exist in your body before the notes arrive.`,
            metronome: true,
          },
          {
            heading: 'Notate in layers',
            body: `Write the strong beats first as quarter-note placeholders. Then fill in the offbeats. Mark rests explicitly — silence is part of the rhythm.

If a figure is hard to place, clap it slowly while counting aloud. Then write it under the count.`,
            rhythm: rhythm(0.5, 0.5, 1, 1.5, 0.5),
          },
          {
            heading: 'Dictation routine',
            body: `Use short, focused reps:

1. Listen once for the pulse.
2. Listen again and clap.
3. Write the rhythm.
4. Check by tapping your notation against the recording.

Five two-bar dictations a day will do more than one twenty-bar marathon.`,
            metronome: true,
          },
        ],
        exercises: [rhythmDictation(5), rhythmCount(4, 'rhythm-count-dotted')],
      },
    ],
  },

  // ───────────────────────────── ADVANCED ─────────────────────────────
  {
    id: 'voice-leading',
    title: 'Voice Leading & Part Writing',
    subtitle: 'Make every line sing — even the inner ones.',
    level: 'advanced',
    glyph: '≡',
    color: '#b8a3e8',
    lessons: [
      {
        id: 'voice-leading-principles',
        title: 'Voice Leading Principles',
        summary: 'Smoothness, independence, and the shortest path.',
        minutes: 12,
        sections: [
          {
            heading: 'Think horizontally',
            body: `Harmony tells you which chords; **voice leading** tells each individual line where to go. The goal is smooth, independent motion, with no voice making an awkward leap unless the music demands it.

Principles:

- Keep **common tones** in the same voice.
- Move other voices by **step** where possible.
- Prefer **contrary** or **oblique** motion between outer voices.
- Resolve tendency tones predictably.`,
          },
          {
            heading: 'Types of motion',
            body: `- **Parallel:** two voices move the same direction by the same interval.
- **Similar:** same direction, different intervals.
- **Contrary:** opposite directions.
- **Oblique:** one voice stays, the other moves.

Parallel perfect fifths and octaves are avoided in classical counterpoint because they erase the independence of the voices. Contrary motion keeps the texture open.`,
          },
          {
            heading: 'Good voicings',
            body: `Keep voices within their ranges, avoid crossing, and observe the spacing rule: the gap between bass and tenor may be wide — up to a twelfth — while the upper three voices stay close together, usually within an octave. A root-position triad sounds full when the root is doubled, especially in four-part writing.

Play a I–IV–V–I progression in four voices. Then play it again, keeping each voice within a step or two. The second version will sound more like music and less like a chord chart.`,
          },
        ],
        exercises: [
          writtenIntervals(4),
          earChords(4, 'chord-ear-sevenths', ['Major 7th', 'Minor 7th', 'Dominant 7th']),
          buildChords(4, ['Major', 'Minor']),
        ],
      },
      {
        id: 'part-writing-doubling',
        title: 'Part Writing & Doubling',
        summary: 'SATB, doubling rules, and tendency tones.',
        minutes: 13,
        sections: [
          {
            heading: 'The four voices',
            body: `Standard four-part writing uses **soprano, alto, tenor, and bass** (SATB). The soprano carries the melody; the bass anchors the harmony; alto and tenor fill in.

Ranges to respect (approximately):

- Soprano: C4–A5
- Alto: G3–D5
- Tenor: C3–A4
- Bass: E2–E4`,
          },
          {
            heading: 'Doubling',
            body: `A triad has three notes but four voices, so one note is doubled. Double the **root** by default. In first inversion, doubling the root or fifth is common. Avoid doubling the leading tone, which is usually the third of a dominant chord.

In seventh chords, all four notes are present — no doubling. The seventh must resolve downward by step.`,
          },
          {
            heading: 'Tendency tones',
            body: `Certain notes have strong directional pulls:

- The **leading tone** rises to the tonic.
- The **seventh of a chord** falls to the third of the next chord.
- The **third of a dominant** (the leading tone) resolves up.

If you break these rules, the harmony may still sound plausible, but the cadence loses its pull. Listen for the resolution, then write it.`,
          },
        ],
        exercises: [
          noteReading(4, 'note-reading-wide', 'both'),
          writtenIntervals(4),
          earChords(4, 'chord-ear-sevenths', ['Dominant 7th', 'Major 7th', 'Minor 7th']),
        ],
      },
    ],
  },

  {
    id: 'chromatic-harmony',
    title: 'Chromatic Harmony',
    subtitle: 'Borrowed colours, secondary dominants, and new keys.',
    level: 'advanced',
    glyph: '♮',
    color: '#e8a3a3',
    lessons: [
      {
        id: 'secondary-dominants',
        title: 'Secondary Dominants',
        summary: 'V of something other than the tonic.',
        minutes: 12,
        sections: [
          {
            heading: 'A dominant for every chord',
            body: `Any diatonic chord can be preceded by its own dominant. In C major, **V/V** is D major (the dominant of G), **V7/vi** is E7 (the dominant of A minor), and **V7/ii** is A7 (the dominant of D minor).

The notation reads "five of five." The chord is chromatic — it uses notes outside the key — but its function is local and clear.`,
          },
          {
            heading: 'How they behave',
            body: `A secondary dominant contains a leading tone to its target. In C major, E7 (E–G♯–B–D) resolves to A minor: G♯ rises to A, D falls to C, and the target chord feels briefly like home.

Secondary dominants are tonicisation, not full modulation: the new key is acknowledged for a chord or two, then the music returns home.`,
            audio: seq([60, 64, 67, 64, 68, 71, 74, 57, 60, 64], 0.5),
            audioLabel: 'Hear C–E7–Am: V7/vi resolving to vi',
          },
          {
            heading: 'Spotting them',
            body: `Look for a major triad or dominant seventh built on a scale degree that is normally minor or diminished. In C major, an A major chord (A–C♯–E) is not diatonic; it is V/ii, heading to D minor.

The accidental that raises the third of the chord is the clue.`,
          },
        ],
        exercises: [
          earChords(6, 'chord-ear-sevenths', [
            'Dominant 7th',
            'Major 7th',
            'Minor 7th',
            'Half-diminished 7th',
          ]),
          buildChords(4, ['Dominant 7th'], 'chord-build-sevenths'),
        ],
      },
      {
        id: 'modulation-tonicization',
        title: 'Modulation & Tonicization',
        summary: 'Pivot chords, direct moves, and how keys change.',
        minutes: 13,
        sections: [
          {
            heading: 'Three routes to a new key',
            body: `- **Pivot-chord modulation:** a chord shared by both keys is reinterpreted, then the new key is confirmed with its own dominant and tonic.
- **Direct modulation:** the music simply arrives in the new key, often with a dramatic chord.
- **Phrase modulation:** a phrase ends in one key and the next begins in another, often a step or third away.

Tonicisation is shorter: the new key is hinted at but not established.`,
          },
          {
            heading: 'Pivot example',
            body: `From C major to G major, the chord Am is ii in G and vi in C. Use Am as the pivot, follow it with D7 (V7 of G), then G. The ear accepts the new tonic because the dominant confirms it.

The pivot must be diatonic in both keys. The subsequent dominant is what actually seals the modulation.`,
            audio: chords([[60, 64, 67], [57, 60, 64], [62, 66, 69, 72], [55, 59, 62]]),
            audioLabel: 'Hear C–Am–D7–G: a pivot into G major',
          },
          {
            heading: 'Analysis in practice',
            body: `When analysing a chromatic passage, ask:

1. Which key is active right now?
2. Which chord is the local dominant?
3. Does the passage confirm a new tonic, or just colour one chord?

Label secondary dominants with slash notation, and mark modulations at the point where the new tonic is confirmed — not merely where the first accidental appears.`,
          },
        ],
        exercises: [
          keySigs(6, 'key-signature-relative', 7, 'mixed'),
          progressions(4),
        ],
      },
    ],
  },

  // ───────────────────────────── MASTER ─────────────────────────────
  {
    id: 'counterpoint',
    title: 'Counterpoint',
    subtitle: 'Two or more lines, each complete on its own.',
    level: 'master',
    glyph: '⁂',
    color: '#e8c97a',
    lessons: [
      {
        id: 'species-counterpoint',
        title: 'Species Counterpoint',
        summary: 'One note against one, then two, then four.',
        minutes: 14,
        sections: [
          {
            heading: 'The cantus firmus',
            body: `Species counterpoint begins with a **cantus firmus** — a slow, singable line. A second voice is added above or below it according to a graduated set of rules.

- **First species:** one note against one (1:1).
- **Second species:** two notes against one (2:1).
- **Third species:** four against one (4:1).
- **Fourth species:** suspensions and ties.
- **Fifth species:** a florid mixture.`,
          },
          {
            heading: 'Consonance and motion',
            body: `Perfect consonances (unison, fifth, octave) are stable but should not dominate. Imperfect consonances (thirds, sixths) carry the motion. Dissonances are reserved for passing tones and suspensions.

Begin and end on a perfect consonance. Approach perfect intervals by contrary or oblique motion, and avoid parallel fifths and octaves.`,
          },
          {
            heading: 'A first-species checklist',
            body: `1. Start and end on an octave, unison, or fifth.
2. Use mostly stepwise motion.
3. Balance upward and downward motion.
4. Prepare and resolve leaps.
5. Avoid voice crossing and more than an octave between voices.
6. Give the line a single climax.

Sing each voice alone. If it is not melodic by itself, the counterpoint has failed.`,
          },
        ],
        exercises: [
          writtenIntervals(6),
          earIntervals(4, 'interval-ear-all', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        ],
      },
      {
        id: 'imitation-canon',
        title: 'Imitation & Canon',
        summary: 'A line that answers itself.',
        minutes: 12,
        sections: [
          {
            heading: 'Imitation',
            body: `In **imitation**, a second voice repeats a motive or melody from the first, usually at a different pitch or time. A **canon** is strict imitation carried through the whole piece; a **round** is a canon at the unison with staggered entries.

The distance between entries and the interval of transposition determine the character. A canon at the fifth sounds open and stable; a canon at the second is tense.`,
          },
          {
            heading: 'Invertible counterpoint',
            body: `Two lines are **invertible** if they still work when their vertical order is swapped. Writing invertible counterpoint forces you to avoid intervals that become dissonant when inverted: a fifth becomes a fourth, a third becomes a sixth.

Bach's inventions and fugues are masterclasses in keeping two or three lines independent while they imitate and invert.`,
          },
          {
            heading: 'Build your own',
            body: `Take a two-bar motive. Answer it a fifth higher after one bar, then a fourth lower after two bars. Check every vertical interval and every voice crossing.

Record both lines or play them on two instruments. The test of counterpoint is not how it looks on paper but whether each line remains singable.`,
          },
        ],
        exercises: [
          writtenIntervals(4),
          earIntervals(4, 'interval-ear-all', [2, 3, 4, 5, 7, 8, 9, 12]),
          noteReading(3, 'note-reading-wide', 'both'),
        ],
      },
    ],
  },

  {
    id: 'form-analysis',
    title: 'Form & Analysis',
    subtitle: 'Hear the architecture behind the notes.',
    level: 'master',
    glyph: '▦',
    color: '#9ed3d3',
    lessons: [
      {
        id: 'phrase-period-form',
        title: 'Phrase, Period & Small Forms',
        summary: 'Motives become phrases; phrases become periods.',
        minutes: 12,
        sections: [
          {
            heading: 'From motive to phrase',
            body: `A **motive** is a short rhythmic-melodic idea. A **phrase** is a complete musical thought, usually two to four bars, ending with a cadence. Two phrases that question and answer each other form a **period**:

- **Antecedent:** ends on a half cadence (open).
- **Consequent:** ends on an authentic cadence (closed).

The consequent often varies the antecedent, not merely repeats it.`,
          },
          {
            heading: 'Binary and ternary',
            body: `- **Binary (AB):** two contrasting sections, often with repeats.
- **Ternary (ABA):** statement, contrast, return. The return satisfies because the material is familiar.
- **Rounded binary:** AB with a shortened return of A.

Listen for the moment of departure and the moment of return. Form is memory made audible.`,
          },
          {
            heading: 'Label by function',
            body: `Use letters for material and cadences for punctuation. An analysis might read: **A (4 bars, HC) – A′ (4 bars, PAC) – B (8 bars) – A″ (4 bars, PAC)**.

Always connect the label to what you hear: a new texture, a new key, a new rhythmic profile. Labels without listening are just stamps.`,
          },
        ],
        exercises: [progressions(4), rhythmCount(4, 'rhythm-count-basic')],
      },
      {
        id: 'sonata-large-forms',
        title: 'Sonata Form & Large Structures',
        summary: 'Exposition, development, recapitulation — and beyond.',
        minutes: 14,
        sections: [
          {
            heading: 'The three-part drama',
            body: `**Sonata form** is a large-scale structure built on contrast and resolution:

- **Exposition:** presents the main theme group and a contrasting second theme, usually in a related key.
- **Development:** fragments, sequences, and recombines the themes, moving through unstable keys.
- **Recapitulation:** returns to the home key, now with the second theme transposed so that the conflict resolves.

A coda may seal the arrival.`,
          },
          {
            heading: 'Tonal conflict',
            body: `The essence of sonata form is **key conflict**. The second theme's new key creates tension that the recapitulation resolves by bringing that theme home.

Listen for the moment the second theme appears; track its key; then listen for the same theme in the recapitulation. That journey is the form.`,
          },
          {
            heading: 'Other large forms',
            body: `- **Rondo:** recurring refrain ABACA.
- **Theme and variations:** a theme altered in rhythm, texture, harmony, or mode.
- **Fugue:** subject entries and episodes, organised by tonal areas.
- **Through-composed:** continuous development without large repeats.

Analyse by **function and key**, not by bar count alone.`,
          },
        ],
        exercises: [
          keySigs(5, 'key-signature-relative', 7, 'mixed'),
          progressions(5),
        ],
      },
    ],
  },

  {
    id: 'advanced-harmony',
    title: 'Advanced Harmony & Reharmonization',
    subtitle: 'Extensions, alterations, and new colours for old melodies.',
    level: 'master',
    glyph: '✦',
    color: '#e8b8a3',
    lessons: [
      {
        id: 'extensions-alterations',
        title: 'Extensions & Alterations',
        summary: 'Ninth, eleventh, thirteenth — and altered dominants.',
        minutes: 13,
        sections: [
          {
            heading: 'Beyond the seventh',
            body: `Extensions continue stacking thirds above a seventh chord:

- **9th:** add the ninth (C9 = C–E–G–B♭–D).
- **11th:** add the eleventh. On a dominant chord the natural 11 clashes with the major third, so it is usually raised (**C7♯11**); a natural 11 is more common on minor chords (**Cm11**).
- **13th:** add the thirteenth (C13 = C–E–G–B♭–A).

In practice, some lower notes are omitted to avoid muddiness. A jazz pianist might voice a C13 as E–A–B♭–D.`,
          },
          {
            heading: 'Altered dominants',
            body: `Altered dominants raise or lower the fifth and ninth to increase tension:

- **7♭9:** dark, classical/minor cadence.
- **7♯9:** biting, bluesy.
- **7♯11:** bright, Lydian-dominant colour.
- **7alt:** a combination of altered fifths and ninths.

The tritone between the third and seventh remains; the alterations add spice without changing the function.`,
            audio: chords([[60, 64, 67, 70], [60, 64, 67, 70, 73]]),
            audioLabel: 'Hear C7 then C7♭9',
          },
          {
            heading: 'Voicing principles',
            body: `Good extended voicings are about **intervals between adjacent notes**, not the full chord symbol. Keep the root and fifth in the bass, place the third and seventh in the middle, and put the colourful extensions on top.

On guitar, drop the root if a bass player covers it. On piano, shell voicings (root–7th–3rd) plus one extension can imply the whole chord.`,
          },
        ],
        exercises: [
          earChords(6, 'chord-ear-sevenths', [
            'Major 7th',
            'Dominant 7th',
            'Minor 7th',
            'Half-diminished 7th',
            'Diminished 7th',
          ]),
          buildChords(
            4,
            ['Dominant 7th', 'Major 7th', 'Minor 7th', 'Half-diminished 7th'],
            'chord-build-sevenths',
          ),
        ],
      },
      {
        id: 'reharmonization-capstone',
        title: 'Reharmonization Capstone',
        summary: 'Tritone substitution, modal interchange, and a final project.',
        minutes: 15,
        sections: [
          {
            heading: 'Tritone substitution',
            body: `Any dominant seventh can be replaced by the dominant seventh a tritone away, because the two chords share the same tritone. In C major, G7 (G–B–D–F) can become D♭7 (D♭–F–A♭–B).

The bass moves chromatically instead of by fifth, giving the cadence a sleek, jazzy sound. The resolution notes are preserved: F falls to E, B rises to C.`,
            audio: seq([62, 65, 69, 72, 61, 65, 68, 71, 60, 64, 67], 0.45),
            audioLabel: 'Hear ii–♭II7–I: Dm7–D♭7–C',
          },
          {
            heading: 'Modal interchange',
            body: `Borrow chords from parallel modes to change colour without changing key:

- **iv** (minor four) in a major key: gentle nostalgia.
- **♭VI** and **♭VII**: cinematic lift.
- **♭II**: Phrygian tension.
- **I major** at the end of a minor section: the Picardy third.

Use them at phrase boundaries or as surprises. Too many borrowed chords dissolve the sense of home.`,
          },
          {
            heading: 'Capstone project',
            body: `Take a simple eight-bar melody and harmonise it three ways:

1. **Diatonic:** only I–vi–IV–V family chords.
2. **Functional chromatic:** add secondary dominants and a ii–V–I.
3. **Modal/colour:** use modal interchange, a tritone substitution, and one extended chord.

Play each version, then compare which one tells the story you intended. Write a short paragraph explaining your choices. That explanation is the final exam.`,
          },
        ],
        exercises: [
          earChords(5, 'chord-ear-sevenths', [
            'Dominant 7th',
            'Major 7th',
            'Minor 7th',
            'Half-diminished 7th',
          ]),
          progressions(5),
          buildChords(4, ['Major', 'Minor', 'Dominant 7th'], 'chord-build-sevenths'),
        ],
      },
    ],
  },

  ...EXPANSION_COURSES,
];

export const COURSE_MAP: Record<string, Course> = Object.fromEntries(COURSES.map((course) => [course.id, course]));

export const ALL_LESSONS = COURSES.flatMap((course) =>
  course.lessons.map((lesson) => ({ ...lesson, courseId: course.id, courseTitle: course.title, level: course.level })),
);

export const LESSON_MAP = Object.fromEntries(ALL_LESSONS.map((lesson) => [lesson.id, lesson]));

export function courseLessons(courseId: string): Lesson[] {
  return COURSE_MAP[courseId]?.lessons ?? [];
}

export function nextLesson(lessonId: string): (typeof ALL_LESSONS)[number] | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? ALL_LESSONS[index + 1] : undefined;
}

export function previousLesson(lessonId: string): (typeof ALL_LESSONS)[number] | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === lessonId);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}

function mergeExerciseConfig(
  base: ExerciseConfig | undefined,
  extra: ExerciseConfig | undefined,
): ExerciseConfig | undefined {
  if (!base) return extra;
  if (!extra) return base;
  const merged: Record<string, unknown> = { ...base };
  (Object.keys(extra) as Array<keyof ExerciseConfig>).forEach((key) => {
    const next = extra[key];
    const current = merged[key];
    if (Array.isArray(next)) {
      const values = Array.isArray(current) ? current : [];
      merged[key] = [...new Set([...values, ...next])];
    } else if (typeof next === 'boolean' && typeof current === 'boolean') {
      merged[key] = current || next;
    } else if (typeof next === 'number' && typeof current === 'number') {
      merged[key] = Math.max(current, next);
    } else if (current === undefined) {
      merged[key] = next;
    }
  });
  return merged as ExerciseConfig;
}

/** One-question blueprint per skill, used by the daily review scheduler. */
export const SKILL_BLUEPRINTS: Record<string, ExerciseSpec> = {};
COURSES.forEach((course) => {
  course.lessons.forEach((lesson) => {
    lesson.exercises.forEach((spec) => {
      spec.skills.forEach((skill) => {
        const existing = SKILL_BLUEPRINTS[skill];
        if (!existing) {
          SKILL_BLUEPRINTS[skill] = { ...spec, count: 1, skills: [skill] };
          return;
        }
        SKILL_BLUEPRINTS[skill] = {
          ...existing,
          config: mergeExerciseConfig(existing.config, spec.config),
        };
      });
    });
  });
});

export function lessonsForLevel(level: LevelId): Course[] {
  return COURSES.filter((course) => course.level === level);
}
