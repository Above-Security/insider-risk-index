import { getRiskLevel } from "@/lib/pillars";
import { Assessment, PillarScore } from "@prisma/client";
import chromium from '@sparticuz/chromium';
import { chromium as playwrightCore } from 'playwright-core';

interface AssessmentWithPillars extends Assessment {
  pillarBreakdown: PillarScore[];
}

interface PDFAttachmentOptions {
  assessment: AssessmentWithPillars;
  type?: 'detailed-plan' | 'board-brief';
}

/**
 * Generate PDF buffer for email attachment
 */
export async function generatePDFAttachment({
  assessment,
  type = 'detailed-plan'
}: PDFAttachmentOptions): Promise<{
  buffer: Buffer;
  filename: string;
}> {
  console.log("📄 Generating PDF attachment for assessment:", assessment.id);

  // Create organization data
  const organizationData = {
    organizationName: assessment.industry ? 
      assessment.industry.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') + ' Organization' : 'Your Organization',
    industry: assessment.industry || '',
    employeeCount: assessment.size || '',
    contactEmail: assessment.contactEmail || '',
    includeInBenchmarks: false
  };

  // Create result data
  const riskLevel = getRiskLevel(assessment.iri);
  const result = {
    totalScore: assessment.iri,
    level: assessment.level,
    levelDescription: riskLevel.description,
    pillarBreakdown: assessment.pillarBreakdown.map(pb => ({
      pillarId: pb.pillar, // PDF generator expects pillarId field
      score: pb.score,
      maxScore: 100,
      weight: pb.weight,
      contributionToTotal: pb.contributionToTotal
    })),
    recommendations: [
      "Implement comprehensive monitoring and detection capabilities across all endpoints and network segments",
      "Enhance employee training and awareness programs with regular phishing simulations", 
      "Strengthen access controls and identity management with multi-factor authentication",
      "Develop incident response and forensic capabilities for rapid threat containment"
    ],
    strengths: [
      "Strong foundation in visibility and monitoring capabilities",
      "Well-established identity and access management processes",
      "Proactive approach to insider threat prevention"
    ],
    weaknesses: [
      "Investigation and evidence collection processes need enhancement",
      "Phishing resilience training could be more comprehensive",
      "Some gaps identified in prevention and coaching programs"
    ],
    benchmark: {
      industry: 66.4, // Industry average score
      companySize: 64.2, // Company size average score  
      overall: 66.4, // Overall average score
    }
  };

  // Data is now fetched directly by the PDF page using the assessment ID

  // Use the proper React PDF system with assessment ID
  // Get the executable path for chromium
  const executablePath = await chromium.executablePath() || undefined;

  const browser = await playwrightCore.launch({
    headless: true,
    executablePath,
    args: chromium.args ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 794, height: 1123 });

    // Use the proper PDF route with assessment ID (no more query parameters)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const pdfUrl = `${baseUrl}/pdf/${assessment.id}`;

    console.log("📄 Generating PDF attachment from proper React page:", pdfUrl);

    await page.goto(pdfUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForSelector('.pdf-header', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    const filename = `insider-risk-assessment-${assessment.id}-${Date.now()}.pdf`;

    return {
      buffer: Buffer.from(pdfBuffer),
      filename
    };

  } finally {
    await browser.close();
  }
}

/**
 * Generate PDF buffer for specific assessment ID (utility function)
 */
export async function generateAssessmentPDF(assessmentId: string): Promise<{
  buffer: Buffer;
  filename: string;
} | null> {
  try {
    // Import here to avoid circular dependency
    const { getAssessmentResults } = await import("@/app/actions/assessment");
    
    const response = await getAssessmentResults(assessmentId);
    
    if (!response.success || !response.assessment) {
      console.error("❌ Assessment not found for PDF generation:", assessmentId);
      return null;
    }

    return await generatePDFAttachment({
      assessment: response.assessment as AssessmentWithPillars
    });
  } catch (error) {
    console.error("❌ Error generating PDF for assessment:", assessmentId, error);
    return null;
  }
}