import { useEffect, useState } from 'react';
import Icon from './Icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'cadence.install.dismissed.v1';
const SNOOZE_DAYS = 14;
const SHOW_DELAY = 2500;

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function snoozed(): boolean {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    return dismissedAt > 0 && Date.now() - dismissedAt < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function snooze(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode or storage disabled */
  }
}

function clearSnooze(): void {
  try {
    localStorage.removeItem(DISMISS_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Offers installation once the browser says the PWA is installable. Chromium
 * fires `beforeinstallprompt`; iOS has no such event, so it gets a short
 * Share → Add to Home Screen hint instead. Dismissals snooze for two weeks.
 */
export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone() || snoozed()) return;
    let timer = 0;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setIos(false);
      timer = window.setTimeout(() => setVisible(true), SHOW_DELAY);
    };
    const onInstalled = () => {
      window.clearTimeout(timer);
      setVisible(false);
      setPromptEvent(null);
      clearSnooze();
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // Safari never fires beforeinstallprompt, so show the manual route.
    if (isIos()) {
      timer = window.setTimeout(() => {
        setIos(true);
        setVisible(true);
      }, SHOW_DELAY);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    snooze();
  };

  const install = async () => {
    if (!promptEvent) return;
    setInstalling(true);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'dismissed') snooze();
    } catch {
      snooze();
    } finally {
      setInstalling(false);
      setVisible(false);
      setPromptEvent(null);
    }
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
        ) : (
          <p>Install for offline practice and a full-screen, app-like experience.</p>
        )}
        <div className="install-prompt-actions">
          {!ios && (
            <button className="button primary small" onClick={() => void install()} disabled={installing}>
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
