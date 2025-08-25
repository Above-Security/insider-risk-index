import { NextRequest, NextResponse } from "next/server";
import { generateBoardBriefHTML, generateDetailedPlanHTML } from "@/lib/pdf/generators";
import { AssessmentResult } from "@/lib/zod-schemas";

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
  try {
    const body: RequestBody = await request.json();
    const { type, organizationData, result } = body;

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

    let html: string;
    let filename: string;

    // Generate appropriate HTML based on type
    if (type === "board-brief") {
      html = generateBoardBriefHTML(pdfData);
      filename = `${organizationData.organizationName}-Board-Brief-${new Date().toISOString().split("T")[0]}.pdf`;
    } else if (type === "detailed-plan") {
      html = generateDetailedPlanHTML(pdfData);
      filename = `${organizationData.organizationName}-Detailed-Plan-${new Date().toISOString().split("T")[0]}.pdf`;
    } else {
      return NextResponse.json(
        { error: "Invalid PDF type" },
        { status: 400 }
      );
    }

    // In a production environment, you would use a service like:
    // - Puppeteer to generate PDF from HTML
    // - A service like PDFShift, HTMLPDFApi, or similar
    // - Or @vercel/og for simpler PDFs
    
    // For this example, we'll return the HTML content
    // In production, replace this with actual PDF generation
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

    /* 
    // Example with Puppeteer (uncomment and install puppeteer)
    
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true
    });
    
    await browser.close();
    
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    */

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}