import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate a custom-designed OG image optimized for social media
 * Creates a visually appealing card with hero content
 */
async function generateCustomOGImage() {
  console.log('🎨 Starting custom OG image generation...');
  
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to standard OG image size
    await page.setViewportSize({
      width: 1200,
      height: 630,
    });

    // Create a custom HTML page with the hero content styled for OG image
    const customHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      width: 1200px;
      height: 630px;
      position: relative;
      overflow: hidden;
    }
    
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      /* Gradient background matching the site */
      background: linear-gradient(135deg, #FEE5E5 0%, #E5E5FF 50%, #FFE5F1 100%);
    }
    
    /* Noise texture overlay */
    .noise-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      pointer-events: none;
    }
    
    /* Decorative blobs */
    .blob-1 {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(251, 113, 133, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
    }
    
    .blob-2 {
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(122, 183, 255, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(80px);
    }
    
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 60px;
      max-width: 1000px;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #FB7185 0%, #7AB7FF 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #1F2937 0%, #4B5563 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(200, 179, 255, 0.3);
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      color: #4B5563;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
    }
    
    h1 {
      font-size: 56px;
      font-weight: 800;
      line-height: 1.1;
      color: #1F2937;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    
    .highlight {
      background: linear-gradient(135deg, #FB7185 0%, #F43F5E 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 22px;
      line-height: 1.4;
      color: #6B7280;
      margin-bottom: 32px;
      font-weight: 500;
    }
    
    .stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin-top: 40px;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #FB7185;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6B7280;
      font-weight: 500;
    }
    
    .footer {
      position: absolute;
      bottom: 24px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 16px;
      color: #9CA3AF;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="blob-1"></div>
    <div class="blob-2"></div>
    <div class="noise-overlay"></div>
    
    <div class="content">
      <div class="logo">
        <div class="logo-icon">🛡️</div>
        <div class="logo-text">Insider Risk Index</div>
      </div>
      
      <div class="badge">Research-Based Assessment Framework</div>
      
      <h1>
        Free Insider Risk Assessment<br>
        <span class="highlight">for Organizations</span>
      </h1>
      
      <p class="subtitle">
        Calculate your organization's insider threat vulnerability<br>
        based on industry research and threat intelligence
      </p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-value">$17.4M</div>
          <div class="stat-label">Average Annual Cost</div>
        </div>
        <div class="stat">
          <div class="stat-value">48%</div>
          <div class="stat-label">Attack Increase</div>
        </div>
        <div class="stat">
          <div class="stat-value">81 Days</div>
          <div class="stat-label">Avg. Containment</div>
        </div>
      </div>
    </div>
    
    <div class="footer">insiderisk.io</div>
  </div>
</body>
</html>
    `;

    // Set content directly
    await page.setContent(customHTML, {
      waitUntil: 'networkidle',
    });

    // Wait for fonts to load
    await page.waitForTimeout(2000);

    // Capture screenshot
    console.log('📸 Capturing custom OG image...');
    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    // Save the image
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    const outputPath = path.join(publicDir, 'og-image-new.png');
    await fs.writeFile(outputPath, screenshot);
    
    console.log(`✅ Custom OG image saved to: ${outputPath}`);
    
    // Get file size
    const stats = await fs.stat(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 Image size: ${fileSizeInKB} KB`);
    
    // Generate high-res version (2x for retina displays)
    await page.setViewportSize({
      width: 2400,
      height: 1260,
    });
    
    await page.setContent(customHTML.replace('1200px', '2400px').replace('630px', '1260px').replace(/font-size:\s*(\d+)px/g, (_match, size) => `font-size: ${parseInt(size) * 2}px`), {
      waitUntil: 'networkidle',
    });
    
    await page.waitForTimeout(2000);
    
    const screenshotHighRes = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });
    
    const outputPathHighRes = path.join(publicDir, 'og-image-2x.png');
    await fs.writeFile(outputPathHighRes, screenshotHighRes);
    console.log(`✅ High-res OG image saved to: ${outputPathHighRes}`);

  } catch (error) {
    console.error('❌ Error generating custom OG image:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🎬 Browser closed');
  }
}

// Run if called directly
if (require.main === module) {
  generateCustomOGImage()
    .then(() => {
      console.log('🎉 Custom OG image generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate custom OG image:', error);
      process.exit(1);
    });
}

export { generateCustomOGImage };