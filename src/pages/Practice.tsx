import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExerciseSession from '../components/ExerciseSession';
import Icon from '../components/Icons';
import ProgressRing from '../components/ProgressRing';
import { STARTER_SPECS, exerciseSkillLabel } from '../lib/exercises';
import { SKILL_BLUEPRINTS } from '../data/curriculum';
import { todayCount } from '../lib/courseStats';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';
import type { ExerciseSpec, SessionResult } from '../lib/types';

export default function Practice() {
  const { t, formatDate } = useI18n();
  const { state, settings, dueSkills } = useProgress();
  const [started, setStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  const learned = Object.values(state.skills);
  const dueIds = new Set(dueSkills.map((skill) => skill.id));
  const weak = learned
    .filter((skill) => !dueIds.has(skill.id))
    .sort((a, b) => a.strength - b.strength);
  const candidates = [...dueSkills, ...weak].slice(0, 6);
  const isStarter = learned.length === 0;

  const learnedSpecs: ExerciseSpec[] = candidates.flatMap((skill): ExerciseSpec[] => {
    const blueprint = SKILL_BLUEPRINTS[skill.id];
    if (!blueprint) return [];
    return [{ ...blueprint, count: 2, label: exerciseSkillLabel(skill.id) }];
  });
  const specs: ExerciseSpec[] = isStarter || learnedSpecs.length === 0 ? STARTER_SPECS : learnedSpecs;

  const totalQuestions = specs.reduce((sum, spec) => sum + spec.count, 0);
  const today = todayCount(state);
  const goalPercent = Math.min(100, (today / settings.dailyGoal) * 100);
  const dateLabel = formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' });
  const instrumentLabel =
    settings.instrument === 'both'
      ? t('Piano & guitar')
      : settings.instrument === 'piano'
        ? t('Piano')
        : t('Guitar');

  if (started) {
    return (
      <div className="page practice-page">
        <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
          <Link to="/">{t('Today')}</Link>
          <Icon name="chevron" size={13} />
          <span>{t('Daily practice')}</span>
        </nav>
        <ExerciseSession
          key={sessionKey}
          specs={specs}
          title={isStarter ? t('Starter session') : t('Daily practice')}
          context="practice"
          onFinish={(result) => setLastResult(result)}
          onDone={() => {
            setStarted(false);
            setSessionKey((value) => value + 1);
          }}
          onExit={() => setStarted(false)}
        />
      </div>
    );
  }

  return (
    <div className="page practice-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{dateLabel}</span>
          <h1>{t('Daily practice')}</h1>
          <p>
            {t(
              'A short adaptive session built from what you have learned. Skills return just before you are likely to forget them, then at wider intervals as they stick.',
            )}
          </p>
        </div>
        <div className="header-stat practice-header-stat">
          <ProgressRing percent={goalPercent}>
            <strong>{today}</strong>
            <span>{t('of {n}', { n: settings.dailyGoal })}</span>
          </ProgressRing>
          <div>
            <span className="eyebrow">{t('Daily goal')}</span>
            <strong>{t('{n} questions to go', { n: Math.max(0, settings.dailyGoal - today) })}</strong>
            <small>{t('{n} reviews due now', { n: dueSkills.length })}</small>
          </div>
        </div>
      </header>

      {lastResult && (
        <div className="practice-toast">
          <span className="practice-toast-icon">
            <Icon name="check" size={18} />
          </span>
          <div>
            <strong>{t('Session logged')}</strong>
            <p>
              {t('{correct} of {total} correct — {percent}%. Your next reviews have been scheduled.', {
                correct: lastResult.correct,
                total: lastResult.total,
                percent: Math.round(lastResult.accuracy * 100),
              })}
            </p>
          </div>
          <button className="button secondary small" onClick={() => setLastResult(null)}>
            {t('Dismiss')}
          </button>
        </div>
      )}

      <div className="practice-layout">
        <section className="panel practice-queue">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{isStarter ? t('Start here') : t('Today’s queue')}</span>
              <h2>
                {isStarter
                  ? t('Starter session')
                  : t('{questions} questions across {skills} skills', {
                      questions: totalQuestions,
                      skills: specs.length,
                    })}
              </h2>
            </div>
            <span className="topic-chip muted">{isStarter ? t('Foundation mix') : t('Adaptive')}</span>
          </div>

          {isStarter ? (
            <div className="starter-callout">
              <div className="starter-callout-icon">
                <Icon name="spark" size={22} />
              </div>
              <div>
                <h3>{t('No history yet — here is a foundation mix')}</h3>
                <p>
                  {t(
                    'Once you complete a lesson, practice becomes personal: note-reading errors, intervals you miss, and chords you confuse all enter the queue automatically.',
                  )}
                </p>
              </div>
            </div>
          ) : (
            <ul className="queue-list">
              {specs.map((spec, index) => {
                const skill = spec.skills[0];
                const progress = state.skills[skill];
                const due = progress ? progress.dueAt <= Date.now() : true;
                return (
                  <li key={`${skill}-${index}`}>
                    <div className="queue-row">
                      <span className={`queue-index ${due ? 'due' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                      <div className="queue-copy">
                        <strong>{exerciseSkillLabel(skill)}</strong>
                        <span>
                          {t(spec.count === 1 ? '{n} question' : '{n} questions', { n: spec.count })} ·{' '}
                          {due
                            ? t('due now')
                            : progress
                              ? t('{n}% strength', { n: Math.round(progress.strength * 100) })
                              : t('new')}
                        </span>
                      </div>
                      <div className="queue-strength">
                        <div className="strength-track">
                          <div
                            className="strength-fill"
                            style={{ width: `${Math.round((progress?.strength ?? 0.2) * 100)}%` }}
                          />
                        </div>
                        <span>{due ? t('Review') : t('Keep fresh')}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="practice-start">
            <div>
              <strong>{t('Ready when you are')}</strong>
              <p>
                {t(
                  'Piano and guitar are both available for note-finding, chord, and scale questions. Current instrument:',
                )}{' '}
                <b>{instrumentLabel}</b>.
              </p>
            </div>
            <button
              className="button primary large"
              onClick={() => {
                setLastResult(null);
                setStarted(true);
              }}
            >
              <Icon name="play" size={18} />
              {t('Begin {n}-question session', { n: totalQuestions })}
            </button>
          </div>
        </section>

        <aside className="practice-side">
          <section className="panel">
            <span className="eyebrow">{t('Today')}</span>
            <h2>{t('Your rhythm')}</h2>
            <div className="practice-stats">
              <div>
                <span>{t('Streak')}</span>
                <strong>
                  <Icon name="flame" size={17} /> {t('{n} days', { n: state.streak })}
                </strong>
              </div>
              <div>
                <span>{t('Answered today')}</span>
                <strong>{today}</strong>
              </div>
              <div>
                <span>{t('Accuracy today')}</span>
                <strong>{state.daily.count ? Math.round((state.daily.correct / state.daily.count) * 100) : 0}%</strong>
              </div>
              <div>
                <span>{t('Skills tracked')}</span>
                <strong>{learned.length}</strong>
              </div>
            </div>
            <Link to="/trainer" className="text-link">
              {t('Want a specific drill? Open the trainer')} <Icon name="arrow" size={14} />
            </Link>
          </section>

          <section className="panel">
            <span className="eyebrow">{t('Spaced recall')}</span>
            <h2>{t('How scheduling works')}</h2>
            <ol className="review-timeline">
              <li>
                <span>{t('First')}</span>
                <p>{t('A skill you just learned returns within hours.')}</p>
              </li>
              <li>
                <span>{t('Then')}</span>
                <p>{t('Correct answers push it to 1, 2, 4, then 7 days.')}</p>
              </li>
              <li>
                <span>{t('Later')}</span>
                <p>{t('Strong skills stretch to 2 weeks, a month, two months.')}</p>
              </li>
              <li>
                <span>{t('Miss')}</span>
                <p>{t('A wrong answer brings it back sooner and lowers its strength.')}</p>
              </li>
            </ol>
          </section>

          <section className="panel instrument-mini">
            <span className="eyebrow">{t('Instrument')}</span>
            <div className="aside-instrument">
              <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={18} />
              <strong>{instrumentLabel}</strong>
              <Link to="/settings">{t('Change')}</Link>
            </div>
            <p className="side-note">{t('Answer on either surface. Pitch class is what counts.')}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
