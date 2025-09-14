import React from 'react';
import { BRAND_COLORS } from '../styles';

interface PDFSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  pageBreak?: 'before' | 'after' | 'avoid' | 'none';
  borderColor?: string;
  background?: 'white' | 'gradient' | 'transparent';
}

/**
 * PDFSection - Reusable section wrapper for PDF content
 * Provides consistent spacing, typography, and optional page breaks
 */
export function PDFSection({
  title,
  subtitle,
  children,
  className = '',
  pageBreak = 'none',
  borderColor = BRAND_COLORS.primary,
  background = 'transparent'
}: PDFSectionProps) {
  const pageBreakClass = {
    'before': 'page-break-before',
    'after': 'page-break-after',
    'avoid': 'no-page-break',
    'none': ''
  }[pageBreak];

  const backgroundClass = {
    'white': 'bg-white border rounded-lg shadow-sm p-6',
    'gradient': 'bg-gradient border rounded-lg shadow-sm p-6',
    'transparent': ''
  }[background];

  return (
    <section
      className={`pdf-section mb-8 ${pageBreakClass} ${backgroundClass} ${className}`}
      style={background === 'gradient' ? {
        background: 'linear-gradient(135deg, #FAF8FF 0%, #F8FBFF 100%)'
      } : undefined}
    >
      {title && (
        <div className="section-header mb-6">
          <h2
            className="section-title text-2xl font-bold mb-2"
            style={{
              color: BRAND_COLORS.slate[800],
              borderLeft: `4px solid ${borderColor}`,
              paddingLeft: '16px'
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="section-subtitle text-base"
              style={{
                color: BRAND_COLORS.slate[600],
                marginLeft: '20px' // Align with title text after border
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

interface PDFCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

/**
 * PDFCard - Card component for grouping related content
 */
export function PDFCard({
  children,
  className = '',
  padding = 'md',
  variant = 'default'
}: PDFCardProps) {
  const paddingClass = {
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8'
  }[padding];

  const variantStyles = {
    'default': {
      backgroundColor: BRAND_COLORS.white,
      borderColor: BRAND_COLORS.slate[200]
    },
    'primary': {
      backgroundColor: BRAND_COLORS.primary + '10', // 10% opacity
      borderColor: BRAND_COLORS.primary
    },
    'success': {
      backgroundColor: BRAND_COLORS.success + '10',
      borderColor: BRAND_COLORS.success
    },
    'warning': {
      backgroundColor: BRAND_COLORS.warning + '10',
      borderColor: BRAND_COLORS.warning
    },
    'error': {
      backgroundColor: BRAND_COLORS.error + '10',
      borderColor: BRAND_COLORS.error
    }
  }[variant];

  return (
    <div
      className={`pdf-card border rounded-lg shadow-sm ${paddingClass} ${className}`}
      style={{
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor
      }}
    >
      {children}
    </div>
  );
}

interface PDFGridProps {
  children: React.ReactNode;
  columns: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PDFGrid - Grid layout component for responsive content
 */
export function PDFGrid({
  children,
  columns,
  gap = 'md',
  className = ''
}: PDFGridProps) {
  const gapClass = {
    'sm': 'gap-4',
    'md': 'gap-6',
    'lg': 'gap-8'
  }[gap];

  const colsClass = `grid-cols-${columns}`;

  return (
    <div className={`pdf-grid grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

interface PDFFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PDFFlexBox - Flexbox layout component
 */
export function PDFFlexBox({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  className = ''
}: PDFFlexProps) {
  const directionClass = direction === 'col' ? 'flex-col' : 'flex-row';
  const alignClass = `items-${align}`;
  const justifyClass = justify === 'between' ? 'justify-between' : `justify-${justify}`;
  const gapClass = {
    'sm': 'gap-4',
    'md': 'gap-6',
    'lg': 'gap-8'
  }[gap];

  return (
    <div className={`pdf-flex flex ${directionClass} ${alignClass} ${justifyClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

export default PDFSection;