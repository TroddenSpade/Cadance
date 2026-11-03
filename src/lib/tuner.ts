export interface PitchReading {
  frequency: number;
  clarity: number;
  rms: number;
}

export interface TunerReading extends PitchReading {
  midi: number;
  cents: number;
  targetFrequency: number;
}

const MIN_FREQUENCY = 28;
const MAX_FREQUENCY = 1600;
const SILENCE_RMS = 0.006;

function rmsOf(buffer: Float32Array): number {
  let sum = 0;
  for (let index = 0; index < buffer.length; index += 1) {
    sum += buffer[index] * buffer[index];
  }
  return Math.sqrt(sum / buffer.length);
}

/**
 * YIN-style fundamental detector. It is deliberately limited to the range of
 * a bass low string through a high violin note, and returns `null` for silence
 * or unpitched noise.
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): PitchReading | null {
  const rms = rmsOf(buffer);
  if (rms < SILENCE_RMS) return null;

  const size = buffer.length;
  const maxLag = Math.min(Math.floor(sampleRate / MIN_FREQUENCY), Math.floor(size / 2) - 1);
  const minLag = Math.max(2, Math.floor(sampleRate / MAX_FREQUENCY));
  if (maxLag <= minLag + 2) return null;

  // Remove DC offset before measuring differences.
  let mean = 0;
  for (let index = 0; index < size; index += 1) mean += buffer[index];
  mean /= size;

  const limit = size - maxLag;
  const difference = new Float32Array(maxLag + 1);
  for (let tau = minLag; tau <= maxLag; tau += 1) {
    let sum = 0;
    for (let index = 0; index < limit; index += 1) {
      const delta = buffer[index] - mean - (buffer[index + tau] - mean);
      sum += delta * delta;
    }
    difference[tau] = sum;
  }

  const normalized = new Float32Array(maxLag + 1);
  normalized[0] = 1;
  let running = 0;
  for (let tau = minLag; tau <= maxLag; tau += 1) {
    running += difference[tau];
    normalized[tau] = running === 0 ? 1 : (difference[tau] * (tau - minLag + 1)) / running;
  }

  let tauEstimate = -1;
  for (let tau = minLag + 1; tau < maxLag; tau += 1) {
    if (normalized[tau] < 0.18) {
      while (tau + 1 <= maxLag && normalized[tau + 1] < normalized[tau]) tau += 1;
      tauEstimate = tau;
      break;
    }
  }

  if (tauEstimate < 0) {
    let best = minLag + 1;
    for (let tau = minLag + 2; tau <= maxLag; tau += 1) {
      if (normalized[tau] < normalized[best]) best = tau;
    }
    if (normalized[best] > 0.42) return null;
    tauEstimate = best;
  }

  const before = normalized[tauEstimate - 1] ?? normalized[tauEstimate];
  const current = normalized[tauEstimate];
  const after = normalized[tauEstimate + 1] ?? normalized[tauEstimate];
  const denominator = 2 * (2 * current - before - after);
  const shift = denominator === 0 ? 0 : (after - before) / denominator;
  const period = tauEstimate + Math.max(-0.5, Math.min(0.5, shift));
  const frequency = sampleRate / period;

  if (!Number.isFinite(frequency) || frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) return null;

  return {
    frequency,
    clarity: Math.max(0, Math.min(1, 1 - current)),
    rms,
  };
}

export function frequencyToMidi(frequency: number, referenceA4 = 440): number {
  return 69 + 12 * Math.log2(frequency / referenceA4);
}

export function midiToFrequencyWithReference(midi: number, referenceA4 = 440): number {
  return referenceA4 * Math.pow(2, (midi - 69) / 12);
}

export function centsFromFrequency(frequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(frequency / targetFrequency);
}

export function tuneReading(frequency: number, referenceA4 = 440): TunerReading {
  const exactMidi = frequencyToMidi(frequency, referenceA4);
  const midi = Math.round(exactMidi);
  const targetFrequency = midiToFrequencyWithReference(midi, referenceA4);
  return {
    frequency,
    clarity: 1,
    rms: 0,
    midi,
    cents: centsFromFrequency(frequency, targetFrequency),
    targetFrequency,
  };
}

/** Median frequency, used to steady a jittery microphone reading. */
export function medianFrequency(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export type TunerMode = 'auto' | 'string' | 'chromatic';

export interface TargetReading {
  midi: number;
  targetFrequency: number;
  /** Difference between the heard pitch and the target, in cents. */
  cents: number;
  /** Index into the tuning's string list, or null in chromatic mode. */
  stringIndex: number | null;
}

/**
 * Decide which pitch the player is aiming at.
 *
 * - `auto` snaps to the nearest string in the current tuning, so a guitarist
 *   can play any string without selecting it first.
 * - `string` measures against one chosen string, which is how you tune by eye
 *   when the note is far from pitch.
 * - `chromatic` snaps to the nearest equal-tempered semitone.
 */
export function resolveTarget(
  frequency: number,
  stringMidis: number[],
  mode: TunerMode,
  selectedIndex = 0,
  referenceA4 = 440,
): TargetReading {
  const nearestMidi = Math.round(frequencyToMidi(frequency, referenceA4));

  if (mode === 'string' && stringMidis.length > 0) {
    const index = Math.max(0, Math.min(stringMidis.length - 1, selectedIndex));
    const midi = stringMidis[index];
    const targetFrequency = midiToFrequencyWithReference(midi, referenceA4);
    return {
      midi,
      targetFrequency,
      cents: centsFromFrequency(frequency, targetFrequency),
      stringIndex: index,
    };
  }

  if (mode !== 'chromatic' && stringMidis.length > 0) {
    let bestIndex = 0;
    let bestCents = Number.POSITIVE_INFINITY;
    for (let index = 0; index < stringMidis.length; index += 1) {
      const target = midiToFrequencyWithReference(stringMidis[index], referenceA4);
      const cents = Math.abs(centsFromFrequency(frequency, target));
      if (cents < bestCents) {
        bestCents = cents;
        bestIndex = index;
      }
    }
    const midi = stringMidis[bestIndex];
    const targetFrequency = midiToFrequencyWithReference(midi, referenceA4);
    return {
      midi,
      targetFrequency,
      cents: centsFromFrequency(frequency, targetFrequency),
      stringIndex: bestIndex,
    };
  }

  const targetFrequency = midiToFrequencyWithReference(nearestMidi, referenceA4);
  return {
    midi: nearestMidi,
    targetFrequency,
    cents: centsFromFrequency(frequency, targetFrequency),
    stringIndex: null,
  };
}

export type TuningStatus = 'in-tune' | 'close' | 'off';

export function tuningStatus(cents: number): TuningStatus {
  const distance = Math.abs(cents);
  if (distance <= 5) return 'in-tune';
  if (distance <= 15) return 'close';
  return 'off';
}

export function formatCents(cents: number): string {
  const rounded = Math.round(cents);
  if (rounded === 0) return '0';
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

