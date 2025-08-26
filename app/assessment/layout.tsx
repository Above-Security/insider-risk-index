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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: assessmentJsonLd }}
      />
      {children}
    </>
  );
}