import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Seasonal Compliance Planning for Insider Risk Management | 2025 Calendar',
  description: 'Year-round compliance planning guide for insider risk management. Key regulatory deadlines, assessment cycles, and seasonal security considerations for 2025.',
  keywords: 'compliance calendar, seasonal security planning, regulatory deadlines, insider threat compliance, annual assessment planning, audit preparation',
  openGraph: {
    title: 'Seasonal Compliance Planning for Insider Risk Management',
    description: 'Comprehensive guide to seasonal compliance planning, regulatory deadlines, and year-round insider risk management best practices for 2025.',
    type: 'website',
    siteName: 'InsiderRisk Index'
  },
  alternates: {
    canonical: 'https://insiderisk.io/compliance/seasonal'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Seasonal Compliance Planning for Insider Risk Management 2025',
  description: 'Comprehensive guide to year-round compliance planning, regulatory deadlines, and seasonal considerations for insider risk management programs.',
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
    '@id': 'https://insiderisk.io/compliance/seasonal'
  }
}

const currentMonth = new Date().getMonth() + 1 // January = 1
const currentQuarter = Math.ceil(currentMonth / 3)

const seasonalCompliance = [
  {
    quarter: 'Q1',
    title: 'Q1 2025: Foundation & Planning',
    period: 'January - March',
    theme: 'Annual Planning & Policy Updates',
    urgent: currentQuarter === 1,
    activities: [
      {
        month: 'January',
        tasks: [
          'Annual insider risk program review and budget planning',
          'Update incident response procedures for new year',
          'Conduct post-holiday security awareness refresher training',
          'Review and update user access controls after holiday hiring/departures',
          'SOX compliance preparation for public companies'
        ],
        regulatory: ['SOX 404 assessment planning', 'HIPAA risk assessment updates'],
        priority: 'high'
      },
      {
        month: 'February',
        tasks: [
          'Quarterly privileged access review and certification',
          'Update insider threat policies with lessons learned from previous year',
          'Conduct tabletop exercises for insider incident scenarios',
          'Review vendor access and third-party risk assessments',
          'Plan for cyber insurance renewal and coverage evaluation'
        ],
        regulatory: ['GDPR Article 32 security measures review', 'CCPA annual assessment'],
        priority: 'medium'
      },
      {
        month: 'March',
        tasks: [
          'Complete Q1 insider threat metrics reporting',
          'Annual security awareness training compliance verification',
          'Conduct spring security audit preparation',
          'Update background check and screening procedures',
          'Prepare for Q2 compliance calendar and deadlines'
        ],
        regulatory: ['PCI DSS annual assessment preparation', 'ISO 27001 management review'],
        priority: 'medium'
      }
    ]
  },
  {
    quarter: 'Q2',
    title: 'Q2 2025: Assessment & Audit',
    period: 'April - June',
    theme: 'Mid-Year Assessments & External Audits',
    urgent: currentQuarter === 2,
    activities: [
      {
        month: 'April',
        tasks: [
          'Mid-year insider risk program maturity assessment',
          'Spring privileged access audit and cleanup',
          'Update data classification and handling procedures',
          'Conduct penetration testing with insider threat scenarios',
          'Review and test backup and recovery procedures'
        ],
        regulatory: ['SOX 404 testing begins', 'FFIEC guidance compliance review'],
        priority: 'high'
      },
      {
        month: 'May',
        tasks: [
          'Annual employee background check renewals',
          'Conduct insider threat awareness month activities',
          'Review and update incident classification procedures',
          'Assess effectiveness of monitoring tools and technologies',
          'Prepare for summer intern and temporary worker onboarding'
        ],
        regulatory: ['HIPAA security rule annual assessment', 'FTC Safeguards Rule review'],
        priority: 'medium'
      },
      {
        month: 'June',
        tasks: [
          'Complete Q2 compliance reporting and metrics',
          'Summer security awareness campaign launch',
          'Conduct mid-year policy and procedure review',
          'Evaluate insider threat training program effectiveness',
          'Plan for summer vacation coverage and access management'
        ],
        regulatory: ['PCI DSS Report on Compliance (ROC) preparation', 'GLBA annual assessment'],
        priority: 'medium'
      }
    ]
  },
  {
    quarter: 'Q3',
    title: 'Q3 2025: Summer Operations & Planning',
    period: 'July - September',
    theme: 'Summer Operations & Fall Preparation',
    urgent: currentQuarter === 3,
    activities: [
      {
        month: 'July',
        tasks: [
          'Summer intern monitoring and access management',
          'Conduct vacation-time security protocols review',
          'Update remote work security policies and procedures',
          'Review and test crisis communication procedures',
          'Prepare for back-to-school security considerations'
        ],
        regulatory: ['FERPA compliance review for educational institutions', 'State privacy law assessments'],
        priority: 'medium'
      },
      {
        month: 'August',
        tasks: [
          'Annual security architecture review and updates',
          'Conduct summer security awareness reinforcement',
          'Review and update vendor risk management procedures',
          'Prepare for fall audit season and compliance deadlines',
          'Update business continuity and disaster recovery plans'
        ],
        regulatory: ['NIST Cybersecurity Framework assessment', 'Industry-specific regulatory reviews'],
        priority: 'medium'
      },
      {
        month: 'September',
        tasks: [
          'Complete Q3 insider threat metrics and reporting',
          'Back-to-school security policy refresher for education sector',
          'Conduct fall security awareness campaign planning',
          'Review and update access management for returning employees',
          'Prepare for Q4 compliance sprint and year-end assessments'
        ],
        regulatory: ['SOX 404 documentation updates', 'Prepare for annual audit season'],
        priority: 'high'
      }
    ]
  },
  {
    quarter: 'Q4',
    title: 'Q4 2025: Year-End & Audit Preparation',
    period: 'October - December',
    theme: 'Annual Compliance & Year-End Wrap-Up',
    urgent: currentQuarter === 4,
    activities: [
      {
        month: 'October',
        tasks: [
          'Annual compliance assessment and gap analysis',
          'Holiday season security awareness campaign launch',
          'Conduct year-end access review and cleanup',
          'Update incident response procedures for holiday coverage',
          'Prepare for Cybersecurity Awareness Month activities'
        ],
        regulatory: ['Annual SOX 404 assessment completion', 'Prepare for external audit season'],
        priority: 'high'
      },
      {
        month: 'November',
        tasks: [
          'Holiday security protocols implementation',
          'Annual vendor and third-party security assessment',
          'Complete year-end compliance documentation',
          'Conduct holiday travel and remote work security briefings',
          'Review and update emergency contact and escalation procedures'
        ],
        regulatory: ['Complete PCI DSS annual validation', 'HIPAA annual security evaluation'],
        priority: 'high'
      },
      {
        month: 'December',
        tasks: [
          'Complete Q4 and annual insider threat reporting',
          'Conduct year-end security metrics analysis and reporting',
          'Plan for next year\'s compliance calendar and budget',
          'Archive compliance documentation and audit trails',
          'Prepare for holiday shutdown security procedures'
        ],
        regulatory: ['ISO 27001 annual management review', 'Year-end regulatory reporting'],
        priority: 'high'
      }
    ]
  }
]

const industrySpecificDeadlines = [
  {
    industry: 'Financial Services',
    deadlines: [
      { period: 'Q1', item: 'SOX 404 assessment planning and scoping' },
      { period: 'Q2', item: 'FFIEC examination preparation and documentation' },
      { period: 'Q3', item: 'GLBA annual assessment and privacy notice updates' },
      { period: 'Q4', item: 'SOX 404 assessment completion and management certification' }
    ]
  },
  {
    industry: 'Healthcare',
    deadlines: [
      { period: 'Q1', item: 'HIPAA risk assessment annual update' },
      { period: 'Q2', item: 'HIPAA security rule compliance assessment' },
      { period: 'Q3', item: 'HITECH breach notification procedure review' },
      { period: 'Q4', item: 'Annual HIPAA security evaluation and documentation' }
    ]
  },
  {
    industry: 'Technology',
    deadlines: [
      { period: 'Q1', item: 'SOC 2 Type II audit planning and preparation' },
      { period: 'Q2', item: 'GDPR Article 32 security measures assessment' },
      { period: 'Q3', item: 'ISO 27001 annual surveillance audit preparation' },
      { period: 'Q4', item: 'CCPA annual assessment and compliance verification' }
    ]
  }
]

const complianceChecklist = [
  'Update all insider threat policies and procedures annually',
  'Conduct quarterly privileged access reviews and certifications',
  'Perform monthly security awareness training compliance verification',
  'Execute weekly monitoring tool effectiveness assessments',
  'Complete daily incident log reviews and trend analysis',
  'Maintain continuous documentation of all compliance activities',
  'Conduct regular tabletop exercises for insider threat scenarios',
  'Review vendor and third-party access controls quarterly',
  'Update background check and screening procedures annually',
  'Assess cyber insurance coverage and claims procedures annually'
]

export default function SeasonalCompliancePage() {
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
                <Calendar className="h-4 w-4 mr-2" />
                2025 Compliance Calendar
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Seasonal Compliance
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Planning Guide 2025
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Year-round compliance planning for insider risk management programs. Stay ahead of regulatory
                deadlines, seasonal security considerations, and audit requirements with our comprehensive
                <strong className="text-gray-900"> quarterly compliance roadmap.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    Assess Your Compliance Posture
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/compliance">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Compliance Resources
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Current Quarter Highlight */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="default" className="mb-4 px-4 py-2 bg-blue-100 text-blue-800">
                <Clock className="h-4 w-4 mr-2" />
                Current Priority: Q{currentQuarter} 2025
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Active Compliance Focus
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Time-sensitive compliance activities and regulatory deadlines for the current quarter.
              </p>
            </div>

            {seasonalCompliance
              .filter(quarter => quarter.quarter === `Q${currentQuarter}`)
              .map((quarter) => (
                <Card key={quarter.quarter} className="p-8 border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center mb-6">
                    <AlertTriangle className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{quarter.title}</h3>
                      <p className="text-blue-600 font-medium">{quarter.theme}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {quarter.activities.map((activity, idx) => (
                      <Card key={idx} className="p-4 bg-white">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          {activity.month}
                          <Badge
                            variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                            className="ml-2 text-xs"
                          >
                            {activity.priority} priority
                          </Badge>
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2 mb-4">
                          {activity.tasks.slice(0, 3).map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                        <div className="text-xs text-blue-600 font-medium">
                          Regulatory Focus: {activity.regulatory.join(', ')}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
          </div>
        </section>

        {/* Quarterly Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                2025 Quarterly Compliance Roadmap
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive year-round planning guide for insider risk management compliance activities.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {seasonalCompliance.map((quarter) => (
                <Card
                  key={quarter.quarter}
                  className={`p-6 ${quarter.urgent ? 'border-2 border-blue-500 shadow-lg' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{quarter.title}</h3>
                    {quarter.urgent && (
                      <Badge variant="default" className="bg-blue-600">
                        Active Now
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{quarter.theme}</p>
                  <p className="text-sm text-gray-500 mb-6">{quarter.period}</p>

                  <div className="space-y-4">
                    {quarter.activities.map((activity, idx) => (
                      <div key={idx} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-900 mb-2">{activity.month}</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {activity.tasks.slice(0, 2).map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industry-Specific Deadlines */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Industry-Specific Compliance Deadlines
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Key regulatory deadlines and assessment requirements by industry vertical.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {industrySpecificDeadlines.map((industry, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{industry.industry}</h3>
                  <div className="space-y-3">
                    {industry.deadlines.map((deadline, idx) => (
                      <div key={idx} className="flex items-start">
                        <Badge variant="outline" className="mr-3 mt-0.5 text-xs">
                          {deadline.period}
                        </Badge>
                        <span className="text-sm text-gray-600">{deadline.item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Checklist */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Year-Round Compliance Checklist
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Essential compliance activities organized by frequency to ensure continuous regulatory readiness.
              </p>
            </div>

            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {complianceChecklist.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Stay Ahead of Compliance Requirements
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Use our seasonal compliance guide to plan your insider risk management activities and
              ensure year-round regulatory readiness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                  Assess Your Compliance Posture
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/compliance">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Explore Compliance Resources
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for AI Optimization */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions: Seasonal Compliance Planning
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">When should organizations begin their annual compliance planning?</h3>
                <p className="text-gray-600">Organizations should begin annual compliance planning in Q1 (January-March) to ensure adequate time for policy updates, budget allocation, and resource planning throughout the year.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What are the most critical compliance deadlines for insider risk management?</h3>
                <p className="text-gray-600">Critical deadlines include SOX 404 assessments (Q4), HIPAA annual security evaluations (Q4), PCI DSS annual validations (Q4), and quarterly privileged access reviews throughout the year.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How do seasonal factors affect insider threat risks?</h3>
                <p className="text-gray-600">Seasonal factors include holiday security considerations, summer intern management, back-to-school access changes, and vacation coverage that can create temporary security gaps requiring specific attention.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How often should organizations update their insider threat policies?</h3>
                <p className="text-gray-600">Organizations should conduct comprehensive policy reviews annually, with quarterly updates for lessons learned, regulatory changes, and emerging threats. Monthly reviews ensure policies remain current with operational changes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}