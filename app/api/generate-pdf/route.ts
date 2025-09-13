import { NextRequest, NextResponse } from "next/server";
import { generateBoardBriefHTML, generateDetailedPlanHTML } from "@/lib/pdf/generators";
import { AssessmentResult } from "@/lib/zod-schemas";
import { chromium } from "playwright";

interface RequestBody {
  type: "board-brief" | "detailed-plan";
  organizationData: {
    organizationName: string;
    industry: string;
    employeeCount: string;
  };
  result: AssessmentResult;
}

export async function POST(request: NextRequest) {
  let type: string = "";
  let organizationData: any = null;
  let result: any = null;

  try {
    const body: RequestBody = await request.json();
    ({ type, organizationData, result } = body);

    // Validate required fields
    if (!type || !organizationData || !result) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pdfData = {
      organizationData,
      result,
      generatedAt: new Date(),
    };

    // Generate appropriate HTML based on type
    let html: string;
    let filename: string;

    if (type === "board-brief") {
      html = generateBoardBriefHTML(pdfData);
      filename = `${organizationData.organizationName.replace(/[^a-zA-Z0-9]/g, '-')}-Board-Brief-${new Date().toISOString().split("T")[0]}.pdf`;
    } else if (type === "detailed-plan") {
      html = generateDetailedPlanHTML(pdfData);
      filename = `${organizationData.organizationName.replace(/[^a-zA-Z0-9]/g, '-')}-Detailed-Plan-${new Date().toISOString().split("T")[0]}.pdf`;
    } else {
      return NextResponse.json(
        { error: "Invalid PDF type" },
        { status: 400 }
      );
    }

    // Generate PDF using Playwright (consolidated logic but direct implementation)
    let browser;
    try {
      console.log("🔍 Launching Chromium for PDF generation...");
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      console.log("✅ Browser launched, creating new page...");
      const page = await browser.newPage();

      console.log("🔍 Setting HTML content...");
      await page.setContent(html, {
        waitUntil: 'networkidle',
        timeout: 30000
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

      return new Response(new Uint8Array(pdf), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
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
    console.error("❌ PDF Generation Error Details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type,
      organizationName: organizationData?.organizationName,
      resultScore: result?.totalScore
    });

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}