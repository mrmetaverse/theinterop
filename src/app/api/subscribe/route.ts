import { NextRequest, NextResponse } from 'next/server';
import { db, subscribers } from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/email';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existing = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, normalizedEmail),
    });

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }

      if (existing.status === 'pending') {
        // Resend confirmation email
        const token = randomBytes(32).toString('hex');
        await db
          .update(subscribers)
          .set({ token })
          .where(eq(subscribers.id, existing.id));

        await sendConfirmationEmail(normalizedEmail, token);

        return NextResponse.json(
          { message: 'Confirmation email resent. Please check your inbox.' },
          { status: 200 }
        );
      }

      if (existing.status === 'unsubscribed') {
        // Re-subscribe flow
        const token = randomBytes(32).toString('hex');
        await db
          .update(subscribers)
          .set({ 
            status: 'pending', 
            token,
            unsubscribedAt: null 
          })
          .where(eq(subscribers.id, existing.id));

        await sendConfirmationEmail(normalizedEmail, token);

        return NextResponse.json(
          { message: 'Please check your email to confirm your subscription.' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const token = randomBytes(32).toString('hex');
    await db.insert(subscribers).values({
      email: normalizedEmail,
      status: 'pending',
      token,
    });

    // Send confirmation email
    await sendConfirmationEmail(normalizedEmail, token);

    return NextResponse.json(
      { message: 'Please check your email to confirm your subscription.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

