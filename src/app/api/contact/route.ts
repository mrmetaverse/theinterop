import { NextRequest, NextResponse } from 'next/server';
import { db, contactMessages } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, subject, message } = body;

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert message
    await db.insert(contactMessages).values({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
      status: 'unread',
    });

    return NextResponse.json({
      message: 'Message sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
