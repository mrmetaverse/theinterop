import { NextResponse } from 'next/server';
import { syncVirgentCaseStudies } from '@/lib/content-fetcher';

// Verify cron secret for Vercel Cron Jobs
function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If no secret configured, allow in development
  if (!cronSecret && process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

// GET endpoint for Vercel Cron or manual trigger
export async function GET(request: Request) {
  // Verify authorization for cron jobs
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    console.log('Starting content sync...');
    
    // Sync Virgent AI case studies
    const virgentResults = await syncVirgentCaseStudies();
    
    const results = {
      timestamp: new Date().toISOString(),
      virgent: virgentResults,
      // Add more sources here as needed
    };
    
    console.log('Content sync completed:', results);
    
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Content sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

// POST endpoint for webhook triggers or manual sync with options
export async function POST(request: Request) {
  // Verify authorization
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.NEWSLETTER_API_KEY && !verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json().catch(() => ({}));
    const { source = 'all' } = body;
    
    const results: Record<string, { success: number; failed: number }> = {};
    
    if (source === 'all' || source === 'virgent') {
      results.virgent = await syncVirgentCaseStudies();
    }
    
    // Add more source handlers here
    
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Content sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}
