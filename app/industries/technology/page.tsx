import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, TrendingUp, AlertTriangle, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Technology Industry Insider Risk Assessment | Cybersecurity Challenges & Solutions',
  description: 'Comprehensive insider risk assessment for technology companies. 39% of tech organizations cite complex IT environments as the primary driver of insider attacks. Take our 5-minute assessment.',
  keywords: 'technology insider threats, tech company security assessment, software industry cybersecurity, IT security risk management, technology sector insider risk',
  openGraph: {
    title: 'Technology Industry Insider Risk Assessment | Specialized Cybersecurity Solutions',
    description: 'Technology companies face unique insider threats from complex IT environments. 37% report technological complexity as a key attack driver. Get your personalized risk assessment.',
    type: 'website',
    siteName: 'InsiderRisk Index'
  },
  alternates: {
    canonical: 'https://insiderisk.io/industries/technology'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Technology Industry Insider Risk Assessment and Management',
  description: 'Comprehensive analysis of insider threats in the technology sector, including statistics on complex IT environments, technological complexity drivers, and specialized risk management solutions.',
  author: {
    '@type': 'Organization',
    name: 'Above Security',
    url: 'https://abovesec.com'
  },
  publisher: {
    '@type': 'Organization',
    name: 'InsiderRisk Index',
    logo: {
      '@type': 'ImageObject',
      url: 'https://insiderisk.io/logo.png'
    }
  },
  datePublished: '2025-01-15',
  dateModified: '2025-01-15',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://insiderisk.io/industries/technology'
  },
  about: {
    '@type': 'Thing',
    name: 'Technology Industry Insider Threats',
    description: 'Insider security risks and management strategies specific to technology companies'
  },
  mentions: [
    {
      '@type': 'ResearchProject',
      name: 'Gartner Market Guide for Insider Risk Management Solutions 2025',
      identifier: 'G00805757',
      author: 'Brent Predovich, Deepti Gopal'
    },
    {
      '@type': 'ResearchProject',
      name: 'Gurucul 2024 Insider Threat Report',
      author: 'Cybersecurity Insiders'
    }
  ]
}

const technologyStats = [
  {
    stat: "39%",
    description: "of organizations report complex IT environments as the primary driver of insider attacks",
    source: "Gurucul 2024 Insider Threat Report",
    icon: <Shield className="h-8 w-8 text-blue-600" />
  },
  {
    stat: "37%",
    description: "cite technological complexity and adoption of new technologies like IoT and AI as attack enablers",
    source: "Gurucul 2024 Insider Threat Report",
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />
  },
  {
    stat: "48%",
    description: "of technology organizations experienced increased insider attacks over the past 12 months",
    source: "Gurucul 2024 Insider Threat Report",
    icon: <AlertTriangle className="h-8 w-8 text-red-600" />
  },
  {
    stat: "71%",
    description: "of technology companies feel at least moderately vulnerable to insider threats",
    source: "Gurucul 2024 Insider Threat Report",
    icon: <Users className="h-8 w-8 text-orange-600" />
  }
]

const techChallenges = [
  {
    title: "Complex Cloud & Hybrid Environments",
    description: "Multi-cloud architectures and hybrid work models create visibility gaps and expanded attack surfaces for malicious insiders.",
    impact: "39% identify this as the top insider threat driver",
    solutions: ["Zero Trust Architecture", "Unified SIEM/SOAR Platforms", "Cloud Security Posture Management"]
  },
  {
    title: "Rapid Technology Adoption",
    description: "Implementation of AI, IoT, and emerging technologies often outpaces security controls and employee training.",
    impact: "37% cite technological complexity as key risk factor",
    solutions: ["Technology Risk Assessments", "DevSecOps Integration", "Continuous Security Training"]
  },
  {
    title: "Software Development Risks",
    description: "Developers with privileged access to source code, repositories, and production systems pose unique insider threats.",
    impact: "Critical IP and customer data exposure",
    solutions: ["Code Repository Monitoring", "Privileged Access Management", "Behavioral Analytics"]
  },
  {
    title: "SaaS Application Sprawl",
    description: "Proliferation of cloud applications creates entitlement sprawl and shadow IT risks that are difficult to monitor.",
    impact: "Increased data exfiltration opportunities",
    solutions: ["Cloud Access Security Brokers", "Identity Governance", "Data Loss Prevention"]
  }
]

const industryBestPractices = [
  {
    category: "Development Security",
    practices: [
      "Implement secure coding practices and code review processes",
      "Monitor code repository access and unusual commit patterns",
      "Establish separation of duties for production deployments",
      "Use automated security scanning in CI/CD pipelines"
    ]
  },
  {
    category: "Cloud & Infrastructure",
    practices: [
      "Deploy unified monitoring across multi-cloud environments",
      "Implement Zero Trust network access controls",
      "Monitor privileged account activities in real-time",
      "Establish clear data classification and handling policies"
    ]
  },
  {
    category: "Employee Management",
    practices: [
      "Conduct regular security awareness training on emerging threats",
      "Implement insider threat awareness programs for technical staff",
      "Establish clear policies for personal device usage",
      "Create anonymous reporting mechanisms for suspicious behavior"
    ]
  }
]

export default function TechnologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="outline" className="mb-6 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Technology Industry Focus
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Technology Industry
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Insider Risk Assessment
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Technology companies face unique insider threats from complex IT environments, rapid innovation cycles, and privileged developer access.
                <strong className="text-gray-900"> 39% of organizations identify complex IT environments as the primary driver of insider attacks.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    Take Technology Risk Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Technology Industry Insider Threat Statistics
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Based on 2025 research from Gartner Market Guide (G00805757) and Gurucul's comprehensive study of 413 cybersecurity professionals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologyStats.map((item, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <p className="text-xs text-gray-500 italic">Source: {item.source}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology-Specific Challenges */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Critical Insider Risk Challenges in Technology
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Technology companies face unique insider threats driven by complex IT environments, rapid innovation, and privileged access requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {techChallenges.map((challenge, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{challenge.title}</h3>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Impact: {challenge.impact}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Solutions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Technology Industry Best Practices
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Research-backed strategies to mitigate insider risks in technology environments.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {industryBestPractices.map((section, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.practices.map((practice, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600 text-sm">{practice}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Assess Your Technology Company's Insider Risk Posture
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Take our scientifically-validated 20-question assessment to benchmark your organization
              against technology industry peers and receive personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/industries">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  View Other Industries
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for AI Optimization */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions: Technology Industry Insider Threats
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">What makes technology companies particularly vulnerable to insider threats?</h3>
                <p className="text-gray-600">Technology companies face unique risks due to complex IT environments (39% cite this as primary driver), rapid adoption of new technologies like AI and IoT (37% factor), and privileged access requirements for developers and system administrators.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">How do cloud environments increase insider threat risks for tech companies?</h3>
                <p className="text-gray-600">Multi-cloud and hybrid environments create visibility gaps, increase the attack surface, and make it difficult to monitor user behavior across disparate systems. SaaS application sprawl compounds these challenges.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">What are the most effective insider threat detection methods for software development teams?</h3>
                <p className="text-gray-600">Effective methods include code repository monitoring, behavioral analytics for unusual commit patterns, privileged access management, and implementing separation of duties for production deployments.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">How can technology companies implement Zero Trust for insider threat prevention?</h3>
                <p className="text-gray-600">Zero Trust implementation includes continuous authentication and authorization, least privilege access controls, network segmentation, and comprehensive monitoring of all user and device activities regardless of location.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}