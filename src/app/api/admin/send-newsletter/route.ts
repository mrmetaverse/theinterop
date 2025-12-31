import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';

const NEWSLETTER_API_KEY = process.env.NEWSLETTER_API_KEY;

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;

  const session = await db.query.adminSessions.findFirst({
    where: and(
      eq(adminSessions.token, token),
      gt(adminSessions.expiresAt, new Date())
    ),
  });

  return !!session;
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, slugs, batch } = body;

    // Handle batch newsletter
    if (batch && slugs && Array.isArray(slugs)) {
      if (slugs.length === 0) {
        return NextResponse.json(
          { error: 'At least one post slug is required' },
          { status: 400 }
        );
      }

      // Call the batch newsletter API with the server-side key
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://jessealton.com'}/api/send-newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NEWSLETTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slugs, batch: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.error || 'Failed to send batch newsletter' },
          { status: response.status }
        );
      }

      const result = await response.json();
      return NextResponse.json(result);
    }

    // Handle single newsletter
    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    // Call the actual newsletter API with the server-side key
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://jessealton.com'}/api/send-newsletter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NEWSLETTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Failed to send newsletter' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin send newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
