import Script from "next/script";
import { generateMetadata, generateJsonLd } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "Security Glossary",
  description: "Comprehensive glossary of insider risk management, cybersecurity, and threat intelligence terms. Over 75 expertly curated definitions with citations from authoritative sources.",
  path: "/glossary",
  keywords: [
    "cybersecurity glossary",
    "insider risk terms",
    "security definitions",
    "threat intelligence glossary",
    "security terminology",
    "risk management definitions"
  ],
});

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate structured data for the glossary as a knowledge base
  const glossaryJsonLd = generateJsonLd({
    "@type": "CreativeWork",
    "@id": "https://insiderisk.io/glossary",
    name: "Insider Risk Management Glossary",
    description: "Comprehensive glossary of terms related to insider risk management, cybersecurity, and threat intelligence with over 75 expertly curated definitions.",
    url: "https://insiderisk.io/glossary",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Insider Risk Index",
      url: "https://insiderisk.io"
    },
    audience: {
      "@type": "Audience",
      audienceType: ["Security Professionals", "Risk Managers", "Cybersecurity Analysts", "IT Administrators"]
    },
    about: [
      {
        "@type": "Thing",
        name: "Insider Risk Management",
        description: "Practices and technologies for managing insider threats"
      },
      {
        "@type": "Thing", 
        name: "Cybersecurity",
        description: "Protection of digital systems and data from threats"
      },
      {
        "@type": "Thing",
        name: "Threat Intelligence",
        description: "Information about current and potential security threats"
      }
    ],
    genre: "reference",
    learningResourceType: "glossary",
    educationalUse: "reference",
    typicalAgeRange: "18+",
    educationalLevel: "professional",
  });

  return (
    <>
      <Script
        id="glossary-layout-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      {children}
    </>
  );
}