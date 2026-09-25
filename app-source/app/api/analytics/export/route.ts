import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const csvContent = [
      'Date,Event,Device,Referrer,Clicks,Views',
      `${new Date().toISOString().split('T')[0]},view,Desktop,Direct,0,0`,
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="linkvm-analytics.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 });
  }
}
