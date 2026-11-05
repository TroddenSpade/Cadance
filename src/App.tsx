import { lazy, Suspense, useEffect, useRef } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './components/Icons';
import InstallPrompt from './components/InstallPrompt';
import LanguageModal from './components/LanguageModal';
import LanguageToggle from './components/LanguageToggle';
import MetronomeDock from './components/MetronomeDock';
import RouteMeta from './components/RouteMeta';
import UpdatePrompt from './components/UpdatePrompt';
import { MetronomeProvider } from './lib/metronome';
import { useProgress, levelFromXp, syncStatusLabel, todayKey, ProgressProvider } from './lib/progress';
import { useI18n } from './lib/i18n';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Each route loads its own chunk; the dashboard stays eager because it is the
// landing page and already pulls in the curriculum index.
const Courses = lazy(() => import('./pages/Courses'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const MetronomePage = lazy(() => import('./pages/MetronomePage'));
const Practice = lazy(() => import('./pages/Practice'));
const Repertoire = lazy(() => import('./pages/Repertoire'));
const RepertoirePiece = lazy(() => import('./pages/RepertoirePiece'));
const Explorer = lazy(() => import('./pages/Explorer'));
const SightReading = lazy(() => import('./pages/SightReading'));
const Rhythm = lazy(() => import('./pages/Rhythm'));
const Loops = lazy(() => import('./pages/Loops'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Paths = lazy(() => import('./pages/Paths'));
const StylePathPage = lazy(() => import('./pages/StylePath'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Worksheets = lazy(() => import('./pages/Worksheets'));
const Settings = lazy(() => import('./pages/Settings'));
const Tools = lazy(() => import('./pages/Tools'));
const Trainer = lazy(() => import('./pages/Trainer'));
const Tuner = lazy(() => import('./pages/Tuner'));

const NAV: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: '/', label: 'Today', icon: 'today', end: true },
  { to: '/courses', label: 'Courses', icon: 'courses' },
  { to: '/repertoire', label: 'Repertoire', icon: 'book' },
  { to: '/practice', label: 'Practice', icon: 'practice' },
  { to: '/trainer', label: 'Trainer', icon: 'trainer' },
  { to: '/tools', label: 'Tools', icon: 'tools' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

function RouteFocus() {
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  // Client-side navigation should behave like a new page: focus its heading,
  // not leave the keyboard at the end of the previous route. Initial loads keep
  // the browser's normal focus behavior.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (hash) return;

    const main = document.getElementById('main-content');
    if (!main) return;

    let cancelled = false;
    let timer = 0;
    const focusHeading = (attempt = 0) => {
      if (cancelled) return;
      const heading = main.querySelector<HTMLElement>('h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        return;
      }
      if (attempt < 20) timer = window.setTimeout(() => focusHeading(attempt + 1), 25);
    };
    focusHeading();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}

function Sidebar() {
  const { state, dueSkills, email, status } = useProgress();
  const { t } = useI18n();
  const levelInfo = levelFromXp(state.xp);
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">
          <Icon name="music" size={24} />
        </span>
        <span className="brand-copy">
          <strong>{t('Cadence')}</strong>
          <small>{t('Music theory, in practice')}</small>
        </span>
      </NavLink>

      <nav className="side-nav" aria-label={t('Main navigation')}>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon name={item.icon} size={20} />
            <span>{t(item.label)}</span>
            {item.to === '/practice' && dueSkills.length > 0 && <span className="nav-badge">{dueSkills.length}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-language">
          <span className="sidebar-language-label">{t('Language')}</span>
          <LanguageToggle />
        </div>
        <NavLink to="/settings" className={`sidebar-sync ${status}`}>
          <Icon name="cloud" size={15} />
          <span>{email ? t(syncStatusLabel[status]) : t('Sync across devices')}</span>
        </NavLink>
        <div className="level-card">
          <div className="level-card-top">
            <span>
              {t('Level')} {levelInfo.level} · {t(levelInfo.title)}
            </span>
            <strong>{t('{n} XP', { n: state.xp })}</strong>
          </div>
          <div className="progress-track slim">
            <div className="progress-fill" style={{ width: `${Math.round(levelInfo.progress * 100)}%` }} />
          </div>
          <div className="level-card-sub">
            <span>{state.streak > 0 ? t('{n}-day streak', { n: state.streak }) : t('Start a streak today')}</span>
            <span>{state.lastActive === todayKey() ? t('Active today') : ''}</span>
          </div>
        </div>
        <p className="sidebar-note">{t('Works offline · Installable · Piano & guitar')}</p>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const { state } = useProgress();
  const { t } = useI18n();
  return (
    <header className="mobile-header">
      <NavLink to="/" className="brand compact">
        <span className="brand-mark">
          <Icon name="music" size={20} />
        </span>
        <span className="brand-copy">
          <strong>{t('Cadence')}</strong>
        </span>
      </NavLink>
      <div className="mobile-header-stats">
        <span className="streak-chip">
          <Icon name="flame" size={16} />
          {state.streak}
        </span>
        <span className="xp-chip">{t('{n} XP', { n: state.xp })}</span>
        <LanguageToggle compact />
      </div>
    </header>
  );
}

function MobileNav() {
  const { dueSkills } = useProgress();
  const { t } = useI18n();
  return (
    <nav className="mobile-nav" aria-label={t('Main navigation')}>
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
          <span className="mobile-icon">
            <Icon name={item.icon} size={21} />
            {item.to === '/practice' && dueSkills.length > 0 && <span className="mobile-badge" />}
          </span>
          <span>{item.label === 'Trainer' ? t('Train') : t(item.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function RouteFallback() {
  const { t } = useI18n();
  return (
    <div className="page route-loading" role="status">
      <span className="route-loading-bar" aria-hidden="true" />
      <span className="sr-only">{t('Loading page')}</span>
    </div>
  );
}

function Shell() {
  const { t } = useI18n();
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          window.history.replaceState(null, '', '#main-content');
          document.getElementById('main-content')?.focus();
        }}
      >
        {t('Skip to content')}
      </a>
      <Sidebar />
      <MobileHeader />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <RouteMeta />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/repertoire" element={<Repertoire />} />
            <Route path="/repertoire/:pieceId" element={<RepertoirePiece />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/sight-reading" element={<SightReading />} />
            <Route path="/rhythm" element={<Rhythm />} />
            <Route path="/loops" element={<Loops />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/paths/:pathId" element={<StylePathPage />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/assignments" element={<Worksheets />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/trainer" element={<Trainer />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/metronome" element={<MetronomePage />} />
            <Route path="/tuner" element={<Tuner />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <MobileNav />
      <MetronomeDock />
      <InstallPrompt />
      <UpdatePrompt />
      <LanguageModal />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <MetronomeProvider>
        <RouteFocus />
        <Shell />
      </MetronomeProvider>
    </ProgressProvider>
  );
}
