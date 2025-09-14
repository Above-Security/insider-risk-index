import { NextRequest, NextResponse } from "next/server";

/**
 * DEPRECATED ROUTE - This endpoint used a broken query parameter approach
 *
 * Use /api/pdf/[type]/[id] instead with proper assessment ID from database.
 * The old system tried to pass assessment data via URL query parameters to /pdf/dynamic
 * which caused layout issues and content duplication.
 */
export async function POST(request: NextRequest) {
  console.error("❌ DEPRECATED: /api/generate-pdf route is deprecated.");
  console.error("This route used broken query parameter approach with /pdf/dynamic.");
  console.error("Use /api/pdf/[type]/[id] instead with proper assessment ID.");

  return NextResponse.json(
    {
      error: "This PDF generation method is deprecated",
      message: "Use /api/pdf/[type]/[id] with a valid assessment ID instead. The assessment must be saved to the database first.",
      deprecated: true,
      correctUsage: {
        step1: "Submit assessment via server action to save to database",
        step2: "Use returned assessment ID with /api/pdf/board-brief/{id} or /api/pdf/detailed-plan/{id}",
        example: "/api/pdf/board-brief/clx123abc456def"
      }
    },
    { status: 410 } // Gone - indicates the resource is no longer available
  );
}