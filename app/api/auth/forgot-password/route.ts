import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Do not leak whether the email exists in the database
    // In production, an email token would be dispatched here
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
