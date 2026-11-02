import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Icon, { type IconName } from './components/Icons';
import { useProgress, levelFromXp, syncStatusLabel, todayKey, ProgressProvider } from './lib/progress';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import NotFound from './pages/NotFound';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import Trainer from './pages/Trainer';

const NAV: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: '/', label: 'Today', icon: 'today', end: true },
  { to: '/courses', label: 'Courses', icon: 'courses' },
  { to: '/practice', label: 'Practice', icon: 'practice' },
  { to: '/trainer', label: 'Trainer', icon: 'trainer' },
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
  const levelInfo = levelFromXp(state.xp);
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">
          <Icon name="music" size={24} />
        </span>
        <span className="brand-copy">
          <strong>Cadence</strong>
          <small>Music theory, in practice</small>
        </span>
      </NavLink>

      <nav className="side-nav" aria-label="Main navigation">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
            {item.to === '/practice' && dueSkills.length > 0 && <span className="nav-badge">{dueSkills.length}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <NavLink to="/settings" className={`sidebar-sync ${status}`}>
          <Icon name="cloud" size={15} />
          <span>{email ? syncStatusLabel[status] : 'Sync across devices'}</span>
        </NavLink>
        <div className="level-card">
          <div className="level-card-top">
            <span>
              Level {levelInfo.level} · {levelInfo.title}
            </span>
            <strong>{state.xp} XP</strong>
          </div>
          <div className="progress-track slim">
            <div className="progress-fill" style={{ width: `${Math.round(levelInfo.progress * 100)}%` }} />
          </div>
          <div className="level-card-sub">
            <span>{state.streak > 0 ? `${state.streak}-day streak` : 'Start a streak today'}</span>
            <span>{state.lastActive === todayKey() ? 'Active today' : ''}</span>
          </div>
        </div>
        <p className="sidebar-note">Works offline · Installable · Piano & guitar</p>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const { state } = useProgress();
  return (
    <header className="mobile-header">
      <NavLink to="/" className="brand compact">
        <span className="brand-mark">
          <Icon name="music" size={20} />
        </span>
        <span className="brand-copy">
          <strong>Cadence</strong>
        </span>
      </NavLink>
      <div className="mobile-header-stats">
        <span className="streak-chip">
          <Icon name="flame" size={16} />
          {state.streak}
        </span>
        <span className="xp-chip">{state.xp} XP</span>
      </div>
    </header>
  );
}

function MobileNav() {
  const { dueSkills } = useProgress();
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
          <span className="mobile-icon">
            <Icon name={item.icon} size={21} />
            {item.to === '/practice' && dueSkills.length > 0 && <span className="mobile-badge" />}
          </span>
          <span>{item.label === 'Trainer' ? 'Train' : item.label}</span>
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
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <ScrollToTop />
      <Shell />
    </ProgressProvider>
  );
}
