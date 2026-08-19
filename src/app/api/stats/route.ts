import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/storage';

export async function GET() {
  try {
    const stats = getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('API Error in GET /api/stats:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
