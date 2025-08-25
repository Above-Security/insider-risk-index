import { NextRequest, NextResponse } from 'next/server';
import { getMatrixData } from '@/lib/matrix-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pillarId = searchParams.get('pillar');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const matrixData = await getMatrixData();
    
    if (!matrixData || !matrixData.techniques) {
      return NextResponse.json({
        error: 'Matrix data not available',
        techniques: [],
        total: 0,
        metadata: {
          pillarId,
          category,
          limit
        }
      }, { status: 503 }); // Service unavailable
    }
    
    let techniques = matrixData.techniques;

    // Filter by category if specified
    if (category) {
      techniques = techniques.filter(t => t.category === category);
    }

    // Filter by pillar relevance if specified
    if (pillarId && pillarId !== 'all') {
      // Simple pillar filtering for now - can be enhanced later
      techniques = techniques.filter(t => {
        return t.preventions?.some((p: any) => p.primaryPillar === pillarId) ||
               t.detections?.some((d: any) => d.primaryPillar === pillarId) ||
               pillarId === 'visibility'; // Default for now
      });
    }

    // Limit results
    techniques = techniques.slice(0, limit);

    return NextResponse.json({
      techniques,
      total: techniques.length,
      metadata: {
        pillarId,
        category,
        limit
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      }
    });
  } catch (error) {
    console.error('Matrix techniques error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch Matrix techniques',
        techniques: [],
        total: 0
      },
      { status: 500 }
    );
  }
}