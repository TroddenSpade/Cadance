import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './components/Icons';
import InstallPrompt from './components/InstallPrompt';
import LanguageModal from './components/LanguageModal';
import LanguageToggle from './components/LanguageToggle';
import MetronomeDock from './components/MetronomeDock';
import UpdatePrompt from './components/UpdatePrompt';
import { MetronomeProvider } from './lib/metronome';
import { useProgress, levelFromXp, syncStatusLabel, todayKey, ProgressProvider } from './lib/progress';
import { useI18n } from './lib/i18n';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import MetronomePage from './pages/MetronomePage';
import NotFound from './pages/NotFound';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import Tools from './pages/Tools';
import Trainer from './pages/Trainer';
import Tuner from './pages/Tuner';

const NAV: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: '/', label: 'Today', icon: 'today', end: true },
  { to: '/courses', label: 'Courses', icon: 'courses' },
  { to: '/practice', label: 'Practice', icon: 'practice' },
  { to: '/trainer', label: 'Trainer', icon: 'trainer' },
  { to: '/tools', label: 'Tools', icon: 'tools' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
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

function Shell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <MobileHeader />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/metronome" element={<MetronomePage />} />
          <Route path="/tuner" element={<Tuner />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
        <ScrollToTop />
        <Shell />
      </MetronomeProvider>
    </ProgressProvider>
  );
}
