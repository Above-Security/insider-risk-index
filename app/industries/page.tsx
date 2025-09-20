import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building2, Activity, Shield, Zap, Briefcase, Factory } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Industry-Specific Insider Risk Assessments | Tailored Cybersecurity Solutions',
  description: 'Specialized insider risk assessments for Financial Services, Healthcare, Technology, and other industries. Get industry-specific benchmarks and compliance guidance.',
  keywords: 'industry insider threats, sector-specific cybersecurity, compliance requirements, industry benchmarks, specialized risk assessment',
  openGraph: {
    title: 'Industry-Specific Insider Risk Management Solutions',
    description: 'Comprehensive insider risk assessments tailored to your industry. Financial Services, Healthcare, Technology, and more. Research-backed industry benchmarks.',
    type: 'website',
    siteName: 'InsiderRisk Index'
  },
  alternates: {
    canonical: 'https://insiderisk.io/industries'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Industry-Specific Insider Risk Assessments',
  description: 'Comprehensive collection of industry-specific insider risk assessments and cybersecurity solutions tailored to different sectors.',
  url: 'https://insiderisk.io/industries',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: 6,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'WebPage',
          name: 'Financial Services Insider Risk Assessment',
          url: 'https://insiderisk.io/industries/financial-services',
          description: 'Specialized assessment for banking, investment, and financial institutions'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'WebPage',
          name: 'Healthcare Insider Risk Assessment',
          url: 'https://insiderisk.io/industries/healthcare',
          description: 'HIPAA-compliant insider threat assessment for healthcare organizations'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'WebPage',
          name: 'Technology Industry Insider Risk Assessment',
          url: 'https://insiderisk.io/industries/technology',
          description: 'Cybersecurity assessment for software, SaaS, and technology companies'
        }
      }
    ]
  },
  publisher: {
    '@type': 'Organization',
    name: 'InsiderRisk Index',
    logo: {
      '@type': 'ImageObject',
      url: 'https://insiderisk.io/logo.png'
    }
  }
}

const industries = [
  {
    id: 'financial-services',
    title: 'Financial Services',
    description: 'Banking, investment firms, credit unions, and fintech companies face unique regulatory requirements and high-value data targets.',
    keyStats: ['$5.72M average breach cost', '89% experience privilege misuse', 'SOX & PCI DSS compliance'],
    compliance: ['SOX', 'PCI DSS', 'GLBA', 'FFIEC'],
    icon: <Building2 className="h-8 w-8 text-green-600" />,
    color: 'green',
    available: true,
    href: '/industries/financial-services'
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Hospitals, clinics, pharma, and health tech organizations protecting sensitive patient data and ensuring HIPAA compliance.',
    keyStats: ['70% breaches from insiders', '$10.93M average breach cost', 'HIPAA compliance critical'],
    compliance: ['HIPAA', 'HITECH', 'FDA', 'State Privacy Laws'],
    icon: <Activity className="h-8 w-8 text-red-600" />,
    color: 'red',
    available: true,
    href: '/industries/healthcare'
  },
  {
    id: 'technology',
    title: 'Technology',
    description: 'Software companies, SaaS providers, and tech startups managing complex IT environments and intellectual property.',
    keyStats: ['39% cite complex IT environments', '37% face tech complexity risks', 'IP protection critical'],
    compliance: ['SOC 2', 'ISO 27001', 'GDPR', 'CCPA'],
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    color: 'blue',
    available: true,
    href: '/industries/technology'
  },
  {
    id: 'government',
    title: 'Government & Defense',
    description: 'Federal agencies, state/local government, and defense contractors protecting classified and sensitive information.',
    keyStats: ['Security clearance requirements', 'National security implications', 'Strict compliance mandates'],
    compliance: ['FISMA', 'NIST', 'CMMC', 'FedRAMP'],
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    color: 'purple',
    available: false,
    href: '#'
  },
  {
    id: 'professional-services',
    title: 'Professional Services',
    description: 'Legal firms, consulting companies, and professional service organizations handling confidential client information.',
    keyStats: ['Client confidentiality critical', 'Privileged information access', 'Reputation risk high'],
    compliance: ['Professional Standards', 'Client Privacy', 'Industry Regulations'],
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
    color: 'indigo',
    available: false,
    href: '#'
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    description: 'Industrial manufacturers and critical infrastructure operators protecting operational technology and trade secrets.',
    keyStats: ['OT/IT convergence risks', 'Trade secret protection', 'Supply chain security'],
    compliance: ['NERC CIP', 'IEC 62443', 'NIST CSF', 'ISO 27001'],
    icon: <Factory className="h-8 w-8 text-orange-600" />,
    color: 'orange',
    available: false,
    href: '#'
  }
]

const industryBenefits = [
  {
    title: 'Industry-Specific Benchmarks',
    description: 'Compare your insider risk posture against peer organizations in your sector with real industry data and research.'
  },
  {
    title: 'Compliance-Aligned Recommendations',
    description: 'Receive guidance that aligns with your industry\'s regulatory requirements and compliance frameworks.'
  },
  {
    title: 'Sector-Relevant Threat Intelligence',
    description: 'Access threat patterns, attack vectors, and risk factors most relevant to your industry vertical.'
  },
  {
    title: 'Tailored Implementation Playbooks',
    description: 'Get actionable playbooks designed for your industry\'s unique operational and technical requirements.'
  }
]

export default function IndustriesPage() {
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
                <Building2 className="h-4 w-4 mr-2" />
                Industry-Specific Solutions
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Industry-Specific
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Insider Risk Assessments
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Get specialized insider risk assessments tailored to your industry's unique challenges,
                regulatory requirements, and compliance frameworks. Each assessment provides sector-specific
                benchmarks and recommendations based on authoritative research.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    Take Universal Assessment
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

        {/* Industry Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Industry
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Select your industry for a specialized assessment with relevant benchmarks, compliance guidance, and sector-specific recommendations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry) => (
                <Card
                  key={industry.id}
                  className={`p-6 hover:shadow-xl transition-all duration-300 ${
                    industry.available ? 'hover:scale-105' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {industry.icon}
                      <h3 className="text-xl font-semibold text-gray-900 ml-3">{industry.title}</h3>
                    </div>
                    {industry.available ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Coming Soon
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {industry.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Statistics:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {industry.keyStats.map((stat, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          {stat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Compliance Frameworks:</h4>
                    <div className="flex flex-wrap gap-1">
                      {industry.compliance.map((framework, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {industry.available ? (
                      <Link href={industry.href}>
                        <Button className="w-full" variant="default">
                          View {industry.title} Assessment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Industry-Specific Assessments Matter
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Different industries face unique insider threats, regulatory requirements, and operational challenges.
                Our specialized assessments provide targeted insights for your sector.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryBenefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Research Sources */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Research-Backed Industry Intelligence
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our industry assessments are built on authoritative research from leading cybersecurity organizations
              and government agencies, ensuring accuracy and relevance.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Gartner Research</h3>
                <p className="text-gray-600">Market Guide for Insider Risk Management Solutions (G00805757) and ongoing threat intelligence.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Industry Reports</h3>
                <p className="text-gray-600">Ponemon Institute, Verizon DBIR, and sector-specific cybersecurity studies.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Compliance Standards</h3>
                <p className="text-gray-600">NIST, ISO, and industry-specific regulatory frameworks and guidance.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Assess Your Industry-Specific Insider Risk?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Choose your industry above for a specialized assessment, or take our universal assessment
              to get started with comprehensive insider risk evaluation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                  Take Universal Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for AI Optimization */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions: Industry-Specific Assessments
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What makes industry-specific assessments different from generic cybersecurity evaluations?</h3>
                <p className="text-gray-600">Industry-specific assessments include sector-relevant threat patterns, compliance requirements, regulatory frameworks, and peer benchmarking data that generic assessments cannot provide.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Which industries have the highest insider threat risks?</h3>
                <p className="text-gray-600">Healthcare (70% of breaches from insiders), Financial Services ($5.72M average breach cost), and Technology (39% cite complex IT environments as primary risk driver) face the highest documented insider threat risks.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How do compliance requirements vary across industries?</h3>
                <p className="text-gray-600">Financial Services must comply with SOX, PCI DSS, and GLBA; Healthcare requires HIPAA and HITECH compliance; Technology often needs SOC 2 and ISO 27001; Government requires FISMA and NIST frameworks.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Can I take assessments for multiple industries if my organization operates across sectors?</h3>
                <p className="text-gray-600">Yes, organizations operating across multiple industries can take sector-specific assessments to understand unique risks and compliance requirements for each business unit or operational area.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}