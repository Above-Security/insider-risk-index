import { NextRequest, NextResponse } from 'next/server';
import { generatePillarMatrixAnalysis } from '@/lib/matrix-api';
import { getAllPillars } from '@/lib/pillars';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pillar: string }> }
) {
  try {
    const { pillar } = await params;
    
    // Validate pillar ID
    const pillars = getAllPillars();
    const validPillar = pillars.find(p => p.id === pillar);
    
    if (!validPillar) {
      return NextResponse.json(
        {
          error: 'Invalid pillar ID',
          validPillars: pillars.map(p => p.id)
        },
        { status: 400 }
      );
    }

    const analysis = await generatePillarMatrixAnalysis(pillar);
    
    return NextResponse.json({
      pillar: validPillar,
      analysis,
      generatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Matrix analysis error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate Matrix analysis'
      },
      { status: 500 }
    );
  }
}