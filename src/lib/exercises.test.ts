import { describe, expect, it } from 'vitest';
import {
  EXERCISE_LABELS,
  STARTER_SPECS,
  TOPIC_SPECS,
  compareInstrumentInput,
  correctInstrumentAnswer,
  exerciseSkillLabel,
  generateQuestion,
  generateSession,
  topicSpec,
  type Difficulty,
  type TopicId,
} from './exercises';
import { pitchClass } from './music';

const TOPICS = Object.keys(TOPIC_SPECS) as TopicId[];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

describe('exercise generation', () => {
  it('builds a complete, well-formed session for every topic and difficulty', () => {
    for (const topic of TOPICS) {
      for (const difficulty of DIFFICULTIES) {
        const questions = generateSession([topicSpec(topic, difficulty, 12)]);

        expect(questions, `${topic}/${difficulty} produced no questions`).toHaveLength(12);
        for (const question of questions) {
          expect(question.answer, `${topic}/${difficulty} has no answer`).toBeTruthy();
          expect(question.prompt.length, `${topic}/${difficulty} has no prompt`).toBeGreaterThan(3);
          expect(question.explanation.length, `${topic}/${difficulty} has no explanation`).toBeGreaterThan(3);
          expect(question.skills.length, `${topic}/${difficulty} has no skills`).toBeGreaterThan(0);
          expect(question.id).toMatch(new RegExp(`^${question.kind}-`));

          if (question.choices) {
            expect(question.choices.length, `${topic}/${difficulty} has too few choices`).toBeGreaterThanOrEqual(2);
            expect(question.choices, `${topic}/${difficulty} answer is missing from choices`).toContain(question.answer);
            expect(new Set(question.choices).size, `${topic}/${difficulty} has duplicate choices`).toBe(
              question.choices.length,
            );
          }

          if (question.kind === 'find-note' || question.kind === 'chord-build' || question.kind === 'scale-build') {
            expect(correctInstrumentAnswer(question).length, `${topic}/${difficulty} has no instrument target`).toBeGreaterThan(0);
          }

          if (question.audio) {
            const hasAudio = Boolean(question.audio.midis?.length || question.audio.chords?.length || question.audio.rhythm?.length);
            expect(hasAudio, `${topic}/${difficulty} has an empty audio spec`).toBe(true);
          }
        }
      }
    }
  });

  it('keeps question ids unique within a session', () => {
    const questions = generateSession(STARTER_SPECS);
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it('labels every generated exercise kind', () => {
    for (const topic of TOPICS) {
      const question = generateQuestion(topicSpec(topic, 'easy', 1));
      expect(question, `${topic} generated no question`).not.toBeNull();
      expect(EXERCISE_LABELS[question!.kind], `${question!.kind} has no label`).toBeTruthy();
    }
  });

  it('uses a readable skill label for every starter skill', () => {
    for (const spec of STARTER_SPECS) {
      for (const skill of spec.skills) {
        expect(exerciseSkillLabel(skill)).not.toBe(skill);
      }
    }
  });
});

describe('instrument grading', () => {
  it('accepts any octave for a single-note question', () => {
    const question = generateQuestion({ kind: 'find-note', count: 1, skills: ['find-note-natural'], config: { accidentals: false } });
    expect(question?.targetMidi).toBeDefined();
    const target = question!.targetMidi!;

    expect(compareInstrumentInput(question!, [target])).toBe(true);
    expect(compareInstrumentInput(question!, [target + 12])).toBe(true);
    expect(compareInstrumentInput(question!, [target - 12])).toBe(true);
    expect(compareInstrumentInput(question!, [(target + 1) % 128])).toBe(false);
    expect(compareInstrumentInput(question!, [])).toBe(false);
  });

  it('accepts chord tones in any order but rejects extra or missing tones', () => {
    const question = generateQuestion({ kind: 'chord-build', count: 1, skills: ['chord-build-triads'], config: { qualities: ['Major'] } });
    const target = correctInstrumentAnswer(question!);
    expect(target).toHaveLength(3);

    expect(compareInstrumentInput(question!, target)).toBe(true);
    expect(compareInstrumentInput(question!, [...target].reverse())).toBe(true);
    expect(compareInstrumentInput(question!, [...target, target[0] + 12])).toBe(false);
    expect(compareInstrumentInput(question!, target.slice(0, 2))).toBe(false);
    expect(compareInstrumentInput(question!, [target[0], target[1], target[2] + 1])).toBe(false);
  });

  it('requires scale tones in ascending order', () => {
    const question = generateQuestion({ kind: 'scale-build', count: 1, skills: ['scale-build-major'], config: { scales: ['Major'] } });
    const target = correctInstrumentAnswer(question!);
    expect(target).toHaveLength(7);

    expect(compareInstrumentInput(question!, target)).toBe(true);
    expect(compareInstrumentInput(question!, [...target].reverse())).toBe(false);
    expect(compareInstrumentInput(question!, target.map((midi) => midi + 12))).toBe(true);
    expect(new Set(target.map(pitchClass)).size).toBe(7);
  });
});
