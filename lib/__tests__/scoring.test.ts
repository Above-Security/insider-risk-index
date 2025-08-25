import { describe, it, expect } from 'vitest';
import { calculateInsiderRiskIndex } from '../scoring';
import { AssessmentAnswer } from '../zod-schemas';

describe('Scoring Engine', () => {
  const mockAnswers: AssessmentAnswer[] = [
    // Visibility pillar questions (4 questions)
    { questionId: 'v1', value: 75, rationale: 'Good endpoint monitoring' },
    { questionId: 'v2', value: 50, rationale: 'Basic user monitoring' },
    { questionId: 'v3', value: 25, rationale: 'Limited data monitoring' },
    { questionId: 'v4', value: 100, rationale: 'Excellent network monitoring' },
    
    // Prevention-coaching pillar questions (4 questions)
    { questionId: 'c1', value: 80, rationale: 'Strong training program' },
    { questionId: 'c2', value: 60, rationale: 'Good policy framework' },
    { questionId: 'c3', value: 40, rationale: 'Basic incident response' },
    { questionId: 'c4', value: 70, rationale: 'Good culture' },
    
    // Evidence pillar questions (4 questions)
    { questionId: 'e1', value: 90, rationale: 'Excellent logging' },
    { questionId: 'e2', value: 50, rationale: 'Basic forensics' },
    { questionId: 'e3', value: 60, rationale: 'Good investigation' },
    { questionId: 'e4', value: 70, rationale: 'Good compliance' },
    
    // Identity pillar questions (4 questions)
    { questionId: 'i1', value: 85, rationale: 'Strong identity management' },
    { questionId: 'i2', value: 75, rationale: 'Good access controls' },
    { questionId: 'i3', value: 65, rationale: 'Good privileged access' },
    { questionId: 'i4', value: 80, rationale: 'Good SaaS security' },
    
    // Phishing pillar questions (4 questions)  
    { questionId: 'p1', value: 70, rationale: 'Good email security' },
    { questionId: 'p2', value: 60, rationale: 'Basic training' },
    { questionId: 'p3', value: 80, rationale: 'Good simulation program' },
    { questionId: 'p4', value: 50, rationale: 'Basic incident response' }
  ];

  describe('Basic Scoring Calculations', () => {
    it('should calculate correct pillar scores with proper weights', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'TECHNOLOGY',
        companySize: 'MID_251_1000'
      });

      // Test that all pillar scores are present
      expect(result.pillarBreakdown).toHaveLength(5);
      
      // Test visibility pillar (25% weight)
      const visibilityPillar = result.pillarBreakdown.find(p => p.pillarId === 'visibility');
      expect(visibilityPillar).toBeDefined();
      expect(visibilityPillar?.weight).toBe(0.25);
      
      // Calculate expected visibility score: (75 + 50 + 25 + 100) / 4 = 62.5
      expect(visibilityPillar?.score).toBe(62.5);
      expect(visibilityPillar?.contributionToTotal).toBe(62.5 * 0.25); // 15.625

      // Test prevention-coaching pillar (25% weight)
      const coachingPillar = result.pillarBreakdown.find(p => p.pillarId === 'prevention-coaching');
      expect(coachingPillar?.weight).toBe(0.25);
      // Expected: (80 + 60 + 40 + 70) / 4 = 62.5
      expect(coachingPillar?.score).toBe(62.5);
    });

    it('should calculate correct total IRI score', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'TECHNOLOGY', 
        companySize: 'MID_251_1000'
      });

      // Calculate expected total
      // Visibility: 62.5 * 0.25 = 15.625
      // Coaching: 62.5 * 0.25 = 15.625  
      // Evidence: 67.5 * 0.20 = 13.5
      // Identity: 76.25 * 0.15 = 11.4375
      // Phishing: 65 * 0.15 = 9.75
      // Total: 65.9375
      
      expect(result.totalScore).toBeCloseTo(65.94, 1);
      expect(result.level).toBe(4); // Should be level 4 (61-80 range)
    });

    it('should assign correct maturity levels', () => {
      // Test different score ranges
      const lowScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 20 })),
        industry: 'HEALTHCARE',
        companySize: 'SMALL_51_250'
      });
      expect(lowScore.level).toBe(1); // 0-24 range
      expect(lowScore.totalScore).toBe(20);

      const mediumScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 50 })),
        industry: 'FINANCIAL_SERVICES',
        companySize: 'LARGE_1001_5000'
      });
      expect(mediumScore.level).toBe(3); // 45-64 range
      expect(mediumScore.totalScore).toBe(50);

      const highScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 90 })),
        industry: 'TECHNOLOGY',
        companySize: 'ENTERPRISE_5000_PLUS'
      });
      expect(highScore.level).toBe(5); // 81-100 range
      expect(highScore.totalScore).toBe(90);
    });
  });

  describe('Pillar Weight Validation', () => {
    it('should use correct pillar weights based on economic impact', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'TECHNOLOGY',
        companySize: 'MID_251_1000'
      });

      const weights = result.pillarBreakdown.reduce((acc, pillar) => {
        acc[pillar.pillarId] = pillar.weight;
        return acc;
      }, {} as Record<string, number>);

      // Based on Ponemon Institute economic impact analysis
      expect(weights['visibility']).toBe(0.25); // 25% - Monitoring & Detection
      expect(weights['prevention-coaching']).toBe(0.25); // 25% - Prevention & Training
      expect(weights['investigation-evidence']).toBe(0.20); // 20% - Investigation & Response
      expect(weights['identity-saas']).toBe(0.15); // 15% - Access Controls
      expect(weights['phishing-resilience']).toBe(0.15); // 15% - Social Engineering Defense

      // Total should equal 1.0
      const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
      expect(totalWeight).toBe(1.0);
    });

    it('should calculate contribution to total correctly', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'TECHNOLOGY',
        companySize: 'MID_251_1000'
      });

      // Sum of all contributions should equal total score
      const totalContribution = result.pillarBreakdown
        .reduce((sum, pillar) => sum + pillar.contributionToTotal, 0);
      
      expect(totalContribution).toBeCloseTo(result.totalScore, 2);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle empty answers gracefully', () => {
      expect(() => {
        calculateInsiderRiskIndex({
          answers: [],
          industry: 'TECHNOLOGY',
          companySize: 'MID_251_1000'
        });
      }).toThrow();
    });

    it('should handle missing pillar questions', () => {
      const incompleteAnswers = mockAnswers.slice(0, 10); // Only partial answers
      
      expect(() => {
        calculateInsiderRiskIndex({
          answers: incompleteAnswers,
          industry: 'TECHNOLOGY',
          companySize: 'MID_251_1000'
        });
      }).toThrow();
    });

    it('should validate score boundaries', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'TECHNOLOGY',
        companySize: 'MID_251_1000'
      });

      // Total score should be between 0-100
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);

      // All pillar scores should be 0-100
      result.pillarBreakdown.forEach(pillar => {
        expect(pillar.score).toBeGreaterThanOrEqual(0);
        expect(pillar.score).toBeLessThanOrEqual(100);
      });

      // Level should be 1-5
      expect(result.level).toBeGreaterThanOrEqual(1);
      expect(result.level).toBeLessThanOrEqual(5);
    });
  });

  describe('Industry and Size Context', () => {
    it('should use industry and size for benchmarking', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'HEALTHCARE',
        companySize: '1001-5000'
      });

      // Industry and size are used for benchmarking but not included in result
      expect(result.benchmark).toBeDefined();
      expect(result.benchmark.industry).toBeGreaterThan(0);
      expect(result.benchmark.companySize).toBeGreaterThan(0);
      expect(result.benchmark.overall).toBeGreaterThan(0);
    });

    it('should handle optional industry and size', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: '',
        companySize: ''
      });

      // Should still provide benchmark data (overall benchmark as fallback)
      expect(result.benchmark).toBeDefined();
      expect(result.benchmark.overall).toBeGreaterThan(0);
      expect(result.totalScore).toBeGreaterThan(0); // Should still calculate score
    });
  });
});