import { AssessmentQuestion } from "./zod-schemas";

// Assessment questions organized by pillar
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // VISIBILITY PILLAR
  {
    id: "v1",
    pillarId: "visibility",
    question: "How comprehensive is your organization's endpoint monitoring and logging?",
    options: [
      { value: 0, label: "No centralized monitoring", description: "Limited to basic antivirus" },
      { value: 25, label: "Basic monitoring", description: "Some endpoint agents deployed" },
      { value: 50, label: "Moderate coverage", description: "Most endpoints monitored with basic logging" },
      { value: 75, label: "Good coverage", description: "Comprehensive endpoint monitoring with detailed logs" },
      { value: 100, label: "Excellent coverage", description: "Full endpoint visibility with real-time monitoring and behavioral analytics" },
    ],
    weight: 0.3,
    explanation: "Endpoint monitoring is critical for detecting insider activities across workstations, servers, and mobile devices. According to Gartner's 2024 Market Guide, organizations with comprehensive endpoint visibility experience 40% faster threat detection (Gartner, G00805757, 2024).",
  },
  {
    id: "v2",
    pillarId: "visibility",
    question: "What level of user activity monitoring do you have in place?",
    options: [
      { value: 0, label: "No user monitoring", description: "No tracking of user activities" },
      { value: 25, label: "Basic access logs", description: "Login/logout tracking only" },
      { value: 50, label: "Application usage tracking", description: "Track application access and basic usage" },
      { value: 75, label: "Detailed activity monitoring", description: "File access, email, and web activity monitoring" },
      { value: 100, label: "Comprehensive behavioral analytics", description: "AI-powered behavioral analysis with anomaly detection" },
    ],
    weight: 0.25,
    explanation: "Understanding normal user behavior patterns is essential for identifying suspicious activities. Ponemon Institute's 2025 report shows that organizations with User Behavior Analytics (UBA) reduce containment time from 81 days to 45 days on average (Ponemon Institute, 2025).",
  },
  {
    id: "v3",
    pillarId: "visibility",
    question: "How well do you monitor data movement and file activities?",
    options: [
      { value: 0, label: "No data monitoring", description: "No tracking of file activities" },
      { value: 25, label: "Basic file logging", description: "Log file creation/deletion only" },
      { value: 50, label: "File access monitoring", description: "Track file access patterns and modifications" },
      { value: 75, label: "Data loss prevention", description: "DLP tools monitoring data movement" },
      { value: 100, label: "Advanced data analytics", description: "ML-powered data classification and movement analytics" },
    ],
    weight: 0.25,
    explanation: "Data movement monitoring helps detect unauthorized access to sensitive information. Gartner research indicates that 85% of successful insider data theft involves unusual data access patterns that could be detected with proper monitoring (Gartner Market Guide, 2024).",
  },
  {
    id: "v4",
    pillarId: "visibility",
    question: "What is your network traffic monitoring capability?",
    options: [
      { value: 0, label: "No network monitoring", description: "Basic firewall logs only" },
      { value: 25, label: "Perimeter monitoring", description: "Monitor external network traffic" },
      { value: 50, label: "Internal traffic visibility", description: "Some internal network monitoring" },
      { value: 75, label: "Comprehensive network analytics", description: "Full network visibility with traffic analysis" },
      { value: 100, label: "Advanced threat detection", description: "AI-powered network behavior analysis" },
    ],
    weight: 0.2,
    explanation: "Network monitoring provides visibility into data exfiltration and lateral movement. Gartner's 2024 Market Guide shows that 56% of insider attack vectors involve information disclosure, making network monitoring critical for data protection (Gartner G00805757, 2024).",
  },

  // PREVENTION & COACHING PILLAR
  {
    id: "pc1",
    pillarId: "prevention-coaching",
    question: "How comprehensive is your insider threat awareness training program?",
    options: [
      { value: 0, label: "No formal training", description: "No insider threat awareness training" },
      { value: 25, label: "Basic security training", description: "General security awareness only" },
      { value: 50, label: "Annual insider threat training", description: "Annual training covering insider threats" },
      { value: 75, label: "Regular targeted training", description: "Role-based training with regular updates" },
      { value: 100, label: "Comprehensive program", description: "Continuous training with simulations and assessments" },
    ],
    weight: 0.3,
    explanation: "Training helps employees understand insider threats and their role in prevention. According to Ponemon Institute's 2025 research, organizations with comprehensive insider threat training programs experience 27% fewer incidents than those with basic or no training (Ponemon Institute, 2025).",
  },
  {
    id: "pc2",
    pillarId: "prevention-coaching",
    question: "What screening processes do you have for employees with privileged access?",
    options: [
      { value: 0, label: "No additional screening", description: "Standard hiring process only" },
      { value: 25, label: "Basic background checks", description: "Criminal background verification" },
      { value: 50, label: "Enhanced screening", description: "Credit checks and reference verification" },
      { value: 75, label: "Comprehensive vetting", description: "Regular re-screening and psychological assessments" },
      { value: 100, label: "Continuous monitoring", description: "Ongoing screening with behavioral indicators" },
    ],
    weight: 0.25,
    explanation: "Enhanced screening helps identify potential risks before granting privileged access. According to Gartner's Market Guide, more than 50% of insider incidents lack malicious intent, emphasizing the importance of identifying at-risk individuals early (Gartner G00805757, 2024).",
  },
  {
    id: "pc3",
    pillarId: "prevention-coaching",
    question: "How well do you monitor and support employee well-being and satisfaction?",
    options: [
      { value: 0, label: "No formal program", description: "No employee wellness initiatives" },
      { value: 25, label: "Basic HR support", description: "Standard HR complaint processes" },
      { value: 50, label: "Employee assistance program", description: "EAP and basic wellness resources" },
      { value: 75, label: "Proactive wellness monitoring", description: "Regular surveys and proactive support" },
      { value: 100, label: "Comprehensive program", description: "Advanced analytics and personalized interventions" },
    ],
    weight: 0.2,
    explanation: "Employee satisfaction and well-being directly impact insider threat risk. Ponemon research shows that 62% of insider incidents are correlated with declining employee satisfaction scores, making wellness monitoring a critical prevention strategy (Ponemon Institute, 2025).",
  },
  {
    id: "pc4",
    pillarId: "prevention-coaching",
    question: "What policies and procedures do you have for reporting suspicious behavior?",
    options: [
      { value: 0, label: "No formal process", description: "No established reporting mechanisms" },
      { value: 25, label: "Basic reporting channels", description: "Standard HR or security reporting" },
      { value: 50, label: "Anonymous reporting system", description: "Anonymous hotline or web portal" },
      { value: 75, label: "Multiple reporting options", description: "Various channels with protection for reporters" },
      { value: 100, label: "Comprehensive program", description: "Incentivized reporting with follow-up processes" },
    ],
    weight: 0.25,
    explanation: "Effective reporting mechanisms enable early detection of potential insider threats. Gartner research shows that organizations invest an average of $16.2 million annually in insider threat programs, highlighting the importance of effective reporting systems (Gartner G00805757, 2024).",
  },

  // INVESTIGATION & EVIDENCE PILLAR
  {
    id: "ie1",
    pillarId: "investigation-evidence",
    question: "What forensic investigation capabilities does your organization have?",
    options: [
      { value: 0, label: "No forensic capability", description: "No digital forensics resources" },
      { value: 25, label: "Basic incident response", description: "Limited investigation capabilities" },
      { value: 50, label: "Internal forensics team", description: "Dedicated team with basic tools" },
      { value: 75, label: "Advanced forensics", description: "Comprehensive tools and trained personnel" },
      { value: 100, label: "Expert capabilities", description: "Advanced forensics with legal admissibility standards" },
    ],
    weight: 0.3,
    explanation: "Forensic capabilities are essential for thorough investigation of insider incidents. Gartner reports that 70% of organizations identify technical challenges or cost as primary obstacles to effective insider threat management, making robust forensic capabilities a key differentiator (Gartner G00805757, 2024).",
  },
  {
    id: "ie2",
    pillarId: "investigation-evidence",
    question: "How comprehensive are your audit logs and data retention policies?",
    options: [
      { value: 0, label: "Minimal logging", description: "Basic system logs only" },
      { value: 25, label: "Standard audit logs", description: "Application and system logs" },
      { value: 50, label: "Comprehensive logging", description: "Detailed logs across all systems" },
      { value: 75, label: "Centralized log management", description: "SIEM with log correlation" },
      { value: 100, label: "Advanced log analytics", description: "AI-powered log analysis and long-term retention" },
    ],
    weight: 0.25,
    explanation: "Comprehensive logging provides the evidence trail needed for investigations.",
  },
  {
    id: "ie3",
    pillarId: "investigation-evidence",
    question: "What incident response procedures do you have for insider threats?",
    options: [
      { value: 0, label: "No specific procedures", description: "No insider threat incident response plan" },
      { value: 25, label: "Basic response plan", description: "General security incident procedures" },
      { value: 50, label: "Insider threat procedures", description: "Specific procedures for insider incidents" },
      { value: 75, label: "Comprehensive playbooks", description: "Detailed playbooks with roles and responsibilities" },
      { value: 100, label: "Tested and refined procedures", description: "Regularly tested and updated procedures" },
    ],
    weight: 0.25,
    explanation: "Specialized incident response procedures are crucial for effective insider threat management.",
  },
  {
    id: "ie4",
    pillarId: "investigation-evidence",
    question: "How well do you coordinate with legal and HR teams during investigations?",
    options: [
      { value: 0, label: "No coordination", description: "No established coordination processes" },
      { value: 25, label: "Ad-hoc coordination", description: "Case-by-case coordination as needed" },
      { value: 50, label: "Defined processes", description: "Clear escalation and coordination procedures" },
      { value: 75, label: "Integrated approach", description: "Joint investigation teams and procedures" },
      { value: 100, label: "Seamless coordination", description: "Fully integrated legal, HR, and security processes" },
    ],
    weight: 0.2,
    explanation: "Effective coordination ensures investigations are thorough and legally sound.",
  },

  // IDENTITY & SAAS/OAUTH PILLAR
  {
    id: "is1",
    pillarId: "identity-saas",
    question: "How robust is your identity and access management (IAM) system?",
    options: [
      { value: 0, label: "Basic user accounts", description: "Simple username/password authentication" },
      { value: 25, label: "Centralized authentication", description: "Single sign-on (SSO) implementation" },
      { value: 50, label: "Role-based access control", description: "RBAC with defined user roles" },
      { value: 75, label: "Advanced IAM", description: "Comprehensive IAM with lifecycle management" },
      { value: 100, label: "Zero trust architecture", description: "Zero trust with continuous verification" },
    ],
    weight: 0.3,
    explanation: "Strong IAM controls are fundamental to preventing unauthorized access. Gartner's Market Guide emphasizes that insider risk management requires broad stakeholder participation, with IAM as a critical foundation for comprehensive programs (Gartner G00805757, 2024).",
  },
  {
    id: "is2",
    pillarId: "identity-saas",
    question: "What multi-factor authentication (MFA) coverage do you have?",
    options: [
      { value: 0, label: "No MFA", description: "Password-only authentication" },
      { value: 25, label: "Limited MFA", description: "MFA for some admin accounts" },
      { value: 50, label: "Selective MFA", description: "MFA for privileged and remote access" },
      { value: 75, label: "Broad MFA coverage", description: "MFA for most systems and users" },
      { value: 100, label: "Universal MFA", description: "MFA required for all access with adaptive controls" },
    ],
    weight: 0.25,
    explanation: "MFA significantly reduces the risk of account compromise and unauthorized access.",
  },
  {
    id: "is3",
    pillarId: "identity-saas",
    question: "How do you manage privileged access and administrative accounts?",
    options: [
      { value: 0, label: "No special controls", description: "Admin accounts managed like regular users" },
      { value: 25, label: "Basic admin controls", description: "Separate admin accounts with stronger passwords" },
      { value: 50, label: "Privileged account management", description: "PAM solution with some automation" },
      { value: 75, label: "Comprehensive PAM", description: "Full PAM with session recording and approval workflows" },
      { value: 100, label: "Advanced PAM", description: "Zero standing privileges with just-in-time access" },
    ],
    weight: 0.25,
    explanation: "Privileged access management is critical for protecting high-value administrative access.",
  },
  {
    id: "is4",
    pillarId: "identity-saas",
    question: "How frequently do you review and certify user access rights?",
    options: [
      { value: 0, label: "No regular reviews", description: "Access reviews done only on request" },
      { value: 25, label: "Annual reviews", description: "Annual access certification process" },
      { value: 50, label: "Quarterly reviews", description: "Quarterly access reviews for critical systems" },
      { value: 75, label: "Monthly reviews", description: "Monthly reviews with automated workflows" },
      { value: 100, label: "Continuous certification", description: "Automated continuous access certification" },
    ],
    weight: 0.2,
    explanation: "Regular access reviews ensure users have appropriate permissions and remove excessive privileges.",
  },

  // PHISHING RESILIENCE PILLAR
  {
    id: "pr1",
    pillarId: "phishing-resilience",
    question: "What email security controls do you have in place?",
    options: [
      { value: 0, label: "Basic email filtering", description: "Standard spam filtering only" },
      { value: 25, label: "Enhanced filtering", description: "Anti-phishing and malware detection" },
      { value: 50, label: "Advanced email security", description: "Sandboxing and URL rewriting" },
      { value: 75, label: "Comprehensive protection", description: "AI-powered threat detection and blocking" },
      { value: 100, label: "Zero-trust email", description: "Advanced protection with behavioral analysis" },
    ],
    weight: 0.3,
    explanation: "Email remains the primary attack vector for phishing and social engineering attacks. Verizon's 2024 DBIR reports that 68% of data breaches involve non-malicious human elements, with phishing being the leading attack vector enabling insider compromise (Verizon DBIR, 2024).",
  },
  {
    id: "pr2",
    pillarId: "phishing-resilience",
    question: "How comprehensive is your phishing awareness training and testing?",
    options: [
      { value: 0, label: "No phishing training", description: "No specific phishing awareness training" },
      { value: 25, label: "Annual training", description: "Annual phishing awareness sessions" },
      { value: 50, label: "Regular training", description: "Quarterly training with some simulations" },
      { value: 75, label: "Comprehensive program", description: "Monthly training with regular simulated attacks" },
      { value: 100, label: "Continuous education", description: "Real-time training with personalized coaching" },
    ],
    weight: 0.25,
    explanation: "Regular training and testing help employees recognize and report phishing attempts. According to Gartner's research, 64% of AI users emphasize the pivotal role AI plays in enabling robust predictive models for insider risk management, making advanced training programs increasingly important (Gartner G00805757, 2024).",
  },
  {
    id: "pr3",
    pillarId: "phishing-resilience",
    question: "What endpoint protection do you have against malware and social engineering?",
    options: [
      { value: 0, label: "Basic antivirus", description: "Traditional signature-based antivirus" },
      { value: 25, label: "Enhanced antivirus", description: "Modern antivirus with behavioral detection" },
      { value: 50, label: "Endpoint detection", description: "EDR solution with threat hunting" },
      { value: 75, label: "Advanced protection", description: "AI-powered endpoint protection platform" },
      { value: 100, label: "Comprehensive defense", description: "Multi-layered protection with deception technology" },
    ],
    weight: 0.25,
    explanation: "Endpoint protection is crucial for stopping malware delivered through phishing attacks.",
  },
  {
    id: "pr4",
    pillarId: "phishing-resilience",
    question: "How do you handle and respond to phishing incidents?",
    options: [
      { value: 0, label: "No formal process", description: "Ad-hoc response to phishing reports" },
      { value: 25, label: "Basic response", description: "Simple incident logging and user notification" },
      { value: 50, label: "Structured response", description: "Defined procedures for phishing incidents" },
      { value: 75, label: "Comprehensive response", description: "Automated response with threat intelligence" },
      { value: 100, label: "Advanced orchestration", description: "Automated response with real-time threat sharing" },
    ],
    weight: 0.2,
    explanation: "Effective incident response minimizes the impact of successful phishing attacks.",
  },
];

/**
 * Get all questions for a specific pillar
 */
export function getQuestionsByPillar(pillarId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(q => q.pillarId === pillarId);
}

/**
 * Get a question by its ID
 */
export function getQuestionById(questionId: string): AssessmentQuestion | undefined {
  return ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
}

/**
 * Get all questions organized by pillar
 */
export function getQuestionsGroupedByPillar(): Record<string, AssessmentQuestion[]> {
  const grouped: Record<string, AssessmentQuestion[]> = {};
  
  for (const question of ASSESSMENT_QUESTIONS) {
    if (!grouped[question.pillarId]) {
      grouped[question.pillarId] = [];
    }
    grouped[question.pillarId].push(question);
  }
  
  return grouped;
}

/**
 * Validate that all required questions have been answered
 */
export function validateAnswerCompleteness(answers: Array<{ questionId: string; value: number }>): {
  isComplete: boolean;
  missingQuestions: string[];
} {
  const answeredQuestionIds = new Set(answers.map(a => a.questionId));
  const missingQuestions = ASSESSMENT_QUESTIONS
    .filter(q => !answeredQuestionIds.has(q.id))
    .map(q => q.id);
  
  return {
    isComplete: missingQuestions.length === 0,
    missingQuestions,
  };
}