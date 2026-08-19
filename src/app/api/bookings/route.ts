import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking } from '@/lib/storage';
import { BookingStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as BookingStatus | null;
    const query = searchParams.get('q')?.toLowerCase();

    let bookings = getBookings(status || undefined);

    if (query) {
      bookings = bookings.filter(
        (b) =>
          b.trackingCode.toLowerCase().includes(query) ||
          b.client.name.toLowerCase().includes(query) ||
          b.client.phone.includes(query) ||
          b.flightDestination?.toLowerCase().includes(query) ||
          b.bnbCustomPreference?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('API Error in GET /api/bookings:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.client || !body.client.name || !body.client.phone) {
      return NextResponse.json(
        { success: false, message: 'Client name and phone number are required.' },
        { status: 400 }
      );
    }

    const created = createBooking(body);

    return NextResponse.json({
      success: true,
      message: 'Booking request created successfully.',
      booking: created,
      trackingCode: created.trackingCode,
    }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/bookings:', error);
    return NextResponse.json({ success: false, message: 'Failed to create booking' }, { status: 500 });
  }
}
