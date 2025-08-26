import { NextRequest, NextResponse } from 'next/server';
import { syncMatrixData, clearMatrixCache } from '@/lib/matrix-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Clear cache if requested
    if (body.clearCache) {
      clearMatrixCache();
    }

    const matrixData = await syncMatrixData();
    
    const result = {
      success: true,
      data: matrixData,
      lastSync: new Date().toISOString(),
      elementsCount: matrixData.elements.length,
      preventionsCount: matrixData.elements.reduce((sum, t) => sum + (t.preventions?.length || 0), 0),
      detectionsCount: matrixData.elements.reduce((sum, t) => sum + (t.detections?.length || 0), 0),
      version: matrixData.version
    };
    
    return NextResponse.json(result, {
      status: 200,
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
    const matrixData = await syncMatrixData();
    
    const result = {
      success: true,
      data: matrixData,
      lastSync: new Date().toISOString(),
      elementsCount: matrixData.elements.length,
      preventionsCount: matrixData.elements.reduce((sum, t) => sum + (t.preventions?.length || 0), 0),
      detectionsCount: matrixData.elements.reduce((sum, t) => sum + (t.detections?.length || 0), 0),
      version: matrixData.version
    };
    
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