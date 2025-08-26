import { notFound } from "next/navigation";
import { getAssessmentResults } from "@/app/actions/assessment";
import { ResultsSummary } from "@/components/assessment/results-summary";
import { MatrixRecommendations } from "@/components/assessment/matrix-recommendations";
import { ShareResults } from "@/components/assessment/share-results";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateJsonLd, getAssessmentResultJsonLd } from "@/lib/seo";
import { type RecommendationContext } from "@/lib/recommendations";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const response = await getAssessmentResults(id);
  
  if (!response.success || !response.assessment) {
    return {
      title: "Assessment Results Not Found",
      description: "The requested assessment results could not be found.",
    };
  }

  const { assessment } = response;
  const level = assessment.level;
  const iri = Math.round(assessment.iri);
  
  return {
    title: `Insider Risk Assessment Results - Level ${level} (${iri}/100)`,
    description: `View detailed insider risk assessment results showing organizational maturity across 5 critical pillars of insider threat management.`,
    openGraph: {
      title: `Insider Risk Index: Level ${level}`,
      description: `Assessment score: ${iri}/100 across visibility, coaching, evidence, identity, and phishing pillars.`,
      type: "article",
    },
    robots: {
      index: false, // Don't index individual results
      follow: false,
    },
  };
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;
  const response = await getAssessmentResults(id);
  
  if (!response.success || !response.assessment || !response.benchmarks) {
    notFound();
  }

  const { assessment, benchmarks } = response;
  
  // Create mock result object for the component
  const result = {
    totalScore: assessment.iri,
    level: assessment.level,
    levelDescription: `Level ${assessment.level}`,
    pillarBreakdown: assessment.pillarBreakdown.map(pb => ({
      pillarId: pb.pillar,
      score: pb.score,
      maxScore: 100,
      weight: pb.weight,
      contributionToTotal: pb.contributionToTotal,
    })),
    recommendations: [], // Would be calculated based on scores
    strengths: [],
    weaknesses: [],
    benchmark: {
      industry: benchmarks.industry?.iriAverage || 64.2,
      companySize: benchmarks.size?.iriAverage || 64.2,
      overall: benchmarks.overall?.iriAverage || 64.2,
    },
  };

  const organizationInfo = {
    organizationName: assessment.industry ? 
      `${assessment.industry.replace('_', ' ')} Organization` : 
      "Organization",
    industry: assessment.industry || "Unknown",
    employeeCount: assessment.size ? 
      assessment.size.replace('_', '-') : 
      "Unknown",
  };

  // Create Matrix recommendations context
  const recommendationContext: RecommendationContext = {
    totalScore: assessment.iri,
    level: assessment.level,
    pillarScores: assessment.pillarBreakdown.map(pb => ({
      pillarId: pb.pillar,
      score: pb.score,
      weight: pb.weight,
      contributionToTotal: pb.contributionToTotal,
    })),
    industry: assessment.industry || undefined,
    companySize: assessment.size || undefined,
    organizationName: organizationInfo.organizationName,
  };

  // Generate JSON-LD for assessment results
  const jsonLd = getAssessmentResultJsonLd({
    id: id,
    score: assessment.iri,
    level: assessment.level,
    industry: assessment.industry?.toString(),
    companySize: assessment.size?.toString(),
    pillars: assessment.pillarBreakdown.map(pb => ({
      pillarId: pb.pillar,
      score: pb.score,
    })),
    createdAt: assessment.createdAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-above-blue-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/assessment">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500">
                Completed: {assessment.createdAt.toLocaleDateString()}
              </div>
              <ShareResults
                assessmentId={id}
                totalScore={Math.round(assessment.iri)}
                level={assessment.level}
                organizationName={organizationInfo.organizationName}
                className="sm"
              />
            </div>
          </div>

          {/* Results Summary */}
          <ResultsSummary
            result={result}
            organizationInfo={organizationInfo}
            assessmentId={id}
            onGeneratePDF={async () => {
              // PDF generation would be handled client-side
              console.log("PDF generation requested");
            }}
          />

          {/* Matrix-Enhanced Recommendations */}
          <div className="mt-12">
            <MatrixRecommendations context={recommendationContext} />
          </div>

          {/* Methodology Note */}
          <div className="mt-12 bg-above-blue-50 border border-above-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-above-blue-900 mb-2">
              About This Assessment
            </h3>
            <div className="text-above-blue-800 space-y-2">
              <p>
                The Insider Risk Index evaluates your organization across 5 critical pillars 
                of insider threat management with industry-validated weightings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <div className="text-center">
                  <div className="font-semibold">Visibility</div>
                  <div className="text-sm">25% weight</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Coaching</div>
                  <div className="text-sm">25% weight</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Evidence</div>
                  <div className="text-sm">20% weight</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Identity</div>
                  <div className="text-sm">15% weight</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Phishing</div>
                  <div className="text-sm">15% weight</div>
                </div>
              </div>
              <p className="mt-4">
                <Link href="/about/methodology" className="underline">
                  Learn more about our methodology
                </Link>
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-white rounded-lg border p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">
              Ready to Improve Your Insider Risk Posture?
            </h3>
            <p className="text-slate-600 mb-6">
              Explore our vendor-agnostic implementation guides and research insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playbooks">
                <Button size="lg">
                  Browse Implementation Playbooks
                </Button>
              </Link>
              <Link href="/research">
                <Button variant="outline" size="lg">
                  View Research & Insights
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}