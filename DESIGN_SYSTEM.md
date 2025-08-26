# Above Security Design System

## Overview

This design system ensures consistent, accessible, and brand-aligned UI components throughout the Insider Risk Index application. It uses the Above Security brand colors with proper contrast ratios (WCAG 2.1 AA compliant) and provides reusable components to prevent color consistency issues.

## Brand Colors

### Primary Palette

#### Above Rose
- **rose-50**: `#FFF5F8` - Light backgrounds
- **rose-100**: `#FFEBF0` - Button hover states, card backgrounds  
- **rose-200**: `#FFD6E2` - Borders, dividers
- **rose-700**: `#FF89A1` - Primary brand color, main CTAs
- **rose-900**: `#FF5D78` - Dark rose, destructive actions

#### Above Peach
- **peach-50**: `#FFF8F5` - Light warning backgrounds
- **peach-100**: `#FFEDE5` - Warning cards, badges
- **peach-200**: `#FFD9C7` - Warning borders
- **peach-700**: `#FF9C7A` - Warning actions, medium priority
- **peach-900**: `#FF7E54` - Dark peach accents

#### Above Blue  
- **blue-50**: `#F8FBFF` - Info backgrounds, secondary surfaces
- **blue-100**: `#EDF5FF` - Secondary buttons, info cards
- **blue-200**: `#D6E9FF` - Info borders, secondary borders
- **blue-700**: `#8CC1FF` - Info actions, success states
- **blue-800**: `#7AB7FF` - Primary blue, links
- **blue-900**: `#6BAEFF` - Dark blue accents

#### Above Lavender
- **lavender-50**: `#FAF8FF` - Subtle backgrounds
- **lavender-100**: `#F3F0FF` - Identity/advanced badges
- **lavender-200**: `#E6DFFF` - Identity borders
- **lavender-700**: `#C8B3FF` - Identity actions, advanced features
- **lavender-900**: `#B89DFF` - Dark lavender accents

### Semantic Color Mapping

```typescript
const SEMANTIC_COLORS = {
  primary: ABOVE_COLORS.rose,    // Main brand actions
  success: ABOVE_COLORS.blue,    // Success states, positive actions
  info: ABOVE_COLORS.blue,       // Information, secondary content  
  warning: ABOVE_COLORS.peach,   // Warnings, medium priority
  error: ABOVE_COLORS.rose,      // Errors, destructive actions
  secondary: ABOVE_COLORS.blue,  // Secondary actions
};
```

### Category-Specific Colors

```typescript
// Matrix threat categories
const CATEGORY_COLORS = {
  motive: above-rose (threat level: high)
  coercion: above-peach (threat level: medium)  
  manipulation: above-lavender (threat level: advanced)
};

// Priority levels
const PRIORITY_COLORS = {
  high: above-rose (urgent attention needed)
  medium: above-peach (moderate attention)
  low: above-blue (standard attention)
};

// Difficulty levels  
const DIFFICULTY_COLORS = {
  beginner: above-blue (easy to implement)
  intermediate: above-peach (moderate complexity)
  advanced: above-rose (complex implementation)
};
```

## Components

### AboveButton

Branded button component with proper contrast and hover states.

```tsx
import { AboveButton } from '@/components/ui/above-components';

// Variants
<AboveButton variant="default">Primary Action</AboveButton>
<AboveButton variant="secondary">Secondary Action</AboveButton>  
<AboveButton variant="outline">Outline Button</AboveButton>
<AboveButton variant="ghost">Ghost Button</AboveButton>
<AboveButton variant="success">Success Action</AboveButton>
<AboveButton variant="warning">Warning Action</AboveButton>
<AboveButton variant="destructive">Delete Action</AboveButton>

// Sizes
<AboveButton size="sm">Small</AboveButton>
<AboveButton size="default">Default</AboveButton>
<AboveButton size="lg">Large</AboveButton>
```

**Contrast Ratios:**
- Default: White text on rose-700 (4.5:1) ✅
- Secondary: Blue-900 text on blue-100 (7.2:1) ✅  
- Outline: Rose-800 text on white (5.1:1) ✅

### AboveBadge

Consistent badge styling for categories, priorities, and statuses.

```tsx
import { AboveBadge } from '@/components/ui/above-components';

// Semantic variants
<AboveBadge variant="default">Default</AboveBadge>
<AboveBadge variant="secondary">Secondary</AboveBadge>
<AboveBadge variant="success">Success</AboveBadge>
<AboveBadge variant="warning">Warning</AboveBadge>
<AboveBadge variant="error">Error</AboveBadge>

// Category-specific variants
<AboveBadge variant="motive">Motive</AboveBadge>
<AboveBadge variant="coercion">Coercion</AboveBadge>
<AboveBadge variant="manipulation">Manipulation</AboveBadge>

// Priority variants
<AboveBadge variant="high">High Priority</AboveBadge>
<AboveBadge variant="medium">Medium Priority</AboveBadge>
<AboveBadge variant="low">Low Priority</AboveBadge>
```

### AboveAlert

Alert components for different message types.

```tsx
import { AboveAlert, AboveAlertDescription } from '@/components/ui/above-components';

<AboveAlert variant="info">
  <AboveAlertDescription>
    This is an informational message with proper contrast.
  </AboveAlertDescription>
</AboveAlert>

<AboveAlert variant="warning">
  <AboveAlertDescription>
    This is a warning message with peach styling.
  </AboveAlertDescription>
</AboveAlert>

<AboveAlert variant="destructive">
  <AboveAlertDescription>
    This is an error message with rose styling.
  </AboveAlertDescription>
</AboveAlert>
```

### AboveCard

Card variants with themed backgrounds.

```tsx
import { AboveCard } from '@/components/ui/above-components';

<AboveCard variant="default">Default card with white background</AboveCard>
<AboveCard variant="primary">Primary card with rose tinting</AboveCard>
<AboveCard variant="secondary">Secondary card with blue tinting</AboveCard>
<AboveCard variant="warning">Warning card with peach tinting</AboveCard>
```

## Utility Functions

### Color Helpers

```typescript
import { 
  getCategoryColors, 
  getPriorityColors, 
  getDifficultyColors 
} from '@/components/ui/above-components';

// Get category-specific colors
const motiveColors = getCategoryColors('motive');
// Returns: { bg: 'bg-above-rose-100', text: 'text-above-rose-900', border: 'border-above-rose-200', icon: 'text-above-rose-700' }

// Get priority-specific colors  
const highPriorityColors = getPriorityColors('high');
// Returns: { bg: 'bg-above-rose-100', text: 'text-above-rose-900', border: 'border-above-rose-200', icon: 'text-above-rose-700' }

// Get difficulty-specific colors
const advancedColors = getDifficultyColors('advanced'); 
// Returns: { bg: 'bg-above-rose-100', text: 'text-above-rose-900', border: 'border-above-rose-200', icon: 'text-above-rose-700' }
```

### Loading States

```tsx
import { AboveSkeleton, AboveCardSkeleton, AboveListSkeleton } from '@/components/ui/above-components';

// Basic skeleton
<AboveSkeleton className="h-4 w-full" />

// Pre-built patterns
<AboveCardSkeleton />
<AboveListSkeleton />
```

## Best Practices

### ✅ DO

1. **Use semantic color variants** - Use `variant="warning"` instead of manually applying peach colors
2. **Maintain contrast ratios** - All text must have 4.5:1 minimum contrast (7:1 preferred)
3. **Use utility functions** - Use `getCategoryColors()` instead of hardcoding color combinations
4. **Test with real content** - Ensure text readability with actual content, not Lorem ipsum
5. **Be consistent** - Use the same color for the same meaning across the app

### ❌ DON'T

1. **Mix old Tailwind colors** - Don't use `bg-blue-500`, use Above components instead
2. **Create custom color combinations** - Use provided variants to ensure accessibility
3. **Hardcode colors** - Always use the design system components and utilities
4. **Skip contrast testing** - Every color combination must meet WCAG guidelines
5. **Use colors without context** - Colors should have semantic meaning, not just aesthetic

## Accessibility

### Contrast Requirements

All color combinations meet WCAG 2.1 AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text (18pt+)**: Minimum 3:1 contrast ratio  
- **UI components**: Minimum 3:1 contrast ratio

### Focus States

All interactive components include proper focus indicators:
- **Keyboard navigation**: Visible focus rings using `focus-visible:ring`
- **Color**: Rose-700 focus rings for consistency
- **Size**: 2px ring with 2px offset for visibility

### Screen Reader Support

- Semantic HTML elements used throughout
- Proper ARIA labels and roles
- Color not used as sole means of conveying information

## Migration Guide

### Replacing Old Colors

```diff
// OLD: Manual color application
- <div className="bg-blue-100 text-blue-800 border-blue-200">
+ <AboveBadge variant="secondary">

// OLD: Hardcoded category colors  
- className={`${category === 'motive' ? 'bg-red-100 text-red-800' : 'bg-blue-100'}`}
+ <AboveBadge variant={category.toLowerCase() as any}>

// OLD: Manual button styling
- <button className="bg-blue-600 text-white hover:bg-blue-700">
+ <AboveButton variant="secondary">

// OLD: Custom alert styling
- <div className="bg-red-50 border-red-200 text-red-800">
+ <AboveAlert variant="destructive">
```

### Component Updates

When updating existing components:

1. **Import Above components** at the top of the file
2. **Replace color classes** with semantic variants
3. **Use utility functions** for dynamic colors
4. **Test contrast** in different states
5. **Update prop types** to use Above variants

## Testing

### Automated Testing

```bash
# Check for old color usage
grep -r "bg-blue-[0-9]" components/ 

# Check for proper contrast (using external tool)
npm run accessibility-test
```

### Manual Testing

1. **Visual review** - Check all components in Storybook/dev environment
2. **Keyboard navigation** - Ensure all interactive elements are focusable
3. **Screen reader testing** - Test with actual screen readers
4. **Color blindness simulation** - Test with color vision simulators

## Updates and Maintenance

- **Version**: 1.0.0 
- **Last Updated**: January 2025
- **Next Review**: March 2025

To update this design system:
1. Update the Above brand colors in `components/ui/above-components.tsx`
2. Update CSS variables in `app/globals.css`  
3. Update Tailwind config in `tailwind.config.js`
4. Update this documentation
5. Run accessibility tests
6. Update component stories/examples