import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { seoConfig, getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";
import { SkipLink } from "@/components/skip-link";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { WebVitals } from "@/components/web-vitals";
import { ErrorBoundary } from "@/components/error-boundary";
import { CSPostHogProvider } from './providers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Insider Risk Index - Free Security Assessment Tool",
    template: "%s | Insider Risk Index"
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: seoConfig.authors,
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,
  robots: seoConfig.robots,
  metadataBase: new URL(seoConfig.siteUrl),
  manifest: "/manifest.json",
  alternates: {
    canonical: seoConfig.siteUrl,
    types: {
      'application/rss+xml': `${seoConfig.siteUrl}/rss.xml`,
      'application/atom+xml': `${seoConfig.siteUrl}/atom.xml`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-64x64.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-128x128.png', type: 'image/png', sizes: '128x128' },
      { url: '/favicon-256x256.png', type: 'image/png', sizes: '256x256' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
      { url: '/apple-touch-icon-ipad.png', type: 'image/png', sizes: '167x167' },
      { url: '/apple-touch-icon-152x152.png', type: 'image/png', sizes: '152x152' },
    ],
  },
  openGraph: {
    type: "website",
    title: "Free Insider Risk Assessment for Organizations | Insider Risk Index",
    description: seoConfig.description,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    images: [
      {
        url: `${seoConfig.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Insider Risk Index - Free Security Assessment Tool",
        type: 'image/png',
      },
      {
        url: `${seoConfig.siteUrl}/og-image-2x.png`,
        width: 2400,
        height: 1260,
        alt: "Measure Your Organization's Insider Risk Posture",
        type: 'image/png',
      },
    ],
    locale: seoConfig.language,
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Insider Risk Assessment for Organizations",
    description: seoConfig.description,
    images: [`${seoConfig.siteUrl}/og-image.png`, `${seoConfig.siteUrl}/og-image-2x.png`],
    creator: "@abovesec",
    site: "@abovesec",
  },
  other: {
    "theme-color": seoConfig.themeColor,
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "InsiderRisk",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html lang="en" className={inter.variable}>
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
        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-above-white text-slate-900">
        <ErrorBoundary>
          <AccessibilityProvider>
            <CSPostHogProvider>
              <SkipLink />
              <WebVitals />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </CSPostHogProvider>
          </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
