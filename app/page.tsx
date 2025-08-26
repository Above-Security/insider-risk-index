import Link from "next/link";
import { AboveButton } from "@/components/ui/above-components";
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
import { PILLARS } from "@/lib/pillars";
import { pageMetadata } from "@/lib/seo";
import { AssessmentPreview } from "@/components/home/assessment-preview";
import { ResultsPreview } from "@/components/home/results-preview";
import { getPageLayout, getSectionLayout, getGridClass } from "@/lib/layout-utils";

export const metadata = pageMetadata.home();

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Comprehensive Assessment",
      description: "20 research-backed questions developed from Ponemon Institute 2025 and Gartner Market Guide analysis.",
    },
    {
      icon: TrendingUp,
      title: "Industry Benchmarks",
      description: "Compare against industry benchmarks derived from Ponemon Institute 2025 and Verizon DBIR 2024 research.",
    },
    {
      icon: Users,
      title: "Actionable Insights",
      description: "Receive Matrix-enhanced recommendations based on ForScie threat intelligence and expert analysis."
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
      <section className="grainy-gradient-subtle">
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-above-lavender-100 text-slate-800 border-above-lavender-200">
                Research-Based Assessment Framework
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Measure Your{" "}
                <span className="text-above-rose-700">Insider Risk</span>{" "}
                Posture
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700">
                Developed from analysis of $17.4M average annual insider threat costs (Ponemon 2025) and 
                48% increase in insider attacks (Gartner Market Guide G00805757). Get evidence-based insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AboveButton asChild size="lg" variant="default" className="text-lg px-8">
                <Link href="/assessment">
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AboveButton>
              
              <AboveButton variant="outline" size="lg" asChild className="text-lg px-8">
                <Link href="/benchmarks">
                  View Benchmarks
                </Link>
              </AboveButton>
            </div>
            
            <p className="mt-4 text-sm text-slate-600">
              ✓ No registration required  ✓ Takes 5-10 minutes  ✓ Immediate results
            </p>
          </div>
        </div>
      </section>

      {/* The 5 Pillars */}
      <section className={`bg-above-white ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              The 5 Pillars of Insider Risk
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Our assessment evaluates your organization across these critical areas
            </p>
          </div>
          
          <div className={`mt-16 ${getGridClass('cards', '1-2-3')}`}>
            {PILLARS.map((pillar, index) => {
              const IconComponent = {
                Eye,
                Shield,
                Search,
                Key,
                ShieldAlert,
              }[pillar.icon] || Shield;
              
              // Assign Above brand colors to pillars
              const pillarColors = [
                { bg: 'bg-above-rose-50', border: 'border-t-above-rose-400', icon: 'text-above-rose-700', accent: 'bg-above-rose-100' },
                { bg: 'bg-above-blue-50', border: 'border-t-above-blue-400', icon: 'text-above-blue-700', accent: 'bg-above-blue-100' },
                { bg: 'bg-above-peach-50', border: 'border-t-above-peach-400', icon: 'text-above-peach-700', accent: 'bg-above-peach-100' },
                { bg: 'bg-above-lavender-50', border: 'border-t-above-lavender-400', icon: 'text-above-lavender-700', accent: 'bg-above-lavender-100' },
                { bg: 'bg-above-rose-50', border: 'border-t-above-rose-500', icon: 'text-above-rose-800', accent: 'bg-above-rose-200' },
              ];
              const colors = pillarColors[index % pillarColors.length];
              
              return (
                <Card key={pillar.id} className={`${colors.bg} ${colors.border} border-t-4 hover:shadow-soft transition-all duration-300`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colors.accent}`}>
                        <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <CardTitle className="text-lg text-slate-900">{pillar.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{pillar.description}</p>
                    <div className="mt-4">
                      <Badge variant="outline" className={`border-current ${colors.icon} bg-white/50`}>
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
      <section className={`bg-above-white ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PlayCircle className="h-6 w-6 text-above-blue-800" />
              <Badge variant="secondary">Interactive Demo</Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Try Before You Assess
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Experience our assessment with these sample questions and see what your results could look like
            </p>
          </div>
          
          <AssessmentPreview />
        </div>
      </section>

      {/* Results Preview */}
      <section className={`bg-above-blue-50 ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <ResultsPreview />
        </div>
      </section>

      {/* Features */}
      <section className={`bg-above-white ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Our Assessment?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Based on Ponemon Institute, Gartner Market Guide G00805757, and Verizon DBIR research methodologies
            </p>
          </div>
          
          <div className={`mt-16 ${getGridClass('cards', '1-2-4')}`}>
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-above-blue-100">
                  <feature.icon className="h-6 w-6 text-above-blue-800" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`bg-above-blue-800 ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Research-Backed Industry Data
            </h2>
            <p className="mt-4 text-lg text-above-blue-100 max-w-3xl mx-auto">
              Our assessment framework is built on comprehensive analysis from leading security research organizations
            </p>
          </div>
          
          <dl className={`mt-16 ${getGridClass('metrics', '2-4')}`}>
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-above-blue-200">
                Annual Cost Impact
              </dt>
              <dd className="text-3xl font-bold text-white">
                $17.4M
              </dd>
              <dd className="text-xs text-above-blue-200">Average per organization (Ponemon 2025)</dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-above-blue-200">
                Programs Ineffective
              </dt>
              <dd className="text-3xl font-bold text-white">
                54%
              </dd>
              <dd className="text-xs text-above-blue-200">Report less than effective results (Gartner)</dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-above-blue-200">
                Attack Frequency Increase
              </dt>
              <dd className="text-3xl font-bold text-white">
                48%
              </dd>
              <dd className="text-xs text-above-blue-200">Organizations report more frequent attacks (Gartner)</dd>
            </div>
            
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-above-blue-200">
                Containment Time
              </dt>
              <dd className="text-3xl font-bold text-white">
                81 days
              </dd>
              <dd className="text-xs text-above-blue-200">Average incident containment (Ponemon 2025)</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-above-white ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Take the first step toward better insider threat management
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AboveButton asChild size="lg" variant="default" className="text-lg px-8">
                <Link href="/assessment">
                  Take Assessment Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AboveButton>
              
              <AboveButton variant="outline" size="lg" asChild className="text-lg px-8">
                <Link href="/research">
                  Browse Research
                </Link>
              </AboveButton>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-above-blue-500" />
                Free to use
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-above-blue-500" />
                Immediate results
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-above-blue-500" />
                Expert recommendations
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}