import { AssessmentResult } from "@/lib/zod-schemas";
import { PILLARS, getRiskLevel } from "@/lib/pillars";
import { formatDate } from "@/lib/utils";
import { type Recommendation } from "@/lib/recommendations";
import fs from 'fs';
import path from 'path';

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

// Helper function to convert images to base64 for PDF embedding with PDF best practices
function getImageBase64(imagePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return '';
    }
    
    const imageBuffer = fs.readFileSync(fullPath);
    
    // Check file size (PDF engines may have limits)
    if (imageBuffer.length > 1024 * 1024) { // 1MB limit
      console.warn(`Image too large for PDF embedding: ${imageBuffer.length} bytes`);
      return '';
    }
    
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).substring(1).toLowerCase();
    
    // Validate image format
    if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      console.warn(`Unsupported image format: ${ext}`);
      return '';
    }
    
    const dataUrl = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${base64}`;
    
    // Successfully loaded image for PDF embedding
    return dataUrl;
  } catch (error) {
    console.warn(`Failed to load image ${imagePath}:`, error);
    return '';
  }
}

/**
 * Generate Board Brief PDF content
 * Executive summary focused on high-level insights
 */
export function generateBoardBriefHTML(data: PDFData): string {
  const { organizationData, result, matrixRecommendations } = data;
  const riskLevel = getRiskLevel(result.totalScore);
  
  // Get base64 encoded logos for PDF embedding
  const insiderRiskLogo = getImageBase64('icon-192x192.png');
  const aboveLogo = getImageBase64('above-logo.png');
  
  
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
            color: #0F172A;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%);
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 40px 30px;
            margin: 0 0 30px 0;
            border-radius: 0 0 16px 16px;
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .logo-image {
            width: 40px;
            height: 40px;
            display: block;
            object-fit: contain;
            flex-shrink: 0;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: white;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }
        
        .subtitle {
            color: rgba(255,255,255,0.9);
            margin: 5px 0 0 0;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
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
            background: linear-gradient(135deg, #FFFAF8 0%, #F8FBFF 100%);
            border: 1px solid #FFE0EC;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 16px rgba(255, 137, 161, 0.1);
        }
        
        .finding-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .pillar-name {
            color: #C8B3FF;
            font-weight: 600;
        }
        
        .score-value {
            font-size: 18px;
            font-weight: bold;
        }
        
        .recommendations {
            background: linear-gradient(135deg, #FAF8FF 0%, #F8FBFF 100%);
            border: 2px solid #C8B3FF;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            position: relative;
        }
        
        .recommendations::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
            border-radius: 12px;
            pointer-events: none;
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
            color: #FF89A1;
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
        <div class="logo-container">
            ${insiderRiskLogo ? `<img src="${insiderRiskLogo}" alt="InsiderRisk Logo" class="logo-image">` : ''}
            <div>
                <div class="logo-text" style="color: white; font-weight: bold; font-size: 18px;">
                    <span>InsiderRisk</span>
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 600; letter-spacing: 0.1em;">INDEX</div>
            </div>
        </div>
        <h1 class="company-name">${organizationData.organizationName}</h1>
        <p class="subtitle">Executive Board Report • Insider Risk Assessment</p>
        <p class="subtitle">${organizationData.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • ${organizationData.employeeCount} employees • ${formatDate(data.generatedAt)}</p>
        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; text-align: center; display: inline-block; margin-top: 15px;">
            <div style="font-size: 10px; color: rgba(255,255,255,0.8); margin-bottom: 4px;">RISK LEVEL</div>
            <div style="font-size: 24px; font-weight: 800; color: white;">${result.level}</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.9); font-weight: 600;">${riskLevel.name.toUpperCase()}</div>
        </div>
    </div>

    <div class="score-section">
        <h2 class="score-number">${result.totalScore}</h2>
        <div class="score-label">Level ${result.level}: ${riskLevel.name}</div>
        <p class="score-description">${riskLevel.description}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <p>
            <strong>${organizationData.organizationName}</strong> achieved an Insider Risk Index score of <strong>${result.totalScore}/100</strong>, 
            placing the organization at <strong>Risk Level ${result.level}: ${riskLevel.name}</strong>. This assessment evaluates your security 
            posture across five critical pillars of insider threat management based on industry frameworks from Gartner, Ponemon Institute, 
            and the ForScie Insider Threat Matrix.
        </p>
        
        <div class="threat-landscape">
            <h3 style="color: #1f2937; font-size: 16px; margin: 20px 0 10px 0;">Current Threat Landscape</h3>
            <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                    <strong>Industry Context:</strong> Organizations face an average of <strong>13.5 insider incidents per year</strong> 
                    with costs reaching <strong>$17.4M annually</strong> (Ponemon Institute 2025). Your current maturity level indicates 
                    ${result.level <= 2 ? 'significant exposure to these risks' : result.level <= 3 ? 'moderate risk exposure with room for improvement' : 'strong defensive posture with optimization opportunities'}.
                </p>
            </div>
        </div>
        
        <div class="key-findings">
            <div class="finding-box">
                <div class="finding-title">Strongest Area</div>
                <div class="pillar-name">${strongestPillarInfo?.name}</div>
                <div class="score-value">${Math.round(strongestPillar.score)}%</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
                    ${strongestPillar.score >= 80 ? 'Exemplary implementation' : strongestPillar.score >= 65 ? 'Strong foundation established' : 'Basic controls in place'}
                </div>
            </div>
            
            <div class="finding-box">
                <div class="finding-title">Primary Concern</div>
                <div class="pillar-name">${weakestPillarInfo?.name}</div>
                <div class="score-value">${Math.round(weakestPillar.score)}%</div>
                <div style="font-size: 12px; color: #dc2626; margin-top: 8px;">
                    ${weakestPillar.score < 45 ? 'Critical gaps identified' : weakestPillar.score < 65 ? 'Immediate attention required' : 'Enhancement opportunities'}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Detailed Score Analysis</h2>
        <div class="pillar-breakdown" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            ${result.pillarBreakdown.map(pillar => {
              const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
              const scoreColor = pillar.score >= 80 ? '#059669' : pillar.score >= 65 ? '#0891b2' : pillar.score >= 50 ? '#d97706' : '#dc2626';
              return `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #fafafa;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="color: ${pillarInfo?.color}; font-size: 16px; margin: 0; font-weight: 600;">${pillarInfo?.name}</h3>
                        <div style="font-size: 24px; font-weight: bold; color: ${scoreColor};">${Math.round(pillar.score)}%</div>
                    </div>
                    <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: ${scoreColor}; height: 100%; width: ${pillar.score}%; transition: width 0.3s ease;"></div>
                    </div>
                    <p style="font-size: 13px; color: #6b7280; margin: 12px 0 0 0; line-height: 1.4;">
                        ${pillarInfo?.description.substring(0, 120)}...
                    </p>
                </div>
              `;
            }).join('')}
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
        <h2 class="section-title">Priority Actions & Strategic Guidance</h2>
        
        <div class="matrix-insight" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0891b2; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                <span style="width: 6px; height: 6px; background: #0891b2; border-radius: 50%;"></span>
                Insider Threat Matrix Intelligence
            </h3>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #0c4a6e; line-height: 1.5;">
                <strong>Critical Threat Analysis:</strong> Our comprehensive matrix analysis of <strong>365 insider threat techniques</strong> 
                across 5 categories (Motive, Means, Preparation, Infringement, Anti-forensics) indicates your organization faces elevated risk from:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c4a6e; line-height: 1.5;">
                <li><strong>${weakestPillarInfo?.id === 'visibility' ? 'MT113.002 - Undetected Data Exfiltration' : 
                            weakestPillarInfo?.id === 'coaching' ? 'MT012.004 - Emotional Vulnerability Exploitation' :
                            weakestPillarInfo?.id === 'evidence' ? 'MT062.008 - Digital Evidence Destruction' :
                            weakestPillarInfo?.id === 'identity' ? 'MT069.015 - Privilege Escalation Techniques' :
                            'MT022.003 - Advanced Phishing Campaigns'}</strong></li>
                <li><strong>${weakestPillarInfo?.id === 'visibility' ? 'MT086.012 - Lateral Movement Techniques' : 
                            weakestPillarInfo?.id === 'coaching' ? 'MT035.007 - Social Engineering Manipulation' :
                            weakestPillarInfo?.id === 'evidence' ? 'MT045.011 - Forensic Evasion Methods' :
                            weakestPillarInfo?.id === 'identity' ? 'MT058.004 - Unauthorized Access Patterns' :
                            'MT067.009 - Credential Harvesting Operations'}</strong></li>
            </ul>
            <div style="margin-top: 12px; font-size: 13px; color: #0c4a6e;">
                🔗 <strong>Deep Dive Resources:</strong> 
                <a href="https://insiderisk.io/matrix" style="color: #0891b2; text-decoration: underline;">Interactive Threat Matrix</a> • 
                <a href="https://insiderisk.io/matrix/heatmap" style="color: #0891b2; text-decoration: underline;">Risk Heatmap</a> • 
                <a href="https://insiderthreatmatrix.org" style="color: #0891b2; text-decoration: underline;">ForScie Community</a>
            </div>
        </div>

        <div class="playbook-comprehensive" style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 24px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #4f46e5; margin: 0 0 16px 0; font-size: 18px;">📚 Comprehensive Implementation Playbooks</h3>
            
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0;">
                <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 16px;">
                    ${weakestPillarInfo?.id === 'visibility' ? 
                      '🔍 Visibility Pillar Implementation Playbook' :
                      weakestPillarInfo?.id === 'coaching' ?
                      '🎯 Building a Comprehensive Prevention & Coaching Program' :
                      weakestPillarInfo?.id === 'evidence' ?
                      '🔬 Building a Comprehensive Investigation & Evidence Framework' :
                      weakestPillarInfo?.id === 'identity' ?
                      '🔐 Building a Comprehensive Identity & SaaS Security Framework' :
                      '🛡️ Building Comprehensive Phishing Resilience Program'
                    }
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0;">
                    <div style="font-size: 13px; color: #6b7280;">
                        <strong>Difficulty:</strong> ${weakestPillarInfo?.id === 'evidence' ? 'Advanced' : 'Intermediate'}
                    </div>
                    <div style="font-size: 13px; color: #6b7280;">
                        <strong>Timeline:</strong> ${weakestPillarInfo?.id === 'visibility' ? '4-8 weeks' :
                                                  weakestPillarInfo?.id === 'coaching' ? '6-10 weeks' :
                                                  weakestPillarInfo?.id === 'evidence' ? '10-16 weeks' :
                                                  weakestPillarInfo?.id === 'identity' ? '10-14 weeks' :
                                                  '8-12 weeks'}
                    </div>
                </div>
                <blockquote style="margin: 12px 0; font-style: italic; color: #4b5563; line-height: 1.6; border-left: 3px solid #6366f1; padding-left: 12px;">
                    ${weakestPillarInfo?.id === 'visibility' ? 
                      '"Establish comprehensive user activity monitoring systems with behavioral analytics. Deploy endpoint detection, network monitoring, and privileged access management tools. Create automated alerting for anomalous user behaviors and establish incident response protocols."' :
                      weakestPillarInfo?.id === 'coaching' ?
                      '"Develop organization-wide security awareness programs with role-specific training modules. Implement phishing simulations, security culture assessments, and continuous education frameworks. Build coaching systems for real-time security guidance."' :
                      weakestPillarInfo?.id === 'evidence' ?
                      '"Build forensic investigation capabilities with digital evidence collection, legal hold procedures, and chain of custody protocols. Deploy forensic tools, establish incident response teams, and create documentation standards for legal compliance."' :
                      weakestPillarInfo?.id === 'identity' ?
                      '"Implement zero-trust identity architecture with multi-factor authentication, privileged access management, and continuous access review processes. Deploy SaaS security controls and identity governance frameworks."' :
                      '"Create multi-layered phishing defense with email security, user training, and incident response procedures. Deploy advanced email filtering, domain authentication, and security awareness programs specifically targeting social engineering."'
                    }
                </blockquote>
            </div>

            <div style="background: #f0f9ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <h4 style="margin: 0 0 12px 0; color: #4f46e5; font-size: 14px;">🎯 All 5 Implementation Playbooks Available:</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 13px;">
                    <div>• <a href="https://insiderisk.io/playbooks/visibility" style="color: #6366f1; text-decoration: underline;">Visibility Pillar Implementation</a> <span style="color: #6b7280;">(4-8 weeks, Intermediate)</span></div>
                    <div>• <a href="https://insiderisk.io/playbooks/prevention-coaching" style="color: #6366f1; text-decoration: underline;">Prevention & Coaching Program</a> <span style="color: #6b7280;">(6-10 weeks, Beginner)</span></div>
                    <div>• <a href="https://insiderisk.io/playbooks/investigation-evidence" style="color: #6366f1; text-decoration: underline;">Investigation & Evidence Framework</a> <span style="color: #6b7280;">(10-16 weeks, Advanced)</span></div>
                    <div>• <a href="https://insiderisk.io/playbooks/identity-saas" style="color: #6366f1; text-decoration: underline;">Identity & SaaS Security</a> <span style="color: #6b7280;">(10-14 weeks, Intermediate)</span></div>
                    <div>• <a href="https://insiderisk.io/playbooks/phishing-resilience" style="color: #6366f1; text-decoration: underline;">Phishing Resilience Program</a> <span style="color: #6b7280;">(8-12 weeks, Intermediate)</span></div>
                </div>
            </div>
            
            <div style="margin-top: 16px; font-size: 12px; color: #6b7280; text-align: center;">
                📖 <strong>Access Complete Library:</strong> <a href="https://insiderisk.io/playbooks" style="color: #6366f1; text-decoration: underline;">InsiderRisk.io Implementation Playbooks</a> • 
                Sponsored by <a href="https://abovesec.com" style="color: #6366f1; text-decoration: underline;">Above Security</a>
            </div>
        </div>
        
        <div class="recommendations">
            <h3 style="color: #1f2937; font-size: 18px; margin: 24px 0 16px 0;">Immediate Action Items</h3>
            ${topRecommendations.map((rec) => {
              if (typeof rec === 'string') {
                return `<div class="recommendation-item">
                  <div class="rec-header">
                    <span class="rec-priority high">PRIORITY</span>
                    <span class="rec-title">${rec}</span>
                  </div>
                  <div style="margin-top: 8px; font-size: 13px; color: #6b7280;">
                    Estimated impact: High | Timeline: 30-60 days | <a href="https://abovesec.com/playbooks" style="color: #3b82f6;">View implementation guide</a>
                  </div>
                </div>`;
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
                    ${rec.matrixTechniques.length > 0 ? `<span>Addresses <strong>${rec.matrixTechniques.length}</strong> threat techniques</span>` : ''}
                    <span>•</span>
                    <a href="https://abovesec.com/playbooks" style="color: #3b82f6; text-decoration: underline;">Implementation guide</a>
                  </div>
                </div>
              `;
            }).join('')}
        </div>
        
        <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #374151; text-align: center;">🚀 Take Action Today</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0;">
                <div style="text-align: center;">
                    <h5 style="margin: 0 0 8px 0; color: #4f46e5; font-size: 14px;">📊 Free Assessment</h5>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">Retake for progress tracking</p>
                    <a href="https://insiderisk.io/assessment" style="color: #3b82f6; text-decoration: underline; font-size: 13px;">Start New Assessment</a>
                </div>
                <div style="text-align: center;">
                    <h5 style="margin: 0 0 8px 0; color: #4f46e5; font-size: 14px;">🎯 Expert Support</h5>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">Implementation guidance</p>
                    <a href="https://abovesec.com/contact" style="color: #3b82f6; text-decoration: underline; font-size: 13px;">Schedule Consultation</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #d1d5db;">
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    <strong>Additional Resources:</strong> 
                    <a href="https://insiderisk.io/matrix" style="color: #3b82f6; text-decoration: underline;">Threat Matrix</a> • 
                    <a href="https://insiderisk.io/benchmarks" style="color: #3b82f6; text-decoration: underline;">Industry Benchmarks</a> • 
                    <a href="https://insiderisk.io/research" style="color: #3b82f6; text-decoration: underline;">Research Reports</a> • 
                    <a href="https://insiderisk.io/glossary" style="color: #3b82f6; text-decoration: underline;">Security Glossary</a>
                </p>
            </div>
        </div>
        
        ${matrixRecommendations ? '<p style="font-size: 12px; color: #6b7280; margin-top: 16px;"><em>Recommendations enhanced with Insider Threat Matrix intelligence from the ForScie community.</em></p>' : ''}
    </div>

    <div class="page-break"></div>
    
    <div class="section">
        <h2 class="section-title">90-Day Implementation Roadmap</h2>
        
        <div class="roadmap" style="margin: 20px 0;">
            <div class="roadmap-phase" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 16px 0; background: linear-gradient(135deg, #fef7f0 0%, #fefaf8 100%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 32px; height: 32px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">1</div>
                    <h3 style="margin: 0; color: #92400e; font-size: 18px;">Days 1-30: Foundation & Quick Wins</h3>
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; line-height: 1.6;">
                    <li><strong>Week 1-2:</strong> Conduct comprehensive risk assessment and gap analysis for ${weakestPillarInfo?.name}</li>
                    <li><strong>Week 2-3:</strong> Implement basic logging and monitoring for critical systems</li>
                    <li><strong>Week 3-4:</strong> Deploy emergency response procedures and incident playbooks</li>
                    <li><strong>Deliverable:</strong> Risk assessment report and initial monitoring capability</li>
                </ul>
                <div style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 6px; margin-top: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #92400e;">
                        <strong>Success Metric:</strong> Achieve ${Math.min(result.totalScore + 15, 100)}% overall score improvement
                    </p>
                </div>
            </div>

            <div class="roadmap-phase" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 16px 0; background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 32px; height: 32px; background: #0891b2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">2</div>
                    <h3 style="margin: 0; color: #0c4a6e; font-size: 18px;">Days 31-60: Core Implementation</h3>
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; line-height: 1.6;">
                    <li><strong>Week 5-6:</strong> Deploy behavioral analytics and anomaly detection systems</li>
                    <li><strong>Week 6-7:</strong> Implement comprehensive user access reviews and controls</li>
                    <li><strong>Week 7-8:</strong> Launch organization-wide security awareness program</li>
                    <li><strong>Deliverable:</strong> Fully operational insider threat detection platform</li>
                </ul>
                <div style="background: rgba(8, 145, 178, 0.1); padding: 12px; border-radius: 6px; margin-top: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #0c4a6e;">
                        <strong>Success Metric:</strong> Reach Level ${Math.min(result.level + 1, 5)} maturity (${riskLevel.name} → ${result.level >= 5 ? 'Optimized+' : result.level === 4 ? 'Optimized' : result.level === 3 ? 'Proactive' : result.level === 2 ? 'Managed' : 'Emerging'})
                    </p>
                </div>
            </div>

            <div class="roadmap-phase" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 16px 0; background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 32px; height: 32px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">3</div>
                    <h3 style="margin: 0; color: #047857; font-size: 18px;">Days 61-90: Optimization & Maturity</h3>
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; line-height: 1.6;">
                    <li><strong>Week 9-10:</strong> Fine-tune detection algorithms and reduce false positives</li>
                    <li><strong>Week 10-11:</strong> Implement advanced threat hunting and forensic capabilities</li>
                    <li><strong>Week 11-12:</strong> Conduct tabletop exercises and program assessment</li>
                    <li><strong>Deliverable:</strong> Mature, optimized insider threat program</li>
                </ul>
                <div style="background: rgba(5, 150, 105, 0.1); padding: 12px; border-radius: 6px; margin-top: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #047857;">
                        <strong>Success Metric:</strong> Achieve industry-leading capabilities with 85%+ overall score
                    </p>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 2px solid #d1d5db; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #374151; margin: 0 0 16px 0; text-align: center; font-size: 18px;">🎯 Expected ROI & Business Impact</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 32px; font-weight: bold; color: #059669;">$${Math.round((17.4 * 0.6) * 10) / 10}M</div>
                    <div style="font-size: 14px; color: #6b7280;">Potential Annual Savings</div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Based on 60% risk reduction</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 32px; font-weight: bold; color: #0891b2;">18x</div>
                    <div style="font-size: 14px; color: #6b7280;">Average ROI Multiple</div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Industry benchmark</div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
            ${aboveLogo ? `<img src="${aboveLogo}" alt="Above Logo" style="width: 24px; height: 24px;">` : '<div style="width: 24px; height: 24px; background: #FF89A1; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 12px;">A</div>'}
            <span style="font-weight: 700; color: #FF89A1;">Above</span>
            <span style="color: #6b7280;">Enterprise Insider Risk Intelligence</span>
        </div>
        <div style="text-align: center; margin: 16px 0;">
            <a href="https://insiderisk.io/assessment" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; margin: 0 8px;">Retake Assessment</a>
            <a href="https://abovesec.com/contact" style="background: white; color: #3b82f6; border: 2px solid #3b82f6; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; margin: 0 8px;">Get Expert Support</a>
        </div>
        <p>Generated by <a href="https://insiderisk.io" style="color: #3b82f6; text-decoration: underline;"><strong>InsiderRisk Index</strong></a> • Sponsored by <a href="https://abovesec.com" style="color: #3b82f6; text-decoration: underline;"><strong>Above Security</strong></a> • ${formatDate(data.generatedAt)}</p>
        <p>This executive assessment provides strategic insights for board-level risk management decisions based on comprehensive threat intelligence and industry research.</p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
            <strong>Research Foundation:</strong> Based on Ponemon Institute 2025 ($17.4M avg. cost), 
            <a href="https://www.gartner.com" style="color: #3b82f6; text-decoration: underline;">Gartner G00805757</a>, 
            Verizon DBIR 2024, and <a href="https://insiderthreatmatrix.org" style="color: #3b82f6; text-decoration: underline;">ForScie Insider Threat Matrix</a>
        </p>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
            © 2025 Above Security, Inc. • 
            Resources: <a href="https://insiderisk.io" style="color: #3b82f6; text-decoration: underline;"><strong>InsiderRisk.io</strong></a> • 
            Sponsor: <a href="https://abovesec.com" style="color: #3b82f6; text-decoration: underline;">AboveSec.com</a> • 
            <a href="https://insiderisk.io/privacy" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a>
        </p>
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
  
  // Get base64 encoded logos for PDF embedding
  const insiderRiskLogo = getImageBase64('icon-192x192.png');
  const aboveLogo = getImageBase64('above-logo.png');
  

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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 40px 30px;
            margin: 0 0 30px 0;
            border-radius: 0 0 16px 16px;
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .logo-image {
            width: 40px;
            height: 40px;
            display: block;
            object-fit: contain;
            flex-shrink: 0;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: white;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
        }
        
        .subtitle {
            color: rgba(255,255,255,0.9);
            margin: 5px 0 0 0;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
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
        <div class="logo-container">
            ${insiderRiskLogo ? `<img src="${insiderRiskLogo}" alt="InsiderRisk Logo" class="logo-image">` : ''}
            <div>
                <div class="logo-text" style="color: white; font-weight: bold; font-size: 18px;">
                    <span>InsiderRisk</span>
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 600; letter-spacing: 0.1em;">INDEX</div>
            </div>
        </div>
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
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
            ${aboveLogo ? `<img src="${aboveLogo}" alt="Above Logo" style="width: 24px; height: 24px;">` : '<div style="width: 24px; height: 24px; background: #FF89A1; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 12px;">A</div>'}
            <span style="font-weight: 700; color: #FF89A1;">Above</span>
            <span style="color: #6b7280;">Enterprise Insider Risk Intelligence</span>
        </div>
        <p>Generated by InsiderRisk Index • Powered by Above • ${formatDate(data.generatedAt)}</p>
        <p>This detailed plan provides specific guidance for improving your insider risk management program.</p>
        <p>For implementation support, visit our playbooks section or contact our team for consultation.</p>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">© 2025 Above, Inc. • Visit <strong>abovesec.com</strong> for implementation support</p>
    </div>
</body>
</html>`;
}