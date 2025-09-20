import Script from "next/script";
import { pageMetadata, getAssessmentToolJsonLd } from "@/lib/seo";

export const metadata = pageMetadata.assessment();

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const assessmentJsonLd = getAssessmentToolJsonLd();

  return (
    <>
      <Script
        id="assessment-layout-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentJsonLd) }}
      />
      {children}
    </>
  );
}