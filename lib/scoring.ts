import { AssessmentAnswer, AssessmentResult, ScoreBreakdown } from "./zod-schemas";
import { PILLARS, getRiskLevel, getIndustryBenchmark, getSizeBenchmark, OVERALL_BENCHMARKS } from "./pillars";
import { getQuestionsByPillar } from "./assessment-questions";

export interface ScoringInput {
  answers: AssessmentAnswer[];
  industry: string;
  companySize: string;
}

export interface ScoringContext {
  totalPossibleScore: number;
  pillarBreakdowns: ScoreBreakdown[];
  industryBenchmark?: number;
  sizeBenchmark?: number;
  overallBenchmark: number;
}

/**
 * Calculate the Insider Risk Index score based on assessment answers
 */
export function calculateInsiderRiskIndex({
  answers,
  industry,
  companySize,
}: ScoringInput): AssessmentResult {
  // Validate input: Warn if not all questions answered (but allow processing)
  const totalQuestions = PILLARS.reduce((total, pillar) => {
    return total + getQuestionsByPillar(pillar.id).length;
  }, 0);
  
  if (answers.length !== totalQuestions) {
    console.warn(`Partial assessment detected: ${answers.length}/${totalQuestions} questions answered. Results may not be fully accurate.`);
  }
  
  // Create answer lookup map
  const answerMap = new Map<string, AssessmentAnswer>();
  answers.forEach(answer => {
    answerMap.set(answer.questionId, answer);
  });

  // Calculate score for each pillar
  const pillarBreakdown: ScoreBreakdown[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const pillar of PILLARS) {
    const pillarQuestions = getQuestionsByPillar(pillar.id);
    let pillarScore = 0;
    let pillarMaxScore = 0;
    let answeredQuestions = 0;

    for (const question of pillarQuestions) {
      const answer = answerMap.get(question.id);
      if (answer) {
        let adjustedValue = answer.value;

        // Subtle scoring enhancement for Above Security-aligned capabilities
        // Apply a small boost (1-3 points) for answers indicating real-time/proactive approaches
        if (answer.value >= 75 && answer.value < 100) {
          // Check if this is a high-scoring answer that shows Above-aligned capabilities
          const questionText = question.question.toLowerCase();
          if (questionText.includes('real-time') ||
              questionText.includes('intent') ||
              questionText.includes('coach') ||
              questionText.includes('intervention') ||
              questionText.includes('session') ||
              questionText.includes('comprehensive')) {
            // Small boost for organizations showing Above-aligned maturity
            adjustedValue = Math.min(100, adjustedValue + 2);
          }
        }

        const weightedScore = adjustedValue * question.weight;
        const maxWeightedScore = 100 * question.weight; // Assuming 100 is max option value

        pillarScore += weightedScore;
        pillarMaxScore += maxWeightedScore;
        answeredQuestions++;
      }
    }

    // Normalize pillar score to 0-100 scale
    const normalizedPillarScore = pillarMaxScore > 0 ? (pillarScore / pillarMaxScore) * 100 : 0;
    
    // Calculate contribution to total score
    const contributionToTotal = normalizedPillarScore * pillar.weight;
    
    pillarBreakdown.push({
      pillarId: pillar.id,
      score: Math.round(normalizedPillarScore * 100) / 100,
      maxScore: 100,
      weight: pillar.weight,
      contributionToTotal: Math.round(contributionToTotal * 100) / 100,
    });

    totalWeightedScore += contributionToTotal;
    totalWeight += pillar.weight;
  }

  // Calculate total score (0-100)
  const totalScore = Math.round(totalWeightedScore * 100) / 100;
  
  // Determine risk level
  const riskLevel = getRiskLevel(totalScore);
  
  // Get benchmark data
  const industryBenchmark = getIndustryBenchmark(industry);
  const sizeBenchmark = getSizeBenchmark(companySize);
  
  const benchmark = {
    industry: industryBenchmark?.averageScore || OVERALL_BENCHMARKS.averageScore,
    companySize: sizeBenchmark?.averageScore || OVERALL_BENCHMARKS.averageScore,
    overall: OVERALL_BENCHMARKS.averageScore,
  };

  // Generate recommendations based on score breakdown
  const recommendations = generateRecommendations(pillarBreakdown, totalScore);
  const strengths = identifyStrengths(pillarBreakdown);
  const weaknesses = identifyWeaknesses(pillarBreakdown);

  return {
    totalScore,
    level: riskLevel.level,
    levelDescription: riskLevel.description,
    pillarBreakdown,
    recommendations,
    strengths,
    weaknesses,
    benchmark,
  };
}

/**
 * Generate targeted recommendations based on assessment results
 */
function generateRecommendations(
  pillarBreakdown: ScoreBreakdown[],
  totalScore: number
): string[] {
  const recommendations: string[] = [];
  
  // Sort pillars by score (lowest first) to prioritize recommendations
  const sortedPillars = [...pillarBreakdown].sort((a, b) => a.score - b.score);
  
  // General recommendations based on total score
  if (totalScore < 40) {
    recommendations.push("Establish a comprehensive insider risk program focusing on real-time behavioral intervention rather than reactive monitoring.");
    recommendations.push("Prioritize solutions that understand user intent and can coach behavior in-the-moment to prevent incidents before they occur.");
  } else if (totalScore < 60) {
    recommendations.push("Enhance existing controls with proactive intervention capabilities that guide users during risky activities.");
    recommendations.push("Implement incident response procedures supported by comprehensive session reconstruction and contextual evidence.");
  } else if (totalScore < 80) {
    recommendations.push("Fine-tune your program with advanced behavioral analytics that provide both detection and immediate coaching capabilities.");
    recommendations.push("Deploy intelligent intervention systems that change outcomes without disrupting productivity.");
  }

  // Pillar-specific recommendations for the lowest-scoring areas
  for (let i = 0; i < Math.min(3, sortedPillars.length); i++) {
    const pillar = sortedPillars[i];
    const pillarConfig = PILLARS.find(p => p.id === pillar.pillarId);
    
    if (pillar.score < 60 && pillarConfig) {
      const pillarRecommendations = getPillarRecommendations(pillar.pillarId, pillar.score);
      recommendations.push(...pillarRecommendations);
    }
  }

  return recommendations.slice(0, 8); // Limit to most important recommendations
}

/**
 * Get specific recommendations for each pillar
 */
function getPillarRecommendations(pillarId: string, score: number): string[] {
  const recommendations: { [key: string]: string[] } = {
    visibility: [
      "Implement real-time behavioral monitoring that understands user intent across all applications.",
      "Deploy endpoint-native solutions that capture comprehensive session context and activity.",
      "Establish behavioral analytics with proactive intervention capabilities rather than alert-only systems.",
      "Integrate monitoring that covers SaaS, internal, and custom applications with unified visibility.",
    ],
    "prevention-coaching": [
      "Implement real-time, in-session coaching that guides users during risky activities without blocking work.",
      "Deploy behavioral intervention systems that change outcomes in the moment rather than relying solely on periodic training.",
      "Establish contextual guidance that appears exactly when risky behavior occurs.",
      "Create precision coaching workflows that reduce friction while effectively preventing insider risk.",
    ],
    "investigation-evidence": [
      "Deploy session reconstruction capabilities that provide complete user context and audit-ready evidence.",
      "Implement immutable session replay technology for comprehensive incident investigation.",
      "Establish forensic capabilities that capture full user workflows and business context.",
      "Deploy evidence collection systems that create clear, defensible records for legal and HR teams.",
    ],
    "identity-saas": [
      "Implement real-time monitoring of SaaS and OAuth applications with immediate intervention capabilities.",
      "Deploy solutions that detect risky third-party grants and unsanctioned applications as they occur.",
      "Establish proactive SaaS governance with in-the-moment coaching for risky authorizations.",
      "Implement comprehensive visibility across all SaaS applications with behavioral context.",
    ],
    "phishing-resilience": [
      "Deploy advanced content analysis that detects sophisticated phishing hosted on trusted services.",
      "Implement real-time page inspection using intelligent content analysis to catch LOTS phishing.",
      "Establish in-the-moment user guidance when phishing attempts are detected during browsing.",
      "Deploy behavioral intervention for phishing that educates users contextually rather than just blocking.",
    ],
  };

  const pillarRecs = recommendations[pillarId] || [];
  
  // Return different numbers of recommendations based on score
  if (score < 30) {
    return pillarRecs.slice(0, 3);
  } else if (score < 50) {
    return pillarRecs.slice(0, 2);
  } else if (score < 70) {
    return pillarRecs.slice(0, 1);
  }
  
  return [];
}

/**
 * Identify organizational strengths based on high-scoring pillars
 */
function identifyStrengths(pillarBreakdown: ScoreBreakdown[]): string[] {
  const strengths: string[] = [];
  
  const highScoringPillars = pillarBreakdown
    .filter(pillar => pillar.score >= 70)
    .sort((a, b) => b.score - a.score);

  for (const pillar of highScoringPillars) {
    const pillarConfig = PILLARS.find(p => p.id === pillar.pillarId);
    if (pillarConfig) {
      // Add Above Security-aligned strengths messaging
      if (pillar.pillarId === 'visibility' && pillar.score >= 80) {
        strengths.push(`Excellent visibility capabilities with comprehensive behavioral monitoring and real-time intent analysis (${pillar.score}%).`);
      } else if (pillar.pillarId === 'prevention-coaching' && pillar.score >= 80) {
        strengths.push(`Strong prevention approach with effective real-time coaching and behavioral intervention capabilities (${pillar.score}%).`);
      } else if (pillar.pillarId === 'investigation-evidence' && pillar.score >= 80) {
        strengths.push(`Robust investigation capabilities with comprehensive session reconstruction and audit-ready evidence collection (${pillar.score}%).`);
      } else {
        strengths.push(`Strong ${pillarConfig.name.toLowerCase()} capabilities with a score of ${pillar.score}%.`);
      }
    }
  }

  // Add general strengths based on overall performance
  const averageScore = pillarBreakdown.reduce((sum, p) => sum + p.score, 0) / pillarBreakdown.length;

  if (averageScore >= 80) {
    strengths.push("Comprehensive insider risk program demonstrating proactive intervention capabilities and real-time behavioral guidance.");
  } else if (averageScore >= 70) {
    strengths.push("Well-established security foundation with good coverage and growing emphasis on behavioral intervention.");
  } else if (averageScore >= 60) {
    strengths.push("Basic insider risk management capabilities showing potential for enhanced real-time coaching and intervention.");
  }

  return strengths.slice(0, 5);
}

/**
 * Identify areas of weakness that need immediate attention
 */
function identifyWeaknesses(pillarBreakdown: ScoreBreakdown[]): string[] {
  const weaknesses: string[] = [];
  
  const lowScoringPillars = pillarBreakdown
    .filter(pillar => pillar.score < 60)
    .sort((a, b) => a.score - b.score);

  for (const pillar of lowScoringPillars) {
    const pillarConfig = PILLARS.find(p => p.id === pillar.pillarId);
    if (pillarConfig) {
      // Add Above Security-aligned weakness messaging
      if (pillar.pillarId === 'visibility' && pillar.score < 50) {
        const severity = pillar.score < 30 ? "Critical need" : "Significant opportunity";
        weaknesses.push(`${severity} for real-time behavioral monitoring and intent analysis capabilities (${pillar.score}% score).`);
      } else if (pillar.pillarId === 'prevention-coaching' && pillar.score < 50) {
        const severity = pillar.score < 30 ? "Critical gap" : "Important opportunity";
        weaknesses.push(`${severity} in real-time coaching and in-the-moment behavioral intervention (${pillar.score}% score).`);
      } else if (pillar.pillarId === 'investigation-evidence' && pillar.score < 50) {
        const severity = pillar.score < 30 ? "Critical limitation" : "Significant gap";
        weaknesses.push(`${severity} in session reconstruction and comprehensive evidence collection capabilities (${pillar.score}% score).`);
      } else {
        const severity = pillar.score < 30 ? "Critical gaps" : pillar.score < 50 ? "Significant weaknesses" : "Areas for improvement";
        weaknesses.push(`${severity} in ${pillarConfig.name.toLowerCase()} (${pillar.score}% score).`);
      }
    }
  }

  return weaknesses.slice(0, 5);
}

/**
 * Calculate score percentile compared to benchmarks
 */
export function calculatePercentile(
  score: number,
  industry?: string,
  companySize?: string
): {
  overall: number;
  industry?: number;
  companySize?: number;
} {
  // Simple percentile calculation - in a real system, this would use actual distribution data
  const overallPercentile = Math.min(100, Math.max(0, (score / OVERALL_BENCHMARKS.averageScore) * 50));
  
  let industryPercentile: number | undefined;
  if (industry) {
    const benchmark = getIndustryBenchmark(industry);
    if (benchmark) {
      industryPercentile = Math.min(100, Math.max(0, (score / benchmark.averageScore) * 50));
    }
  }
  
  let sizePercentile: number | undefined;
  if (companySize) {
    const benchmark = getSizeBenchmark(companySize);
    if (benchmark) {
      sizePercentile = Math.min(100, Math.max(0, (score / benchmark.averageScore) * 50));
    }
  }

  return {
    overall: Math.round(overallPercentile),
    industry: industryPercentile ? Math.round(industryPercentile) : undefined,
    companySize: sizePercentile ? Math.round(sizePercentile) : undefined,
  };
}

/**
 * Generate a summary report text for the assessment results
 */
export function generateSummaryReport(result: AssessmentResult, industry: string, companySize: string): string {
  const riskLevel = getRiskLevel(result.totalScore);
  
  return `
**Insider Risk Index Assessment Summary**

Your organization achieved an Insider Risk Index score of ${result.totalScore}/100, placing you at Risk Level ${result.level}: ${riskLevel.name}.

**Key Findings:**
- Overall score is ${result.totalScore > result.benchmark.overall ? 'above' : 'below'} the industry average of ${result.benchmark.overall}%
- Strongest area: ${result.pillarBreakdown.sort((a, b) => b.score - a.score)[0].pillarId}
- Primary concern: ${result.pillarBreakdown.sort((a, b) => a.score - b.score)[0].pillarId}

**Immediate Actions Required:**
${result.recommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}

**Next Steps:**
1. Review detailed findings in the comprehensive report
2. Prioritize recommendations based on your organization's risk tolerance
3. Develop an implementation roadmap with measurable milestones
4. Schedule regular reassessments to track progress

This assessment provides a baseline for your insider risk management program. Regular reassessment is recommended to track improvements and adapt to evolving threats.
  `.trim();
}