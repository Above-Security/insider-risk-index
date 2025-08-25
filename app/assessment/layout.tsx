import { pageMetadata, getAssessmentJsonLd } from "@/lib/seo";

export const metadata = pageMetadata.assessment();

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const assessmentJsonLd = getAssessmentJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentJsonLd) }}
      />
      {children}
    </>
  );
}