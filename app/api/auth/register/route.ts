import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveReferralCode } from '@/lib/referrals';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ref: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, ref } = parsed.data;

    const cookieHeader = req.headers.get('cookie') || '';
    const cookieMatch = cookieHeader.match(/linkvm_ref_code=([^;]+)/);
    const refCode = ref || (cookieMatch ? cookieMatch[1] : undefined);

    let referredById: string | null = null;
    if (refCode) {
      const referrer = await resolveReferralCode(refCode);
      if (referrer) {
        referredById = referrer.id;
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: 'usr_' + Date.now(),
          name,
          email,
          referredBy: referredById,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
