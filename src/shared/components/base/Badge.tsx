/**
 * Badge Component Base
 * Componente reutilizável para badges
 */

import { ReactNode } from 'react';
import { COLORS, TYPOGRAPHY } from '@/core/design-system/tokens';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VARIANT_STYLES = {
  default: {
    bg: COLORS.neutral[200],
    text: COLORS.neutral[900],
  },
  success: {
    bg: `${COLORS.success}20`,
    text: COLORS.success,
  },
  warning: {
    bg: `${COLORS.warning}20`,
    text: COLORS.warning,
  },
  error: {
    bg: `${COLORS.error}20`,
    text: COLORS.error,
  },
  info: {
    bg: `${COLORS.info}20`,
    text: COLORS.info,
  },
};

const SIZE_STYLES = {
  sm: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    padding: '0.25rem 0.5rem',
  },
  md: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    padding: '0.375rem 0.75rem',
  },
  lg: {
    fontSize: TYPOGRAPHY.fontSize.base,
    padding: '0.5rem 1rem',
  },
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <span
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        fontSize: sizeStyle.fontSize,
        padding: sizeStyle.padding,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        borderRadius: '0.25rem',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
      className={className}
    >
      {children}
    </span>
  );
}
