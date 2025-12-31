import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { randomBytes } from 'crypto';
import { eq, and, gt } from 'drizzle-orm';

const ADMIN_EMAIL = 'jesse@alton.tech';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD not configured');
      return NextResponse.json(
        { error: 'Admin system not configured' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(adminSessions).values({
      email: ADMIN_EMAIL,
      token,
      expiresAt,
    });

    const response = NextResponse.json({
      message: 'Login successful',
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
