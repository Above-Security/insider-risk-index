import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Target, 
  TrendingUp, 
  BookOpen,
  Award,
  Globe,
  Lock
} from "lucide-react";
import { pageMetadata, getFAQJsonLd } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata.about();

export default function AboutPage() {
  // FAQ data for rich snippets
  const faqs = [
    {
      question: "What is the Insider Risk Index?",
      answer: "The Insider Risk Index is a comprehensive assessment tool that measures organizational insider risk posture across 5 critical pillars: Visibility, Prevention & Coaching, Investigation & Evidence, Identity & SaaS, and Phishing Resilience. Based on industry research from Ponemon Institute 2025 and Gartner Market Guide G00805757.",
    },
    {
      question: "How is the assessment scored?",
      answer: "Our scoring uses research-validated weights: Visibility (25%), Prevention & Coaching (25%), Investigation & Evidence (20%), Identity & SaaS (15%), and Phishing Resilience (15%). Scores are mapped to 5 maturity levels from Ad Hoc to Optimized.",
    },
    {
      question: "Is the assessment free?",
      answer: "Yes, the Insider Risk Assessment is completely free with no registration required. You get immediate results with detailed analysis and recommendations.",
    },
    {
      question: "What research is this based on?",
      answer: "Our framework is built on the Ponemon Institute 2025 Cost of Insider Threats Report ($17.4M average annual cost), Gartner Market Guide for Insider Risk Management Solutions (G00805757), and Verizon 2024 DBIR analysis.",
    },
  ];

  const faqJsonLd = getFAQJsonLd(faqs);

  // Research foundation rather than specific team members
  const researchFoundation = [
    {
      name: "Research-Based Methodology",
      role: "Security Community Driven",
      bio: "Assessment framework developed from analysis of authoritative security research and industry incident data"
    }
  ];

  const methodology = [
    {
      icon: BookOpen,
      title: "Research-Based",
      description: "Built on analysis from Ponemon Institute 2025 ($17.4M cost study), Gartner Market Guide G00805757 (48% attack increase), and Verizon DBIR 2024 (68% breaches involve human element)."
    },
    {
      icon: Users,
      title: "Expert Validation", 
      description: "Methodology validated against ForScie Insider Threat Matrix community research covering 50+ documented attack techniques and patterns."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven",
      description: "Framework weights derived from economic impact analysis: visibility and prevention (25% each), investigation (20%), identity and phishing defense (15% each)."
    },
    {
      icon: Globe,
      title: "Industry Benchmarks",
      description: "Industry benchmarks derived from Ponemon Institute research across financial services ($758K avg incident cost), healthcare (70% internal breaches), and other industries."
    },
  ];

  const principles = [
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data is encrypted and never shared. We collect only what's necessary for benchmarking."
    },
    {
      icon: Award,
      title: "Actionable Results",
      description: "Every assessment provides specific, prioritized recommendations you can implement."
    },
    {
      icon: Target,
      title: "Practical Focus",
      description: "We focus on realistic, cost-effective solutions that work in real organizational environments."
    },
    {
      icon: Shield,
      title: "Continuous Improvement",
      description: "Our methodology evolves based on new threats, technologies, and industry feedback."
    },
  ];

  return (
    <div className="min-h-screen bg-above-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Research-Driven Assessment
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              About Insider Risk Index
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-3xl mx-auto">
              We help organizations understand and improve their insider risk posture through 
              comprehensive assessments, expert insights, and actionable recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-xl text-slate-600">
              To democratize access to world-class insider threat assessment capabilities, 
              helping organizations of all sizes build more secure and resilient environments.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-above-rose-100">
                <Shield className="h-6 w-6 text-above-rose-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Security First</h3>
              <p className="mt-2 text-slate-600">
                Built by security professionals for security professionals
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-above-blue-100">
                <Users className="h-6 w-6 text-above-blue-800" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Accessible</h3>
              <p className="mt-2 text-slate-600">
                Free assessments available to organizations of all sizes
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-above-lavender-100">
                <Target className="h-6 w-6 text-above-lavender-800" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Practical</h3>
              <p className="mt-2 text-slate-600">
                Actionable recommendations that drive real improvements
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-above-peach-100">
                <TrendingUp className="h-6 w-6 text-above-peach-800" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Evidence-Based</h3>
              <p className="mt-2 text-slate-600">
                Grounded in research and validated by industry data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-above-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Assessment Methodology
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Our 5-pillar framework is validated by real-world data from the Ponemon Institute, 
              Verizon DBIR, and enhanced with threat intelligence from the ForScie Insider Threat Matrix.
            </p>
          </div>

          {/* Pillar Framework */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">5-Pillar Framework</h3>
              <p className="text-slate-600">Industry-validated weightings based on cost impact analysis</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="text-center border-t-4 border-above-blue-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-above-rose-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-above-rose-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Visibility</h4>
                  <div className="text-2xl font-bold text-above-rose-600 mb-1">25%</div>
                  <p className="text-sm text-slate-600">Monitoring & Detection Capabilities</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-above-blue-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-above-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 text-above-blue-800" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Coaching</h4>
                  <div className="text-2xl font-bold text-above-blue-800 mb-1">25%</div>
                  <p className="text-sm text-slate-600">Prevention & Training Programs</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-above-lavender-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-above-lavender-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-above-lavender-800" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Evidence</h4>
                  <div className="text-2xl font-bold text-above-lavender-800 mb-1">20%</div>
                  <p className="text-sm text-slate-600">Investigation & Response</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-above-peach-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-above-peach-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-above-peach-800" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Identity</h4>
                  <div className="text-2xl font-bold text-above-peach-800 mb-1">15%</div>
                  <p className="text-sm text-slate-600">Access Controls & SaaS</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-above-rose-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-above-rose-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-6 w-6 text-above-rose-800" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Phishing</h4>
                  <div className="text-2xl font-bold text-above-rose-800 mb-1">15%</div>
                  <p className="text-sm text-slate-600">Social Engineering Defense</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {methodology.map((item) => (
              <Card key={item.title} className="border-t-4 border-above-blue-500">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-above-rose-50 rounded-lg">
                      <item.icon className="h-6 w-6 text-above-rose-600" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our Principles
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              The values that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-above-blue-100 rounded-lg">
                    <principle.icon className="h-6 w-6 text-slate-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-slate-600">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Research Foundation
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Our assessments are grounded in the latest industry research and threat intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-above-rose-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-above-rose-600" />
                </div>
                <CardTitle>Ponemon Institute 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Global Cost of Insider Threats study provides the economic foundation for our pillar weightings
                </p>
                <div className="bg-above-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">$17.4M</div>
                  <div className="text-sm text-slate-600">Average annual cost per organization</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-above-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-above-blue-800" />
                </div>
                <CardTitle>Verizon DBIR 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Data Breach Investigations Report informs our understanding of insider threat patterns
                </p>
                <div className="bg-above-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">68%</div>
                  <div className="text-sm text-slate-600">Breaches involve human element</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-above-lavender-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-above-lavender-800" />
                </div>
                <CardTitle>ForScie Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Community-driven threat intelligence enhances our recommendations with real-world techniques
                </p>
                <div className="bg-above-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">50+</div>
                  <div className="text-sm text-slate-600">Insider threat techniques cataloged</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-6">
              All research is properly attributed and cited in our methodology documentation
            </p>
            <Link href="/matrix" className="text-above-rose-600 hover:text-above-rose-800 font-medium">
              Explore the Insider Threat Matrix →
            </Link>
          </div>
        </div>
      </div>

      {/* Research Foundation Section */}
      <div className="bg-above-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Research Foundation
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built on authoritative security research and community-driven threat intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-1">
            {researchFoundation.map((item) => (
              <Card key={item.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-above-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-above-rose-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-above-rose-600 font-medium mb-3">{item.role}</p>
                  <p className="text-slate-600 text-sm">{item.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 text-sm mb-4">
              This assessment framework synthesizes insights from multiple authoritative sources rather than proprietary research.
              All data sources are properly attributed and citations are provided throughout the platform.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-slate-500">
              <span>• Ponemon Institute 2025</span>
              <span>• Gartner Market Guide G00805757</span>
              <span>• Verizon DBIR 2024</span>
              <span>• ForScie Matrix Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-above-rose-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-above-rose-100">
              Take your first step toward better insider risk management
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-above-white text-above-rose-600 hover:bg-above-rose-50">
                <Link href="/assessment">
                  Start Your Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}