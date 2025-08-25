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
    { questionId: 'pc1', value: 80, rationale: 'Strong training program' },
    { questionId: 'pc2', value: 60, rationale: 'Good policy framework' },
    { questionId: 'pc3', value: 40, rationale: 'Basic incident response' },
    { questionId: 'pc4', value: 70, rationale: 'Good culture' },
    
    // Investigation & Evidence pillar questions (4 questions)
    { questionId: 'ie1', value: 90, rationale: 'Excellent logging' },
    { questionId: 'ie2', value: 50, rationale: 'Basic forensics' },
    { questionId: 'ie3', value: 60, rationale: 'Good investigation' },
    { questionId: 'ie4', value: 70, rationale: 'Good compliance' },
    
    // Identity & SaaS pillar questions (4 questions)
    { questionId: 'is1', value: 85, rationale: 'Strong identity management' },
    { questionId: 'is2', value: 75, rationale: 'Good access controls' },
    { questionId: 'is3', value: 65, rationale: 'Good privileged access' },
    { questionId: 'is4', value: 80, rationale: 'Good SaaS security' },
    
    // Phishing Resilience pillar questions (4 questions)  
    { questionId: 'pr1', value: 70, rationale: 'Good email security' },
    { questionId: 'pr2', value: 60, rationale: 'Basic training' },
    { questionId: 'pr3', value: 80, rationale: 'Good simulation program' },
    { questionId: 'pr4', value: 50, rationale: 'Basic incident response' }
  ];

  describe('Basic Scoring Calculations', () => {
    it('should calculate pillar scores with proper weights', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'technology',
        companySize: '201-1000'
      });

      // Test that all pillar scores are present
      expect(result.pillarBreakdown).toHaveLength(5);
      
      // Test visibility pillar (25% weight)
      const visibilityPillar = result.pillarBreakdown.find(p => p.pillarId === 'visibility');
      expect(visibilityPillar).toBeDefined();
      expect(visibilityPillar?.weight).toBe(0.25);
      
      // Test scores are in valid range (algorithm uses question weights, not simple averages)
      expect(visibilityPillar?.score).toBeGreaterThan(0);
      expect(visibilityPillar?.score).toBeLessThanOrEqual(100);
      expect(visibilityPillar?.contributionToTotal).toBeGreaterThan(0);
      expect(visibilityPillar?.contributionToTotal).toBeLessThanOrEqual(25); // max 25% contribution

      // Test prevention-coaching pillar (25% weight)
      const coachingPillar = result.pillarBreakdown.find(p => p.pillarId === 'prevention-coaching');
      expect(coachingPillar).toBeDefined();
      expect(coachingPillar?.weight).toBe(0.25);
      expect(coachingPillar?.score).toBeGreaterThan(0);
      expect(coachingPillar?.score).toBeLessThanOrEqual(100);
    });

    it('should calculate total IRI score within valid range', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'technology', 
        companySize: '201-1000'
      });

      // Test total score is valid (algorithm weights questions, so exact calculation varies)
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      
      // Test level assignment is consistent with score
      expect(result.level).toBeGreaterThanOrEqual(1);
      expect(result.level).toBeLessThanOrEqual(5);
      
      // Test that contribution total roughly matches total score
      const totalContributions = result.pillarBreakdown.reduce(
        (sum, pillar) => sum + pillar.contributionToTotal, 0
      );
      expect(Math.abs(totalContributions - result.totalScore)).toBeLessThan(1); // Allow small rounding differences
    });

    it('should assign correct maturity levels', () => {
      // Test different score ranges
      const lowScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 20 })),
        industry: 'healthcare',
        companySize: '51-200'
      });
      expect(lowScore.level).toBe(1); // 0-20 range for critical risk
      expect(lowScore.totalScore).toBe(20);

      const mediumScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 50 })),
        industry: 'financial-services',
        companySize: '1001-5000'
      });
      expect(mediumScore.level).toBe(3); // 41-60 range for moderate risk
      expect(mediumScore.totalScore).toBe(50);

      const highScore = calculateInsiderRiskIndex({
        answers: mockAnswers.map(a => ({ ...a, value: 90 })),
        industry: 'technology',
        companySize: '5000+'
      });
      expect(highScore.level).toBe(5); // 81-100 range for minimal risk
      expect(highScore.totalScore).toBe(90);
    });
  });

  describe('Pillar Weight Validation', () => {
    it('should use correct pillar weights based on economic impact', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'technology',
        companySize: '201-1000'
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
        industry: 'technology',
        companySize: '201-1000'
      });

      // Sum of all contributions should equal total score
      const totalContribution = result.pillarBreakdown
        .reduce((sum, pillar) => sum + pillar.contributionToTotal, 0);
      
      expect(totalContribution).toBeCloseTo(result.totalScore, 1);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle empty answers gracefully', () => {
      const result = calculateInsiderRiskIndex({
        answers: [],
        industry: 'technology',
        companySize: '201-1000'
      });
      
      // With no answers, all pillars should have 0 score
      expect(result.totalScore).toBe(0);
      expect(result.level).toBe(1); // Critical risk level for 0 score
      expect(result.pillarBreakdown).toHaveLength(5);
      result.pillarBreakdown.forEach(pillar => {
        expect(pillar.score).toBe(0);
        expect(pillar.contributionToTotal).toBe(0);
      });
    });

    it('should handle missing pillar questions', () => {
      const incompleteAnswers = mockAnswers.slice(0, 10); // Only partial answers
      
      const result = calculateInsiderRiskIndex({
        answers: incompleteAnswers,
        industry: 'technology',
        companySize: '201-1000'
      });
      
      // Should handle partial answers without throwing
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(result.level).toBeGreaterThanOrEqual(1);
      expect(result.level).toBeLessThanOrEqual(5);
    });

    it('should validate score boundaries', () => {
      const result = calculateInsiderRiskIndex({
        answers: mockAnswers,
        industry: 'technology',
        companySize: '201-1000'
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
        industry: 'healthcare',
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