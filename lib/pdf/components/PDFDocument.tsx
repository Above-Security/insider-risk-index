import React from 'react';
import { BRAND_COLORS } from '../styles';

interface PDFDocumentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * PDFDocument - Content wrapper for PDF pages
 * Uses dangerouslySetInnerHTML for server-side compatible styling
 */
export function PDFDocument({ title, children, className = '' }: PDFDocumentProps) {
  const pdfStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: ${BRAND_COLORS.slate[900]};
      background: linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      max-width: 794px;
      margin: 0 auto;
      padding: 48px;
      background: linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%);
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      color: ${BRAND_COLORS.slate[900]};
      margin-bottom: 16px;
    }

    h1 { font-size: 36px; line-height: 1.2; }
    h2 { font-size: 30px; line-height: 1.25; }
    h3 { font-size: 24px; line-height: 1.3; }
    h4 { font-size: 20px; line-height: 1.35; }
    h5 { font-size: 18px; line-height: 1.4; }
    h6 { font-size: 16px; line-height: 1.4; }

    p {
      margin-bottom: 16px;
      line-height: 1.6;
      color: ${BRAND_COLORS.slate[700]};
    }

    /* PDF-specific selectors */
    .pdf-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white !important;
      padding: 40px 30px;
      margin: -48px -48px 30px -48px;
      border-radius: 0 0 16px 16px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.7);
    }

    .pdf-score {
      margin: 24px 0;
    }

    .text-6xl { font-size: 60px; }
    .text-5xl { font-size: 48px; }
    .text-4xl { font-size: 36px; }
    .text-3xl { font-size: 30px; }
    .text-2xl { font-size: 24px; }
    .text-xl { font-size: 20px; }
    .text-lg { font-size: 18px; }
    .text-base { font-size: 16px; }
    .text-sm { font-size: 14px; }
    .text-xs { font-size: 12px; }

    .font-extrabold { font-weight: 800; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }

    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }

    /* Color utilities */
    .text-slate-900 { color: ${BRAND_COLORS.slate[900]}; }
    .text-slate-800 { color: ${BRAND_COLORS.slate[800]}; }
    .text-slate-700 { color: ${BRAND_COLORS.slate[700]}; }
    .text-slate-600 { color: ${BRAND_COLORS.slate[600]}; }
    .text-slate-500 { color: ${BRAND_COLORS.slate[500]}; }
    .text-white { color: white; }
    .text-green-600 { color: #059669; }
    .text-green-700 { color: #047857; }
    .text-red-600 { color: #dc2626; }
    .text-orange-600 { color: #ea580c; }

    .bg-white { background-color: white; }
    .bg-slate-50 { background-color: ${BRAND_COLORS.slate[50]}; }
    .bg-green-500 { background-color: #10b981; }
    .bg-orange-500 { background-color: #f59e0b; }
    .bg-red-500 { background-color: #ef4444; }
    .bg-yellow-500 { background-color: #eab308; }

    /* Layout utilities */
    .flex { display: flex; }
    .inline-block { display: inline-block; }
    .grid { display: grid; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .gap-1 { gap: 4px; }
    .gap-2 { gap: 8px; }
    .gap-4 { gap: 16px; }
    .gap-8 { gap: 32px; }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }

    /* Spacing */
    .p-4 { padding: 16px; }
    .p-6 { padding: 24px; }
    .px-6 { padding-left: 24px; padding-right: 24px; }
    .py-3 { padding-top: 12px; padding-bottom: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-8 { margin-top: 32px; }
    .mr-2 { margin-right: 8px; }
    .mr-3 { margin-right: 12px; }
    .mr-4 { margin-right: 16px; }
    .space-y-2 > * + * { margin-top: 8px; }
    .space-y-4 > * + * { margin-top: 16px; }

    /* Width/Height */
    .w-4 { width: 16px; }
    .w-5 { width: 20px; }
    .w-6 { width: 24px; }
    .w-8 { width: 32px; }
    .h-4 { height: 16px; }
    .h-5 { height: 20px; }
    .h-6 { height: 24px; }
    .h-8 { height: 32px; }
    .w-2 { width: 8px; }
    .h-2 { height: 8px; }
    .flex-1 { flex: 1; }
    .flex-shrink-0 { flex-shrink: 0; }

    /* Border */
    .border { border: 1px solid ${BRAND_COLORS.slate[200]}; }
    .border-t { border-top: 1px solid ${BRAND_COLORS.slate[200]}; }
    .rounded-full { border-radius: 9999px; }
    .rounded-lg { border-radius: 8px; }

    /* Shadow */
    .shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

    @media print {
      body {
        margin: 0;
        padding: 15px;
        background: white !important;
      }

      .page-break-before {
        page-break-before: always;
      }

      .page-break-inside-avoid {
        page-break-inside: avoid;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pdfStyles }} />
      <div className={`pdf-container ${className}`}>
        {children}
      </div>
    </>
  );
}

export default PDFDocument;