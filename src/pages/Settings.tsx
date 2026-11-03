import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Icon from '../components/Icons';
import { synth } from '../lib/audio';
import type { IconName } from '../components/Icons';
import { ALL_LESSONS, COURSES } from '../data/curriculum';
import { levelFromXp, syncStatusLabel, todayKey, useProgress, type InstrumentMode } from '../lib/progress';
import type { NoteNaming } from '../lib/music';
import {
  installSnoozed,
  isChromium,
  isIos,
  isStandalone,
  showInstallPromptNow,
  snoozeInstall,
  useInstallPrompt,
} from '../lib/install';

const INSTRUMENTS: Array<{ id: InstrumentMode; title: string; description: string; icon: IconName }> = [
  {
    id: 'piano',
    title: 'Piano keys',
    description: 'Two octaves of keyboard for finding notes, chords, and scales.',
    icon: 'piano',
  },
  {
    id: 'guitar',
    title: 'Guitar fretboard',
    description: 'Standard tuning, twelve frets, all six strings.',
    icon: 'guitar',
  },
  {
    id: 'both',
    title: 'Both surfaces',
    description: 'Show piano and guitar together. Answer on either one.',
    icon: 'music',
  },
];

const NAMING_OPTIONS: Array<{ id: NoteNaming; title: string; example: string; description: string }> = [
  {
    id: 'letters',
    title: 'ABC',
    example: 'C · D · E',
    description: 'Letter names only, the standard in English theory.',
  },
  {
    id: 'solfege',
    title: 'Do Re Mi',
    example: 'Do · Re · Mi',
    description: 'Solfège only, with fixed do for every written note.',
  },
  {
    id: 'both',
    title: 'Both',
    example: 'C (Do) · D (Re)',
    description: 'Show the letter and its solfège translation together.',
  },
];

function formatSyncedAt(value: number | null): string {
  if (!value) return 'not yet';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function InstallRow() {
  const { available, install } = useInstallPrompt();
  const [installed] = useState(() => isStandalone());
  const [ios] = useState(() => isIos());
  const [chromium] = useState(() => isChromium());
  const [busy, setBusy] = useState(false);
  const [snoozed, setSnoozed] = useState(() => installSnoozed());

  const run = async () => {
    setBusy(true);
    const outcome = await install();
    setBusy(false);
    if (outcome !== 'accepted') snoozeInstall();
  };

  return (
    <div className="backup-row install-row">
      <div>
        <strong>Install app</strong>
        <p>
          {installed
            ? 'Cadence is installed and runs in its own window.'
            : 'Add Cadence to your home screen or desktop for offline practice and a full-screen experience.'}
        </p>
      </div>
      <div className="button-row">
        {installed ? (
          <span className="install-state">
            <Icon name="check" size={14} /> Installed
          </span>
        ) : available ? (
          <button className="button primary small" onClick={() => void run()} disabled={busy}>
            {busy ? 'Opening…' : 'Install app'}
          </button>
        ) : snoozed ? (
          <button
            className="button ghost small"
            onClick={() => {
              showInstallPromptNow();
              setSnoozed(false);
            }}
          >
            Show reminder
          </button>
        ) : ios ? (
          <span className="install-hint">Share → Add to Home Screen</span>
        ) : chromium ? (
          <span className="install-hint">Address-bar install icon, or ⋮ → Install Cadence</span>
        ) : (
          <span className="install-hint">Try Chrome, Edge, or Safari on iOS</span>
        )}
      </div>
    </div>
  );
}


function AccountPanel() {
  const { configured, status, email, lastSyncedAt, syncError, signIn, signOut, syncNow } = useProgress();
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!address.trim()) return;
    setBusy(true);
    setNotice(null);
    const result = await signIn(address);
    setBusy(false);
    setNotice(
      result.ok
        ? `Check ${address.trim()} for a sign-in link. It may take a minute.`
        : (result.error ?? 'Could not send the link.'),
    );
  };

  return (
    <section className="panel settings-panel account-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">Account</span>
          <h2>Sync across phone and computer</h2>
        </div>
        <span className={`sync-pill ${status}`}>
          <span className="sync-dot" />
          {syncStatusLabel[status]}
        </span>
      </div>

      {!configured ? (
        <p className="settings-note">
          Cross-device sync is not configured in this build, so progress stays on this device. Set
          <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> when building to enable accounts —
          the README has the setup steps. You can still move progress between devices with a backup file.
        </p>
      ) : email ? (
        <div className="sync-account">
          <div className="sync-identity">
            <span className="sync-avatar">
              <Icon name="user" size={20} />
            </span>
            <div>
              <strong>{email}</strong>
              <small>
                {syncError
                  ? syncError
                  : status === 'synced'
                    ? `Last synced ${formatSyncedAt(lastSyncedAt)}`
                    : syncStatusLabel[status]}
              </small>
            </div>
          </div>
          <div className="button-row">
            <button
              className="button secondary small"
              onClick={() => void syncNow()}
              disabled={status === 'syncing'}
            >
              <Icon name="refresh" size={14} /> Sync now
            </button>
            <button className="button ghost small" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
          <p className="settings-note">
            Practice works offline. Changes merge with your account when you reconnect, and resetting progress on one
            device clears it everywhere.
          </p>
        </div>
      ) : (
        <form className="sync-form" onSubmit={submit}>
          <p className="settings-note">
            Sign in with an email link — no password to remember. Your lessons, reviews, XP, and streaks then follow
            you between devices. Progress stays on this device and keeps working offline.
          </p>
          <div className="sync-input-row">
            <label className="sr-only" htmlFor="sync-email">
              Email address
            </label>
            <input
              id="sync-email"
              className="sync-input"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <button className="button primary small" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Email me a link'}
            </button>
          </div>
          {notice && <p className="sync-notice">{notice}</p>}
        </form>
      )}
    </section>
  );
}

export default function Settings() {
  const { state, updateSettings, resetProgress, resetAll, exportProgress, importProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const levelInfo = levelFromXp(state.xp);

  const exportBackup = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `cadence-backup-${todayKey()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const text = await file.text();
    const confirmed = window.confirm(
      'Replace the progress on this device with this backup? If you are signed in, the synced copy is replaced too.',
    );
    if (!confirmed) return;
    const result = importProgress(text);
    window.alert(result.ok ? 'Backup restored.' : (result.error ?? 'Could not restore that backup.'));
  };

  const testTone = (timbre: 'piano' | 'guitar') => {
    synth.setTimbre(timbre);
    synth.stopAll();
    synth.playSequence([60, 64, 67, 72], 'sequence', 0.34);
  };

  return (
    <div className="page settings-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Preferences</span>
          <h1>Settings</h1>
          <p>
            Shape how Cadence looks and sounds. Instrument choices apply everywhere — lessons, daily practice, and
            trainer drills.
          </p>
        </div>
        <div className="header-stat settings-level">
          <span>Your level</span>
          <strong>
            {levelInfo.level} · {levelInfo.title}
          </strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round(levelInfo.progress * 100)}%` }} />
          </div>
          <small>{state.xp} XP total</small>
        </div>
      </header>

      <div className="settings-grid">
        <AccountPanel />

        <section className="panel settings-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Instrument</span>
              <h2>What should you see in practice?</h2>
            </div>
          </div>
          <div className="instrument-choice-grid">
            {INSTRUMENTS.map((instrument) => (
              <button
                key={instrument.id}
                className={`instrument-choice ${state.settings.instrument === instrument.id ? 'selected' : ''}`}
                onClick={() => updateSettings({ instrument: instrument.id })}
              >
                <span className="instrument-choice-icon">
                  <Icon name={instrument.icon} size={24} />
                </span>
                <strong>{instrument.title}</strong>
                <small>{instrument.description}</small>
                {state.settings.instrument === instrument.id && (
                  <span className="choice-check">
                    <Icon name="check" size={13} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="settings-note">
            Labels are hidden while you answer instrument questions, then revealed with the feedback. This keeps
            note-finding a real test.
          </p>
        </section>

        <section className="panel settings-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Note names</span>
              <h2>ABC or Do Re Mi?</h2>
            </div>
          </div>
          <div className="naming-choice">
            {NAMING_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`naming-option ${state.settings.noteNaming === option.id ? 'selected' : ''}`}
                onClick={() => updateSettings({ noteNaming: option.id })}
              >
                <span className="naming-title">{option.title}</span>
                <span className="naming-example">{option.example}</span>
                <small>{option.description}</small>
                {state.settings.noteNaming === option.id && (
                  <span className="choice-check">
                    <Icon name="check" size={13} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="settings-note">
            Applies to lessons, exercises, staff examples, and the piano and guitar labels. <strong>Both</strong> is the
            default; solfège uses fixed do, so C is always Do.
          </p>
        </section>

        <section className="panel settings-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Sound</span>
              <h2>Timbre & audio</h2>
            </div>
          </div>
          <div className="timbre-row">
            {(['piano', 'guitar'] as const).map((timbre) => (
              <div key={timbre} className={`timbre-card ${state.settings.timbre === timbre ? 'selected' : ''}`}>
                <button className="timbre-select" onClick={() => updateSettings({ timbre })}>
                  <Icon name={timbre === 'piano' ? 'piano' : 'guitar'} size={20} />
                  <span>
                    <strong>{timbre === 'piano' ? 'Piano tone' : 'Guitar tone'}</strong>
                    <small>{timbre === 'piano' ? 'Warm, sustained' : 'Plucked string'}</small>
                  </span>
                  {state.settings.timbre === timbre && <Icon name="check" size={15} />}
                </button>
                <button className="button ghost small" onClick={() => testTone(timbre)}>
                  <Icon name="play" size={14} /> Test
                </button>
              </div>
            ))}
          </div>
          <div className="setting-rows">
            <label className="setting-row">
              <span>
                <strong>Auto-play listening questions</strong>
                <small>Hear intervals, chords, and progressions automatically.</small>
              </span>
              <input
                type="checkbox"
                className="switch"
                checked={state.settings.autoPlay}
                onChange={(event) => updateSettings({ autoPlay: event.target.checked })}
              />
            </label>
            <label className="setting-row">
              <span>
                <strong>Note labels on instruments</strong>
                <small>Show note names outside of quizzes.</small>
              </span>
              <input
                type="checkbox"
                className="switch"
                checked={state.settings.showLabels}
                onChange={(event) => updateSettings({ showLabels: event.target.checked })}
              />
            </label>
            <label className="setting-row">
              <span>
                <strong>Sound enabled</strong>
                <small>Mute all audio while keeping the visual drills.</small>
              </span>
              <input
                type="checkbox"
                className="switch"
                checked={state.settings.sound}
                onChange={(event) => updateSettings({ sound: event.target.checked })}
              />
            </label>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Habit</span>
              <h2>Daily goal</h2>
            </div>
          </div>
          <p className="settings-note">Questions answered per day. A smaller goal kept daily beats a large goal abandoned.</p>
          <div className="goal-options">
            {[10, 20, 30, 40].map((goal) => (
              <button
                key={goal}
                className={`goal-option ${state.settings.dailyGoal === goal ? 'selected' : ''}`}
                onClick={() => updateSettings({ dailyGoal: goal })}
              >
                <strong>{goal}</strong>
                <span>questions</span>
              </button>
            ))}
          </div>
          <div className="setting-rows">
            <div className="setting-row static">
              <span>
                <strong>Current streak</strong>
                <small>Best streak: {state.bestStreak} days</small>
              </span>
              <span className="setting-value">
                <Icon name="flame" size={17} /> {state.streak} days
              </span>
            </div>
            <div className="setting-row static">
              <span>
                <strong>Skills tracked</strong>
                <small>Each one has its own review schedule.</small>
              </span>
              <span className="setting-value">{Object.keys(state.skills).length}</span>
            </div>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">About</span>
              <h2>Cadence</h2>
            </div>
            <span className="topic-chip muted">v0.1</span>
          </div>
          <p className="settings-note">
            A web-first music theory trainer built with React. It works offline once loaded, can be installed to your
            home screen, and is ready to wrap as an Android app with Capacitor.
          </p>
          <div className="about-list">
            <div>
              <Icon name="piano" size={18} />
              <span>
                {COURSES.length} courses · {ALL_LESSONS.length} lessons · piano & guitar
              </span>
            </div>
            <div>
              <Icon name="headphones" size={18} />
              <span>Reading, listening, and instrument drills</span>
            </div>
            <div>
              <Icon name="refresh" size={18} />
              <span>Spaced review that adapts to every answer</span>
            </div>
            <div>
              <Icon name="music" size={18} />
              <span>Local-first progress, with optional cross-device sync</span>
            </div>
          </div>
          <InstallRow />
          <p className="settings-fineprint">Android packaging instructions are in the project README.</p>
        </section>

        <section className="panel settings-panel danger-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Data</span>
              <h2>Backup & reset</h2>
            </div>
          </div>
          <div className="backup-row">
            <div>
              <strong>Backup file</strong>
              <p>Save a JSON snapshot, or restore one here or on another device.</p>
            </div>
            <div className="button-row">
              <button className="button secondary small" onClick={exportBackup}>
                Export backup
              </button>
              <button className="button ghost small" onClick={() => fileRef.current?.click()}>
                Import
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(event) => void importBackup(event)}
              />
            </div>
          </div>
          <div className="danger-actions">
            <div>
              <strong>Reset progress only</strong>
              <p>Clears lessons, skills, XP, and streaks. Keeps your instrument and audio settings.</p>
              <button
                className="button secondary small"
                onClick={() => {
                  if (window.confirm('Reset all learning progress? This cannot be undone.')) resetProgress();
                }}
              >
                Reset progress
              </button>
            </div>
            <div>
              <strong>Reset everything</strong>
              <p>Also restores the default instrument, timbre, and daily goal.</p>
              <button
                className="button danger small"
                onClick={() => {
                  if (confirmReset) {
                    resetAll();
                    setConfirmReset(false);
                  } else {
                    setConfirmReset(true);
                    window.setTimeout(() => setConfirmReset(false), 4000);
                  }
                }}
              >
                {confirmReset ? 'Tap again to confirm' : 'Reset all settings & progress'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
