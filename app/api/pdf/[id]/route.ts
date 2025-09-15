import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import chromium from '@sparticuz/chromium';
import { chromium as playwrightCore } from 'playwright-core';

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

    // Verify assessment exists - direct Prisma query to avoid server action issues
    console.log("🔍 Verifying assessment exists for ID:", id);
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        industry: true,
        size: true,
        region: true,
        orgMetaHash: true,
        answers: true,
        pillarScores: true,
        iri: true,
        level: true,
        emailOptIn: true,
        contactEmail: true,
      },
    });

    if (!assessment) {
      console.error("❌ Assessment not found for ID:", id);
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    console.log("✅ Assessment found:", assessment.id, "| IRI:", assessment.iri);

    // Generate comprehensive PDF using Playwright navigation to React PDF page
    console.log("🔍 Starting comprehensive React PDF generation with Playwright");

    // Get the executable path for chromium
    const executablePath = await chromium.executablePath() || undefined;

    const browser = await playwrightCore.launch({
      headless: true,
      executablePath,
      args: chromium.args ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
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
          baseUrl = 'http://localhost:3000'; // Default dev port (Next.js typically uses 3001 when 3000 is taken)
        }
      }

      const pdfUrl = `${baseUrl}/pdf/${id}`;

      console.log("🔍 Navigating to comprehensive PDF page:", pdfUrl);

      // Navigate to the comprehensive PDF page
      await page.goto(pdfUrl, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      // Wait for content to fully load - try multiple selectors
      try {
        await page.waitForSelector('.pdf-header, #pdf-content, main', { timeout: 30000 });
      } catch (e) {
        console.log("Warning: Could not find PDF selectors, continuing anyway");
      }
      await page.waitForTimeout(3000); // Additional wait for any async content

      console.log("🔍 Generating comprehensive PDF from React page");

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.3in',
          right: '0.3in',
          bottom: '0.3in',
          left: '0.3in'
        },
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        scale: 0.8,
        width: '8.27in',
        height: '11.7in'
      });

      // Create filename based on assessment data
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