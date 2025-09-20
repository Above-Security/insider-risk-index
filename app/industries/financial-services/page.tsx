import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge } from "@/components/ui/above-components";
import { Shield, DollarSign, AlertTriangle, TrendingUp, Users, Clock, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";
import { getFAQJsonLd, generateJsonLd } from "@/lib/seo";
import Script from "next/script";

export const metadata = {
  title: "Financial Services Insider Risk Management | Industry Solutions",
  description: "Specialized insider risk assessment and management solutions for financial services. Address regulatory compliance, data protection, and insider threats with industry-specific frameworks.",
  keywords: [
    "financial services insider risk",
    "banking insider threats",
    "financial compliance",
    "insider risk banking",
    "financial data protection",
    "regulatory compliance insider risk"
  ],
  openGraph: {
    title: "Financial Services Insider Risk Solutions",
    description: "Industry-specific insider risk management for financial services organizations",
    type: "website",
  },
};

export default function FinancialServicesPage() {
  // FAQ data optimized for AI platforms
  const financialServicesFAQs = [
    {
      question: "What insider risk challenges do financial services organizations face?",
      answer: "Financial services face unique insider risks including data theft of customer records, trading violations, regulatory compliance breaches, and privileged access misuse. The average incident cost in financial services is $758K according to Ponemon Institute research, with 70% involving privileged users."
    },
    {
      question: "How do financial services regulations impact insider risk management?",
      answer: "Financial regulations like SOX, PCI DSS, and Basel III require specific insider risk controls including access monitoring, transaction surveillance, and audit trails. Organizations must demonstrate continuous monitoring of privileged access and maintain detailed incident response documentation for regulatory compliance."
    },
    {
      question: "What are the most effective insider risk controls for banks?",
      answer: "Effective controls include privileged access management (PAM), user behavior analytics for trading systems, data loss prevention (DLP) for customer data, transaction monitoring for unusual patterns, and regular access reviews. Multi-factor authentication and least privilege access reduce insider risks by 61% in financial environments."
    },
    {
      question: "How can financial institutions measure insider risk maturity?",
      answer: "Financial institutions can assess maturity across 5 pillars: Visibility (monitoring trading systems and data access), Prevention (training and real-time coaching), Investigation (forensic capabilities), Identity (privileged access controls), and Phishing (social engineering defense). Our assessment provides industry-specific benchmarking against peers."
    },
    {
      question: "What compliance requirements address insider threats in banking?",
      answer: "Key requirements include SOX Section 404 (internal controls), PCI DSS (cardholder data protection), Basel III operational risk management, FFIEC guidance on privileged access, and SEC regulations for investment advisors. Regular risk assessments and continuous monitoring are mandatory for most financial institutions."
    }
  ];

  const faqJsonLd = getFAQJsonLd(financialServicesFAQs);

  // Industry-specific statistics based on research
  const industryStats = [
    {
      icon: DollarSign,
      value: "$758K",
      label: "Average incident cost",
      description: "Per insider threat incident in financial services",
      color: "text-red-600"
    },
    {
      icon: TrendingUp,
      value: "70%",
      label: "Involve privileged users",
      description: "Of financial insider incidents involve privileged access",
      color: "text-orange-600"
    },
    {
      icon: Shield,
      value: "61%",
      label: "Risk reduction",
      description: "Through multi-factor authentication implementation",
      color: "text-green-600"
    },
    {
      icon: Clock,
      value: "94 days",
      label: "Average containment",
      description: "Time to contain financial services incidents",
      color: "text-blue-600"
    }
  ];

  // Industry-specific challenges
  const challenges = [
    {
      icon: AlertTriangle,
      title: "Regulatory Compliance",
      description: "SOX, PCI DSS, Basel III, and FFIEC requirements demand continuous monitoring and detailed audit trails for insider activity.",
      impact: "Non-compliance penalties average $2.3M per violation"
    },
    {
      icon: DollarSign,
      title: "Trading System Risks",
      description: "Privileged access to trading systems creates opportunities for fraud, market manipulation, and unauthorized transactions.",
      impact: "Trading violations average $4.2M in losses and penalties"
    },
    {
      icon: Users,
      title: "Customer Data Protection",
      description: "Financial data theft impacts customer trust and triggers regulatory investigations with severe financial penalties.",
      impact: "Data breaches cost financial services $6.08M on average"
    },
    {
      icon: FileText,
      title: "Audit and Documentation",
      description: "Regulators require comprehensive documentation of insider risk controls, incident response, and access management processes.",
      impact: "Audit deficiencies can result in business restrictions"
    }
  ];

  // Solutions specific to financial services
  const solutions = [
    {
      title: "Privileged Access Monitoring",
      description: "Real-time monitoring of administrator and privileged user activities across trading systems, core banking platforms, and customer databases.",
      features: [
        "Trading system activity analysis",
        "Database access monitoring",
        "Administrative action tracking",
        "Regulatory reporting automation"
      ]
    },
    {
      title: "Transaction Surveillance",
      description: "Behavioral analytics to detect unusual trading patterns, unauthorized transactions, and potential market manipulation by insiders.",
      features: [
        "Trading pattern analysis",
        "Unusual transaction detection",
        "Market timing anomalies",
        "Cross-system correlation"
      ]
    },
    {
      title: "Compliance Automation",
      description: "Automated compliance monitoring and reporting for SOX, PCI DSS, Basel III, and other financial regulations.",
      features: [
        "SOX Section 404 compliance",
        "PCI DSS monitoring",
        "Basel III operational risk",
        "FFIEC guidance adherence"
      ]
    }
  ];

  return (
    <>
      <Script
        id="financial-services-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                Financial Services Industry
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                How can financial institutions manage insider risk effectively?
              </h1>
              <p className="text-xl leading-8 max-w-3xl mx-auto mb-8">
                Specialized insider risk management for financial services organizations. Address regulatory compliance,
                protect customer data, and monitor trading systems with industry-specific frameworks based on Ponemon Institute research.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AboveButton asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/assessment">Start Financial Services Assessment</Link>
                </AboveButton>
                <AboveButton asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/matrix">Explore Threat Matrix</Link>
                </AboveButton>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Statistics */}
        <section className={`${getSectionLayout('lg')} -mt-12`}>
          <div className={getPageLayout()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="bg-white shadow-lg border-t-4 border-blue-500">
                    <CardContent className="p-6 text-center">
                      <IconComponent className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                      <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                      <div className="font-semibold text-slate-900 mb-1">{stat.label}</div>
                      <div className="text-sm text-slate-600">{stat.description}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industry Challenges */}
        <section className={getSectionLayout('lg')}>
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What unique insider risk challenges do financial services face?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Financial institutions face specialized insider risks that require industry-specific controls and regulatory compliance measures.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {challenges.map((challenge, index) => {
                const IconComponent = challenge.icon;
                return (
                  <Card key={index} className="border-l-4 border-blue-500">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle>{challenge.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">{challenge.description}</p>
                      <div className="p-3 bg-red-50 rounded-lg border-l-2 border-red-200">
                        <p className="text-sm font-medium text-red-800">{challenge.impact}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className={`${getSectionLayout('lg')} bg-blue-50`}>
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How can financial institutions implement effective insider risk controls?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Industry-specific solutions designed for financial services regulatory requirements and operational environments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment CTA */}
        <section className={getSectionLayout('lg')}>
          <div className={getPageLayout()}>
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to assess your financial institution's insider risk posture?
                </h3>
                <p className="text-xl mb-8 text-blue-100">
                  Get industry-specific insights and regulatory compliance guidance with our specialized assessment for financial services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AboveButton asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Link href="/assessment">Start Assessment</Link>
                  </AboveButton>
                  <AboveButton asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link href="/playbooks">View Implementation Playbooks</Link>
                  </AboveButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}