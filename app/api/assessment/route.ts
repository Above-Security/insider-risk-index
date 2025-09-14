import { NextRequest, NextResponse } from "next/server";
import { submitAssessment } from "@/app/actions/assessment";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 API Route: Assessment submission");

    const body = await request.json();
    console.log("📝 Request body:", body);

    // Convert the request body to the format expected by submitAssessment
    // Map string values to proper enum values
    const industryMap: Record<string, string> = {
      'technology': 'TECHNOLOGY',
      'financial-services': 'FINANCIAL_SERVICES',
      'healthcare': 'HEALTHCARE',
      'retail': 'RETAIL',
      'manufacturing': 'MANUFACTURING',
      'government': 'GOVERNMENT',
      'education': 'EDUCATION',
      'energy': 'ENERGY',
      'telecommunications': 'TELECOMMUNICATIONS',
      'media-entertainment': 'MEDIA_ENTERTAINMENT',
      'TECHNOLOGY': 'TECHNOLOGY',
      'FINANCIAL_SERVICES': 'FINANCIAL_SERVICES',
      'HEALTHCARE': 'HEALTHCARE',
      'RETAIL': 'RETAIL',
      'MANUFACTURING': 'MANUFACTURING',
      'GOVERNMENT': 'GOVERNMENT',
      'EDUCATION': 'EDUCATION',
      'ENERGY': 'ENERGY',
      'TELECOMMUNICATIONS': 'TELECOMMUNICATIONS',
      'MEDIA_ENTERTAINMENT': 'MEDIA_ENTERTAINMENT',
    };

    const sizeMap: Record<string, string> = {
      '1-50': 'STARTUP_1_50',
      '51-250': 'SMALL_51_250',
      '251-1000': 'MID_251_1000',
      '1001-5000': 'LARGE_1001_5000',
      '5000+': 'ENTERPRISE_5000_PLUS',
      'STARTUP_1_50': 'STARTUP_1_50',
      'SMALL_51_250': 'SMALL_51_250',
      'MID_251_1000': 'MID_251_1000',
      'LARGE_1001_5000': 'LARGE_1001_5000',
      'ENTERPRISE_5000_PLUS': 'ENTERPRISE_5000_PLUS',
    };

    const assessmentData = {
      industry: body.organizationData?.industry ? industryMap[body.organizationData.industry] as any : undefined,
      size: body.organizationData?.size ? sizeMap[body.organizationData.size] as any : undefined,
      region: body.organizationData?.region as any,
      answers: body.answers,
      emailOptIn: body.organizationData?.emailOptIn || false,
      contactEmail: body.organizationData?.contactEmail,
    };

    console.log("🔄 Calling submitAssessment server action...");
    const result = await submitAssessment(assessmentData);

    console.log("✅ Submit assessment result:", result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        assessmentId: result.assessmentId,
        result: result.result,
      });
    } else {
      console.error("❌ Assessment submission failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ API Route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}