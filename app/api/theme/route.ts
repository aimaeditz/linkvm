import { NextRequest, NextResponse } from 'next/server';
import { themeOverrideSchema } from '../../../src/lib/validators';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate with Zod
    const validation = themeOverrideSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Return successful payload
    return NextResponse.json({
      success: true,
      message: 'Theme saved successfully on server.',
      theme: validation.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
