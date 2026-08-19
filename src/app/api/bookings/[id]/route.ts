import { NextRequest, NextResponse } from 'next/server';
import { getBookingByIdOrCode, updateBooking } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = getBookingByIdOrCode(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error(`API Error in GET /api/bookings/${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = updateBooking(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Booking request not found for update.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking request updated successfully.',
      booking: updated,
    });
  } catch (error) {
    console.error(`API Error in PATCH /api/bookings/${params.id}:`, error);
    return NextResponse.json({ success: false, message: 'Failed to update booking' }, { status: 500 });
  }
}
