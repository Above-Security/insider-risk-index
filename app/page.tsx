import Link from "next/link";
import { AboveButton } from "@/components/ui/above-components";
import { AboveLogoWithText } from "@/components/ui/above-logo";
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
import { getWebApplicationSchema, getHowToAssessmentSchema, getDatasetSchema, getSoftwareApplicationSchema } from "@/lib/enhanced-seo";
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

  const shadowAiJsonLd = getResearchArticleJsonLd({
    title: "Shadow AI and the Evolution of Insider Threats: A Critical Intelligence Assessment",
    description: "83% of organizations reported insider attacks in 2024 as AI amplifies threat capabilities. Analysis of recent incidents including Mercedes-Benz GitHub exposure, Marks & Spencer breach, and North Korean infiltration of AI companies.",
    slug: "shadow-ai-insider-threats-2025",
    publishDate: "2025-08-27",
    lastModified: "2025-08-27",
    tags: ["shadow AI", "insider threats", "artificial intelligence security", "threat intelligence", "malicious insiders"],
    author: "Insider Risk Index Research Team"
  });

  // Enhanced Schema.org markup for comprehensive AI/LLM visibility
  const webAppJsonLd = getWebApplicationSchema();
  const howToJsonLd = getHowToAssessmentSchema();
  const datasetJsonLd = getDatasetSchema();
  const softwareJsonLd = getSoftwareApplicationSchema();

  // FAQ Schema for Bing/ChatGPT optimization
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an insider risk assessment for organizations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An insider risk assessment is a comprehensive evaluation tool that measures your organization's vulnerability to insider threats across 5 critical pillars: Visibility & Monitoring, Prevention & Coaching, Investigation & Evidence, Identity & SaaS Management, and Phishing Resilience. Based on Ponemon Institute research showing $17.4M average annual cost of insider threats."
        }
      },
      {
        "@type": "Question", 
        "name": "How do I calculate my organization's insider risk index score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your Insider Risk Index (IRI) is calculated using a weighted scoring algorithm based on 20 evidence-based questions across 5 security pillars. The assessment takes 8-12 minutes and provides a 0-100 score with maturity levels from Ad Hoc (0-24) to Optimized (85-100), benchmarked against industry data."
        }
      },
      {
        "@type": "Question",
        "name": "What insider threat detection tools should small businesses use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small businesses should focus on foundational insider threat detection: endpoint monitoring (CrowdStrike, SentinelOne), user activity monitoring (Varonis, Forcepoint), email security (Proofpoint, Microsoft Defender), and privileged access management (CyberArk, BeyondTrust). Start with visibility and monitoring as the first pillar."
        }
      },
      {
        "@type": "Question",
        "name": "How much do insider threats cost organizations annually?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "According to Ponemon Institute 2025 research, insider threats cost organizations an average of $17.4M annually, with individual incidents costing $676,517 on average. Healthcare and financial services face higher costs due to regulatory compliance requirements and sensitive data exposure."
        }
      },
      {
        "@type": "Question",
        "name": "What are the 5 pillars of insider risk management?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 5 pillars are: 1) Visibility & Monitoring (25% weight) - detecting unusual behavior, 2) Prevention & Coaching (25%) - training and awareness, 3) Investigation & Evidence (20%) - incident response, 4) Identity & SaaS Management (15%) - access controls, 5) Phishing Resilience (15%) - social engineering defense."
        }
      }
    ]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shadowAiJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
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
                Free Insider Risk Assessment{" "}
                <span className="text-above-rose-700">for Organizations</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700">
                Calculate your organization's insider threat vulnerability in 8 minutes. Based on $17.4M average annual costs (Ponemon 2025) and 
                48% increase in insider attacks (Gartner G00805757). Get your Insider Risk Index score with actionable recommendations 
                from <Link href="/research" className="text-above-rose-700 hover:text-above-rose-800 font-medium underline underline-offset-2">evidence-based threat intelligence</Link>.
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

      {/* The 5 Pillars - Creative but Responsive Design */}
      <section className="relative bg-gradient-to-b from-above-white via-slate-50 to-above-blue-50 py-24 sm:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-above-rose-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-above-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-above-peach-200/15 rounded-full blur-3xl"></div>
        </div>

        <div className={getPageLayout()}>
          {/* Section Header */}
          <div className="relative z-10 mx-auto max-w-3xl text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex -space-x-2">
                <div className="w-3 h-3 rounded-full bg-above-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-above-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-above-peach-500"></div>
                <div className="w-3 h-3 rounded-full bg-above-lavender-500"></div>
                <div className="w-3 h-3 rounded-full bg-above-rose-600"></div>
              </div>
              <Badge variant="secondary" className="bg-white/80 text-slate-800 border-slate-200 backdrop-blur-sm">
                Security Framework
              </Badge>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              The 5 Pillars of
              <span className="bg-gradient-to-r from-above-rose-600 to-above-blue-700 bg-clip-text text-transparent"> Insider Risk</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              A comprehensive framework that evaluates your organization's defenses across 
              the most critical attack vectors, weighted by real-world impact
            </p>
          </div>

          {/* Pillars Layout - Creative Grid with Enhanced Design */}
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Desktop: 2-1-2 Layout, Mobile: Single Column */}
            <div className="space-y-8">
              {/* First Row - 2 Pillars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {PILLARS.slice(0, 2).map((pillar, index) => {
                  const IconComponent = {
                    Eye,
                    Shield,
                    Search,
                    Key,
                    ShieldAlert,
                  }[pillar.icon] || Shield;

                  const pillarStyles = [
                    { 
                      gradient: 'from-above-rose-500 to-above-rose-700',
                      bg: 'bg-above-rose-50',
                      border: 'border-above-rose-200',
                      icon: 'text-above-rose-700',
                      accent: 'bg-above-rose-100',
                      shadow: 'shadow-above-rose-500/10'
                    },
                    { 
                      gradient: 'from-above-blue-500 to-above-blue-700',
                      bg: 'bg-above-blue-50',
                      border: 'border-above-blue-200',
                      icon: 'text-above-blue-700',
                      accent: 'bg-above-blue-100',
                      shadow: 'shadow-above-blue-500/10'
                    }
                  ];
                  const style = pillarStyles[index];

                  return (
                    <div key={pillar.id} className="group">
                      <div className={`relative ${style.bg} ${style.border} ${style.shadow} border-2 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group-hover:bg-opacity-100 h-full`}>
                        {/* Pillar Number */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-white to-slate-100 rounded-full border-2 border-slate-300 flex items-center justify-center text-lg font-bold text-slate-700 shadow-lg">
                          {index + 1}
                        </div>
                        
                        {/* Weight Indicator */}
                        <div className="absolute -top-3 -right-3">
                          <div className={`px-4 py-2 bg-gradient-to-r ${style.gradient} text-white text-sm font-bold rounded-full shadow-lg transform rotate-12`}>
                            {Math.round(pillar.weight * 100)}%
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`w-16 h-16 ${style.accent} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-8 w-8 ${style.icon}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                            {pillar.name}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-600 leading-relaxed mb-6">
                            {pillar.description}
                          </p>

                          {/* Key Points */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient} mt-2 flex-shrink-0`}></div>
                              <span>
                                {index === 0 && "Monitor user behavior patterns, data access logs, and system activities for unusual or suspicious actions"}
                                {index === 1 && "Implement comprehensive training programs and security awareness campaigns for all employees"}
                              </span>
                            </div>
                          </div>

                          {/* Impact Level */}
                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Critical Impact</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`w-3 h-3 rounded-full ${
                                      level <= Math.ceil(pillar.weight * 20)
                                        ? `bg-gradient-to-r ${style.gradient}`
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center Pillar - Investigation & Evidence */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl group">
                  {(() => {
                    const pillar = PILLARS[2];
                    const IconComponent = Search;
                    const style = {
                      gradient: 'from-above-peach-500 to-above-peach-700',
                      bg: 'bg-above-peach-50',
                      border: 'border-above-peach-200',
                      icon: 'text-above-peach-700',
                      accent: 'bg-above-peach-100',
                      shadow: 'shadow-above-peach-500/10'
                    };

                    return (
                      <div className={`relative ${style.bg} ${style.border} ${style.shadow} border-2 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group-hover:bg-opacity-100`}>
                        {/* Central Hub Indicator */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs font-bold rounded-full shadow-lg">
                            CORE PILLAR
                          </div>
                        </div>

                        {/* Pillar Number */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-white to-slate-100 rounded-full border-2 border-slate-300 flex items-center justify-center text-lg font-bold text-slate-700 shadow-lg">
                          3
                        </div>
                        
                        {/* Weight Indicator */}
                        <div className="absolute -top-3 -right-3">
                          <div className={`px-4 py-2 bg-gradient-to-r ${style.gradient} text-white text-sm font-bold rounded-full shadow-lg transform rotate-12`}>
                            {Math.round(pillar.weight * 100)}%
                          </div>
                        </div>

                        <div className="text-center">
                          {/* Icon */}
                          <div className={`w-20 h-20 ${style.accent} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                            <IconComponent className={`h-10 w-10 ${style.icon}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            {pillar.name}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-600 leading-relaxed mb-6">
                            {pillar.description}
                          </p>

                          {/* Key Points */}
                          <div className="text-sm text-slate-600 mb-6">
                            <div className="flex items-center justify-center gap-3">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient}`}></div>
                              <span>Incident response procedures, forensic capabilities, and evidence preservation</span>
                            </div>
                          </div>

                          {/* Impact Level */}
                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-center gap-4">
                              <span className="text-sm font-medium text-slate-700">Critical Impact</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`w-3 h-3 rounded-full ${
                                      level <= Math.ceil(pillar.weight * 20)
                                        ? `bg-gradient-to-r ${style.gradient}`
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/40 to-transparent rounded-tr-3xl rounded-bl-2xl"></div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Row - 2 Pillars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {PILLARS.slice(3, 5).map((pillar, index) => {
                  const IconComponent = {
                    Key,
                    ShieldAlert,
                  }[pillar.icon] || Shield;

                  const pillarStyles = [
                    { 
                      gradient: 'from-above-lavender-500 to-above-lavender-700',
                      bg: 'bg-above-lavender-50',
                      border: 'border-above-lavender-200',
                      icon: 'text-above-lavender-700',
                      accent: 'bg-above-lavender-100',
                      shadow: 'shadow-above-lavender-500/10'
                    },
                    { 
                      gradient: 'from-red-500 to-red-700',
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      icon: 'text-red-700',
                      accent: 'bg-red-100',
                      shadow: 'shadow-red-500/10'
                    }
                  ];
                  const style = pillarStyles[index];

                  return (
                    <div key={pillar.id} className="group">
                      <div className={`relative ${style.bg} ${style.border} ${style.shadow} border-2 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group-hover:bg-opacity-100 h-full`}>
                        {/* Pillar Number */}
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-white to-slate-100 rounded-full border-2 border-slate-300 flex items-center justify-center text-lg font-bold text-slate-700 shadow-lg">
                          {index + 4}
                        </div>
                        
                        {/* Weight Indicator */}
                        <div className="absolute -top-3 -right-3">
                          <div className={`px-4 py-2 bg-gradient-to-r ${style.gradient} text-white text-sm font-bold rounded-full shadow-lg transform rotate-12`}>
                            {Math.round(pillar.weight * 100)}%
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`w-16 h-16 ${style.accent} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-8 w-8 ${style.icon}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                            {pillar.name}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-600 leading-relaxed mb-6">
                            {pillar.description}
                          </p>

                          {/* Key Points */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-sm text-slate-600">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient} mt-2 flex-shrink-0`}></div>
                              <span>
                                {index === 0 && "Manage user access controls, SaaS application permissions, and identity governance systems"}
                                {index === 1 && "Build resilience against email phishing, social engineering, and deceptive attack vectors"}
                              </span>
                            </div>
                          </div>

                          {/* Impact Level */}
                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Critical Impact</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`w-3 h-3 rounded-full ${
                                      level <= Math.ceil(pillar.weight * 20)
                                        ? `bg-gradient-to-r ${style.gradient}`
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="relative z-10 mt-16 max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Comprehensive Risk Assessment
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Each pillar is weighted based on real-world impact data from Ponemon Institute research. 
                Together, they provide a complete picture of your organization's insider risk posture.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-above-rose-500"></div>
                  <span className="text-slate-700">Detection & Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-above-blue-500"></div>
                  <span className="text-slate-700">Prevention & Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-above-peach-500"></div>
                  <span className="text-slate-700">Response & Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-above-lavender-500"></div>
                  <span className="text-slate-700">Access & Identity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-700">Social Engineering</span>
                </div>
              </div>
            </div>
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

          {/* Featured Research Articles */}
          <div className="space-y-8 mb-12">
            
            {/* Latest Article - Shadow AI */}
            <Card className="bg-white/80 border-above-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-above-blue-600" />
                      <Badge variant="outline" className="bg-above-blue-50 text-above-blue-700 border-above-blue-200">
                        Latest Intelligence
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        18 min read
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                      <Link 
                        href="/research/shadow-ai-insider-threats-2025"
                        className="hover:text-above-blue-700 transition-colors"
                      >
                        Shadow AI and the Evolution of Insider Threats: A Critical Intelligence Assessment
                      </Link>
                    </CardTitle>
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      83% of organizations reported insider attacks in 2024 as AI amplifies threat capabilities. 
                      Analysis of recent incidents including Mercedes-Benz GitHub exposure and North Korean infiltration of AI companies.
                    </p>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-above-blue-100 to-above-lavender-100 rounded-lg flex items-center justify-center">
                      <Eye className="h-10 w-10 text-above-blue-700" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Key Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-blue-700">83%</div>
                    <div className="text-xs text-slate-600">Organizations Attacked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-blue-700">27%</div>
                    <div className="text-xs text-slate-600">Shadow AI Data Exposure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-blue-700">$2.73M</div>
                    <div className="text-xs text-slate-600">Average Ransom</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-above-blue-700">93%</div>
                    <div className="text-xs text-slate-600">Expect AI Attacks 2025</div>
                  </div>
                </div>

                {/* Research Sources */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-900 mb-2">Authoritative Sources:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      IBM Security 2024
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      Google FACADE Research
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                      DFS AI Risk Assessment
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                      Trend Micro AI Report
                    </Badge>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-900 mb-3">Critical Intelligence:</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>North Korean actors</strong> use deepfake technology to infiltrate AI companies and steal data
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>80% of employees</strong> use unauthorized AI applications, creating massive shadow AI exposure
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">
                        <strong>Mercedes-Benz GitHub exposure</strong> revealed SSO passwords and system blueprints publicly
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Published August 27, 2025</span>
                    <span>•</span>
                    <span>Intelligence Assessment</span>
                  </div>
                  <AboveButton variant="outline" size="sm" asChild>
                    <Link href="/research/shadow-ai-insider-threats-2025">
                      Read Intelligence Report
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </AboveButton>
                </div>
              </CardContent>
            </Card>

            {/* Foundational Research - Original Report */}
            <Card className="bg-white/60 border-above-peach-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-5 w-5 text-above-peach-600" />
                      <Badge variant="outline" className="bg-above-peach-50 text-above-peach-700 border-above-peach-200">
                        Foundational Research
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        15 min read
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                      <Link 
                        href="/research/insider-threat-trends-2025"
                        className="hover:text-above-peach-700 transition-colors"
                      >
                        The Hidden Enemy: 2025 Insider Threat Intelligence Report
                      </Link>
                    </CardTitle>
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      Critical findings from 1,400+ organizations reveal the $17.4M annual cost. Comprehensive baseline 
                      analysis of attack patterns and defense strategies.
                    </p>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-above-peach-100 to-above-rose-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-8 w-8 text-above-peach-700" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Published August 26, 2025</span>
                    <span>•</span>
                    <span>Ponemon Institute • Gartner • Verizon DBIR</span>
                  </div>
                  <AboveButton variant="ghost" size="sm" asChild>
                    <Link href="/research/insider-threat-trends-2025">
                      View Report
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                <p className="text-slate-700 mb-4">
                  Access our complete library of insider threat research, industry reports, 
                  and threat intelligence analysis
                </p>
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <span>Research sponsored by</span>
                    <a 
                      href="https://abovesec.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-above-blue-800 hover:text-above-blue-600 font-medium transition-colors"
                    >
                      <AboveLogoWithText 
                        size="sm" 
                        textClassName="text-sm font-medium" 
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </div>
                </div>
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

      {/* FAQ Section for Bing/ChatGPT optimization */}
      <section className="py-24 bg-above-white">
        <div className={getPageLayout()}>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Common questions about insider risk assessment and threat management
              </p>
            </div>

            <div className="space-y-8">
              <details className="group bg-above-blue-50 rounded-lg border border-above-blue-200 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900">
                  What is an insider risk assessment for organizations?
                  <span className="ml-6 flex-shrink-0">+</span>
                </summary>
                <div className="mt-4 text-slate-700">
                  An insider risk assessment is a comprehensive evaluation tool that measures your organization's vulnerability to insider threats across 5 critical pillars: Visibility & Monitoring, Prevention & Coaching, Investigation & Evidence, Identity & SaaS Management, and Phishing Resilience. Based on Ponemon Institute research showing $17.4M average annual cost of insider threats.
                </div>
              </details>

              <details className="group bg-above-blue-50 rounded-lg border border-above-blue-200 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900">
                  How do I calculate my organization's insider risk index score?
                  <span className="ml-6 flex-shrink-0">+</span>
                </summary>
                <div className="mt-4 text-slate-700">
                  Your Insider Risk Index (IRI) is calculated using a weighted scoring algorithm based on 20 evidence-based questions across 5 security pillars. The assessment takes 8-12 minutes and provides a 0-100 score with maturity levels from Ad Hoc (0-24) to Optimized (85-100), benchmarked against industry data.
                </div>
              </details>

              <details className="group bg-above-blue-50 rounded-lg border border-above-blue-200 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900">
                  What insider threat detection tools should small businesses use?
                  <span className="ml-6 flex-shrink-0">+</span>
                </summary>
                <div className="mt-4 text-slate-700">
                  Small businesses should focus on foundational insider threat detection: endpoint monitoring (CrowdStrike, SentinelOne), user activity monitoring (Varonis, Forcepoint), email security (Proofpoint, Microsoft Defender), and privileged access management (CyberArk, BeyondTrust). Start with visibility and monitoring as the first pillar.
                </div>
              </details>

              <details className="group bg-above-blue-50 rounded-lg border border-above-blue-200 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900">
                  How much do insider threats cost organizations annually?
                  <span className="ml-6 flex-shrink-0">+</span>
                </summary>
                <div className="mt-4 text-slate-700">
                  According to Ponemon Institute 2025 research, insider threats cost organizations an average of $17.4M annually, with individual incidents costing $676,517 on average. Healthcare and financial services face higher costs due to regulatory compliance requirements and sensitive data exposure.
                </div>
              </details>

              <details className="group bg-above-blue-50 rounded-lg border border-above-blue-200 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900">
                  What are the 5 pillars of insider risk management?
                  <span className="ml-6 flex-shrink-0">+</span>
                </summary>
                <div className="mt-4 text-slate-700">
                  The 5 pillars are: 1) Visibility & Monitoring (25% weight) - detecting unusual behavior, 2) Prevention & Coaching (25%) - training and awareness, 3) Investigation & Evidence (20%) - incident response, 4) Identity & SaaS Management (15%) - access controls, 5) Phishing Resilience (15%) - social engineering defense.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}