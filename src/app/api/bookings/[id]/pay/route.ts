import { NextRequest, NextResponse } from 'next/server';
import { getBookingByIdOrCode, updateBooking } from '@/lib/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = getBookingByIdOrCode(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found.' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const method = body.method || 'mpesa';
    const amountKES = booking.quote?.totalPriceKES || Number(body.amountKES) || 50000;
    const amountUSD = booking.quote?.totalPriceUSD || Math.round(amountKES / 130);

    // Simulate payment transaction verification
    const randomReceipt = method === 'mpesa' 
      ? `Q${Math.random().toString(36).substring(2, 6).toUpperCase()}89${Math.floor(100 + Math.random() * 900)}K`
      : `CARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const paymentData = {
      method: method as 'mpesa' | 'card',
      status: 'completed' as const,
      mpesaReceipt: randomReceipt,
      mpesaPhone: body.mpesaPhone || booking.client.phone,
      cardLast4: body.cardLast4 || (method === 'card' ? '4242' : undefined),
      paidAt: new Date().toISOString(),
      amountKES,
      amountUSD,
    };

    // Auto-generate confirmed itinerary details
    const carrierCode = booking.flightCarrierPreference?.substring(0, 3).toUpperCase() || 'KEN';
    const airlineRef = `${carrierCode}-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    const stayRef = `STAY-${booking.trackingCode.replace('-', '')}`;

    const itineraryData = {
      airlineBookingRef: booking.itinerary?.airlineBookingRef || airlineRef,
      flightDetailsSummary: booking.itinerary?.flightDetailsSummary || 
        `${booking.flightOrigin || 'Nairobi (WIL)'} ➔ ${booking.flightDestination || 'Coast'} | Date: ${booking.flightDate || 'Scheduled'} | ${booking.flightPax} Passenger(s)`,
      baggageAllowance: booking.itinerary?.baggageAllowance || '20kg Checked Baggage + 5kg Hand Luggage',
      departureTerminal: booking.itinerary?.departureTerminal || 'Wilson Airport Terminal 2 / JKIA Terminal 1D',
      stayConfirmationRef: booking.itinerary?.stayConfirmationRef || stayRef,
      stayAddress: booking.itinerary?.stayAddress || `${booking.flightDestination || 'Coastal Sanctuary'}, Kenya`,
      checkInInstructions: booking.itinerary?.checkInInstructions || 'VIP Chauffeur & Concierge Lead will meet you with private transport upon arrival.',
      hostContactPhone: booking.itinerary?.hostContactPhone || '+254 700 000 000 (Concierge Lead)',
      conciergeLeadName: 'Jerry (Private Concierge Director)',
      conciergeLeadPhone: '+254 700 000 000',
      confirmedAt: new Date().toISOString(),
    };

    const updated = updateBooking(params.id, {
      payment: paymentData,
      itinerary: itineraryData,
      status: 'confirmed',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment received successfully and booking confirmed.',
      booking: updated,
      receipt: randomReceipt,
    });
  } catch (error) {
    console.error(`API Error in POST /api/bookings/${params.id}/pay:`, error);
    return NextResponse.json({ success: false, message: 'Payment processing failed' }, { status: 500 });
  }
}
