export type GlossaryCategory =
  | 'Notation'
  | 'Rhythm'
  | 'Intervals'
  | 'Harmony'
  | 'Form'
  | 'Ear training';

export interface GlossaryEntry {
  term: string;
  aliases?: string[];
  category: GlossaryCategory;
  definition: string;
  lessonId?: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  'Notation',
  'Rhythm',
  'Intervals',
  'Harmony',
  'Form',
  'Ear training',
];

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Staff',
    aliases: ['stave'],
    category: 'Notation',
    definition: 'Five lines and four spaces on which pitches are written.',
    lessonId: 'staff-and-clefs',
  },
  {
    term: 'Clef',
    category: 'Notation',
    definition: 'The symbol at the start of a staff that fixes which lines and spaces belong to which pitches.',
    lessonId: 'staff-and-clefs',
  },
  {
    term: 'Ledger line',
    category: 'Notation',
    definition: 'A short line above or below the staff for a note that sits outside its five lines.',
    lessonId: 'treble-clef-reading',
  },
  {
    term: 'Key signature',
    category: 'Notation',
    definition: 'The sharps or flats after the clef that tell you which notes belong to the key.',
    lessonId: 'order-of-sharps',
  },
  {
    term: 'Accidental',
    category: 'Notation',
    definition: 'A sharp, flat, or natural sign that raises, lowers, or cancels a pitch for the bar.',
    lessonId: 'accidentals-enharmonics',
  },
  {
    term: 'Enharmonic',
    category: 'Notation',
    definition: 'Two names for the same pitch, such as F♯ and G♭.',
    lessonId: 'accidentals-enharmonics',
  },
  {
    term: 'Beat',
    category: 'Rhythm',
    definition: 'The steady pulse you feel and count while music moves.',
    lessonId: 'beat-note-values',
  },
  {
    term: 'Meter',
    category: 'Rhythm',
    definition: 'How beats are grouped into bars, such as two, three, or four at a time.',
    lessonId: 'time-signatures',
  },
  {
    term: 'Tempo',
    category: 'Rhythm',
    definition: 'The speed of the beat, usually measured in beats per minute.',
    lessonId: 'beat-note-values',
  },
  {
    term: 'Syncopation',
    category: 'Rhythm',
    definition: 'An accent that lands between the main beats instead of on them.',
    lessonId: 'subdivision-counting',
  },
  {
    term: 'Anacrusis',
    aliases: ['pickup'],
    category: 'Rhythm',
    definition: 'One or more notes before the first full bar that lead into the downbeat.',
    lessonId: 'time-signatures',
  },
  {
    term: 'Rubato',
    category: 'Rhythm',
    definition: 'A flexible tempo in which the performer borrows and returns time to shape a phrase.',
    lessonId: 'phrase-period-form',
  },
  {
    term: 'Interval',
    category: 'Intervals',
    definition: 'The distance in pitch between two notes, named by size and quality.',
    lessonId: 'major-perfect-intervals',
  },
  {
    term: 'Semitone',
    aliases: ['half step'],
    category: 'Intervals',
    definition: 'The smallest distance between two adjacent keys or frets.',
    lessonId: 'half-whole-steps',
  },
  {
    term: 'Octave',
    category: 'Intervals',
    definition: 'The distance of twelve semitones, where the same note name returns higher or lower.',
    lessonId: 'half-whole-steps',
  },
  {
    term: 'Consonance',
    category: 'Intervals',
    definition: 'A combination of notes that sounds stable and at rest.',
    lessonId: 'interval-ear-lab',
  },
  {
    term: 'Dissonance',
    category: 'Intervals',
    definition: 'A combination of notes that sounds tense and wants to move.',
    lessonId: 'interval-ear-lab',
  },
  {
    term: 'Triad',
    category: 'Harmony',
    definition: 'A three-note chord built from a root, a third, and a fifth.',
    lessonId: 'major-minor-triads',
  },
  {
    term: 'Inversion',
    category: 'Harmony',
    definition: 'A chord with a tone other than the root in the bass.',
    lessonId: 'chord-inversions',
  },
  {
    term: 'Roman numeral',
    category: 'Harmony',
    definition: 'A chord label that shows its degree in the key rather than its absolute pitch.',
    lessonId: 'diatonic-chords',
  },
  {
    term: 'Diatonic',
    category: 'Harmony',
    definition: 'Belonging to the notes of the current key without chromatic alteration.',
    lessonId: 'diatonic-functions',
  },
  {
    term: 'Cadence (phrase ending)',
    aliases: ['cadence'],
    category: 'Harmony',
    definition: 'The chord motion that closes a phrase, such as V–I or IV–I.',
    lessonId: 'cadences-ii-v-i',
  },
  {
    term: 'Dominant',
    category: 'Harmony',
    definition: 'The fifth degree of a key and the chord built on it, which pulls strongly to the tonic.',
    lessonId: 'diatonic-functions',
  },
  {
    term: 'Secondary dominant',
    category: 'Harmony',
    definition: 'A dominant chord that resolves to a chord other than the tonic, such as V/V.',
    lessonId: 'secondary-dominants',
  },
  {
    term: 'Modulation',
    category: 'Harmony',
    definition: 'A lasting change from one key to another.',
    lessonId: 'modulation-tonicization',
  },
  {
    term: 'Voice leading',
    category: 'Harmony',
    definition: 'How individual lines move from chord to chord, aiming for smooth steps and few leaps.',
    lessonId: 'voice-leading-principles',
  },
  {
    term: 'Circle of fifths',
    category: 'Harmony',
    definition: 'The arrangement of keys and chords by perfect fifths, which maps key signatures and related keys.',
    lessonId: 'circle-of-fifths',
  },
  {
    term: 'Motif',
    category: 'Form',
    definition: 'A short rhythmic or melodic idea that a piece repeats and develops.',
    lessonId: 'phrase-period-form',
  },
  {
    term: 'Phrase',
    category: 'Form',
    definition: 'A musical sentence that feels complete enough to breathe at the end.',
    lessonId: 'phrase-period-form',
  },
  {
    term: 'Period',
    category: 'Form',
    definition: 'Two phrases, usually an antecedent and a consequent, that answer each other.',
    lessonId: 'phrase-period-form',
  },
  {
    term: 'Sonata form',
    category: 'Form',
    definition: 'A large form built from exposition, development, and recapitulation.',
    lessonId: 'sonata-large-forms',
  },
  {
    term: 'Counterpoint',
    category: 'Form',
    definition: 'Two or more independent melodic lines sounding together.',
    lessonId: 'species-counterpoint',
  },
  {
    term: 'Relative pitch',
    category: 'Ear training',
    definition: 'The ability to name or reproduce a note by comparing it with a known reference.',
    lessonId: 'interval-ear-lab',
  },
  {
    term: 'Solfège',
    aliases: ['solfege'],
    category: 'Ear training',
    definition: 'Singing note names as do, re, mi, fa, sol, la, ti.',
    lessonId: 'major-scale',
  },
  {
    term: 'Dictation',
    category: 'Ear training',
    definition: 'Writing down music you hear, whether a melody, rhythm, or chord progression.',
    lessonId: 'melodic-dictation',
  },
];
