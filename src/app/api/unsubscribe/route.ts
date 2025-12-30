import { NextRequest, NextResponse } from 'next/server';
import { db, subscribers } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.redirect(new URL('/subscribe?error=invalid', request.url));
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Find subscriber
    const subscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, normalizedEmail),
    });

    if (!subscriber) {
      // Don't reveal if email exists or not
      return NextResponse.redirect(new URL('/subscribe?status=unsubscribed', request.url));
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.redirect(new URL('/subscribe?status=already-unsubscribed', request.url));
    }

    // Unsubscribe
    await db
      .update(subscribers)
      .set({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      })
      .where(eq(subscribers.id, subscriber.id));

    return NextResponse.redirect(new URL('/subscribe?status=unsubscribed', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(new URL('/subscribe?error=server', request.url));
  }
}

