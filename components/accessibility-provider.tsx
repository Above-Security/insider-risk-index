'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  announceMessage: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  prefersReducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  setFontSize: () => {},
  announceMessage: () => {},
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', handleMotionChange);

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    contrastQuery.addEventListener('change', handleContrastChange);

    // Load saved font size preference
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large';
    if (savedFontSize) {
      setFontSize(savedFontSize);
      document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
      document.documentElement.classList.add(
        savedFontSize === 'small' ? 'text-sm' : 
        savedFontSize === 'large' ? 'text-lg' : 'text-base'
      );
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  const updateFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(
      size === 'small' ? 'text-sm' : 
      size === 'large' ? 'text-lg' : 'text-base'
    );
  };

  const announceMessage = (message: string) => {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        prefersReducedMotion,
        highContrast,
        fontSize,
        setFontSize: updateFontSize,
        announceMessage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);