import React from 'react';
import { BRAND_COLORS } from '../styles';

interface PDFFooterProps {
  reportDate?: Date;
  version?: string;
  confidential?: boolean;
}

/**
 * PDFFooter - Professional footer with branding and legal notices
 */
export function PDFFooter({
  reportDate = new Date(),
  version = "1.0",
  confidential = true
}: PDFFooterProps) {
  return (
    <footer className="pdf-footer mt-12 pt-8" style={{ borderTop: `2px solid ${BRAND_COLORS.slate[200]}` }}>
      {/* Main Footer Content */}
      <div className="bg-slate-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* About This Report */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">About This Assessment</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Report Version:</span>
                <span className="font-medium">{version}</span>
              </div>
              <div className="flex justify-between">
                <span>Generated:</span>
                <span className="font-medium">
                  {reportDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Assessment Type:</span>
                <span className="font-medium">Comprehensive</span>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Methodology</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• Based on industry best practices and frameworks</p>
              <p>• Validated against real-world incident data</p>
              <p>• Benchmarked using aggregated market data</p>
              <p>• Continuous refinement from security experts</p>
            </div>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Support & Resources</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• Implementation guidance and playbooks</p>
              <p>• Industry-specific recommendations</p>
              <p>• Ongoing assessment and tracking</p>
              <p>• Expert consultation available</p>
            </div>
          </div>
        </div>

        {/* Research Attribution */}
        <div className="border-t border-slate-200 pt-4 mb-4">
          <h4 className="font-semibold text-slate-900 mb-2 text-sm">Research & Data Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <p className="mb-1">
                <strong>Ponemon Institute 2025:</strong> Cost of Insider Threats Global Report -
                Annual cost averaging $17.4M per organization, 81-day containment time.
              </p>
              <p className="mb-1">
                <strong>Verizon DBIR 2024:</strong> Data Breach Investigations Report -
                68% of breaches include non-malicious human element.
              </p>
            </div>
            <div>
              <p className="mb-1">
                <strong>Gartner Market Guide 2025:</strong> Insider Risk Management Solutions (G00805757) -
                48% report increased insider attacks, 54% find programs less than effective.
              </p>
              <p className="mb-1">
                <strong>ForScie Matrix:</strong> Insider Threat Matrix (insiderthreatmatrix.org) -
                Comprehensive threat technique documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${BRAND_COLORS.slate[200]}` }}>
          {/* Above Security Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md"></div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm" style={{ color: BRAND_COLORS.primary }}>
                  Above
                </span>
                <span className="text-slate-700 text-sm font-medium">
                  Security
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-600">
              Insider Risk Index
            </span>
          </div>

          {/* Legal & Confidentiality */}
          <div className="text-right">
            {confidential && (
              <div className="text-xs text-red-600 font-medium mb-1">
                CONFIDENTIAL & PROPRIETARY
              </div>
            )}
            <div className="text-xs text-slate-500">
              © 2025 Above Security. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-4 bg-slate-100 rounded-lg">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Disclaimer:</strong> This assessment is based on the information provided and current industry best practices.
          It should be used as guidance for improving your insider risk posture. Above Security makes no warranties regarding
          the completeness or accuracy of the assessment. Organizations should conduct their own due diligence and consult
          with qualified security professionals before implementing any recommendations. The scores and recommendations are
          not guarantees of security effectiveness or compliance with any specific regulatory requirements.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mt-4 text-center">
        <div className="text-sm text-slate-600">
          For questions about this assessment or to discuss implementation:
        </div>
        <div className="text-sm font-medium text-slate-900 mt-1">
          <a href="mailto:hello@insiderisk.io" className="hover:underline">
            hello@insiderisk.io
          </a>
          <span className="mx-2 text-slate-400">•</span>
          <a href="https://insiderisk.io" className="hover:underline">
            insiderisk.io
          </a>
        </div>
      </div>
    </footer>
  );
}

export default PDFFooter;