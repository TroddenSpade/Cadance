import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import {
  REPERTOIRE,
  REPERTOIRE_LEVELS,
  type RepertoireLevel,
} from '../data/repertoire';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';

type Filter = 'all' | RepertoireLevel;

export default function Repertoire() {
  const { t } = useI18n();
  const { lessonMap } = useCurriculum();
  const [filter, setFilter] = useState<Filter>('all');

  const pieces = filter === 'all' ? REPERTOIRE : REPERTOIRE.filter((piece) => piece.level === filter);
  const filters: Array<{ id: Filter; title: string }> = [
    { id: 'all', title: 'All levels' },
    ...REPERTOIRE_LEVELS.map((level) => ({ id: level.id as Filter, title: level.title })),
  ];

  return (
    <div className="page repertoire-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Play real music')}</span>
          <h1>{t('Graded repertoire')}</h1>
          <p>
            {t(
              'Short public-domain pieces, each linked to the lesson that prepares it. Read the score, follow the tab, and practise with a tempo, count-in, loop, and click.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Pieces')}</span>
          <strong>{REPERTOIRE.length}</strong>
          <small>{t('Beginner to early intermediate')}</small>
        </div>
      </header>

      <div className="repertoire-filters" role="group" aria-label={t('Filter repertoire by level')}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`repertoire-filter ${filter === item.id ? 'active' : ''}`}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {t(item.title)}
          </button>
        ))}
      </div>

      <div className="repertoire-grid">
        {pieces.map((piece) => {
          const lesson = lessonMap[piece.afterLesson];
          return (
            <Link key={piece.id} to={`/repertoire/${piece.id}`} className="repertoire-card">
              <span className="repertoire-card-eyebrow">
                {t(REPERTOIRE_LEVELS.find((level) => level.id === piece.level)?.title ?? 'Beginner')}
              </span>
              <h2>{t(piece.title)}</h2>
              <span className="repertoire-card-composer">{t(piece.composer)}</span>
              <p>{t(piece.summary)}</p>
              <div className="repertoire-card-meta">
                <span>{piece.keyLabel}</span>
                <span>
                  {piece.time[0]}/{piece.time[1]}
                </span>
                <span>{t('{bpm} BPM', { bpm: piece.bpm })}</span>
              </div>
              {lesson && (
                <span className="repertoire-card-lesson">
                  <Icon name="book" size={14} />
                  {t('After {lesson}', { lesson: lesson.title })}
                </span>
              )}
              <span className="repertoire-card-open">
                {t('Open piece')} <Icon name="arrow" size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="panel repertoire-note">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('How to use the library')}</span>
            <h2>{t('One piece at a time')}</h2>
          </div>
        </div>
        <p>
          {t(
            'Start at half tempo with the count-in on. Loop two bars until the fingering is secure, then join the phrases. Play the right hand alone, then the left hand, then both. Only raise the tempo when the take is clean three times in a row.',
          )}
        </p>
      </section>
    </div>
  );
}
