import { useEffect, useRef, useState } from 'react';
import Icon from './Icons';
import { useI18n } from '../lib/i18n';
import {
  canRecordAudio,
  formatRecordingTime,
  preferredRecordingMime,
  recordingErrorMessage,
} from '../lib/recorder';

type RecorderState = 'idle' | 'requesting' | 'recording' | 'ready' | 'error';

interface PracticeRecorderProps {
  /** Short context line, for example "Record this piece". */
  label?: string;
  className?: string;
}

/**
 * A microphone recorder that never leaves the page. The audio is held in a blob
 * URL for the current tab only: no upload, no storage, no sync. Recording is
 * always an explicit button press, so the browser's permission prompt is the
 * learner's consent.
 */
export default function PracticeRecorder({ label, className = '' }: PracticeRecorderProps) {
  const { t } = useI18n();
  const [state, setState] = useState<RecorderState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<'blocked' | 'missing' | 'unknown' | null>(null);
  const [supported] = useState(() => canRecordAudio());
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const clearRecording = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setUrl(null);
    setSeconds(0);
    setState('idle');
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      recorderRef.current = null;
      releaseStream();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const start = async () => {
    if (!supported || state === 'requesting' || state === 'recording') return;
    clearRecording();
    setError(null);
    setState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const mimeType = preferredRecordingMime();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        releaseStream();
        clearTimer();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        chunksRef.current = [];
        if (!mountedRef.current) return;
        if (blob.size === 0) {
          setState('error');
          setError('unknown');
          return;
        }
        const nextUrl = URL.createObjectURL(blob);
        urlRef.current = nextUrl;
        setUrl(nextUrl);
        setState('ready');
      };
      recorder.onerror = () => {
        releaseStream();
        clearTimer();
        if (mountedRef.current) {
          setState('error');
          setError('unknown');
        }
      };
      recorderRef.current = recorder;
      recorder.start(250);
      setState('recording');
      setSeconds(0);
      timerRef.current = window.setInterval(() => {
        setSeconds((current) => current + 1);
      }, 1000);
    } catch (caught) {
      releaseStream();
      if (!mountedRef.current) return;
      setState('error');
      setError(recordingErrorMessage(caught));
    }
  };

  const stop = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    recorderRef.current = null;
  };

  const errorText =
    error === 'blocked'
      ? t('Microphone access was blocked. Allow it in your browser site settings and try again.')
      : error === 'missing'
        ? t('No microphone was found. You can still practise with the transport above.')
        : t('The recording failed. Try again, or keep practising without recording.');

  return (
    <section className={`panel practice-recorder ${className}`.trim()}>
      <div className="panel-head">
        <div>
          <span className="eyebrow">{t('Listen back')}</span>
          <h2>{label ?? t('Record this pass')}</h2>
        </div>
        <span className={`recorder-state ${state}`}>
          <span className="recorder-dot" aria-hidden="true" />
          {state === 'recording'
            ? t('Recording')
            : state === 'requesting'
              ? t('Asking for the microphone')
              : state === 'ready'
                ? t('Ready to listen')
                : t('Not recording')}
        </span>
      </div>

      {!supported ? (
        <p className="recorder-note">
          {t(
            'This browser cannot record audio. The rest of the practice room still works.',
          )}
        </p>
      ) : (
        <>
          <p className="recorder-note">
            {t(
              'Recording is optional. Your browser asks for microphone access when you press Record. The take stays in this tab, is never uploaded, and is discarded when you leave the page.',
            )}
          </p>

          <div className="recorder-controls">
            <span className="recorder-time" aria-live="polite">
              {formatRecordingTime(seconds)}
            </span>
            {state === 'recording' ? (
              <button type="button" className="button primary small" onClick={stop}>
                <Icon name="pause" size={14} /> {t('Stop recording')}
              </button>
            ) : (
              <button
                type="button"
                className="button secondary small"
                onClick={() => void start()}
                disabled={state === 'requesting'}
              >
                <Icon name="sound" size={14} />
                {state === 'requesting' ? t('Opening microphone…') : t('Record')}
              </button>
            )}
            {(url || state === 'error') && (
              <button type="button" className="button ghost small" onClick={clearRecording}>
                <Icon name="close" size={14} /> {t('Discard')}
              </button>
            )}
          </div>

          {state === 'recording' && (
            <p className="recorder-live" role="status">
              {t('Recording now. Play the whole pass, then press Stop.')}
            </p>
          )}

          {state === 'ready' && url && (
            <div className="recorder-playback">
              <audio controls src={url} aria-label={t('Your recorded take')} />
              <small>{t('This take disappears when you leave the page.')}</small>
            </div>
          )}

          {state === 'error' && (
            <p className="recorder-error" role="alert">
              {errorText}
            </p>
          )}
        </>
      )}
    </section>
  );
}
