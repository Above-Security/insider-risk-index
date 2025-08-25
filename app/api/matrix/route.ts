import { NextResponse } from 'next/server';
import { MatrixAPI } from '@/lib/matrix-api';

export async function GET() {
  try {
    const matrixData = await MatrixAPI.getMatrixData();
    return NextResponse.json(matrixData);
  } catch (error) {
    console.error('Error fetching Matrix data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Matrix data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Force refresh the Matrix cache
    const matrixData = await MatrixAPI.refreshCache();
    return NextResponse.json({
      message: 'Matrix cache refreshed successfully',
      data: matrixData
    });
  } catch (error) {
    console.error('Error refreshing Matrix cache:', error);
    return NextResponse.json(
      { error: 'Failed to refresh Matrix cache' },
      { status: 500 }
    );
  }
}