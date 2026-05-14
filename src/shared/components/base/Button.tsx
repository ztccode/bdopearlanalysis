/**
 * Button Component Base
 * Componente reutilizável para botões com variantes
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { COLORS, TYPOGRAPHY, TRANSITIONS } from '@/core/design-system/tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

const VARIANT_STYLES = {
  primary: {
    bg: COLORS.accent[500],
    text: '#ffffff',
    hover: COLORS.accent[600],
    border: 'none',
  },
  secondary: {
    bg: COLORS.primary[500],
    text: '#ffffff',
    hover: COLORS.primary[600],
    border: 'none',
  },
  outline: {
    bg: 'transparent',
    text: COLORS.primary[500],
    hover: COLORS.primary[50],
    border: `2px solid ${COLORS.primary[500]}`,
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.neutral[700],
    hover: COLORS.neutral[100],
    border: 'none',
  },
  danger: {
    bg: COLORS.error,
    text: '#ffffff',
    hover: '#dc2626',
    border: 'none',
  },
};

const SIZE_STYLES = {
  sm: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    padding: '0.5rem 1rem',
    minHeight: '32px',
  },
  md: {
    fontSize: TYPOGRAPHY.fontSize.base,
    padding: '0.75rem 1.5rem',
    minHeight: '40px',
  },
  lg: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    padding: '1rem 2rem',
    minHeight: '48px',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <button
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        border: variantStyle.border,
        fontSize: sizeStyle.fontSize,
        padding: sizeStyle.padding,
        minHeight: sizeStyle.minHeight,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: TRANSITIONS.base,
        borderRadius: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantStyle.bg;
      }}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading && <span>⏳</span>}
      {icon && !isLoading && icon}
      {children}
    </button>
  );
}
