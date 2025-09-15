import { PILLARS } from "./pillars";

interface PillarScore {
  pillar: string;
  score: number;
  weight: number;
  contributionToTotal: number;
}

interface AssessmentData {
  iri: number;
  level: number;
  pillarBreakdown: PillarScore[];
  industry?: string | null;
  size?: string | null;
}

interface InsightData {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const PILLAR_INSIGHTS = {
  visibility: {
    high: [
      "Strong monitoring and detection capabilities across your environment",
      "Comprehensive visibility into user behavior and data movement",
      "Well-established logging and monitoring infrastructure",
      "Effective real-time threat detection systems in place"
    ],
    medium: [
      "Moderate visibility into user activities and data access",
      "Basic monitoring systems deployed but gaps exist",
      "Some blind spots in detection coverage remain",
      "Partial visibility into high-risk user behaviors"
    ],
    low: [
      "Limited visibility into insider activities and data movement",
      "Insufficient monitoring and detection capabilities",
      "Significant gaps in user behavior monitoring",
      "Lack of comprehensive logging infrastructure"
    ],
    recommendations: {
      high: "Implement advanced user behavior analytics (UBA) to identify subtle anomalies",
      medium: "Expand monitoring coverage to include all critical systems and data repositories",
      low: "Deploy comprehensive DLP and SIEM solutions for baseline visibility"
    }
  },
  coaching: {
    high: [
      "Excellent security awareness training and coaching programs",
      "Strong culture of security consciousness across the organization",
      "Regular, targeted training based on role and risk level",
      "Effective feedback loops between security incidents and training"
    ],
    medium: [
      "Basic security training programs in place",
      "Moderate employee engagement with security practices",
      "Annual training conducted but lacks personalization",
      "Some improvement needed in security culture development"
    ],
    low: [
      "Minimal or outdated security awareness training",
      "Limited employee understanding of insider threats",
      "Lack of regular security coaching and reinforcement",
      "Weak security culture with low awareness levels"
    ],
    recommendations: {
      high: "Develop micro-learning modules for continuous security reinforcement",
      medium: "Implement role-based training programs with regular phishing simulations",
      low: "Establish comprehensive security awareness program with monthly training cadence"
    }
  },
  evidence: {
    high: [
      "Robust forensic capabilities and incident response procedures",
      "Comprehensive evidence collection and preservation processes",
      "Well-documented investigation workflows and playbooks",
      "Strong chain of custody and legal readiness"
    ],
    medium: [
      "Basic forensic tools and incident response capabilities",
      "Some evidence collection procedures in place",
      "Moderate investigation capabilities with room for improvement",
      "Partial documentation of incident response processes"
    ],
    low: [
      "Limited forensic and investigation capabilities",
      "Insufficient evidence collection and preservation procedures",
      "Lack of formal incident response processes",
      "Poor documentation and chain of custody practices"
    ],
    recommendations: {
      high: "Enhance forensic automation and integrate threat intelligence feeds",
      medium: "Develop comprehensive incident response playbooks and conduct tabletop exercises",
      low: "Build foundational forensic capabilities and establish evidence handling procedures"
    }
  },
  identity: {
    high: [
      "Strong identity and access management controls",
      "Comprehensive privileged access management (PAM) implementation",
      "Well-managed SaaS application inventory and controls",
      "Effective zero-trust architecture principles applied"
    ],
    medium: [
      "Basic identity management with some gaps",
      "Partial privileged access controls implemented",
      "Some SaaS governance but inventory incomplete",
      "Working toward zero-trust maturity"
    ],
    low: [
      "Weak identity and access management practices",
      "Limited control over privileged accounts",
      "Poor visibility and control of SaaS applications",
      "Traditional perimeter-based security model"
    ],
    recommendations: {
      high: "Implement continuous authentication and risk-based access controls",
      medium: "Deploy PAM solution and establish SaaS security posture management (SSPM)",
      low: "Implement multi-factor authentication (MFA) and basic identity governance"
    }
  },
  phishing: {
    high: [
      "Advanced anti-phishing technologies and email security",
      "Regular phishing simulations with high success rates",
      "Strong user reporting culture for suspicious emails",
      "Comprehensive email authentication (SPF, DKIM, DMARC)"
    ],
    medium: [
      "Basic email security filters in place",
      "Occasional phishing simulations conducted",
      "Some user awareness of phishing threats",
      "Partial email authentication implementation"
    ],
    low: [
      "Minimal phishing defenses in place",
      "Rare or no phishing simulation exercises",
      "Low user awareness of social engineering tactics",
      "Lack of email authentication protocols"
    ],
    recommendations: {
      high: "Deploy AI-powered email security with real-time threat sandboxing",
      medium: "Increase phishing simulation frequency and implement user reporting tools",
      low: "Implement basic email security gateway and monthly phishing awareness training"
    }
  }
};

const LEVEL_RECOMMENDATIONS = {
  1: [
    "Establish a formal insider risk management program with executive sponsorship",
    "Conduct comprehensive risk assessment to identify critical assets and vulnerabilities",
    "Implement basic monitoring and logging across all critical systems",
    "Develop incident response procedures specifically for insider threats",
    "Create security awareness training program focused on insider risk"
  ],
  2: [
    "Enhance monitoring capabilities with user behavior analytics",
    "Implement data loss prevention (DLP) solutions for sensitive data",
    "Develop role-based training programs for high-risk positions",
    "Establish formal investigation procedures with legal coordination",
    "Deploy privileged access management (PAM) for administrative accounts"
  ],
  3: [
    "Integrate threat intelligence feeds into detection systems",
    "Implement zero-trust architecture principles organization-wide",
    "Conduct regular tabletop exercises for insider threat scenarios",
    "Enhance forensic capabilities with automated evidence collection",
    "Develop predictive risk scoring for user activities"
  ],
  4: [
    "Deploy machine learning models for anomaly detection",
    "Implement continuous risk assessment and adaptive controls",
    "Establish threat hunting program focused on insider indicators",
    "Create insider threat fusion center with cross-functional team",
    "Develop automated response playbooks for common scenarios"
  ],
  5: [
    "Optimize AI-driven detection with custom threat models",
    "Implement predictive analytics for early threat identification",
    "Establish continuous improvement metrics and benchmarking",
    "Lead industry collaboration on insider threat intelligence",
    "Develop advanced deception technologies and honeypots"
  ]
};

function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getIndustrySpecificRecommendations(industry?: string | null): string[] {
  const industryRecommendations: Record<string, string[]> = {
    'FINANCIAL_SERVICES': [
      "Implement transaction monitoring for unusual financial activities",
      "Enhance segregation of duties in critical financial processes",
      "Deploy advanced fraud detection systems integrated with insider risk monitoring"
    ],
    'HEALTHCARE': [
      "Strengthen PHI access controls and audit logging per HIPAA requirements",
      "Implement medical record access monitoring with anomaly detection",
      "Enhance workforce training on patient privacy and data protection"
    ],
    'TECHNOLOGY': [
      "Protect intellectual property with code repository monitoring",
      "Implement software supply chain security controls",
      "Monitor developer activities and source code access patterns"
    ],
    'GOVERNMENT': [
      "Enhance clearance management and continuous vetting processes",
      "Implement classification-based data controls and monitoring",
      "Strengthen foreign influence and espionage detection capabilities"
    ],
    'RETAIL': [
      "Monitor point-of-sale systems for unauthorized access",
      "Implement customer data protection controls",
      "Enhance inventory and financial fraud detection"
    ],
    'MANUFACTURING': [
      "Protect trade secrets and manufacturing processes",
      "Monitor industrial control systems for insider tampering",
      "Implement supply chain security controls"
    ],
    'EDUCATION': [
      "Protect student records and research data",
      "Monitor administrative access to academic systems",
      "Implement academic integrity monitoring"
    ]
  };

  if (industry && industryRecommendations[industry]) {
    return industryRecommendations[industry];
  }
  return [];
}

function getSizeSpecificRecommendations(size?: string | null): string[] {
  const sizeRecommendations: Record<string, string[]> = {
    'STARTUP_1_50': [
      "Focus on foundational security controls and awareness",
      "Implement cost-effective cloud-based security solutions",
      "Establish clear security policies and procedures"
    ],
    'SMALL_51_200': [
      "Build dedicated security team or outsource to MSSP",
      "Implement centralized logging and monitoring",
      "Develop formal incident response capabilities"
    ],
    'MEDIUM_201_1000': [
      "Establish security operations center (SOC) capabilities",
      "Deploy enterprise DLP and SIEM solutions",
      "Create insider threat program with dedicated resources"
    ],
    'LARGE_1001_5000': [
      "Implement advanced threat detection with ML/AI",
      "Establish insider threat fusion center",
      "Deploy comprehensive identity governance platform"
    ],
    'ENTERPRISE_5000_PLUS': [
      "Develop custom threat intelligence capabilities",
      "Implement organization-wide zero-trust architecture",
      "Create advanced analytics and predictive risk models"
    ]
  };

  if (size && sizeRecommendations[size]) {
    return sizeRecommendations[size];
  }
  return [];
}

export function generateAssessmentInsights(data: AssessmentData): InsightData {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Analyze each pillar
  data.pillarBreakdown.forEach(pillarScore => {
    const pillar = PILLARS.find(p => p.id === pillarScore.pillar);
    if (!pillar) return;

    const level = getScoreLevel(pillarScore.score);
    const insights = PILLAR_INSIGHTS[pillarScore.pillar as keyof typeof PILLAR_INSIGHTS];

    if (!insights) return;

    // Add strengths for high-scoring pillars
    if (level === 'high') {
      strengths.push(...insights.high.slice(0, 2));
    } else if (level === 'medium' && pillarScore.score >= 55) {
      strengths.push(insights.medium[0]);
    }

    // Add weaknesses for low-scoring pillars
    if (level === 'low') {
      weaknesses.push(...insights.low.slice(0, 2));
    } else if (level === 'medium' && pillarScore.score < 55) {
      weaknesses.push(insights.medium[1]);
    }

    // Add recommendations based on score level
    recommendations.push(insights.recommendations[level]);
  });

  // Add level-based recommendations
  const levelRecs = LEVEL_RECOMMENDATIONS[data.level as keyof typeof LEVEL_RECOMMENDATIONS];
  if (levelRecs) {
    recommendations.push(...levelRecs.slice(0, 2));
  }

  // Add industry-specific recommendations
  const industryRecs = getIndustrySpecificRecommendations(data.industry);
  if (industryRecs.length > 0) {
    recommendations.push(industryRecs[0]);
  }

  // Add size-specific recommendations
  const sizeRecs = getSizeSpecificRecommendations(data.size);
  if (sizeRecs.length > 0) {
    recommendations.push(sizeRecs[0]);
  }

  // Sort pillars by score to prioritize
  const sortedPillars = [...data.pillarBreakdown].sort((a, b) => a.score - b.score);

  // If no strengths identified, add general ones based on level
  if (strengths.length === 0) {
    if (data.level >= 3) {
      strengths.push(
        "Organization demonstrates commitment to insider risk management",
        "Foundation established for security program maturation",
        "Leadership engagement in security initiatives evident"
      );
    } else {
      strengths.push(
        "Assessment completion shows security awareness",
        "Opportunity identified for significant improvements",
        "Baseline established for tracking progress"
      );
    }
  }

  // If no weaknesses identified, add based on lowest scoring pillars
  if (weaknesses.length === 0 && sortedPillars.length > 0) {
    const lowestPillar = sortedPillars[0];
    const pillar = PILLARS.find(p => p.id === lowestPillar.pillar);
    if (pillar) {
      weaknesses.push(
        `${pillar.name} capabilities need enhancement (${Math.round(lowestPillar.score)}% maturity)`,
        `Gap identified in ${pillar.description.toLowerCase()}`
      );
    }
  }

  // Ensure we have at least 3 of each type
  while (strengths.length < 3) {
    strengths.push(`Achieved Level ${data.level} maturity in insider risk management`);
    if (strengths.length < 3) {
      const avgScore = Math.round(data.iri);
      if (avgScore > 50) {
        strengths.push(`Overall program maturity of ${avgScore}% demonstrates progress`);
      }
    }
  }

  while (weaknesses.length < 3) {
    const lowestPillars = sortedPillars.slice(0, 3);
    lowestPillars.forEach((p, i) => {
      if (weaknesses.length < 3) {
        const pillar = PILLARS.find(pil => pil.id === p.pillar);
        if (pillar && !weaknesses.some(w => w.includes(pillar.name))) {
          weaknesses.push(`Opportunity to strengthen ${pillar.name.toLowerCase()} capabilities`);
        }
      }
    });
  }

  while (recommendations.length < 5) {
    const remaining = [
      "Conduct quarterly assessments to track improvement progress",
      "Engage executive leadership for insider risk program sponsorship",
      "Develop metrics and KPIs for measuring program effectiveness",
      "Create cross-functional insider threat team",
      "Benchmark against industry peers regularly"
    ];
    recommendations.push(...remaining.slice(0, 5 - recommendations.length));
  }

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    recommendations: recommendations.slice(0, 5)
  };
}