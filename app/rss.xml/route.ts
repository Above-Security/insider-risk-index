import { generateRSSFeed } from "@/lib/feeds";

export async function GET() {
  const rss = await generateRSSFeed();
  
  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}