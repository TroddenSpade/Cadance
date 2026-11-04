import { useEffect, useState } from 'react';
import Icon from './Icons';
import { refreshToUpdate, subscribePwaUpdate } from '../lib/pwa';

/**
 * A top-of-page notice shown when a newer service worker is waiting. Refreshing
 * clears Cache Storage and the old worker registrations before reloading, so a
 * fresh deployment cannot be hidden behind a stale cache.
 */
export default function UpdatePrompt() {
  const [state, setState] = useState({ available: false, generation: 0 });
  const [dismissed, setDismissed] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribePwaUpdate(setState), []);

  if (!state.available || dismissed === state.generation) return null;

  const refresh = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await refreshToUpdate();
    } catch {
      setBusy(false);
    }
  };

  return (
    <aside className="update-prompt" role="status" aria-live="polite">
      <span className="update-prompt-icon">
        <Icon name="refresh" size={18} />
      </span>
      <div className="update-prompt-copy">
        <strong>New version ready</strong>
        <p>Refresh to load the latest update and clear the old cache.</p>
      </div>
      <button
        className="button primary small update-prompt-action"
        onClick={() => void refresh()}
        disabled={busy}
      >
        {busy ? 'Refreshing…' : 'Refresh now'}
      </button>
      <button
        className="update-prompt-close"
        onClick={() => setDismissed(state.generation)}
        aria-label="Dismiss update notice"
      >
        <Icon name="close" size={14} />
      </button>
    </aside>
  );
}
