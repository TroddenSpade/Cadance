import type { ReactNode } from 'react';

export default function ProgressRing({
  percent,
  children,
  className = '',
}: {
  percent: number;
  children: ReactNode;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`ring ${className}`}
      style={{ background: `conic-gradient(var(--accent) ${clamped * 3.6}deg, rgba(255,255,255,0.075) 0deg)` }}
    >
      <div className="ring-inner">{children}</div>
    </div>
  );
}
