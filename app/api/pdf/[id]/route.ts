import { NextRequest, NextResponse } from "next/server";
import { getAssessmentResults } from "@/app/actions/assessment";
import { chromium } from 'playwright';

interface RouteParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params;

    console.log("🔍 Comprehensive PDF Generation Request for ID:", id);

    // Verify assessment exists
    console.log("🔍 Verifying assessment exists for ID:", id);
    const response = await getAssessmentResults(id);

    if (!response.success || !response.assessment) {
      console.error("❌ Assessment not found:", response.error);
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Generate comprehensive PDF using Playwright navigation to React PDF page
    console.log("🔍 Starting comprehensive React PDF generation with Playwright");

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();

      // Set viewport for A4 print
      await page.setViewportSize({ width: 794, height: 1123 });

      // Get the base URL for navigation - use dev server port if in development
      let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Check if we're in development and adjust port
      if (process.env.NODE_ENV === 'development') {
        // Try to determine the actual dev server port
        const host = request.headers.get('host');
        if (host && host.includes('localhost:')) {
          baseUrl = `http://${host}`;
        } else {
          baseUrl = 'http://localhost:3002'; // Default dev port
        }
      }

      const pdfUrl = `${baseUrl}/pdf/${id}`;

      console.log("🔍 Navigating to comprehensive PDF page:", pdfUrl);

      // Navigate to the comprehensive PDF page
      await page.goto(pdfUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for content to fully load
      await page.waitForSelector('.pdf-header', { timeout: 10000 });
      await page.waitForTimeout(2000); // Additional wait for any async content

      console.log("🔍 Generating comprehensive PDF from React page");

      // Generate PDF
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

      // Create filename based on assessment data
      const assessment = response.assessment!;
      const orgName = assessment.industry ?
        assessment.industry.replace(/_/g, '-') : 'organization';
      const filename = `insider-risk-assessment-${orgName}-${id.substring(0, 8)}-${Date.now()}.pdf`;

      console.log("✅ Comprehensive React PDF generated successfully");
      console.log("🔍 PDF size:", pdfBuffer.length, "bytes");
      console.log("🔍 Filename:", filename);

      return new Response(pdfBuffer as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow',
        }
      });

    } finally {
      await browser.close();
    }


  } catch (error) {
    console.error("❌ Comprehensive PDF Generation Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      {
        error: "Failed to generate comprehensive PDF",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}