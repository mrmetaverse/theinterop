import { NextRequest, NextResponse } from 'next/server';
import { db, subscribers, newsletterSends } from '@/lib/db';
import { sendNewsletterEmail } from '@/lib/email';
import { getPostBySlug } from '@/lib/posts';
import { eq } from 'drizzle-orm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jessealton.com';

export async function POST(request: NextRequest) {
  try {
    // Verify API key for protection
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.NEWSLETTER_API_KEY;

    if (!apiKey) {
      console.error('NEWSLETTER_API_KEY not configured');
      return NextResponse.json(
        { error: 'Newsletter API not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    // Get the post
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get all confirmed subscribers
    const confirmedSubscribers = await db.query.subscribers.findMany({
      where: eq(subscribers.status, 'confirmed'),
    });

    if (confirmedSubscribers.length === 0) {
      return NextResponse.json(
        { message: 'No confirmed subscribers to send to', sent: 0 },
        { status: 200 }
      );
    }

    const emails = confirmedSubscribers.map((s) => s.email);
    const postUrl = `${SITE_URL}/blog/${post.slug}`;

    // Send newsletter
    const results = await sendNewsletterEmail(emails, {
      subject: `New Post: ${post.title}`,
      previewText: post.excerpt,
      title: post.title,
      excerpt: post.excerpt,
      postUrl,
      coverImage: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
    });

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    // Track the send in database
    await db.insert(newsletterSends).values({
      postSlug: slug,
      recipientCount: emails.length,
      successCount: successful,
      failedCount: failed,
    });

    return NextResponse.json({
      message: `Newsletter sent to ${successful} subscribers`,
      sent: successful,
      failed,
      total: emails.length,
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscriber count (protected)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const confirmedSubscribers = await db.query.subscribers.findMany({
      where: eq(subscribers.status, 'confirmed'),
    });

    return NextResponse.json({
      confirmedCount: confirmedSubscribers.length,
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriber count' },
      { status: 500 }
    );
  }
}

