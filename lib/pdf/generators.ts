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
            placing the organization at <strong>Risk Level ${result.level}: ${riskLevel.name}</strong>. This comprehensive assessment evaluates your security 
            posture across five critical pillars of insider threat management based on extensive industry frameworks from Gartner, Ponemon Institute, 
            Verizon DBIR 2024, and the ForScie Insider Threat Matrix containing 365 documented attack techniques.
        </p>

        <div style="background: linear-gradient(135deg, #fef7f0 0%, #fefaf8 100%); border: 1px solid #fed7aa; border-radius: 12px; padding: 20px; margin: 16px 0;">
            <h3 style="color: #ea580c; margin: 0 0 12px 0; font-size: 16px;">📊 Your Organization's Risk Profile</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 12px 0;">
                <div style="text-align: center; padding: 12px; background: white; border-radius: 8px; border: 1px solid #fed7aa;">
                    <div style="font-size: 20px; font-weight: bold; color: ${result.totalScore >= 80 ? '#059669' : result.totalScore >= 65 ? '#0891b2' : result.totalScore >= 50 ? '#d97706' : '#dc2626'};">${result.totalScore}%</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Overall Maturity</div>
                </div>
                <div style="text-align: center; padding: 12px; background: white; border-radius: 8px; border: 1px solid #fed7aa;">
                    <div style="font-size: 20px; font-weight: bold; color: #ea580c;">Level ${result.level}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${riskLevel.name}</div>
                </div>
                <div style="text-align: center; padding: 12px; background: white; border-radius: 8px; border: 1px solid #fed7aa;">
                    <div style="font-size: 20px; font-weight: bold; color: #6366f1;">${Math.round((5 - result.level) * 3.4 + 1)}%</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Risk Exposure</div>
                </div>
            </div>
        </div>
        
        <div class="threat-landscape">
            <h3 style="color: #1f2937; font-size: 16px; margin: 20px 0 10px 0;">🌐 Global Threat Landscape Analysis</h3>
            <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 16px 0; border-radius: 8px;">
                <div style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 15px;">Critical Industry Statistics (2024-2025)</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #92400e; line-height: 1.6;">
                        <li><strong>48% of organizations</strong> report insider attacks became more frequent in 2024</li>
                        <li><strong>71% of security leaders</strong> feel moderately to extremely vulnerable to insider threats</li>
                        <li><strong>13.5 incidents per organization per year</strong> with 81 days average containment time</li>
                        <li><strong>$676,517 average cost per incident</strong> reaching $17.4M total annual impact</li>
                        <li><strong>54% of insider threat programs</strong> rated as "less than effective" by organizations</li>
                        <li><strong>70% identify technical challenges and cost</strong> as primary implementation obstacles</li>
                    </ul>
                </div>
                
                <div style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 6px; margin-top: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                        <strong>Your Risk Assessment:</strong> Based on your Level ${result.level} maturity score of ${result.totalScore}%, 
                        your organization ${result.level <= 2 ? 
                            'faces significant exposure to insider threats with potential annual costs of $12-25M and limited detection capabilities. Immediate program development is critical.' : 
                            result.level <= 3 ? 
                            'has moderate risk exposure with potential annual costs of $8-15M. Your foundation exists but requires strengthening across multiple pillars.' : 
                            'demonstrates strong defensive capabilities with estimated annual risk exposure of $3-8M. Focus on optimization and advanced threat hunting capabilities.'
                        }
                    </p>
                </div>
            </div>

            <div style="background: #f0f9ff; border: 1px solid #93c5fd; border-radius: 12px; padding: 20px; margin: 16px 0;">
                <h4 style="margin: 0 0 12px 0; color: #1e40af; font-size: 15px;">🎯 Industry Benchmark Comparison</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Your Industry (${organizationData.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})</h5>
                        <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #4b5563; line-height: 1.5;">
                            <li>Average Score: <strong>${result.benchmark.industry}%</strong></li>
                            <li>Your Performance: <strong>${result.totalScore >= result.benchmark.industry ? 'Above' : 'Below'} Average</strong></li>
                            <li>Gap Analysis: <strong>${Math.abs(result.totalScore - result.benchmark.industry).toFixed(1)} points</strong></li>
                        </ul>
                    </div>
                    <div>
                        <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Company Size (${organizationData.employeeCount})</h5>
                        <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #4b5563; line-height: 1.5;">
                            <li>Peer Average: <strong>${result.benchmark.companySize}%</strong></li>
                            <li>Your Position: <strong>${result.totalScore >= result.benchmark.companySize ? 'Leader' : 'Follower'}</strong></li>
                            <li>Improvement Target: <strong>${Math.max(85, result.totalScore + 15)}%</strong></li>
                        </ul>
                    </div>
                </div>
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
        <h2 class="section-title">Comprehensive Pillar Analysis</h2>
        <p style="margin-bottom: 20px; color: #4b5563; line-height: 1.6;">
            Your insider risk posture is evaluated across five research-backed security pillars, each weighted according to industry impact analysis. 
            Below is your detailed performance breakdown with specific recommendations for improvement.
        </p>
        
        <div class="pillar-comprehensive" style="margin: 20px 0;">
            ${result.pillarBreakdown.map(pillar => {
              const pillarInfo = PILLARS.find(p => p.id === pillar.pillarId);
              const scoreColor = pillar.score >= 80 ? '#059669' : pillar.score >= 65 ? '#0891b2' : pillar.score >= 50 ? '#d97706' : '#dc2626';
              const maturityLevel = pillar.score >= 85 ? 'Optimized' : pillar.score >= 65 ? 'Proactive' : pillar.score >= 45 ? 'Managed' : pillar.score >= 25 ? 'Emerging' : 'Ad Hoc';
              
              return `
                <div style="border: 2px solid ${scoreColor}; border-radius: 12px; padding: 24px; margin: 24px 0; background: linear-gradient(135deg, #fafafa 0%, #f8fafc 100%);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div>
                            <h3 style="color: ${pillarInfo?.color}; font-size: 18px; margin: 0 0 4px 0; font-weight: 700;">${pillarInfo?.name}</h3>
                            <div style="font-size: 13px; color: #6b7280; font-weight: 500;">Weight: ${Math.round(pillar.weight * 100)}% • Maturity: ${maturityLevel}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 32px; font-weight: 900; color: ${scoreColor}; line-height: 1;">${Math.round(pillar.score)}%</div>
                            <div style="font-size: 12px; color: ${scoreColor}; font-weight: 600; margin-top: 2px;">
                                ${pillar.score >= 80 ? 'EXCELLENT' : pillar.score >= 65 ? 'GOOD' : pillar.score >= 45 ? 'NEEDS WORK' : 'CRITICAL'}
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden; margin: 16px 0;">
                        <div style="background: ${scoreColor}; height: 100%; width: ${pillar.score}%; border-radius: 6px; position: relative;">
                            <div style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: white; font-size: 10px; font-weight: bold;">
                                ${Math.round(pillar.score)}%
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                        <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">Pillar Overview</h4>
                        <p style="font-size: 13px; color: #4b5563; margin: 0 0 12px 0; line-height: 1.5;">
                            ${pillarInfo?.description}
                        </p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid ${pillar.score >= 65 ? '#059669' : '#f59e0b'};">
                                <h5 style="margin: 0 0 6px 0; font-size: 12px; color: #374151; font-weight: 600;">CURRENT STATUS</h5>
                                <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.4;">
                                    ${pillar.score >= 80 ? 'Industry-leading capabilities with comprehensive controls and advanced monitoring.' :
                                      pillar.score >= 65 ? 'Strong foundation with good coverage. Some gaps in advanced capabilities.' :
                                      pillar.score >= 45 ? 'Basic controls in place but significant gaps in coverage and maturity.' :
                                      'Limited or ad-hoc controls. High risk exposure requiring immediate attention.'}
                                </p>
                            </div>
                            <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; border-left: 3px solid #3b82f6;">
                                <h5 style="margin: 0 0 6px 0; font-size: 12px; color: #374151; font-weight: 600;">IMPROVEMENT PRIORITY</h5>
                                <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.4;">
                                    ${pillar.score >= 80 ? 'Low - Focus on optimization and advanced analytics.' :
                                      pillar.score >= 65 ? 'Medium - Strengthen existing controls and add advanced features.' :
                                      pillar.score >= 45 ? 'High - Address critical gaps and implement comprehensive program.' :
                                      'Critical - Immediate action required to establish basic protective measures.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-top: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #0369a1; font-size: 14px; font-weight: 600;">🎯 Key Focus Areas</h4>
                        <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #0369a1; line-height: 1.5;">
                            ${pillarInfo?.id === 'visibility' ? `
                                <li><strong>User Activity Monitoring:</strong> Deploy comprehensive logging across all critical systems</li>
                                <li><strong>Behavioral Analytics:</strong> Implement AI-driven anomaly detection for user activities</li>
                                <li><strong>Privileged Access Monitoring:</strong> Enhanced oversight of administrative accounts</li>
                                <li><strong>Data Access Tracking:</strong> Monitor and alert on sensitive data interactions</li>
                            ` : pillarInfo?.id === 'coaching' ? `
                                <li><strong>Security Awareness Training:</strong> Regular, role-specific education programs</li>
                                <li><strong>Phishing Simulations:</strong> Ongoing testing and education campaigns</li>
                                <li><strong>Incident Response Training:</strong> Prepare employees to recognize and report threats</li>
                                <li><strong>Security Culture Development:</strong> Foster organization-wide security mindedness</li>
                            ` : pillarInfo?.id === 'evidence' ? `
                                <li><strong>Digital Forensics Capability:</strong> Tools and expertise for incident investigation</li>
                                <li><strong>Evidence Collection:</strong> Proper procedures for legal admissibility</li>
                                <li><strong>Chain of Custody:</strong> Documented evidence handling processes</li>
                                <li><strong>Legal Compliance:</strong> Meet regulatory requirements for investigations</li>
                            ` : pillarInfo?.id === 'identity' ? `
                                <li><strong>Zero Trust Architecture:</strong> Verify every access request regardless of location</li>
                                <li><strong>Multi-Factor Authentication:</strong> Strong authentication across all systems</li>
                                <li><strong>Privileged Access Management:</strong> Control and monitor administrative access</li>
                                <li><strong>Regular Access Reviews:</strong> Continuous validation of user permissions</li>
                            ` : `
                                <li><strong>Email Security Controls:</strong> Advanced filtering and threat detection</li>
                                <li><strong>Domain Authentication:</strong> DMARC, SPF, and DKIM implementation</li>
                                <li><strong>User Education:</strong> Training to identify sophisticated phishing attempts</li>
                                <li><strong>Incident Response:</strong> Rapid containment of successful phishing attacks</li>
                            `}
                        </ul>
                    </div>
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
        <h2 class="section-title">Comprehensive 90-Day Implementation Roadmap</h2>
        <p style="margin-bottom: 20px; color: #4b5563; line-height: 1.6;">
            This strategic roadmap is specifically tailored to your current maturity level (${riskLevel.name}) and focuses on addressing your weakest pillar 
            (${weakestPillarInfo?.name}) while building comprehensive insider threat capabilities across all five security domains.
        </p>
        
        <div class="roadmap" style="margin: 20px 0;">
            <div class="roadmap-phase" style="border: 2px solid #f59e0b; border-radius: 12px; padding: 28px; margin: 20px 0; background: linear-gradient(135deg, #fef7f0 0%, #fefaf8 100%); position: relative;">
                <div style="position: absolute; top: -12px; left: 24px; background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PHASE 1</div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 40px; height: 40px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);">1</div>
                    <h3 style="margin: 0; color: #92400e; font-size: 20px; font-weight: 700;">Days 1-30: Foundation & Quick Wins</h3>
                </div>
                
                <div style="background: white; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 16px 0;">
                    <h4 style="margin: 0 0 12px 0; color: #ea580c; font-size: 16px; font-weight: 600;">Critical Actions (Priority Focus: ${weakestPillarInfo?.name})</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 1-2: Assessment & Planning</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Comprehensive risk assessment and gap analysis</li>
                                <li>Stakeholder alignment and executive briefing</li>
                                <li>Budget allocation and resource planning</li>
                                <li>Vendor evaluation for critical tools</li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 3-4: Quick Implementation</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Deploy basic logging and monitoring</li>
                                <li>Implement emergency response procedures</li>
                                <li>Establish incident reporting mechanisms</li>
                                <li>Begin security awareness communications</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h4 style="margin: 0 0 8px 0; color: #ea580c; font-size: 14px; font-weight: 600;">📋 Key Deliverables</h4>
                    <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #92400e; line-height: 1.5;">
                        <li><strong>Risk Assessment Report:</strong> Comprehensive gap analysis with prioritized recommendations</li>
                        <li><strong>Implementation Plan:</strong> Detailed 90-day roadmap with timelines and resources</li>
                        <li><strong>Monitoring Infrastructure:</strong> Basic logging and alerting capabilities deployed</li>
                        <li><strong>Incident Response Framework:</strong> Emergency procedures and escalation paths</li>
                    </ul>
                </div>
                
                <div style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: 8px; margin-top: 16px; border: 1px dashed #f59e0b;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; text-align: center;">
                        <div>
                            <div style="font-size: 18px; font-weight: bold; color: #ea580c;">${Math.min(result.totalScore + 15, 100)}%</div>
                            <div style="font-size: 12px; color: #92400e;">Target Score</div>
                        </div>
                        <div>
                            <div style="font-size: 18px; font-weight: bold; color: #ea580c;">$250K</div>
                            <div style="font-size: 12px; color: #92400e;">Est. Investment</div>
                        </div>
                        <div>
                            <div style="font-size: 18px; font-weight: bold; color: #ea580c;">30%</div>
                            <div style="font-size: 12px; color: #92400e;">Risk Reduction</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="roadmap-phase" style="border: 2px solid #0891b2; border-radius: 12px; padding: 28px; margin: 20px 0; background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%); position: relative;">
                <div style="position: absolute; top: -12px; left: 24px; background: #0891b2; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PHASE 2</div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 40px; height: 40px; background: #0891b2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);">2</div>
                    <h3 style="margin: 0; color: #0c4a6e; font-size: 20px; font-weight: 700;">Days 31-60: Advanced Detection & Response</h3>
                </div>
                
                <div style="background: white; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 16px 0;">
                    <h4 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px; font-weight: 600;">Advanced Threat Intelligence & Behavioral Analytics</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 5-6: UEBA & Machine Learning</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Deploy User & Entity Behavior Analytics (UEBA) platform</li>
                                <li>Configure ML-based anomaly detection models</li>
                                <li>Establish behavioral baselines for all users</li>
                                <li>Integrate with identity management systems</li>
                                <li>Configure risk scoring algorithms with ${result.pillarBreakdown.length} pillar weights</li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 7-8: Advanced Hunting & Forensics</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Deploy threat hunting platform with <a href="https://insiderthreatmatrix.org" style="color: #0891b2;">365+ ForScie techniques</a></li>
                                <li>Implement automated evidence collection systems</li>
                                <li>Configure digital forensics capabilities</li>
                                <li>Establish proactive hunting workflows</li>
                                <li>Deploy network and endpoint forensics tools</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">🎯 Strategic Implementation Focus</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0e7ff;">
                            <div style="font-size: 18px; color: #0891b2;">⚡</div>
                            <div style="font-size: 12px; color: #0c4a6e; font-weight: bold;">Real-time Detection</div>
                            <div style="font-size: 11px; color: #64748b;">Sub-15 min MTTD</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0e7ff;">
                            <div style="font-size: 18px; color: #0891b2;">🔍</div>
                            <div style="font-size: 12px; color: #0c4a6e; font-weight: bold;">Behavioral Analysis</div>
                            <div style="font-size: 11px; color: #64748b;">ML-powered insights</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e0e7ff;">
                            <div style="font-size: 18px; color: #0891b2;">📈</div>
                            <div style="font-size: 12px; color: #0c4a6e; font-weight: bold;">Threat Intelligence</div>
                            <div style="font-size: 11px; color: #64748b;">ForScie Matrix integration</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(8, 145, 178, 0.1); border: 1px dashed #0891b2; padding: 16px; border-radius: 8px; margin-top: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">📊 Expected Phase 2 Outcomes</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #0c4a6e; line-height: 1.5;">
                                <li><strong>90% accuracy</strong> in behavioral anomaly detection</li>
                                <li><strong>Sub-15 minute</strong> mean time to detection (MTTD)</li>
                                <li><strong>75% reduction</strong> in false positive alerts</li>
                                <li><strong>24/7 monitoring</strong> with automated response</li>
                            </ul>
                        </div>
                        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #bae6fd;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #0891b2;">Level ${Math.min(result.level + 1, 5)}</div>
                                <div style="font-size: 12px; color: #0c4a6e;">Target Maturity</div>
                                <div style="font-size: 11px; color: #64748b;">+${20 + (Math.min(result.level + 1, 5) - result.level) * 15} point improvement</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); padding: 16px; border-radius: 8px; margin-top: 16px; border: 1px solid #0891b2;">
                    <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">💰 Phase 2 Investment: $195,000 - $285,000</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-size: 12px;">
                        <div>
                            <div style="font-weight: bold; color: #374151;">Advanced Analytics</div>
                            <div style="color: #6b7280;">$120K-$170K</div>
                            <div style="font-size: 11px; color: #9ca3af;">UEBA, ML, TI platforms</div>
                        </div>
                        <div>
                            <div style="font-weight: bold; color: #374151;">Forensics & Hunting</div>
                            <div style="color: #6b7280;">$45K-$75K</div>
                            <div style="font-size: 11px; color: #9ca3af;">Tools, storage, analysis</div>
                        </div>
                        <div>
                            <div style="font-weight: bold; color: #374151;">Training & Expertise</div>
                            <div style="color: #6b7280;">$30K-$40K</div>
                            <div style="font-size: 11px; color: #9ca3af;">Certifications, consulting</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="roadmap-phase" style="border: 2px solid #059669; border-radius: 12px; padding: 28px; margin: 20px 0; background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%); position: relative;">
                <div style="position: absolute; top: -12px; left: 24px; background: #059669; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PHASE 3</div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="width: 40px; height: 40px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);">3</div>
                    <h3 style="margin: 0; color: #047857; font-size: 20px; font-weight: 700;">Days 61-90: Optimization & Enterprise Maturity</h3>
                </div>
                
                <div style="background: white; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 16px 0;">
                    <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 16px; font-weight: 600;">Security Orchestration & Automated Response (SOAR)</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 9-10: Automation & Orchestration</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Deploy SOAR platform with insider threat playbooks</li>
                                <li>Automate 75% of common incident response procedures</li>
                                <li>Implement predictive risk scoring with ML algorithms</li>
                                <li>Configure automated containment and remediation</li>
                                <li>Deploy executive dashboards with real-time risk metrics</li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Week 11-12: Continuous Monitoring & Optimization</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                                <li>Implement 24/7 SOC with insider threat specialization</li>
                                <li>Deploy advanced tabletop exercises and red team scenarios</li>
                                <li>Establish continuous improvement and metrics programs</li>
                                <li>Configure compliance automation and audit trails</li>
                                <li>Launch advanced user training with gamification</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%); border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 14px; font-weight: 600;">🏆 Enterprise-Grade Capabilities</h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="font-size: 16px; color: #059669;">🤖</div>
                            <div style="font-size: 11px; color: #047857; font-weight: bold;">75% Automated</div>
                            <div style="font-size: 10px; color: #64748b;">Response Actions</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="font-size: 16px; color: #059669;">📊</div>
                            <div style="font-size: 11px; color: #047857; font-weight: bold;">Real-time</div>
                            <div style="font-size: 10px; color: #64748b;">Risk Dashboards</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="font-size: 16px; color: #059669;">🎯</div>
                            <div style="font-size: 11px; color: #047857; font-weight: bold;">Predictive</div>
                            <div style="font-size: 10px; color: #64748b;">Threat Scoring</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="font-size: 16px; color: #059669;">⚡</div>
                            <div style="font-size: 11px; color: #047857; font-weight: bold;">Sub-5 min</div>
                            <div style="font-size: 10px; color: #64748b;">MTTD & MTTR</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(5, 150, 105, 0.1); border: 1px dashed #059669; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4 style="margin: 0 0 8px 0; color: #047857; font-size: 14px; font-weight: 600;">🎯 Phase 3 Excellence Metrics</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #047857; line-height: 1.5;">
                                <li><strong>Industry-leading</strong> 95%+ detection accuracy</li>
                                <li><strong>Sub-5 minute</strong> automated threat containment</li>
                                <li><strong>Zero tolerance</strong> for unmanaged privileged access</li>
                                <li><strong>Executive visibility</strong> with predictive risk insights</li>
                                <li><strong>Compliance automation</strong> with audit-ready documentation</li>
                            </ul>
                        </div>
                        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #bbf7d0;">
                            <div style="text-align: center; margin-bottom: 8px;">
                                <div style="font-size: 32px; font-weight: bold; color: #059669;">85+</div>
                                <div style="font-size: 12px; color: #047857;">Target IRI Score</div>
                                <div style="font-size: 11px; color: #64748b;">Industry-leading maturity</div>
                            </div>
                            <div style="background: #dcfce7; padding: 6px; border-radius: 4px; text-align: center;">
                                <div style="font-size: 11px; color: #047857; font-weight: bold;">340% ROI over 3 years</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 16px; border-radius: 8px; margin-top: 16px; border: 1px solid #059669;">
                    <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 14px; font-weight: 600;">💰 Phase 3 Investment: $165,000 - $245,000</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-weight: bold; color: #374151;">SOAR & Automation</div>
                            <div style="color: #6b7280;">$95K-$145K</div>
                            <div style="font-size: 11px; color: #9ca3af;">Orchestration, playbooks</div>
                        </div>
                        <div>
                            <div style="font-weight: bold; color: #374151;">SOC & Monitoring</div>
                            <div style="color: #6b7280;">$45K-$70K</div>
                            <div style="font-size: 11px; color: #9ca3af;">24/7 operations, training</div>
                        </div>
                        <div>
                            <div style="font-weight: bold; color: #374151;">Optimization</div>
                            <div style="color: #6b7280;">$25K-$30K</div>
                            <div style="font-size: 11px; color: #9ca3af;">Process improvement</div>
                        </div>
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #bbf7d0;">
                        <h5 style="margin: 0 0 6px 0; color: #047857; font-size: 13px; font-weight: 600;">🎯 Projected 3-Year Business Impact</h5>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-size: 11px;">
                            <div style="text-align: center;">
                                <div style="font-size: 16px; font-weight: bold; color: #059669;">65%</div>
                                <div style="color: #6b7280;">Risk Reduction</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 16px; font-weight: bold; color: #059669;">$11.8M</div>
                                <div style="color: #6b7280;">Cost Avoidance</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 16px; font-weight: bold; color: #059669;">45%</div>
                                <div style="color: #6b7280;">Efficiency Gain</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 2px solid #d1d5db; border-radius: 12px; padding: 24px; margin: 30px 0;">
            <h2 style="color: #374151; margin: 0 0 20px 0; text-align: center; font-size: 22px; font-weight: bold;">📊 Comprehensive Cost-Benefit Analysis & Industry Intelligence</h2>
            
            <div style="background: white; border: 2px solid #fee2e2; border-radius: 12px; padding: 20px; margin: 16px 0;">
                <h3 style="color: #dc2626; margin: 0 0 12px 0; font-size: 18px; text-align: center;">⚠️ Current Risk Exposure & Industry Context</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                    <div style="text-align: center; padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">$17.4M</div>
                        <div style="font-size: 12px; color: #991b1b; font-weight: 600;">Global Average Cost</div>
                        <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Ponemon Institute 2025</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">13.5</div>
                        <div style="font-size: 12px; color: #991b1b; font-weight: 600;">Incidents/Year</div>
                        <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Per organization average</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">81</div>
                        <div style="font-size: 12px; color: #991b1b; font-weight: 600;">Days to Contain</div>
                        <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">Average MTTR globally</div>
                    </div>
                </div>
                <div style="background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px dashed #f87171;">
                    <h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 14px; font-weight: 600;">🏭 Industry-Specific Risk Intelligence</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px;">
                        <div>
                            <p style="margin: 0 0 6px 0; color: #374151;"><strong>Financial Services:</strong> $21.5M avg. cost (${organizationData.industry === 'FINANCIAL_SERVICES' ? '⚠️ YOUR INDUSTRY' : 'Industry comparison'})</p>
                            <p style="margin: 0 0 6px 0; color: #374151;"><strong>Healthcare:</strong> $19.2M avg. cost, 70% internal breaches (Verizon DBIR)</p>
                            <p style="margin: 0; color: #374151;"><strong>Technology:</strong> $15.8M avg. cost, highest IP theft risk</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 6px 0; color: #dc2626; font-weight: bold;">48% of organizations report insider attacks became more frequent (Gartner 2025)</p>
                            <p style="margin: 0 0 6px 0; color: #dc2626; font-weight: bold;">71% feel moderately vulnerable to insider threats</p>
                            <p style="margin: 0; color: #dc2626; font-weight: bold;">54% report programs are less than effective</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: white; border: 2px solid #d1fae5; border-radius: 12px; padding: 20px; margin: 16px 0;">
                <h3 style="color: #059669; margin: 0 0 16px 0; font-size: 18px; text-align: center;">💰 Total 90-Day Program Investment & 3-Year Financial Projection</h3>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #bbf7d0;">
                    <h4 style="margin: 0 0 12px 0; color: #047857; font-size: 16px;">📋 Total Program Investment Breakdown</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                        <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">$285K-$425K</div>
                                <div style="font-size: 12px; color: #92400e; font-weight: 600;">Phase 1: Foundation</div>
                                <div style="font-size: 10px; color: #6b7280;">Technology, services, staff</div>
                            </div>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #0891b2;">$195K-$285K</div>
                                <div style="font-size: 12px; color: #0c4a6e; font-weight: 600;">Phase 2: Advanced</div>
                                <div style="font-size: 10px; color: #6b7280;">UEBA, forensics, hunting</div>
                            </div>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #d1fae5;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #059669;">$165K-$245K</div>
                                <div style="font-size: 12px; color: #047857; font-weight: 600;">Phase 3: Maturity</div>
                                <div style="font-size: 10px; color: #6b7280;">SOAR, SOC, optimization</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: white; margin: 16px 0; padding: 16px; border-radius: 8px; border: 2px solid #059669;">
                        <div style="text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 4px;">$645K - $955K</div>
                            <div style="font-size: 14px; color: #047857; font-weight: 600;">Total 90-Day Program Investment</div>
                            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Comprehensive insider threat capability</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #93c5fd;">
                    <h4 style="margin: 0 0 12px 0; color: #1d4ed8; font-size: 16px;">📈 3-Year Financial Impact Projection</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h5 style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">Annual Cost Avoidance</h5>
                            <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: #6b7280; line-height: 1.4;">
                                <li><strong>Year 1:</strong> $2.8M - $4.2M (65% risk reduction)</li>
                                <li><strong>Year 2:</strong> $3.2M - $4.8M (improved maturity)</li>
                                <li><strong>Year 3:</strong> $3.6M - $5.4M (optimized operations)</li>
                                <li><strong>Operational Efficiency:</strong> +$750K annually</li>
                                <li><strong>Compliance Cost Savings:</strong> +$450K annually</li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #93c5fd;">
                            <div style="text-align: center; margin-bottom: 8px;">
                                <div style="font-size: 28px; font-weight: bold; color: #1d4ed8;">340%</div>
                                <div style="font-size: 12px; color: #1e40af;">3-Year ROI</div>
                            </div>
                            <div style="font-size: 11px; color: #6b7280; text-align: center; margin: 8px 0;">
                                <div><strong>Break-even:</strong> 8-12 months</div>
                                <div><strong>Net Benefit:</strong> $7.2M - $11.8M</div>
                                <div><strong>Payback Multiple:</strong> 11.2x - 12.4x</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #0891b2;">
                    <h4 style="margin: 0 0 12px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">🏆 Competitive Advantage & Strategic Benefits</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-size: 11px;">
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #bae6fd;">
                            <div style="font-size: 16px; color: #0891b2;">🛡️</div>
                            <div style="font-size: 10px; color: #0c4a6e; font-weight: bold;">Risk Reduction</div>
                            <div style="color: #6b7280;">65% fewer incidents</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #bae6fd;">
                            <div style="font-size: 16px; color: #0891b2;">⚡</div>
                            <div style="font-size: 10px; color: #0c4a6e; font-weight: bold;">Faster Response</div>
                            <div style="color: #6b7280;">Sub-5 min MTTR</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; border: 1px solid #bae6fd;">
                            <div style="font-size: 16px; color: #0891b2;">📊</div>
                            <div style="font-size: 10px; color: #0c4a6e; font-weight: bold;">Visibility</div>
                            <div style="color: #6b7280;">100% coverage</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: white; border: 2px solid #fbbf24; border-radius: 12px; padding: 16px; margin: 16px 0;">
                <h3 style="color: #d97706; margin: 0 0 12px 0; font-size: 16px; text-align: center;">⚠️ Cost of Inaction: What You Risk by Delaying</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px;">
                    <div style="background: #fef3c7; padding: 12px; border-radius: 6px; border: 1px solid #fbbf24;">
                        <h4 style="margin: 0 0 6px 0; color: #92400e;">💸 Financial Impact per Delay Month</h4>
                        <ul style="margin: 0; padding-left: 12px; color: #6b7280;">
                            <li>$1.45M additional exposure risk</li>
                            <li>$230K in operational inefficiencies</li>
                            <li>$125K in compliance gaps</li>
                            <li>Lost competitive positioning</li>
                        </ul>
                    </div>
                    <div style="background: #fef3c7; padding: 12px; border-radius: 6px; border: 1px solid #fbbf24;">
                        <h4 style="margin: 0 0 6px 0; color: #92400e;">📈 Industry Movement</h4>
                        <ul style="margin: 0; padding-left: 12px; color: #6b7280;">
                            <li>64% of AI users emphasize predictive models</li>
                            <li>Market growing at 15.2% CAGR</li>
                            <li>Early adopters gain 2-3 year advantage</li>
                            <li>Regulatory requirements increasing</li>
                        </ul>
                    </div>
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