import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  BarChart3,
  FileText,
  Users,
  Shield,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";

export const metadata: Metadata = {
  title: "How Does Insider Risk Assessment Work? | Step-by-Step Guide",
  description: "Learn how our free 8-minute insider risk assessment works. Understand the 5-pillar framework, scoring methodology, and how to get actionable insights for your organization.",
  keywords: ["how insider risk assessment works", "assessment methodology", "insider threat evaluation", "security assessment process", "risk scoring", "5-pillar framework"],
  openGraph: {
    title: "How Does Insider Risk Assessment Work?",
    description: "Step-by-step guide to our free insider risk assessment process",
    type: "article",
  },
};

export default function HowItWorksPage() {
  // Enhanced FAQ Schema for AI optimization
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does an insider risk assessment work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our insider risk assessment works in 3 simple steps: 1) Answer 20 evidence-based questions across 5 security pillars (8-10 minutes), 2) Get your Insider Risk Index score (0-100) with maturity level, 3) Receive personalized recommendations based on your results. The assessment is free, requires no registration, and provides immediate results."
        }
      },
      {
        "@type": "Question",
        "name": "What questions are included in the insider risk assessment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The assessment includes 20 questions across 5 pillars: Visibility & Monitoring (5 questions), Prevention & Coaching (5 questions), Investigation & Evidence (4 questions), Identity & SaaS Management (3 questions), and Phishing Resilience (3 questions). Questions cover tools, processes, policies, and capabilities based on industry best practices."
        }
      },
      {
        "@type": "Question",
        "name": "How is my insider risk score calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your score is calculated using weighted methodology: Visibility & Monitoring (25%), Prevention & Coaching (25%), Investigation & Evidence (20%), Identity & SaaS Management (15%), and Phishing Resilience (15%). Scores range from 0-100 with maturity levels: Ad Hoc (0-24), Emerging (25-44), Managed (45-64), Proactive (65-84), and Optimized (85-100)."
        }
      },
      {
        "@type": "Question",
        "name": "What do I get after completing the assessment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After completing the assessment, you receive: 1) Your Insider Risk Index score and maturity level, 2) Detailed breakdown across all 5 pillars, 3) Industry benchmarking showing how you compare to peers, 4) Personalized recommendations for improvement, 5) Optional PDF report for sharing with stakeholders."
        }
      }
    ]
  };

  const steps = [
    {
      number: "01",
      title: "How do I start the assessment?",
      description: "Begin with basic organization details including industry, company size, and optional contact information. This takes 1-2 minutes and helps us benchmark your results.",
      icon: Users,
      time: "1-2 min",
      color: "bg-above-rose-500"
    },
    {
      number: "02",
      title: "What questions will I answer?",
      description: "Answer 20 evidence-based questions across 5 security pillars. Each question includes context and examples to help you provide accurate responses.",
      icon: CheckCircle,
      time: "6-8 min",
      color: "bg-above-blue-500"
    },
    {
      number: "03",
      title: "How do I see my results?",
      description: "Get immediate results with your Insider Risk Index score, maturity level, pillar breakdown, industry benchmarks, and personalized recommendations.",
      icon: BarChart3,
      time: "Instant",
      color: "bg-above-peach-500"
    }
  ];

  const pillars = [
    {
      name: "Visibility & Monitoring",
      weight: "25%",
      description: "How effectively can you detect unusual user behavior and potential insider threats?",
      questions: [
        "User activity monitoring capabilities",
        "Behavioral analytics implementation",
        "Real-time alerting systems",
        "Data access monitoring",
        "Anomaly detection tools"
      ]
    },
    {
      name: "Prevention & Coaching",
      weight: "25%",
      description: "How well do you prevent insider threats through training and real-time intervention?",
      questions: [
        "Security awareness training",
        "Real-time coaching capabilities",
        "Policy communication",
        "Intervention strategies",
        "User education programs"
      ]
    },
    {
      name: "Investigation & Evidence",
      weight: "20%",
      description: "How prepared are you to investigate incidents and collect forensic evidence?",
      questions: [
        "Incident response capabilities",
        "Evidence collection tools",
        "Investigation workflows",
        "Forensic analysis tools"
      ]
    },
    {
      name: "Identity & SaaS Management",
      weight: "15%",
      description: "How well do you control access to systems and monitor SaaS applications?",
      questions: [
        "Privileged access management",
        "SaaS application monitoring",
        "OAuth application control"
      ]
    },
    {
      name: "Phishing Resilience",
      weight: "15%",
      description: "How protected are you against social engineering and phishing attacks?",
      questions: [
        "Email security controls",
        "Phishing simulation programs",
        "Social engineering awareness"
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-24">
          <div className={getPageLayout()}>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Assessment Guide
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                How does insider risk assessment work?
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Our free 8-minute assessment evaluates your organization's insider threat posture across 5 research-validated pillars. Learn exactly how it works and what you'll discover.
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/assessment">
                    Start Your Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-16">
          <div className={getPageLayout()}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How does the assessment process work?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Three simple steps to understand your insider risk posture
              </p>
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="relative">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                          {step.number}
                        </div>
                      </div>

                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                          <IconComponent className="h-6 w-6 text-slate-600" />
                          <Badge variant="outline">{step.time}</Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                          {step.title}
                        </h3>
                        <p className="text-lg text-slate-600 max-w-2xl">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute left-8 top-20 w-0.5 h-12 bg-slate-200"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* The 5 Pillars Detailed */}
        <section className="py-16 bg-white">
          <div className={getPageLayout()}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What does the 5-pillar framework evaluate?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Each pillar represents a critical aspect of insider risk management, weighted by real-world impact and industry research
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {pillars.map((pillar, index) => (
                <Card key={pillar.name} className="border-t-4 border-above-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{pillar.name}</CardTitle>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {pillar.weight}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{pillar.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-900 mb-3">
                        Key areas evaluated:
                      </div>
                      <ul className="space-y-2">
                        {pillar.questions.map((question, qIndex) => (
                          <li key={qIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-above-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Scoring Methodology */}
        <section className="py-16 bg-slate-50">
          <div className={getPageLayout()}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  How is my insider risk score calculated?
                </h2>
                <p className="text-lg text-slate-600">
                  Your Insider Risk Index uses research-validated weights based on economic impact analysis
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Scoring Formula</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Visibility & Monitoring</span>
                          <span className="font-bold text-above-rose-600">25%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Prevention & Coaching</span>
                          <span className="font-bold text-above-blue-600">25%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Investigation & Evidence</span>
                          <span className="font-bold text-above-lavender-600">20%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Identity & SaaS</span>
                          <span className="font-bold text-above-peach-600">15%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Phishing Resilience</span>
                          <span className="font-bold text-above-rose-600">15%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Maturity Levels</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Optimized</span>
                          <span className="font-bold text-green-600">85-100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Proactive</span>
                          <span className="font-bold text-blue-600">65-84</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Managed</span>
                          <span className="font-bold text-yellow-600">45-64</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Emerging</span>
                          <span className="font-bold text-orange-600">25-44</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Ad Hoc</span>
                          <span className="font-bold text-red-600">0-24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-white">
          <div className={getPageLayout()}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What do I get after completing the assessment?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Comprehensive insights and actionable recommendations delivered instantly
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-above-rose-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-above-rose-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Your IRI Score</h3>
                  <p className="text-sm text-slate-600">0-100 score with maturity level and risk classification</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-above-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-above-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Pillar Breakdown</h3>
                  <p className="text-sm text-slate-600">Detailed scores across all 5 security pillars</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-above-peach-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-6 w-6 text-above-peach-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Industry Benchmarks</h3>
                  <p className="text-sm text-slate-600">Compare your results against industry peers</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-above-lavender-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-above-lavender-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Action Plan</h3>
                  <p className="text-sm text-slate-600">Prioritized recommendations and implementation guides</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50" itemScope itemType="https://schema.org/FAQPage">
          <div className={getPageLayout()}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-slate-600">
                  Common questions about how our insider risk assessment works
                </p>
              </div>

              <div className="space-y-6">
                {faqJsonLd.mainEntity.map((faq, index) => (
                  <Card key={index} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3" itemProp="name">
                        {faq.name}
                      </h3>
                      <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <p className="text-slate-600" itemProp="text">
                          {faq.acceptedAnswer.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-above-rose-600">
          <div className={getPageLayout()}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to assess your insider risk?
              </h2>
              <p className="text-xl text-above-rose-100 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations who have discovered their insider risk posture with our free assessment
              </p>
              <Button asChild size="lg" className="bg-white text-above-rose-600 hover:bg-above-rose-50 text-lg px-8">
                <Link href="/assessment">
                  Start Your Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}