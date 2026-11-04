import { useEffect, useState } from 'react';
import Icon from './Icons';
import { LANGUAGES, hasStoredLanguage, useI18n, type Language } from '../lib/i18n';

/**
 * Asked once, before the interface has a stored language. The app defaults to
 * English for the first paint, then this dialog lets the visitor choose.
 */
export default function LanguageModal() {
  const { setLanguage, t } = useI18n();
  const [open, setOpen] = useState(() => !hasStoredLanguage());

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const choose = (next: Language) => {
    setLanguage(next);
    setOpen(false);
  };

  return (
    <div className="language-modal-backdrop">
      <div
        className="language-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        <span className="language-modal-mark">
          <Icon name="music" size={26} />
        </span>
        <span className="eyebrow">{t('Welcome to Cadence')}</span>
        <h2 id="language-modal-title">{t('Choose your language')}</h2>
        <p className="language-modal-lead">
          {t('Pick the language you want to use. You can change it later in Settings.')}
        </p>
        <div className="language-modal-options">
          {LANGUAGES.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className="language-option"
              onClick={() => choose(option.id)}
              lang={option.id}
              dir={option.id === 'fa' ? 'rtl' : 'ltr'}
              autoFocus={index === 0}
            >
              <strong className="language-option-name">{option.native}</strong>
              <small className="language-option-label">
                {option.id === 'fa' ? t('Right-to-left layout') : t('Left-to-right layout')}
              </small>
            </button>
          ))}
        </div>
        <p className="language-modal-note">{t('The choice is remembered on this device.')}</p>
      </div>
    </div>
  );
}
