import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AboveButton, AboveBadge } from "@/components/ui/above-components";
import { Heart, Shield, AlertTriangle, FileText, Users, Clock, Lock, CheckCircle, Activity } from "lucide-react";
import Link from "next/link";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";
import { getFAQJsonLd, generateJsonLd } from "@/lib/seo";
import Script from "next/script";

export const metadata = {
  title: "Healthcare Insider Risk Management | HIPAA Compliance & Patient Data Protection",
  description: "Specialized insider risk assessment for healthcare organizations. Address HIPAA compliance, protect patient data, and manage clinical system access with industry-specific frameworks.",
  keywords: [
    "healthcare insider risk",
    "HIPAA compliance insider threats",
    "patient data protection",
    "medical records security",
    "healthcare data breaches",
    "clinical system security",
    "hospital insider risk management"
  ],
  openGraph: {
    title: "Healthcare Insider Risk Solutions - HIPAA Compliant",
    description: "Industry-specific insider risk management for healthcare providers and organizations",
    type: "website",
  },
};

export default function HealthcarePage() {
  // FAQ data optimized for AI platforms with healthcare-specific content
  const healthcareFAQs = [
    {
      question: "What insider risks are unique to healthcare organizations?",
      answer: "Healthcare faces distinctive insider risks with 70% of data breaches originating internally according to Verizon DBIR 2024. Key risks include unauthorized access to patient records, medical identity theft, prescription fraud, and clinical system misuse. Healthcare organizations must protect PHI (Protected Health Information) while maintaining accessibility for patient care."
    },
    {
      question: "How does HIPAA impact insider risk management in healthcare?",
      answer: "HIPAA requires specific safeguards for PHI including access controls, audit logs, and breach notification procedures. Healthcare organizations must implement minimum necessary access, conduct regular risk assessments, maintain audit trails for all PHI access, and report breaches within 60 days. Non-compliance can result in penalties ranging from $100 to $50,000 per violation."
    },
    {
      question: "What are effective insider risk controls for hospitals and clinics?",
      answer: "Effective controls include role-based access control (RBAC) for clinical systems, user behavior analytics for EMR/EHR access patterns, break-glass procedures for emergency access, regular access reviews for terminated employees, and encryption for data at rest and in transit. Multi-factor authentication reduces unauthorized access by 61% in healthcare environments."
    },
    {
      question: "How can healthcare organizations detect insider threats in clinical systems?",
      answer: "Detection strategies include monitoring unusual patient record access patterns, tracking after-hours system usage, identifying VIP record snooping, detecting bulk data downloads, and analyzing prescription system anomalies. User behavior analytics can identify 96.4% of abnormal access patterns according to industry research."
    },
    {
      question: "What compliance frameworks address healthcare insider risks?",
      answer: "Key frameworks include HIPAA Security Rule for administrative, physical, and technical safeguards; HITECH Act for breach notification and meaningful use; ISO 27799 for health informatics security; Joint Commission standards for information management; and state-specific medical privacy laws. Regular assessments ensure compliance across all frameworks."
    }
  ];

  const faqJsonLd = getFAQJsonLd(healthcareFAQs);

  // Healthcare-specific statistics from verified research
  const industryStats = [
    {
      icon: Heart,
      value: "70%",
      label: "Internal breaches",
      description: "Of healthcare breaches originate from insiders (Verizon DBIR 2024)",
      color: "text-red-600"
    },
    {
      icon: Shield,
      value: "$10.93M",
      label: "Average breach cost",
      description: "Highest among all industries for data breaches",
      color: "text-orange-600"
    },
    {
      icon: Clock,
      value: "329 days",
      label: "Detection time",
      description: "Average time to identify and contain healthcare breaches",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      value: "4.3x",
      label: "Target rate",
      description: "More likely to be targeted than other industries",
      color: "text-purple-600"
    }
  ];

  // Healthcare-specific challenges
  const challenges = [
    {
      icon: Lock,
      title: "HIPAA Compliance Requirements",
      description: "Strict regulations require comprehensive safeguards for PHI, including access controls, encryption, audit logs, and breach notification within 60 days.",
      impact: "HIPAA violations can result in fines up to $2M per violation annually",
      source: "HIPAA Security Rule, HITECH Act requirements"
    },
    {
      icon: Activity,
      title: "Clinical System Complexity",
      description: "Multiple interconnected systems (EMR, EHR, PACS, lab systems) create numerous access points and increase the risk of unauthorized data exposure.",
      impact: "Complex environments have 2.5x higher breach risk",
      source: "Healthcare system integration challenges"
    },
    {
      icon: Users,
      title: "Workforce Access Management",
      description: "High turnover rates, rotating staff, and contractors create challenges in maintaining appropriate access controls and de-provisioning.",
      impact: "29% of breaches involve former employees with active access",
      source: "Healthcare workforce dynamics research"
    },
    {
      icon: AlertTriangle,
      title: "Patient Record Snooping",
      description: "Curiosity-driven access to celebrity or acquaintance records represents a significant insider threat unique to healthcare.",
      impact: "Average HIPAA penalty for snooping: $1.5M per incident",
      source: "OCR enforcement data"
    }
  ];

  // Healthcare-specific solutions
  const solutions = [
    {
      title: "EMR/EHR Access Monitoring",
      description: "Real-time monitoring of electronic medical record access with behavioral analytics to detect unusual patterns and potential PHI breaches.",
      features: [
        "Patient record access tracking",
        "VIP/celebrity record alerts",
        "Break-glass access monitoring",
        "Unusual volume detection",
        "After-hours access alerts"
      ],
      compliance: "HIPAA Security Rule §164.308(a)(1)(ii)(D)"
    },
    {
      title: "Clinical Workforce IAM",
      description: "Identity and access management tailored for healthcare environments with role-based controls aligned to clinical workflows.",
      features: [
        "Role-based access control (RBAC)",
        "Automated de-provisioning",
        "Privileged access management",
        "Contractor access controls",
        "Department-based permissions"
      ],
      compliance: "HIPAA §164.308(a)(4) - Access Management"
    },
    {
      title: "HIPAA Compliance Automation",
      description: "Automated compliance monitoring and reporting for HIPAA, HITECH, and other healthcare regulations with audit trail management.",
      features: [
        "Automated audit logging",
        "Risk assessment workflows",
        "Breach notification tracking",
        "Security incident management",
        "Compliance dashboard reporting"
      ],
      compliance: "HIPAA §164.308(a)(8) - Evaluation"
    }
  ];

  // Best practices specific to healthcare
  const bestPractices = [
    {
      title: "Implement Zero Trust for Clinical Systems",
      description: "Never trust, always verify - especially for PHI access",
      benefit: "Reduces unauthorized access by 75%"
    },
    {
      title: "Deploy User Behavior Analytics",
      description: "Monitor for anomalous access patterns in real-time",
      benefit: "Detects 96.4% of insider threats"
    },
    {
      title: "Conduct Regular Access Reviews",
      description: "Quarterly reviews of user permissions and access rights",
      benefit: "Identifies 89% of excessive privileges"
    },
    {
      title: "Enable Break-Glass Procedures",
      description: "Emergency access with enhanced logging and review",
      benefit: "Maintains care continuity while ensuring security"
    }
  ];

  return (
    <>
      <Script
        id="healthcare-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-r from-teal-600 to-blue-700 text-white">
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                Healthcare Industry Solutions
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                How can healthcare organizations protect patient data from insider threats?
              </h1>
              <p className="text-xl leading-8 max-w-3xl mx-auto mb-8">
                Specialized insider risk management for healthcare providers addressing HIPAA compliance, patient data protection,
                and clinical system security. With 70% of healthcare breaches originating internally (Verizon DBIR 2024),
                comprehensive insider risk management is critical.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AboveButton asChild size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                  <Link href="/assessment">Start Healthcare Assessment</Link>
                </AboveButton>
                <AboveButton asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/playbooks">View HIPAA Compliance Playbooks</Link>
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
                  <Card key={index} className="bg-white shadow-lg border-t-4 border-teal-500">
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

        {/* Healthcare Challenges */}
        <section className={getSectionLayout('lg')}>
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What unique insider risk challenges do healthcare organizations face?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Healthcare organizations must balance patient care accessibility with strict privacy requirements
                and complex regulatory compliance while managing diverse workforce access needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {challenges.map((challenge, index) => {
                const IconComponent = challenge.icon;
                return (
                  <Card key={index} className="border-l-4 border-teal-500">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-teal-600" />
                        </div>
                        <CardTitle>{challenge.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">{challenge.description}</p>
                      <div className="p-3 bg-red-50 rounded-lg border-l-2 border-red-200">
                        <p className="text-sm font-medium text-red-800">{challenge.impact}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Source: {challenge.source}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className={`${getSectionLayout('lg')} bg-teal-50`}>
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How can healthcare providers implement HIPAA-compliant insider risk controls?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Industry-specific solutions designed for healthcare regulatory requirements, clinical workflows,
                and patient data protection needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {solution.compliance}
                    </Badge>
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

        {/* Best Practices */}
        <section className={getSectionLayout('lg')}>
          <div className={getPageLayout()}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What are healthcare insider risk management best practices?
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Evidence-based strategies proven to reduce insider threats in healthcare environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{practice.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-3">{practice.description}</p>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        {practice.benefit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment CTA */}
        <section className={getSectionLayout('lg')}>
          <div className={getPageLayout()}>
            <Card className="bg-gradient-to-r from-teal-600 to-blue-700 text-white">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-white/90 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Ready to protect patient data and ensure HIPAA compliance?
                </h3>
                <p className="text-xl mb-8 text-teal-100">
                  Get healthcare-specific insights with our specialized assessment addressing clinical system risks,
                  PHI protection, and regulatory compliance requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AboveButton asChild size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                    <Link href="/assessment">Start Healthcare Assessment</Link>
                  </AboveButton>
                  <AboveButton asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link href="/research">View Healthcare Research</Link>
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