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
  PlayCircle,
  BookOpen,
  ExternalLink,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { PILLARS } from "@/lib/pillars";
import { pageMetadata, getProductJsonLd, getResearchArticleJsonLd, getOrganizationJsonLd } from "@/lib/seo";
import { AssessmentPreview } from "@/components/home/assessment-preview";
import { ResultsPreview } from "@/components/home/results-preview";
import { getPageLayout, getSectionLayout, getGridClass } from "@/lib/layout-utils";

export const metadata = pageMetadata.home();

export default function HomePage() {
  const productJsonLd = getProductJsonLd({
    name: "Insider Risk Index Assessment",
    description: "Free comprehensive assessment tool measuring organizational insider risk posture across 5 critical pillars. Get actionable insights and industry benchmarks based on Ponemon Institute and Gartner research.",
    url: "https://insiderisk.io/assessment",
    price: "0",
    currency: "USD"
  });

  const organizationJsonLd = getOrganizationJsonLd();

  const researchJsonLd = getResearchArticleJsonLd({
    title: "The Hidden Enemy: 2025 Insider Threat Intelligence Report",
    description: "Critical findings from 1,400+ organizations reveal the $17.4M annual cost of insider threats. Comprehensive analysis of attack patterns, detection failures, and defense strategies based on Verizon DBIR, Ponemon Institute, and Gartner research.",
    slug: "insider-threat-trends-2025",
    publishDate: "2025-08-26",
    lastModified: "2025-08-26",
    tags: ["insider threats", "cybersecurity research", "threat intelligence", "data security", "risk management"],
    author: "Insider Risk Index Research Team"
  });

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(researchJsonLd) }}
      />
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
                48% increase in insider attacks (Gartner Market Guide G00805757). Get evidence-based insights 
                backed by comprehensive <Link href="/research" className="text-above-rose-700 hover:text-above-rose-800 font-medium underline underline-offset-2">threat intelligence research</Link>.
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

      {/* Featured Research Section */}
      <section className={`bg-gradient-to-br from-above-peach-50 via-white to-above-lavender-50 ${getSectionLayout('lg')}`}>
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-above-peach-700" />
              <Badge variant="secondary" className="bg-above-peach-100 text-above-peach-800 border-above-peach-200">
                Latest Research
              </Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Evidence-Based Insider Risk Intelligence
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Our comprehensive analysis of 1,400+ organizations reveals critical trends and actionable insights 
              based on authoritative security research
            </p>
          </div>

          {/* Featured Research Article */}
          <div className="mb-12">
            <Card className="bg-white/80 border-above-peach-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-above-rose-600" />
                      <Badge variant="outline" className="bg-above-rose-50 text-above-rose-700 border-above-rose-200">
                        Critical Intelligence
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        15 min read
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                      <Link 
                        href="/research/insider-threat-trends-2025"
                        className="hover:text-above-peach-700 transition-colors"
                      >
                        The Hidden Enemy: 2025 Insider Threat Intelligence Report
                      </Link>
                    </CardTitle>
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      Critical findings reveal the $17.4M annual cost of insider threats. Comprehensive analysis 
                      of attack patterns, detection failures, and defense strategies based on 1,400+ organizations.
                    </p>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-above-rose-100 to-above-peach-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-10 w-10 text-above-rose-700" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Key Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-rose-700">$17.4M</div>
                    <div className="text-xs text-slate-600">Annual Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-rose-700">48%</div>
                    <div className="text-xs text-slate-600">Attack Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-rose-700">81</div>
                    <div className="text-xs text-slate-600">Days to Contain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-rose-700">1,400+</div>
                    <div className="text-xs text-slate-600">Organizations</div>
                  </div>
                </div>

                {/* Research Sources */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-900 mb-2">Authoritative Sources:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      Ponemon Institute 2025
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      Verizon DBIR 2024
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                      Gartner G00805757
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                      ForScie Matrix
                    </Badge>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-900 mb-3">Key Research Findings:</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>68% of security breaches</strong> involve human elements, fundamentally shifting defense requirements
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>54% of insider threat programs</strong> report less than effective results (Gartner research)
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>Healthcare organizations</strong> face 70% internal breach rate, highest among all sectors
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Published August 26, 2025</span>
                    <span>•</span>
                    <span>Research Team Analysis</span>
                  </div>
                  <AboveButton variant="outline" size="sm" asChild>
                    <Link href="/research/insider-threat-trends-2025">
                      Read Full Report
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </AboveButton>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Hub CTA */}
          <div className="text-center">
            <Card className="bg-above-peach-100/50 border-above-peach-200 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BookOpen className="h-6 w-6 text-above-peach-700" />
                  <h3 className="text-xl font-bold text-slate-900">Research Hub</h3>
                </div>
                <p className="text-slate-700 mb-6">
                  Access our complete library of insider threat research, industry reports, 
                  and threat intelligence analysis
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <AboveButton variant="default" size="lg" asChild>
                    <Link href="/research">
                      Browse All Research
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </AboveButton>
                  <AboveButton variant="outline" size="lg" asChild>
                    <Link href="/matrix">
                      Explore Threat Matrix
                    </Link>
                  </AboveButton>
                </div>
              </CardContent>
            </Card>
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
              Built on authoritative research from <Link href="/research" className="text-above-rose-700 hover:text-above-rose-800 font-medium underline underline-offset-2">Ponemon Institute 2025</Link>, 
              Gartner Market Guide G00805757, Verizon DBIR 2024, and <Link href="/matrix" className="text-above-blue-700 hover:text-above-blue-800 font-medium underline underline-offset-2">ForScie Threat Matrix</Link>
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
    </>
  );
}