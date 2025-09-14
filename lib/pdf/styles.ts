/**
 * PDF CSS Styles - Brand Design System for PDF generation
 * Above Security branding with #FF89A1 primary color
 * Extracted from generators.ts for better maintainability and reusability
 */

// Brand Design System Constants
export const BRAND_COLORS = {
  // Above brand colors
  primary: '#FF89A1',        // above-rose-700 - Primary brand color
  primaryDark: '#E85A7B',    // Darker variant for hover states
  primaryLight: '#FFB3C6',   // Lighter variant for backgrounds

  // Supporting colors from design system
  blue: {
    50: '#EBF5FF',
    100: '#DBEAFE',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A'
  },

  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000'
} as const;

// Pillar color mapping (matching the existing design system)
export const PILLAR_COLORS = {
  visibility: BRAND_COLORS.blue[600],
  'prevention-coaching': BRAND_COLORS.primary,
  coaching: BRAND_COLORS.primary,
  'investigation-evidence': '#8B5CF6', // Purple
  evidence: '#8B5CF6', // Purple
  'identity-saas': '#06B6D4',          // Cyan
  identity: '#06B6D4',          // Cyan
  'phishing-resilience': '#10B981',     // Green
  phishing: '#10B981'     // Green
} as const;

// Risk level color mapping
export const RISK_LEVEL_COLORS = {
  1: BRAND_COLORS.error,    // Critical - Red
  2: BRAND_COLORS.warning,  // High - Orange
  3: '#F59E0B',            // Medium - Yellow
  4: '#10B981',            // Low - Green
  5: '#059669'             // Very Low - Dark Green
} as const;

/**
 * Generate CSS styles for board brief PDF
 */
export function generateBoardBriefCSS(): string {
  return `
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #0F172A;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%);
        }

        .header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 40px 30px;
            margin: 0 0 30px 0;
            border-radius: 0 0 16px 16px;
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }

        .logo-image {
            width: 40px;
            height: 40px;
            display: block;
            object-fit: contain;
            flex-shrink: 0;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: white;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }

        .subtitle {
            color: rgba(255,255,255,0.9);
            margin: 5px 0 0 0;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .section {
            margin: 30px 0;
        }

        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: ${BRAND_COLORS.slate[800]};
            margin: 0 0 15px 0;
            border-left: 4px solid ${BRAND_COLORS.primary};
            padding-left: 15px;
        }

        .metric-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin: 20px 0;
        }

        .risk-score {
            font-size: 48px;
            font-weight: bold;
            margin: 0;
            text-align: center;
        }

        .risk-level {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            margin: 8px 0;
        }

        .benchmark-text {
            font-size: 14px;
            color: #6b7280;
            text-align: center;
            margin: 4px 0;
        }

        .recommendation-item {
            background: linear-gradient(135deg, #FAF8FF 0%, #F8FBFF 100%);
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            position: relative;
            padding-left: 50px;
        }

        .recommendation-item:before {
            content: "→";
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #1a1a1a;
        }

        .rec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .rec-title {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
        }

        .rec-priority {
            background: #fee2e2;
            color: #dc2626;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .rec-content {
            font-size: 13px;
            line-height: 1.5;
            color: #4b5563;
        }

        .pillar-breakdown {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin: 20px 0;
        }

        .pillar-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }

        .pillar-name {
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 8px;
            color: #374151;
        }

        .pillar-score {
            font-size: 20px;
            font-weight: bold;
            margin: 5px 0;
        }

        .pillar-weight {
            font-size: 10px;
            color: #9ca3af;
        }

        .insight-box {
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
        }

        .insight-title {
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .insight-content {
            font-size: 14px;
            line-height: 1.5;
            color: #4b5563;
        }

        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }

        .footer-brands {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        @media print {
            body {
                margin: 0;
                padding: 15px;
            }

            .section {
                page-break-inside: avoid;
            }
        }
    </style>`;
}

/**
 * Generate CSS styles for detailed plan PDF
 */
export function generateDetailedPlanCSS(): string {
  // This will be extracted from the detailed plan section
  return generateBoardBriefCSS(); // Temporary - will be implemented properly
}

// Print-specific styles for React PDF components
export const PRINT_STYLES = `
  @media print {
    @page {
      size: A4;
      margin: 0.5in;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .page-break-before {
      page-break-before: always;
    }

    .page-break-after {
      page-break-after: always;
    }

    .no-page-break {
      page-break-inside: avoid;
    }

    .print-hidden {
      display: none !important;
    }

    .print-block {
      display: block !important;
    }

    body {
      margin: 0;
      padding: 15px;
      background: white !important;
    }

    .pdf-section {
      page-break-inside: avoid;
      margin-bottom: 24px;
    }

    .pdf-header {
      page-break-after: avoid;
    }

    .pdf-footer {
      page-break-before: avoid;
    }
  }
`;