import { AssessmentResult } from "@/lib/zod-schemas";
import { PILLARS, getRiskLevel } from "@/lib/pillars";
import { formatDate } from "@/lib/utils";
import { type Recommendation } from "@/lib/recommendations";

interface OrganizationData {
  organizationName: string;
  industry: string;
  employeeCount: string;
}

interface PDFData {
  organizationData: OrganizationData;
  result: AssessmentResult;
  generatedAt: Date;
  matrixRecommendations?: Recommendation[];
}

/**
 * Generate Board Brief PDF content
 * Executive summary focused on high-level insights
 */
export function generateBoardBriefHTML(data: PDFData): string {
  const { organizationData, result, matrixRecommendations } = data;
  const riskLevel = getRiskLevel(result.totalScore);
  
  // Use Matrix recommendations if available, fallback to result recommendations
  const topRecommendations = matrixRecommendations 
    ? matrixRecommendations.slice(0, 3)
    : result.recommendations.slice(0, 3);
  
  // Get strongest and weakest pillars
  const sortedPillars = result.pillarBreakdown.sort((a, b) => b.score - a.score);
  const strongestPillar = sortedPillars[0];
  const weakestPillar = sortedPillars[sortedPillars.length - 1];
  
  const strongestPillarInfo = PILLARS.find(p => p.id === strongestPillar.pillarId);
  const weakestPillarInfo = PILLARS.find(p => p.id === weakestPillar.pillarId);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insider Risk Assessment - Board Brief</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
        }
        
        .subtitle {
            color: #6b7280;
            margin: 5px 0 0 0;
            font-size: 16px;
        }
        
        .score-section {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .score-number {
            font-size: 48px;
            font-weight: bold;
            color: ${riskLevel.color};
            margin: 0;
        }
        
        .score-label {
            font-size: 20px;
            font-weight: 600;
            margin: 5px 0;
            color: ${riskLevel.color};
        }
        
        .score-description {
            color: #6b7280;
            margin: 10px 0 0 0;
        }
        
        .section {
            margin: 30px 0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin: 0 0 15px 0;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        
        .key-findings {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        
        .finding-box {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
        }
        
        .finding-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .pillar-name {
            color: #3b82f6;
            font-weight: 600;
        }
        
        .score-value {
            font-size: 18px;
            font-weight: bold;
        }
        
        .recommendations {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .recommendation-item {
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
        }
        
        .recommendation-item:before {
            content: "→";
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #f59e0b;
        }
        
        .rec-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }
        
        .rec-priority {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .rec-priority.high {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .rec-priority.medium {
            background: #fef3c7;
            color: #d97706;
        }
        
        .rec-priority.low {
            background: #d1fae5;
            color: #065f46;
        }
        
        .rec-title {
            font-weight: bold;
            color: #1f2937;
        }
        
        .rec-description {
            color: #4b5563;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .rec-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: #6b7280;
        }
        
        .benchmark-comparison {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .benchmark-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .benchmark-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        
        .benchmark-score {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
        }
        
        .comparison {
            font-size: 14px;
            margin-top: 5px;
        }
        
        .positive {
            color: #059669;
        }
        
        .negative {
            color: #dc2626;
        }
        
        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15px;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">${organizationData.organizationName}</h1>
        <p class="subtitle">Insider Risk Assessment - Board Brief</p>
        <p class="subtitle">${organizationData.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • ${organizationData.employeeCount} employees • ${formatDate(data.generatedAt)}</p>
    </div>

    <div class="score-section">
        <h2 class="score-number">${result.totalScore}</h2>
        <div class="score-label">Level ${result.level}: ${riskLevel.name}</div>
        <p class="score-description">${riskLevel.description}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <p>
            ${organizationData.organizationName} achieved an Insider Risk Index score of <strong>${result.totalScore}/100</strong>, 
            placing the organization at <strong>Risk Level ${result.level}</strong>. This assessment evaluates your security 
            posture across five critical pillars of insider threat management.
        </p>
        
        <div class="key-findings">
            <div class="finding-box">
                <div class="finding-title">Strongest Area</div>
                <div class="pillar-name">${strongestPillarInfo?.name}</div>
                <div class="score-value">${Math.round(strongestPillar.score)}%</div>
            </div>
            
            <div class="finding-box">
                <div class="finding-title">Primary Concern</div>
                <div class="pillar-name">${weakestPillarInfo?.name}</div>
                <div class="score-value">${Math.round(weakestPillar.score)}%</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Benchmark Comparison</h2>
        <div class="benchmark-comparison">
            <div class="benchmark-item">
                <div class="benchmark-label">Your Score</div>
                <div class="benchmark-score">${result.totalScore}%</div>
            </div>
            
            <div class="benchmark-item">
                <div class="benchmark-label">Industry Average</div>
                <div class="benchmark-score">${result.benchmark.industry}%</div>
                <div class="comparison ${result.totalScore >= result.benchmark.industry ? 'positive' : 'negative'}">
                    ${result.totalScore >= result.benchmark.industry ? '+' : ''}${(result.totalScore - result.benchmark.industry).toFixed(1)}%
                </div>
            </div>
            
            <div class="benchmark-item">
                <div class="benchmark-label">Company Size Avg</div>
                <div class="benchmark-score">${result.benchmark.companySize}%</div>
                <div class="comparison ${result.totalScore >= result.benchmark.companySize ? 'positive' : 'negative'}">
                    ${result.totalScore >= result.benchmark.companySize ? '+' : ''}${(result.totalScore - result.benchmark.companySize).toFixed(1)}%
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Priority Actions</h2>
        <div class="recommendations">
            ${topRecommendations.map((rec, index) => {
              if (typeof rec === 'string') {
                return `<div class="recommendation-item">${rec}</div>`;
              }
              // Matrix recommendation object
              return `
                <div class="recommendation-item">
                  <div class="rec-header">
                    <span class="rec-priority ${rec.priority}">${rec.priority.toUpperCase()}</span>
                    <span class="rec-title">${rec.title}</span>
                  </div>
                  <p class="rec-description">${rec.description}</p>
                  <div class="rec-meta">
                    <span>Timeline: ${rec.timeToImplement}</span>
                    <span>Impact: ${rec.estimatedImpact}/10</span>
                    ${rec.matrixTechniques.length > 0 ? `<span>Addresses ${rec.matrixTechniques.length} threat techniques</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
        </div>
        ${matrixRecommendations ? '<p><em>Recommendations enhanced with Insider Threat Matrix intelligence from the ForScie community.</em></p>' : ''}
        <p><em>See detailed action plan for complete recommendations and implementation guidance.</em></p>
    </div>

    <div class="footer">
        <p>Generated by Insider Risk Index • insiderisk.io • ${formatDate(data.generatedAt)}</p>
        <p>This assessment provides a baseline for your insider risk management program. Regular reassessment recommended.</p>
    </div>
</body>
</html>`;
}

/**
 * Generate Detailed Plan PDF content
 * Comprehensive report with full analysis and recommendations
 */
export function generateDetailedPlanHTML(data: PDFData): string {
  const { organizationData, result } = data;
  const riskLevel = getRiskLevel(result.totalScore);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insider Risk Assessment - Detailed Action Plan</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
        }
        
        .subtitle {
            color: #6b7280;
            margin: 5px 0 0 0;
            font-size: 16px;
        }
        
        .section {
            margin: 30px 0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin: 0 0 15px 0;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        
        .pillar-section {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin: 20px 0;
            overflow: hidden;
        }
        
        .pillar-header {
            background: #f8fafc;
            padding: 15px 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .pillar-name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .pillar-score {
            font-weight: bold;
            font-size: 18px;
        }
        
        .pillar-content {
            padding: 20px;
        }
        
        .recommendation-list {
            margin: 15px 0;
        }
        
        .recommendation-item {
            margin: 8px 0;
            padding: 8px 0 8px 20px;
            position: relative;
            border-left: 2px solid #e5e7eb;
        }
        
        .recommendation-item:before {
            content: "•";
            position: absolute;
            left: 8px;
            font-weight: bold;
            color: #3b82f6;
        }
        
        .strengths-list, .weaknesses-list {
            margin: 15px 0;
        }
        
        .strength-item {
            margin: 8px 0;
            padding: 8px 0 8px 25px;
            position: relative;
            color: #065f46;
            border-left: 2px solid #10b981;
        }
        
        .strength-item:before {
            content: "✓";
            position: absolute;
            left: 8px;
            font-weight: bold;
            color: #10b981;
        }
        
        .weakness-item {
            margin: 8px 0;
            padding: 8px 0 8px 25px;
            position: relative;
            color: #7c2d12;
            border-left: 2px solid #f59e0b;
        }
        
        .weakness-item:before {
            content: "!";
            position: absolute;
            left: 8px;
            font-weight: bold;
            color: #f59e0b;
        }
        
        .pillar-breakdown {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .pillar-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .pillar-card-name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .pillar-card-score {
            font-size: 24px;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .next-steps {
            background: #f0f9ff;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .step-item {
            margin: 10px 0;
            padding-left: 25px;
            position: relative;
        }
        
        .step-number {
            position: absolute;
            left: 0;
            width: 20px;
            height: 20px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15px;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">${organizationData.organizationName}</h1>
        <p class="subtitle">Insider Risk Assessment - Detailed Action Plan</p>
        <p class="subtitle">${organizationData.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • ${organizationData.employeeCount} employees • ${formatDate(data.generatedAt)}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Assessment Overview</h2>
        <p>
            Your organization achieved an Insider Risk Index score of <strong>${result.totalScore}/100</strong>, 
            placing you at <strong>Risk Level ${result.level}: ${riskLevel.name}</strong>.
        </p>
        <p>${riskLevel.description}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Pillar Breakdown</h2>
        <div class="pillar-breakdown">
            ${result.pillarBreakdown.map(pillar => {
              const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
              return `
                <div class="pillar-card">
                    <div class="pillar-card-name">${pillarInfo?.name}</div>
                    <div class="pillar-card-score" style="color: ${pillarInfo?.color}">${Math.round(pillar.score)}%</div>
                    <div style="font-size: 12px; color: #6b7280;">Weight: ${Math.round(pillar.weight * 100)}%</div>
                </div>
              `;
            }).join('')}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Key Strengths</h2>
        <div class="strengths-list">
            ${result.strengths.map(strength => `<div class="strength-item">${strength}</div>`).join('')}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Areas for Improvement</h2>
        <div class="weaknesses-list">
            ${result.weaknesses.map(weakness => `<div class="weakness-item">${weakness}</div>`).join('')}
        </div>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2 class="section-title">Detailed Recommendations</h2>
        ${result.pillarBreakdown.map(pillar => {
          const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
          const pillarRecommendations = result.recommendations.filter((_, index) => 
            index < result.recommendations.length / result.pillarBreakdown.length
          );
          
          return `
            <div class="pillar-section">
                <div class="pillar-header">
                    <div class="pillar-name">${pillarInfo?.name}</div>
                    <div class="pillar-score" style="color: ${pillarInfo?.color}">${Math.round(pillar.score)}%</div>
                </div>
                <div class="pillar-content">
                    <p>${pillarInfo?.description}</p>
                    <div class="recommendation-list">
                        ${pillarRecommendations.map(rec => `<div class="recommendation-item">${rec}</div>`).join('')}
                    </div>
                </div>
            </div>
          `;
        }).join('')}
    </div>

    <div class="section">
        <h2 class="section-title">Implementation Roadmap</h2>
        <div class="next-steps">
            <div class="step-item">
                <div class="step-number">1</div>
                <strong>Immediate (0-30 days):</strong> Address critical gaps in your lowest-scoring pillar
            </div>
            <div class="step-item">
                <div class="step-number">2</div>
                <strong>Short-term (1-3 months):</strong> Implement foundational controls and policies
            </div>
            <div class="step-item">
                <div class="step-number">3</div>
                <strong>Medium-term (3-6 months):</strong> Deploy monitoring and detection capabilities
            </div>
            <div class="step-item">
                <div class="step-number">4</div>
                <strong>Long-term (6-12 months):</strong> Mature program with advanced analytics and automation
            </div>
            <div class="step-item">
                <div class="step-number">5</div>
                <strong>Ongoing:</strong> Regular assessments, training updates, and program refinement
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Generated by Insider Risk Index • insiderisk.io • ${formatDate(data.generatedAt)}</p>
        <p>This detailed plan provides specific guidance for improving your insider risk management program.</p>
        <p>For implementation support, visit our playbooks section or contact our team for consultation.</p>
    </div>
</body>
</html>`;
}