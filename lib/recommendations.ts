import { getMatrixData, generatePillarMatrixAnalysis } from './matrix-api';
import { getAllPillars, getPillarById } from './pillars';
import { MatrixData } from './matrix-types';

interface PillarMatrixAnalysis {
  pillarName: string;
  relatedTechniques: number;
  elements: Array<{
    id: string;
    name: string;
    description: string;
    category: 'Motive' | 'Means' | 'Preparation' | 'Infringement' | 'Anti-forensics';
    relevantPreventions: Array<{
      id: string;
      title: string;
      description: string;
      pillar: string;
    }>;
    relevantDetections: Array<{
      id: string;
      title: string;
      description: string;
      pillar: string;
    }>;
  }>;
  recommendations: string[];
}

export interface AssessmentScore {
  pillarId: string;
  score: number;
  weight: number;
  contributionToTotal: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  pillarId: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'hard';
  timeToImplement: string;
  matrixTechniques: string[]; // Matrix technique IDs this addresses
  preventionStrategies: string[];
  detectionMethods: string[];
  playbooks: string[]; // Related playbook slugs
  estimatedImpact: number; // 0-10 scale
  resources: {
    title: string;
    url: string;
    type: 'documentation' | 'tool' | 'playbook' | 'matrix';
  }[];
}

export interface RecommendationContext {
  totalScore: number;
  level: number;
  pillarScores: AssessmentScore[];
  industry?: string;
  companySize?: string;
  organizationName?: string;
}

/**
 * Generate Matrix-enhanced recommendations based on assessment results
 */
export async function generateMatrixRecommendations(
  context: RecommendationContext
): Promise<Recommendation[]> {
  try {
    const matrixData = await getMatrixData();
    const recommendations: Recommendation[] = [];
    
    // Get the lowest scoring pillars (highest priority for improvement)
    const sortedPillars = [...context.pillarScores]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3); // Focus on top 3 areas for improvement

    for (const pillarScore of sortedPillars) {
      const pillarRecommendations = await generatePillarRecommendations(
        pillarScore,
        context,
        matrixData
      );
      recommendations.push(...pillarRecommendations);
    }

    // Sort by priority and estimated impact
    return recommendations
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority] || 
               b.estimatedImpact - a.estimatedImpact;
      })
      .slice(0, 10); // Return top 10 recommendations
      
  } catch (error) {
    console.error('Error generating Matrix recommendations:', error);
    return getFallbackRecommendations(context);
  }
}

/**
 * Generate recommendations for a specific pillar
 */
async function generatePillarRecommendations(
  pillarScore: AssessmentScore,
  context: RecommendationContext,
  matrixData: MatrixData
): Promise<Recommendation[]> {
  const pillar = getPillarById(pillarScore.pillarId);
  if (!pillar) return [];

  const pillarAnalysis = await generatePillarMatrixAnalysis(pillarScore.pillarId);
  const recommendations: Recommendation[] = [];

  // Generate recommendations based on pillar score ranges
  if (pillarScore.score < 40) {
    // Critical improvements needed
    recommendations.push(
      ...generateCriticalRecommendations(pillar.id, pillarAnalysis, context)
    );
  } else if (pillarScore.score < 70) {
    // Moderate improvements
    recommendations.push(
      ...generateModerateRecommendations(pillar.id, pillarAnalysis, context)
    );
  } else {
    // Fine-tuning and optimization
    recommendations.push(
      ...generateOptimizationRecommendations(pillar.id, pillarAnalysis, context)
    );
  }

  return recommendations;
}

/**
 * Generate critical recommendations for low-scoring pillars
 */
function generateCriticalRecommendations(
  pillarId: string,
  analysis: PillarMatrixAnalysis,
  context: RecommendationContext
): Recommendation[] {
  const baseRecommendations: Record<string, Partial<Recommendation>> = {
    'visibility': {
      title: 'Implement Comprehensive User Activity Monitoring',
      description: 'Deploy advanced user behavior analytics (UBA) to detect anomalous insider activities and establish baseline behaviors.',
      priority: 'high',
      difficulty: 'moderate',
      timeToImplement: '8-12 weeks',
      estimatedImpact: 9,
      playbooks: ['visibility-monitoring'],
    },
    'prevention-coaching': {
      title: 'Establish Insider Threat Awareness Program',
      description: 'Create comprehensive training program focusing on recognizing and reporting insider threat indicators.',
      priority: 'high',
      difficulty: 'easy',
      timeToImplement: '4-6 weeks',
      estimatedImpact: 8,
      playbooks: ['prevention-coaching'],
    },
    'investigation-evidence': {
      title: 'Deploy Digital Forensics Capabilities',
      description: 'Implement tools and processes for rapid incident response and evidence preservation during insider threat investigations.',
      priority: 'high',
      difficulty: 'hard',
      timeToImplement: '12-16 weeks',
      estimatedImpact: 9,
      playbooks: ['investigation-evidence'],
    },
    'identity-saas': {
      title: 'Implement Zero Trust Identity Architecture',
      description: 'Deploy comprehensive identity and access management with continuous verification and least-privilege principles.',
      priority: 'high',
      difficulty: 'hard',
      timeToImplement: '16-20 weeks',
      estimatedImpact: 10,
      playbooks: ['identity-saas'],
    },
    'phishing-resilience': {
      title: 'Build Advanced Email Security Stack',
      description: 'Implement AI-powered email security with real-time threat intelligence and user protection mechanisms.',
      priority: 'high',
      difficulty: 'moderate',
      timeToImplement: '6-8 weeks',
      estimatedImpact: 8,
      playbooks: ['phishing-resilience'],
    },
  };

  const baseRec = baseRecommendations[pillarId];
  if (!baseRec) return [];

  return [{
    id: `critical-${pillarId}-${Date.now()}`,
    pillarId,
    matrixTechniques: analysis.elements.map(t => t.id).slice(0, 5),
    preventionStrategies: analysis.recommendations.slice(0, 3),
    detectionMethods: analysis.elements.flatMap(t => t.relevantDetections.map(d => d.description)).slice(0, 3),
    resources: [
      {
        title: 'Insider Threat Matrix Techniques',
        url: '/matrix/techniques?pillar=' + pillarId,
        type: 'matrix',
      },
      {
        title: 'NIST Cybersecurity Framework',
        url: 'https://www.nist.gov/cyberframework',
        type: 'documentation',
      },
    ],
    ...baseRec,
  } as Recommendation];
}

/**
 * Generate moderate improvement recommendations
 */
function generateModerateRecommendations(
  pillarId: string,
  analysis: PillarMatrixAnalysis,
  context: RecommendationContext
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Add 2-3 moderate recommendations per pillar
  const moderateActions = {
    'visibility': [
      {
        title: 'Enhance Data Loss Prevention (DLP) Controls',
        description: 'Implement advanced DLP rules based on Matrix threat techniques to prevent data exfiltration.',
        difficulty: 'moderate' as const,
        timeToImplement: '6-8 weeks',
        estimatedImpact: 7,
      },
      {
        title: 'Deploy Privileged Access Monitoring',
        description: 'Monitor and audit all privileged user activities with real-time alerting.',
        difficulty: 'moderate' as const,
        timeToImplement: '4-6 weeks',
        estimatedImpact: 8,
      },
    ],
    'prevention-coaching': [
      {
        title: 'Implement Behavioral Nudging System',
        description: 'Deploy contextual security guidance based on Matrix manipulation techniques.',
        difficulty: 'easy' as const,
        timeToImplement: '3-4 weeks',
        estimatedImpact: 6,
      },
    ],
    // Add more pillars as needed
  };

  const actions = moderateActions[pillarId as keyof typeof moderateActions] || [];
  
  actions.forEach((action, index) => {
    recommendations.push({
      id: `moderate-${pillarId}-${index}-${Date.now()}`,
      pillarId,
      title: action.title,
      description: action.description,
      priority: 'medium',
      difficulty: action.difficulty,
      timeToImplement: action.timeToImplement,
      estimatedImpact: action.estimatedImpact,
      matrixTechniques: analysis.elements.map(t => t.id).slice(0, 3),
      preventionStrategies: analysis.recommendations.slice(0, 2),
      detectionMethods: analysis.elements.flatMap(t => t.relevantDetections.map(d => d.description)).slice(0, 2),
      playbooks: [pillarId.replace('-', '-')],
      resources: [
        {
          title: 'Related Matrix Analysis',
          url: '/matrix/analysis/' + pillarId,
          type: 'matrix',
        },
      ],
    });
  });

  return recommendations;
}

/**
 * Generate optimization recommendations for high-scoring pillars
 */
function generateOptimizationRecommendations(
  pillarId: string,
  analysis: PillarMatrixAnalysis,
  context: RecommendationContext
): Recommendation[] {
  return [{
    id: `optimize-${pillarId}-${Date.now()}`,
    title: `Advanced ${getPillarById(pillarId)?.name} Optimization`,
    description: 'Fine-tune existing controls and implement advanced threat hunting capabilities.',
    pillarId,
    priority: 'low',
    difficulty: 'hard',
    timeToImplement: '4-8 weeks',
    estimatedImpact: 5,
    matrixTechniques: analysis.elements.map(t => t.id).slice(0, 2),
    preventionStrategies: analysis.recommendations.slice(0, 1),
    detectionMethods: analysis.elements.flatMap(t => t.relevantDetections.map(d => d.description)).slice(0, 1),
    playbooks: [pillarId],
    resources: [
      {
        title: 'Advanced Matrix Techniques',
        url: '/matrix/techniques?pillar=' + pillarId,
        type: 'matrix',
      },
    ],
  }];
}

/**
 * Fallback recommendations when Matrix data is unavailable
 */
function getFallbackRecommendations(context: RecommendationContext): Recommendation[] {
  const lowestPillar = context.pillarScores.reduce((min, curr) => 
    curr.score < min.score ? curr : min
  );

  return [{
    id: `fallback-${lowestPillar.pillarId}-${Date.now()}`,
    title: `Improve ${getPillarById(lowestPillar.pillarId)?.name}`,
    description: 'Focus on strengthening this pillar to improve your overall insider risk posture.',
    pillarId: lowestPillar.pillarId,
    priority: 'high',
    difficulty: 'moderate',
    timeToImplement: '8-12 weeks',
    estimatedImpact: 8,
    matrixTechniques: [],
    preventionStrategies: [],
    detectionMethods: [],
    playbooks: [lowestPillar.pillarId],
    resources: [
      {
        title: 'Implementation Playbook',
        url: '/playbooks/' + lowestPillar.pillarId,
        type: 'playbook',
      },
    ],
  }];
}

/**
 * Generate industry-specific recommendations
 */
export function getIndustrySpecificRecommendations(
  industry: string,
  context: RecommendationContext
): Recommendation[] {
  const industryFocus: Record<string, string[]> = {
    'healthcare': ['investigation-evidence', 'identity-saas'], // HIPAA compliance focus
    'financial-services': ['visibility', 'prevention-coaching'], // Regulatory compliance
    'technology': ['phishing-resilience', 'identity-saas'], // High-value targets
    'manufacturing': ['visibility', 'investigation-evidence'], // IP protection
  };

  const focusPillars = industryFocus[industry] || [];
  
  // Return recommendations that prioritize industry-specific pillars
  return context.pillarScores
    .filter(score => focusPillars.includes(score.pillarId))
    .map(score => ({
      id: `industry-${industry}-${score.pillarId}-${Date.now()}`,
      title: `${industry.toUpperCase()} Compliance Enhancement`,
      description: `Industry-specific improvements for ${getPillarById(score.pillarId)?.name}`,
      pillarId: score.pillarId,
      priority: 'high' as const,
      difficulty: 'moderate' as const,
      timeToImplement: '6-10 weeks',
      estimatedImpact: 8,
      matrixTechniques: [],
      preventionStrategies: [],
      detectionMethods: [],
      playbooks: [score.pillarId],
      resources: [
        {
          title: 'Industry Best Practices',
          url: '/benchmarks?industry=' + industry,
          type: 'documentation',
        },
      ],
    }));
}