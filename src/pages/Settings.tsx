import { useState } from 'react';
import Icon from '../components/Icons';
import { synth } from '../lib/audio';
import type { IconName } from '../components/Icons';
import { levelFromXp, useProgress, type InstrumentMode } from '../lib/progress';

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

export default function Settings() {
  const { state, updateSettings, resetProgress, resetAll } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const levelInfo = levelFromXp(state.xp);

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
              <span>14 courses · 44 lessons · piano & guitar</span>
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
              <span>All progress stored locally on this device</span>
            </div>
          </div>
          <p className="settings-fineprint">
            Install: open the browser menu and choose “Add to Home Screen”. Android packaging instructions are in the
            project README.
          </p>
        </section>

        <section className="panel settings-panel danger-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Data</span>
              <h2>Reset</h2>
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
