import { MatrixElement } from './matrix-types';

interface PillarScore {
  pillar: string;
  score: number;
  weight: number;
  contributionToTotal: number;
}

interface AssessmentMatrixMapping {
  highRiskTechniques: MatrixElement[];
  mediumRiskTechniques: MatrixElement[];
  recommendedPlaybooks: string[];
  preventionStrategies: string[];
  detectionStrategies: string[];
}

/**
 * Map assessment results to relevant Matrix techniques and defensive measures
 */
export async function mapAssessmentToMatrix(
  pillarBreakdown: PillarScore[],
  overallScore: number
): Promise<AssessmentMatrixMapping> {
  try {
    // Fetch Matrix techniques
    const response = await fetch('https://raw.githubusercontent.com/forscie/insider-threat-matrix/refs/heads/main/insider-threat-matrix.json');
    const matrixData = await response.json();
    const techniques: MatrixElement[] = matrixData.techniques || [];

    // Identify weak pillars (scores < 60)
    const weakPillars = pillarBreakdown
      .filter(p => p.score < 60)
      .sort((a, b) => a.score - b.score);

    // Map pillar IDs to Matrix categories
    const pillarToMatrixMapping: Record<string, string[]> = {
      'visibility': ['access', 'asset-control', 'collection'],
      'coaching': ['motivation', 'coercion'],
      'evidence': ['collection', 'exfiltration'],
      'identity': ['access', 'persistence'],
      'phishing': ['delivery', 'exploitation']
    };

    const highRiskTechniques: MatrixElement[] = [];
    const mediumRiskTechniques: MatrixElement[] = [];

    // Find techniques relevant to weak pillars
    for (const pillar of weakPillars) {
      const relevantCategories = pillarToMatrixMapping[pillar.pillar] || [];

      for (const technique of techniques) {
        const isRelevant = relevantCategories.some(category =>
          technique.category?.toLowerCase().includes(category) ||
          technique.description?.toLowerCase().includes(category)
        );

        if (isRelevant) {
          if (pillar.score < 40) {
            if (highRiskTechniques.length < 5) {
              highRiskTechniques.push(technique);
            }
          } else if (pillar.score < 60) {
            if (mediumRiskTechniques.length < 3) {
              mediumRiskTechniques.push(technique);
            }
          }
        }
      }
    }

    // Generate playbook recommendations based on weak pillars
    const recommendedPlaybooks: string[] = [];
    for (const pillar of weakPillars.slice(0, 3)) {
      switch (pillar.pillar) {
        case 'visibility':
          recommendedPlaybooks.push('Visibility Foundation Program');
          break;
        case 'coaching':
          recommendedPlaybooks.push('Prevention & Coaching Program');
          break;
        case 'evidence':
          recommendedPlaybooks.push('Investigation & Evidence Framework');
          break;
        case 'identity':
          recommendedPlaybooks.push('Identity & SaaS Security Program');
          break;
        case 'phishing':
          recommendedPlaybooks.push('Phishing Resilience Program');
          break;
      }
    }

    // Generate prevention strategies based on assessment
    const preventionStrategies: string[] = [];
    if (overallScore < 50) {
      preventionStrategies.push(
        'Implement comprehensive employee training and awareness programs',
        'Establish clear data handling and security policies',
        'Deploy user behavior monitoring and analytics'
      );
    } else if (overallScore < 70) {
      preventionStrategies.push(
        'Enhance privileged access management controls',
        'Implement zero-trust architecture principles',
        'Establish insider threat program governance'
      );
    } else {
      preventionStrategies.push(
        'Implement advanced behavioral analytics and ML detection',
        'Establish predictive risk scoring models',
        'Create automated response and remediation workflows'
      );
    }

    // Generate detection strategies
    const detectionStrategies: string[] = [];
    const visibilityScore = pillarBreakdown.find(p => p.pillar === 'visibility')?.score || 0;
    const evidenceScore = pillarBreakdown.find(p => p.pillar === 'evidence')?.score || 0;

    if (visibilityScore < 60) {
      detectionStrategies.push(
        'Deploy comprehensive endpoint detection and response (EDR)',
        'Implement data loss prevention (DLP) solutions',
        'Establish network traffic monitoring and analysis'
      );
    }

    if (evidenceScore < 60) {
      detectionStrategies.push(
        'Implement security information and event management (SIEM)',
        'Establish comprehensive audit logging and retention',
        'Deploy user and entity behavior analytics (UEBA)'
      );
    }

    if (detectionStrategies.length === 0) {
      detectionStrategies.push(
        'Enhance threat hunting capabilities with advanced analytics',
        'Implement deception technology and honeypots',
        'Establish real-time anomaly detection and alerting'
      );
    }

    return {
      highRiskTechniques: highRiskTechniques.slice(0, 5),
      mediumRiskTechniques: mediumRiskTechniques.slice(0, 3),
      recommendedPlaybooks: recommendedPlaybooks.slice(0, 3),
      preventionStrategies: preventionStrategies.slice(0, 3),
      detectionStrategies: detectionStrategies.slice(0, 3)
    };
  } catch (error) {
    console.error('Error mapping assessment to Matrix:', error);

    // Return fallback recommendations
    return {
      highRiskTechniques: [],
      mediumRiskTechniques: [],
      recommendedPlaybooks: [
        'Visibility Foundation Program',
        'Prevention & Coaching Program',
        'Investigation & Evidence Framework'
      ],
      preventionStrategies: [
        'Implement comprehensive employee training programs',
        'Establish clear data handling policies',
        'Deploy user behavior monitoring'
      ],
      detectionStrategies: [
        'Deploy endpoint detection and response (EDR)',
        'Implement security information and event management (SIEM)',
        'Establish comprehensive audit logging'
      ]
    };
  }
}

/**
 * Get threat intelligence summary for PDF
 */
export function generateThreatIntelligenceSummary(
  mapping: AssessmentMatrixMapping,
  overallScore: number
): {
  summary: string;
  riskLevel: string;
  topTechniques: string[];
  keyRecommendations: string[];
} {
  let riskLevel = 'Low';
  let summary = '';

  if (overallScore < 40) {
    riskLevel = 'High';
    summary = 'Your organization shows significant vulnerabilities to insider threats across multiple attack vectors. Immediate attention required to strengthen foundational security controls.';
  } else if (overallScore < 60) {
    riskLevel = 'Medium';
    summary = 'Your organization has basic insider threat protections but gaps exist that could be exploited. Focus on enhancing detection and response capabilities.';
  } else if (overallScore < 80) {
    riskLevel = 'Medium-Low';
    summary = 'Your organization has good insider threat management practices with room for improvement in advanced detection and prevention techniques.';
  } else {
    riskLevel = 'Low';
    summary = 'Your organization demonstrates strong insider threat management with mature controls across all pillars. Focus on continuous improvement and threat hunting.';
  }

  const topTechniques = [
    ...mapping.highRiskTechniques.map(t => t.name || t.title),
    ...mapping.mediumRiskTechniques.map(t => t.name || t.title)
  ].slice(0, 5);

  const keyRecommendations = [
    ...mapping.preventionStrategies.slice(0, 2),
    ...mapping.detectionStrategies.slice(0, 2)
  ].slice(0, 4);

  return {
    summary,
    riskLevel,
    topTechniques,
    keyRecommendations
  };
}