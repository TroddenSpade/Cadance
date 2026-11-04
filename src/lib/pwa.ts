import { registerSW } from 'virtual:pwa-register';

export interface PwaUpdateState {
  available: boolean;
  /** Increments each time a newer worker is found. */
  generation: number;
}

type Listener = (state: PwaUpdateState) => void;

const listeners = new Set<Listener>();
let state: PwaUpdateState = { available: false, generation: 0 };
let registration: ServiceWorkerRegistration | null = null;
let started = false;

function publish(patch: Partial<PwaUpdateState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
}

/** Ask the browser to look for a new service worker script. */
async function checkForUpdate() {
  if (!registration) return;
  try {
    await registration.update();
    // A deploy that landed while the app was closed leaves a waiting worker
    // without firing updatefound on this page, so inspect it directly.
    if (registration.waiting && !state.available) {
      publish({ available: true, generation: state.generation + 1 });
    }
  } catch {
    /* offline or the script could not be fetched; try again later */
  }
}

/**
 * Register the service worker once and watch for new deployments. The app is
 * built with `registerType: 'prompt'`, so a new worker waits until the player
 * chooses to refresh instead of swapping versions underneath them.
 */
export function startPwaUpdates() {
  if (started) return;
  started = true;

  registerSW({
    immediate: true,
    onNeedRefresh() {
      publish({ available: true, generation: state.generation + 1 });
    },
    onRegisteredSW(_swUrl, swRegistration) {
      registration = swRegistration ?? null;
      if (!registration) return;

      if (registration.waiting) {
        publish({ available: true, generation: state.generation + 1 });
      }

      // Deploys can land while the app stays open. Check periodically, and
      // again whenever the tab or installed app comes back to the foreground.
      window.setInterval(checkForUpdate, 60_000);
      window.setTimeout(checkForUpdate, 4_000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
      window.addEventListener('online', checkForUpdate);
    },
  });
}

export function subscribePwaUpdate(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}

async function clearCaches(scopePath: string) {
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  const ours = keys.filter((key) => key.startsWith('workbox-') && key.includes(scopePath));
  await Promise.all(ours.map((key) => caches.delete(key)));
}

/**
 * Escape a stale build completely: drop the Cache Storage entries, remove the
 * old worker registrations, then reload with a query string so the browser
 * cannot answer the document from its HTTP cache either.
 */
export async function refreshToUpdate(): Promise<void> {
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
  const scopeHref = registration?.scope ?? baseUrl.href;
  const scopePath = new URL(scopeHref).pathname;
  await clearCaches(scopePath);

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const ours = registrations.filter((item) => item.scope === scopeHref);
    await Promise.all(
      ours.map(async (item) => {
        item.waiting?.postMessage({ type: 'SKIP_WAITING' });
        try {
          await item.unregister();
        } catch {
          /* the reload below still fetches a fresh worker */
        }
      }),
    );
  }

  const url = new URL(window.location.href);
  url.searchParams.set('updated', String(Date.now()));
  window.location.replace(url.toString());
}
