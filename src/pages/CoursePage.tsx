import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icons';
import NoteText from '../components/NoteText';
import { useCurriculum } from '../data/i18n';
import { completedLessonsInCourse, coursePercent } from '../lib/courseStats';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';
import { exerciseSkillLabel } from '../lib/exercises';
import NotFound from './NotFound';

export default function CoursePage() {
  const { courseId } = useParams();
  const { state } = useProgress();
  const { courseMap, levels } = useCurriculum();
  const { t } = useI18n();
  const course = courseId ? courseMap[courseId] : undefined;

  if (!course) return <NotFound />;

  const level = levels.find((item) => item.id === course.level);
  const completed = completedLessonsInCourse(course, state);
  const percent = Math.round(coursePercent(course, state) * 100);
  const nextIncomplete = course.lessons.find((lesson) => !state.lessons[lesson.id]?.completedAt) ?? course.lessons[0];
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  const skills = Array.from(new Set(course.lessons.flatMap((lesson) => lesson.exercises.flatMap((exercise) => exercise.skills))));

  return (
    <div className="page course-page" style={{ '--course-color': course.color } as React.CSSProperties}>
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/courses">{t('Courses')}</Link>
        <Icon name="chevron" size={13} />
        <span>{level?.title}</span>
        <Icon name="chevron" size={13} />
        <span>
          <NoteText text={course.title} />
        </span>
      </nav>

      <header className="course-hero">
        <div className="course-hero-glyph">{course.glyph}</div>
        <div className="course-hero-copy">
          <span className="eyebrow">
            {t('{level} level', { level: level?.title ?? '' })}
          </span>
          <h1>
            <NoteText text={course.title} />
          </h1>
          <p>
            <NoteText text={course.subtitle} />
          </p>
          <div className="course-hero-meta">
            <span>
              <Icon name="book" size={16} /> {t('{n} lessons', { n: course.lessons.length })}
            </span>
            <span>
              <Icon name="clock" size={16} /> {t('{n} min', { n: totalMinutes })}
            </span>
            <span>
              <Icon name="headphones" size={16} />{' '}
              {t('{count} exercises', {
                count: course.lessons.reduce(
                  (sum, lesson) => sum + lesson.exercises.reduce((value, exercise) => value + exercise.count, 0),
                  0,
                ),
              })}
            </span>
          </div>
        </div>
        <div className="course-hero-action">
          <div className="course-progress-ring">
            <strong>{percent}%</strong>
            <span>{t('{completed}/{total} complete', { completed, total: course.lessons.length })}</span>
            <div className="progress-track slim">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
          <Link className="button primary" to={`/lesson/${nextIncomplete.id}`}>
            {completed === 0
              ? t('Start course')
              : completed === course.lessons.length
                ? t('Review first lesson')
                : t('Continue')}
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </header>

      <div className="course-layout">
        <section className="panel lesson-list-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{t('Lessons')}</span>
              <h2>{t('The course path')}</h2>
            </div>
            <span className="topic-chip muted">{t('Read · practice · recall')}</span>
          </div>
          <ol className="lesson-list">
            {course.lessons.map((lesson, index) => {
              const progress = state.lessons[lesson.id];
              const isNext = lesson.id === nextIncomplete.id;
              return (
                <li key={lesson.id}>
                  <Link to={`/lesson/${lesson.id}`} className={`lesson-row ${isNext ? 'next' : ''}`}>
                    <span className={`lesson-number ${progress?.completedAt ? 'complete' : ''}`}>
                      {progress?.completedAt ? <Icon name="check" size={16} /> : String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="lesson-row-copy">
                      <div className="lesson-row-title">
                        <h3>
                          <NoteText text={lesson.title} />
                        </h3>
                        {isNext && <span className="next-chip">{t('Up next')}</span>}
                        {progress?.completedAt && <span className="done-chip">{t('Done')}</span>}
                      </div>
                      <p>
                        <NoteText text={lesson.summary} />
                      </p>
                      <div className="lesson-row-meta">
                        <span>
                          <Icon name="clock" size={13} /> {t('{n} min', { n: lesson.minutes })}
                        </span>
                        <span>
                          <Icon name="practice" size={13} />{' '}
                          {t('{count} questions', {
                            count: lesson.exercises.reduce((sum, exercise) => sum + exercise.count, 0),
                          })}
                        </span>
                        {progress && (
                          <span>{t('Best: {percent}%', { percent: Math.round(progress.bestScore * 100) })}</span>
                        )}
                      </div>
                    </div>
                    <Icon name="chevron" size={18} className="lesson-row-arrow" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="course-side">
          <section className="panel">
            <span className="eyebrow">{t('Skills trained')}</span>
            <h2>{t('What you will practise')}</h2>
            <div className="skill-cloud">
              {skills.map((skill) => (
                <span key={skill} className="topic-chip">
                  {exerciseSkillLabel(skill)}
                </span>
              ))}
            </div>
          </section>
          <section className="panel">
            <span className="eyebrow">{t('Method')}</span>
            <h2>{t('How this course works')}</h2>
            <ul className="method-list">
              <li>
                <Icon name="book" size={16} /> {t('Read short, focused explanations.')}
              </li>
              <li>
                <Icon name="headphones" size={16} /> {t('Listen to every concept.')}
              </li>
              <li>
                <Icon name="piano" size={16} /> {t('Apply it on piano or guitar.')}
              </li>
              <li>
                <Icon name="refresh" size={16} /> {t('Review it again when the scheduler says so.')}
              </li>
            </ul>
            <p className="side-note">
              {t('You can change between piano, guitar, or both at any time from')}{' '}
              <Link to="/settings">{t('Settings')}</Link>.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
