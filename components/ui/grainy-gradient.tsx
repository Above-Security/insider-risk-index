import { cn } from "@/lib/utils";

interface GrainyGradientProps {
  variant?: 'hero' | 'cta' | 'subtle';
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function GrainyGradient({ 
  variant = 'subtle', 
  className, 
  children, 
  asChild = false 
}: GrainyGradientProps) {
  const gradientClass = `grainy-gradient-${variant}`;
  
  if (asChild) {
    return (
      <div className={cn(gradientClass, className)}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={cn(gradientClass, className)}>
      {children}
    </div>
  );
}

// Utility function for checking if a gradient should be applied
export function getGradientVariant(type: 'hero' | 'cta' | 'card' | 'background'): 'hero' | 'cta' | 'subtle' {
  switch (type) {
    case 'hero':
      return 'hero';
    case 'cta':
      return 'cta'; 
    case 'card':
    case 'background':
    default:
      return 'subtle';
  }
}