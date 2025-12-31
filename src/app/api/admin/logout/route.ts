import { NextRequest, NextResponse } from 'next/server';
import { db, adminSessions } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      // Delete session from database
      await db.delete(adminSessions).where(eq(adminSessions.token, token));
    }

    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
