import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { seoConfig, getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: seoConfig.siteName,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: seoConfig.authors,
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,
  robots: seoConfig.robots,
  metadataBase: new URL(seoConfig.siteUrl),
  openGraph: {
    type: "website",
    title: seoConfig.siteName,
    description: seoConfig.description,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    images: [
      {
        url: `${seoConfig.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
    locale: seoConfig.language,
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.siteName,
    description: seoConfig.description,
    creator: seoConfig.social.twitter,
    images: [`${seoConfig.siteUrl}/og-image.png`],
  },
  other: {
    "theme-color": seoConfig.themeColor,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <PostHogProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
