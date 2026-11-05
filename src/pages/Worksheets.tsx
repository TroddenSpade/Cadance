import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { useI18n } from '../lib/i18n';
import {
  WORKSHEET_ACTIVITIES,
  WORKSHEET_FOCUS,
  WORKSHEET_FOCUS_MAP,
  WORKSHEET_MINUTES,
  buildWorksheet,
  type WorksheetActivityId,
  type WorksheetFocus,
} from '../lib/worksheet';

export default function Worksheets() {
  const { t, formatDate } = useI18n();
  const [focus, setFocus] = useState<WorksheetFocus>('balanced');
  const [minutes, setMinutes] = useState(30);
  const [student, setStudent] = useState('');
  const [selected, setSelected] = useState<WorksheetActivityId[]>(() => [
    ...new Set(WORKSHEET_FOCUS_MAP.balanced.activities),
  ]);

  const focusInfo = WORKSHEET_FOCUS_MAP[focus] ?? WORKSHEET_FOCUS[0];
  const worksheet = useMemo(
    () => buildWorksheet({ focus, minutes, activities: selected }),
    [focus, minutes, selected],
  );
  const total = worksheet.tasks.reduce((sum, task) => sum + task.minutes, 0);
  const today = formatDate(new Date(), { dateStyle: 'medium' });

  const chooseFocus = (next: WorksheetFocus) => {
    setFocus(next);
    setSelected([...new Set(WORKSHEET_FOCUS_MAP[next].activities)]);
  };

  const toggleActivity = (id: WorksheetActivityId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const reset = () => {
    setFocus('balanced');
    setMinutes(30);
    setStudent('');
    setSelected([...new Set(WORKSHEET_FOCUS_MAP.balanced.activities)]);
  };

  return (
    <div className="page worksheets-page">
      <nav className="breadcrumbs" aria-label={t('Breadcrumb')}>
        <Link to="/">{t('Today')}</Link>
        <Icon name="chevron" size={13} />
        <Link to="/tools">{t('Tools')}</Link>
        <Icon name="chevron" size={13} />
        <span>{t('Assignments & worksheets')}</span>
      </nav>

      <header className="page-header">
        <div>
          <span className="eyebrow">{t('Plan the week')}</span>
          <h1>{t('Assignments & worksheets')}</h1>
          <p>
            {t(
              'Build a timed practice sheet from the rooms in Cadence. Choose a focus and a length, print it, and tick off each task as you go.',
            )}
          </p>
        </div>
        <div className="header-stat">
          <span>{t('Printable')}</span>
          <strong>{total}</strong>
          <small>{t('Minutes in this sheet')}</small>
        </div>
      </header>

      <section className="panel worksheet-builder">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Worksheet builder')}</span>
            <h2>{t('Choose a focus')}</h2>
          </div>
          <span className="panel-note">{t('Five ways to practise')}</span>
        </div>

        <div className="worksheet-focus-grid">
          {WORKSHEET_FOCUS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`worksheet-focus ${focus === option.id ? 'selected' : ''}`}
              aria-pressed={focus === option.id}
              onClick={() => chooseFocus(option.id)}
            >
              <strong>{t(option.title)}</strong>
              <small>{t(option.description)}</small>
            </button>
          ))}
        </div>

        <div className="worksheet-row">
          <span className="worksheet-label">{t('Time')}</span>
          <div className="worksheet-minutes" role="group" aria-label={t('Minutes')}>
            {WORKSHEET_MINUTES.map((value) => (
              <button
                key={value}
                type="button"
                className={minutes === value ? 'selected' : ''}
                aria-pressed={minutes === value}
                onClick={() => setMinutes(value)}
              >
                {t('{n} min', { n: value })}
              </button>
            ))}
          </div>
        </div>

        <div className="worksheet-row worksheet-row-top">
          <span className="worksheet-label">{t('Include')}</span>
          <div className="worksheet-activities">
            {WORKSHEET_ACTIVITIES.map((activity) => (
              <label key={activity.id} className="worksheet-activity">
                <input
                  type="checkbox"
                  checked={selected.includes(activity.id)}
                  onChange={() => toggleActivity(activity.id)}
                />
                <span>
                  <strong>{t(activity.title)}</strong>
                  <small>{t(activity.instruction)}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="worksheet-row worksheet-name-row">
          <label className="worksheet-label" htmlFor="worksheet-student">
            {t('Student or ensemble (optional)')}
          </label>
          <input
            id="worksheet-student"
            type="text"
            value={student}
            placeholder={t('Name on the sheet')}
            onChange={(event) => setStudent(event.target.value)}
          />
        </div>

        <div className="worksheet-actions">
          <button
            type="button"
            className="button primary"
            onClick={() => window.print()}
            disabled={worksheet.tasks.length === 0}
          >
            <Icon name="download" size={15} /> {t('Print worksheet')}
          </button>
          <button type="button" className="button ghost" onClick={reset}>
            <Icon name="refresh" size={15} /> {t('Reset')}
          </button>
        </div>
      </section>

      <section className="panel worksheet-preview">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('Preview')}</span>
            <h2>{t('Your sheet')}</h2>
          </div>
          <span className="panel-note">
            {t('{n} tasks · {minutes} minutes', { n: worksheet.tasks.length, minutes: total })}
          </span>
        </div>

        {worksheet.tasks.length === 0 ? (
          <p className="worksheet-empty">
            {t('No activities selected. Choose at least one to build a sheet.')}
          </p>
        ) : (
          <div className="worksheet-sheet">
            <header className="worksheet-sheet-head">
              <div>
                <span className="worksheet-sheet-kicker">{t('Cadence practice sheet')}</span>
                <h2>{t(focusInfo.title)}</h2>
                <p>{t(focusInfo.description)}</p>
              </div>
              <div className="worksheet-sheet-meta">
                <span>
                  <strong>{t('Total')}</strong>
                  {t('{n} minutes', { n: total })}
                </span>
                <span>
                  <strong>{t('Date')}</strong>
                  {today}
                </span>
              </div>
            </header>

            <div className="worksheet-sheet-name">
              <span>{t('Student')}</span>
              <strong>{student.trim() || '\u00a0'}</strong>
              <span>{t('Instrument')}</span>
              <strong>{t('Piano or guitar')}</strong>
            </div>

            <ol className="worksheet-tasks">
              {worksheet.tasks.map((task, index) => (
                <li key={`${task.id}-${index}`} className="worksheet-task">
                  <span className="worksheet-check" aria-hidden="true" />
                  <div>
                    <div className="worksheet-task-head">
                      <strong>
                        {index + 1}. {t(task.title)}
                      </strong>
                      <span>{t('{n} min', { n: task.minutes })}</span>
                    </div>
                    <p>{t(task.instruction)}</p>
                    <Link className="worksheet-task-route" to={task.route}>
                      {t('Open in Cadence')}: {task.route}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>

            <div className="worksheet-notes">
              <span>{t('Notes')}</span>
              <i />
              <i />
              <i />
            </div>

            <footer className="worksheet-sheet-foot">
              {t('Read, hear, play. One task at a time.')}
            </footer>
          </div>
        )}
      </section>

      <section className="panel paths-note">
        <div className="panel-head">
          <div>
            <span className="eyebrow">{t('How to use a sheet')}</span>
            <h2>{t('Short enough to finish')}</h2>
          </div>
        </div>
        <p>
          {t(
            'Fifteen minutes is a full session for a beginner; forty-five is a focused block for an intermediate player. Keep the sheet visible, tick each box, and stop when the time is up rather than when everything feels perfect.',
          )}
        </p>
        <div className="loop-links">
          <Link className="text-link" to="/paths">
            {t('Follow a style path')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/glossary">
            {t('Open the glossary')} <Icon name="arrow" size={14} />
          </Link>
          <Link className="text-link" to="/analysis">
            {t('Analyse a progression')} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
