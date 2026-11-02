import { useEffect, useMemo, useState } from 'react';
import { synth } from '../lib/audio';
import {
  EXERCISE_LABELS,
  compareInstrumentInput,
  correctInstrumentAnswer,
  generateSession,
} from '../lib/exercises';
import { pitchClass } from '../lib/music';
import { useProgress } from '../lib/progress';
import type { ExerciseSpec, Question, SessionResult } from '../lib/types';
import Icon from './Icons';
import InstrumentSurface from './InstrumentSurface';
import RhythmDisplay from './RhythmDisplay';
import Staff from './Staff';

interface ExerciseSessionProps {
  specs: ExerciseSpec[];
  title?: string;
  context: 'lesson' | 'practice' | 'trainer';
  passThreshold?: number;
  onFinish?: (result: SessionResult) => void;
  onDone?: () => void;
  onExit?: () => void;
}

function buildResult(questions: Question[], answers: boolean[]): SessionResult {
  const correct = answers.filter(Boolean).length;
  const byKind: Record<string, { correct: number; total: number }> = {};
  questions.forEach((question, index) => {
    const entry = byKind[question.kind] ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answers[index]) entry.correct += 1;
    byKind[question.kind] = entry;
  });
  return {
    total: questions.length,
    correct,
    accuracy: questions.length ? correct / questions.length : 0,
    xp: correct * 10 + (questions.length - correct) * 2,
    byKind,
  };
}

export default function ExerciseSession({
  specs,
  title,
  context,
  passThreshold = 0.7,
  onFinish,
  onDone,
  onExit,
}: ExerciseSessionProps) {
  const { settings, recordAnswer } = useProgress();
  const [questions, setQuestions] = useState<Question[]>(() => generateSession(specs));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'quiz' | 'feedback' | 'done'>('quiz');
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  const question = questions[index];
  const isInstrumentQuestion =
    question?.kind === 'find-note' || question?.kind === 'chord-build' || question?.kind === 'scale-build';
  const isSequence = Boolean(question?.targetMidis);
  const targetLength = question?.targetMidis?.length ?? 0;

  const preferFlats = useMemo(() => {
    const text = [question?.prompt, question?.answer, question?.targetLabel, question?.explanation]
      .filter(Boolean)
      .join(' ');
    const flats = (text.match(/♭/g) ?? []).length;
    const sharps = (text.match(/♯/g) ?? []).length;
    return flats > sharps;
  }, [question]);

  const marks = useMemo(() => {
    const values: Record<number, 'correct' | 'wrong' | 'selected' | 'target'> = {};
    if (!question) return values;
    const targets = correctInstrumentAnswer(question).map(pitchClass);
    if (phase === 'feedback') {
      targets.forEach((pc) => {
        values[pc] = 'correct';
      });
      if (selectedChoice === '__wrong__') {
        selection.map(pitchClass).forEach((pc) => {
          if (!targets.includes(pc)) values[pc] = 'wrong';
        });
      }
    } else {
      selection.map(pitchClass).forEach((pc) => {
        values[pc] = 'selected';
      });
    }
    return values;
  }, [phase, question, selection, selectedChoice]);

  const playAudio = () => {
    if (!question?.audio) return;
    synth.stopAll();
    if (question.audio.rhythm) {
      synth.playRhythm(question.audio.rhythm, question.audio.tempo ?? 0.46);
    } else if (question.audio.chords) {
      synth.playChords(question.audio.chords, question.audio.tempo ?? 0.8);
    } else if (question.audio.midis) {
      synth.playSequence(question.audio.midis, question.audio.mode, question.audio.tempo ?? 0.6);
    }
  };

  useEffect(() => {
    if (!settings.autoPlay || !question?.audio || phase !== 'quiz') return;
    const timer = window.setTimeout(playAudio, 420);
    return () => {
      window.clearTimeout(timer);
      synth.stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id, settings.autoPlay, phase]);

  useEffect(() => {
    synth.setTimbre(settings.timbre);
  }, [settings.timbre]);

  const grade = (correct: boolean, choice?: string) => {
    if (phase !== 'quiz' || !question) return;
    setAnswers((prev) => [...prev, correct]);
    setSelectedChoice(choice ?? (correct ? '__correct__' : '__wrong__'));
    setPhase('feedback');
    recordAnswer(question.skills, correct);
  };

  const handleChoice = (choice: string) => {
    if (phase !== 'quiz' || !question) return;
    grade(choice === question.answer, choice);
  };

  const handleInstrument = (midi: number) => {
    if (phase !== 'quiz' || !question) return;
    if (!isSequence) {
      setSelection([midi]);
      grade([midi].map(pitchClass).join() === correctInstrumentAnswer(question).map(pitchClass).join());
      return;
    }
    const pc = pitchClass(midi);
    setSelection((prev) => {
      const existing = prev.find((value) => pitchClass(value) === pc);
      if (existing !== undefined) return prev.filter((value) => pitchClass(value) !== pc);
      if (prev.length >= targetLength) return prev;
      return [...prev, midi];
    });
  };

  const checkSequence = () => {
    if (!question) return;
    grade(compareInstrumentInput(question, selection));
  };

  const finish = () => {
    const finalResult = buildResult(questions, answers);
    setResult(finalResult);
    setPhase('done');
    onFinish?.(finalResult);
  };

  const next = () => {
    synth.stopAll();
    if (index + 1 >= questions.length) {
      finish();
      return;
    }
    setIndex((value) => value + 1);
    setPhase('quiz');
    setSelection([]);
    setSelectedChoice(null);
  };

  const restart = () => {
    synth.stopAll();
    setQuestions(generateSession(specs));
    setIndex(0);
    setPhase('quiz');
    setAnswers([]);
    setSelection([]);
    setSelectedChoice(null);
    setResult(null);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!question || phase === 'done') return;
      if (phase === 'quiz' && question.choices) {
        const number = Number(event.key);
        if (number >= 1 && number <= question.choices.length) {
          event.preventDefault();
          handleChoice(question.choices[number - 1]);
        }
      }
      if (phase === 'feedback' && event.key === 'Enter') {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question, index]);

  if (!question) {
    return (
      <div className="empty-state">
        <h3>No exercises available</h3>
        <p>This session has no questions. Try another topic.</p>
        {onExit && (
          <button className="button secondary" onClick={onExit}>
            Go back
          </button>
        )}
      </div>
    );
  }

  if (phase === 'done' && result) {
    const percent = Math.round(result.accuracy * 100);
    const passed = result.accuracy >= passThreshold;
    const heading =
      context === 'lesson'
        ? passed
          ? 'Lesson complete'
          : 'Almost there'
        : 'Session complete';
    return (
      <div className="session-summary">
        <div className={`summary-ring ${passed ? 'passed' : ''}`} style={{ background: `conic-gradient(var(--accent) ${percent * 3.6}deg, var(--line) 0deg)` }}>
          <div className="summary-ring-inner">
            <strong>{percent}%</strong>
            <span>accuracy</span>
          </div>
        </div>
        <div className="summary-copy">
          <span className="eyebrow">{context === 'lesson' ? 'Exercises' : 'Practice'}</span>
          <h2>{heading}</h2>
          <p>
            {result.correct} of {result.total} correct
            {context === 'lesson' && !passed
              ? ` — reach ${Math.round(passThreshold * 100)}% to complete this lesson.`
              : context === 'lesson'
                ? ' — this lesson is now marked complete and its skills are scheduled for review.'
                : ' — answers are scheduled for review across the coming days.'}
          </p>
          <div className="summary-stats">
            <div>
              <span>XP this session</span>
              <strong>+{result.xp}</strong>
            </div>
            <div>
              <span>Topics</span>
              <strong>{Object.keys(result.byKind).length}</strong>
            </div>
          </div>
          <div className="summary-topics">
            {Object.entries(result.byKind).map(([kind, value]) => (
              <span key={kind} className="topic-chip">
                {EXERCISE_LABELS[kind as keyof typeof EXERCISE_LABELS] ?? kind}
                <b>
                  {value.correct}/{value.total}
                </b>
              </span>
            ))}
          </div>
          <div className="button-row">
            {(!passed || context !== 'lesson') && (
              <button className="button primary" onClick={restart}>
                <Icon name="refresh" size={17} />
                Try again
              </button>
            )}
            <button className="button secondary" onClick={onDone ?? onExit}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((index + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100;
  const instrumentAnswer = correctInstrumentAnswer(question);

  return (
    <div className="exercise-session">
      <div className="session-head">
        <div>
          <span className="eyebrow">
            {title ??
              (context === 'lesson' ? 'Lesson exercises' : context === 'practice' ? 'Daily practice' : 'Trainer')}
          </span>
          <div className="session-count">
            Question {index + 1} <span>/ {questions.length}</span>
          </div>
        </div>
        <div className="session-head-right">
          <span className="topic-chip muted">{EXERCISE_LABELS[question.kind]}</span>
          {onExit && (
            <button className="icon-button" onClick={onExit} aria-label="Exit exercises">
              <Icon name="close" size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-card">
        <div className="question-body">
          <h2 className="question-prompt">{question.prompt}</h2>
          {question.instruction && <p className="question-instruction">{question.instruction}</p>}

          {question.staff && (
            <div className="notation-panel">
              <Staff spec={question.staff} />
            </div>
          )}
          {question.rhythm && (
            <div className="notation-panel rhythm-panel">
              <RhythmDisplay items={question.rhythm.items} />
            </div>
          )}

          {question.audio && (
            <button className="listen-button" onClick={playAudio}>
              <span className="listen-icon">
                <Icon name="headphones" size={19} />
              </span>
              <span>
                <strong>Listen</strong>
                <small>
                  {question.audio.rhythm
                    ? 'Rhythm'
                    : question.audio.chords
                      ? 'Chord sequence'
                      : question.audio.mode === 'chord'
                        ? 'Together'
                        : 'Melodic'}
                </small>
              </span>
            </button>
          )}

          {question.choices && (
            <div className={`choice-grid ${question.choiceRhythms ? 'rhythm-choices' : ''}`}>
              {question.choices.map((choice, choiceIndex) => {
                const isAnswer = choice === question.answer;
                const isChosen = choice === selectedChoice;
                const rhythm = question.choiceRhythms?.[choiceIndex];
                let className = 'choice';
                if (phase === 'feedback' && isAnswer) className += ' correct';
                else if (phase === 'feedback' && isChosen) className += ' wrong';
                return (
                  <button
                    key={choice}
                    className={className}
                    onClick={() => handleChoice(choice)}
                    disabled={phase !== 'quiz'}
                  >
                    <span className="choice-letter">{String.fromCharCode(65 + choiceIndex)}</span>
                    {rhythm ? (
                      <span className="choice-rhythm">
                        <RhythmDisplay items={rhythm} compact barEvery={4} />
                      </span>
                    ) : (
                      <span className="choice-text">{choice}</span>
                    )}
                    {phase === 'feedback' && isAnswer && <Icon name="check" size={17} />}
                  </button>
                );
              })}
            </div>
          )}

          {isInstrumentQuestion && (
            <div className="instrument-question">
              {isSequence && (
                <div className="selection-tray">
                  <div className="selection-info">
                    <span className="selection-label">
                      {question.kind === 'scale-build' ? 'Your scale' : 'Your chord'}
                    </span>
                    <span className="selection-count">
                      {selection.length} / {targetLength}
                    </span>
                  </div>
                  <div className="selection-chips">
                    {selection.length === 0 && <span className="selection-empty">Tap notes on the instrument below.</span>}
                    {selection.map((midi, selectedIndex) => (
                      <button
                        key={`${midi}-${selectedIndex}`}
                        className="selection-chip"
                        onClick={() => setSelection((prev) => prev.filter((_, i) => i !== selectedIndex))}
                        disabled={phase !== 'quiz'}
                        aria-label={`Remove selected note ${selectedIndex + 1}`}
                      >
                        {selectedIndex + 1}
                      </button>
                    ))}
                  </div>
                  <div className="selection-actions">
                    <button
                      className="button ghost small"
                      onClick={() => setSelection([])}
                      disabled={phase !== 'quiz' || selection.length === 0}
                    >
                      Clear
                    </button>
                    <button
                      className="button primary small"
                      onClick={checkSequence}
                      disabled={phase !== 'quiz' || selection.length !== targetLength}
                    >
                      Check answer
                    </button>
                  </div>
                </div>
              )}
              <InstrumentSurface
                onNote={handleInstrument}
                marks={marks}
                disabled={phase !== 'quiz'}
                showLabelsOverride={phase === 'feedback' ? true : false}
                preferFlats={preferFlats}
              />
            </div>
          )}
        </div>

        {phase === 'feedback' && (
          <div className={`feedback-panel ${answers[answers.length - 1] ? 'correct' : 'wrong'}`}>
            <div className="feedback-head">
              <span className="feedback-icon">
                <Icon name={answers[answers.length - 1] ? 'check' : 'close'} size={18} />
              </span>
              <strong>{answers[answers.length - 1] ? 'Correct' : 'Not quite'}</strong>
              {!answers[answers.length - 1] && !question.choiceRhythms && (
                <span className="feedback-answer">Answer: {question.answer}</span>
              )}
            </div>
            <p>{question.explanation}</p>
            {isInstrumentQuestion && phase === 'feedback' && instrumentAnswer.length > 0 && (
              <p className="feedback-answer-line">
                Target {question.kind === 'find-note' ? 'note' : question.kind === 'chord-build' ? 'chord tones' : 'scale'}:{' '}
                <strong>{question.targetLabel ?? instrumentAnswer.map((midi) => midi % 12).join('–')}</strong>
              </p>
            )}
            {question.hint && !answers[answers.length - 1] && <p className="feedback-hint">Tip: {question.hint}</p>}
            <button className="button primary" onClick={next}>
              {index + 1 >= questions.length ? 'See results' : 'Continue'}
              <Icon name="arrow" size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
