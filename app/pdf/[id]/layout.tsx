import { ReactNode } from 'react';

interface PDFLayoutProps {
  children: ReactNode;
}

/**
 * PDF ID Layout - Uses the existing PDF layout for proper styling
 */
export default function PDFIdLayout({ children }: PDFLayoutProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%)',
        overflow: 'auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0F172A',
        lineHeight: 1.6,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* Ensure PDF content is always visible and above everything */
        .pdf-overlay {
          position: relative !important;
          z-index: 999999 !important;
          display: block !important;
        }

        .pdf-container {
          display: block !important;
        }

        .pdf-header {
          display: block !important;
          visibility: visible !important;
        }

        /* Hide website elements when PDF is active */
        body:has(.pdf-overlay) > div:first-child > header,
        body:has(.pdf-overlay) > div:first-child > nav,
        body:has(.pdf-overlay) > div:first-child > main > *:not([style*="position: fixed"]),
        body:has(.pdf-overlay) > div:first-child > footer {
          display: none !important;
        }

        /* PDF-specific styles for isolated layout */
        .pdf-overlay {
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #0F172A;
          background: linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%);
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }

        .pdf-container {
          max-width: 794px;
          margin: 0 auto;
          padding: 48px;
          min-height: 100vh;
        }

        /* Typography */
        .pdf-container h1, .pdf-container h2, .pdf-container h3, .pdf-container h4, .pdf-container h5, .pdf-container h6 {
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 16px;
          display: block;
        }

        .pdf-container h1 { font-size: 36px; line-height: 1.2; }
        .pdf-container h2 { font-size: 30px; line-height: 1.25; }
        .pdf-container h3 { font-size: 24px; line-height: 1.3; }
        .pdf-container h4 { font-size: 20px; line-height: 1.35; }

        .pdf-container p {
          margin-bottom: 16px;
          line-height: 1.6;
          color: #334155;
          display: block;
        }

        .pdf-container span {
          display: inline;
        }

        .pdf-container div {
          display: block;
        }

        /* PDF-specific selectors */
        .pdf-container header {
          display: block;
        }

        .pdf-container .pdf-header {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: white !important;
          padding: 40px 30px;
          margin: -48px -48px 30px -48px;
          border-radius: 0 0 16px 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.7);
          display: block;
        }

        .pdf-container section {
          display: block;
        }

        .pdf-container footer {
          display: block;
        }

        /* Utility classes - using exact values for consistent rendering */
        .pdf-container .text-6xl { font-size: 60px; }
        .pdf-container .text-4xl { font-size: 36px; }
        .pdf-container .text-3xl { font-size: 30px; }
        .pdf-container .text-2xl { font-size: 24px; }
        .pdf-container .text-xl { font-size: 20px; }
        .pdf-container .text-lg { font-size: 18px; }
        .pdf-container .text-base { font-size: 16px; }
        .pdf-container .text-sm { font-size: 14px; }
        .pdf-container .text-xs { font-size: 12px; }

        .pdf-container .font-extrabold { font-weight: 800; }
        .pdf-container .font-bold { font-weight: 700; }
        .pdf-container .font-semibold { font-weight: 600; }
        .pdf-container .font-medium { font-weight: 500; }

        .pdf-container .text-center { text-align: center; }
        .pdf-container .text-right { text-align: right; }
        .pdf-container .text-left { text-align: left; }

        /* Color utilities with high contrast */
        .pdf-container .text-slate-900 { color: #0F172A; }
        .pdf-container .text-slate-800 { color: #1E293B; }
        .pdf-container .text-slate-700 { color: #334155; }
        .pdf-container .text-slate-600 { color: #475569; }
        .pdf-container .text-slate-500 { color: #64748B; }
        .pdf-container .text-white { color: white; }
        .pdf-container .text-green-600 { color: #059669; }
        .pdf-container .text-green-700 { color: #047857; }
        .pdf-container .text-red-600 { color: #dc2626; }
        .pdf-container .text-orange-600 { color: #ea580c; }
        .pdf-container .text-blue-600 { color: #2563eb; }

        .pdf-container .bg-white { background-color: white; }
        .pdf-container .bg-slate-50 { background-color: #F8FAFC; }
        .pdf-container .bg-slate-100 { background-color: #F1F5F9; }
        .pdf-container .bg-green-100 { background-color: #DCFCE7; }
        .pdf-container .bg-blue-100 { background-color: #DBEAFE; }

        /* Layout utilities */
        .pdf-container .flex { display: flex; }
        .pdf-container .inline-block { display: inline-block; }
        .pdf-container .grid { display: grid; }
        .pdf-container .items-center { align-items: center; }
        .pdf-container .items-start { align-items: flex-start; }
        .pdf-container .justify-center { justify-content: center; }
        .pdf-container .justify-between { justify-content: space-between; }
        .pdf-container .gap-1 { gap: 4px; }
        .pdf-container .gap-2 { gap: 8px; }
        .pdf-container .gap-3 { gap: 12px; }
        .pdf-container .gap-4 { gap: 16px; }
        .pdf-container .gap-6 { gap: 24px; }
        .pdf-container .gap-8 { gap: 32px; }
        .pdf-container .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .pdf-container .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

        /* Spacing */
        .pdf-container .p-4 { padding: 16px; }
        .pdf-container .p-6 { padding: 24px; }
        .pdf-container .p-8 { padding: 32px; }
        .pdf-container .px-6 { padding-left: 24px; padding-right: 24px; }
        .pdf-container .py-3 { padding-top: 12px; padding-bottom: 12px; }
        .pdf-container .mb-1 { margin-bottom: 4px; }
        .pdf-container .mb-2 { margin-bottom: 8px; }
        .pdf-container .mb-3 { margin-bottom: 12px; }
        .pdf-container .mb-4 { margin-bottom: 16px; }
        .pdf-container .mb-6 { margin-bottom: 24px; }
        .pdf-container .mb-8 { margin-bottom: 32px; }
        .pdf-container .mt-2 { margin-top: 8px; }
        .pdf-container .mt-4 { margin-top: 16px; }
        .pdf-container .mt-8 { margin-top: 32px; }
        .pdf-container .mt-12 { margin-top: 48px; }

        /* Width/Height */
        .pdf-container .w-4 { width: 16px; }
        .pdf-container .w-6 { width: 24px; }
        .pdf-container .w-8 { width: 32px; }
        .pdf-container .h-4 { height: 16px; }
        .pdf-container .h-6 { height: 24px; }
        .pdf-container .h-8 { height: 32px; }
        .pdf-container .w-3 { width: 12px; }
        .pdf-container .h-3 { height: 12px; }
        .pdf-container .flex-1 { flex: 1; }

        /* Border */
        .pdf-container .border { border: 1px solid #E2E8F0; }
        .pdf-container .border-t { border-top: 1px solid #E2E8F0; }
        .pdf-container .rounded-lg { border-radius: 8px; }
        .pdf-container .rounded-full { border-radius: 9999px; }

        /* Shadow */
        .pdf-container .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

        /* Page break utilities for print */
        .pdf-container .page-break-inside-avoid {
          page-break-inside: avoid;
        }

        .pdf-container .page-break-before {
          page-break-before: always;
        }
      `}} />

      <div className="pdf-overlay">
        <div className="pdf-container">
          {children}
        </div>
      </div>
    </div>
  );
}