import { NextRequest, NextResponse } from "next/server";
import { generatePDFBuffer } from "@/lib/pdf/generators";
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

    // Validate PDF type
    if (type !== "board-brief" && type !== "detailed-plan") {
      return NextResponse.json(
        { error: "Invalid PDF type" },
        { status: 400 }
      );
    }

    // Use unified PDF generation function
    const { buffer, filename } = await generatePDFBuffer(pdfData, type);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}