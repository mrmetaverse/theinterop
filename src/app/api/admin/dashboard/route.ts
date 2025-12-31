import { NextRequest, NextResponse } from 'next/server';
import { db, subscribers, newsletterSends, contactMessages, adminSessions } from '@/lib/db';
import { eq, and, gt, desc, gte, sql } from 'drizzle-orm';
import { getAllPostsMeta } from '@/lib/posts';

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

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all subscribers grouped by status
    const allSubscribers = await db.query.subscribers.findMany();
    const confirmedCount = allSubscribers.filter(s => s.status === 'confirmed').length;
    const pendingCount = allSubscribers.filter(s => s.status === 'pending').length;
    const unsubscribedCount = allSubscribers.filter(s => s.status === 'unsubscribed').length;

    // Get recent subscribers (last 10)
    const recentSubscribers = allSubscribers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Get subscribers over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysSubscribers = allSubscribers.filter(
      s => new Date(s.createdAt) >= thirtyDaysAgo
    );

    // Get all newsletter sends
    const allNewsletterSends = await db.query.newsletterSends.findMany({
      orderBy: desc(newsletterSends.sentAt),
      limit: 10,
    });

    // Get recent posts
    const allPosts = getAllPostsMeta();
    const recentPosts = allPosts
      .filter(p => !p.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(post => ({
        ...post,
        emailSent: allNewsletterSends.some(ns => ns.postSlug === post.slug),
      }));

    // Get unread contact messages
    const unreadMessages = await db.query.contactMessages.findMany({
      where: eq(contactMessages.status, 'unread'),
      orderBy: desc(contactMessages.createdAt),
    });

    // Get all messages for display (last 20)
    const allMessages = await db.query.contactMessages.findMany({
      orderBy: desc(contactMessages.createdAt),
      limit: 20,
    });

    return NextResponse.json({
      subscribers: {
        total: allSubscribers.length,
        confirmed: confirmedCount,
        pending: pendingCount,
        unsubscribed: unsubscribedCount,
        last30Days: last30DaysSubscribers.length,
        recent: recentSubscribers,
      },
      posts: {
        total: allPosts.length,
        published: allPosts.filter(p => !p.draft).length,
        drafts: allPosts.filter(p => p.draft).length,
        recent: recentPosts,
      },
      newsletters: {
        totalSent: allNewsletterSends.length,
        recent: allNewsletterSends,
      },
      messages: {
        unreadCount: unreadMessages.length,
        total: allMessages.length,
        recent: allMessages,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
