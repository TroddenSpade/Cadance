import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initLanguage } from './lib/i18n';
import { startPwaUpdates } from './lib/pwa';
import './styles.css';

// `BASE_URL` is "/" for the custom domain and "/<repo>/" for project Pages.
const baseName = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

// Old hash links (and bookmarks made before the move to clean URLs) still work.
const legacyHash = window.location.hash;
if (legacyHash.startsWith('#/')) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  window.history.replaceState(null, '', `${base}${legacyHash.slice(1)}`);
}

initLanguage();
startPwaUpdates();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
