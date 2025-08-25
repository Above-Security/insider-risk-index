import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if GlossaryTerm table exists and has data
    const termCount = await prisma.glossaryTerm.count();
    const sampleTerm = await prisma.glossaryTerm.findFirst({
      select: { id: true, term: true, category: true }
    });
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      glossaryTerms: {
        total: termCount,
        sample: sampleTerm
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status check failed:', error);
    
    let errorType = 'unknown';
    let errorMessage = 'Database status check failed';
    
    if (error instanceof Error) {
      if (error.message.includes('connect ECONNREFUSED') || 
          error.message.includes('getaddrinfo ENOTFOUND')) {
        errorType = 'connection_refused';
        errorMessage = 'PostgreSQL server is not running or not accessible';
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        errorType = 'schema_missing';
        errorMessage = 'Database schema is not initialized - run `npm run db:setup`';
      } else if (error.message.includes('password authentication failed')) {
        errorType = 'auth_failed';
        errorMessage = 'Database authentication failed - check DATABASE_URL credentials';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: {
          type: errorType,
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
        },
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}