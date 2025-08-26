// Systematic layout utilities for consistent spacing and grids

export const LAYOUT_CONSTANTS = {
  // Container widths
  container: {
    xs: 'max-w-sm',      // 384px
    sm: 'max-w-2xl',     // 672px  
    md: 'max-w-4xl',     // 896px
    lg: 'max-w-6xl',     // 1152px
    xl: 'max-w-7xl',     // 1280px
    full: 'max-w-full',
  },
  
  // Standardized spacing scale
  spacing: {
    section: {
      xs: 'py-8',        // 32px
      sm: 'py-12',       // 48px
      md: 'py-16',       // 64px
      lg: 'py-20',       // 80px
      xl: 'py-24',       // 96px
    },
    
    element: {
      xs: 'mb-4',        // 16px
      sm: 'mb-6',        // 24px
      md: 'mb-8',        // 32px
      lg: 'mb-12',       // 48px
      xl: 'mb-16',       // 64px
    },
    
    responsive: {
      xs: 'px-4',                    // Mobile: 16px
      sm: 'px-4 sm:px-6',           // Small: 16px → 24px
      md: 'px-4 sm:px-6 lg:px-8',   // Full responsive: 16px → 24px → 32px
    },
  },
  
  // Grid systems with consistent breakpoints
  grids: {
    // Card grids (most common)
    cards: {
      '1-2-3': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
      '1-2-4': 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4', 
      '1-3-4': 'grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4',
      '2-4-6': 'grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6',
    },
    
    // Content grids
    content: {
      '1-2': 'grid grid-cols-1 gap-8 lg:grid-cols-2',
      '1-3': 'grid grid-cols-1 gap-8 md:grid-cols-3',
      '2-3': 'grid grid-cols-2 gap-6 md:grid-cols-3',
      sidebar: 'grid grid-cols-1 gap-8 lg:grid-cols-4', // 3:1 ratio content:sidebar
    },
    
    // Stats/metrics grids  
    metrics: {
      '2-4': 'grid grid-cols-2 gap-4 md:grid-cols-4',
      '1-3-5': 'grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5',
    },
  },
  
  // Gaps for different contexts
  gaps: {
    tight: 'gap-3',      // 12px - for buttons, tags
    normal: 'gap-6',     // 24px - for cards, content blocks
    loose: 'gap-8',      // 32px - for major sections
    wide: 'gap-12',      // 48px - for page sections
  },
} as const;

// Utility functions
export function getContainerClass(size: keyof typeof LAYOUT_CONSTANTS.container) {
  return LAYOUT_CONSTANTS.container[size];
}

export function getSectionSpacing(size: keyof typeof LAYOUT_CONSTANTS.spacing.section) {
  return LAYOUT_CONSTANTS.spacing.section[size];
}

export function getGridClass(type: keyof typeof LAYOUT_CONSTANTS.grids, variant: string) {
  return (LAYOUT_CONSTANTS.grids[type] as Record<string, string>)[variant];
}

// Page layout wrapper utility
export function getPageLayout(containerSize: keyof typeof LAYOUT_CONSTANTS.container = 'xl') {
  return `mx-auto ${LAYOUT_CONSTANTS.container[containerSize]} ${LAYOUT_CONSTANTS.spacing.responsive.md}`;
}

// Section layout wrapper utility  
export function getSectionLayout(spacing: keyof typeof LAYOUT_CONSTANTS.spacing.section = 'md') {
  return `${LAYOUT_CONSTANTS.spacing.section[spacing]}`;
}