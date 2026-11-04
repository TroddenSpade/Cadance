import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { initLanguage } from './lib/i18n';
import { startPwaUpdates } from './lib/pwa';
import './styles.css';

initLanguage();
startPwaUpdates();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
