import { NextRequest, NextResponse } from 'next/server';
import { validateUsername, isReservedUsername } from '@/lib/reserved-usernames';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || '';

    if (!username) {
      return NextResponse.json({ available: false, reason: 'Invalid input' }, { status: 400 });
    }

    const normalized = username.trim().toLowerCase();

    const validation = validateUsername(normalized);
    if (!validation.valid) {
      if (isReservedUsername(normalized)) {
        return NextResponse.json({ available: false, reason: 'reserved' });
      }
      return NextResponse.json({ available: false, reason: 'invalid', message: validation.error });
    }

    // In Next.js server context, check DB if prisma available
    try {
      const { prisma } = await import('@/lib/prisma');
      const existing = await prisma.user.findFirst({
        where: {
          username: {
            equals: normalized,
            mode: 'insensitive',
          },
        },
      });

      if (existing) {
        return NextResponse.json({ available: false, reason: 'taken' });
      }
    } catch {
      // Fallback for storage layer if Prisma is not connected
    }

    return NextResponse.json({ available: true, username: normalized });
  } catch {
    return NextResponse.json({ available: false, reason: 'error' }, { status: 500 });
  }
}
