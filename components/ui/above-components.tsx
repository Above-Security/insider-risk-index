'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Above Security Design System Components
 * Provides reusable, accessible components with proper contrast ratios
 * and consistent Above brand color application
 */

// ================================
// COLOR CONSTANTS & UTILITIES
// ================================

export const ABOVE_COLORS = {
  // Primary Above Brand Colors
  rose: {
    50: '#FFF5F8',
    100: '#FFEBF0', 
    200: '#FFD6E2',
    300: '#FFC2D4',
    400: '#FF9EB5',
    500: '#FF7A96',
    700: '#FF89A1', // Primary rose
    800: '#E6526B',
    900: '#FF5D78', // Dark rose
  },
  peach: {
    50: '#FFF8F5',
    100: '#FFEDE5',
    200: '#FFD9C7',
    300: '#FFC6A9',
    400: '#FFB38B',
    500: '#FFA06D',
    700: '#FF9C7A', // Primary peach
    800: '#E6713F',
    900: '#FF7E54', // Dark peach
  },
  blue: {
    50: '#F8FBFF',
    100: '#EDF5FF',
    200: '#D6E9FF',
    300: '#BFDDFF',
    400: '#A8D1FF',
    500: '#91C5FF',
    700: '#8CC1FF', // Primary blue (lighter)
    800: '#7AB7FF', // Primary blue (darker)
    900: '#6BAEFF', // Dark blue
  },
  lavender: {
    50: '#FAF8FF',
    100: '#F3F0FF',
    200: '#E6DFFF',
    300: '#DACEFF',
    400: '#CDBDFF',
    500: '#C0ACFF',
    700: '#C8B3FF', // Primary lavender
    800: '#A584FF',
    900: '#B89DFF', // Dark lavender
  },
  // Neutral colors for text and backgrounds
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  }
} as const;

// Semantic color mapping for different UI states
export const SEMANTIC_COLORS = {
  success: ABOVE_COLORS.blue,
  info: ABOVE_COLORS.blue,
  warning: ABOVE_COLORS.peach,
  error: ABOVE_COLORS.rose,
  primary: ABOVE_COLORS.rose,
  secondary: ABOVE_COLORS.blue,
} as const;

// ================================
// BUTTON COMPONENT
// ================================

const aboveButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-above-rose-700 text-white shadow hover:bg-above-rose-900 focus-visible:ring-above-rose-800",
        destructive: "bg-above-rose-900 text-white shadow-sm hover:bg-above-rose-800 focus-visible:ring-above-rose-700",
        outline: "border border-above-rose-300 bg-transparent text-above-rose-800 shadow-sm hover:bg-above-rose-50 hover:text-above-rose-900 focus-visible:ring-above-rose-700",
        secondary: "bg-above-blue-100 text-above-blue-900 shadow-sm hover:bg-above-blue-200 focus-visible:ring-above-blue-700",
        ghost: "text-above-rose-700 hover:bg-above-rose-50 hover:text-above-rose-900 focus-visible:ring-above-rose-700",
        link: "text-above-rose-700 underline-offset-4 hover:underline hover:text-above-rose-900 focus-visible:ring-above-rose-700",
        success: "bg-above-blue-700 text-white shadow hover:bg-above-blue-800 focus-visible:ring-above-blue-600",
        warning: "bg-above-peach-700 text-white shadow hover:bg-above-peach-800 focus-visible:ring-above-peach-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AboveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof aboveButtonVariants> {}

export const AboveButton = React.forwardRef<HTMLButtonElement, AboveButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(aboveButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
AboveButton.displayName = "AboveButton";

// ================================
// BADGE COMPONENT
// ================================

const aboveBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-above-rose-200 bg-above-rose-100 text-above-rose-800 hover:bg-above-rose-200",
        secondary: "border-above-blue-200 bg-above-blue-100 text-above-blue-900 hover:bg-above-blue-200",
        success: "border-above-blue-300 bg-above-blue-200 text-above-blue-900 hover:bg-above-blue-300",
        warning: "border-above-peach-200 bg-above-peach-100 text-above-peach-800 hover:bg-above-peach-200",
        error: "border-above-rose-300 bg-above-rose-200 text-above-rose-900 hover:bg-above-rose-300",
        outline: "border-above-neutral-300 text-above-neutral-700 hover:bg-above-neutral-100",
        motive: "border-above-rose-200 bg-above-rose-100 text-above-rose-800",
        coercion: "border-above-peach-200 bg-above-peach-100 text-above-peach-800", 
        manipulation: "border-above-lavender-200 bg-above-lavender-100 text-above-lavender-800",
        high: "border-above-rose-300 bg-above-rose-200 text-above-rose-900",
        medium: "border-above-peach-300 bg-above-peach-200 text-above-peach-900",
        low: "border-above-blue-300 bg-above-blue-200 text-above-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AboveBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aboveBadgeVariants> {}

export const AboveBadge = React.forwardRef<HTMLDivElement, AboveBadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div className={cn(aboveBadgeVariants({ variant }), className)} ref={ref} {...props} />
    );
  }
);
AboveBadge.displayName = "AboveBadge";

// ================================
// ALERT/INFO BOX COMPONENT
// ================================

const aboveAlertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-above-blue-50 text-above-blue-900 border-above-blue-200 [&>svg]:text-above-blue-700",
        destructive: "bg-above-rose-50 text-above-rose-900 border-above-rose-200 [&>svg]:text-above-rose-700",
        warning: "bg-above-peach-50 text-above-peach-900 border-above-peach-200 [&>svg]:text-above-peach-700",
        success: "bg-above-blue-50 text-above-blue-900 border-above-blue-200 [&>svg]:text-above-blue-700",
        info: "bg-above-blue-50 text-above-blue-900 border-above-blue-200 [&>svg]:text-above-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AboveAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aboveAlertVariants> {}

export const AboveAlert = React.forwardRef<HTMLDivElement, AboveAlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(aboveAlertVariants({ variant }), className)}
      {...props}
    />
  )
);
AboveAlert.displayName = "AboveAlert";

export const AboveAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AboveAlertDescription.displayName = "AboveAlertDescription";

// ================================
// CARD COMPONENT
// ================================

const aboveCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow",
  {
    variants: {
      variant: {
        default: "border-above-neutral-200 bg-white",
        primary: "border-above-rose-200 bg-above-rose-50",
        secondary: "border-above-blue-200 bg-above-blue-50",
        success: "border-above-blue-300 bg-above-blue-100",
        warning: "border-above-peach-200 bg-above-peach-50",
        error: "border-above-rose-300 bg-above-rose-100",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AboveCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aboveCardVariants> {}

export const AboveCard = React.forwardRef<HTMLDivElement, AboveCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(aboveCardVariants({ variant }), className)} {...props} />
  )
);
AboveCard.displayName = "AboveCard";

// ================================
// UTILITY FUNCTIONS
// ================================

export const getCategoryColors = (category: string) => {
  switch (category.toLowerCase()) {
    case 'motive':
      return {
        bg: 'bg-above-rose-100',
        text: 'text-above-rose-900', 
        border: 'border-above-rose-200',
        icon: 'text-above-rose-700'
      };
    case 'coercion':
      return {
        bg: 'bg-above-peach-100',
        text: 'text-above-peach-900',
        border: 'border-above-peach-200', 
        icon: 'text-above-peach-700'
      };
    case 'manipulation':
      return {
        bg: 'bg-above-lavender-100',
        text: 'text-above-lavender-900',
        border: 'border-above-lavender-200',
        icon: 'text-above-lavender-700'
      };
    default:
      return {
        bg: 'bg-above-blue-100',
        text: 'text-above-blue-900',
        border: 'border-above-blue-200',
        icon: 'text-above-blue-700'
      };
  }
};

export const getPriorityColors = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return {
        bg: 'bg-above-rose-100',
        text: 'text-above-rose-900',
        border: 'border-above-rose-200',
        icon: 'text-above-rose-700'
      };
    case 'medium':
      return {
        bg: 'bg-above-peach-100', 
        text: 'text-above-peach-900',
        border: 'border-above-peach-200',
        icon: 'text-above-peach-700'
      };
    case 'low':
      return {
        bg: 'bg-above-blue-100',
        text: 'text-above-blue-900', 
        border: 'border-above-blue-200',
        icon: 'text-above-blue-700'
      };
    default:
      return {
        bg: 'bg-above-neutral-100',
        text: 'text-above-neutral-900',
        border: 'border-above-neutral-200',
        icon: 'text-above-neutral-700'
      };
  }
};

export const getDifficultyColors = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
    case 'beginner':
      return {
        bg: 'bg-above-blue-100',
        text: 'text-above-blue-900',
        border: 'border-above-blue-200',
        icon: 'text-above-blue-700'
      };
    case 'moderate':
    case 'intermediate':
      return {
        bg: 'bg-above-peach-100',
        text: 'text-above-peach-900', 
        border: 'border-above-peach-200',
        icon: 'text-above-peach-700'
      };
    case 'hard':
    case 'advanced':
      return {
        bg: 'bg-above-rose-100',
        text: 'text-above-rose-900',
        border: 'border-above-rose-200',
        icon: 'text-above-rose-700'
      };
    default:
      return {
        bg: 'bg-above-neutral-100',
        text: 'text-above-neutral-900',
        border: 'border-above-neutral-200',
        icon: 'text-above-neutral-700'
      };
  }
};

// ================================
// LOADING SKELETON COMPONENTS
// ================================

export const AboveSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-above-blue-100", className)}
    {...props}
  />
));
AboveSkeleton.displayName = "AboveSkeleton";

// Pre-built skeleton patterns
export const AboveCardSkeleton = () => (
  <div className="space-y-4">
    <AboveSkeleton className="h-4 w-1/3" />
    <AboveSkeleton className="h-20 w-full" />
    <AboveSkeleton className="h-4 w-3/4" />
  </div>
);

export const AboveListSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center space-x-4">
        <AboveSkeleton className="h-4 w-4 rounded-full" />
        <AboveSkeleton className="h-4 flex-1" />
      </div>
    ))}
  </div>
);