import { chromium } from "playwright";
import { generateDetailedPlanHTML } from "@/lib/pdf/generators";
import { getRiskLevel } from "@/lib/pillars";
import { Assessment, PillarScore } from "@prisma/client";

interface AssessmentWithPillars extends Assessment {
  pillarBreakdown: PillarScore[];
}

interface PDFAttachmentOptions {
  assessment: AssessmentWithPillars;
  type?: 'detailed' | 'board-brief';
}

/**
 * Generate PDF buffer for email attachment
 */
export async function generatePDFAttachment({
  assessment,
  type = 'detailed'
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

  const pdfData = {
    organizationData,
    result,
    generatedAt: new Date(),
  };

  // Generate HTML content
  const html = generateDetailedPlanHTML(pdfData);
  
  // Generate filename
  const orgName = organizationData.organizationName.replace(/[^a-zA-Z0-9]/g, '-');
  const date = new Date().toISOString().split("T")[0];
  const filename = `${orgName}-InsiderRisk-Assessment-${date}.pdf`;

  let browser;
  try {
    console.log("🔍 Launching Chromium for PDF generation...");
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    
    // Set content and wait for resources
    await page.setContent(html, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    console.log("🔍 Generating PDF buffer...");
    // Generate PDF as buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    console.log("✅ PDF generated successfully:", {
      filename,
      size: `${(pdfBuffer.length / 1024).toFixed(1)}KB`
    });

    return {
      buffer: Buffer.from(pdfBuffer),
      filename
    };

  } catch (error) {
    console.error("❌ PDF generation error:", error);
    if (browser) {
      await browser.close();
    }
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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