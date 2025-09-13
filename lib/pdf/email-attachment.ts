import { generatePDFWithPDFKit } from "@/lib/pdf/pdfkit-generator";
import { getRiskLevel } from "@/lib/pillars";
import { Assessment, PillarScore } from "@prisma/client";

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

  const pdfData = {
    organizationData,
    result,
    generatedAt: new Date(),
  };

  // Use production-grade PDFKit instead of Chromium
  return await generatePDFWithPDFKit(pdfData, type);
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