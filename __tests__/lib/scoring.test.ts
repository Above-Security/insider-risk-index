import { describe, it, expect } from "vitest";
import { calculateInsiderRiskIndex } from "@/lib/scoring";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment-questions";

describe("Scoring System", () => {
  it("should calculate correct score for perfect answers", () => {
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      questionId: q.id,
      value: 100, // Perfect score
      rationale: "Test rationale",
    }));

    const result = calculateInsiderRiskIndex({
      answers,
      industry: "technology",
      companySize: "1001-5000",
    });

    expect(result.totalScore).toBeCloseTo(100, 1);
    expect(result.level).toBe(5);
    expect(result.pillarBreakdown).toHaveLength(5);
  });

  it("should calculate correct score for zero answers", () => {
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      questionId: q.id,
      value: 0, // Minimum score
    }));

    const result = calculateInsiderRiskIndex({
      answers,
      industry: "technology",
      companySize: "1001-5000",
    });

    expect(result.totalScore).toBeCloseTo(0, 1);
    expect(result.level).toBe(1);
    expect(result.pillarBreakdown).toHaveLength(5);
  });

  it("should weight pillars correctly", () => {
    // Give visibility pillar perfect scores, others zero
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      questionId: q.id,
      value: q.pillarId === "visibility" ? 100 : 0,
    }));

    const result = calculateInsiderRiskIndex({
      answers,
      industry: "technology",
      companySize: "1001-5000",
    });

    // Visibility has 25% weight, so score should be approximately 25
    expect(result.totalScore).toBeCloseTo(25, 1);
    
    // Check that visibility pillar has high score
    const visibilityPillar = result.pillarBreakdown.find(p => p.pillarId === "visibility");
    expect(visibilityPillar?.score).toBeCloseTo(100, 1);
  });

  it("should generate appropriate recommendations", () => {
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      questionId: q.id,
      value: 30, // Poor score
    }));

    const result = calculateInsiderRiskIndex({
      answers,
      industry: "technology",
      companySize: "1001-5000",
    });

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.weaknesses.length).toBeGreaterThan(0);
    expect(result.recommendations[0]).toContain("comprehensive");
  });

  it("should provide benchmark comparisons", () => {
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      questionId: q.id,
      value: 75,
    }));

    const result = calculateInsiderRiskIndex({
      answers,
      industry: "technology",
      companySize: "1001-5000",
    });

    expect(result.benchmark.industry).toBeGreaterThan(0);
    expect(result.benchmark.companySize).toBeGreaterThan(0);
    expect(result.benchmark.overall).toBeGreaterThan(0);
  });
});