import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { COURSES, LEVELS, type Course } from '../data/curriculum';
import { completedLessonsInCourse, coursePercent, overallPercent, totalCompleted } from '../lib/courseStats';
import { ALL_LESSONS } from '../data/curriculum';
import { useProgress } from '../lib/progress';

function CourseCard({ course }: { course: Course }) {
  const { state } = useProgress();
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
              <Icon name="check" size={13} /> Complete
            </>
          ) : completed > 0 ? (
            'In progress'
          ) : (
            'Not started'
          )}
        </span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.subtitle}</p>
      <div className="course-card-meta">
        <span>
          <Icon name="book" size={14} /> {course.lessons.length} lessons
        </span>
        <span>
          <Icon name="clock" size={14} /> {minutes} min
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
  const completed = totalCompleted(state);
  const percent = Math.round(overallPercent(state) * 100);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">The curriculum</span>
          <h1>From first notes to master form.</h1>
          <p>
            Fourteen courses in five levels. Each lesson ends with interactive reading and listening exercises, and
            every answer feeds the daily review queue.
          </p>
        </div>
        <div className="header-stat">
          <span>Overall progress</span>
          <strong>{percent}%</strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <small>
            {completed} of {ALL_LESSONS.length} lessons complete
          </small>
        </div>
      </header>

      <div className="level-stack">
        {LEVELS.map((level, levelIndex) => {
          const courses = COURSES.filter((course) => course.level === level.id);
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
                    {levelDone}/{levelLessons.length} lessons
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
