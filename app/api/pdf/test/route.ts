import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { generateDetailedPlanHTML } from "@/lib/pdf/generators";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing comprehensive PDF generation...");

    // Create mock assessment data matching what email test uses
    const mockPDFData = {
      organizationData: {
        organizationName: "Test Organization",
        industry: "TECHNOLOGY",
        employeeCount: "251-1000 employees",
        region: null
      },
      result: {
        totalScore: 72,
        level: 4,
        levelDescription: "Proactive",
        pillarBreakdown: [
          { pillarId: "visibility", score: 85, weight: 0.25, contributionToTotal: 21.25, maxScore: 100 },
          { pillarId: "prevention-coaching", score: 70, weight: 0.25, contributionToTotal: 17.5, maxScore: 100 },
          { pillarId: "investigation-evidence", score: 65, weight: 0.20, contributionToTotal: 13, maxScore: 100 },
          { pillarId: "identity-saas", score: 75, weight: 0.15, contributionToTotal: 11.25, maxScore: 100 },
          { pillarId: "phishing-resilience", score: 68, weight: 0.15, contributionToTotal: 10.2, maxScore: 100 }
        ],
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
          industry: 66.4,
          companySize: 64.2,
          overall: 66.4
        }
      },
      generatedAt: new Date()
    };

    // Use our comprehensive content generator
    const testHtml = generateDetailedPlanHTML(mockPDFData);

    console.log("✅ Test HTML created, length:", testHtml.length);

    // Generate PDF using Playwright
    let browser;
    try {
      console.log("🔍 Launching Chromium browser...");
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      console.log("✅ Browser launched, creating new page...");
      const page = await browser.newPage();
      
      console.log("🔍 Setting HTML content...");
      await page.setContent(testHtml, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });

      console.log("🔍 Generating PDF...");
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

      console.log("✅ PDF generated successfully, size:", pdf.length, "bytes");
      await browser.close();

      return new Response(pdf as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="test-pdf.pdf"',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

    } catch (pdfError) {
      console.error("❌ Playwright PDF Error:", pdfError);
      if (browser) {
        await browser.close();
      }
      throw pdfError;
    }

  } catch (error) {
    console.error("❌ PDF Test Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate test PDF",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}