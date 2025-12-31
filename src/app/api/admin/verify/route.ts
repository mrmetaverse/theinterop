import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token and expiry
    const session = await db.query.adminSessions.findFirst({
      where: and(
        eq(adminSessions.token, token),
        gt(adminSessions.expiresAt, new Date())
      ),
    });

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
