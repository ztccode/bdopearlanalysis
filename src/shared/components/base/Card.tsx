/**
 * Card Component Base
 * Componente reutilizável para cards
 */

import { ReactNode } from 'react';
import { COLORS, SHADOWS, BORDER_RADIUS } from '@/core/design-system/tokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

const VARIANT_STYLES = {
  default: {
    bg: COLORS.neutral[50],
    shadow: SHADOWS.base,
    border: 'none',
  },
  elevated: {
    bg: COLORS.neutral[50],
    shadow: SHADOWS.lg,
    border: 'none',
  },
  outlined: {
    bg: COLORS.neutral[50],
    shadow: SHADOWS.none,
    border: `1px solid ${COLORS.neutral[200]}`,
  },
};

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <div
      style={{
        backgroundColor: style.bg,
        boxShadow: style.shadow,
        border: style.border,
        borderRadius: BORDER_RADIUS.lg,
        padding: '1.5rem',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }} className={className}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p style={{ fontSize: '0.875rem', color: COLORS.neutral[600] }} className={className}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
