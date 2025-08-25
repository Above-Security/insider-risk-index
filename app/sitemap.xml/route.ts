import { generateSitemapFeed } from "@/lib/feeds";

export async function GET() {
  const sitemap = await generateSitemapFeed();
  
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}