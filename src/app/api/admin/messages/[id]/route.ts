import { NextRequest, NextResponse } from 'next/server';
import { db, contactMessages, adminSessions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Mark message as read
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const messageId = parseInt(id);

    await db
      .update(contactMessages)
      .set({ status: 'read' })
      .where(eq(contactMessages.id, messageId));

    return NextResponse.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// Reply to message
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const messageId = parseInt(id);
    const body = await request.json();
    const { reply } = body;

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply text is required' },
        { status: 400 }
      );
    }

    // Get the original message
    const message = await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, messageId),
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Send reply email
    await resend.emails.send({
      from: 'Jesse Alton <jesse@jessealton.com>',
      replyTo: 'jesse@alton.tech',
      to: message.email,
      subject: `Re: ${message.subject || 'Your message'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 24px; margin-bottom: 20px;">Response from Jesse Alton</h2>
          <div style="background: #f5f5f5; padding: 20px; margin-bottom: 20px; border-left: 3px solid #623cea;">
            ${reply.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <div style="color: #666; font-size: 14px;">
            <p><strong>Your original message:</strong></p>
            <p>${message.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    // Update message status
    await db
      .update(contactMessages)
      .set({
        status: 'replied',
        repliedAt: new Date(),
      })
      .where(eq(contactMessages.id, messageId));

    return NextResponse.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
