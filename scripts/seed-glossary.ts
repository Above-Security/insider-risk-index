import { PrismaClient } from '@prisma/client';
import { glossaryTerms } from '../lib/glossary-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning existing glossary data...');
  
  // Clear existing glossary terms
  await prisma.glossaryTerm.deleteMany();

  console.log('📚 Seeding glossary terms...');
  
  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.upsert({
      where: { slug: term.slug },
      create: {
        term: term.term,
        slug: term.slug,
        definition: term.definition,
        longExplanation: term.longExplanation,
        category: term.category,
        tags: term.tags,
        difficulty: term.difficulty,
        relatedTerms: term.relatedTerms,
        pillarRelevance: term.pillarRelevance,
        sources: term.sources,
        published: true,
        featured: term.term === "Insider Risk Index (IRI)" ||
                 term.term === "Insider Risk" ||
                 term.term === "Zero Trust Architecture",
        lastReviewed: new Date(),
        reviewedBy: "System"
      },
      update: {
        term: term.term,
        definition: term.definition,
        longExplanation: term.longExplanation,
        category: term.category,
        tags: term.tags,
        difficulty: term.difficulty,
        relatedTerms: term.relatedTerms,
        pillarRelevance: term.pillarRelevance,
        sources: term.sources,
        lastReviewed: new Date(),
        reviewedBy: "System"
      }
    });
  }

  console.log(`✅ Seeded ${glossaryTerms.length} glossary terms successfully!`);
  
  // Display some stats
  const totalTerms = await prisma.glossaryTerm.count();
  const featuredTerms = await prisma.glossaryTerm.count({ where: { featured: true } });
  const categories = await prisma.glossaryTerm.groupBy({
    by: ['category'],
    _count: true
  });
  
  console.log('📊 Glossary Statistics:');
  console.log(`  - Total Terms: ${totalTerms}`);
  console.log(`  - Featured Terms: ${featuredTerms}`);
  console.log('  - By Category:');
  categories.forEach(cat => {
    console.log(`    - ${cat.category}: ${cat._count}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });