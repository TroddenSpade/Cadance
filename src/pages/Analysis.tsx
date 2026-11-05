import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icons';
import PlayAlongControls from '../components/PlayAlongControls';
import {
  ANALYSIS_MAP,
  ANALYSIS_PROGRESSIONS,
  CADENCES,
  detectCadence,
  progressionPattern,
  type CadenceId,
  type ChordFunction,
} from '../lib/analysis';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';
import { usePlayAlong } from '../lib/playAlong';

const CADENCE_INFO: Record<Exclude<CadenceId, 'none'>, { label: string; description: string }> = {
  authentic: {
    label: 'Authentic cadence',
    description: 'V resolves to I. The leading tone rises and the tonic feels settled.',
  },
  plagal: {
    label: 'Plagal cadence',
    description: 'IV moves to I without the leading tone. The close is softer and more circular.',
  },
  deceptive: {
    label: 'Deceptive cadence',
    description: 'V resolves to vi instead of I. The dominant arrives, but the expected home is withheld.',
  },
  half: {
    label: 'Half cadence',
    description: 'The phrase stops on V. It is open, not closed, and invites an answering phrase.',
  },
};

const FUNCTION_LABELS: Record<ChordFunction, string> = {
  tonic: 'Tonic',
  predominant: 'Predominant',
  dominant: 'Dominant',
  colour: 'Colour',
};

export default function Analysis() {
  const { t } = useI18n();
  const { lessonMap } = useCurriculum();
  const [params] = useSearchParams();
  const requested = params.get('progression');
  const [activeId, setActiveId] = useState(() =>
    requested && ANALYSIS_MAP[requested] ? requested : ANALYSIS_PROGRESSIONS[0].id,
  );
  const [showRomans, setShowRomans] = useState(true);
  const [chosen, setChosen] = useState<CadenceId | null>(null);

  const active = ANALYSIS_MAP[activeId] ?? ANALYSIS_PROGRESSIONS[0];
  const pattern = useMemo(() => progressionPattern(active), [active]);
  const controls = usePlayAlong(pattern, {
    bpm: 84,
    countIn: 4,
    loop: true,
    click: false,
  });
  const answer = detectCadence(active.chords.map((chord) => chord.roman));
  const answerInfo = answer === 'none' ? null : CADENCE_INFO[answer];
  const lessons = active.lessonIds
    .map((id) => lessonMap[id])
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));

  const choose = (id: string) => {
    setActiveId(id);
    setChosen(null);
    controls.stop();
  };

  return (
    <div className="page analysis-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Harmony analysis')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Read the numerals')}</span>
          <h1>{t('Harmony analysis')}</h1>
          <p>
            {t(
              'Take a short progression apart: name each chord by its function, hear the bass move, and decide how the phrase closes. Roman numerals turn a pile of chord symbols into a map.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Current key')}</span>
          <strong>{t(active.keyLabel)}</strong>
          <small>
            {t(active.mode === 'major' ? 'Major' : 'Minor')} · {t('{n} chords', { n: active.chords.length })}
          </small>
        </div>
      </header>

      <section className="panel analysis-choose">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Choose a progression')}</span>
            <h2>{t('Eight phrases to unpack')}</h2>
          </div>
        </div>
        <div className="analysis-list" role="list">
          {ANALYSIS_PROGRESSIONS.map((progression) => (
            <button
              key={progression.id}
              type="button"
              role="listitem"
              className={`analysis-card ${progression.id === activeId ? 'selected' : ''}`}
              aria-pressed={progression.id === activeId}
              onClick={() => choose(progression.id)}
            >
              <span className="analysis-card-key">{t(progression.keyLabel)}</span>
              <strong>{t(progression.title)}</strong>
              <small>{t(progression.blurb)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel analysis-room">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Analysis workbench')}</span>
            <h2>{t(active.title)}</h2>
            <p className="room-note">{t(active.blurb)}</p>
          </div>
          <button
            type="button"
            className={`button ghost small ${showRomans ? 'active' : ''}`}
            aria-pressed={showRomans}
            onClick={() => setShowRomans((current) => !current)}
          >
            <Icon name="book" size={14} />{' '}
            {showRomans ? t('Hide Roman numerals') : t('Show Roman numerals')}
          </button>
        </div>

        <PlayAlongControls controls={controls} label={t('Analysis tempo')} />

        <div className="analysis-chords" role="list" aria-label={t('Chord functions')}>
          {active.chords.map((chord, index) => (
            <div
              key={`${chord.roman}-${index}`}
              role="listitem"
              className={`analysis-chord fn-${chord.func}`}
            >
              <span className="analysis-chord-bar">{t('Bar {n}', { n: index + 1 })}</span>
              <strong>{chord.symbol}</strong>
              <span className="analysis-roman">
                {showRomans ? chord.roman : '—'}
              </span>
              <small>{t(FUNCTION_LABELS[chord.func])}</small>
            </div>
          ))}
        </div>

        <div className="analysis-legend" aria-label={t('Functions')}>
          {(Object.keys(FUNCTION_LABELS) as ChordFunction[]).map((func) => (
            <span key={func} className={`analysis-key fn-${func}`}>
              {t(FUNCTION_LABELS[func])}
            </span>
          ))}
        </div>
      </section>

      <section className="panel analysis-cadence">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Cadence check')}</span>
            <h2>{t('Name the cadence')}</h2>
            <p className="room-note">
              {t('Listen to the last two chords, then choose what closes the phrase.')}
            </p>
          </div>
        </div>

        <div className="cadence-options" role="group" aria-label={t('Cadence')}>
          {CADENCES.map((cadence) => {
            const info = CADENCE_INFO[cadence as Exclude<CadenceId, 'none'>];
            const isAnswer = cadence === answer;
            const isChosen = cadence === chosen;
            const className = chosen
              ? isAnswer
                ? 'correct'
                : isChosen
                  ? 'wrong'
                  : ''
              : '';
            return (
              <button
                key={cadence}
                type="button"
                className={`cadence-option ${className}`}
                aria-pressed={isChosen}
                onClick={() => setChosen(cadence)}
              >
                <strong>{t(info.label)}</strong>
                <small>{t(info.description)}</small>
              </button>
            );
          })}
        </div>

        {chosen && answerInfo && (
          <div
            className={`cadence-feedback ${chosen === answer ? 'correct' : 'wrong'}`}
            role="status"
          >
            <strong>
              {chosen === answer ? t('Correct — {cadence}.', { cadence: t(answerInfo.label) }) : t('Not quite. This phrase ends with a {cadence}.', { cadence: t(answerInfo.label) })}
            </strong>
            <p>{t(answerInfo.description)}</p>
          </div>
        )}
      </section>

      <section className="panel analysis-notes">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('What to listen for')}</span>
            <h2>{t('From symbols to functions')}</h2>
          </div>
        </div>
        <ol>
          <li>{t('Circle every chord that is not diatonic before you name the cadence.')}</li>
          <li>{t('Reduce each chord to its function: tonic, predominant, or dominant.')}</li>
          <li>{t('Follow the bass line. It usually tells you which chord tone is in the root.')}</li>
          <li>{t('Name the cadence last. The final two chords usually decide it.')}</li>
        </ol>
        <div className="analysis-lessons">
          {lessons.map((lesson) => (
            <Link key={lesson.id} className="text-link" to={`/lesson/${lesson.id}`}>
              {lesson.title} <Icon name="arrow" size={14} />
            </Link>
          ))}
        </div>
        <div className="loop-links">
          <Link className="text-link" to="/paths">
            {t('Follow a style path')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/glossary">
            {t('Open the glossary')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/loops">
            {t('Hear it over a loop')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
