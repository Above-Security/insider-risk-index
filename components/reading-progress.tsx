'use client';

import { useEffect } from 'react';

interface ReadingProgressProps {
  readTime?: string;
}

export function ReadingProgress({ readTime = '15' }: ReadingProgressProps) {
  useEffect(() => {
    function updateScrollProgress() {
      const progressBar = document.getElementById('reading-progress');
      const progressText = document.getElementById('progress-percentage');
      
      if (!progressBar || !progressText) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) : 0;
      const percentage = Math.min(Math.max(Math.round(progress * 100), 0), 100);
      
      progressBar.style.width = percentage + '%';
      progressText.textContent = percentage + '%';
      
      // Change color when complete
      if (percentage === 100) {
        progressBar.className = 'bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out';
      } else {
        progressBar.className = 'bg-gradient-to-r from-above-blue-600 to-above-rose-600 h-2 rounded-full transition-all duration-500 ease-out';
      }
    }
    
    // Throttled scroll handler
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial update
    updateScrollProgress();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-t border-slate-200">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-600">
          <span>Reading Progress</span>
          <div className="flex items-center gap-2">
            <span id="progress-percentage">0%</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            id="reading-progress" 
            className="bg-gradient-to-r from-above-blue-600 to-above-rose-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{width: '0%'}}
          ></div>
        </div>
      </div>
    </div>
  );
}