import { ReactNode } from 'react';

interface PDFLayoutProps {
  children: ReactNode;
}

/**
 * PDF ID Layout - Simple layout that uses normal Tailwind CSS
 */
export default function PDFIdLayout({ children }: PDFLayoutProps) {
  return children;
}