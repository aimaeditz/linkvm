import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const exportData = {
      app: 'LinkVM',
      exportedAt: new Date().toISOString(),
      user: {
        name: 'Creator',
        username: 'creator',
        email: 'creator@linkvm.online',
      },
      links: [],
      themes: [],
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="linkvm-export.json"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export account data' }, { status: 500 });
  }
}
