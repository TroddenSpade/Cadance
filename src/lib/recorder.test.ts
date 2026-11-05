import { describe, expect, it } from 'vitest';
import {
  RECORDING_MIME_TYPES,
  canRecordAudio,
  formatRecordingTime,
  preferredRecordingMime,
  recordingErrorMessage,
} from './recorder';

describe('practice recorder helpers', () => {
  it('formats elapsed seconds as minutes and seconds', () => {
    expect(formatRecordingTime(0)).toBe('0:00');
    expect(formatRecordingTime(5)).toBe('0:05');
    expect(formatRecordingTime(65)).toBe('1:05');
    expect(formatRecordingTime(3599)).toBe('59:59');
    expect(formatRecordingTime(-4)).toBe('0:00');
    expect(formatRecordingTime(Number.NaN)).toBe('0:00');
    expect(formatRecordingTime(Number.POSITIVE_INFINITY)).toBe('0:00');
  });

  it('reports no recording support when the browser has no MediaRecorder', () => {
    expect(canRecordAudio()).toBe(false);
    expect(preferredRecordingMime()).toBeUndefined();
    expect(RECORDING_MIME_TYPES.length).toBeGreaterThan(0);
  });

  it('turns permission and device errors into actionable categories', () => {
    expect(recordingErrorMessage(new DOMException('no', 'NotAllowedError'))).toBe('blocked');
    expect(recordingErrorMessage(new DOMException('no', 'SecurityError'))).toBe('blocked');
    expect(recordingErrorMessage(new DOMException('no', 'NotFoundError'))).toBe('missing');
    expect(recordingErrorMessage(new Error('boom'))).toBe('unknown');
    expect(recordingErrorMessage(undefined)).toBe('unknown');
  });
});
