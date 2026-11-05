import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import NoteText from '../components/NoteText';
import ProgressRing from '../components/ProgressRing';
import { useCurriculum } from '../data/i18n';
import { exerciseSkillLabel, STARTER_SPECS } from '../lib/exercises';
import {
  coursePercent,
  currentLesson,
  lessonsCompletedByLevel,
  todayCount,
  totalCompleted,
} from '../lib/courseStats';
import { useProgress, levelFromXp } from '../lib/progress';
import { useI18n } from '../lib/i18n';

export default function Dashboard() {
  const { t, formatDate } = useI18n();
  const { state, settings, dueSkills } = useProgress();
  const { allLessons, courseMap, lessonMap, levels: curriculumLevels } = useCurriculum();
  const levelInfo = levelFromXp(state.xp);
  const baseLesson = currentLesson(state);
  const lesson = lessonMap[baseLesson.id] ?? baseLesson;
  const course = courseMap[baseLesson.courseId];
  const completed = totalCompleted(state);
  const today = todayCount(state);
  const goalPercent = Math.min(100, (today / settings.dailyGoal) * 100);
  const levels = lessonsCompletedByLevel(state).map((entry) => ({
    ...entry,
    level: curriculumLevels.find((item) => item.id === entry.level.id) ?? entry.level,
  }));
  const hour = new Date().getHours();
  const greeting = t(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
  const dateLabel = formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' });
  const instrumentLabel = settings.instrument === 'both' ? t('Piano + guitar') : settings.instrument === 'piano' ? t('Piano') : t('Guitar');
  const quickPractice = [
    { topic: 'staff-reading', label: t('Staff reading'), description: t('Name notes in both clefs'), icon: 'book' as const },
    { topic: 'intervals', label: t('Interval ear'), description: t('Hear the distance'), icon: 'headphones' as const },
    { topic: 'find-notes', label: t('Find notes'), description: t('Piano & fretboard'), icon: 'target' as const },
    { topic: 'chords', label: t('Chord ear'), description: t('Quality and colour'), icon: 'music' as const },
  ];
  const focusSkills = dueSkills.slice(0, 4);
  const fallbackSkills = Object.values(state.skills)
    .filter((skill) => !dueSkills.some((due) => due.id === skill.id))
    .sort((a, b) => a.strength - b.strength)
    .slice(0, 4);

  return (
    <div className="page dashboard">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{dateLabel}</span>
          <h1>
            <span className="hero-greeting">{t('{greeting}.', { greeting })}</span>
            <span className="hero-motto">
              {t('Keep the')} <em>{t('cadence')}</em>.
            </span>
          </h1>
          <p className="hero-lead">
            {t('Read a little, hear a little, play a little. Cadence turns music theory into a daily habit — on piano, guitar, or both.')}
          </p>
          <div className="button-row">
            <Link className="button primary" to={`/lesson/${lesson.id}`}>
              <Icon name="play" size={16} />
              {state.lessons[lesson.id]?.completedAt ? t('Review lesson') : completed > 0 ? t('Continue learning') : t('Start learning')}
            </Link>
            <Link className="button secondary" to="/practice">
              <Icon name="practice" size={16} />
              {t('Daily practice')}
            </Link>
          </div>
          <div className="hero-meta">
            <span className="hero-meta-item">
              <Icon name="flame" size={16} />
              {state.streak > 0 ? t('{n}-day streak', { n: state.streak }) : t('Start your streak')}
            </span>
            <span className="hero-meta-item">
              <Icon name="trophy" size={16} />
              {t('Level {level} · {title}', { level: levelInfo.level, title: t(levelInfo.title) })}
            </span>
            <span className="hero-meta-item">
              <Icon name={settings.instrument === 'guitar' ? 'guitar' : 'piano'} size={16} />
              {instrumentLabel}
            </span>
          </div>
        </div>

        <div className="hero-side">
          <div className="daily-card">
            <div className="daily-card-head">
              <span className="eyebrow">{t('Today')}</span>
              <Link to="/practice" className="text-link">
                {t('Open practice')} <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div className="daily-main">
              <ProgressRing percent={goalPercent}>
                <strong>{today}</strong>
                <span>{t('of {n} questions', { n: settings.dailyGoal })}</span>
              </ProgressRing>
              <div className="daily-copy">
                <h2>{today === 0 ? t('A fresh start') : today >= settings.dailyGoal ? t('Daily goal met') : t('Keep going')}</h2>
                <p>
                  {dueSkills.length > 0
                    ? t(dueSkills.length === 1 ? '{n} skill due for review right now.' : '{n} skills due for review right now.', { n: dueSkills.length })
                    : t('No reviews due. A short session keeps everything fresh.')}
                </p>
                <Link className="button small primary" to="/practice">
                  {dueSkills.length ? t('Review now') : t('Warm up')}
                </Link>
              </div>
            </div>
            <div className="daily-foot">
              <span>
                <Icon name="flame" size={15} /> {t('{n} day streak', { n: state.streak })}
              </span>
              <span>
                <Icon name="spark" size={15} /> {t('{n} XP', { n: state.xp })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon warm">
            <Icon name="flame" size={19} />
          </span>
          <div>
            <strong>{state.streak}</strong>
            <span>{t('day streak')}</span>
          </div>
          <small>{t('Best: {value}', { value: state.bestStreak })}</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon cool">
            <Icon name="trophy" size={19} />
          </span>
          <div>
            <strong>{state.xp}</strong>
            <span>{t('total XP')}</span>
          </div>
          <small>{t('Level {level}', { level: levelInfo.level })}</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Icon name="check" size={19} />
          </span>
          <div>
            <strong>{completed}</strong>
            <span>{t('lessons complete')}</span>
          </div>
          <small>{t('{n} in the path', { n: allLessons.length })}</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon lilac">
            <Icon name="refresh" size={19} />
          </span>
          <div>
            <strong>{dueSkills.length}</strong>
            <span>{t('reviews due')}</span>
          </div>
          <small>{t('{n} skills tracked', { n: Object.keys(state.skills).length })}</small>
        </div>
      </section>

      <div className="two-col">
        <section className="panel continue-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Your path')}</span>
              <h2>{t('Continue where you left off')}</h2>
            </div>
            <Link className="text-link" to="/courses">
              {t('All courses')} <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="continue-card">
            <div className="course-glyph" style={{ background: `${course?.color ?? '#e6b566'}1c`, color: course?.color ?? '#e6b566' }}>
              {course?.glyph}
            </div>
            <div className="continue-copy">
              <span className="course-level">
                {curriculumLevels.find((level) => level.id === course?.level)?.title} · <NoteText text={course?.title ?? ''} />
              </span>
              <h3>
                <NoteText text={lesson.title} />
              </h3>
              <p>
                <NoteText text={lesson.summary} />
              </p>
              <div className="inline-progress">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.round((course ? coursePercent(course, state) : 0) * 100)}%` }} />
                </div>
                <span>{Math.round((course ? coursePercent(course, state) : 0) * 100)}%</span>
              </div>
            </div>
            <Link className="button primary small" to={`/lesson/${lesson.id}`}>
              {state.lessons[lesson.id]?.completedAt ? t('Review') : t('Open lesson')}
              <Icon name="chevron" size={15} />
            </Link>
          </div>
          <div className="path-strip">
            {levels.map(({ level, completed: done, total }) => (
              <div key={level.id} className="path-item">
                <div className="path-item-head">
                  <span>{level.title}</span>
                  <small>{done}/{total}</small>
                </div>
                <div className="progress-track slim">
                  <div className="progress-fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel review-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Recall')}</span>
              <h2>{dueSkills.length ? t('Due for review') : t('Review queue')}</h2>
            </div>
            <Link className="icon-link" to="/practice" aria-label={t('Open daily practice')}>
              <Icon name="arrow" size={18} />
            </Link>
          </div>
          {focusSkills.length === 0 && fallbackSkills.length === 0 ? (
            <div className="review-empty">
              <div className="empty-glyph">
                <Icon name="spark" size={24} />
              </div>
              <h3>{t('Your queue is empty')}</h3>
              <p>{t('Complete a lesson and its skills will enter the spaced-review cycle. Try the starter session to begin.')}</p>
              <Link className="button small secondary" to="/practice">
                {t('Start a starter session')}
              </Link>
            </div>
          ) : (
            <ul className="review-list">
              {(focusSkills.length ? focusSkills : fallbackSkills).map((skill) => (
                <li key={skill.id}>
                  <div className="review-row">
                    <span className="review-dot" style={{ opacity: 0.45 + skill.strength * 0.55 }} />
                    <div className="review-info">
                      <span>{exerciseSkillLabel(skill.id)}</span>
                      <div className="strength-track">
                        <div className="strength-fill" style={{ width: `${Math.round(skill.strength * 100)}%` }} />
                      </div>
                    </div>
                    <span className={`review-status ${focusSkills.length ? 'due' : ''}`}>
                      {focusSkills.length ? t('Due') : t('Scheduled')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="review-foot">
            <span>
              <Icon name="refresh" size={15} /> {t('Spaced review adapts to your answers')}
            </span>
            <Link className="text-link" to="/practice">
              {t('Practice')} <Icon name="chevron" size={13} />
            </Link>
          </div>
        </section>
      </div>

      <section className="quick-section">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('No lesson needed')}</span>
            <h2>{t('Jump into a quick drill')}</h2>
          </div>
          <Link className="text-link" to="/trainer">
            {t('Open trainer')} <Icon name="arrow" size={14} />
          </Link>
        </div>
        <div className="quick-grid">
          {quickPractice.map((item) => (
            <Link key={item.topic} to={`/trainer?topic=${item.topic}`} className="quick-card">
              <span className="quick-icon">
                <Icon name={item.icon} size={22} />
              </span>
              <div>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </div>
              <Icon name="chevron" size={16} className="quick-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section className="starter-note">
        <div className="starter-note-icon">
          <Icon name="music" size={20} />
        </div>
        <div>
          <strong>{Object.keys(state.skills).length === 0 ? t('New here? Start with the basics.') : t('Build a steady habit.')}</strong>
          <p>
            {Object.keys(state.skills).length === 0
              ? t('The first course begins with the keyboard and the staff. Ten minutes a day is enough.')
              : t('{n} short starter drills are always available in the trainer if you want a warm-up.', { n: STARTER_SPECS.length })}
          </p>
        </div>
        <Link className="button secondary small" to={Object.keys(state.skills).length === 0 ? '/courses/staff-pitch' : '/trainer'}>
          {Object.keys(state.skills).length === 0 ? t('Explore Pitch & the Staff') : t('Warm up')}
          <Icon name="chevron" size={15} />
        </Link>
      </section>
    </div>
  );
}
