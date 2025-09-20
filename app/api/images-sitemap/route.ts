import { NextResponse } from 'next/server';
import { seoConfig } from '@/lib/seo';

/**
 * Generate XML sitemap for images to help search engines discover and index images
 */
export async function GET() {
  try {
    const baseUrl = seoConfig.siteUrl;

    // Define all static images used on the site
    const images = [
      {
        url: `${baseUrl}/logo.png`,
        title: 'Insider Risk Index Logo',
        caption: 'Official logo of Insider Risk Index - comprehensive insider threat assessment platform',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/og-image.png`,
        title: 'Insider Risk Index Social Preview',
        caption: 'Social media preview image for Insider Risk Index platform',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/og-image-2x.png`,
        title: 'Insider Risk Index High-Resolution Preview',
        caption: 'High-resolution social media preview image for Insider Risk Index',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/favicon.ico`,
        title: 'Insider Risk Index Favicon',
        caption: 'Favicon for Insider Risk Index website',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/favicon-16x16.png`,
        title: 'Insider Risk Index 16x16 Icon',
        caption: '16x16 pixel icon for Insider Risk Index',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/favicon-32x32.png`,
        title: 'Insider Risk Index 32x32 Icon',
        caption: '32x32 pixel icon for Insider Risk Index',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/apple-touch-icon.png`,
        title: 'Insider Risk Index Apple Touch Icon',
        caption: 'Apple touch icon for Insider Risk Index on iOS devices',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/android-chrome-192x192.png`,
        title: 'Insider Risk Index Android Chrome 192x192',
        caption: 'Android Chrome icon 192x192 for Insider Risk Index',
        lastModified: '2025-01-15'
      },
      {
        url: `${baseUrl}/android-chrome-512x512.png`,
        title: 'Insider Risk Index Android Chrome 512x512',
        caption: 'Android Chrome icon 512x512 for Insider Risk Index',
        lastModified: '2025-01-15'
      }
    ];

    // Generate XML sitemap for images
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${image.title}</image:title>
      <image:caption>${image.caption}</image:caption>
    </image:image>
    <lastmod>${image.lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200', // 24 hours cache, 12 hours stale
      },
    });

  } catch (error) {
    console.error('Error generating image sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours