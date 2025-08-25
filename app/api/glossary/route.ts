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
      // Enhanced full-text search with multiple strategies
      const searchTerms = query.toLowerCase().trim().split(/\s+/);
      
      where.OR = [
        // Exact term match (highest priority)
        { term: { equals: query, mode: 'insensitive' } },
        // Term contains search
        { term: { contains: query, mode: 'insensitive' } },
        // Definition contains search
        { definition: { contains: query, mode: 'insensitive' } },
        // Long explanation contains search
        { longExplanation: { contains: query, mode: 'insensitive' } },
        // Tags array contains search term
        { tags: { hasSome: searchTerms } },
        // Related terms contain search
        { relatedTerms: { hasSome: searchTerms } },
        // Multiple word search in definition
        ...searchTerms.length > 1 ? [
          {
            AND: searchTerms.map(term => ({
              OR: [
                { term: { contains: term, mode: 'insensitive' } },
                { definition: { contains: term, mode: 'insensitive' } },
                { tags: { has: term } }
              ]
            }))
          }
        ] : []
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch glossary terms';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('connect ECONNREFUSED') || 
          error.message.includes('getaddrinfo ENOTFOUND')) {
        errorMessage = 'Database connection failed - PostgreSQL server is not running or not accessible';
        statusCode = 503;
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        errorMessage = 'Database schema is not initialized - run database migrations';
        statusCode = 503;
      } else if (error.message.includes('password authentication failed')) {
        errorMessage = 'Database authentication failed - check credentials';
        statusCode = 503;
      } else {
        errorMessage = `Database error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
      },
      { status: statusCode }
    );
  }
}