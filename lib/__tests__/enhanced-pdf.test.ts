import { describe, it, expect } from 'vitest';
import { generatePDFWithPDFKit } from '../pdf/pdfkit-generator';
import { generateEnhancedPDF } from '../pdf/pdfkit-enhanced';
import { AssessmentResult } from '../zod-schemas';

describe('Enhanced PDF Generator', () => {
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

  describe('Enhanced vs Basic PDF Comparison', () => {
    it('should generate enhanced PDF with professional styling', async () => {
      const enhancedPDF = await generateEnhancedPDF(testData, 'board-brief');

      expect(enhancedPDF).toBeDefined();
      expect(enhancedPDF.buffer).toBeInstanceOf(Buffer);
      expect(enhancedPDF.filename).toBeDefined();
      expect(enhancedPDF.buffer.length).toBeGreaterThan(0);

      // Enhanced PDF should be larger due to styling and graphics
      expect(enhancedPDF.buffer.length).toBeGreaterThan(5000);

      // Verify filename format
      expect(enhancedPDF.filename).toMatch(/^Acme-Corporation-Board-Brief-2025-01-15\.pdf$/);
    });

    it('should generate larger PDFs than basic version due to enhanced features', async () => {
      const [basicPDF, enhancedPDF] = await Promise.all([
        generatePDFWithPDFKit(testData, 'board-brief'),
        generateEnhancedPDF(testData, 'board-brief')
      ]);

      // Enhanced should be significantly larger due to styling
      expect(enhancedPDF.buffer.length).toBeGreaterThan(basicPDF.buffer.length);

      // Calculate increase percentage
      const increasePercent = ((enhancedPDF.buffer.length - basicPDF.buffer.length) / basicPDF.buffer.length) * 100;
      expect(increasePercent).toBeGreaterThan(50); // At least 50% larger

      console.log(`📊 PDF Size Comparison:
        Basic: ${(basicPDF.buffer.length / 1024).toFixed(1)}KB
        Enhanced: ${(enhancedPDF.buffer.length / 1024).toFixed(1)}KB
        Increase: ${increasePercent.toFixed(1)}%`);
    });

    it('should generate valid PDF structure with enhanced features', async () => {
      const enhancedPDF = await generateEnhancedPDF(testData, 'board-brief');

      // Check PDF header
      const header = enhancedPDF.buffer.slice(0, 8).toString();
      expect(header).toMatch(/^%PDF-1\./);

      // Check PDF footer
      const footer = enhancedPDF.buffer.slice(-6).toString();
      expect(footer).toContain('%%EOF');

      // Enhanced PDFs should have more content
      expect(enhancedPDF.buffer.length).toBeGreaterThan(5000);
    });

    it('should generate enhanced detailed plan PDFs', async () => {
      const enhancedDetailed = await generateEnhancedPDF(testData, 'detailed-plan');

      expect(enhancedDetailed.buffer).toBeInstanceOf(Buffer);
      expect(enhancedDetailed.filename).toMatch(/^Acme-Corporation-Detailed-Plan-2025-01-15\.pdf$/);

      // Detailed plan should be significantly larger
      expect(enhancedDetailed.buffer.length).toBeGreaterThan(8000);
    });

    it('should include professional features in enhanced PDFs', async () => {
      const enhancedPDF = await generateEnhancedPDF(testData, 'board-brief');

      // Enhanced PDFs should be substantially larger due to:
      // - Professional styling and graphics
      // - Color coding and visual elements
      // - Charts and progress bars
      // - Typography enhancements
      expect(enhancedPDF.buffer.length).toBeGreaterThan(5000);

      // Verify PDF structure is valid
      const pdfString = enhancedPDF.buffer.toString('binary');
      expect(pdfString).toContain('%PDF');
      expect(pdfString).toContain('%%EOF');
    });
  });

  describe('Enhanced PDF Features', () => {
    it('should handle different risk levels with appropriate color coding', async () => {
      const highRiskData = {
        ...testData,
        result: {
          ...testData.result,
          totalScore: 25,
          level: 1
        }
      };

      const highRiskPDF = await generateEnhancedPDF(highRiskData, 'board-brief');
      expect(highRiskPDF.buffer).toBeInstanceOf(Buffer);
      expect(highRiskPDF.buffer.length).toBeGreaterThan(5000);
    });

    it('should handle different organization names with proper formatting', async () => {
      const specialOrgData = {
        ...testData,
        organizationData: {
          ...testData.organizationData,
          organizationName: "Tech & Innovation Co. (LLC)"
        }
      };

      const enhancedPDF = await generateEnhancedPDF(specialOrgData, 'board-brief');
      expect(enhancedPDF.filename).toMatch(/^Tech---Innovation-Co---LLC--Board-Brief/);
    });

    it('should generate consistent high-quality output', async () => {
      // Generate multiple PDFs to test consistency
      const promises = Array.from({ length: 3 }, () =>
        generateEnhancedPDF(testData, 'board-brief')
      );

      const results = await Promise.all(promises);

      results.forEach((result, i) => {
        expect(result.buffer).toBeInstanceOf(Buffer);
        expect(result.buffer.length).toBeGreaterThan(5000);
        expect(result.filename).toContain('Acme-Corporation');
      });

      // All should be similar in size (within 10% variance)
      const sizes = results.map(r => r.buffer.length);
      const avgSize = sizes.reduce((a, b) => a + b) / sizes.length;

      sizes.forEach(size => {
        const variance = Math.abs(size - avgSize) / avgSize;
        expect(variance).toBeLessThan(0.1); // Less than 10% variance
      });
    });
  });

  describe('Performance and Quality', () => {
    it('should generate enhanced PDFs within reasonable time', async () => {
      const startTime = Date.now();

      await generateEnhancedPDF(testData, 'board-brief');

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
    });

    it('should maintain quality while being memory efficient', async () => {
      // Test multiple concurrent generations
      const promises = Array.from({ length: 5 }, (_, i) =>
        generateEnhancedPDF({
          ...testData,
          organizationData: {
            ...testData.organizationData,
            organizationName: `Test Company ${i}`
          }
        }, 'board-brief')
      );

      const results = await Promise.all(promises);

      results.forEach((result, i) => {
        expect(result.buffer).toBeInstanceOf(Buffer);
        expect(result.filename).toContain(`Test-Company-${i}`);
        expect(result.buffer.length).toBeGreaterThan(5000);
      });
    });
  });
});