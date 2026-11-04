import { Link } from 'react-router-dom';
import Icon from '../components/Icons';
import { useI18n } from '../lib/i18n';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="page not-found">
      <div className="not-found-mark">𝄢</div>
      <span className="eyebrow">{t('404')}</span>
      <h1>{t('This page is off the staff.')}</h1>
      <p>{t('The note you were looking for is not here. Try the course path or return to today.')}</p>
      <div className="button-row">
        <Link className="button primary" to="/">
          {t('Back to today')}
        </Link>
        <Link className="button secondary" to="/courses">
          {t('Browse courses')}
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    </div>
  );
}
