import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const difficulty = searchParams.get('difficulty') || 'all';
    const pillar = searchParams.get('pillar') || 'all';
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      published: true,
    };

    if (query) {
      where.OR = [
        { term: { contains: query, mode: 'insensitive' } },
        { definition: { contains: query, mode: 'insensitive' } },
        { longExplanation: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (pillar && pillar !== 'all') {
      where.pillarRelevance = { has: pillar };
    }

    if (featured) {
      where.featured = true;
    }

    // Get terms with pagination
    const [terms, totalCount] = await Promise.all([
      prisma.glossaryTerm.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { term: 'asc' }
        ],
        take: limit,
        skip: offset,
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
        },
      }),
      prisma.glossaryTerm.count({ where }),
    ]);

    // Get category counts for filtering
    const categoryCounts = await prisma.glossaryTerm.groupBy({
      by: ['category'],
      where: { published: true },
      _count: true,
    });

    const difficultyLevels = await prisma.glossaryTerm.groupBy({
      by: ['difficulty'],
      where: { published: true },
      _count: true,
    });

    return NextResponse.json({
      terms,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      filters: {
        categories: [
          { id: 'all', name: 'All Categories', count: totalCount },
          ...categoryCounts.map(c => ({
            id: c.category,
            name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
            count: c._count,
          })),
        ],
        difficulties: [
          { id: 'all', name: 'All Levels', count: totalCount },
          ...difficultyLevels.map(d => ({
            id: d.difficulty,
            name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
            count: d._count,
          })),
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glossary terms' },
      { status: 500 }
    );
  }
}