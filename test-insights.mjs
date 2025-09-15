// Test script to verify assessment insights generation
import { generateAssessmentInsights } from './lib/assessment-insights.ts';

const testData = {
  iri: 72,
  level: 4,
  pillarBreakdown: [
    { pillar: 'visibility', score: 85, weight: 0.25, contributionToTotal: 21.25 },
    { pillar: 'coaching', score: 70, weight: 0.25, contributionToTotal: 17.5 },
    { pillar: 'evidence', score: 65, weight: 0.20, contributionToTotal: 13 },
    { pillar: 'identity', score: 75, weight: 0.15, contributionToTotal: 11.25 },
    { pillar: 'phishing', score: 68, weight: 0.15, contributionToTotal: 10.2 }
  ],
  industry: 'TECHNOLOGY',
  size: 'MEDIUM_201_1000'
};

console.log('Testing Assessment Insights Generation\n');
console.log('Input Data:');
console.log('- IRI Score:', testData.iri);
console.log('- Maturity Level:', testData.level);
console.log('- Industry:', testData.industry);
console.log('- Company Size:', testData.size);
console.log('\nPillar Scores:');
testData.pillarBreakdown.forEach(p => {
  console.log(`- ${p.pillar}: ${p.score}%`);
});

const insights = generateAssessmentInsights(testData);

console.log('\n=== Generated Insights ===\n');
console.log('Key Strengths:');
insights.strengths.forEach((s, i) => {
  console.log(`${i + 1}. ${s}`);
});

console.log('\nAreas for Improvement:');
insights.weaknesses.forEach((w, i) => {
  console.log(`${i + 1}. ${w}`);
});

console.log('\nPriority Recommendations:');
insights.recommendations.forEach((r, i) => {
  console.log(`${i + 1}. ${r}`);
});

console.log('\n✅ Test completed successfully!');