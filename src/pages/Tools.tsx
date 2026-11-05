import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { useI18n } from '../lib/i18n';
import { useMetronome } from '../lib/metronome';

const TOOLS = [
  {
    to: '/metronome',
    icon: 'metronome' as const,
    title: 'Metronome',
    eyebrow: 'Time',
    open: 'Open metronome',
    description:
      'A precise AudioContext-clock metronome with meters from 2/4 to 7/8, subdivisions, downbeat accents, tap tempo, and a floating dock that follows you through the app.',
    points: ['2/4 – 7/8 meters', 'Eighth and triplet subdivisions', 'Tap tempo and floating mini-player'],
  },
  {
    to: '/tuner',
    icon: 'tuner' as const,
    title: 'Tuner',
    eyebrow: 'Pitch',
    open: 'Open tuner',
    description:
      'Tune by microphone with a needle, cents readout, and reference tones. Presets cover guitar, bass, ukulele, violin, viola, cello, double bass, mandolin, banjo, piano, and your own custom string set.',
    points: ['Guitar, bass, and orchestral strings', 'Drop D, DADGAD, open tunings', 'Custom strings and chromatic piano mode'],
  },
  {
    to: '/repertoire',
    icon: 'book' as const,
    title: 'Graded repertoire',
    eyebrow: 'Play',
    open: 'Open repertoire',
    description:
      'Short public-domain pieces with a staff, tab, chord diagrams, piano fingering, and a practice transport. Each piece links to the lesson that prepares it.',
    points: ['Eight to twelve bars per piece', 'Tempo, count-in, loop, and click', 'Right hand, left hand, or both'],
  },
  {
    to: '/explorer',
    icon: 'music' as const,
    title: 'Scale & chord explorer',
    eyebrow: 'Reference',
    open: 'Open explorer',
    description:
      'Pick any root and type to see and hear it on the staff, piano, and fretboard. Transpose by semitone and map the five CAGED chord positions.',
    points: ['Every scale and chord in the app', 'Piano fingering and root emphasis', 'CAGED shapes for major and minor'],
  },
  {
    to: '/sight-reading',
    icon: 'book' as const,
    title: 'Sight reading',
    eyebrow: 'Read',
    open: 'Open sight reading',
    description:
      'Four-bar melodies in treble or bass clef. Read the score, play it back in order, and check every pitch. The click keeps the pulse honest.',
    points: ['Four levels from steps to accidentals', 'Count-in, click, and reference tempo', 'Pitch-by-pitch feedback on piano or guitar'],
  },
  {
    to: '/rhythm',
    icon: 'metronome' as const,
    title: 'Rhythm room',
    eyebrow: 'Time',
    open: 'Open rhythm room',
    description:
      'Hear a two-bar rhythm and echo it back by tapping. The score judges the spacing of your attacks, not when you happened to begin.',
    points: ['Quarters, eighths, rests, and syncopation', 'Tap back with an internal clock', 'Timing accuracy and per-attack feedback'],
  },
  {
    to: '/loops',
    icon: 'headphones' as const,
    title: 'Backing loops',
    eyebrow: 'Play',
    open: 'Open backing loops',
    description:
      'A bass line and chord progression that repeats while you solo. Six styles, twelve keys, and the matching scale on the staff and your instrument.',
    points: ['Pop, rock, jazz, blues, waltz, and folk', 'Four-bar loops in every key', 'Two-octave solo scale on piano and guitar'],
  },
  {
    to: '/analysis',
    icon: 'music' as const,
    title: 'Harmony analysis',
    eyebrow: 'Analyse',
    open: 'Open harmony analysis',
    description:
      'Take eight short progressions apart: name each chord by function, follow the bass, and decide whether the phrase ends with an authentic, plagal, deceptive, or half cadence.',
    points: ['Roman numerals and chord functions', 'Cadence listening check', 'Links to the harmony lessons'],
  },
  {
    to: '/paths',
    icon: 'courses' as const,
    title: 'Style paths',
    eyebrow: 'Follow',
    open: 'Open style paths',
    description:
      'Four routes through the curriculum — classical, pop, jazz, and blues & folk. Each one orders lessons, pieces, loops, and analysis so the style makes sense as a whole.',
    points: ['Four traditions, one sequence', 'Progress counted from completed lessons', 'Deep links into every practice room'],
  },
  {
    to: '/glossary',
    icon: 'book' as const,
    title: 'Glossary',
    eyebrow: 'Reference',
    open: 'Open glossary',
    description:
      'The working vocabulary of the curriculum in one searchable place: notation, rhythm, intervals, harmony, form, and ear training, each linked to the lesson that teaches it.',
    points: ['Search by term, alias, or definition', 'Filter by topic', 'Jump straight to the lesson'],
  },
  {
    to: '/assignments',
    icon: 'practice' as const,
    title: 'Assignments & worksheets',
    eyebrow: 'Plan',
    open: 'Build a worksheet',
    description:
      'Build a timed practice sheet from the rooms in Cadence. Choose a focus, a length, and the activities to include, then print it and tick each task off.',
    points: ['Five focuses from reading to harmony', '15 to 60 minutes', 'Print-ready, with a route for every task'],
  },
];

export default function Tools() {
  const { t } = useI18n();
  const { settings, running } = useMetronome();

  return (
    <div className="page tools-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Practice tools')}</span>
          <h1>{t('Tools')}</h1>
          <p>
            {t(
              'The utilities that sit beside the curriculum: a clock to keep time, a tuner to keep pitch honest, graded pieces to play, an explorer for every scale and chord, rooms for sight-reading, rhythm, and backing loops, and a studio for analysis, style paths, a glossary, and printable worksheets. Everything works offline.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Metronome')}</span>
          <strong>
            {running
              ? t('{bpm} BPM · running', { bpm: settings.bpm })
              : t('{bpm} BPM', { bpm: settings.bpm })}
          </strong>
        </div>
      </header>

      <div className="tools-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to} className="tool-card">
            <span className="tool-card-glyph">
              <Icon name={tool.icon} size={30} />
            </span>
            <span className="tool-card-eyebrow">{t(tool.eyebrow)}</span>
            <h2>{t(tool.title)}</h2>
            <p>{t(tool.description)}</p>
            <ul>
              {tool.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={14} />
                  {t(point)}
                </li>
              ))}
            </ul>
            <span className="tool-card-open">
              {t(tool.open)}
              <Icon name="arrow" size={15} />
            </span>
          </Link>
        ))}
      </div>

      <section className="panel tools-tip">
        <div className="panel-head">
          <h2>{t('Using the dock')}</h2>
          <span className="panel-note">{t('Always within reach')}</span>
        </div>
        <p>
          {t(
            'Start the metronome anywhere and it keeps time in the corner of the screen. Collapse it to a single button while you play, or open it to reach tempo, meter, subdivision, accent, and volume settings. On phones it sits just above the bottom navigation.',
          )}
        </p>
      </section>
    </div>
  );
}
