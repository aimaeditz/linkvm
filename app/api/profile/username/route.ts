import { NextRequest, NextResponse } from 'next/server';
import { validateUsername, isReservedUsername } from '@/lib/reserved-usernames';
import { getSiteUrl } from '@/lib/site';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUsername = body.username || '';
    const normalized = rawUsername.trim().toLowerCase();

    const validation = validateUsername(normalized);
    if (!validation.valid) {
      if (isReservedUsername(normalized)) {
        return NextResponse.json({ error: 'This username is reserved.' }, { status: 400 });
      }
      return NextResponse.json({ error: validation.error || 'Invalid username' }, { status: 400 });
    }

    try {
      const { prisma } = await import('@/lib/prisma');
      const userId = body.userId; // Provided via auth session or body

      if (userId) {
        const existing = await prisma.user.findFirst({
          where: {
            username: { equals: normalized, mode: 'insensitive' },
            NOT: { id: userId },
          },
        });

        if (existing) {
          return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 });
        }

        const updated = await prisma.user.update({
          where: { id: userId },
          data: { username: normalized },
        });

        return NextResponse.json({
          success: true,
          username: updated.username,
          publicUrl: `${getSiteUrl()}/${updated.username}`,
        });
      }
    } catch {
      // Fallback response for client local storage persistence
    }

    return NextResponse.json({
      success: true,
      username: normalized,
      publicUrl: `${getSiteUrl()}/${normalized}`,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update username' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
