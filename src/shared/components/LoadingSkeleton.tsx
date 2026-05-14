/**
 * LoadingSkeleton Component
 * Skeleton loader para melhorar perceived performance
 */

import { COLORS, TRANSITIONS } from '@/core/design-system/tokens';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  className = '',
}: SkeletonProps) {
  const animationStyle = `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: COLORS.neutral[200],
          borderRadius,
          backgroundImage: `linear-gradient(
            90deg,
            ${COLORS.neutral[200]} 0%,
            ${COLORS.neutral[100]} 50%,
            ${COLORS.neutral[200]} 100%
          )`,
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
        }}
        className={className}
      />
    </>
  );
}

interface CardSkeletonProps {
  lines?: number;
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <Skeleton width="60%" height="1.5rem" className="mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '80%' : '100%'}
          height="1rem"
          className="mb-2"
        />
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            borderBottom: `1px solid ${COLORS.neutral[200]}`,
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
}
