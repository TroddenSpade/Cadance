import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ExerciseSession from '../components/ExerciseSession';
import Icon from '../components/Icons';
import { TOPIC_SPECS, exerciseSkillLabel, topicSpec, type Difficulty, type TopicId } from '../lib/exercises';
import { useI18n } from '../lib/i18n';
import { sample } from '../lib/music';
import { useProgress } from '../lib/progress';
import type { ExerciseSpec } from '../lib/types';

const TOPIC_GLYPHS: Record<string, string> = {
  'staff-reading': '𝄞',
  'find-notes': '◎',
  intervals: '↕',
  'written-intervals': '𝄢',
  chords: '♬',
  inversions: '↥',
  keys: '♯',
  scales: '☼',
  rhythm: '♩',
  'rhythm-dictation': '♩♪',
  degrees: '7',
  'melody-dictation': '♪',
  progressions: 'I–V',
  mixed: '✦',
};

const TOPIC_ORDER: TopicId[] = [
  'staff-reading',
  'find-notes',
  'intervals',
  'written-intervals',
  'chords',
  'inversions',
  'keys',
  'scales',
  'rhythm',
  'rhythm-dictation',
  'degrees',
  'melody-dictation',
  'progressions',
];

const DIFFICULTIES: Array<{ id: Difficulty; label: string; hint: string }> = [
  { id: 'easy', label: 'Foundation', hint: 'Narrow choices, helper labels' },
  { id: 'medium', label: 'Developing', hint: 'The full core vocabulary' },
  { id: 'hard', label: 'Advanced', hint: 'Wider ranges, mixed modes' },
];

export default function Trainer() {
  const { t, formatDate } = useI18n();
  const { settings } = useProgress();
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') as TopicId | 'mixed' | null;
  const [topic, setTopic] = useState<TopicId | 'mixed'>(
    initialTopic && (initialTopic === 'mixed' || initialTopic in TOPIC_SPECS) ? initialTopic : 'staff-reading',
  );
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [sessionSpecs, setSessionSpecs] = useState<ExerciseSpec[] | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const param = searchParams.get('topic') as TopicId | 'mixed' | null;
    if (param && (param === 'mixed' || param in TOPIC_SPECS)) setTopic(param);
  }, [searchParams]);

  const topicDef = topic === 'mixed' ? null : TOPIC_SPECS[topic];
  const questionCount = topic === 'mixed' ? 12 : 10;
  const instrumentLabel =
    settings.instrument === 'both'
      ? t('Piano & guitar')
      : settings.instrument === 'piano'
        ? t('Piano')
        : t('Guitar');

  const previewSpecs = useMemo(() => {
    if (topic === 'mixed') return [];
    return [topicSpec(topic, difficulty, questionCount)];
  }, [topic, difficulty, questionCount]);

  const start = () => {
    if (topic === 'mixed') {
      const ids = sample(TOPIC_ORDER, 3);
      setSessionSpecs(ids.map((id) => topicSpec(id, difficulty, 4)));
    } else {
      setSessionSpecs(previewSpecs);
    }
    setSessionKey((value) => value + 1);
  };

  if (sessionSpecs) {
    const title =
      topic === 'mixed'
        ? t('Mixed trainer')
        : t('{topic} trainer', { topic: topicDef ? t(topicDef.label) : t('Trainer') });
    return (
      <div className="page trainer-page">
        <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
          <Link to="/">{t('Today')}</Link>
          <Icon name="chevron" size={13} />
          <Link to="/trainer">{t('Trainer')}</Link>
          <Icon name="chevron" size={13} />
          <span>{title}</span>
        </nav>
        <ExerciseSession
          key={sessionKey}
          specs={sessionSpecs}
          title={title}
          context="trainer"
          onDone={() => {
            setSessionSpecs(null);
            setSessionKey((value) => value + 1);
          }}
          onExit={() => setSessionSpecs(null)}
        />
      </div>
    );
  }

  return (
    <div className="page trainer-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Free practice')}</span>
          <h1>{t('Trainer')}</h1>
          <p>
            {t(
              'Choose exactly what to work on. Drills are endless, instrument-aware, and do not require a lesson. Every answer still feeds your daily review queue.',
            )}
          </p>
        </div>
        <div className="header-stat trainer-header-stat">
          <span>{t('Current instrument')}</span>
          <strong className="instrument-title">
            <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={20} />
            {instrumentLabel}
          </strong>
          <Link className="text-link" to="/settings">
            {t('Change')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </header>

      <div className="trainer-layout">
        <section className="panel trainer-builder">
          <div className="trainer-step">
            <div className="trainer-step-head">
              <span className="step-number">01</span>
              <div>
                <h2>{t('Pick a focus')}</h2>
                <p>{t('Reading, listening, or a mix of both.')}</p>
              </div>
            </div>
            <div className="topic-grid">
              {TOPIC_ORDER.map((id) => {
                const def = TOPIC_SPECS[id];
                return (
                  <button
                    key={id}
                    className={`topic-card ${topic === id ? 'selected' : ''}`}
                    onClick={() => setTopic(id)}
                  >
                    <span className="topic-glyph">{TOPIC_GLYPHS[id]}</span>
                    <span className="topic-copy">
                      <strong>{t(def.label)}</strong>
                      <small>{t(def.description)}</small>
                    </span>
                    {topic === id && (
                      <span className="topic-check">
                        <Icon name="check" size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
              <button className={`topic-card mixed ${topic === 'mixed' ? 'selected' : ''}`} onClick={() => setTopic('mixed')}>
                <span className="topic-glyph">✦</span>
                <span className="topic-copy">
                  <strong>{t('Mixed review')}</strong>
                  <small>{t('Three random topics, four questions each.')}</small>
                </span>
                {topic === 'mixed' && (
                  <span className="topic-check">
                    <Icon name="check" size={13} />
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="trainer-step">
            <div className="trainer-step-head">
              <span className="step-number">02</span>
              <div>
                <h2>{t('Set the level')}</h2>
                <p>{t('The same concept, with more or less scaffolding.')}</p>
              </div>
            </div>
            <div className="difficulty-row">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.id}
                  className={`difficulty-card ${difficulty === item.id ? 'selected' : ''}`}
                  onClick={() => setDifficulty(item.id)}
                >
                  <span className="difficulty-dot" />
                  <strong>{t(item.label)}</strong>
                  <small>{t(item.hint)}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="trainer-start">
            <div>
              <strong>{t('{n} questions', { n: questionCount })}</strong>
              <p>
                {topic === 'mixed'
                  ? t('A balanced set across three randomly chosen topics.')
                  : topicDef
                    ? t(topicDef.description)
                    : null}
              </p>
            </div>
            <button className="button primary large" onClick={start}>
              <Icon name="play" size={18} />
              {t('Start drill')}
            </button>
          </div>
        </section>

        <aside className="trainer-side">
          <section className="panel">
            <span className="eyebrow">{t('What this trains')}</span>
            <h2>{topic === 'mixed' ? t('Everything at once') : topicDef ? t(topicDef.label) : null}</h2>
            {topic === 'mixed' ? (
              <p className="side-note">
                {t(
                  'Mixed review rotates through staff reading, intervals, chords, rhythm, and more. Use it when you want variety rather than a single focused skill.',
                )}
              </p>
            ) : (
              <div className="trainer-skill-list">
                {TOPIC_SPECS[topic].skills.map((skill) => (
                  <span key={skill} className="topic-chip">
                    {exerciseSkillLabel(skill)}
                  </span>
                ))}
              </div>
            )}
            <div className="trainer-tip">
              <Icon name="spark" size={18} />
              <p>
                {t(
                  'Short, daily drills beat long, occasional ones. Aim for accuracy first; speed follows on its own.',
                )}
              </p>
            </div>
          </section>
          <section className="panel">
            <span className="eyebrow">{t('Instrument-aware')}</span>
            <h2>{t('Piano, guitar, or both')}</h2>
            <p className="side-note">
              {t(
                'Note-finding, chord-building, and scale-building questions appear on your chosen surface. Change it any time; your progress carries across.',
              )}
            </p>
            <Link className="button secondary small" to="/settings">
              <Icon name="settings" size={15} />
              {t('Instrument settings')}
            </Link>
          </section>
          <section className="panel trainer-shortcut">
            <span className="eyebrow">{t('Structured instead?')}</span>
            <h2>{t('Follow the course path')}</h2>
            <p className="side-note">{t('Lessons explain the why, then give you the same drills in context.')}</p>
            <Link className="text-link" to="/courses">
              {t('Browse courses')} <Icon name="arrow" size={14} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
