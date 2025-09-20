import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Shield, AlertTriangle, Users, Eye, Key, FileText, Clock, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Insider Threat Prevention Checklist | 50+ Action Items for 2025',
  description: 'Comprehensive insider threat prevention checklist with 50+ actionable items. Immediate steps, quarterly reviews, and annual assessments to protect your organization.',
  keywords: 'insider threat prevention checklist, cybersecurity action items, employee security measures, insider risk mitigation, security best practices',
  openGraph: {
    title: 'Complete Insider Threat Prevention Checklist - 50+ Action Items',
    description: 'Step-by-step checklist to prevent insider threats. Research-backed security measures and best practices for immediate implementation.',
    type: 'website',
    siteName: 'InsiderRisk Index'
  },
  alternates: {
    canonical: 'https://insiderisk.io/prevention-checklist'
  }
}

const checklistSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Prevent Insider Threats: Complete Security Checklist',
  description: 'Comprehensive step-by-step guide to preventing insider threats with immediate, monthly, quarterly, and annual action items.',
  image: 'https://insiderisk.io/insider-threat-prevention-checklist.jpg',
  totalTime: 'P90D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0'
  },
  supply: [
    {
      '@type': 'HowToSupply',
      name: 'Insider Risk Assessment'
    },
    {
      '@type': 'HowToSupply',
      name: 'Security Policies and Procedures'
    },
    {
      '@type': 'HowToSupply',
      name: 'Employee Training Materials'
    }
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'User Activity Monitoring Software'
    },
    {
      '@type': 'HowToTool',
      name: 'Privileged Access Management Tools'
    },
    {
      '@type': 'HowToTool',
      name: 'Data Loss Prevention Solutions'
    }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Complete Insider Risk Assessment',
      text: 'Take the free InsiderRisk Index assessment to identify current vulnerabilities and establish baseline security posture.',
      image: 'https://insiderisk.io/assessment-step.jpg',
      url: 'https://insiderisk.io/assessment'
    },
    {
      '@type': 'HowToStep',
      name: 'Implement Access Controls',
      text: 'Deploy privileged access management, implement least privilege principles, and establish access review procedures.',
      image: 'https://insiderisk.io/access-controls-step.jpg'
    },
    {
      '@type': 'HowToStep',
      name: 'Deploy Monitoring Solutions',
      text: 'Install user activity monitoring, endpoint detection, and data loss prevention tools to detect suspicious behavior.',
      image: 'https://insiderisk.io/monitoring-step.jpg'
    },
    {
      '@type': 'HowToStep',
      name: 'Train Employees',
      text: 'Conduct security awareness training, insider threat education, and regular phishing simulations.',
      image: 'https://insiderisk.io/training-step.jpg'
    }
  ]
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the most important steps to prevent insider threats?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most important steps are: 1) Complete an insider risk assessment, 2) Implement least privilege access controls, 3) Deploy user activity monitoring, 4) Conduct regular security training, and 5) Establish clear incident response procedures. Start with our free assessment to identify your priority areas.'
      }
    },
    {
      '@type': 'Question',
      name: 'How often should organizations review their insider threat prevention measures?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Organizations should review insider threat prevention measures monthly for immediate risks, quarterly for access controls and training effectiveness, and annually for comprehensive policy and program assessment. Critical systems require weekly monitoring reviews.'
      }
    },
    {
      '@type': 'Question',
      name: 'What tools are essential for insider threat prevention?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Essential tools include user activity monitoring (UEBA), privileged access management (PAM), data loss prevention (DLP), endpoint detection and response (EDR), and security awareness training platforms. Start with visibility and access controls first.'
      }
    },
    {
      '@type': 'Question',
      name: 'How can small businesses implement insider threat prevention on a budget?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Small businesses can start with built-in Microsoft 365 or Google Workspace security features, implement strong access controls, use free security awareness training, conduct regular access reviews, and establish clear security policies. Many effective measures are low-cost or free.'
      }
    }
  ]
}

const immediateActions = [
  {
    category: 'Assessment & Baseline',
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    items: [
      'Take the free Insider Risk Index assessment to establish baseline',
      'Document all current security tools and access controls',
      'Identify users with privileged access to sensitive systems',
      'Catalog all data repositories and classification levels',
      'Review recent security incidents and near-misses'
    ]
  },
  {
    category: 'Access Controls',
    icon: <Key className="h-6 w-6 text-green-600" />,
    items: [
      'Implement multi-factor authentication for all privileged accounts',
      'Remove unnecessary administrative privileges from user accounts',
      'Disable dormant user accounts and service accounts',
      'Review and revoke excessive file share permissions',
      'Establish separation of duties for critical business functions'
    ]
  },
  {
    category: 'Monitoring & Visibility',
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    items: [
      'Enable audit logging on all critical systems and applications',
      'Configure alerts for unusual data access patterns',
      'Monitor privileged account activities in real-time',
      'Set up automated reports for access anomalies',
      'Review and analyze existing security logs for baseline behavior'
    ]
  },
  {
    category: 'Policies & Procedures',
    icon: <FileText className="h-6 w-6 text-orange-600" />,
    items: [
      'Update acceptable use policies to address insider threats',
      'Establish clear data handling and classification procedures',
      'Create incident response procedures for insider threat events',
      'Document disciplinary procedures for policy violations',
      'Implement secure remote work and BYOD policies'
    ]
  }
]

const monthlyTasks = [
  {
    week: 'Week 1',
    focus: 'Access Review',
    tasks: [
      'Review privileged user access lists and certifications',
      'Audit new user account creations and access grants',
      'Check for orphaned accounts and excessive permissions',
      'Verify contractor and vendor access alignments'
    ]
  },
  {
    week: 'Week 2',
    focus: 'Monitoring Analysis',
    tasks: [
      'Analyze user activity monitoring reports and alerts',
      'Review data access patterns and anomalies',
      'Investigate any suspicious or unusual activities',
      'Update monitoring rules based on new threat intelligence'
    ]
  },
  {
    week: 'Week 3',
    focus: 'Training & Awareness',
    tasks: [
      'Conduct security awareness refresher sessions',
      'Share insider threat awareness tips and updates',
      'Review and update security training materials',
      'Test employee knowledge with phishing simulations'
    ]
  },
  {
    week: 'Week 4',
    focus: 'Metrics & Reporting',
    tasks: [
      'Compile monthly insider threat metrics and KPIs',
      'Report security incidents and lessons learned',
      'Update leadership on program effectiveness',
      'Plan next month\'s security activities and improvements'
    ]
  }
]

const quarterlyReviews = [
  {
    quarter: 'Q1 - Foundation',
    focus: 'Program Assessment',
    activities: [
      'Comprehensive insider threat program maturity assessment',
      'Review and update risk tolerance and threat models',
      'Evaluate effectiveness of current security controls',
      'Conduct gap analysis against industry best practices',
      'Update annual security training curriculum and requirements'
    ]
  },
  {
    quarter: 'Q2 - Enhancement',
    focus: 'Tool Optimization',
    activities: [
      'Assess monitoring tool effectiveness and coverage',
      'Fine-tune alert thresholds and reduce false positives',
      'Evaluate new security technologies and solutions',
      'Conduct penetration testing with insider threat scenarios',
      'Review vendor security assessments and contracts'
    ]
  },
  {
    quarter: 'Q3 - Preparation',
    focus: 'Incident Response',
    activities: [
      'Test incident response procedures with tabletop exercises',
      'Update emergency contact lists and escalation procedures',
      'Review and improve forensic investigation capabilities',
      'Assess crisis communication plans and procedures',
      'Evaluate cyber insurance coverage and claims processes'
    ]
  },
  {
    quarter: 'Q4 - Planning',
    focus: 'Annual Planning',
    activities: [
      'Complete annual insider threat program effectiveness review',
      'Plan budget and resources for next year\'s security initiatives',
      'Update policies and procedures based on lessons learned',
      'Conduct year-end compliance assessments and audits',
      'Set security goals and metrics for the upcoming year'
    ]
  }
]

const annualAssessments = [
  {
    area: 'Program Maturity',
    description: 'Comprehensive evaluation of insider threat program effectiveness',
    deliverables: ['Maturity assessment report', 'Gap analysis', 'Improvement roadmap'],
    timeline: 'Q4 - October/November'
  },
  {
    area: 'Risk Assessment',
    description: 'Annual evaluation of insider threat risks and attack vectors',
    deliverables: ['Updated threat model', 'Risk register', 'Mitigation strategies'],
    timeline: 'Q1 - January/February'
  },
  {
    area: 'Technology Review',
    description: 'Assessment of security tools, technologies, and capabilities',
    deliverables: ['Technology assessment', 'ROI analysis', 'Upgrade recommendations'],
    timeline: 'Q2 - April/May'
  },
  {
    area: 'Compliance Audit',
    description: 'Verification of regulatory compliance and policy adherence',
    deliverables: ['Compliance report', 'Audit findings', 'Remediation plan'],
    timeline: 'Q3 - July/August'
  }
]

const industrySpecificItems = [
  {
    industry: 'Financial Services',
    requirements: [
      'Implement SOX-compliant access controls and segregation of duties',
      'Deploy transaction monitoring for unusual patterns',
      'Establish PCI DSS-compliant payment processing controls',
      'Monitor trading activities and market manipulation risks',
      'Implement GLBA privacy and information safeguarding requirements'
    ]
  },
  {
    industry: 'Healthcare',
    requirements: [
      'Implement HIPAA-compliant access controls and audit trails',
      'Monitor patient data access and usage patterns',
      'Establish minimum necessary access principles',
      'Deploy medical device security monitoring',
      'Implement breach notification and incident response procedures'
    ]
  },
  {
    industry: 'Technology',
    requirements: [
      'Implement source code repository monitoring and access controls',
      'Monitor software development and deployment activities',
      'Establish intellectual property protection measures',
      'Deploy cloud security monitoring across multi-cloud environments',
      'Implement DevSecOps security practices and controls'
    ]
  }
]

export default function PreventionChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(checklistSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="outline" className="mb-6 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Actionable Security Checklist
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Insider Threat
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Prevention Checklist
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Comprehensive, research-backed checklist with <strong className="text-gray-900">50+ actionable items</strong>
                to prevent insider threats. Immediate steps, monthly tasks, quarterly reviews, and annual assessments
                to protect your organization from internal security risks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    Start With Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Immediate Actions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="destructive" className="mb-4 px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                High Priority - Implement Now
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Immediate Action Items
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Critical security measures to implement immediately. These actions provide the foundation for your insider threat prevention program.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {immediateActions.map((category, index) => (
                <Card key={index} className="p-6 border-l-4 border-red-500">
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">{category.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Tasks */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Monthly Recurring
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Monthly Security Tasks
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Structured monthly activities to maintain and improve your insider threat prevention posture.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monthlyTasks.map((week, index) => (
                <Card key={index} className="p-6">
                  <div className="text-center mb-4">
                    <Badge variant="outline" className="mb-2">
                      {week.week}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">{week.focus}</h3>
                  </div>
                  <ul className="space-y-2">
                    {week.tasks.map((task, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quarterly Reviews */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="default" className="mb-4 px-4 py-2 bg-blue-100 text-blue-800">
                <Clock className="h-4 w-4 mr-2" />
                Quarterly Planning
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quarterly Security Reviews
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive quarterly assessments to ensure program effectiveness and continuous improvement.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {quarterlyReviews.map((quarter, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    <Badge variant="outline" className="mr-3">
                      {quarter.quarter.split(' - ')[0]}
                    </Badge>
                    <h3 className="text-xl font-semibold text-gray-900">{quarter.quarter.split(' - ')[1]}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">Focus: {quarter.focus}</p>
                  <ul className="space-y-3">
                    {quarter.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Annual Assessments */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="default" className="mb-4 px-4 py-2 bg-purple-100 text-purple-800">
                <Zap className="h-4 w-4 mr-2" />
                Annual Strategic
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Annual Strategic Assessments
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive annual evaluations to assess program maturity and plan strategic improvements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {annualAssessments.map((assessment, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{assessment.area}</h3>
                  <p className="text-gray-600 mb-4">{assessment.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Deliverables:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {assessment.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Timeline: </span>
                    <span className="text-blue-600">{assessment.timeline}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industry-Specific Requirements */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Industry-Specific Requirements
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Additional checklist items tailored to specific industry compliance and operational requirements.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {industrySpecificItems.map((industry, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{industry.industry}</h3>
                  <ul className="space-y-3">
                    {industry.requirements.map((requirement, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{requirement}</span>
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
              Start Implementing Your Prevention Plan
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Use this checklist alongside your Insider Risk Index assessment to build a comprehensive
              insider threat prevention program tailored to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                  Take Assessment First
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/playbooks">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  View Implementation Playbooks
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions: Prevention Checklist
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How should I prioritize these checklist items?</h3>
                <p className="text-gray-600">Start with the immediate action items, focusing first on access controls and monitoring. Then implement monthly tasks systematically. Use your Insider Risk Index assessment results to prioritize specific areas based on your current maturity level.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What if I don't have budget for all recommended tools?</h3>
                <p className="text-gray-600">Many effective measures are low-cost or free, such as policy updates, access reviews, and training. Start with built-in security features in existing systems (Microsoft 365, Google Workspace) and prioritize high-impact, low-cost activities first.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How long does it take to implement a complete insider threat prevention program?</h3>
                <p className="text-gray-600">Basic protection can be established in 30-60 days with immediate action items. A mature program typically takes 6-12 months to fully implement, with continuous improvement thereafter. Start with high-priority items and build incrementally.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How do I measure the effectiveness of my prevention efforts?</h3>
                <p className="text-gray-600">Track metrics like time to detect incidents, false positive rates, policy compliance levels, training completion rates, and access review findings. Conduct regular assessments using tools like our Insider Risk Index to measure program maturity over time.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}