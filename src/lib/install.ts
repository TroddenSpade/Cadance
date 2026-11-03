import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __cadenceInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const INSTALL_EVENT = 'cadence:install-available';
export const INSTALL_SHOW_EVENT = 'cadence:install-show';
export const INSTALL_DISMISS_KEY = 'cadence.install.dismissed.v1';
export const INSTALL_SNOOZE_DAYS = 1;

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIos(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isChromium(): boolean {
  return /chrome|chromium|edg\//i.test(navigator.userAgent) && !/firefox|fxios/i.test(navigator.userAgent);
}

export function installSnoozed(): boolean {
  try {
    const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISS_KEY) ?? 0);
    return dismissedAt > 0 && Date.now() - dismissedAt < INSTALL_SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function snoozeInstall(): void {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode or storage disabled */
  }
}

export function clearInstallSnooze(): void {
  try {
    localStorage.removeItem(INSTALL_DISMISS_KEY);
  } catch {
    /* ignore */
  }
}

/** Bring the prompt back immediately, used by the Settings install row. */
export function showInstallPromptNow(): void {
  clearInstallSnooze();
  window.dispatchEvent(new Event(INSTALL_SHOW_EVENT));
}

/**
 * Reads the deferred `beforeinstallprompt` event captured by the inline script
 * in index.html, and turns it into an install function. The event can only be
 * used once, so it is cleared afterwards.
 */
export function useInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(() =>
    typeof window === 'undefined' ? null : (window.__cadenceInstallPrompt ?? null),
  );

  useEffect(() => {
    const update = () => setEvent(window.__cadenceInstallPrompt ?? null);
    window.addEventListener(INSTALL_EVENT, update);
    update();
    return () => window.removeEventListener(INSTALL_EVENT, update);
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    const prompt = event ?? window.__cadenceInstallPrompt;
    if (!prompt) return 'unavailable';
    let outcome: 'accepted' | 'dismissed' = 'dismissed';
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      outcome = choice.outcome;
    } catch {
      outcome = 'dismissed';
    } finally {
      window.__cadenceInstallPrompt = null;
      setEvent(null);
      window.dispatchEvent(new Event(INSTALL_EVENT));
    }
    return outcome;
  }, [event]);

  return { event, available: Boolean(event), install };
}
