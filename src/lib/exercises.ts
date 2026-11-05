import {
  CHORDS,
  INTERVALS,
  KEY_SIGNATURES,
  LETTERS,
  MAJOR_SCALE,
  MAJOR_TRIADS,
  SCALES,
  WRITTEN_INTERVALS,
  chordByName,
  commonRootSpellings,
  diatonicStep,
  intervalBySemitones,
  midiToFullName,
  midiToName,
  octaveOf,
  pitchClass,
  preferredRootSpelling,
  randomItem,
  sample,
  scaleByName,
  shuffle,
  spellFromRoot,
  spelledFullName,
  spelledPitchName,
  spelledName,
  type ChordDef,
  type KeySignature,
  type Letter,
  type RhythmItem,
  type ScaleName,
  type SpelledPitch,
} from './music';
import { getLanguage, t } from './i18n';
import faSkillLabels from '../locales/fa/content/skills.json';
import type {
  Clef,
  ExerciseKind,
  ExerciseConfig,
  ExerciseSpec,
  Question,
  StaffNoteSpec,
  StaffSpec,
} from './types';

let questionCounter = 0;
function qid(kind: ExerciseKind): string {
  questionCounter += 1;
  return `${kind}-${Date.now().toString(36)}-${questionCounter}`;
}

const TREBLE_POOL: Array<[Letter, number]> = [
  ['C', 4],
  ['D', 4],
  ['E', 4],
  ['F', 4],
  ['G', 4],
  ['A', 4],
  ['B', 4],
  ['C', 5],
  ['D', 5],
  ['E', 5],
  ['F', 5],
  ['G', 5],
  ['A', 5],
];

const BASS_POOL: Array<[Letter, number]> = [
  ['A', 2],
  ['B', 2],
  ['C', 3],
  ['D', 3],
  ['E', 3],
  ['F', 3],
  ['G', 3],
  ['A', 3],
  ['B', 3],
  ['C', 4],
  ['D', 4],
  ['E', 4],
];

const NATURAL_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11];

function randomSpelledNote(clef: Clef, allowAccidentals: boolean): StaffNoteSpec {
  const pool = clef === 'treble' ? TREBLE_POOL : BASS_POOL;
  const [letter, octave] = randomItem(pool);
  let accidental: -1 | 0 | 1 = 0;
  if (allowAccidentals && Math.random() < 0.45) {
    const canSharp = letter !== 'B' && letter !== 'E';
    const canFlat = letter !== 'C' && letter !== 'F';
    if (canSharp && (!canFlat || Math.random() < 0.5)) accidental = 1;
    else if (canFlat) accidental = -1;
  }
  return { letter, accidental, octave };
}

function noteMidi(note: StaffNoteSpec): number {
  const base = (note.octave + 1) * 12;
  const semitones: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  return base + semitones[note.letter] + note.accidental;
}

function spelledAnswer(note: StaffNoteSpec): string {
  return spelledName(note.letter, note.accidental);
}

function articleFor(name: string): 'a' | 'an' {
  return /^[AEF]/.test(name) ? 'an' : 'a';
}

function ordinal(n: number): string {
  if (getLanguage() === 'fa') return String(n);
  const suffix = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${n}${suffix}`;
}

function staffPosition(clef: Clef, note: StaffNoteSpec): string {
  const middleStep = clef === 'treble' ? 34 : 22;
  const diff = diatonicStep(note.letter, note.octave) - middleStep;
  if (diff === 0) return t('on the middle line');
  if (diff % 2 === 0) {
    const line = 3 + diff / 2;
    if (line >= 1 && line <= 5) return t('on the {ordinal} line', { ordinal: ordinal(line) });
    return line > 5 ? t('on a ledger line above the staff') : t('on a ledger line below the staff');
  }
  const space = 3 + (diff - 1) / 2;
  if (space >= 1 && space <= 4) return t('in the {ordinal} space', { ordinal: ordinal(space) });
  return space > 4 ? t('in the space above the staff') : t('in the space below the staff');
}

function mcChoices(answer: string, pool: string[], count = 4): string[] {
  const wrong = sample(
    pool.filter((option) => option !== answer),
    Math.max(0, count - 1),
  );
  return shuffle([answer, ...wrong]);
}

const NOTE_NAME_POOL = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
  'D♭',
  'E♭',
  'G♭',
  'A♭',
  'B♭',
];

const FLAT_NAME_POOL = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

const INTERVAL_POOL = INTERVALS.filter((i) => i.semitones > 0).map((i) => i.name);
const CHORD_QUALITY_POOL = CHORDS.map((c) => c.name);
const SCALE_DEGREE_POOL = ['1', '2', '3', '4', '5', '6', '7'];

const PROGRESSIONS = [
  { label: 'I–V–I (authentic cadence)', degrees: [0, 4, 0], qualities: ['Major', 'Major', 'Major'] },
  { label: 'I–IV–V–I', degrees: [0, 3, 4, 0], qualities: ['Major', 'Major', 'Major', 'Major'] },
  { label: 'I–vi–IV–V (pop)', degrees: [0, 5, 3, 4], qualities: ['Major', 'Minor', 'Major', 'Major'] },
  { label: 'ii–V–I (jazz cadence)', degrees: [1, 4, 0], qualities: ['Minor', 'Major', 'Major'] },
  { label: 'vi–IV–I–V', degrees: [5, 3, 0, 4], qualities: ['Minor', 'Major', 'Major', 'Major'] },
  { label: 'V–vi (deceptive cadence)', degrees: [4, 5], qualities: ['Major', 'Minor'] },
  { label: 'IV–I (plagal cadence)', degrees: [3, 0], qualities: ['Major', 'Major'] },
  { label: 'I–V (half cadence)', degrees: [0, 4], qualities: ['Major', 'Major'] },
];

function chordMidis(root: number, quality: string): number[] {
  return chordByName(quality).intervals.map((interval) => root + interval);
}

/** Choose the root spelling that keeps a chord's notes most readable. */
function readableChordRoot(rootPc: number, chord: ChordDef): SpelledPitch {
  let best = commonRootSpellings(rootPc)[0];
  let bestScore = Infinity;
  for (const candidate of commonRootSpellings(rootPc)) {
    const score = chord.intervals
      .map((interval, index) => spellFromRoot(candidate, chord.letterSteps[index], interval))
      .reduce((sum, pitch) => sum + Math.abs(pitch.accidental), 0);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function chordToneSpellings(rootPc: number, chord: ChordDef): SpelledPitch[] {
  const root = readableChordRoot(rootPc, chord);
  return chord.intervals.map((interval, index) => spellFromRoot(root, chord.letterSteps[index], interval));
}

/** Prefer roots whose chord tones avoid double accidentals. */
function readableRootPool(pool: number[], chord: ChordDef): number[] {
  const readable = pool.filter((root) =>
    chordToneSpellings(pitchClass(root), chord).every((pitch) => Math.abs(pitch.accidental) <= 1),
  );
  return readable.length ? readable : pool;
}

function buildProgressionChords(root: number, progression: (typeof PROGRESSIONS)[number]): number[][] {
  return progression.degrees.map((degree, index) =>
    chordMidis(root + MAJOR_SCALE[degree], progression.qualities[index]),
  );
}

function rhythmName(beats: number, rest = false): string {
  let name = 'eighth note';
  if (beats >= 4) name = 'whole note';
  else if (beats >= 3) name = 'dotted half note';
  else if (beats >= 2) name = 'half note';
  else if (beats > 1) name = 'dotted quarter note';
  else if (beats === 1) name = 'quarter note';
  return t(rest ? name.replace('note', 'rest') : name);
}

function makeRhythm(total: number): { beats: number; dotted?: boolean }[] {
  const items: { beats: number; dotted?: boolean }[] = [];
  let remaining = total;
  let guard = 0;
  while (remaining > 0.01 && guard < 8) {
    guard += 1;
    const candidates = [0.5, 1, 1.5, 2, 3, 4].filter((beats) => beats <= remaining + 0.001);
    let beats = randomItem(candidates);
    if (remaining === 4 && Math.random() < 0.25) beats = 4;
    if (remaining === 3 && Math.random() < 0.2) beats = 3;
    if (items.length >= 4) beats = Math.max(...candidates);
    items.push({ beats, dotted: beats === 1.5 || beats === 3 });
    remaining = Math.round((remaining - beats) * 10) / 10;
  }
  return items;
}

function rhythmItem(beats: number, rest = false): RhythmItem {
  return { beats, dotted: beats === 1.5 || beats === 3, rest };
}

function randomRhythmBar(): RhythmItem[] {
  const items: RhythmItem[] = [];
  let remaining = 4;
  while (remaining > 0.001) {
    const candidates = [0.5, 1, 1.5, 2].filter((beats) => beats <= remaining + 0.001);
    const beats = randomItem(candidates);
    const rest = Math.random() < 0.12 && items.length > 0;
    items.push(rhythmItem(beats, rest));
    remaining = Math.round((remaining - beats) * 10) / 10;
  }
  return items;
}

function rhythmKey(items: RhythmItem[]): string {
  return items.map((item) => `${item.beats}${item.rest ? 'r' : ''}`).join('|');
}

function rhythmVariants(items: RhythmItem[]): RhythmItem[][] {
  const base = rhythmKey(items);
  const variants: RhythmItem[][] = [];
  const push = (candidate: RhythmItem[]) => {
    const key = rhythmKey(candidate);
    if (key === base || variants.some((variant) => rhythmKey(variant) === key)) return;
    variants.push(candidate);
  };

  items.forEach((item, index) => {
    if (!item.rest && (item.beats === 1 || item.beats === 2)) {
      const next = [...items];
      next.splice(index, 1, rhythmItem(item.beats / 2), rhythmItem(item.beats / 2));
      push(next);
    }
    const toggled = items.map((entry, i) => (i === index ? { ...entry, rest: !entry.rest } : entry));
    push(toggled);
  });

  for (let index = 0; index < items.length - 1; index += 1) {
    if (items[index].beats === items[index + 1].beats && items[index].beats <= 1) {
      const next = [...items];
      next.splice(index, 2, rhythmItem(items[index].beats * 2));
      push(next);
    }
    if (items[index].beats !== items[index + 1].beats) {
      const next = [...items];
      next[index] = { ...next[index], beats: items[index + 1].beats };
      next[index + 1] = { ...next[index + 1], beats: items[index].beats };
      push(next);
    }
  }

  return variants;
}

function rhythmDescription(items: RhythmItem[]): string {
  return items
    .map((item) => rhythmName(item.beats, item.rest))
    .join(', ');
}

export function generateQuestion(spec: ExerciseSpec): Question | null {
  const config = spec.config ?? {};
  const skills = spec.skills;
  switch (spec.kind) {
    case 'note-reading': {
      const clef: Clef =
        config.clef && config.clef !== 'both' ? config.clef : Math.random() < 0.5 ? 'treble' : 'bass';
      const note = randomSpelledNote(clef, config.accidentals ?? false);
      const answer = spelledAnswer(note);
      const accidental = note.accidental;
      const accidentalLetters: Record<-1 | 0 | 1, Letter[]> = {
        [-1]: ['D', 'E', 'G', 'A', 'B'],
        0: [...LETTERS],
        1: ['C', 'D', 'F', 'G', 'A'],
      };
      const letters = accidentalLetters[accidental].filter((letter) => letter !== note.letter);
      const wrong = sample(letters, 3).map((letter) => spelledName(letter, accidental));
      const noteName = spelledFullName(note.letter, note.accidental, note.octave);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Name this note.'),
        instruction: t('Read the staff, then choose the letter name.'),
        staff: { clef, notes: [note] },
        audio: { midis: [noteMidi(note)], mode: 'sequence' },
        choices: shuffle([answer, ...wrong]),
        answer,
        explanation: t('This note is {note}, written {position} of the {clef} staff.', {
          note: noteName,
          position: staffPosition(clef, note),
          clef: t(`${clef} clef`),
        }),
        hint:
          clef === 'treble'
            ? t('Treble clef lines: E G B D F.')
            : t('Bass clef lines: G B D F A.'),
        skills,
      };
    }

    case 'find-note': {
      const allowAccidentals = config.accidentals ?? true;
      let pitch: number;
      if (allowAccidentals) {
        pitch = Math.floor(Math.random() * 12);
      } else {
        pitch = randomItem(NATURAL_PITCH_CLASSES);
      }
      const preferFlat = Math.random() < 0.35;
      const name = midiToName(60 + pitch, preferFlat);
      const label = name.includes('♯')
        ? t('{note} sharp', { note: name.replace('♯', '') })
        : name.includes('♭')
          ? t('{note} flat', { note: name.replace('♭', '') })
          : name;
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Find {name} on the instrument.', { name }),
        instruction: t('Any octave counts. Tap a key or fret to answer.'),
        targetMidi: 48 + pitch,
        targetLabel: name,
        answer: name,
        explanation: t(
          'The target pitch class is {label}. {name} appears in every octave — on a piano as the key labelled {label}, and on a guitar at several frets across the strings.',
          { label, name },
        ),
        hint: t('Use the keyboard pattern: C is always just left of the group of two black keys.'),
        skills,
      };
    }

    case 'interval-ear': {
      const pool = config.intervals ?? [2, 3, 4, 5, 7, 9, 12];
      const semitones = randomItem(pool);
      const direction = config.direction ?? 'mixed';
      const dir = direction === 'mixed' ? randomItem(['ascending', 'descending', 'harmonic'] as const) : direction;
      const root = 57 + Math.floor(Math.random() * 13);
      const upper = root + semitones;
      const midis = dir === 'descending' ? [upper, root] : [root, upper];
      const answer = intervalBySemitones(semitones).name;
      const allowedNames = [...new Set(pool.map((value) => intervalBySemitones(value).name))];
      const filler = INTERVAL_POOL.filter((name) => !allowedNames.includes(name));
      const choicePool = allowedNames.length >= 4 ? allowedNames : [...allowedNames, ...filler].slice(0, 4);
      const options = mcChoices(answer, choicePool).map((name) => t(name));
      const motion =
        dir === 'harmonic'
          ? t('{low} and {high} together', { low: midiToFullName(root), high: midiToFullName(upper) })
          : dir === 'descending'
            ? t('{high} down to {low}', { high: midiToFullName(upper), low: midiToFullName(root) })
            : t('{low} up to {high}', { low: midiToFullName(root), high: midiToFullName(upper) });
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('What interval do you hear?'),
        instruction:
          dir === 'harmonic' ? t('Listen to the two notes together.') : t('Listen to the two notes in order.'),
        audio: { midis, mode: dir === 'harmonic' ? 'chord' : 'sequence' },
        autoPlay: true,
        choices: options,
        answer: t(answer),
        explanation: t('{motion} spans {semitones} semitones — a {answer}.', {
          motion,
          semitones,
          answer: t(answer),
        }),
        hint: t(
          'Anchor the sound: a major 3rd sounds bright, a minor 3rd darker; a perfect 5th is open and stable.',
        ),
        skills,
      };
    }

    case 'interval-id': {
      const clef: Clef = config.clef && config.clef !== 'both' ? config.clef : 'treble';
      const notePool = clef === 'treble' ? TREBLE_POOL : BASS_POOL;
      const requested = config.writtenIntervals;
      const allowed = requested?.length
        ? WRITTEN_INTERVALS.filter((interval) => requested.includes(interval.name))
        : WRITTEN_INTERVALS;
      let firstNote: StaffNoteSpec = { letter: 'C', accidental: 0, octave: 4 };
      let secondNote: StaffNoteSpec = { letter: 'G', accidental: 0, octave: 4 };
      let interval = WRITTEN_INTERVALS.find((item) => item.name === 'Perfect 5th')!;

      for (let attempt = 0; attempt < 120; attempt += 1) {
        const candidate = randomItem(allowed.length ? allowed : WRITTEN_INTERVALS);
        const [letter, octave] = randomItem(notePool);
        const root = { letter, accidental: 0 as const, octave };
        const spelled = spellFromRoot(root, candidate.number - 1, candidate.semitones);
        const octaveShift = Math.floor((LETTERS.indexOf(letter) + candidate.number - 1) / 7);
        const secondOctave = octave + octaveShift;
        if (Math.abs(spelled.accidental) > 1) continue;
        if (secondOctave < 2 || secondOctave > 6) continue;
        firstNote = root;
        secondNote = {
          letter: spelled.letter,
          accidental: spelled.accidental as -1 | 0 | 1,
          octave: secondOctave,
        };
        interval = candidate;
        break;
      }

      const answer = interval.name;
      const allowedNames = [...new Set(allowed.map((item) => item.name))];
      const filler = ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'].filter(
        (name) => !allowedNames.includes(name),
      );
      const choicePool =
        allowedNames.length === 0
          ? WRITTEN_INTERVALS.map((item) => item.name)
          : allowedNames.length >= 4
            ? allowedNames
            : [...allowedNames, ...filler].slice(0, 4);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('What interval is written?'),
        instruction: t('Read both notes. The interval is measured upward from the first note.'),
        staff: { clef, notes: [firstNote, secondNote] },
        audio: { midis: [noteMidi(firstNote), noteMidi(secondNote)], mode: 'sequence' },
        choices: mcChoices(answer, choicePool).map((name) => t(name)),
        answer: t(answer),
        explanation: t('{first} up to {second} spans {semitones} semitones — a {answer}.', {
          first: spelledFullName(firstNote.letter, firstNote.accidental, firstNote.octave),
          second: spelledFullName(secondNote.letter, secondNote.accidental, secondNote.octave),
          semitones: interval.semitones,
          answer: t(answer),
        }),
        hint: t(
          'Count the letter names inclusively to get the number, then count semitones to get the quality. Major can become minor; perfect can become augmented or diminished.',
        ),
        skills,
      };
    }

    case 'chord-ear': {
      const qualities = config.qualities ?? ['Major', 'Minor', 'Diminished', 'Augmented'];
      const quality = randomItem(qualities);
      const chord = chordByName(quality);
      const root = 48 + Math.floor(Math.random() * 13);
      const midis = chordMidis(root, quality);
      const rootSpelling = readableChordRoot(pitchClass(root), chord);
      const names = chordToneSpellings(pitchClass(root), chord).map(spelledPitchName).join('–');
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('What chord quality do you hear?'),
        instruction: t('Listen as a block chord.'),
        audio: { midis, mode: 'chord' },
        autoPlay: true,
        choices: mcChoices(quality, qualities.length > 1 ? qualities : CHORD_QUALITY_POOL).map((name) => t(name)),
        answer: t(quality),
        explanation: t('The chord is {root} {quality} ({notes}).', {
          root: spelledPitchName(rootSpelling),
          quality: t(quality),
          notes: names,
        }),
        hint: t('Major sounds bright, minor sounds dark, diminished is tense, augmented is suspended and wide.'),
        skills,
      };
    }

    case 'chord-inversion': {
      const qualities = config.qualities ?? ['Major', 'Minor'];
      const quality = randomItem(qualities);
      const chord = chordByName(quality);
      const inversion = Math.floor(Math.random() * chord.intervals.length);
      const rootPool = readableRootPool(Array.from({ length: 12 }, (_, index) => 60 + index), chord);
      const root = randomItem(rootPool);
      const rootSpelling = readableChordRoot(pitchClass(root), chord);
      const rootOctave = octaveOf(root);
      const rootLetterIndex = LETTERS.indexOf(rootSpelling.letter);
      const bassMidi = root + chord.intervals[inversion];

      const voiced = chord.intervals
        .map((interval, index) => {
          const spelled = spellFromRoot(rootSpelling, chord.letterSteps[index], interval);
          let midi = root + interval;
          let octave = rootOctave + Math.floor((rootLetterIndex + chord.letterSteps[index]) / 7);
          if (midi < bassMidi) {
            midi += 12;
            octave += 1;
          }
          return {
            letter: spelled.letter,
            accidental: spelled.accidental as -1 | 0 | 1,
            octave,
            midi,
          };
        })
        .sort((a, b) => a.midi - b.midi);

      const labels = ['Root position', 'First inversion', 'Second inversion', 'Third inversion'];
      const answer = t(labels[inversion]);
      const bass = voiced[0];
      const rootName = spelledPitchName(rootSpelling);
      const tone = t(inversion === 0 ? 'root' : inversion === 1 ? 'third' : inversion === 2 ? 'fifth' : 'seventh');
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('What inversion is this {root} {quality} chord?', {
          root: rootName,
          quality: t(quality),
        }),
        instruction: t('The lowest note decides the inversion. Read the chord from the bottom up.'),
        staff: {
          clef: 'treble',
          notes: voiced.map(({ midi: _midi, ...note }) => note),
          chord: true,
        },
        audio: { midis: voiced.map((note) => note.midi), mode: 'chord' },
        choices: shuffle(labels.slice(0, chord.intervals.length).map((label) => t(label))),
        answer,
        explanation: t('The bass is {bass}. {answer} means the {tone} is in the bass.', {
          bass: spelledFullName(bass.letter, bass.accidental, bass.octave),
          answer,
          tone,
        }),
        hint: t(
          'Root position = root in the bass. First inversion = third. Second inversion = fifth. Seventh chords add third inversion = seventh.',
        ),
        skills,
      };
    }

    case 'chord-build': {
      const qualities = config.qualities ?? ['Major', 'Minor'];
      const quality = randomItem(qualities);
      const chord = chordByName(quality);
      const basePool = config.roots ?? Array.from({ length: 12 }, (_, index) => 48 + index);
      const rootPool = config.roots ? basePool : readableRootPool(basePool, chord);
      const root = randomItem(rootPool);
      const rootSpelling = readableChordRoot(pitchClass(root), chord);
      const rootName = spelledPitchName(rootSpelling);
      const targets = chord.intervals.map((interval) => root + interval);
      const names = chordToneSpellings(pitchClass(root), chord).map(spelledPitchName).join(', ');
      const article = articleFor(rootName);
      const qualityArticle = articleFor(quality);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t(article === 'an' ? 'Build an {root} {quality} chord.' : 'Build a {root} {quality} chord.', {
          root: rootName,
          quality: t(quality),
        }),
        instruction: t('Select the chord tones in any order, then check.'),
        targetMidis: targets,
        ordered: false,
        targetLabel: `${rootName}${chord.symbol}`,
        answer: names,
        explanation: t('The {quality} chord on {root} contains {notes}.', {
          quality: t(quality),
          root: rootName,
          notes: names,
        }),
        hint: t('A major triad is root–major 3rd–perfect 5th; a minor triad lowers the 3rd.'),
        skills,
      };
    }

    case 'scale-build': {
      const scaleName = randomItem<ScaleName>(config.scales ?? ['Major']);
      const scale = scaleByName(scaleName);
      const rootPool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const root = config.roots ? randomItem(config.roots) : 48 + randomItem(rootPool);
      const candidates = commonRootSpellings(pitchClass(root));
      const spellScale = (candidate: (typeof candidates)[number]) =>
        scale.intervals.map((interval, index) => spellFromRoot(candidate, index, interval));
      let rootSpelling = candidates[0];
      let names = spellScale(rootSpelling).map(spelledPitchName).join('–');
      for (const candidate of candidates) {
        const spelled = spellScale(candidate);
        if (spelled.every((pitch) => Math.abs(pitch.accidental) <= 1)) {
          rootSpelling = candidate;
          names = spelled.map(spelledPitchName).join('–');
          break;
        }
      }
      const rootName = spelledPitchName(rootSpelling);
      const targets = scale.intervals.map((interval) => root + interval);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Build the {root} {scale} scale.', { root: rootName, scale: t(scaleName) }),
        instruction: t('Select the seven notes in ascending order, then check.'),
        targetMidis: targets,
        ordered: true,
        targetLabel: `${rootName} ${scaleName}`,
        answer: names,
        explanation: t('The {scale} scale on {root} is {notes}.', {
          scale: t(scaleName),
          root: rootName,
          notes: names,
        }),
        hint: t('Major pattern: whole–whole–half–whole–whole–whole–half.'),
        skills,
      };
    }

    case 'key-signature': {
      const max = config.maxAccidentals ?? 4;
      const keyMode = config.keyMode ?? 'major';
      const keyType = config.keyType ?? 'mixed';
      const candidates = KEY_SIGNATURES.filter(
        (key) => key.count <= max && (keyType === 'mixed' || key.count === 0 || key.type === keyType),
      );
      const key = randomItem(candidates);
      const mode: 'major' | 'minor' =
        keyMode === 'mixed' ? (Math.random() < 0.5 ? 'major' : 'minor') : keyMode;
      const clef: Clef = config.clef && config.clef !== 'both' ? config.clef : Math.random() < 0.5 ? 'treble' : 'bass';
      const answer = t(mode === 'major' ? '{key} major' : '{key} minor', {
        key: mode === 'major' ? key.major : key.minor.replace('m', ''),
      });
      const pool = (candidates.length >= 4 ? candidates : KEY_SIGNATURES)
        .filter((candidate) => candidate !== key)
        .map((candidate) =>
          t(mode === 'major' ? '{key} major' : '{key} minor', {
            key: mode === 'major' ? candidate.major : candidate.minor.replace('m', ''),
          }),
        );
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('What {mode} key does this key signature represent?', { mode: t(mode) }),
        instruction: t('Read the clef and the number of sharps or flats.'),
        staff: {
          clef,
          notes: [],
          keySig:
            key.count === 0
              ? undefined
              : { count: key.count, type: key.type as 'sharp' | 'flat' },
        },
        choices: mcChoices(answer, pool),
        answer,
        explanation:
          key.count === 0
            ? t('No sharps or flats means C major or A minor.')
            : t('{count} {accidentals} means {major} major or {minor} minor.', {
                count: key.count,
                accidentals: t(
                  key.count === 1
                    ? key.type === 'sharp'
                      ? 'sharp'
                      : 'flat'
                    : key.type === 'sharp'
                      ? 'sharps'
                      : 'flats',
                ),
                major: key.major,
                minor: key.minor.replace('m', ''),
              }),
        hint: t(
          'For sharps, the last sharp is a half step below the major tonic. For flats, the second-to-last flat is the tonic.',
        ),
        skills,
      };
    }

    case 'rhythm-count': {
      const total = randomItem(config.totalBeats ?? [2, 3, 4]);
      const items = makeRhythm(total);
      const described = items
        .map((item) =>
          t(item.beats === 1 ? '{name} ({beats} beat)' : '{name} ({beats} beats)', {
            name: rhythmName(item.beats),
            beats: item.beats,
          }),
        )
        .join(' + ');
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('How many beats are in this bar?'),
        instruction: t('Add up the note values from left to right.'),
        rhythm: { items },
        choices: shuffle([2, 3, 4, 6].map((n) => t('{n} beats', { n }))),
        answer: t('{n} beats', { n: total }),
        explanation: t('{described} = {total} beats.', { described, total }),
        hint: t('Whole = 4 beats, half = 2, quarter = 1, eighth = ½. A dot adds half of the note value.'),
        skills,
      };
    }

    case 'rhythm-dictation': {
      const pattern = [...randomRhythmBar(), ...randomRhythmBar()];
      const seen = new Set([rhythmKey(pattern)]);
      const options: RhythmItem[][] = [pattern];
      const add = (candidate: RhythmItem[]) => {
        if (options.length >= 4) return;
        const key = rhythmKey(candidate);
        const total = candidate.reduce((sum, item) => sum + Math.abs(item.beats), 0);
        if (seen.has(key) || Math.abs(total - 8) > 0.001) return;
        seen.add(key);
        options.push(candidate);
      };
      shuffle(rhythmVariants(pattern)).forEach(add);
      let guard = 0;
      while (options.length < 4 && guard < 40) {
        add([...randomRhythmBar(), ...randomRhythmBar()]);
        guard += 1;
      }
      const order = shuffle(options.map((_, index) => index));
      const choiceRhythms = order.map((index) => options[index]);
      const correctIndex = order.indexOf(0);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Which rhythm do you hear?'),
        instruction: t('Two bars of 4/4. Listen for long notes, short notes, and rests.'),
        audio: { rhythm: pattern, mode: 'sequence' },
        autoPlay: true,
        choices: choiceRhythms.map((_, index) => `rhythm-${index}`),
        choiceRhythms,
        answer: `rhythm-${correctIndex}`,
        explanation: t('The rhythm is {description}.', { description: rhythmDescription(pattern) }),
        hint: t('Tap the pulse first, then decide which beats are silent or split into two.'),
        skills,
      };
    }

    case 'degree-ear': {
      const scaleName = randomItem<ScaleName>(config.scales ?? ['Major']);
      const scale = scaleByName(scaleName);
      const degrees = config.degrees ?? [2, 3, 4, 5, 6, 7];
      const degree = randomItem(degrees);
      const root = 55 + Math.floor(Math.random() * 10);
      const candidates = commonRootSpellings(pitchClass(root));
      let rootSpelling = candidates[0];
      for (const candidate of candidates) {
        const spelled = scale.intervals.map((interval, index) => spellFromRoot(candidate, index, interval));
        if (spelled.every((pitch) => Math.abs(pitch.accidental) <= 1)) {
          rootSpelling = candidate;
          break;
        }
      }
      const rootName = spelledPitchName(rootSpelling);
      const target = root + scale.intervals[degree - 1];
      const degreeSpelling = spellFromRoot(rootSpelling, degree - 1, scale.intervals[degree - 1]);
      const degreeLabel = scale.degrees[degree - 1];
      const answer = degreeLabel;
      const allowedLabels = (config.degrees ?? [2, 3, 4, 5, 6, 7]).map((value) => scale.degrees[value - 1]);
      const filler = scale.degrees.filter((label) => !allowedLabels.includes(label));
      const pool = allowedLabels.length >= 4 ? allowedLabels : [...allowedLabels, ...filler].slice(0, 4);
      const options = mcChoices(answer, pool);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('In {root} {scale}, which scale degree is this note?', {
          root: rootName,
          scale: t(scaleName),
        }),
        instruction: t('The tonic is played first, then the mystery note.'),
        audio: { midis: [root, target], mode: 'sequence', tempo: 0.7 },
        autoPlay: true,
        choices: options,
        answer,
        explanation: t('{note} is the {degree} of {root} {scale}.', {
          note: spelledPitchName(degreeSpelling),
          degree: degreeLabel,
          root: rootName,
          scale: t(scaleName),
        }),
        hint: t('Hear the tonic as home, then measure how far the note pulls away from it.'),
        skills,
      };
    }

    case 'functional-degree': {
      const scale = scaleByName('Major');
      const degrees = config.degrees ?? [2, 3, 4, 5, 6, 7];
      const degree = randomItem(degrees);
      const root = 55 + Math.floor(Math.random() * 8);
      const tonicChord = [root, root + 4, root + 7];
      const target = root + scale.intervals[degree - 1];
      const rootSpelling = preferredRootSpelling(pitchClass(root));
      const rootName = spelledPitchName(rootSpelling);
      const degreeSpelling = spellFromRoot(
        rootSpelling,
        degree - 1,
        scale.intervals[degree - 1],
      );
      const label = scale.degrees[degree - 1];
      const allowedLabels = degrees.map((value) => scale.degrees[value - 1]);
      const filler = scale.degrees.filter((value) => !allowedLabels.includes(value));
      const pool =
        allowedLabels.length >= 4 ? allowedLabels : [...allowedLabels, ...filler].slice(0, 4);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Which scale degree is the last note?'),
        instruction: t(
          'The tonic chord is played first, then the tonic an octave higher, then the mystery note.',
        ),
        audio: { midis: [...tonicChord, root + 12, target], mode: 'sequence', tempo: 0.6 },
        autoPlay: true,
        choices: mcChoices(label, pool),
        answer: label,
        explanation: t('In {root} major, the last note is {note}, scale degree {degree}.', {
          root: rootName,
          note: spelledPitchName(degreeSpelling),
          degree: label,
        }),
        hint: t(
          'The tonic chord tells you the key. Hear the mystery note against the tonic, not against the chord that just ended.',
        ),
        skills,
      };
    }

    case 'chord-function': {
      const degrees = config.degrees ?? [2, 3, 4, 5, 6];
      const targetDegree = randomItem(degrees);
      const root = 48 + Math.floor(Math.random() * 12);
      const rootSpelling = preferredRootSpelling(pitchClass(root));
      const rootName = spelledPitchName(rootSpelling);
      const tonic = MAJOR_TRIADS[0];
      const target = MAJOR_TRIADS[targetDegree - 1] ?? MAJOR_TRIADS[4];
      const build = (triad: (typeof MAJOR_TRIADS)[number]) => {
        const offset = MAJOR_SCALE[triad.degree];
        return chordByName(triad.quality).intervals.map((interval) => root + offset + interval);
      };
      const tonicMidis = build(tonic);
      const targetMidis = build(target);
      const targetRoot = spellFromRoot(rootSpelling, target.degree, MAJOR_SCALE[target.degree]);
      const targetName = `${spelledPitchName(targetRoot)}${chordByName(target.quality).symbol}`;
      const tonicName = `${rootName}${chordByName(tonic.quality).symbol}`;
      const allowedRomans = degrees
        .map((degree) => MAJOR_TRIADS[degree - 1]?.roman)
        .filter(Boolean) as string[];
      const fillerRomans = MAJOR_TRIADS.map((triad) => triad.roman).filter(
        (roman) => !allowedRomans.includes(roman),
      );
      const pool =
        allowedRomans.length >= 2 ? allowedRomans : [...allowedRomans, ...fillerRomans].slice(0, 4);
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Which chord function do you hear?'),
        instruction: t(
          'The tonic chord is played first, then the mystery chord. Name the mystery chord with a Roman numeral.',
        ),
        audio: { chords: [tonicMidis, targetMidis], mode: 'chord', tempo: 1.1 },
        autoPlay: true,
        choices: mcChoices(target.roman, pool),
        answer: target.roman,
        explanation: t(
          'In {key}, the tonic is {tonic}. The mystery chord is {chord}, which is {roman} — the chord built on degree {degree}.',
          {
            key: rootName,
            tonic: tonicName,
            chord: targetName,
            roman: target.roman,
            degree: targetDegree,
          },
        ),
        hint: t(
          'Hear the tonic chord as home, then find the root of the second chord. Its quality tells you whether it is major, minor, or diminished.',
        ),
        skills,
      };
    }

    case 'melody-dictation': {
      const root = randomItem([60, 62, 65, 67, 70]);
      const rootSpelling = preferredRootSpelling(pitchClass(root));
      const rootName = spelledPitchName(rootSpelling);
      const rootOctave = octaveOf(root);
      const rootLetterIndex = LETTERS.indexOf(rootSpelling.letter);
      const maxDegree = config.degrees ? Math.max(...config.degrees) : 5;
      const degrees = [1];
      for (let step = 1; step < 4; step += 1) {
        const previous = degrees[step - 1];
        const steps = [previous - 2, previous - 1, previous + 1, previous + 2].filter(
          (degree) => degree >= 1 && degree <= maxDegree,
        );
        // The second note should move, so the opening contour is clear.
        const options = step === 1 || steps.length === 0 ? steps : [...steps, previous];
        degrees.push(randomItem(options));
      }
      if (new Set(degrees).size === 1) degrees[3] = Math.min(maxDegree, degrees[2] + 1);

      const midis = degrees.map((degree) => root + MAJOR_SCALE[degree - 1]);
      const noteNames = degrees
        .map((degree, index) => {
          const pitch = spellFromRoot(rootSpelling, degree - 1, MAJOR_SCALE[degree - 1]);
          const octave = rootOctave + Math.floor((rootLetterIndex + degree - 1) / 7);
          return spelledFullName(pitch.letter, pitch.accidental as -1 | 0 | 1, octave);
        })
        .join('–');
      const answer = degrees.join(' – ');
      const wrongs = new Set<string>();
      let guard = 0;
      while (wrongs.size < 3 && guard < 60) {
        guard += 1;
        const candidate = [...degrees];
        // The first note is always the tonic, so distractors must keep it.
        const index = 1 + Math.floor(Math.random() * 3);
        candidate[index] = Math.max(1, Math.min(maxDegree, candidate[index] + randomItem([-2, -1, 1, 2])));
        const key = candidate.join(' – ');
        if (key !== answer) wrongs.add(key);
      }

      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Which scale-degree pattern do you hear?'),
        instruction: t('The melody stays in one major key and begins on the tonic.'),
        audio: { midis, mode: 'sequence', tempo: 0.55 },
        autoPlay: true,
        choices: shuffle([answer, ...wrongs]),
        answer,
        explanation: t('In {root} major the notes are {notes}, degrees {degrees}.', {
          root: rootName,
          notes: noteNames,
          degrees: answer,
        }),
        hint: t('Hear the first note as 1, then track whether the line steps up or down.'),
        skills,
      };
    }

    case 'progression-ear': {
      const allowed = config.progressions
        ? PROGRESSIONS.filter((progression) => config.progressions!.includes(progression.label))
        : PROGRESSIONS;
      const progression = randomItem(allowed.length ? allowed : PROGRESSIONS);
      const root = 48 + Math.floor(Math.random() * 9);
      const rootSpelling = preferredRootSpelling(pitchClass(root));
      const rootName = spelledPitchName(rootSpelling);
      const chords = buildProgressionChords(root, progression);
      const chordNames = progression.degrees
        .map((degree) => spelledPitchName(spellFromRoot(rootSpelling, degree, MAJOR_SCALE[degree])))
        .join(' – ');
      return {
        id: qid(spec.kind),
        kind: spec.kind,
        prompt: t('Which progression do you hear?'),
        instruction: t('Listen to the four (or three) chords in sequence.'),
        audio: { chords, mode: 'chord', tempo: 0.9 },
        autoPlay: true,
        choices: mcChoices(
          progression.label,
          (allowed.length >= 4 ? allowed : PROGRESSIONS).map((item) => item.label),
        ).map((label) => t(label)),
        answer: t(progression.label),
        explanation: t('In {root} major the chords are {chords} ({progression}).', {
          root: rootName,
          chords: chordNames,
          progression: t(progression.label),
        }),
        hint: t('Focus on the bass motion and whether the phrase feels resolved, suspended, or looped.'),
        skills,
      };
    }

    default:
      return null;
  }
}

export function generateSession(specs: ExerciseSpec[]): Question[] {
  const questions: Question[] = [];
  specs.forEach((spec) => {
    for (let i = 0; i < spec.count; i++) {
      const question = generateQuestion(spec);
      if (question) questions.push(question);
    }
  });
  return questions;
}

export const EXERCISE_LABELS: Record<ExerciseKind, string> = {
  'note-reading': 'Staff reading',
  'find-note': 'Find the note',
  'interval-ear': 'Interval ear training',
  'interval-id': 'Written intervals',
  'chord-ear': 'Chord ear training',
  'chord-inversion': 'Chord inversions',
  'chord-build': 'Build chords',
  'scale-build': 'Build scales',
  'key-signature': 'Key signatures',
  'rhythm-count': 'Rhythm counting',
  'rhythm-dictation': 'Rhythm dictation',
  'degree-ear': 'Scale degrees',
  'functional-degree': 'Functional degrees',
  'chord-function': 'Chord functions',
  'melody-dictation': 'Melodic dictation',
  'progression-ear': 'Progressions',
};

export function exerciseSkillLabel(skill: string): string {
  if (getLanguage() === 'fa') {
    const translated = faSkillLabels[skill as keyof typeof faSkillLabels];
    if (translated) return translated;
  }
  const map: Record<string, string> = {
    'note-reading-treble': 'Treble clef reading',
    'note-reading-bass': 'Bass clef reading',
    'note-reading-accidentals': 'Accidentals in reading',
    'note-reading-wide': 'Reading across the grand staff',
    'find-note-natural': 'Finding natural notes',
    'find-note-chromatic': 'Finding sharps and flats',
    'interval-ear-basic': 'Basic interval recognition',
    'interval-ear-all': 'All intervals by ear',
    'interval-id-written': 'Reading intervals',
    'chord-ear-triads': 'Triad quality by ear',
    'chord-ear-sevenths': 'Seventh chords by ear',
    'chord-inversion': 'Chord inversions',
    'chord-build-triads': 'Building triads',
    'scale-build-major': 'Building major scales',
    'scale-build-minor': 'Building minor scales',
    'scale-build-modes': 'Building modes',
    'key-signature-sharps': 'Sharp key signatures',
    'key-signature-flats': 'Flat key signatures',
    'key-signature-relative': 'Relative keys',
    'rhythm-count-basic': 'Counting note values',
    'rhythm-count-dotted': 'Dotted notes and rests',
    'rhythm-dictation': 'Rhythmic dictation',
    'degree-ear-major': 'Scale degrees by ear',
    'functional-degree': 'Scale degrees in a key',
    'chord-function': 'Chord functions by ear',
    'melody-dictation': 'Melodic dictation',
    'progression-ear-cadences': 'Cadences by ear',
    'progression-ear-pop': 'Common progressions by ear',
  };
  return t(map[skill] ?? skill.replace(/-/g, ' '));
}

export const TOPIC_SPECS = {
  'staff-reading': {
    label: 'Staff reading',
    description: 'Name notes from treble and bass clefs.',
    kind: 'note-reading' as ExerciseKind,
    skills: ['note-reading-treble', 'note-reading-bass'],
    easy: { clef: 'treble', accidentals: false },
    medium: { clef: 'both', accidentals: false },
    hard: { clef: 'both', accidentals: true },
  },
  'find-notes': {
    label: 'Find notes',
    description: 'Locate notes on the piano and fretboard.',
    kind: 'find-note' as ExerciseKind,
    skills: ['find-note-natural', 'find-note-chromatic'],
    easy: { accidentals: false },
    medium: { accidentals: true },
    hard: { accidentals: true },
  },
  intervals: {
    label: 'Ear intervals',
    description: 'Identify intervals by sound.',
    kind: 'interval-ear' as ExerciseKind,
    skills: ['interval-ear-basic', 'interval-ear-all'],
    easy: { intervals: [2, 3, 4, 5, 7, 12] },
    medium: { intervals: [1, 2, 3, 4, 5, 7, 8, 9, 12] },
    hard: { intervals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  },
  'written-intervals': {
    label: 'Read intervals',
    description: 'Measure the interval between two written notes.',
    kind: 'interval-id' as ExerciseKind,
    skills: ['interval-id-written'],
    easy: {
      writtenIntervals: ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'],
    },
    medium: {
      writtenIntervals: [
        'Minor 2nd',
        'Major 2nd',
        'Augmented 2nd',
        'Minor 3rd',
        'Major 3rd',
        'Perfect 4th',
        'Augmented 4th',
        'Diminished 5th',
        'Perfect 5th',
        'Minor 6th',
        'Major 6th',
        'Minor 7th',
        'Major 7th',
        'Octave',
      ],
    },
    hard: {},
  },
  chords: {
    label: 'Ear chords',
    description: 'Recognise major, minor, diminished, augmented, and seventh chords.',
    kind: 'chord-ear' as ExerciseKind,
    skills: ['chord-ear-triads', 'chord-ear-sevenths'],
    easy: { qualities: ['Major', 'Minor'] },
    medium: { qualities: ['Major', 'Minor', 'Diminished', 'Augmented'] },
    hard: { qualities: ['Major', 'Minor', 'Diminished', 'Augmented', 'Major 7th', 'Dominant 7th', 'Minor 7th'] },
  },
  inversions: {
    label: 'Chord inversions',
    description: 'Read root position, first, second, and third inversions.',
    kind: 'chord-inversion' as ExerciseKind,
    skills: ['chord-inversion'],
    easy: { qualities: ['Major', 'Minor'] },
    medium: { qualities: ['Major', 'Minor', 'Diminished', 'Augmented'] },
    hard: {
      qualities: [
        'Major',
        'Minor',
        'Diminished',
        'Augmented',
        'Major 7th',
        'Dominant 7th',
        'Minor 7th',
        'Half-diminished 7th',
      ],
    },
  },
  keys: {
    label: 'Key signatures',
    description: 'Read sharps and flats and name the key.',
    kind: 'key-signature' as ExerciseKind,
    skills: ['key-signature-sharps', 'key-signature-flats', 'key-signature-relative'],
    easy: { maxAccidentals: 2, keyMode: 'major' },
    medium: { maxAccidentals: 4, keyMode: 'major' },
    hard: { maxAccidentals: 7, keyMode: 'mixed' },
  },
  scales: {
    label: 'Build scales',
    description: 'Construct scales on the instrument.',
    kind: 'scale-build' as ExerciseKind,
    skills: ['scale-build-major', 'scale-build-minor'],
    easy: { scales: ['Major'] },
    medium: { scales: ['Major', 'Natural minor'] },
    hard: { scales: ['Major', 'Natural minor', 'Harmonic minor', 'Dorian', 'Mixolydian'] },
  },
  rhythm: {
    label: 'Rhythm',
    description: 'Add up note values and count the bar.',
    kind: 'rhythm-count' as ExerciseKind,
    skills: ['rhythm-count-basic', 'rhythm-count-dotted'],
    easy: { totalBeats: [2, 3, 4] },
    medium: { totalBeats: [2, 3, 4] },
    hard: { totalBeats: [3, 4, 6] },
  },
  'rhythm-dictation': {
    label: 'Rhythm dictation',
    description: 'Hear a two-bar rhythm and choose its notation.',
    kind: 'rhythm-dictation' as ExerciseKind,
    skills: ['rhythm-dictation'],
    easy: {},
    medium: {},
    hard: {},
  },
  degrees: {
    label: 'Scale degrees',
    description: 'Hear where a note sits inside the scale.',
    kind: 'degree-ear' as ExerciseKind,
    skills: ['degree-ear-major'],
    easy: { scales: ['Major'], degrees: [2, 3, 4, 5] },
    medium: { scales: ['Major'], degrees: [2, 3, 4, 5, 6, 7] },
    hard: { scales: ['Major', 'Natural minor'], degrees: [2, 3, 4, 5, 6, 7] },
  },
  'functional-degrees': {
    label: 'Functional degrees',
    description: 'Name a scale degree after hearing the tonic chord establish the key.',
    kind: 'functional-degree' as ExerciseKind,
    skills: ['functional-degree'],
    easy: { degrees: [2, 3, 5] },
    medium: { degrees: [2, 3, 4, 5, 6, 7] },
    hard: { degrees: [2, 3, 4, 5, 6, 7] },
  },
  'chord-functions': {
    label: 'Chord functions',
    description: 'Hear a tonic chord, then name the Roman numeral of the chord that follows.',
    kind: 'chord-function' as ExerciseKind,
    skills: ['chord-function'],
    easy: { degrees: [4, 5] },
    medium: { degrees: [2, 3, 4, 5, 6] },
    hard: { degrees: [2, 3, 4, 5, 6, 7] },
  },
  'melody-dictation': {
    label: 'Melodic dictation',
    description: 'Hear a short melody and name its scale degrees.',
    kind: 'melody-dictation' as ExerciseKind,
    skills: ['melody-dictation'],
    easy: { degrees: [1, 2, 3] },
    medium: { degrees: [1, 2, 3, 4, 5] },
    hard: { degrees: [1, 2, 3, 4, 5, 6, 7] },
  },
  progressions: {
    label: 'Progressions',
    description: 'Identify common chord progressions and cadences.',
    kind: 'progression-ear' as ExerciseKind,
    skills: ['progression-ear-cadences', 'progression-ear-pop'],
    easy: { progressions: ['I–V–I (authentic cadence)', 'I–IV–V–I', 'I–vi–IV–V (pop)'] },
    medium: {
      progressions: [
        'I–V–I (authentic cadence)',
        'I–IV–V–I',
        'I–vi–IV–V (pop)',
        'ii–V–I (jazz cadence)',
        'vi–IV–I–V',
        'V–vi (deceptive cadence)',
        'IV–I (plagal cadence)',
        'I–V (half cadence)',
      ],
    },
    hard: {},
  },
} as const;

export type TopicId = keyof typeof TOPIC_SPECS;
export type Difficulty = 'easy' | 'medium' | 'hard';

export function topicSpec(topic: TopicId, difficulty: Difficulty, count: number): ExerciseSpec {
  const topicDef = TOPIC_SPECS[topic];
  const config = topicDef[difficulty] as Record<string, unknown>;
  return {
    kind: topicDef.kind,
    count,
    skills: [...topicDef.skills],
    config: config as ExerciseConfig,
    label: topicDef.label,
  };
}

/** Blueprints used when a learner has no history yet. */
export const STARTER_SPECS: ExerciseSpec[] = [
  { kind: 'note-reading', count: 4, skills: ['note-reading-treble'], config: { clef: 'treble' }, label: 'Treble clef reading' },
  { kind: 'find-note', count: 3, skills: ['find-note-natural'], config: { accidentals: false }, label: 'Finding natural notes' },
  { kind: 'interval-ear', count: 3, skills: ['interval-ear-basic'], config: { intervals: [2, 4, 5, 7, 12] }, label: 'Interval recognition' },
  { kind: 'rhythm-count', count: 2, skills: ['rhythm-count-basic'], label: 'Rhythm counting' },
];

export function scaleIntervals(scale: ScaleName): number[] {
  return scaleByName(scale).intervals;
}

export function compareInstrumentInput(question: Question, input: number[]): boolean {
  if (question.targetMidis) {
    const targetPitchClasses = question.targetMidis.map(pitchClass);
    const inputPitchClasses = input.map(pitchClass);
    if (question.ordered) {
      return (
        targetPitchClasses.length === inputPitchClasses.length &&
        targetPitchClasses.every((pc, index) => pc === inputPitchClasses[index])
      );
    }
    if (targetPitchClasses.length !== inputPitchClasses.length) return false;
    const remaining = [...inputPitchClasses];
    return targetPitchClasses.every((pc) => {
      const index = remaining.indexOf(pc);
      if (index === -1) return false;
      remaining.splice(index, 1);
      return true;
    });
  }
  if (question.targetMidi !== undefined) {
    return input.length === 1 && pitchClass(input[0]) === pitchClass(question.targetMidi);
  }
  return false;
}

export function correctInstrumentAnswer(question: Question): number[] {
  if (question.targetMidis) return question.targetMidis;
  if (question.targetMidi !== undefined) return [question.targetMidi];
  return [];
}

export function randomKeySignature(): KeySignature {
  return randomItem(KEY_SIGNATURES);
}

export function staffPreview(clef: Clef, keySig?: KeySignature): StaffSpec {
  return {
    clef,
    notes: [],
    keySig: keySig && keySig.count > 0 ? { count: keySig.count, type: keySig.type as 'sharp' | 'flat' } : undefined,
  };
}
