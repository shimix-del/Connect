import { NextRequest, NextResponse } from 'next/server';
import { getClients, saveClient } from '@/lib/storage';
import { Client } from '@/types';

export async function GET() {
  try {
    const clients = getClients();
    return NextResponse.json({ success: true, clients });
  } catch (error) {
    console.error('API Error in GET /api/clients:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newClient: Client = {
      id: body.id || `client-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      vipTier: body.vipTier || 'standard',
      notes: body.notes || '',
      createdAt: body.createdAt || new Date().toISOString(),
    };

    saveClient(newClient);
    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/clients:', error);
    return NextResponse.json({ success: false, message: 'Failed to save client' }, { status: 500 });
  }
}
