import { NextRequest, NextResponse } from 'next/server';
import { getBookingByIdOrCode, updateBooking } from '@/lib/storage';
import { generateWhatsAppLink, formatKES, formatUSD } from '@/lib/utils';

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
    const flightPrice = Number(body.flightPriceKES) || 0;
    const bnbPrice = Number(body.bnbPriceKES) || 0;
    const conciergeFee = Number(body.conciergeFeeKES) || 0;
    const totalKES = flightPrice + bnbPrice + conciergeFee;
    const totalUSD = Math.round(totalKES / 130);

    const validHours = Number(body.validHours) || 48;
    const expiresAt = new Date(Date.now() + validHours * 60 * 60 * 1000).toISOString();

    const quoteData = {
      id: `quote-${Date.now()}`,
      flightPriceKES: flightPrice,
      bnbPriceKES: bnbPrice,
      conciergeFeeKES: conciergeFee,
      totalPriceKES: totalKES,
      totalPriceUSD: totalUSD,
      quotedAirline: body.quotedAirline || 'Airlines Confirmed',
      quotedStayName: body.quotedStayName || 'Luxury Stay Confirmed',
      quoteNotes: body.quoteNotes || 'Verified real-time seat and villa availability.',
      validUntil: expiresAt,
      sentAt: new Date().toISOString(),
    };

    const updated = updateBooking(params.id, {
      quote: quoteData,
      status: 'quoted',
      adminNotes: body.adminNotes || booking.adminNotes,
    });

    // Prepare personalized luxury WhatsApp concierge notification
    const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://safari-concierge.ke';
    const trackingLink = `${siteBaseUrl}/track/${booking.trackingCode}`;
    const waMessage = `Jambo ${booking.client.name.split(' ')[0]}!\n\nYour bespoke Kenyan itinerary quote (${booking.trackingCode}) is ready for review:\n\n✈️ Flight: ${body.quotedAirline || 'Domestic Route'}\n🏨 Stay: ${body.quotedStayName || 'Curated Villa'}\n💎 Total: ${formatKES(totalKES)} (${formatUSD(totalUSD)})\n\nView your itemized itinerary & lock in your reservation here:\n👉 ${trackingLink}\n\n*Note:* Airline seats & villa dates are held for ${validHours} hours.\n\nWarm regards,\nJerry | Lead Concierge`;

    const whatsappUrl = generateWhatsAppLink(booking.client.phone, waMessage);

    return NextResponse.json({
      success: true,
      message: 'Quote created and status updated to Quoted.',
      booking: updated,
      whatsappUrl,
      waMessage,
    });
  } catch (error) {
    console.error(`API Error in POST /api/bookings/${params.id}/quote:`, error);
    return NextResponse.json({ success: false, message: 'Failed to process quote' }, { status: 500 });
  }
}
