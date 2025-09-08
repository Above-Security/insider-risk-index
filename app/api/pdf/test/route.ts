import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing PDF generation with simple HTML...");
    
    const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test PDF</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .content { margin-top: 20px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PDF Generation Test</h1>
        <p>This is a test to verify PDF generation is working</p>
    </div>
    <div class="content">
        <h2>Test Content</h2>
        <p>If you can see this PDF, then Playwright is working correctly.</p>
        <p>Generated at: ${new Date().toISOString()}</p>
        
        <h3>Sample Data</h3>
        <ul>
            <li>Sample item 1</li>
            <li>Sample item 2</li>
            <li>Sample item 3</li>
        </ul>
    </div>
</body>
</html>
    `;

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