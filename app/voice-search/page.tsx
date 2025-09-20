import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Mic, MapPin, Globe, Search, MessageCircle, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Voice Search Insider Risk Assessment | "How vulnerable is my company to insider threats?"',
  description: 'Ask about insider threats using voice search. "How can I assess insider risk?" "What are insider threat warning signs?" Get AI-powered answers and free assessments.',
  keywords: 'voice search cybersecurity, conversational insider threats, ask about security risks, voice assistant cybersecurity, local cyber risk assessment',
  openGraph: {
    title: 'Voice Search Insider Risk Assessment - Ask AI About Your Security',
    description: 'Get instant answers to insider threat questions through voice search. Free assessments available worldwide with local cybersecurity insights.',
    type: 'website',
    siteName: 'InsiderRisk Index'
  },
  alternates: {
    canonical: 'https://insiderisk.io/voice-search'
  }
}

const voiceSearchSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I assess my company\'s insider risk using voice search?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can ask "How vulnerable is my company to insider threats?" or "What is an insider risk assessment?" Take our free 8-minute assessment at InsiderRisk.io for immediate results with industry benchmarks and actionable recommendations.'
      }
    },
    {
      '@type': 'Question',
      name: 'What are the warning signs of insider threats I should know about?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key insider threat warning signs include unusual data access patterns, downloading large amounts of data, working odd hours, bypassing security protocols, and sudden behavioral changes. Monitor for privileged account misuse and unauthorized system access.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much do insider threats cost organizations annually?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Insider threats cost organizations $17.4 million annually on average according to Ponemon Institute 2025 research. Individual incidents average $676,517, with healthcare and financial services facing higher costs due to regulatory requirements.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where can I find insider threat assessment services near me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'InsiderRisk.io provides free online insider threat assessments available globally. For local cybersecurity consulting, contact certified security professionals in your area who specialize in insider risk management programs.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the best insider threat detection software for small businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Small businesses should focus on user activity monitoring tools like Microsoft 365 Advanced Threat Protection, endpoint detection solutions like CrowdStrike Falcon Go, and privileged access management tools like Okta or Auth0.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I know if my organization needs insider threat protection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every organization needs insider threat protection. Take our free assessment to evaluate your current posture. Warning signs include recent security incidents, high employee turnover, sensitive data handling, or regulatory compliance requirements.'
      }
    }
  ]
}

const geographicalVariations = [
  {
    region: 'North America',
    countries: ['United States', 'Canada', 'Mexico'],
    compliance: ['SOX', 'PIPEDA', 'CCPA', 'HIPAA'],
    commonQueries: [
      'What is insider threat compliance in the United States?',
      'How do Canadian privacy laws affect insider risk?',
      'What are SOX requirements for insider threat management?',
      'How can US companies prevent insider threats?'
    ],
    localFactors: 'Strong regulatory environment with SOX, HIPAA, and state privacy laws. High litigation risk requires comprehensive documentation.'
  },
  {
    region: 'Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Netherlands'],
    compliance: ['GDPR', 'NIS2', 'ISO 27001', 'Data Protection Act'],
    commonQueries: [
      'What are GDPR requirements for insider threat monitoring?',
      'How does NIS2 directive affect insider risk management?',
      'What is insider threat compliance in the European Union?',
      'How can European companies monitor employee data access?'
    ],
    localFactors: 'GDPR creates strict employee privacy requirements. Data processing consent and purpose limitation must be carefully balanced with security monitoring.'
  },
  {
    region: 'Asia Pacific',
    countries: ['Australia', 'Singapore', 'Japan', 'India'],
    compliance: ['Privacy Act', 'PDPA', 'APPI', 'DPDP Act'],
    commonQueries: [
      'What is insider threat compliance in Australia?',
      'How does Singapore PDPA affect employee monitoring?',
      'What are insider threat risks for Japanese companies?',
      'How can Indian companies implement insider risk management?'
    ],
    localFactors: 'Diverse regulatory landscape requires region-specific approaches. Cross-border data flows and cultural considerations impact implementation.'
  }
]

const voiceSearchTips = [
  {
    query: '"How vulnerable is my company to insider threats?"',
    response: 'Take our free 8-minute assessment to get your Insider Risk Index score and personalized recommendations.',
    optimization: 'Natural conversational language with immediate action'
  },
  {
    query: '"What are the signs of an insider threat?"',
    response: 'Key warning signs include unusual data access, working odd hours, bypassing security, and sudden behavioral changes.',
    optimization: 'Clear, specific list format that voice assistants can read aloud'
  },
  {
    query: '"How much do insider threats cost companies?"',
    response: '$17.4 million annually on average, with individual incidents costing $676,517 according to Ponemon Institute 2025 research.',
    optimization: 'Specific statistics with authoritative source citation'
  },
  {
    query: '"Where can I get help with insider threats near me?"',
    response: 'Start with our free online assessment, then contact local cybersecurity professionals certified in insider risk management.',
    optimization: 'Local search optimization with immediate online option'
  }
]

const conversationalContent = [
  {
    category: 'Assessment Questions',
    examples: [
      'How can I test my company\'s insider threat defenses?',
      'What should I know about my organization\'s security risks?',
      'How do I evaluate our insider threat program?',
      'What are the best practices for insider risk assessment?'
    ]
  },
  {
    category: 'Cost and ROI',
    examples: [
      'How much should I budget for insider threat protection?',
      'What is the return on investment for insider security?',
      'How expensive are insider threat incidents?',
      'What do insider threats cost my industry?'
    ]
  },
  {
    category: 'Implementation',
    examples: [
      'How do I start an insider threat program?',
      'What tools do I need for insider threat detection?',
      'How can I train employees about insider risks?',
      'What are the first steps in insider threat prevention?'
    ]
  },
  {
    category: 'Compliance and Legal',
    examples: [
      'What are the legal requirements for insider threat management?',
      'How do privacy laws affect employee monitoring?',
      'What compliance frameworks cover insider threats?',
      'How do I balance security with employee privacy?'
    ]
  }
]

export default function VoiceSearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(voiceSearchSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="outline" className="mb-6 px-4 py-2">
                <Mic className="h-4 w-4 mr-2" />
                Voice Search Optimized
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Ask About
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Insider Threats
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                <strong>"How vulnerable is my company to insider threats?"</strong> Get AI-powered answers
                to your cybersecurity questions through voice search, smart assistants, and conversational AI.
                Available worldwide with local compliance insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    Start Voice-Guided Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Common Voice Queries */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Common Voice Search Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Try asking these questions to voice assistants or AI platforms for instant insider threat guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {voiceSearchTips.map((tip, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start mb-4">
                    <MessageCircle className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900">{tip.query}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{tip.response}</p>
                  <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <strong>Voice Optimization:</strong> {tip.optimization}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Geographical Variations */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Global Voice Search Optimization
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Insider threat guidance optimized for regional compliance requirements and local search variations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {geographicalVariations.map((region, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{region.region}</h3>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Countries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.countries.map((country, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Compliance:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.compliance.map((framework, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Common Voice Queries:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {region.commonQueries.slice(0, 2).map((query, idx) => (
                        <li key={idx} className="flex items-start">
                          <Search className="h-3 w-3 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                          "{query}"
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                    <strong>Local Factors:</strong> {region.localFactors}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Conversational Content Categories */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Voice Search Categories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Conversational queries organized by topic to help you find relevant insider threat information through voice search.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conversationalContent.map((category, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <Mic className="h-3 w-3 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Voice Assistant Integration */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Voice Assistant Integration
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Ask these questions to popular voice assistants and AI platforms for instant insider threat guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Smart Assistants</h3>
                <p className="text-sm text-gray-600 mb-4">Ask Siri, Google Assistant, or Alexa about insider threats</p>
                <div className="text-xs text-gray-500">
                  "Hey Siri, how can I assess insider risk?"
                </div>
              </Card>

              <Card className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">AI Chat Platforms</h3>
                <p className="text-sm text-gray-600 mb-4">Use ChatGPT, Claude, or Gemini for detailed guidance</p>
                <div className="text-xs text-gray-500">
                  "What are insider threat warning signs?"
                </div>
              </Card>

              <Card className="p-6 text-center">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Search Platforms</h3>
                <p className="text-sm text-gray-600 mb-4">Voice search on Google, Bing, and Perplexity</p>
                <div className="text-xs text-gray-500">
                  "How much do insider threats cost?"
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Local Search Optimization */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Local Cybersecurity Search
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Find insider threat resources and assessments available in your area with voice search optimization.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <Card className="p-6">
                <MapPin className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Near Me Queries</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>"Cybersecurity assessment near me"</li>
                  <li>"Insider threat consulting in [city]"</li>
                  <li>"Security audit services nearby"</li>
                  <li>"Local cybersecurity experts"</li>
                </ul>
              </Card>

              <Card className="p-6">
                <Globe className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Access</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>Free online assessments worldwide</li>
                  <li>Multi-language support available</li>
                  <li>Regional compliance guidance</li>
                  <li>Local regulatory requirements</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Start Your Voice-Guided Assessment
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Ask your voice assistant about insider threats, or take our free assessment directly
              for immediate results and personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
                  Take Free Assessment
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
      </div>
    </>
  )
}