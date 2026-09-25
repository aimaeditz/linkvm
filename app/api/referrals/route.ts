import { NextRequest, NextResponse } from 'next/server';
import { buildReferralUrl } from '@/lib/referrals';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      code: 'creator-a3f9',
      url: buildReferralUrl('creator-a3f9'),
      invitesSent: 0,
      invitesAccepted: 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referral info' }, { status: 500 });
  }
}
