import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExerciseSession from '../components/ExerciseSession';
import Icon from '../components/Icons';
import InstrumentSurface from '../components/InstrumentSurface';
import Metronome from '../components/Metronome';
import NoteText from '../components/NoteText';
import RhythmDisplay from '../components/RhythmDisplay';
import RichText from '../components/RichText';
import Staff from '../components/Staff';
import { COURSE_MAP, LESSON_MAP, LEVELS, nextLesson, previousLesson } from '../data/curriculum';
import { synth } from '../lib/audio';
import { exerciseSkillLabel } from '../lib/exercises';
import { useProgress } from '../lib/progress';
import type { SessionResult } from '../lib/types';
import NotFound from './NotFound';

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function LessonPage() {
  const { lessonId } = useParams();
  const { state, settings, finishLesson } = useProgress();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const sessionRef = useRef<HTMLDivElement | null>(null);
  const lesson = lessonId ? LESSON_MAP[lessonId] : undefined;

  useEffect(() => {
    synth.setTimbre(settings.timbre);
  }, [settings.timbre]);

  useEffect(() => {
    if (sessionActive) {
      window.setTimeout(() => sessionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [sessionActive]);

  if (!lesson) return <NotFound />;

  const course = COURSE_MAP[lesson.courseId];
  const level = LEVELS.find((item) => item.id === course?.level);
  const progress = state.lessons[lesson.id];
  const isComplete = Boolean(progress?.completedAt);
  const lessonIndex = course?.lessons.findIndex((item) => item.id === lesson.id) ?? 0;
  const prev = previousLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const questionCount = lesson.exercises.reduce((sum, exercise) => sum + exercise.count, 0);
  const skillIds = Array.from(new Set(lesson.exercises.flatMap((exercise) => exercise.skills)));

  const playSection = (audio: NonNullable<(typeof lesson.sections)[number]['audio']>) => {
    synth.setTimbre(settings.timbre);
    synth.stopAll();
    if (audio.chords) synth.playChords(audio.chords, audio.tempo ?? 0.8);
    else if (audio.midis) synth.playSequence(audio.midis, audio.mode, audio.tempo ?? 0.6);
  };

  const handleFinish = (result: SessionResult) => {
    const passed = result.accuracy >= 0.7;
    finishLesson(lesson.id, result.accuracy, passed);
    setLastResult(result);
  };

  const handleDone = () => {
    setSessionActive(false);
    setSessionKey((value) => value + 1);
    window.setTimeout(() => {
      document.getElementById('lesson-practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div className="page lesson-page" style={{ '--course-color': course?.color ?? '#e6b566' } as React.CSSProperties}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/courses">Courses</Link>
        <Icon name="chevron" size={13} />
        {course && (
          <Link to={`/courses/${course.id}`}>
            <NoteText text={course.title} />
          </Link>
        )}
        <Icon name="chevron" size={13} />
        <span>Lesson {lessonIndex + 1}</span>
      </nav>

      <header className="lesson-header">
        <div className="lesson-header-main">
          <span className="eyebrow">
            {level?.title} · <NoteText text={course?.title ?? ''} /> · Lesson {lessonIndex + 1} of{' '}
            {course?.lessons.length}
          </span>
          <h1>
            <NoteText text={lesson.title} />
          </h1>
          <p>
            <NoteText text={lesson.summary} />
          </p>
          <div className="lesson-meta">
            <span>
              <Icon name="clock" size={15} /> {lesson.minutes} min read
            </span>
            <span>
              <Icon name="practice" size={15} /> {questionCount} exercise questions
            </span>
            <span>
              <Icon name="headphones" size={15} /> Listening included
            </span>
            {isComplete && (
              <span className="done-chip">
                <Icon name="check" size={13} /> Completed · best {Math.round((progress?.bestScore ?? 0) * 100)}%
              </span>
            )}
          </div>
        </div>
        <div className="lesson-header-badge">
          <span className="lesson-big-number">{String(lessonIndex + 1).padStart(2, '0')}</span>
          <span>Lesson</span>
        </div>
      </header>

      <div className="lesson-layout">
        <article className="lesson-content panel">
          {lesson.sections.map((section, index) => (
            <section key={index} id={section.heading ? slug(section.heading) : undefined} className="lesson-section">
              {section.heading && (
                <div className="section-heading">
                  <span className="section-number">{String(index + 1).padStart(2, '0')}</span>
                  <h2>
                    <NoteText text={section.heading} />
                  </h2>
                </div>
              )}
              <RichText body={section.body} />
              {section.staff && (
                <div className="notation-panel lesson-notation">
                  <Staff spec={section.staff} />
                </div>
              )}
              {section.rhythm && (
                <div className="notation-panel rhythm-panel lesson-notation">
                  <RhythmDisplay items={section.rhythm.items} />
                </div>
              )}
              {section.audio && (
                <button className="listen-button inline" onClick={() => playSection(section.audio!)}>
                  <span className="listen-icon">
                    <Icon name="headphones" size={18} />
                  </span>
                  <span>
                    <strong>Listen</strong>
                    <small>
                      <NoteText text={section.audioLabel ?? 'Play example'} />
                    </small>
                  </span>
                  <Icon name="play" size={16} className="listen-play" />
                </button>
              )}
              {section.metronome && <Metronome />}
            </section>
          ))}

          <div className="lesson-practice" id="lesson-practice" ref={sessionRef}>
            <div className="practice-banner">
              <div className="practice-banner-icon">
                <Icon name="practice" size={24} />
              </div>
              <div className="practice-banner-copy">
                <span className="eyebrow">Exercises</span>
                <h2>{sessionActive ? 'Practice this lesson' : 'Put the lesson into your hands and ears'}</h2>
                <p>
                  {questionCount} questions · score 70% or higher to complete the lesson. Every answer updates your
                  review schedule.
                </p>
                <div className="skill-cloud compact">
                  {skillIds.map((skill) => (
                    <span key={skill} className="topic-chip">
                      {exerciseSkillLabel(skill)}
                    </span>
                  ))}
                </div>
              </div>
              {!sessionActive && (
                <button
                  className="button primary"
                  onClick={() => {
                    setSessionActive(true);
                    setLastResult(null);
                  }}
                >
                  <Icon name="play" size={16} />
                  {isComplete ? 'Practise again' : 'Start exercises'}
                </button>
              )}
            </div>

            {sessionActive && (
              <div className="session-embed" key={sessionKey}>
                <ExerciseSession
                  specs={lesson.exercises}
                  title="Lesson exercises"
                  context="lesson"
                  passThreshold={0.7}
                  onFinish={handleFinish}
                  onDone={handleDone}
                  onExit={() => setSessionActive(false)}
                />
              </div>
            )}

            {!sessionActive && lastResult && (
              <div className={`lesson-result ${lastResult.accuracy >= 0.7 ? 'passed' : 'failed'}`}>
                <span className="lesson-result-icon">
                  <Icon name={lastResult.accuracy >= 0.7 ? 'check' : 'refresh'} size={18} />
                </span>
                <div>
                  <strong>
                    {lastResult.accuracy >= 0.7 ? 'Exercises complete' : 'Keep working on this lesson'}
                  </strong>
                  <p>
                    You scored {Math.round(lastResult.accuracy * 100)}% ({lastResult.correct}/{lastResult.total}).{' '}
                    {lastResult.accuracy >= 0.7
                      ? 'The lesson is marked complete and these skills are now in your review queue.'
                      : 'Review the sections above, then try the exercises again.'}
                  </p>
                </div>
                <button className="button secondary small" onClick={() => setSessionActive(true)}>
                  Try again
                </button>
              </div>
            )}
          </div>

          <nav className="lesson-pager" aria-label="Lesson navigation">
            {prev ? (
              <Link to={`/lesson/${prev.id}`} className="pager-link prev">
                <span>Previous</span>
                <strong><NoteText text={prev.title} /></strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/lesson/${next.id}`} className="pager-link next">
                <span>Next lesson</span>
                <strong><NoteText text={next.title} /></strong>
              </Link>
            ) : (
              <Link to="/courses" className="pager-link next">
                <span>Finish</span>
                <strong>Back to all courses</strong>
              </Link>
            )}
          </nav>
        </article>

        <aside className="lesson-aside">
          <section className="panel side-sticky">
            <span className="eyebrow">In this lesson</span>
            <nav className="toc">
              {lesson.sections.map((section, index) => (
                <a key={index} href={section.heading ? `#${slug(section.heading)}` : '#'} onClick={(event) => {
                  if (section.heading) {
                    event.preventDefault();
                    document.getElementById(slug(section.heading!))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {section.heading ?? 'Introduction'}
                </a>
              ))}
              <a
                href="#lesson-practice"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById('lesson-practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span>→</span>
                Exercises
              </a>
            </nav>

            <div className="aside-divider" />

            <span className="eyebrow">Your instrument</span>
            <div className="aside-instrument">
              <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={18} />
              <strong>
                {settings.instrument === 'both'
                  ? 'Piano & guitar'
                  : settings.instrument === 'piano'
                    ? 'Piano'
                    : 'Guitar'}
              </strong>
              <Link to="/settings">Change</Link>
            </div>
            <div className="aside-instrument-preview">
              <InstrumentSurface
                marks={{}}
                disabled
                label={false}
                showLabelsOverride={false}
              />
            </div>
            <p className="side-note">Tap instruments in exercises to answer. Sound follows your timbre setting.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
