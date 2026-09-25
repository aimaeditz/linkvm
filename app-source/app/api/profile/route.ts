import { NextRequest, NextResponse } from 'next/server';
import { profileSchema, notificationsSchema, privacySchema } from '@/lib/validators';
import { z } from 'zod';

const updateProfileSchema = profileSchema.extend({
  notifications: notificationsSchema.optional(),
  privacy: privacySchema.optional(),
  hasSharedAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      user: {
        id: 'usr_1',
        name: 'Creator',
        username: 'creator',
        email: 'creator@linkvm.online',
        bio: 'Consolidate all your links into one place.',
        avatarUrl: '',
        notifications: {
          emailOnView: false,
          emailOnClick: false,
          emailOnTip: true,
          emailOnOrder: true,
          marketingUpdates: false,
        },
        privacy: {
          hideBranding: false,
          searchIndexing: true,
          sensitiveContent: false,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0].message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: validated.data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
