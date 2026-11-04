import { useEffect, useState } from 'react';
import Icon from './Icons';
import {
  INSTALL_SHOW_EVENT,
  clearInstallSnooze,
  installSnoozed,
  isChromium,
  isIos,
  isStandalone,
  snoozeInstall,
  useInstallPrompt,
} from '../lib/install';

const SHOW_DELAY = 1500;

/**
 * Offers installation as soon as the app is running as a normal tab.
 *
 * Chromium normally fires `beforeinstallprompt`, captured early in index.html,
 * which lets us open the native install dialog. That event depends on browser
 * heuristics and never fires in some browsers, so Chromium without it gets the
 * manual browser-menu route instead of silence. iOS has no event at all and
 * always gets the Share → Add to Home Screen hint. Dismissals snooze for a day.
 */
export default function InstallPrompt() {
  const { available, install } = useInstallPrompt();
  const [ios] = useState(() => isIos());
  const [chromium] = useState(() => isChromium());
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  const eligible = available || ios || chromium;

  useEffect(() => {
    if (!eligible || isStandalone()) return;
    if (installSnoozed()) return;
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => window.clearTimeout(timer);
  }, [eligible]);

  useEffect(() => {
    document.body.classList.toggle('has-install-prompt', visible);
    return () => document.body.classList.remove('has-install-prompt');
  }, [visible]);

  useEffect(() => {
    // Settings can bring the reminder back without a reload.
    const onShow = () => {
      if (!eligible || isStandalone()) return;
      setVisible(true);
    };
    window.addEventListener(INSTALL_SHOW_EVENT, onShow);
    return () => window.removeEventListener(INSTALL_SHOW_EVENT, onShow);
  }, [eligible]);

  useEffect(() => {
    const onInstalled = () => {
      clearInstallSnooze();
      setVisible(false);
    };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    snoozeInstall();
  };

  const runInstall = async () => {
    if (installing) return;
    setInstalling(true);
    const outcome = await install();
    setInstalling(false);
    setVisible(false);
    if (outcome !== 'accepted') snoozeInstall();
  };

  return (
    <aside className="install-prompt" role="dialog" aria-label="Install Cadence">
      <span className="install-prompt-icon">
        <Icon name="download" size={20} />
      </span>
      <div className="install-prompt-copy">
        <strong>Keep Cadence with you</strong>
        {ios ? (
          <p>
            Tap the Share button, then <b>Add to Home Screen</b> to install it.
          </p>
        ) : available ? (
          <p>Install for offline practice and a full-screen, app-like experience.</p>
        ) : (
          <p>
            Install for offline practice. Open the browser menu (<b>⋮</b>) and choose <b>Install Cadence</b>, or use the
            install icon in the address bar.
          </p>
        )}
        <div className="install-prompt-actions">
          {available && (
            <button className="button primary small" onClick={() => void runInstall()} disabled={installing}>
              {installing ? 'Opening…' : 'Install app'}
            </button>
          )}
          <button className="button ghost small" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
      <button className="install-prompt-close" onClick={dismiss} aria-label="Dismiss install prompt">
        <Icon name="close" size={14} />
      </button>
    </aside>
  );
}
