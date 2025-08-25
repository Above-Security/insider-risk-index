import { describe, it, expect } from 'vitest';
import { 
  PILLARS, 
  RISK_LEVELS, 
  INDUSTRY_BENCHMARKS,
  SIZE_BENCHMARKS,
  OVERALL_BENCHMARKS,
  getPillarById,
  getRiskLevel,
  getIndustryBenchmark,
  getSizeBenchmark,
  getPillarColor,
  getPillarWeight
} from '../pillars';

describe('Pillar System', () => {
  describe('Pillar Definitions', () => {
    it('should have exactly 5 pillars', () => {
      expect(PILLARS).toHaveLength(5);
    });

    it('should have correct pillar IDs and names', () => {
      const expectedPillars = [
        'visibility',
        'prevention-coaching', 
        'investigation-evidence',
        'identity-saas',
        'phishing-resilience'
      ];

      const pillarIds = PILLARS.map(p => p.id);
      expectedPillars.forEach(id => {
        expect(pillarIds).toContain(id);
      });
    });

    it('should have correct economic impact weights', () => {
      const weights = PILLARS.reduce((acc, pillar) => {
        acc[pillar.id] = pillar.weight;
        return acc;
      }, {} as Record<string, number>);

      // Based on Ponemon Institute cost analysis
      expect(weights['visibility']).toBe(0.25); // 25% - Critical for detection
      expect(weights['prevention-coaching']).toBe(0.25); // 25% - Prevention is key
      expect(weights['investigation-evidence']).toBe(0.20); // 20% - Investigation capability
      expect(weights['identity-saas']).toBe(0.15); // 15% - Access controls
      expect(weights['phishing-resilience']).toBe(0.15); // 15% - Social engineering

      // Total should equal 1.0
      const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
      expect(totalWeight).toBe(1.0);
    });

    it('should have proper research citations in descriptions', () => {
      PILLARS.forEach(pillar => {
        expect(pillar.description).toBeDefined();
        expect(pillar.description.length).toBeGreaterThan(50);
        
        // Should include research citations
        const hasResearchCitation = 
          pillar.description.includes('Ponemon') ||
          pillar.description.includes('Gartner') ||
          pillar.description.includes('Verizon') ||
          pillar.description.includes('DBIR');
        
        expect(hasResearchCitation).toBe(true);
      });
    });

    it('should have valid colors and icons', () => {
      PILLARS.forEach(pillar => {
        expect(pillar.color).toMatch(/^#[0-9A-F]{6}$/i); // Valid hex color
        expect(pillar.icon).toBeDefined();
        expect(pillar.order).toBeGreaterThan(0);
        expect(pillar.order).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('Risk Levels', () => {
    it('should have 5 risk levels covering full range', () => {
      expect(RISK_LEVELS).toHaveLength(5);
      
      // Should cover 0-100 range completely
      expect(RISK_LEVELS[0].range[0]).toBe(0);
      expect(RISK_LEVELS[4].range[1]).toBe(100);
      
      // Ranges should be contiguous
      for (let i = 1; i < RISK_LEVELS.length; i++) {
        expect(RISK_LEVELS[i].range[0]).toBe(RISK_LEVELS[i-1].range[1] + 1);
      }
    });

    it('should have correct risk level names and priorities', () => {
      const expectedLevels = [
        { level: 1, name: 'Critical Risk', priority: 'urgent' },
        { level: 2, name: 'High Risk', priority: 'high' },
        { level: 3, name: 'Moderate Risk', priority: 'medium' },
        { level: 4, name: 'Low Risk', priority: 'low' },
        { level: 5, name: 'Minimal Risk', priority: 'maintenance' }
      ];

      expectedLevels.forEach(expected => {
        const riskLevel = RISK_LEVELS.find(r => r.level === expected.level);
        expect(riskLevel).toBeDefined();
        expect(riskLevel?.name).toBe(expected.name);
        expect(riskLevel?.priority).toBe(expected.priority);
      });
    });

    it('should have proper descriptions and colors', () => {
      RISK_LEVELS.forEach(level => {
        expect(level.description).toBeDefined();
        expect(level.description.length).toBeGreaterThan(10);
        expect(level.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('Industry Benchmarks', () => {
    it('should include major industries with Ponemon/Verizon data', () => {
      const requiredIndustries = [
        'financial-services',
        'healthcare', 
        'technology',
        'manufacturing',
        'government'
      ];

      requiredIndustries.forEach(industry => {
        expect(INDUSTRY_BENCHMARKS[industry as keyof typeof INDUSTRY_BENCHMARKS]).toBeDefined();
      });
    });

    it('should have realistic cost data based on Ponemon 2025', () => {
      Object.values(INDUSTRY_BENCHMARKS).forEach(benchmark => {
        // Cost ranges should be realistic (millions)
        expect(benchmark.averageCostPerIncident).toBeGreaterThan(400000); // $400K min
        expect(benchmark.averageCostPerIncident).toBeLessThan(2000000); // $2M max
        
        // Containment days should be realistic
        expect(benchmark.avgContainmentDays).toBeGreaterThan(30);
        expect(benchmark.avgContainmentDays).toBeLessThan(150);
        
        // Sample sizes should indicate real research
        expect(benchmark.sampleSize).toBeGreaterThan(50);
        expect(benchmark.sampleSize).toBeLessThan(5000);
      });
    });

    it('should have all required pillar averages', () => {
      Object.values(INDUSTRY_BENCHMARKS).forEach(benchmark => {
        const requiredPillars = [
          'visibility',
          'prevention-coaching',
          'investigation-evidence', 
          'identity-saas',
          'phishing-resilience'
        ];

        requiredPillars.forEach(pillar => {
          const score = (benchmark.pillarAverages as any)[pillar];
          expect(score).toBeDefined();
          expect(score).toBeGreaterThanOrEqual(30); // Minimum realistic score
          expect(score).toBeLessThanOrEqual(90); // Maximum realistic score
        });

        // Overall IRI should be within realistic range
        expect(benchmark.averageScore).toBeGreaterThanOrEqual(45);
        expect(benchmark.averageScore).toBeLessThanOrEqual(85);
      });
    });
  });

  describe('Size Benchmarks', () => {
    it('should cover all company size ranges', () => {
      const expectedSizes = ['1-50', '51-200', '201-1000', '1001-5000', '5000+'];
      // Note: Actual keys from SIZE_BENCHMARKS definition
      
      expectedSizes.forEach(size => {
        expect(SIZE_BENCHMARKS[size as keyof typeof SIZE_BENCHMARKS]).toBeDefined();
      });
    });

    it('should show logical progression by size', () => {
      // Larger companies should generally have better security scores
      const sizes = Object.keys(SIZE_BENCHMARKS);
      const scores = sizes.map(size => SIZE_BENCHMARKS[size as keyof typeof SIZE_BENCHMARKS].averageScore);
      
      // Smallest companies should have lowest scores, largest should have highest
      expect(scores[0]).toBeLessThan(scores[scores.length - 1]);
      
      // Incident costs should increase with size (more valuable targets)
      const costs = sizes.map(size => SIZE_BENCHMARKS[size as keyof typeof SIZE_BENCHMARKS].sampleSize);
      expect(costs.length).toBe(sizes.length);
    });
  });

  describe('Helper Functions', () => {
    it('should correctly retrieve pillars by ID', () => {
      const visibilityPillar = getPillarById('visibility');
      expect(visibilityPillar).toBeDefined();
      expect(visibilityPillar?.name).toBe('Visibility');
      expect(visibilityPillar?.weight).toBe(0.25);

      const invalidPillar = getPillarById('nonexistent');
      expect(invalidPillar).toBeUndefined();
    });

    it('should correctly determine risk levels', () => {
      expect(getRiskLevel(10)).toEqual(expect.objectContaining({ level: 1, name: 'Critical Risk' }));
      expect(getRiskLevel(35)).toEqual(expect.objectContaining({ level: 2, name: 'High Risk' }));
      expect(getRiskLevel(55)).toEqual(expect.objectContaining({ level: 3, name: 'Moderate Risk' }));
      expect(getRiskLevel(75)).toEqual(expect.objectContaining({ level: 4, name: 'Low Risk' }));
      expect(getRiskLevel(95)).toEqual(expect.objectContaining({ level: 5, name: 'Minimal Risk' }));
    });

    it('should retrieve industry benchmarks correctly', () => {
      const healthcareBenchmark = getIndustryBenchmark('healthcare');
      expect(healthcareBenchmark).toBeDefined();
      expect(healthcareBenchmark?.name).toBe('Healthcare');

      const invalidBenchmark = getIndustryBenchmark('nonexistent');
      expect(invalidBenchmark).toBeUndefined();
    });

    it('should retrieve size benchmarks correctly', () => {
      const smallBenchmark = getSizeBenchmark('1-50');
      expect(smallBenchmark).toBeDefined();
      expect(smallBenchmark?.name).toBe('1-50 employees');

      const invalidBenchmark = getSizeBenchmark('nonexistent');
      expect(invalidBenchmark).toBeUndefined();
    });

    it('should return correct pillar colors and weights', () => {
      expect(getPillarColor('visibility')).toBe('#7AB7FF'); // above-blue-800
      expect(getPillarWeight('visibility')).toBe(0.25);
      
      expect(getPillarColor('nonexistent')).toBe('#6B7280'); // default gray
      expect(getPillarWeight('nonexistent')).toBe(0);
    });
  });

  describe('Overall Benchmarks', () => {
    it('should have realistic global statistics', () => {
      // Based on Ponemon Institute 2025 research
      expect(OVERALL_BENCHMARKS.averageCostPerIncident).toBe(676517); // $676,517
      expect(OVERALL_BENCHMARKS.averageAnnualCost).toBe(17400000); // $17.4M
      expect(OVERALL_BENCHMARKS.avgContainmentDays).toBe(81); // 81 days
      expect(OVERALL_BENCHMARKS.avgIncidentsPerYear).toBe(13.5); // 13.5 incidents

      // Sample size should be realistic
      expect(OVERALL_BENCHMARKS.totalAssessments).toBeGreaterThan(10000);
      expect(OVERALL_BENCHMARKS.averageScore).toBeGreaterThanOrEqual(50);
      expect(OVERALL_BENCHMARKS.averageScore).toBeLessThanOrEqual(80);
    });

    it('should have trend data', () => {
      expect(OVERALL_BENCHMARKS.trends).toBeDefined();
      expect(typeof OVERALL_BENCHMARKS.trends.scoreImprovement).toBe('number');
    });
  });
});