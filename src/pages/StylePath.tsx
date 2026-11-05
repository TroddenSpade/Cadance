import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icons';
import { ANALYSIS_MAP } from '../lib/analysis';
import { LOOP_KEYS, LOOP_STYLES } from '../lib/loops';
import { REPERTOIRE_MAP } from '../data/repertoire';
import { STYLE_PATH_MAP, stylePathProgress, type StylePathStep } from '../data/stylePaths';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';

interface ResolvedStep {
  step: StylePathStep;
  kindLabel: string;
  title: string;
  detail: string;
  route: string;
  completed: boolean;
}

const ROOMS: Record<
  Extract<StylePathStep, { kind: 'room' }>['room'],
  { title: string; detail: string; route: string }
> = {
  'sight-reading': {
    title: 'Sight-reading room',
    detail: 'Read four bars, play them back in order, and check every pitch.',
    route: '/sight-reading',
  },
  rhythm: {
    title: 'Rhythm room',
    detail: 'Echo a two-bar pattern by tapping, then play the same rhythm on one note.',
    route: '/rhythm',
  },
  trainer: {
    title: 'Trainer',
    detail: 'Build a short drill on the topic this path is developing.',
    route: '/trainer',
  },
  repertoire: {
    title: 'Graded repertoire',
    detail: 'Choose another piece at the same level and read it once without stopping.',
    route: '/repertoire',
  },
};

export default function StylePathPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathId ? STYLE_PATH_MAP[pathId] : undefined;
  const { t } = useI18n();
  const { lessonMap } = useCurriculum();
  const { state } = useProgress();

  if (!path) {
    return (
      <div className="page paths-page">
        <header className="page-header">
          <div>
            <span className="eyebrow">{t('Style paths')}</span>
            <h1>{t('Path not found')}</h1>
            <p>{t('That path is not in the library. Choose another style from the list.')}</p>
          </div>
        </header>
        <Link className="button primary" to="/paths">
          {t('Back to paths')}
        </Link>
      </div>
    );
  }

  const progress = stylePathProgress(path, state.lessons);
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  const resolve = (step: StylePathStep): ResolvedStep => {
    if (step.kind === 'lesson') {
      const lesson = lessonMap[step.lessonId];
      return {
        step,
        kindLabel: 'Lesson',
        title: lesson?.title ?? step.lessonId,
        detail: lesson?.summary ?? '',
        route: `/lesson/${step.lessonId}`,
        completed: Boolean(state.lessons[step.lessonId]?.completedAt),
      };
    }
    if (step.kind === 'piece') {
      const piece = REPERTOIRE_MAP[step.pieceId];
      return {
        step,
        kindLabel: 'Repertoire',
        title: piece?.title ?? step.pieceId,
        detail: piece?.summary ?? '',
        route: `/repertoire/${step.pieceId}`,
        completed: false,
      };
    }
    if (step.kind === 'loop') {
      const style = LOOP_STYLES.find((candidate) => candidate.id === step.styleId) ?? LOOP_STYLES[0];
      const key = LOOP_KEYS.find((candidate) => candidate.pc === step.keyPc) ?? LOOP_KEYS[0];
      return {
        step,
        kindLabel: 'Backing loop',
        title: t('{style} in {key}', { style: t(style.label), key: key.label }),
        detail: style.description,
        route: `/loops?style=${style.id}&key=${key.pc}`,
        completed: false,
      };
    }
    if (step.kind === 'analysis') {
      const progression = ANALYSIS_MAP[step.progressionId];
      return {
        step,
        kindLabel: 'Analysis',
        title: progression?.title ?? step.progressionId,
        detail: progression?.blurb ?? '',
        route: `/analysis?progression=${step.progressionId}`,
        completed: false,
      };
    }
    const room = ROOMS[step.room];
    return {
      step,
      kindLabel: 'Practice room',
      title: room.title,
      detail: room.detail,
      route: room.route,
      completed: false,
    };
  };

  const resolved = path.steps.map(resolve);
  const next = resolved.find((step) => step.step.kind === 'lesson' && !step.completed) ?? resolved[0];

  return (
    <div className="page paths-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/paths">{t('Style paths')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t(path.title)}</span>
      </nav>

      <header className="path-header">
        <div>
          <span className="eyebrow">
            {t(path.level)} · {t('{n} steps', { n: path.steps.length })}
          </span>
          <h1>{t(path.title)}</h1>
          <p className="path-tagline">{t(path.tagline)}</p>
          <p className="path-description">{t(path.description)}</p>
        </div>
        <div className="header-stat path-stat">
          <span>{t('Lessons completed')}</span>
          <strong>
            {progress.done} / {progress.total}
          </strong>
          <div className="progress-track slim">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          {next && (
            <Link className="button secondary small" to={next.route}>
              {progress.done === 0 ? t('Start the path') : t('Continue path')}
              <Icon name="arrow" size={14} />
            </Link>
          )}
        </div>
      </header>

      <section className="panel path-timeline">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('The route')}</span>
            <h2>{t('Lessons, pieces, loops, and analysis')}</h2>
          </div>
        </div>
        <ol className="path-steps">
          {resolved.map((step, index) => (
            <li
              key={`${step.kindLabel}-${index}`}
              className={`path-step ${step.completed ? 'completed' : ''}`}
            >
              <span className="path-step-number">
                {step.completed ? <Icon name="check" size={15} /> : index + 1}
              </span>
              <div className="path-step-body">
                <span className="path-step-kind">{t(step.kindLabel)}</span>
                <strong>{t(step.title)}</strong>
                <p>{t(step.detail)}</p>
              </div>
              <Link className="path-step-open" to={step.route} aria-label={t('Open {title}', { title: t(step.title) })}>
                <Icon name="arrow" size={16} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel paths-note">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Keep going')}</span>
            <h2>{t('Use the path as a spine')}</h2>
          </div>
        </div>
        <p>
          {t(
            'When a step feels shaky, repeat it before moving on. When it feels easy, skip ahead and come back later. The path is a sequence of good next steps, not a test.',
          )}
        </p>
        <div className="loop-links">
          <Link className="text-link" to="/glossary">
            {t('Open the glossary')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/assignments">
            {t('Build a worksheet')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/paths">
            {t('Back to paths')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
