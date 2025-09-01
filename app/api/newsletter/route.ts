import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for newsletter subscription
const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('footer'),
  consent: z.boolean().optional().default(true),
});

// Rate limiting: Simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // 5 requests per minute
  const window = 60000; // 1 minute in milliseconds
  
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + window });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Honeypot field check (anti-bot)
function isBot(request: any): boolean {
  // If hidden honeypot field is filled, it's likely a bot
  return request.website || request.url || request.phone;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Check for bot activity
    if (isBot(body)) {
      // Silently accept but don't process (honeypot triggered)
      return NextResponse.json(
        { success: true, message: 'Thank you for subscribing!' },
        { status: 200 }
      );
    }
    
    // Validate input
    const validationResult = NewsletterSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid email address',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }
    
    const { email, source, consent } = validationResult.data;
    
    // Check consent
    if (!consent) {
      return NextResponse.json(
        { error: 'Consent is required for newsletter subscription' },
        { status: 400 }
      );
    }
    
    // TODO: In production, integrate with email service provider
    // Options: SendGrid, Mailchimp, ConvertKit, etc.
    // Example integration points:
    
    // 1. Check if email already exists
    // const exists = await checkEmailExists(email);
    // if (exists) {
    //   return NextResponse.json(
    //     { message: 'You are already subscribed!' },
    //     { status: 200 }
    //   );
    // }
    
    // 2. Add to email list
    // await addToEmailList({
    //   email,
    //   source,
    //   subscribedAt: new Date().toISOString(),
    //   ipAddress: ip,
    //   tags: ['insider-risk-index', source],
    // });
    
    // 3. Send welcome email (double opt-in for GDPR)
    // await sendWelcomeEmail(email);
    
    // For now, log the subscription (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Newsletter subscription:', {
        email,
        source,
        timestamp: new Date().toISOString(),
        ip,
      });
    }
    
    // Store in database (optional)
    // You could store subscriptions in your database
    // await prisma.newsletterSubscription.create({
    //   data: {
    //     email,
    //     source,
    //     subscribedAt: new Date(),
    //     confirmed: false, // Set to true after email confirmation
    //   },
    // });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Please check your email to confirm your subscription.',
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check API health
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      endpoint: '/api/newsletter',
      methods: ['POST'],
      rateLimit: '5 requests per minute',
    },
    { status: 200 }
  );
}