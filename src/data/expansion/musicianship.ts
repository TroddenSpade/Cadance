import type { Course } from '../curriculum';
import { N, demo, line, progression, spots, type ExpansionDemo } from './demoHelpers';
import { lesson, melodyDictation, progressions, section, writtenIntervals, earIntervals } from './helpers';

const course: Course = {
  id: 'musicianship-lab',
  title: 'Musicianship Lab',
  subtitle: 'Sight singing, harmonic dictation, transcription, and inner hearing.',
  level: 'intermediate',
  glyph: '♪',
  color: '#8fae9b',
  lessons: [
    lesson(
      'sight-singing',
      'Sight Singing',
      'Turn notation into sound with fixed-do solfège and reliable intervals.',
      12,
      [
        section(
          'Fixed do and movable do',
          `In **fixed-do** solfège, **Do is always C**, Re is D, Mi is E, and so on, regardless of key. Chromatic notes take altered syllables: Di, Ri, Fi, Si, Li for raised degrees; Ra, Me, Se, Le, Te for lowered ones. This is the system Cadence uses for note names.

**Movable-do** solfège moves Do to the tonic of the key, so the same syllable pattern works in every key. It is excellent for hearing scale function but weaker for absolute pitch. Keep fixed-do as the default; treat movable-do as an optional lens, never a replacement.`,
        ),
        section(
          'How to practise',
          `Before singing, find the tonic and sing the tonic triad. Then scan the phrase for its highest and lowest notes, its leaps, and its rhythm. Sing the rhythm on a single pitch first, then add the melody.

Anchor every leap to a known interval: a perfect fifth from Do to Sol, a major sixth from Do to La, an octave from Do to high Do. Sing slowly enough that the pitch is decided before the sound begins.`,
        ),
      ],
      [earIntervals(6, 'interval-ear-sight-singing', [2, 3, 4, 5, 7, 9, 12]), melodyDictation(4, 'melody-dictation-sight-singing')],
    ),
    lesson(
      'harmonic-dictation-error',
      'Harmonic Dictation & Error Detection',
      'Hear the bass, name the chords, and catch the note that does not belong.',
      13,
      [
        section(
          'Hearing harmony in layers',
          `Transcribe harmony from the outside in. First find the **bass line**; it usually moves by step or by fifth and defines the inversion. Then identify the **cadence**: authentic, half, plagal, or deceptive. Finally label the chords with Roman numerals.

Listen for the **outer voices** first, then the inner voices. A **I–V–vi–IV** loop and a **ii–V–I** cadence have different bass motion and different tension. Write the bass before you write the Roman numerals; the bass is the evidence.`,
        ),
        section(
          'Error detection',
          `**Error detection** asks you to compare what you hear with what is written. Check one parameter at a time: pitch, rhythm, chord quality, or word stress. Sing the written line silently, then listen for the first mismatch.

Common errors are a wrong accidental, a missing tie, a displaced beat, or a chord quality changed from major to minor. Mark the exact location, not just “somewhere in bar 3.”`,
        ),
      ],
      [progressions(6, 'progression-ear-harmonic-dictation'), melodyDictation(4, 'melody-dictation-error-detection')],
    ),
    lesson(
      'transcription-inner-hearing',
      'Transcription & Inner Hearing',
      'Slow the music down, sing it back, and hear it when the sound stops.',
      13,
      [
        section(
          'A transcription workflow',
          `Transcribe in passes, not in one heroic sweep. First mark the **form** and the bar lines. Then notate the **bass**, then the **melody**, then the **inner harmony**, and finally the rhythm details.

Loop a short segment, slow it down, and sing the pitch before writing it. Use a reference tone for the key. If two voices move together, notate the outer voices first and fill the middle later.`,
        ),
        section(
          'Inner hearing and audiation',
          `**Audiation** is hearing music in your mind without external sound. It is the bridge between reading and playing: you see a score and hear it before your hands move.

Practise by singing a phrase, stopping, and continuing it silently. Then play it and check. Two-voice dictation strengthens the skill: hold one line in your head while tracking the other. Memory improves when you label what you hear — interval, scale degree, chord function — rather than repeating the sound blindly.`,
        ),
      ],
      [melodyDictation(5, 'melody-dictation-transcription'), writtenIntervals(5, 'interval-id-inner-hearing')],
    ),
  ],
};

const demos: Record<string, ExpansionDemo[]> = {
  'sight-singing': [
    demo(
      0,
      line(
        N('C4 D4 E4 F4 G4 A4 B4 C5'),
        `Sing the C major scale with fixed-do syllables: **Do–Re–Mi–Fa–Sol–La–Si–Do**. On piano, play each note and sing it back. On guitar, use the open-position scale from the A string 3rd fret to the B string 1st fret. Keep the vowels pure and the pitch steady; speed is not the goal.`,
        {
          tempo: 0.45,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 0], [3, 2], [3, 3], [2, 0], [2, 2], [1, 0], [1, 1]),
          rootPitchClasses: [0],
          caption: 'Fixed do: Do is C in every key.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 E4 G4 C5 G4 E4 C4'),
        `Anchor the triad: **Do–Mi–Sol–Do**. Sing the arpeggio, then sing the same notes with the chord in your hand. On piano, play the chord and hold it while you sing each member. On guitar, use the C chord shape and sing the top notes. If a leap is uncertain, sing the intervening scale steps silently.`,
        {
          tempo: 0.6,
          pianoEnd: 84,
          guitarSpots: spots([4, 3], [3, 2], [2, 0], [1, 1], [2, 0], [3, 2], [4, 3]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Anchor leaps to the tonic triad.',
        },
      ),
    ),
  ],
  'harmonic-dictation-error': [
    demo(
      0,
      progression(
        [N('C4 E4 G4'), N('G3 B3 D4'), N('A3 C4 E4'), N('F3 A3 C4')],
        N('C4 E4 G4 G3 B3 D4 A3 C4 E4 F3 A3 C4'),
        `Hear **I–V–vi–IV** in C. First sing the bass: **C–G–A–F**. Then name the qualities: major, major, minor, major. On piano, play the bass alone, then add the chords. On guitar, use C, G, Am, and F shapes. The bass line is the skeleton of the dictation.`,
        {
          tempo: 0.7,
          guitarSpots: spots([4, 3], [5, 3], [4, 0], [5, 1]),
          rootPitchClasses: [0, 7, 9, 5],
          caption: 'I–V–vi–IV: bass first, Roman numerals second.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('E4 F4 G4 A4 G4 F4 E4'),
        `The written melody is **E–F–G–A–G–F–E**. Imagine one note is wrong: if the fourth note sounds A♭ instead of A, the error is a changed accidental. Play the correct line, then the altered one. On piano, the difference is one key. On guitar, A is the high E string 5th fret and A♭ is the 4th fret.`,
        {
          tempo: 0.55,
          guitarSpots: spots([0, 0], [0, 1], [0, 3], [0, 5], [0, 3], [0, 1], [0, 0]),
          rootPitchClasses: [4, 5, 7, 9],
          caption: 'Error detection: compare one parameter at a time.',
        },
      ),
    ),
  ],
  'transcription-inner-hearing': [
    demo(
      0,
      line(
        N('G4 A4 B4 D5 B4 A4 G4'),
        `Transcribe in layers. The phrase **G–A–B–D–B–A–G** has an arch contour and ends where it began. Sing it, then write only the rhythm. Add the pitches on the second pass. On guitar, use the high E string at frets 3, 5, 7, 10, 7, 5, 3; the fret numbers mirror the contour.`,
        {
          tempo: 0.55,
          pianoEnd: 84,
          guitarSpots: spots([0, 3], [0, 5], [0, 7], [0, 10], [0, 7], [0, 5], [0, 3]),
          rootPitchClasses: [7],
          caption: 'Transcription: form, bass, melody, then detail.',
        },
      ),
    ),
    demo(
      1,
      line(
        N('C4 E4 G4 E4 C4 G3 C4'),
        `Two voices: the upper line **C–E–G–E–C** and the lower line **C–G–C**. Sing the upper line while tapping the lower rhythm, then swap. On piano, play the upper line with the right hand and the lower with the left. On guitar, use the B string for the melody and the low E string for the bass.`,
        {
          tempo: 0.6,
          guitarSpots: spots([1, 1], [1, 5], [1, 8], [1, 5], [1, 1], [5, 3], [4, 3]),
          rootPitchClasses: [0, 4, 7],
          caption: 'Two-voice dictation: hold one line while tracking the other.',
        },
      ),
    ),
  ],
};

export const musicianshipCourse = course;
export const musicianshipDemos = demos;
