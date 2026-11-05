import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { STYLE_PATHS, stylePathProgress } from '../data/stylePaths';
import { useI18n } from '../lib/i18n';
import { useProgress } from '../lib/progress';

export default function Paths() {
  const { t } = useI18n();
  const { state } = useProgress();

  return (
    <div className="page paths-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Style paths')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Follow a tradition')}</span>
          <h1>{t('Style paths')}</h1>
          <p>
            {t(
              'Four routes through the same curriculum. Each path puts lessons, graded pieces, backing loops, and analysis in the order that makes the style click.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Paths')}</span>
          <strong>{STYLE_PATHS.length}</strong>
          <small>{t('Lessons, pieces, loops, and analysis')}</small>
        </div>
      </header>

      <div className="paths-grid">
        {STYLE_PATHS.map((path) => {
          const progress = stylePathProgress(path, state.lessons);
          const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
          return (
            <Link key={path.id} to={`/paths/${path.id}`} className="path-card">
              <span className="path-card-eyebrow">
                {t(path.level)} · {t('{n} steps', { n: path.steps.length })}
              </span>
              <h2>{t(path.title)}</h2>
              <p className="path-card-tagline">{t(path.tagline)}</p>
              <p>{t(path.description)}</p>
              <div className="path-card-progress">
                <div className="progress-track slim">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <small>
                  {t('{done} of {total} lessons', { done: progress.done, total: progress.total })}
                </small>
              </div>
              <span className="path-card-open">
                {t('Open path')}
                <Icon name="arrow" size={15} />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="panel paths-note">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('How a path works')}</span>
            <h2>{t('One step at a time')}</h2>
          </div>
        </div>
        <p>
          {t(
            'A path is a recommendation, not a lock. Lessons mark themselves complete as you finish them, and every piece and loop can be opened on its own. Follow the order until a step feels easy, then jump ahead.',
          )}
        </p>
        <div className="loop-links">
          <Link className="text-link" to="/analysis">
            {t('Analyse a progression')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/glossary">
            {t('Open the glossary')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/assignments">
            {t('Build a worksheet')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
