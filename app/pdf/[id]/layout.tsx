import { ReactNode } from 'react';

interface PDFLayoutProps {
  children: ReactNode;
}

/**
 * PDF ID Layout - Uses normal Next.js nested layout (no html/body tags)
 */
export default function PDFIdLayout({ children }: PDFLayoutProps) {
  return children;
}