import { ReactNode } from 'react';

interface PDFLayoutProps {
  children: ReactNode;
}

/**
 * PDF ID Layout - Uses the existing PDF layout for proper styling
 */
export default function PDFIdLayout({ children }: PDFLayoutProps) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            padding: 20px;
            font-family: Inter, system-ui, sans-serif;
            line-height: 1.6;
            color: #1E293B;
            background: white;
          }
          @media print {
            body { padding: 0; }
            .page-break { page-break-before: always; }
          }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}