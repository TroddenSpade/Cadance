import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
} from '../data/glossary';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';

type CategoryFilter = 'all' | GlossaryCategory;

export default function Glossary() {
  const { t, language } = useI18n();
  const { lessonMap } = useCurriculum();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const localized = useMemo(
    () =>
      GLOSSARY.map((entry) => ({
        entry,
        term: t(entry.term),
        definition: t(entry.definition),
        category: t(entry.category),
      })),
    [language, t],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return localized
      .filter((item) => {
        if (category !== 'all' && item.entry.category !== category) return false;
        if (!needle) return true;
        const haystack = [
          item.term,
          item.definition,
          item.category,
          item.entry.term,
          item.entry.definition,
          ...(item.entry.aliases ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => a.term.localeCompare(b.term, language === 'fa' ? 'fa' : 'en'));
  }, [category, language, localized, query]);

  const groups = useMemo(() => {
    const result: Array<{ letter: string; entries: typeof localized }> = [];
    filtered.forEach((item) => {
      const letter = item.term[0]?.toUpperCase() ?? '#';
      const last = result[result.length - 1];
      if (last && last.letter === letter) last.entries.push(item);
      else result.push({ letter, entries: [item] });
    });
    return result;
  }, [filtered]);

  return (
    <div className="page glossary-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Glossary')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Name what you hear')}</span>
          <h1>{t('Glossary')}</h1>
          <p>
            {t(
              'The working vocabulary of the curriculum, from the staff to sonata form. Search a term, filter by topic, and jump to the lesson where it is taught.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Terms')}</span>
          <strong>{GLOSSARY.length}</strong>
          <small>{t('Across six topics')}</small>
        </div>
      </header>

      <section className="panel glossary-tools">
        <div className="glossary-search">
          <label htmlFor="glossary-query">{t('Search the glossary')}</label>
          <div className="glossary-search-row">
            <Icon name="music" size={16} />
            <input
              id="glossary-query"
              type="search"
              value={query}
              placeholder={t('Try “cadence”, “syncopation”, or “voice leading”')}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="glossary-clear"
                aria-label={t('Clear the search')}
                onClick={() => setQuery('')}
              >
                <Icon name="close" size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="glossary-filters" role="group" aria-label={t('Filter by topic')}>
          <button
            type="button"
            className={`glossary-filter ${category === 'all' ? 'active' : ''}`}
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            {t('All topics')}
          </button>
          {GLOSSARY_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`glossary-filter ${category === item ? 'active' : ''}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {t(item)}
            </button>
          ))}
        </div>

        <p className="glossary-count" role="status">
          {t('Showing {n} of {total} terms', { n: filtered.length, total: GLOSSARY.length })}
        </p>
      </section>

      {filtered.length === 0 ? (
        <section className="panel glossary-empty">
          <h2>{t('No terms match that search')}</h2>
          <p>{t('Try a shorter word, or clear the topic filter.')}</p>
          <button
            type="button"
            className="button secondary small"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            <Icon name="refresh" size={14} /> {t('Reset the glossary')}
          </button>
        </section>
      ) : (
        <div className="glossary-groups">
          {groups.map((group) => (
            <section key={group.letter} className="glossary-group" aria-label={group.letter}>
              <h2>{group.letter}</h2>
              <div className="glossary-grid">
                {group.entries.map((item) => {
                  const lesson = item.entry.lessonId
                    ? lessonMap[item.entry.lessonId]
                    : undefined;
                  return (
                    <article key={item.entry.term} className="glossary-card">
                      <div className="glossary-card-head">
                        <h3>{item.term}</h3>
                        <span>{item.category}</span>
                      </div>
                      <p>{item.definition}</p>
                      {lesson && (
                        <Link className="text-link" to={`/lesson/${lesson.id}`}>
                          {lesson.title} <Icon name="arrow" size={13} />
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="panel glossary-links">
        <div className="loop-links">
          <Link className="text-link" to="/paths">
            {t('Follow a style path')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/analysis">
            {t('Analyse a progression')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/assignments">
            {t('Build a worksheet')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
