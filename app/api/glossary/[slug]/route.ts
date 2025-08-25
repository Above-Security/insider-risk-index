import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const term = await prisma.glossaryTerm.findUnique({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        term: true,
        slug: true,
        definition: true,
        longExplanation: true,
        category: true,
        tags: true,
        difficulty: true,
        relatedTerms: true,
        pillarRelevance: true,
        sources: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        lastReviewed: true,
        reviewedBy: true,
      },
    });

    if (!term) {
      return NextResponse.json(
        { error: 'Glossary term not found' },
        { status: 404 }
      );
    }

    // Get related terms if they exist
    let relatedTermsData = [];
    if (term.relatedTerms && term.relatedTerms.length > 0) {
      relatedTermsData = await prisma.glossaryTerm.findMany({
        where: {
          slug: { in: term.relatedTerms },
          published: true,
        },
        select: {
          term: true,
          slug: true,
          definition: true,
          category: true,
          difficulty: true,
        },
      });
    }

    return NextResponse.json({
      term,
      relatedTerms: relatedTermsData,
    });
  } catch (error) {
    console.error('Error fetching glossary term:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glossary term' },
      { status: 500 }
    );
  }
}