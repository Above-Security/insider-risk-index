import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  ArrowRight,
  Eye,
  Search,
  Key,
  ShieldAlert,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { PILLARS, OVERALL_BENCHMARKS } from "@/lib/pillars";
import { pageMetadata } from "@/lib/seo";
import { AssessmentPreview } from "@/components/home/assessment-preview";
import { ResultsPreview } from "@/components/home/results-preview";

export const metadata = pageMetadata.home();

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Comprehensive Assessment",
      description: "20 expertly crafted questions across 5 critical pillars of insider threat management.",
    },
    {
      icon: TrendingUp,
      title: "Industry Benchmarks",
      description: "Compare your results against peers in your industry and company size category.",
    },
    {
      icon: Users,
      title: "Actionable Insights",
      description: "Get personalized recommendations and implementation roadmaps.",
    },
    {
      icon: FileText,
      title: "Executive Reports",
      description: "Generate professional PDFs for board presentations and detailed action plans.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                Trusted by {OVERALL_BENCHMARKS.totalAssessments.toLocaleString()}+ organizations
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Measure Your{" "}
                <span className="text-blue-600">Insider Risk</span>{" "}
                Posture
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Take our comprehensive assessment to understand your organization&apos;s 
                insider threat vulnerabilities and get expert recommendations for improvement.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/assessment">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8">
                <Link href="/benchmarks">
                  View Benchmarks
                </Link>
              </Button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              ✓ No registration required  ✓ Takes 5-10 minutes  ✓ Immediate results
            </p>
          </div>
        </div>
      </section>

      {/* The 5 Pillars */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The 5 Pillars of Insider Risk
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our assessment evaluates your organization across these critical areas
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => {
              const IconComponent = {
                Eye,
                Shield,
                Search,
                Key,
                ShieldAlert,
              }[pillar.icon] || Shield;
              
              return (
                <Card key={pillar.id} className="border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: pillar.color }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${pillar.color}20` }}
                      >
                        <IconComponent className="h-6 w-6" style={{ color: pillar.color }} />
                      </div>
                      <CardTitle className="text-lg">{pillar.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{pillar.description}</p>
                    <div className="mt-4">
                      <Badge variant="outline" style={{ color: pillar.color, borderColor: pillar.color }}>
                        {Math.round(pillar.weight * 100)}% Weight
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PlayCircle className="h-6 w-6 text-blue-600" />
              <Badge variant="secondary">Interactive Demo</Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Try Before You Assess
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience our assessment with these sample questions and see what your results could look like
            </p>
          </div>
          
          <AssessmentPreview />
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ResultsPreview />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Assessment?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built by security experts, backed by industry research
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by Organizations Worldwide
            </h2>
          </div>
          
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-blue-200">
                Assessments Completed
              </dt>
              <dd className="text-3xl font-bold text-white">
                {OVERALL_BENCHMARKS.totalAssessments.toLocaleString()}+
              </dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-blue-200">
                Average Score
              </dt>
              <dd className="text-3xl font-bold text-white">
                {OVERALL_BENCHMARKS.averageScore}
              </dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-blue-200">
                Industries Covered
              </dt>
              <dd className="text-3xl font-bold text-white">
                15+
              </dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-blue-200">
                Score Improvement
              </dt>
              <dd className="text-3xl font-bold text-white">
                +{OVERALL_BENCHMARKS.trends.scoreImprovement}%
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Take the first step toward better insider threat management
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/assessment">
                  Take Assessment Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8">
                <Link href="/research">
                  Browse Research
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to use
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Immediate results
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Expert recommendations
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}