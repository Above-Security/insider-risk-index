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
        const weightedScore = answer.value * question.weight;
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
    recommendations.push("Establish a comprehensive insider risk management program with dedicated resources and executive sponsorship.");
    recommendations.push("Conduct a thorough risk assessment to identify your organization's most critical vulnerabilities.");
  } else if (totalScore < 60) {
    recommendations.push("Enhance existing security controls with a focus on the lowest-scoring areas.");
    recommendations.push("Develop incident response procedures specific to insider threats.");
  } else if (totalScore < 80) {
    recommendations.push("Fine-tune your insider risk program to address remaining gaps.");
    recommendations.push("Implement advanced analytics to improve threat detection capabilities.");
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
      "Deploy comprehensive monitoring tools across all endpoints and network segments.",
      "Implement user behavior analytics to detect anomalous activities.",
      "Establish baseline patterns for normal user and system behavior.",
      "Integrate security information and event management (SIEM) systems.",
    ],
    "prevention-coaching": [
      "Develop and deliver insider threat awareness training programs.",
      "Implement psychological evaluation processes for high-risk positions.",
      "Establish clear policies and procedures for reporting suspicious behavior.",
      "Create a positive workplace culture that reduces motivation for malicious activity.",
    ],
    "investigation-evidence": [
      "Establish forensic investigation capabilities and procedures.",
      "Implement comprehensive audit logging and retention policies.",
      "Train security team members in digital forensics techniques.",
      "Develop legal and HR coordination processes for investigations.",
    ],
    "identity-saas": [
      "Implement multi-factor authentication across all systems.",
      "Deploy privileged access management (PAM) solutions.",
      "Establish regular access reviews and certification processes.",
      "Implement just-in-time access provisioning for sensitive systems.",
    ],
    "phishing-resilience": [
      "Deploy advanced email security solutions with sandboxing capabilities.",
      "Implement regular phishing simulation and training programs.",
      "Establish clear procedures for reporting and responding to phishing attempts.",
      "Deploy endpoint detection and response (EDR) solutions.",
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
      strengths.push(`Strong ${pillarConfig.name.toLowerCase()} capabilities with a score of ${pillar.score}%.`);
    }
  }

  // Add general strengths based on overall performance
  const averageScore = pillarBreakdown.reduce((sum, p) => sum + p.score, 0) / pillarBreakdown.length;
  
  if (averageScore >= 80) {
    strengths.push("Comprehensive insider risk management program with strong controls across all areas.");
  } else if (averageScore >= 70) {
    strengths.push("Well-established security foundation with good coverage of insider risk controls.");
  } else if (averageScore >= 60) {
    strengths.push("Basic insider risk management capabilities in place with room for enhancement.");
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
      const severity = pillar.score < 30 ? "Critical gaps" : pillar.score < 50 ? "Significant weaknesses" : "Areas for improvement";
      weaknesses.push(`${severity} in ${pillarConfig.name.toLowerCase()} (${pillar.score}% score).`);
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