import { useSyncExternalStore, type ReactNode } from 'react';
import { fa } from '../locales/fa';

export type Language = 'en' | 'fa';

export const LANGUAGES: Array<{ id: Language; label: string; native: string }> = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'fa', label: 'Persian', native: 'فارسی' },
];

const STORAGE_KEY = 'cadence.language';
const listeners = new Set<() => void>();

function readStoredLanguage(): Language {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'fa' ? 'fa' : 'en';
  } catch {
    return 'en';
  }
}

let language: Language = readStoredLanguage();

export function getLanguage(): Language {
  return language;
}

export function isRtl(value: Language = language): boolean {
  return value === 'fa';
}

export function languageLocale(value: Language = language): string {
  return value === 'fa' ? 'fa-IR' : 'en';
}

function applyDocument() {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language;
  document.documentElement.dir = isRtl() ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('lang-fa', language === 'fa');
  document.title = t('Cadence — Music Theory Trainer');
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      'content',
      t(
        'Cadence is an interactive trainer for music theory reading and listening, with piano and guitar.',
      ),
    );
  }
}

/** Apply the saved language before React paints its first frame. */
export function initLanguage(): void {
  applyDocument();
}

export function setLanguage(next: Language): void {
  if (next === language) return;
  language = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage may be unavailable */
  }
  applyDocument();
  listeners.forEach((listener) => listener());
}

export function subscribeLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/**
 * Translate a display string. The English text is the key, so a missing entry
 * falls back to readable English instead of a raw identifier.
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const text = language === 'fa' ? (fa[key] ?? key) : key;
  return interpolate(text, vars);
}

/** True when a Persian translation exists for this exact string. */
export function hasTranslation(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(fa, key);
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(languageLocale(), options).format(date);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(languageLocale(), options).format(value);
}

export interface I18nApi {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (language: Language) => void;
  t: typeof t;
  formatDate: typeof formatDate;
  formatNumber: typeof formatNumber;
}

export function useI18n(): I18nApi {
  const current = useSyncExternalStore(subscribeLanguage, getLanguage, () => 'en' as Language);
  return {
    language: current,
    dir: isRtl(current) ? 'rtl' : 'ltr',
    setLanguage,
    t,
    formatDate,
    formatNumber,
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
