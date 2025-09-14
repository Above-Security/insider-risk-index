import React from 'react';
import { BRAND_COLORS, PILLAR_COLORS } from '../styles';
import { PDFCard, PDFGrid } from './PDFSection';

interface Recommendation {
  id: string;
  pillarId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'hard';
  timeToImplement: string;
  estimatedImpact: number;
}

interface PillarScore {
  pillarId: string;
  score: number;
  weight: number;
}

interface PDFRecommendationsProps {
  recommendations: Recommendation[];
  pillarScores: PillarScore[];
}

/**
 * PDFRecommendations - Actionable improvement recommendations
 */
export function PDFRecommendations({ recommendations, pillarScores }: PDFRecommendationsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'; // red-600
      case 'medium': return '#ea580c'; // orange-600
      case 'low': return '#059669'; // emerald-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'moderate':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'hard':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPillarName = (pillarId: string) => {
    const names = {
      'visibility': 'Visibility & Monitoring',
      'coaching': 'Prevention & Coaching',
      'evidence': 'Investigation & Evidence',
      'identity': 'Identity & SaaS Security',
      'phishing': 'Phishing Resilience'
    };
    return names[pillarId as keyof typeof names] || pillarId;
  };

  // Sort recommendations by priority and impact
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.estimatedImpact - a.estimatedImpact;
  });

  return (
    <section className="recommendations-section">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Priority Recommendations</h2>
        </div>

        <div className="mb-6">
          <p className="text-slate-700">
            Based on your assessment results and industry best practices, these recommendations
            will have the most significant impact on improving your insider risk posture.
          </p>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
          {sortedRecommendations.map((rec, index) => (
            <div key={rec.id} className="border border-slate-200 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {rec.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {/* Pillar Badge */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PILLAR_COLORS[rec.pillarId as keyof typeof PILLAR_COLORS] }}
                      />
                      <span className="text-slate-600">{getPillarName(rec.pillarId)}</span>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(rec.priority) }}
                      />
                      <span
                        className="font-medium capitalize text-xs px-2 py-1 rounded-full"
                        style={{
                          color: getPriorityColor(rec.priority),
                          backgroundColor: getPriorityColor(rec.priority) + '20'
                        }}
                      >
                        {rec.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Impact Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: getPriorityColor(rec.priority) }}>
                    {rec.estimatedImpact}%
                  </div>
                  <div className="text-xs text-slate-500">Expected Impact</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-700 mb-4 leading-relaxed">
                {rec.description}
              </p>

              {/* Implementation Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Timeline</span>
                    </div>
                    <div className="font-medium text-slate-900">{rec.timeToImplement}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      {getDifficultyIcon(rec.difficulty)}
                      <span>Implementation</span>
                    </div>
                    <div className="font-medium text-slate-900 capitalize">{rec.difficulty}</div>
                  </div>
                </div>

                {/* Implementation Steps Preview */}
                <div className="mt-4">
                  <div className="text-sm text-slate-600 mb-2">Key Steps:</div>
                  <div className="space-y-1 text-sm text-slate-700">
                    {getImplementationSteps(rec.pillarId, rec.priority).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 text-xs mt-1">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Guidance */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-900">Implementation Guidance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Getting Started</h4>
              <ul className="space-y-1 text-slate-700">
                <li>• Focus on high-priority recommendations first</li>
                <li>• Assign clear ownership and timelines</li>
                <li>• Establish success metrics for each initiative</li>
                <li>• Consider resource requirements and dependencies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Best Practices</h4>
              <ul className="space-y-1 text-slate-700">
                <li>• Implement changes incrementally</li>
                <li>• Monitor impact and adjust as needed</li>
                <li>• Engage stakeholders throughout the process</li>
                <li>• Document lessons learned for future improvements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to generate implementation steps based on pillar and priority
function getImplementationSteps(pillarId: string, priority: string): string[] {
  const steps: Record<string, string[]> = {
    'visibility': [
      'Deploy advanced monitoring tools for user behavior analytics',
      'Configure alerting thresholds and escalation procedures',
      'Establish baseline behavioral patterns for anomaly detection'
    ],
    'coaching': [
      'Develop comprehensive insider threat awareness curriculum',
      'Implement regular training sessions and simulations',
      'Create clear reporting channels and encourage vigilance'
    ],
    'evidence': [
      'Enhance forensic data collection and preservation capabilities',
      'Establish standardized investigation procedures',
      'Train incident response team on insider threat scenarios'
    ],
    'identity': [
      'Implement privileged access management controls',
      'Deploy identity governance and lifecycle management',
      'Configure zero-trust access policies and monitoring'
    ],
    'phishing': [
      'Deploy advanced email security and filtering solutions',
      'Conduct regular phishing simulation exercises',
      'Implement user reporting mechanisms and feedback loops'
    ]
  };

  return steps[pillarId] || [
    'Assess current state and identify specific gaps',
    'Develop implementation plan with clear milestones',
    'Execute changes with proper testing and validation'
  ];
}