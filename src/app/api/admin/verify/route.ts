import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';

const ADMIN_EMAIL = 'jesse@alton.tech';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    const authCookie = request.cookies.get('admin_auth')?.value;

    if (!token && !authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Try database verification first
    if (token) {
      try {
    const session = await db.query.adminSessions.findFirst({
      where: and(
        eq(adminSessions.token, token),
        gt(adminSessions.expiresAt, new Date())
      ),
    });

        if (session) {
    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
        }
      } catch (dbError) {
        console.warn('Database not available, falling back to cookie auth:', dbError);
      }
    }

    // Fallback to backup cookie verification (when DB not available)
    if (authCookie) {
      try {
        const decoded = Buffer.from(authCookie, 'base64').toString('utf-8');
        const [email, timestamp] = decoded.split(':');
        
        // Check if session is still valid (7 days)
        const sessionAge = Date.now() - parseInt(timestamp);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (email === ADMIN_EMAIL && sessionAge < sevenDays) {
          return NextResponse.json({
            authenticated: true,
            email: email,
          });
        }
      } catch (decodeError) {
        console.error('Failed to decode auth cookie:', decodeError);
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
