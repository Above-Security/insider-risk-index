import { NextRequest, NextResponse } from "next/server";
import { generatePDFWithPDFKit } from "@/lib/pdf/pdfkit-generator";
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

    // Validate PDF type
    if (type !== "board-brief" && type !== "detailed-plan") {
      return NextResponse.json(
        { error: "Invalid PDF type" },
        { status: 400 }
      );
    }

    console.log("🔍 Generating PDF with PDFKit (production-grade)...");

    // Use production-grade PDFKit instead of resource-heavy Chromium
    const { buffer, filename } = await generatePDFWithPDFKit(pdfData, type);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

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