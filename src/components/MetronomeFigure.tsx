import { useId } from 'react';
import { MAX_BPM, MIN_BPM } from '../lib/metronome';

interface MetronomeFigureProps {
  bpm: number;
  running: boolean;
  /** Flashes the cabinet edge on the downbeat. */
  accented?: boolean;
  className?: string;
}

const PIVOT_Y = 250;
/** Distance from the pivot when the tempo is slowest: the weight rides high. */
const WEIGHT_FAR = 182;
/** Distance from the pivot at the fastest tempo: the weight sits near the base. */
const WEIGHT_NEAR = 52;

const SCALE_TICKS = Array.from({ length: 24 }, (_, index) => MIN_BPM + index * 10);
const SCALE_LABELS = [40, 60, 80, 100, 120, 140, 160, 180, 200, 220];

function weightDistance(bpm: number): number {
  const safe = Number.isFinite(bpm) ? bpm : 72;
  const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, safe));
  const progress = (clamped - MIN_BPM) / (MAX_BPM - MIN_BPM);
  return WEIGHT_FAR - (WEIGHT_FAR - WEIGHT_NEAR) * progress;
}

/** Vertical position of a tempo on the printed scale. */
function scaleY(bpm: number): number {
  return PIVOT_Y - weightDistance(bpm);
}

/** Exposed for tests and tooling: where the brass weight sits for a tempo. */
export function weightYForTempo(bpm: number): number {
  return scaleY(bpm);
}

/**
 * A mechanical metronome: tapered cabinet, printed tempo scale, swinging rod,
 * and a brass weight that slides along the scale as the tempo changes. Slow
 * tempos leave the weight high on the rod; fast tempos move it down toward the
 * pivot, exactly like the real instrument.
 */
export default function MetronomeFigure({
  bpm,
  running,
  accented = false,
  className = '',
}: MetronomeFigureProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const weightY = scaleY(bpm);
  const nearestLabel = SCALE_LABELS.reduce(
    (best, value) => (Math.abs(value - bpm) < Math.abs(best - bpm) ? value : best),
    SCALE_LABELS[0],
  );

  return (
    <svg
      className={`metronome-figure ${running ? 'running' : ''} ${accented ? 'accented' : ''} ${className}`.trim()}
      viewBox="0 0 220 300"
      role="img"
      aria-label={`Mechanical metronome at ${bpm} beats per minute`}
    >
      <defs>
        <linearGradient id={`${uid}-cabinet`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2d323d" />
          <stop offset="0.38" stopColor="#1b1f27" />
          <stop offset="1" stopColor="#0a0c10" />
        </linearGradient>
        <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262b34" />
          <stop offset="0.6" stopColor="#191d24" />
          <stop offset="1" stopColor="#101319" />
        </linearGradient>
        <linearGradient id={`${uid}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8dfa6" />
          <stop offset="0.45" stopColor="#e8b568" />
          <stop offset="1" stopColor="#a9752e" />
        </linearGradient>
        <linearGradient
          id={`${uid}-rod`}
          gradientUnits="userSpaceOnUse"
          x1="108"
          y1="0"
          x2="112"
          y2="0"
        >
          <stop offset="0" stopColor="#77746c" />
          <stop offset="0.5" stopColor="#e4ded0" />
          <stop offset="1" stopColor="#8c8880" />
        </linearGradient>
        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#242933" />
          <stop offset="1" stopColor="#090b0e" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="291" rx="86" ry="5" fill="#000" opacity="0.4" />
      <rect x="40" y="280" width="24" height="9" rx="3" fill="#090b0e" />
      <rect x="156" y="280" width="24" height="9" rx="3" fill="#090b0e" />

      <path
        className="metronome-figure-shell"
        d="M74 28 L146 28 Q152 28 153 34 L188 262 Q190 272 180 272 L40 272 Q30 272 32 262 L67 34 Q68 28 74 28 Z"
        fill={`url(#${uid}-cabinet)`}
        stroke="rgba(240, 236, 228, 0.12)"
        strokeWidth="1"
      />
      <path
        d="M74 34 L67 258"
        stroke="rgba(255, 255, 255, 0.07)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="68" y="23" width="84" height="7" rx="3.5" fill={`url(#${uid}-brass)`} opacity="0.7" />

      <path
        d="M80 40 L140 40 Q145 40 146 45 L176 254 Q177 260 171 260 L49 260 Q43 260 44 254 L74 45 Q75 40 80 40 Z"
        fill={`url(#${uid}-face)`}
        stroke="rgba(240, 236, 228, 0.08)"
        strokeWidth="1"
      />

      <rect x="102" y="42" width="16" height="200" rx="8" fill="#07090c" stroke="rgba(240, 236, 228, 0.07)" strokeWidth="1" />
      <rect x="104" y="44" width="4" height="196" rx="2" fill="rgba(255, 255, 255, 0.035)" />

      {SCALE_TICKS.map((tick) => {
        const labelled = SCALE_LABELS.includes(tick);
        const y = scaleY(tick);
        const active = labelled && tick === nearestLabel;
        return (
          <g key={tick}>
            <line
              x1="119"
              x2={labelled ? 126 : 123}
              y1={y}
              y2={y}
              stroke={active ? '#e8b568' : labelled ? '#8f8b82' : '#55524c'}
              strokeWidth={labelled ? 0.9 : 0.7}
            />
            {labelled && (
              <text
                x="128.5"
                y={y + 2.3}
                fill={active ? '#e8b568' : '#8f8b82'}
                fontSize="7.1"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight={active ? 700 : 500}
                letterSpacing="0.2"
              >
                {tick}
              </text>
            )}
          </g>
        );
      })}

      <g
        className="metronome-figure-rod"
        style={{ animationDuration: `${60 / Math.max(1, bpm)}s` }}
      >
        <rect
          x="108.7"
          y="36"
          width="2.6"
          height="214"
          rx="1.3"
          fill={`url(#${uid}-rod)`}
        />
        <circle cx="110" cy="36" r="2.2" fill="#d9d3c4" />
        <g
          className="metronome-figure-weight"
          style={{ transform: `translate(110px, ${weightY}px)` }}
        >
          <rect x="-15" y="-6.5" width="30" height="13" rx="2.5" fill={`url(#${uid}-brass)`} stroke="#7c551f" strokeWidth="0.6" />
          <rect x="-12.5" y="-4.6" width="25" height="2.6" rx="1.3" fill="#fff" opacity="0.22" />
          <rect x="-8" y="-1" width="16" height="2" rx="1" fill="#000" opacity="0.28" />
        </g>
      </g>

      <circle cx="110" cy="250" r="6" fill="#0d0f13" stroke={`url(#${uid}-brass)`} strokeWidth="1.2" />
      <circle cx="110" cy="250" r="2.2" fill="#c99a52" />

      <rect x="28" y="265" width="164" height="14" rx="5" fill={`url(#${uid}-base)`} stroke="rgba(240, 236, 228, 0.12)" strokeWidth="1" />
    </svg>
  );
}
