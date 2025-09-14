import React from 'react';
import { BRAND_COLORS } from '../styles';

interface PDFHeaderProps {
  organizationName: string;
  industry: string;
  employeeCount: string;
  generatedAt: Date;
  logoUrl?: string;
}

/**
 * Above Security Logo SVG for PDF - Inline version for server-side rendering
 */
function AboveLogoSVG({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Math.round(size * 0.8)}
      viewBox="0 0 300 239"
      fill="currentColor"
      className={className}
    >
      <path d="m138.2 162.976-11.093.02c-5.566-.015-11.228.473-14.736-5.711-3.117-5.498-5.658-12-8.661-17.507-5.7669-10.576-1.322-15.218 3.965-24.195l7.866-13.451 6.672-11.4593c1.353-2.3235 2.655-4.7378 4.177-6.9307 1.02-1.4705 2.242-2.8031 3.653-3.8103 1.661-1.1865 3.636-2.0682 5.58-2.4349 3.621-.684 23.259-.6862 26.824.1468 4.174.9755 7.271 3.4391 9.553 7.3564 5.039 8.6514 9.826 18.059 14.672 26.852l5.173 9.39c2.231 4.053 5.246 8.863 3.758 13.986-1.51 5.201-4.84 10.299-7.05 15.236-1.431 3.192-3.261 6.456-4.839 9.581-1.228 2.302-3.009 3.429-5.388 2.697-2.428-.748-4.488-5.472-5.705-7.702l-25.493-46.374c-1.936-3.516-8.637-16.7884-10.63-18.6714-.803-.7585-1.95-1.1178-2.993-1.0182-1.36.1299-2.22 1.0426-3.038 2.1604-1.504 2.0542-2.746 4.4847-4.063 6.6998l-8.097 13.6894-6.042 10.134c-1.676 2.796-5.356 7.482-3.711 10.832 3.17 6.46 5.762 11.057 8.946 17.508.988 2.003 2.651 5.197 4.781 4.901 3.069-.382 4.983-5.344 6.498-8.106l7.975-14.524c1.423-2.588 2.78-5.067 4.322-7.598 1.335-2.195 5.293-2.56 6.924-.673 2.706 3.356 4.306 7.175 6.5 11 1.594 2.778 4.638 7.587 2.764 10.937-2.453 4.381-4.696 9.395-7.693 13.277-2.896 3.75-7.364 3.73-11.371 3.762Z" />
    </svg>
  );
}

/**
 * PDFHeader - Professional header for PDF reports
 * Includes organization details, branding, and generation timestamp
 */
export function PDFHeader({
  organizationName,
  industry,
  employeeCount,
  generatedAt,
  logoUrl
}: PDFHeaderProps) {
  const formatIndustry = (industry: string) => {
    return industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatEmployeeCount = (count: string) => {
    return count.replace(/_/g, '-');
  };

  return (
    <header
      className="pdf-header p-8 rounded-b-xl mb-8 text-white no-page-break"
      style={{
        background: `linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%),
                    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1), transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2), transparent 50%)`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        textShadow: '0 2px 4px rgba(0,0,0,0.7)'
      }}
    >
      {/* Logo and Branding */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Organization Logo (if provided) */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Organization Logo"
              className="w-12 h-12 object-contain bg-white rounded-lg p-1"
            />
          )}

          {/* Above Security Branding with Logo */}
          <div className="flex items-center gap-3">
            <AboveLogoSVG
              className="text-white"
              size={40}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-2xl"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  Above
                </span>
                <span className="text-white/90 text-lg font-medium">
                  Security
                </span>
              </div>
              <span className="text-white/70 text-sm -mt-1">
                Insider Risk Index
              </span>
            </div>
          </div>
        </div>

        {/* Generation Date */}
        <div className="text-right text-sm text-white/80">
          <div>Generated</div>
          <div className="font-semibold">
            {generatedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Organization Information */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">
          Insider Risk Assessment
        </h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: BRAND_COLORS.primaryLight }}>
          {organizationName}
        </h2>

        <div className="flex items-center gap-8 text-white/90">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h4a1 1 0 011 1v4H7v-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{formatIndustry(industry)}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span className="font-medium">{formatEmployeeCount(employeeCount)} employees</span>
          </div>
        </div>
      </div>
    </header>
  );
}

interface PDFSubHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'primary';
  };
}

/**
 * PDFSubHeader - Secondary header for section titles
 */
export function PDFSubHeader({ title, subtitle, badge }: PDFSubHeaderProps) {
  const badgeColors = {
    'success': { bg: BRAND_COLORS.success + '20', color: BRAND_COLORS.success },
    'warning': { bg: BRAND_COLORS.warning + '20', color: BRAND_COLORS.warning },
    'error': { bg: BRAND_COLORS.error + '20', color: BRAND_COLORS.error },
    'primary': { bg: BRAND_COLORS.primary + '20', color: BRAND_COLORS.primary }
  };

  return (
    <div className="pdf-subheader flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `2px solid ${BRAND_COLORS.slate[200]}` }}>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-lg text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      {badge && (
        <div
          className="px-4 py-2 rounded-full font-semibold text-sm"
          style={{
            backgroundColor: badgeColors[badge.variant].bg,
            color: badgeColors[badge.variant].color
          }}
        >
          {badge.text}
        </div>
      )}
    </div>
  );
}

export default PDFHeader;