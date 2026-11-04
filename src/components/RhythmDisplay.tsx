import { useI18n } from '../lib/i18n';
import type { RhythmItem } from '../lib/music';

function NoteGlyph({ x, y, item }: { x: number; y: number; item: RhythmItem }) {
  if (item.rest) {
    return (
      <g className="rhythm-rest">
        <path
          d={`M ${x - 4} ${y - 16} q 10 8 0 14 q 12 6 2 18 l -8 -10`}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    );
  }
  const hollow = item.beats >= 2;
  const hasStem = item.beats < 4;
  const isEighth = item.beats <= 0.5;
  return (
    <g>
      <ellipse
        cx={x}
        cy={y}
        rx={10}
        ry={7.2}
        transform={`rotate(-16 ${x} ${y})`}
        fill={hollow ? 'none' : 'currentColor'}
        stroke="currentColor"
        strokeWidth={2.2}
      />
      {hasStem && (
        <line x1={x + 8.6} x2={x + 8.6} y1={y - 1} y2={y - 48} stroke="currentColor" strokeWidth={2.2} />
      )}
      {isEighth && (
        <path
          d={`M ${x + 8.6} ${y - 48} q 14 6 10 20`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      )}
      {item.dotted && <circle cx={x + 19} cy={y - 4} r={3.4} fill="currentColor" />}
    </g>
  );
}

export default function RhythmDisplay({
  items,
  className = '',
  compact = false,
  barEvery = 0,
}: {
  items: RhythmItem[];
  className?: string;
  compact?: boolean;
  barEvery?: number;
}) {
  const { t } = useI18n();
  const total = items.reduce((sum, item) => sum + Math.abs(item.beats), 0);
  const width = compact
    ? Math.max(240, total * 40 + 56)
    : total >= 5
      ? 640
      : total >= 4
        ? 580
        : total >= 3
          ? 480
          : 400;
  const height = compact ? 96 : 150;
  const startX = compact ? 28 : 48;
  const usable = width - startX * 2;
  const beatWidth = usable / Math.max(total, 1);
  const y = compact ? 66 : 92;
  const barLines: number[] = [];
  if (barEvery > 0) {
    for (let beat = barEvery; beat < total; beat += barEvery) {
      barLines.push(startX + beat * beatWidth);
    }
    barLines.push(startX + total * beatWidth);
  }
  let cursor = 0;

  return (
    <svg
      className={`rhythm-display ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={t('Rhythm notation')}
    >
      <line x1={startX - 20} x2={width - startX + 20} y1={y} y2={y} className="rhythm-line" />
      {barLines.map((x) => (
        <line key={`bar-${x}`} x1={x} x2={x} y1={y - 34} y2={y + 14} className="rhythm-line barline" />
      ))}
      {items.map((item, index) => {
        const center = startX + (cursor + Math.abs(item.beats) / 2) * beatWidth;
        cursor += Math.abs(item.beats);
        return <NoteGlyph key={index} x={center} y={y} item={item} />;
      })}
    </svg>
  );
}
