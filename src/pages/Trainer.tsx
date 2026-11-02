import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ExerciseSession from '../components/ExerciseSession';
import Icon from '../components/Icons';
import { TOPIC_SPECS, topicSpec, type Difficulty, type TopicId } from '../lib/exercises';
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
    const title = topic === 'mixed' ? 'Mixed trainer' : `${topicDef?.label ?? 'Trainer'} trainer`;
    return (
      <div className="page trainer-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Today</Link>
          <Icon name="chevron" size={13} />
          <Link to="/trainer">Trainer</Link>
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
          <span className="eyebrow">Free practice</span>
          <h1>Trainer</h1>
          <p>
            Choose exactly what to work on. Drills are endless, instrument-aware, and do not require a lesson. Every
            answer still feeds your daily review queue.
          </p>
        </div>
        <div className="header-stat trainer-header-stat">
          <span>Current instrument</span>
          <strong className="instrument-title">
            <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={20} />
            {settings.instrument === 'both' ? 'Piano & guitar' : settings.instrument === 'piano' ? 'Piano' : 'Guitar'}
          </strong>
          <Link className="text-link" to="/settings">
            Change <Icon name="arrow" size={14} />
          </Link>
        </div>
      </header>

      <div className="trainer-layout">
        <section className="panel trainer-builder">
          <div className="trainer-step">
            <div className="trainer-step-head">
              <span className="step-number">01</span>
              <div>
                <h2>Pick a focus</h2>
                <p>Reading, listening, or a mix of both.</p>
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
                      <strong>{def.label}</strong>
                      <small>{def.description}</small>
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
                  <strong>Mixed review</strong>
                  <small>Three random topics, four questions each.</small>
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
                <h2>Set the level</h2>
                <p>The same concept, with more or less scaffolding.</p>
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
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="trainer-start">
            <div>
              <strong>{questionCount} questions</strong>
              <p>
                {topic === 'mixed'
                  ? 'A balanced set across three randomly chosen topics.'
                  : topicDef?.description}
              </p>
            </div>
            <button className="button primary large" onClick={start}>
              <Icon name="play" size={18} />
              Start drill
            </button>
          </div>
        </section>

        <aside className="trainer-side">
          <section className="panel">
            <span className="eyebrow">What this trains</span>
            <h2>{topic === 'mixed' ? 'Everything at once' : topicDef?.label}</h2>
            {topic === 'mixed' ? (
              <p className="side-note">
                Mixed review rotates through staff reading, intervals, chords, rhythm, and more. Use it when you want
                variety rather than a single focused skill.
              </p>
            ) : (
              <div className="trainer-skill-list">
                {TOPIC_SPECS[topic].skills.map((skill) => (
                  <span key={skill} className="topic-chip">
                    {skill.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            <div className="trainer-tip">
              <Icon name="spark" size={18} />
              <p>
                Short, daily drills beat long, occasional ones. Aim for accuracy first; speed follows on its own.
              </p>
            </div>
          </section>
          <section className="panel">
            <span className="eyebrow">Instrument-aware</span>
            <h2>Piano, guitar, or both</h2>
            <p className="side-note">
              Note-finding, chord-building, and scale-building questions appear on your chosen surface. Change it any
              time; your progress carries across.
            </p>
            <Link className="button secondary small" to="/settings">
              <Icon name="settings" size={15} />
              Instrument settings
            </Link>
          </section>
          <section className="panel trainer-shortcut">
            <span className="eyebrow">Structured instead?</span>
            <h2>Follow the course path</h2>
            <p className="side-note">Lessons explain the why, then give you the same drills in context.</p>
            <Link className="text-link" to="/courses">
              Browse courses <Icon name="arrow" size={14} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
