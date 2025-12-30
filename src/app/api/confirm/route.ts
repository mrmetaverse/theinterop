import { NextRequest, NextResponse } from 'next/server';
import { db, subscribers } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/subscribe?error=invalid', request.url));
  }

  try {
    // Find subscriber by token
    const subscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.token, token),
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL('/subscribe?error=invalid', request.url));
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.redirect(new URL('/subscribe?status=already-confirmed', request.url));
    }

    // Confirm the subscriber
    await db
      .update(subscribers)
      .set({
        status: 'confirmed',
        token: null, // Clear the token after use
        confirmedAt: new Date(),
      })
      .where(eq(subscribers.id, subscriber.id));

    // Send welcome email (non-blocking)
    sendWelcomeEmail(subscriber.email).catch(console.error);

    return NextResponse.redirect(new URL('/subscribe?status=confirmed', request.url));
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.redirect(new URL('/subscribe?error=server', request.url));
  }
}

