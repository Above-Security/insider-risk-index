import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { getAssessmentResults } from "@/app/actions/assessment";
import { generateBoardBriefHTML, generateDetailedPlanHTML } from "@/lib/pdf/generators";
import { getRiskLevel } from "@/lib/pillars";

interface RouteParams {
  type: string;
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { type, id } = await params;

    // Validate PDF type
    if (type !== "board-brief" && type !== "detailed-plan") {
      return NextResponse.json(
        { error: "Invalid PDF type" },
        { status: 400 }
      );
    }

    // Get assessment results
    const response = await getAssessmentResults(id);
    
    if (!response.success || !response.assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const { assessment, benchmarks } = response;
    
    // Create mock result object for PDF generation
    const result = {
      totalScore: assessment.iri,
      level: assessment.level,
      levelDescription: getRiskLevel(assessment.iri).description,
      pillarBreakdown: assessment.pillarBreakdown.map(pb => ({
        pillarId: pb.pillar,
        score: pb.score,
        maxScore: 100,
        weight: pb.weight,
        contributionToTotal: pb.contributionToTotal,
      })),
      recommendations: generateRecommendations(assessment),
      strengths: generateStrengths(assessment),
      weaknesses: generateWeaknesses(assessment),
      benchmark: {
        industry: benchmarks.industry?.iriAverage || 64.2,
        companySize: benchmarks.size?.iriAverage || 64.2,
        overall: benchmarks.overall?.iriAverage || 64.2,
      },
    };

    const organizationData = {
      organizationName: assessment.industry ? 
        `${assessment.industry.replace('_', ' ')} Organization` : 
        "Organization",
      industry: assessment.industry || "Unknown",
      employeeCount: assessment.size ? 
        assessment.size.replace('_', '-') : 
        "Unknown",
    };

    const pdfData = {
      organizationData,
      result,
      generatedAt: new Date(),
    };

    // Generate HTML
    let html: string;
    let filename: string;

    if (type === "board-brief") {
      html = generateBoardBriefHTML(pdfData);
      filename = `${organizationData.organizationName}-Board-Brief-${new Date().toISOString().split("T")[0]}.pdf`;
    } else {
      html = generateDetailedPlanHTML(pdfData);
      filename = `${organizationData.organizationName}-Detailed-Plan-${new Date().toISOString().split("T")[0]}.pdf`;
    }

    // Generate PDF using Playwright
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      const page = await browser.newPage();
      
      // Set content and wait for any resources to load
      await page.setContent(html, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Generate PDF
      const pdf = await page.pdf({
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

      // Return PDF
      return new Response(pdf as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow',
        }
      });

    } catch (pdfError) {
      if (browser) {
        await browser.close();
      }
      throw pdfError;
    }

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

// Helper functions to generate content based on assessment data
function generateRecommendations(assessment: any): string[] {
  const recommendations = [];
  
  if (assessment.iri < 40) {
    recommendations.push("Establish a comprehensive insider risk management program with dedicated resources and executive sponsorship.");
    recommendations.push("Conduct a thorough risk assessment to identify your organization's most critical vulnerabilities.");
  } else if (assessment.iri < 60) {
    recommendations.push("Enhance existing security controls with a focus on the lowest-scoring areas.");
    recommendations.push("Develop incident response procedures specific to insider threats.");
  } else if (assessment.iri < 80) {
    recommendations.push("Fine-tune your insider risk program to address remaining gaps.");
    recommendations.push("Implement advanced analytics to improve threat detection capabilities.");
  } else {
    recommendations.push("Maintain current excellent practices and consider sharing best practices with industry peers.");
    recommendations.push("Continue regular assessments to ensure sustained performance.");
  }
  
  return recommendations.slice(0, 6);
}

function generateStrengths(assessment: any): string[] {
  const strengths = [];
  const highScoringPillars = assessment.pillarBreakdown
    .filter((p: any) => p.score >= 70)
    .sort((a: any, b: any) => b.score - a.score);

  for (const pillar of highScoringPillars) {
    strengths.push(`Strong ${pillar.pillar.replace('-', ' ')} capabilities with a score of ${Math.round(pillar.score)}%.`);
  }

  if (assessment.iri >= 80) {
    strengths.push("Comprehensive insider risk management program with strong controls across all areas.");
  } else if (assessment.iri >= 70) {
    strengths.push("Well-established security foundation with good coverage of insider risk controls.");
  }

  return strengths.slice(0, 5);
}

function generateWeaknesses(assessment: any): string[] {
  const weaknesses = [];
  const lowScoringPillars = assessment.pillarBreakdown
    .filter((p: any) => p.score < 60)
    .sort((a: any, b: any) => a.score - b.score);

  for (const pillar of lowScoringPillars) {
    const severity = pillar.score < 30 ? "Critical gaps" : 
                    pillar.score < 50 ? "Significant weaknesses" : 
                    "Areas for improvement";
    weaknesses.push(`${severity} in ${pillar.pillar.replace('-', ' ')} (${Math.round(pillar.score)}% score).`);
  }

  return weaknesses.slice(0, 5);
}