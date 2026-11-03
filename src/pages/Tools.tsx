import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { useMetronome } from '../lib/metronome';

const TOOLS = [
  {
    to: '/metronome',
    icon: 'metronome' as const,
    title: 'Metronome',
    eyebrow: 'Time',
    description:
      'A precise AudioContext-clock metronome with meters from 2/4 to 7/8, subdivisions, downbeat accents, tap tempo, and a floating dock that follows you through the app.',
    points: ['2/4 – 7/8 meters', 'Eighth and triplet subdivisions', 'Tap tempo and floating mini-player'],
  },
  {
    to: '/tuner',
    icon: 'tuner' as const,
    title: 'Tuner',
    eyebrow: 'Pitch',
    description:
      'Tune by microphone with a needle, cents readout, and reference tones. Presets cover guitar, bass, ukulele, violin, viola, cello, double bass, mandolin, banjo, piano, and your own custom string set.',
    points: ['Guitar, bass, and orchestral strings', 'Drop D, DADGAD, open tunings', 'Custom strings and chromatic piano mode'],
  },
];

export default function Tools() {
  const { settings, running } = useMetronome();

  return (
    <div className="page tools-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Practice tools</span>
          <h1>Tools</h1>
          <p>
            The utilities that sit beside the curriculum: a clock to keep time and a tuner to keep pitch honest. Both
            work offline and remember your settings.
          </p>
        </div>
        <div className="header-stat">
          <span>Metronome</span>
          <strong>
            {running ? `${settings.bpm} BPM · running` : `${settings.bpm} BPM`}
          </strong>
        </div>
      </header>

      <div className="tools-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to} className="tool-card">
            <span className="tool-card-glyph">
              <Icon name={tool.icon} size={30} />
            </span>
            <span className="tool-card-eyebrow">{tool.eyebrow}</span>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
            <ul>
              {tool.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={14} />
                  {point}
                </li>
              ))}
            </ul>
            <span className="tool-card-open">
              Open {tool.title.toLowerCase()}
              <Icon name="arrow" size={15} />
            </span>
          </Link>
        ))}
      </div>

      <section className="panel tools-tip">
        <div className="panel-head">
          <h2>Using the dock</h2>
          <span className="panel-note">Always within reach</span>
        </div>
        <p>
          Start the metronome anywhere and it keeps time in the corner of the screen. Collapse it to a single button
          while you play, or open it to reach tempo, meter, subdivision, accent, and volume settings. On phones it sits
          just above the bottom navigation.
        </p>
      </section>
    </div>
  );
}
