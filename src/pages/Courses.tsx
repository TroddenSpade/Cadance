import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import NoteText from '../components/NoteText';
import { type Course } from '../data/curriculum';
import { useCurriculum } from '../data/i18n';
import { completedLessonsInCourse, coursePercent, overallPercent, totalCompleted } from '../lib/courseStats';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';

function CourseCard({ course }: { course: Course }) {
  const { state } = useProgress();
  const { t } = useI18n();
  const percent = Math.round(coursePercent(course, state) * 100);
  const completed = completedLessonsInCourse(course, state);
  const minutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  return (
    <Link
      to={`/courses/${course.id}`}
      className="course-card"
      style={{ '--course-color': course.color } as React.CSSProperties}
    >
      <div className="course-card-top">
        <span className="course-glyph small">{course.glyph}</span>
        <span className={`course-state ${completed === course.lessons.length ? 'complete' : ''}`}>
          {completed === course.lessons.length ? (
            <>
              <Icon name="check" size={13} /> {t('Complete')}
            </>
          ) : completed > 0 ? (
            t('In progress')
          ) : (
            t('Not started')
          )}
        </span>
      </div>
      <h3>
        <NoteText text={course.title} />
      </h3>
      <p>
        <NoteText text={course.subtitle} />
      </p>
      <div className="course-card-meta">
        <span>
          <Icon name="book" size={14} /> {t('{n} lessons', { n: course.lessons.length })}
        </span>
        <span>
          <Icon name="clock" size={14} /> {t('{n} min', { n: minutes })}
        </span>
      </div>
      <div className="inline-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span>{percent}%</span>
      </div>
    </Link>
  );
}

export default function Courses() {
  const { state } = useProgress();
  const { courses: allCourses, levels, allLessons } = useCurriculum();
  const { t } = useI18n();
  const completed = totalCompleted(state);
  const percent = Math.round(overallPercent(state) * 100);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{t('The curriculum')}</span>
          <h1>{t('From first notes to master form.')}</h1>
          <p>
            {t(
              '{n} courses in five levels, from first notes to post-tonal analysis. Each lesson ends with interactive reading and listening exercises, and every answer feeds the daily review queue.',
              { n: allCourses.length },
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Overall progress')}</span>
          <strong>{percent}%</strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <small>
            {t('{completed} of {total} lessons complete', { completed, total: allLessons.length })}
          </small>
        </div>
      </header>

      <div className="level-stack">
        {levels.map((level, levelIndex) => {
          const courses = allCourses.filter((course) => course.level === level.id);
          const levelLessons = courses.flatMap((course) => course.lessons);
          const levelDone = levelLessons.filter((lesson) => state.lessons[lesson.id]?.completedAt).length;
          return (
            <section key={level.id} className="level-section">
              <div className="level-heading">
                <div className="level-index">0{levelIndex + 1}</div>
                <div>
                  <h2>{level.title}</h2>
                  <p>{level.blurb}</p>
                </div>
                <div className="level-progress">
                  <span>
                    {t('{done}/{total} lessons', { done: levelDone, total: levelLessons.length })}
                  </span>
                  <div className="progress-track slim">
                    <div
                      className="progress-fill"
                      style={{ width: `${levelLessons.length ? (levelDone / levelLessons.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="course-grid">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
