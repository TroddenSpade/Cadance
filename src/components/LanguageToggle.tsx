import Icon from './Icons';
import { useI18n } from '../lib/i18n';

/**
 * Switches between the two interface languages. The label shows the language
 * you would switch to, rendered in that language's own direction.
 */
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  const next = language === 'fa' ? 'en' : 'fa';
  const action = t(next === 'fa' ? 'Switch to Persian' : 'Switch to English');

  return (
    <button
      type="button"
      className={`language-toggle ${compact ? 'compact' : ''}`}
      onClick={() => setLanguage(next)}
      aria-label={action}
      title={action}
    >
      <Icon name="globe" size={compact ? 15 : 16} />
      <span
        className="language-toggle-label"
        lang={next}
        dir={next === 'fa' ? 'rtl' : 'ltr'}
      >
        {next === 'fa' ? 'فارسی' : 'English'}
      </span>
    </button>
  );
}
