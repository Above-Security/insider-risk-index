import { NextRequest, NextResponse } from 'next/server';
import { syncMatrixData, clearMatrixCache } from '@/lib/matrix-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Clear cache if requested
    if (body.clearCache) {
      clearMatrixCache();
    }

    const result = await syncMatrixData();
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Matrix sync error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        lastSync: new Date().toISOString(),
        version: 'unknown',
        techniquesCount: 0,
        preventionsCount: 0,
        detectionsCount: 0
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await syncMatrixData();
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Matrix sync error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync Matrix data'
      },
      { status: 500 }
    );
  }
}