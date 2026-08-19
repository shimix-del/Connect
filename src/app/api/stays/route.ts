import { NextRequest, NextResponse } from 'next/server';
import { getStays, saveStay } from '@/lib/storage';
import { BnBListing } from '@/types';

export async function GET() {
  try {
    const stays = getStays();
    return NextResponse.json({ success: true, stays });
  } catch (error) {
    console.error('API Error in GET /api/stays:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch stays' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newStay: BnBListing = {
      id: body.id || `stay-${Date.now()}`,
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      location: body.location,
      region: body.region || 'Coast',
      description: body.description || '',
      tagline: body.tagline || '',
      photos: body.photos?.length ? body.photos : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'],
      bedrooms: Number(body.bedrooms) || 3,
      bathrooms: Number(body.bathrooms) || 3,
      maxGuests: Number(body.maxGuests) || 6,
      amenities: body.amenities || ['Private Chef Included', 'Oceanview Pool', 'Starlink WiFi'],
      pricePerNightKES: Number(body.pricePerNightKES) || 50000,
      pricePerNightUSD: Number(body.pricePerNightUSD) || Math.round(Number(body.pricePerNightKES || 50000) / 130),
      ownerName: body.ownerName || 'Property Host',
      ownerPhone: body.ownerPhone || '+254700000000',
      active: body.active !== undefined ? Boolean(body.active) : true,
      featured: Boolean(body.featured),
      badge: body.badge || undefined,
    };

    saveStay(newStay);
    return NextResponse.json({ success: true, stay: newStay }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/stays:', error);
    return NextResponse.json({ success: false, message: 'Failed to create stay' }, { status: 500 });
  }
}
