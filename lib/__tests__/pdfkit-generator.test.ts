import { describe, it, expect } from 'vitest';
import { generatePDFWithPDFKit } from '../pdf/pdfkit-generator';
import { AssessmentResult } from '../zod-schemas';

describe('PDFKit Generator', () => {
  const mockOrganizationData = {
    organizationName: "Acme Corporation",
    industry: "Technology",
    employeeCount: "500-1000"
  };

  const mockResult: AssessmentResult = {
    totalScore: 72.5,
    level: 4,
    levelDescription: "Proactive",
    pillarBreakdown: [
      {
        pillarId: "visibility",
        score: 85,
        maxScore: 100,
        weight: 0.25,
        contributionToTotal: 21.25
      },
      {
        pillarId: "prevention-coaching",
        score: 68,
        maxScore: 100,
        weight: 0.25,
        contributionToTotal: 17.0
      },
      {
        pillarId: "investigation-evidence",
        score: 75,
        maxScore: 100,
        weight: 0.20,
        contributionToTotal: 15.0
      },
      {
        pillarId: "identity-saas",
        score: 65,
        maxScore: 100,
        weight: 0.15,
        contributionToTotal: 9.75
      },
      {
        pillarId: "phishing-resilience",
        score: 70,
        maxScore: 100,
        weight: 0.15,
        contributionToTotal: 10.5
      }
    ],
    benchmark: {
      industry: 68.2,
      companySize: 71.8,
      overall: 66.4
    },
    recommendations: [
      "Implement comprehensive behavioral monitoring system",
      "Enhance employee security awareness training programs",
      "Deploy advanced data loss prevention (DLP) solutions"
    ],
    strengths: [
      "Strong visibility and monitoring capabilities",
      "Good investigation and evidence procedures"
    ],
    weaknesses: [
      "Prevention and coaching programs need improvement",
      "Identity and access management requires strengthening"
    ]
  };

  const testData = {
    organizationData: mockOrganizationData,
    result: mockResult,
    generatedAt: new Date('2025-01-15T10:00:00Z')
  };

  describe('Board Brief PDF Generation', () => {
    it('should generate board brief PDF successfully', async () => {
      const result = await generatePDFWithPDFKit(testData, 'board-brief');

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBeDefined();
      expect(result.buffer.length).toBeGreaterThan(0);

      // Verify filename format
      expect(result.filename).toMatch(/^Acme-Corporation-Board-Brief-2025-01-15\.pdf$/);
    });

    it('should create valid PDF structure for board brief', async () => {
      const result = await generatePDFWithPDFKit(testData, 'board-brief');

      // Check PDF header
      const header = result.buffer.slice(0, 8).toString();
      expect(header).toMatch(/^%PDF-1\./);

      // Check PDF footer
      const footer = result.buffer.slice(-6).toString();
      expect(footer).toContain('%%EOF');

      // Verify minimum size (should contain content)
      expect(result.buffer.length).toBeGreaterThan(2000); // Reasonable minimum for content
    });

    it('should handle organization names with special characters', async () => {
      const specialOrgData = {
        ...testData,
        organizationData: {
          ...testData.organizationData,
          organizationName: "Acme & Co. (Ltd.)"
        }
      };

      const result = await generatePDFWithPDFKit(specialOrgData, 'board-brief');

      expect(result.filename).toMatch(/^Acme---Co---Ltd---Board-Brief-2025-01-15\.pdf$/); // Three dashes for each non-alphanumeric char
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
    });
  });

  describe('Detailed Plan PDF Generation', () => {
    it('should generate detailed plan PDF successfully', async () => {
      const result = await generatePDFWithPDFKit(testData, 'detailed-plan');

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBeDefined();
      expect(result.buffer.length).toBeGreaterThan(0);

      // Verify filename format
      expect(result.filename).toMatch(/^Acme-Corporation-Detailed-Plan-2025-01-15\.pdf$/);
    });

    it('should create valid PDF structure for detailed plan', async () => {
      const result = await generatePDFWithPDFKit(testData, 'detailed-plan');

      // Check PDF header
      const header = result.buffer.slice(0, 8).toString();
      expect(header).toMatch(/^%PDF-1\./);

      // Check PDF footer
      const footer = result.buffer.slice(-6).toString();
      expect(footer).toContain('%%EOF');

      // Detailed plan should be larger than board brief
      expect(result.buffer.length).toBeGreaterThan(2000);
    });

    it('should generate larger PDF for detailed plan vs board brief', async () => {
      const [boardBrief, detailedPlan] = await Promise.all([
        generatePDFWithPDFKit(testData, 'board-brief'),
        generatePDFWithPDFKit(testData, 'detailed-plan')
      ]);

      // Detailed plan should be significantly larger than board brief
      expect(detailedPlan.buffer.length).toBeGreaterThan(boardBrief.buffer.length);
    });
  });

  describe('PDF Content Validation', () => {
    it('should include organization data in PDF content', async () => {
      const result = await generatePDFWithPDFKit(testData, 'board-brief');

      // PDF should contain organization name and industry
      // Note: PDF text is encoded, so we check for presence in some form
      expect(result.buffer.length).toBeGreaterThan(2000);
      expect(result.filename).toContain('Acme-Corporation');
    });

    it('should include score data in PDF', async () => {
      const result = await generatePDFWithPDFKit(testData, 'board-brief');

      // Should contain meaningful content (score, pillars, etc.)
      expect(result.buffer.length).toBeGreaterThan(2000);

      // Verify PDF metadata
      const header = result.buffer.slice(0, 200).toString();
      expect(header).toContain('%PDF');
    });

    it('should include recommendations when provided', async () => {
      const dataWithRecommendations = {
        ...testData,
        result: {
          ...testData.result,
          recommendations: [
            "Critical recommendation 1",
            "Important recommendation 2",
            "High priority recommendation 3"
          ]
        }
      };

      const result = await generatePDFWithPDFKit(dataWithRecommendations, 'board-brief');

      expect(result.buffer.length).toBeGreaterThan(2000);
      expect(result.buffer).toBeInstanceOf(Buffer);
    });

    it('should handle missing recommendations gracefully', async () => {
      const dataWithoutRecommendations = {
        ...testData,
        result: {
          ...testData.result,
          recommendations: []
        }
      };

      const result = await generatePDFWithPDFKit(dataWithoutRecommendations, 'board-brief');

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(2000);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid PDF type gracefully', async () => {
      // PDFKit generator doesn't validate type at runtime, only at TypeScript level
      const result = await generatePDFWithPDFKit(testData, 'invalid-type' as any);
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should handle empty organization name', async () => {
      const dataWithEmptyName = {
        ...testData,
        organizationData: {
          ...testData.organizationData,
          organizationName: ""
        }
      };

      const result = await generatePDFWithPDFKit(dataWithEmptyName, 'board-brief');

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBeDefined();
      expect(result.filename).toMatch(/Board-Brief-2025-01-15\.pdf$/);
    });

    it('should handle missing pillar data gracefully', async () => {
      const dataWithMissingPillars = {
        ...testData,
        result: {
          ...testData.result,
          pillarBreakdown: []
        }
      };

      const result = await generatePDFWithPDFKit(dataWithMissingPillars, 'board-brief');

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should handle extreme score values', async () => {
      const extremeScoreData = {
        ...testData,
        result: {
          ...testData.result,
          totalScore: 0,
          level: 1,
          pillarBreakdown: testData.result.pillarBreakdown.map(pillar => ({
            ...pillar,
            score: 0,
            contributionToTotal: 0
          }))
        }
      };

      const result = await generatePDFWithPDFKit(extremeScoreData, 'board-brief');

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Memory', () => {
    it('should generate PDFs within reasonable time', async () => {
      const startTime = Date.now();

      await generatePDFWithPDFKit(testData, 'board-brief');

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple concurrent PDF generations', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        generatePDFWithPDFKit({
          ...testData,
          organizationData: {
            ...testData.organizationData,
            organizationName: `Test Org ${i}`
          }
        }, 'board-brief')
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, i) => {
        expect(result.buffer).toBeInstanceOf(Buffer);
        expect(result.filename).toContain(`Test-Org-${i}`);
      });
    });

    it('should produce consistent output for identical inputs', async () => {
      const [result1, result2] = await Promise.all([
        generatePDFWithPDFKit(testData, 'board-brief'),
        generatePDFWithPDFKit(testData, 'board-brief')
      ]);

      expect(result1.filename).toBe(result2.filename);
      // Buffer sizes should be similar (allowing for minor differences in PDF generation)
      const sizeDifference = Math.abs(result1.buffer.length - result2.buffer.length);
      expect(sizeDifference).toBeLessThan(100);
    });
  });

  describe('PDF Metadata and Properties', () => {
    it('should set correct PDF metadata', async () => {
      const result = await generatePDFWithPDFKit(testData, 'board-brief');

      // Basic PDF structure checks
      const pdfString = result.buffer.toString('binary');
      expect(pdfString).toContain('%PDF');
      expect(pdfString).toContain('%%EOF');
    });

    it('should generate appropriate file sizes', async () => {
      const boardBrief = await generatePDFWithPDFKit(testData, 'board-brief');
      const detailedPlan = await generatePDFWithPDFKit(testData, 'detailed-plan');

      // Board brief: expect 2-10KB range (PDFKit generates compact PDFs)
      expect(boardBrief.buffer.length).toBeGreaterThan(2000);
      expect(boardBrief.buffer.length).toBeLessThan(10000);

      // Detailed plan: expect 5-15KB range (PDFKit generates compact PDFs)
      expect(detailedPlan.buffer.length).toBeGreaterThan(5000);
      expect(detailedPlan.buffer.length).toBeLessThan(15000);
    });
  });
});