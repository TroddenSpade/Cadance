export type WorksheetFocus = 'balanced' | 'reading' | 'rhythm' | 'repertoire' | 'harmony';

export type WorksheetActivityId =
  | 'warmup'
  | 'reading'
  | 'rhythm'
  | 'repertoire'
  | 'listening'
  | 'improv'
  | 'analysis'
  | 'theory';

export interface WorksheetActivity {
  id: WorksheetActivityId;
  /** English display text; translate at the call site. */
  title: string;
  instruction: string;
  route: string;
  /** Relative time weight before the requested total is distributed. */
  weight: number;
}

export interface WorksheetFocusOption {
  id: WorksheetFocus;
  title: string;
  description: string;
  activities: WorksheetActivityId[];
}

export interface WorksheetTask extends WorksheetActivity {
  minutes: number;
}

export interface Worksheet {
  focus: WorksheetFocus;
  minutes: number;
  tasks: WorksheetTask[];
}

export const MIN_WORKSHEET_MINUTES = 10;
export const MAX_WORKSHEET_MINUTES = 60;
export const WORKSHEET_MINUTES = [15, 30, 45, 60];

export const WORKSHEET_ACTIVITIES: WorksheetActivity[] = [
  {
    id: 'warmup',
    title: 'Warm-up',
    instruction: 'Set a comfortable metronome pulse and play a slow scale or open chords.',
    route: '/metronome',
    weight: 1,
  },
  {
    id: 'reading',
    title: 'Sight reading',
    instruction: 'Read one four-bar example, play it in order, then check every pitch.',
    route: '/sight-reading',
    weight: 2,
  },
  {
    id: 'rhythm',
    title: 'Rhythm echo',
    instruction: 'Listen to two bars, tap them back, then play the rhythm on one note.',
    route: '/rhythm',
    weight: 1.5,
  },
  {
    id: 'repertoire',
    title: 'Repertoire',
    instruction: 'Choose one graded piece, loop the harder two bars, then play it at half tempo.',
    route: '/repertoire',
    weight: 3,
  },
  {
    id: 'listening',
    title: 'Ear training',
    instruction: 'Complete one round of interval and progression questions in the trainer.',
    route: '/trainer',
    weight: 1.5,
  },
  {
    id: 'improv',
    title: 'Improvisation',
    instruction: 'Start a backing loop and solo with two notes, then four, then the whole scale.',
    route: '/loops',
    weight: 2,
  },
  {
    id: 'analysis',
    title: 'Analysis',
    instruction: 'Label the Roman numerals and name the cadence in one progression.',
    route: '/analysis',
    weight: 2,
  },
  {
    id: 'theory',
    title: 'Theory review',
    instruction: 'Clear the due skills in your spaced-review queue.',
    route: '/practice',
    weight: 1.5,
  },
];

export const WORKSHEET_ACTIVITY_MAP: Record<WorksheetActivityId, WorksheetActivity> =
  Object.fromEntries(
    WORKSHEET_ACTIVITIES.map((activity) => [activity.id, activity]),
  ) as Record<WorksheetActivityId, WorksheetActivity>;

export const WORKSHEET_FOCUS: WorksheetFocusOption[] = [
  {
    id: 'balanced',
    title: 'Balanced',
    description: 'A little reading, rhythm, repertoire, and listening in every sheet.',
    activities: ['warmup', 'reading', 'rhythm', 'repertoire', 'listening', 'improv', 'analysis', 'theory'],
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'More time on the staff and fewer notes to hide behind.',
    activities: ['warmup', 'reading', 'reading', 'rhythm', 'repertoire', 'theory'],
  },
  {
    id: 'rhythm',
    title: 'Rhythm',
    description: 'Pulse first: echo, count, then put the rhythm on the instrument.',
    activities: ['warmup', 'rhythm', 'rhythm', 'repertoire', 'listening', 'improv'],
  },
  {
    id: 'repertoire',
    title: 'Repertoire',
    description: 'One piece, hands separate, then together, with a recording at the end.',
    activities: ['warmup', 'repertoire', 'reading', 'repertoire', 'listening', 'analysis'],
  },
  {
    id: 'harmony',
    title: 'Harmony',
    description: 'Name functions, hear cadences, then improvise over the progression.',
    activities: ['warmup', 'theory', 'listening', 'analysis', 'improv'],
  },
];

export const WORKSHEET_FOCUS_MAP: Record<WorksheetFocus, WorksheetFocusOption> =
  Object.fromEntries(WORKSHEET_FOCUS.map((focus) => [focus.id, focus])) as Record<
    WorksheetFocus,
    WorksheetFocusOption
  >;

function clampMinutes(minutes: number): number {
  return Math.min(MAX_WORKSHEET_MINUTES, Math.max(MIN_WORKSHEET_MINUTES, Math.round(minutes)));
}

/**
 * Turn a focus, a total, and a set of activities into a timed worksheet. Every
 * task gets at least two minutes, and the largest-remainder pass makes the
 * minutes add up exactly to the requested total.
 */
export function buildWorksheet(options: {
  focus: WorksheetFocus;
  minutes: number;
  activities?: WorksheetActivityId[];
}): Worksheet {
  const minutes = clampMinutes(options.minutes);
  const focus = WORKSHEET_FOCUS_MAP[options.focus] ?? WORKSHEET_FOCUS[0];
  const requested = options.activities ?? focus.activities;
  const ids = [...new Set(requested)];
  const chosen = ids
    .map((id) => WORKSHEET_ACTIVITY_MAP[id])
    .filter((activity): activity is WorksheetActivity => Boolean(activity));

  const tasks = chosen.slice(0, Math.max(1, Math.floor(minutes / 2)));
  const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0) || 1;
  const exact = tasks.map((task) => (task.weight / totalWeight) * minutes);
  const base = exact.map((value) => Math.max(2, Math.floor(value)));
  let remaining = minutes - base.reduce((sum, value) => sum + value, 0);

  // Give leftover minutes to the largest fractional parts, then to the longest
  // weighted activities if rounding somehow overshoots.
  const order = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  let cursor = 0;
  while (remaining > 0 && order.length > 0) {
    base[order[cursor % order.length].index] += 1;
    remaining -= 1;
    cursor += 1;
  }
  while (remaining < 0) {
    const largest = base.indexOf(Math.max(...base));
    if (base[largest] <= 2) break;
    base[largest] -= 1;
    remaining += 1;
  }

  return {
    focus: focus.id,
    minutes,
    tasks: tasks.map((task, index) => ({ ...task, minutes: base[index] })),
  };
}
