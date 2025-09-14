'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Mail, Share2 } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { getRiskLevel } from "@/lib/pillars"

interface AssessmentData {
  organizationName: string
  industry: string
  size: string
  answers: Record<string, string>
  pillarScores: {
    visibility: number
    coaching: number
    evidence: number
    identity: number
    phishing: number
  }
  iri: number
  level: number
  timestamp: string
  id?: string
}

export default function AssessmentResultsPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    // Load assessment data from localStorage
    const storedData = localStorage.getItem('assessment_results')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setAssessmentData(data)
      } catch (error) {
        console.error('Error parsing stored assessment data:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const handleGeneratePDF = async (type: 'board-brief' | 'detailed-plan') => {
    if (!assessmentData) {
      console.error('No assessment data available for PDF generation')
      return
    }

    setIsGeneratingPDF(true)

    try {
      // If we have an assessment ID from the server, use the new proper API
      if (assessmentData.id) {
        const pdfUrl = `/api/pdf/${type}/${assessmentData.id}`
        console.log('📄 Opening PDF with proper route:', pdfUrl)
        window.open(pdfUrl, '_blank')
      } else {
        // Fallback: Show message that assessment needs to be submitted to server for PDF
        alert('To generate a PDF, please complete a new assessment. This will save your results to our secure database and enable PDF generation.')
        window.location.href = '/assessment'
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('There was an error generating the PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleEmailResults = () => {
    if (!assessmentData) return

    const subject = encodeURIComponent(`Insider Risk Assessment Results - ${assessmentData.organizationName}`)
    const body = encodeURIComponent(`
I've completed an insider risk assessment with the following results:

Organization: ${assessmentData.organizationName}
Industry: ${assessmentData.industry}
Size: ${assessmentData.size}
Insider Risk Index: ${assessmentData.iri}/100
Maturity Level: ${assessmentData.level}/5

Pillar Scores:
- Visibility & Monitoring: ${assessmentData.pillarScores.visibility}/100
- Prevention & Coaching: ${assessmentData.pillarScores.coaching}/100
- Investigation & Evidence: ${assessmentData.pillarScores.evidence}/100
- Identity & SaaS: ${assessmentData.pillarScores.identity}/100
- Phishing Resilience: ${assessmentData.pillarScores.phishing}/100

View full assessment at: ${window.location.origin}/assessment/results
    `)

    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your assessment results...</p>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No Assessment Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We couldn't find any assessment results. Please complete an assessment first.
            </p>
            <Button asChild>
              <a href="/assessment">Start Assessment</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const riskLevel = getRiskLevel(assessmentData.iri)
  const radarData = [
    { subject: 'Visibility', score: assessmentData.pillarScores.visibility, fullMark: 100 },
    { subject: 'Coaching', score: assessmentData.pillarScores.coaching, fullMark: 100 },
    { subject: 'Evidence', score: assessmentData.pillarScores.evidence, fullMark: 100 },
    { subject: 'Identity', score: assessmentData.pillarScores.identity, fullMark: 100 },
    { subject: 'Phishing', score: assessmentData.pillarScores.phishing, fullMark: 100 }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600">Your insider risk posture analysis</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Insider Risk Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: riskLevel.color }}>
                  {assessmentData.iri}/100
                </div>
                <div className="text-lg font-semibold mb-2" style={{ color: riskLevel.color }}>
                  Level {assessmentData.level} - {riskLevel.name}
                </div>
                <Progress value={assessmentData.iri} className="mb-4" />
                <p className="text-sm text-gray-600">{riskLevel.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Organization:</span>
                  <span className="ml-2">{assessmentData.organizationName}</span>
                </div>
                <div>
                  <span className="font-medium">Industry:</span>
                  <span className="ml-2">{assessmentData.industry}</span>
                </div>
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2">{assessmentData.size}</span>
                </div>
                <div>
                  <span className="font-medium">Completed:</span>
                  <span className="ml-2">
                    {new Date(assessmentData.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pillar Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#FF89A1"
                    fill="#FF89A1"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
              {Object.entries(assessmentData.pillarScores).map(([pillar, score]) => (
                <div key={pillar} className="text-center">
                  <div className="text-sm font-medium capitalize mb-1">{pillar}</div>
                  <div className="text-lg font-bold">{score}/100</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleGeneratePDF('board-brief')}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Board Brief (2 pages)'}
              </Button>

              <Button
                onClick={() => handleGeneratePDF('detailed-plan')}
                disabled={isGeneratingPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Detailed Plan (8+ pages)'}
              </Button>

              <Button
                onClick={handleEmailResults}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Results
              </Button>
            </div>

            {!assessmentData.id && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Complete a new assessment to enable PDF generation with our enhanced reporting system.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}