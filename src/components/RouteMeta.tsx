import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { REPERTOIRE_MAP } from '../data/repertoire';
import { useCurriculum } from '../data/i18n';
import { useI18n } from '../lib/i18n';

type RouteInfo = {
  title: string;
  description: string;
};

const STATIC_TITLES: Record<string, string> = {
  '/': 'Cadence — Music Theory Trainer',
  '/courses': 'Courses',
  '/repertoire': 'Graded repertoire',
  '/explorer': 'Scale & chord explorer',
  '/practice': 'Daily practice',
  '/trainer': 'Trainer',
  '/tools': 'Tools',
  '/metronome': 'Metronome',
  '/tuner': 'Tuner',
  '/settings': 'Settings',
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function absoluteUrl(pathname: string): string {
  const base = import.meta.env.BASE_URL;
  const path = pathname === '/' ? '' : pathname.replace(/^\//, '');
  return new URL(`${base}${path}`, window.location.origin).href;
}

/**
 * Keeps the document title, description, canonical URL, and social preview
 * tags in sync with the active route. The static tags in index.html cover the
 * initial HTML for crawlers that do not run JavaScript; this handles the tab,
 * history, and rendered-page metadata.
 */
export default function RouteMeta() {
  const { pathname: rawPathname } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, '') || '/';
  const { t, language } = useI18n();
  const { courses, courseMap, lessonMap } = useCurriculum();

  useEffect(() => {
    let info: RouteInfo = {
      title: `${t('This page is off the staff.')} — ${t('Cadence')}`,
      description: t('The note you were looking for is not here. Try the course path or return to today.'),
    };

    const titleKey = STATIC_TITLES[pathname];
    if (titleKey) {
      const descriptions: Record<string, string> = {
        '/': t(
          'Learn music theory by reading, hearing, and playing it. Courses, daily review, and instrument drills for piano and guitar.',
        ),
        '/courses': t(
          'Browse the full Cadence curriculum: {n} courses across five levels, from first notes to post-tonal analysis.',
          { n: courses.length },
        ),
        '/repertoire': t(
          'Short public-domain pieces with score, tab, chord diagrams, and a tempo, count-in, loop, and click.',
        ),
        '/explorer': t(
          'See any scale or chord on the staff, piano, and fretboard, hear it, transpose it, and view CAGED shapes.',
        ),
        '/practice': t(
          'A daily mix of reading, listening, and instrument questions, scheduled by spaced review.',
        ),
        '/trainer': t(
          'Build a custom drill by topic and difficulty, from note reading to progressions and melody dictation.',
        ),
        '/tools': t('Metronome and tuner: keep time and pitch with offline practice tools.'),
        '/metronome': t(
          'A precise metronome with meters, subdivisions, accents, tap tempo, and a floating dock.',
        ),
        '/tuner': t(
          'A microphone tuner for guitar, bass, orchestral strings, piano, and custom tunings.',
        ),
        '/settings': t('Language, instrument, note names, audio, daily goal, sync, backup, and reset.'),
      };
      info = {
        title: titleKey === 'Cadence — Music Theory Trainer' ? t(titleKey) : `${t(titleKey)} — ${t('Cadence')}`,
        description: descriptions[pathname] ?? descriptions['/'],
      };
    } else {
      const course = courseMap[pathname.replace(/^\/courses\//, '')];
      if (pathname.startsWith('/courses/') && course) {
        info = {
          title: `${course.title} — ${t('Cadence')}`,
          description: course.subtitle,
        };
      } else {
        const lesson = lessonMap[pathname.replace(/^\/lesson\//, '')];
        if (pathname.startsWith('/lesson/') && lesson) {
          info = {
            title: `${lesson.title} — ${t('Cadence')}`,
            description: lesson.summary,
          };
        } else {
          const piece = REPERTOIRE_MAP[pathname.replace(/^\/repertoire\//, '')];
          if (pathname.startsWith('/repertoire/') && piece) {
            info = {
              title: `${t(piece.title)} — ${t('Cadence')}`,
              description: t(piece.summary),
            };
          }
        }
      }
    }

    const isContentRoute =
      Boolean(courseMap[pathname.replace(/^\/courses\//, '')]) ||
      Boolean(lessonMap[pathname.replace(/^\/lesson\//, '')]) ||
      Boolean(REPERTOIRE_MAP[pathname.replace(/^\/repertoire\//, '')]);

    document.title = info.title;
    upsertMeta('name', 'description', info.description);
    upsertMeta('property', 'og:type', isContentRoute ? 'article' : 'website');
    upsertMeta('property', 'og:title', info.title);
    upsertMeta('property', 'og:description', info.description);
    upsertMeta('property', 'og:url', absoluteUrl(pathname));
    upsertMeta('property', 'og:locale', language === 'fa' ? 'fa_IR' : 'en_US');
    upsertMeta('name', 'twitter:title', info.title);
    upsertMeta('name', 'twitter:description', info.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = absoluteUrl(pathname);
  }, [courseMap, courses.length, language, lessonMap, pathname, t]);

  return null;
}
