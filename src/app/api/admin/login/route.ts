import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { randomBytes } from 'crypto';
import { eq, and, gt } from 'drizzle-orm';

const ADMIN_EMAIL = 'jesse@alton.tech';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Simple in-memory rate limiting (resets on server restart)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(ip: string): string {
  return `login:${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const attempt = loginAttempts.get(key);
  
  if (!attempt) return false;
  
  if (Date.now() > attempt.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  
  return attempt.count >= MAX_ATTEMPTS;
}

function recordLoginAttempt(ip: string, success: boolean) {
  const key = getRateLimitKey(ip);
  const attempt = loginAttempts.get(key);
  
  if (success) {
    loginAttempts.delete(key);
    return;
  }
  
  if (!attempt) {
    loginAttempts.set(key, {
      count: 1,
      resetAt: Date.now() + LOCKOUT_DURATION,
    });
  } else {
    attempt.count++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      console.log('Rate limited IP:', ip);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD not configured');
      return NextResponse.json(
        { error: 'Admin system not configured' },
        { status: 500 }
      );
    }

    // Debug logging (remove after fixing)
    console.log('Login attempt:', {
      emailMatch: email === ADMIN_EMAIL,
      passwordLength: password?.length,
      expectedPasswordLength: ADMIN_PASSWORD?.length,
      passwordMatch: password === ADMIN_PASSWORD,
    });

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Success - clear rate limit
    recordLoginAttempt(ip, true);

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
