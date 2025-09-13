import PDFDocument from 'pdfkit';
import { AssessmentResult } from "@/lib/zod-schemas";
import { PILLARS, getRiskLevel, RISK_LEVELS } from "@/lib/pillars";
import { formatDate } from "@/lib/utils";
import fs from 'fs';
import path from 'path';

type RiskLevel = typeof RISK_LEVELS[number];

interface OrganizationData {
  organizationName: string;
  industry: string;
  employeeCount: string;
}

interface PDFData {
  organizationData: OrganizationData;
  result: AssessmentResult;
  generatedAt: Date;
}

// Professional color palette
const COLORS = {
  primary: '#1a365d',
  secondary: '#2d3748',
  accent: '#4a5568',
  success: '#38a169',
  warning: '#d69e2e',
  danger: '#e53e3e',
  light: '#f7fafc',
  dark: '#1a202c',
  text: '#2d3748',
  muted: '#718096'
};

// Risk level colors matching the original design
const RISK_COLORS = {
  1: '#dc2626', // Critical - Red
  2: '#ea580c', // High - Orange
  3: '#ca8a04', // Moderate - Amber
  4: '#16a34a', // Low - Green
  5: '#059669'  // Minimal - Emerald
};

/**
 * Enhanced production-grade PDF generation using PDFKit with professional styling
 */
export async function generateEnhancedPDF(
  pdfData: PDFData,
  type: 'board-brief' | 'detailed-plan'
): Promise<{ buffer: Buffer; filename: string }> {
  console.log("📄 Generating enhanced PDF with professional styling");

  const { organizationData, result, generatedAt } = pdfData;
  const riskLevel = getRiskLevel(result.totalScore);

  // Create PDF document with professional settings
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0, // We'll handle margins manually for precise control
    info: {
      Title: type === 'board-brief' ? 'Insider Risk Assessment - Board Brief' : 'Insider Risk Assessment - Detailed Plan',
      Subject: 'Insider Risk Assessment Report',
      Author: 'Above Security',
      Creator: 'InsiderRisk.io',
      Producer: 'Enhanced PDFKit Generator',
      Keywords: 'insider risk, security assessment, risk management'
    }
  });

  // Generate filename
  const orgName = organizationData.organizationName.replace(/[^a-zA-Z0-9]/g, '-');
  const date = generatedAt.toISOString().split("T")[0];
  const filename = type === 'board-brief'
    ? `${orgName}-Board-Brief-${date}.pdf`
    : `${orgName}-Detailed-Plan-${date}.pdf`;

  // Buffer to collect PDF data
  const buffers: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => buffers.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      console.log("✅ Enhanced PDF generated successfully:", {
        filename,
        size: `${(buffer.length / 1024).toFixed(1)}KB`,
        features: "Professional styling, logos, color coding, charts"
      });
      resolve({ buffer, filename });
    });

    doc.on('error', reject);

    try {
      if (type === 'board-brief') {
        generateEnhancedBoardBrief(doc, pdfData, riskLevel);
      } else {
        generateEnhancedDetailedPlan(doc, pdfData, riskLevel);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generateEnhancedBoardBrief(doc: PDFKit.PDFDocument, pdfData: PDFData, riskLevel: RiskLevel) {
  const { organizationData, result, generatedAt } = pdfData;
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points

  // Header with gradient background effect
  drawHeaderBackground(doc, pageWidth);

  // Add logo and branding
  addLogoAndBranding(doc, organizationData.organizationName);

  // Risk Score Section with professional styling
  drawRiskScoreSection(doc, result, riskLevel, pageWidth);

  // Organization Info Section
  drawOrganizationInfo(doc, organizationData, generatedAt);

  // Pillar Breakdown with visual charts
  drawPillarBreakdown(doc, result);

  // Key Findings Section
  drawKeyFindings(doc, result);

  // Critical Recommendations
  drawRecommendations(doc, result);

  // Professional Footer
  drawProfessionalFooter(doc, pageHeight);
}

function generateEnhancedDetailedPlan(doc: PDFKit.PDFDocument, pdfData: PDFData, riskLevel: RiskLevel) {
  const { organizationData, result, generatedAt } = pdfData;
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Title Page with professional design
  drawTitlePage(doc, organizationData, generatedAt, pageWidth, pageHeight);

  // Executive Summary Page
  doc.addPage();
  drawExecutiveSummary(doc, result, riskLevel, pageWidth);

  // Detailed Risk Analysis
  drawDetailedAnalysis(doc, result, pageWidth);

  // Implementation Roadmap
  drawImplementationRoadmap(doc, result, pageWidth);

  // Matrix Integration
  drawMatrixIntegration(doc, result, pageWidth);

  // Professional Footer on each page
  drawProfessionalFooter(doc, pageHeight);
}

function drawHeaderBackground(doc: PDFKit.PDFDocument, pageWidth: number) {
  // Create gradient-like effect with multiple rectangles
  const gradientSteps = 20;
  const headerHeight = 120;

  for (let i = 0; i < gradientSteps; i++) {
    const opacity = 0.9 - (i * 0.02); // Fade from dark to light
    const color = interpolateColor('#1a1a2e', '#0f3460', i / gradientSteps);

    doc.fillOpacity(opacity)
       .fillColor(color)
       .rect(0, i * (headerHeight / gradientSteps), pageWidth, headerHeight / gradientSteps)
       .fill();
  }

  doc.fillOpacity(1); // Reset opacity
}

function addLogoAndBranding(doc: PDFKit.PDFDocument, organizationName: string) {
  // Add logo (using a simple shield shape as placeholder)
  drawLogo(doc, 50, 30, 40);

  // Company branding
  doc.fontSize(28)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('INSIDER RISK ASSESSMENT', 110, 35);

  doc.fontSize(16)
     .fillColor('rgba(255,255,255,0.9)')
     .font('Helvetica')
     .text('Executive Board Brief', 110, 65);

  doc.fontSize(14)
     .text(`${organizationName} | ${formatDate(new Date())}`, 110, 85);
}

function drawLogo(doc: PDFKit.PDFDocument, x: number, y: number, size: number) {
  // Draw a professional shield-like logo
  doc.fillColor('white')
     .stroke()
     .lineWidth(2);

  // Shield outline
  doc.moveTo(x + size/2, y)
     .lineTo(x + size * 0.8, y + size * 0.3)
     .lineTo(x + size * 0.8, y + size * 0.7)
     .lineTo(x + size/2, y + size)
     .lineTo(x + size * 0.2, y + size * 0.7)
     .lineTo(x + size * 0.2, y + size * 0.3)
     .closePath()
     .fillAndStroke();

  // Add shield details
  doc.fillColor('#1a365d')
     .circle(x + size/2, y + size * 0.35, size * 0.12)
     .fill();
}

function drawRiskScoreSection(doc: PDFKit.PDFDocument, result: AssessmentResult, riskLevel: RiskLevel, pageWidth: number) {
  const sectionY = 160;
  const sectionHeight = 100;

  // Background card
  doc.fillColor('#f8fafc')
     .rect(50, sectionY, pageWidth - 100, sectionHeight)
     .fill()
     .strokeColor('#e5e7eb')
     .lineWidth(1)
     .rect(50, sectionY, pageWidth - 100, sectionHeight)
     .stroke();

  // Risk score with color coding
  const riskColor = RISK_COLORS[result.level as keyof typeof RISK_COLORS] || COLORS.danger;

  doc.fontSize(64)
     .fillColor(riskColor)
     .font('Helvetica-Bold')
     .text(result.totalScore.toFixed(0), 70, sectionY + 20);

  // Score details
  doc.fontSize(18)
     .fillColor(riskColor)
     .font('Helvetica-Bold')
     .text('INSIDER RISK INDEX', 200, sectionY + 25);

  doc.fontSize(14)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text(`Level ${result.level}: ${riskLevel.description}`, 200, sectionY + 50);

  doc.fontSize(12)
     .fillColor(COLORS.muted)
     .text(`Industry Benchmark: ${result.benchmark.industry}/100`, 200, sectionY + 70);
}

function drawOrganizationInfo(doc: PDFKit.PDFDocument, organizationData: OrganizationData, generatedAt: Date) {
  const startY = 290;

  doc.fontSize(16)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Organization Profile', 50, startY);

  const infoY = startY + 25;
  doc.fontSize(11)
     .fillColor(COLORS.text)
     .font('Helvetica');

  doc.text(`Organization: ${organizationData.organizationName}`, 70, infoY);
  doc.text(`Industry: ${organizationData.industry}`, 70, infoY + 15);
  doc.text(`Company Size: ${organizationData.employeeCount} employees`, 70, infoY + 30);
  doc.text(`Assessment Date: ${formatDate(generatedAt)}`, 70, infoY + 45);
}

function drawPillarBreakdown(doc: PDFKit.PDFDocument, result: AssessmentResult) {
  const startY = 390;
  const barWidth = 200;
  const barHeight = 12;

  doc.fontSize(16)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Risk Assessment Breakdown', 50, startY);

  let currentY = startY + 30;

  result.pillarBreakdown.forEach((pillar) => {
    const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
    if (pillarInfo) {
      // Pillar name
      doc.fontSize(11)
         .fillColor(COLORS.text)
         .font('Helvetica-Bold')
         .text(pillarInfo.name, 70, currentY);

      // Score bar background
      doc.fillColor('#e5e7eb')
         .rect(70, currentY + 15, barWidth, barHeight)
         .fill();

      // Score bar fill with color coding
      const scoreRatio = pillar.score / 100;
      const barColor = getScoreColor(pillar.score);

      doc.fillColor(barColor)
         .rect(70, currentY + 15, barWidth * scoreRatio, barHeight)
         .fill();

      // Score text
      doc.fontSize(10)
         .fillColor(COLORS.text)
         .font('Helvetica-Bold')
         .text(`${pillar.score}/100`, 280, currentY + 17);

      currentY += 35;
    }
  });
}

function drawKeyFindings(doc: PDFKit.PDFDocument, result: AssessmentResult) {
  const startY = 550;

  doc.fontSize(16)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Key Findings', 50, startY);

  // Get strongest and weakest pillars
  const sortedPillars = result.pillarBreakdown.sort((a, b) => b.score - a.score);
  const strongest = sortedPillars[0];
  const weakest = sortedPillars[sortedPillars.length - 1];

  const strongestInfo = PILLARS.find(p => p.id === strongest.pillarId);
  const weakestInfo = PILLARS.find(p => p.id === weakest.pillarId);

  let currentY = startY + 25;

  if (strongestInfo) {
    doc.fontSize(11)
       .fillColor(COLORS.success)
       .font('Helvetica-Bold')
       .text('• Strongest Area:', 70, currentY);

    doc.fillColor(COLORS.text)
       .font('Helvetica')
       .text(`${strongestInfo.name} (${strongest.score}/100)`, 160, currentY);
    currentY += 20;
  }

  if (weakestInfo) {
    doc.fontSize(11)
       .fillColor(COLORS.danger)
       .font('Helvetica-Bold')
       .text('• Priority Area:', 70, currentY);

    doc.fillColor(COLORS.text)
       .font('Helvetica')
       .text(`${weakestInfo.name} (${weakest.score}/100)`, 160, currentY);
  }
}

function drawRecommendations(doc: PDFKit.PDFDocument, result: AssessmentResult) {
  const startY = 650;

  doc.fontSize(16)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Critical Recommendations', 50, startY);

  const topRecommendations = result.recommendations?.slice(0, 3) || [
    "Implement comprehensive monitoring and detection capabilities",
    "Enhance employee training and awareness programs",
    "Strengthen access controls and identity management"
  ];

  let currentY = startY + 25;

  topRecommendations.forEach((rec, index) => {
    // Number circle
    doc.fillColor(COLORS.primary)
       .circle(75, currentY + 7, 8)
       .fill();

    doc.fontSize(10)
       .fillColor('white')
       .font('Helvetica-Bold')
       .text(`${index + 1}`, 72, currentY + 3);

    // Recommendation text
    doc.fontSize(11)
       .fillColor(COLORS.text)
       .font('Helvetica')
       .text(rec, 95, currentY, { width: 420 });

    currentY += 25;
  });
}

function drawProfessionalFooter(doc: PDFKit.PDFDocument, pageHeight: number) {
  const footerY = pageHeight - 40;

  doc.fontSize(9)
     .fillColor(COLORS.muted)
     .font('Helvetica')
     .text('Generated by Above Security | abovesec.com | Insider Risk Assessment Platform', 50, footerY);

  doc.text(`Report ID: ${generateReportId()}`, 400, footerY);
}

function drawTitlePage(doc: PDFKit.PDFDocument, organizationData: OrganizationData, generatedAt: Date, pageWidth: number, pageHeight: number) {
  // Full-page gradient background
  drawHeaderBackground(doc, pageWidth);

  // Centered title design
  const centerX = pageWidth / 2;

  doc.fontSize(36)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('INSIDER RISK ASSESSMENT', 0, 200, { align: 'center', width: pageWidth });

  doc.fontSize(24)
     .fillColor('rgba(255,255,255,0.9)')
     .font('Helvetica')
     .text('Comprehensive Implementation Plan', 0, 260, { align: 'center', width: pageWidth });

  doc.fontSize(18)
     .text(organizationData.organizationName, 0, 320, { align: 'center', width: pageWidth });

  doc.fontSize(14)
     .text(formatDate(generatedAt), 0, 350, { align: 'center', width: pageWidth });

  // Add decorative elements
  drawDecorative元素(doc, centerX, 400);
}

function drawExecutiveSummary(doc: PDFKit.PDFDocument, result: AssessmentResult, riskLevel: RiskLevel, pageWidth: number) {
  doc.fontSize(24)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Executive Summary', 50, 50);

  const summaryText = `Your organization scored ${result.totalScore}/100 on the Insider Risk Index, placing you at Level ${result.level} (${riskLevel.description}). This comprehensive report provides a detailed roadmap for improving your insider threat posture through evidence-based recommendations and industry best practices.`;

  doc.fontSize(12)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text(summaryText, 50, 90, { width: pageWidth - 100 });
}

function drawDetailedAnalysis(doc: PDFKit.PDFDocument, result: AssessmentResult, pageWidth: number) {
  doc.addPage();

  doc.fontSize(20)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Detailed Risk Analysis', 50, 50);

  let currentY = 90;

  result.pillarBreakdown.forEach((pillar) => {
    const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
    if (pillarInfo) {
      // Pillar header
      doc.fontSize(16)
         .fillColor(COLORS.primary)
         .font('Helvetica-Bold')
         .text(pillarInfo.name, 50, currentY);

      // Score and details
      doc.fontSize(12)
         .fillColor(COLORS.text)
         .font('Helvetica')
         .text(`Score: ${pillar.score}/100 | Weight: ${(pillar.weight * 100).toFixed(0)}% | Contribution: ${pillar.contributionToTotal.toFixed(1)}`, 50, currentY + 20);

      doc.text(pillarInfo.description, 50, currentY + 40, { width: pageWidth - 100 });

      currentY += 100;

      // Add new page if needed
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
    }
  });
}

function drawImplementationRoadmap(doc: PDFKit.PDFDocument, result: AssessmentResult, pageWidth: number) {
  doc.addPage();

  doc.fontSize(20)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('90-Day Implementation Roadmap', 50, 50);

  const phases = [
    {
      title: "Phase 1: Foundation (Days 1-30)",
      color: COLORS.danger,
      items: [
        "Conduct comprehensive risk assessment",
        "Establish insider threat program governance",
        "Deploy basic monitoring capabilities",
        "Implement foundational access controls"
      ]
    },
    {
      title: "Phase 2: Detection & Monitoring (Days 31-60)",
      color: COLORS.warning,
      items: [
        "Deploy advanced behavioral analytics",
        "Implement data loss prevention",
        "Establish incident response procedures",
        "Train security operations center staff"
      ]
    },
    {
      title: "Phase 3: Optimization (Days 61-90)",
      color: COLORS.success,
      items: [
        "Fine-tune detection algorithms",
        "Conduct tabletop exercises",
        "Implement advanced threat hunting",
        "Establish continuous improvement process"
      ]
    }
  ];

  let currentY = 90;

  phases.forEach((phase) => {
    // Phase header with color coding
    doc.fillColor(phase.color)
       .rect(50, currentY, 5, 20)
       .fill();

    doc.fontSize(14)
       .fillColor(COLORS.primary)
       .font('Helvetica-Bold')
       .text(phase.title, 65, currentY + 2);

    currentY += 30;

    phase.items.forEach((item) => {
      doc.fontSize(11)
         .fillColor(COLORS.text)
         .font('Helvetica')
         .text(`• ${item}`, 70, currentY, { width: pageWidth - 120 });
      currentY += 20;
    });

    currentY += 15;
  });
}

function drawMatrixIntegration(doc: PDFKit.PDFDocument, result: AssessmentResult, pageWidth: number) {
  doc.addPage();

  doc.fontSize(20)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text('Insider Threat Matrix Integration', 50, 50);

  doc.fontSize(12)
     .fillColor(COLORS.text)
     .font('Helvetica')
     .text('This assessment incorporates techniques and mitigations from the comprehensive Insider Threat Matrix, providing evidence-based recommendations aligned with industry frameworks.', 50, 90, { width: pageWidth - 100 });
}

function drawDecorative元素(doc: PDFKit.PDFDocument, centerX: number, y: number) {
  // Draw decorative lines
  doc.strokeColor('rgba(255,255,255,0.3)')
     .lineWidth(2)
     .moveTo(centerX - 100, y)
     .lineTo(centerX + 100, y)
     .stroke();
}

// Helper functions
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple color interpolation (would be more complex in real implementation)
  return factor < 0.5 ? color1 : color2;
}

function getScoreColor(score: number): string {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.warning;
  return COLORS.danger;
}

function generateReportId(): string {
  return `IR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}