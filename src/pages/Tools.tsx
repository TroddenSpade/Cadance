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
              'The utilities that sit beside the curriculum: a clock to keep time, a tuner to keep pitch honest, graded pieces to play, and an explorer for every scale and chord. Everything works offline.',
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
