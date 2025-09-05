import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate high-resolution OG image from homepage hero section
 * This captures the hero section without the navigation bar
 */
async function generateOGImage() {
  console.log('🎨 Starting OG image generation...');
  
  // Launch browser in headless mode
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to high resolution (2x for retina quality)
    // Standard OG image is 1200x630, we'll capture at 2x
    await page.setViewportSize({
      width: 2400,
      height: 1260,
    });

    // Navigate to local development server
    // Make sure the dev server is running: npm run dev
    const url = process.env.SITE_URL || 'http://localhost:3000';
    console.log(`📍 Navigating to ${url}...`);
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for the hero section to be fully rendered
    await page.waitForSelector('.grainy-gradient-subtle', {
      state: 'visible',
      timeout: 10000,
    });

    // Additional wait to ensure fonts and styles are loaded
    await page.waitForTimeout(2000);

    // Hide the navigation header to focus on hero content
    await page.evaluate(() => {
      const header = document.querySelector('header');
      if (header) {
        header.style.display = 'none';
      }
    });

    // Get the hero section element
    const heroSection = await page.$('.grainy-gradient-subtle');
    
    if (!heroSection) {
      throw new Error('Hero section not found');
    }

    // Get bounding box of hero section
    const boundingBox = await heroSection.boundingBox();
    
    if (!boundingBox) {
      throw new Error('Could not get hero section dimensions');
    }

    // Capture screenshot of hero section with high quality
    console.log('📸 Capturing hero section...');
    const screenshot = await page.screenshot({
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: Math.min(boundingBox.width, 2400), // Cap at viewport width
        height: 1260, // Fixed height for OG image aspect ratio
      },
      type: 'png',
      // Omit background to keep gradient
      omitBackground: false,
    });

    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    // Save the image
    const outputPath = path.join(publicDir, 'og-image.png');
    await fs.writeFile(outputPath, screenshot);
    
    console.log(`✅ OG image saved to: ${outputPath}`);
    
    // Get file size for confirmation
    const stats = await fs.stat(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 Image size: ${fileSizeInKB} KB`);
    
    // Also generate a smaller version for faster loading
    await page.setViewportSize({
      width: 1200,
      height: 630,
    });
    
    const screenshotSmall = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
      },
      type: 'png',
      omitBackground: false,
    });
    
    const outputPathSmall = path.join(publicDir, 'og-image-small.png');
    await fs.writeFile(outputPathSmall, screenshotSmall);
    console.log(`✅ Small OG image saved to: ${outputPathSmall}`);

  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🎬 Browser closed');
  }
}

// Run if called directly
if (require.main === module) {
  generateOGImage()
    .then(() => {
      console.log('🎉 OG image generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to generate OG image:', error);
      process.exit(1);
    });
}

export { generateOGImage };