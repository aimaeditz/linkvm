import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const sessions = [
      {
        id: 'sess-current',
        device: 'Current Browser / Desktop',
        ipAddress: 'Active Session',
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
    ];

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    return NextResponse.json({ success: true, message: 'All other sessions revoked.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revoke sessions' }, { status: 500 });
  }
}
