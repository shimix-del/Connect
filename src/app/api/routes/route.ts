import { NextRequest, NextResponse } from 'next/server';
import { getRoutes, saveRoute } from '@/lib/storage';
import { Route } from '@/types';

export async function GET() {
  try {
    const routes = getRoutes();
    return NextResponse.json({ success: true, routes });
  } catch (error) {
    console.error('API Error in GET /api/routes:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch routes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRoute: Route = {
      id: body.id || `route-${Date.now()}`,
      originName: body.originName,
      originCode: body.originCode,
      destName: body.destName,
      destCode: body.destCode,
      carriers: body.carriers || ['Safarilink'],
      aircraftType: body.aircraftType || 'Dash 8 / Caravan',
      estimatedDuration: body.estimatedDuration || '1h 00m',
      basePriceKES: Number(body.basePriceKES) || 12000,
      basePriceUSD: Number(body.basePriceUSD) || Math.round(Number(body.basePriceKES || 12000) / 130),
      description: body.description || '',
      featured: Boolean(body.featured),
      frequency: body.frequency || 'Daily flights',
    };

    saveRoute(newRoute);
    return NextResponse.json({ success: true, route: newRoute }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/routes:', error);
    return NextResponse.json({ success: false, message: 'Failed to create route' }, { status: 500 });
  }
}
