import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface AssessmentCompleteEmailProps {
  organizationName?: string;
  iriScore: number;
  maturityLevel: string;
  maturityLevelNumber: number;
  pillarScores: Array<{
    name: string;
    score: number;
  }>;
  topStrengths: string[];
  keyRisks: string[];
  resultsUrl: string;
  pdfUrl: string;
}

export function AssessmentCompleteEmail({
  organizationName = 'Your organization',
  iriScore,
  maturityLevel,
  maturityLevelNumber,
  pillarScores,
  topStrengths,
  keyRisks,
  resultsUrl,
  pdfUrl,
}: AssessmentCompleteEmailProps) {

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; // green
    if (score >= 65) return '#3b82f6'; // blue  
    if (score >= 45) return '#f59e0b'; // orange
    if (score >= 25) return '#ef4444'; // red
    return '#dc2626'; // dark red
  };

  const scoreColor = getScoreColor(iriScore);
  const riskExposure = ((100 - iriScore) * 0.08 * 676517 / 1000000).toFixed(1);

  return (
    <Html>
      <Head />
      <Preview>{`${organizationName}: Executive Insider Risk Assessment Report - ${iriScore}/100 (${maturityLevel})`}</Preview>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        margin: '0',
        padding: '20px 0',
      }}>
        <Container style={{
          backgroundColor: '#ffffff',
          margin: '0 auto',
          maxWidth: '600px',
          width: '100%',
        }}>
          
          {/* Main Email Table */}
          <table width="100%" cellPadding="0" cellSpacing="0" style={{
            backgroundColor: '#ffffff',
            borderCollapse: 'collapse',
          }}>
            
            {/* Header */}
            <tr>
              <td style={{
                background: 'linear-gradient(135deg, #FF89A1 0%, #C8B3FF 50%, #7AB7FF 100%)',
                padding: '30px 20px',
                textAlign: 'center',
              }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>
                      <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '4px' }}>
                        <tr>
                          <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_SITE_URL?.trim()}/logo.png`}
                              alt="InsiderRisk Index" 
                              style={{
                                height: '32px',
                                width: 'auto',
                                display: 'block',
                                maxWidth: '40px',
                              }}
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '800',
                              color: '#ffffff',
                            }}>
                              InsiderRisk INDEX
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#ffffff',
                        margin: '0',
                      }}>
                        {organizationName}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: '4px 0 0 0',
                      }}>
                        Executive Board Report • Insider Risk Assessment
                      </div>
                    </td>
                    <td style={{ 
                      textAlign: 'right', 
                      verticalAlign: 'middle',
                      width: '120px',
                    }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.8)',
                          marginBottom: '4px',
                        }}>
                          RISK LEVEL
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '800',
                          color: '#ffffff',
                        }}>
                          {maturityLevelNumber}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: '600',
                        }}>
                          {maturityLevel.toUpperCase()}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Executive Summary Bar */}
            <tr>
              <td style={{
                background: 'linear-gradient(90deg, #FAF8FF 0%, #FFF5F8 100%)',
                borderLeft: '4px solid #FF89A1',
                padding: '16px 20px',
                textAlign: 'center',
              }}>
                <Text style={{
                  color: '#1E293B',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0',
                }}>
                  📋 <strong>EXECUTIVE BOARD REPORT</strong> • Ready for C-Suite Presentation
                </Text>
              </td>
            </tr>

            {/* Score Section */}
            <tr>
              <td style={{ padding: '32px 20px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{
                  background: 'linear-gradient(135deg, #FFFAF8 0%, #FAF8FF 100%)',
                  border: '2px solid #FFE0EC',
                  borderRadius: '16px',
                  padding: '32px',
                }}>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Insider Risk Index™ Score
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginBottom: '20px',
                      }}>
                        Research-Validated Assessment
                      </div>
                      
                      <table width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-block' }}>
                              <span style={{
                                fontSize: '48px',
                                fontWeight: '800',
                                color: scoreColor,
                                lineHeight: '1',
                              }}>
                                {iriScore}
                              </span>
                              <span style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#9ca3af',
                                marginLeft: '8px',
                              }}>
                                /100
                              </span>
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#374151',
                              marginTop: '8px',
                            }}>
                              {maturityLevel} Maturity
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: '#6b7280',
                              marginTop: '4px',
                            }}>
                              {iriScore >= 66.4 ? '↗️ Above' : iriScore >= 60 ? '→ Near' : '↘️ Below'} Industry Average (66.4)
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Business Impact */}
            <tr>
              <td style={{ padding: '0 20px 32px 20px' }}>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#0F172A',
                  margin: '0 0 20px 0',
                  borderLeft: '4px solid #FF89A1',
                  paddingLeft: '20px',
                }}>
                  Business Impact Analysis
                </h2>
                
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="33%" style={{ padding: '0 8px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #F8FBFF 0%, #FAF8FF 100%)',
                        border: '1px solid #FFE0EC',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800',
                          color: '#059669',
                          margin: '0 0 4px 0',
                        }}>
                          ${riskExposure}M
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          margin: '0',
                        }}>
                          Annual Risk Exposure
                        </div>
                      </div>
                    </td>
                    <td width="33%" style={{ padding: '0 8px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #F8FBFF 0%, #FAF8FF 100%)',
                        border: '1px solid #FFE0EC',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800',
                          color: '#059669',
                          margin: '0 0 4px 0',
                        }}>
                          {Math.max(1, Math.round((100 - iriScore) / 15))}x
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          margin: '0',
                        }}>
                          Risk Reduction Potential
                        </div>
                      </div>
                    </td>
                    <td width="33%" style={{ padding: '0 8px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #F8FBFF 0%, #FAF8FF 100%)',
                        border: '1px solid #FFE0EC',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: '800',
                          color: '#059669',
                          margin: '0 0 4px 0',
                        }}>
                          {Math.max(15, 81 - Math.round(iriScore * 0.4))}d
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          margin: '0',
                        }}>
                          Containment Time
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* CTA Section */}
            <tr>
              <td style={{ padding: '0 20px 32px 20px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{
                  background: 'linear-gradient(135deg, #FAF8FF 0%, #F8FBFF 100%)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #E6F3FF',
                }}>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#0F172A',
                        margin: '0 0 20px 0',
                      }}>
                        Executive Actions
                      </h2>
                      
                      <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                        <tr>
                          <td style={{ padding: '0 6px' }}>
                            <Link href={resultsUrl} style={{
                              backgroundColor: '#FF89A1',
                              borderRadius: '6px',
                              color: '#ffffff',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '1',
                              padding: '12px 20px',
                              textDecoration: 'none',
                              display: 'inline-block',
                            }}>
                              View Complete Board Report
                            </Link>
                          </td>
                          <td style={{ padding: '0 6px' }}>
                            <Link href={pdfUrl} style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '6px',
                              color: '#C8B3FF',
                              fontSize: '14px',
                              fontWeight: '600',
                              lineHeight: '1',
                              padding: '12px 20px',
                              textDecoration: 'none',
                              border: '2px solid #C8B3FF',
                              display: 'inline-block',
                            }}>
                              Download Executive PDF
                            </Link>
                          </td>
                        </tr>
                      </table>
                      
                      <div style={{
                        color: '#1E293B',
                        fontSize: '12px',
                        margin: '16px 0 0 0',
                      }}>
                        Recommended: Share with your CISO, Risk Committee, and Board of Directors
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                padding: '32px 20px 24px',
                textAlign: 'center',
              }}>
                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 8px auto' }}>
                  <tr>
                    <td style={{ verticalAlign: 'middle', paddingRight: '8px' }}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SITE_URL?.trim()}/above-logo.png`}
                        alt="Above" 
                        style={{
                          height: '24px',
                          width: 'auto',
                          display: 'block',
                          filter: 'brightness(0) invert(1)',
                          maxWidth: '32px',
                        }}
                      />
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: '#FF89A1',
                      }}>
                        Above
                      </div>
                    </td>
                  </tr>
                </table>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}>
                  Enterprise Insider Risk Intelligence
                </div>
                
                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 20px auto' }}>
                  <tr>
                    <td style={{ padding: '0 8px' }}>
                      <Link href="https://linkedin.com/company/above-security" style={{
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}>
                        LinkedIn
                      </Link>
                    </td>
                    <td style={{ padding: '0 8px' }}>
                      <Link href="https://abovesec.com" style={{
                        backgroundColor: '#334155',
                        color: '#f1f5f9',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}>
                        Website
                      </Link>
                    </td>
                  </tr>
                </table>
                
                <div style={{
                  borderTop: '1px solid #475569',
                  paddingTop: '16px',
                }}>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '11px',
                    margin: '0 0 8px 0',
                  }}>
                    © 2025 Above, Inc. • InsiderRisk Index™ is a trademark of Above
                  </div>
                  <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                    <tr>
                      <td style={{ padding: '0 6px' }}>
                        <Link href="https://abovesec.com/privacy" style={{
                          color: '#cbd5e1',
                          fontSize: '11px',
                          textDecoration: 'none',
                        }}>
                          Privacy
                        </Link>
                      </td>
                      <td style={{ padding: '0 6px' }}>
                        <Link href="https://abovesec.com/terms" style={{
                          color: '#cbd5e1',
                          fontSize: '11px',
                          textDecoration: 'none',
                        }}>
                          Terms
                        </Link>
                      </td>
                      <td style={{ padding: '0 6px' }}>
                        <Link href="mailto:hello@abovesec.com" style={{
                          color: '#cbd5e1',
                          fontSize: '11px',
                          textDecoration: 'none',
                        }}>
                          hello@abovesec.com
                        </Link>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

          </table>
        </Container>
      </Body>
    </Html>
  );
}

export default AssessmentCompleteEmail;