'use client';

import React from 'react';
import { BookingRequest } from '@/types';
import { Plane, Home as HomeIcon, ShieldCheck, Printer, PhoneCall, QrCode, Sparkles, MapPin, Clock, Calendar, CheckCircle2, User, Luggage } from 'lucide-react';
import { formatKES, formatUSD } from '@/lib/utils';

interface Props {
  booking: BookingRequest;
}

export default function PrintableItinerary({ booking }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const itinerary = booking.itinerary || {
    airlineBookingRef: `KEN-${Math.floor(1000 + Math.random() * 9000)}-VIP`,
    flightDetailsSummary: `${booking.flightOrigin || 'Nairobi Wilson'} ➔ ${booking.flightDestination || 'Destination'}`,
    baggageAllowance: '20kg checked + 5kg cabin per passenger',
    departureTerminal: 'Wilson Airport Terminal 2 / JKIA Terminal 1D',
    stayConfirmationRef: `STAY-${booking.trackingCode}`,
    stayAddress: `${booking.flightDestination || 'Coastal / Safari'}, Kenya`,
    checkInInstructions: 'Host will personally welcome you at the entrance with refreshing madafu / sparkling wine.',
    hostContactPhone: '+254 700 000 000',
    conciergeLeadName: 'Jerry (Head Concierge)',
    conciergeLeadPhone: '+254 700 000 000',
  };

  return (
    <div className="space-y-6">
      {/* Top Bar for Actions (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-obsidian-900 border border-gold-500/30 no-print">
        <div className="flex items-center gap-2 text-gold-300 text-xs">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Official Confirmed Travel Document & Voucher</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-luxury-gold hover:bg-gold-400 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>
          <a
            href={`https://wa.me/254700000000?text=Jambo%20Concierge,%20I%20have%20a%20question%20regarding%20my%20confirmed%20itinerary%20${booking.trackingCode}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Concierge Hotline</span>
          </a>
        </div>
      </div>

      {/* Main Boarding Pass & Stay Voucher Layout */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111823] to-[#0d131c] border-2 border-gold-500/30 text-white shadow-2xl space-y-8 relative overflow-hidden font-sans">
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500/[0.03] font-serif text-[160px] select-none pointer-events-none font-bold">
          KENYA
        </div>

        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-500/20 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white">
                AERO & STAY
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold-500 text-obsidian-950 font-bold tracking-widest">
                VIP ITINERARY
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Private Air & Luxury Accommodation Concierge Reservation
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-mono">
                Booking Reference
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-gold-300 tracking-wider">
                {booking.trackingCode}
              </span>
              <div className="flex items-center justify-end gap-1.5 text-[11px] text-emerald-400 font-medium mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed & Locked</span>
              </div>
            </div>

            {/* QR Mock */}
            <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-lg">
              <QrCode className="w-full h-full text-obsidian-950" />
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-obsidian-950/80 border border-zinc-800/80">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">Lead Passenger / Guest</span>
            <p className="text-sm font-bold text-white mt-0.5">{booking.client.name}</p>
            <p className="text-xs text-zinc-400 font-mono">{booking.client.phone}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">Party Size</span>
            <p className="text-sm font-bold text-white mt-0.5">
              {booking.flightPax} Passenger(s) • {booking.bnbGuests || booking.flightPax} Guest(s)
            </p>
            <p className="text-xs text-zinc-400">VIP Concierge Escort Included</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">Payment Verification</span>
            <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {booking.payment?.mpesaReceipt ? `M-PESA ${booking.payment.mpesaReceipt}` : 'Paid in Full'}
            </p>
            <p className="text-xs text-zinc-400">
              Amount: {formatKES(booking.payment?.amountKES || booking.quote?.totalPriceKES || 0)}
            </p>
          </div>
        </div>

        {/* Flight Segment (if booked) */}
        {booking.bookingType !== 'bnb_only' && (
          <div className="rounded-2xl bg-obsidian-950/90 border border-gold-500/20 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-mono">
                <Plane className="w-4 h-4" />
                <span>Segment 1: Domestic Flight Confirmation</span>
              </div>
              <div className="text-xs font-mono text-gold-300 font-bold bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/30">
                PNR / TICKET REF: {itinerary.airlineBookingRef}
              </div>
            </div>

            {/* Flight Route Visual */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              <div className="text-center sm:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {booking.flightOrigin?.includes('(') 
                    ? booking.flightOrigin.split('(')[1].replace(')', '') 
                    : 'WIL'}
                </span>
                <p className="text-xs text-zinc-400 font-medium">{booking.flightOrigin || 'Nairobi Wilson'}</p>
                <p className="text-[11px] text-gold-400/80 font-mono mt-0.5">Date: {booking.flightDate}</p>
              </div>

              <div className="flex-1 flex flex-col items-center px-4 w-full">
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest mb-1">
                  {booking.flightCarrierPreference || 'Scheduled Operator'}
                </span>
                <div className="w-full flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
                  <div className="flex-1 border-t-2 border-dashed border-gold-500/40 relative">
                    <Plane className="w-4 h-4 text-gold-400 absolute left-1/2 -top-2.5 -translate-x-1/2 rotate-90" />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
                </div>
                <span className="text-[10px] text-emerald-400 mt-1">Direct Flight Connection</span>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {booking.flightDestination?.includes('(') 
                    ? booking.flightDestination.split('(')[1].replace(')', '') 
                    : 'UKA'}
                </span>
                <p className="text-xs text-zinc-400 font-medium">{booking.flightDestination || 'Diani Beach / Ukunda'}</p>
                {booking.flightIsRoundTrip && (
                  <p className="text-[11px] text-gold-400/80 font-mono mt-0.5">Return: {booking.flightReturnDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-300">Terminal:</strong> {itinerary.departureTerminal}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Luggage className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-300">Luggage Allowance:</strong> {itinerary.baggageAllowance}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accommodation Segment (if booked) */}
        {booking.bookingType !== 'flight_only' && (
          <div className="rounded-2xl bg-obsidian-950/90 border border-gold-500/20 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider font-mono">
                <HomeIcon className="w-4 h-4" />
                <span>Segment 2: Luxury Stay / Villa Voucher</span>
              </div>
              <div className="text-xs font-mono text-gold-300 font-bold bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/30">
                STAY VOUCHER: {itinerary.stayConfirmationRef}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white">
                {booking.quote?.quotedStayName || booking.bnbCustomPreference || 'Curated Beachfront Villa'}
              </h4>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>{itinerary.stayAddress}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-obsidian-900/60 border border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-400 block font-medium">Check-in Window</span>
                <span className="font-semibold text-white">{booking.bnbCheckIn || 'Day 1'} (From 14:00 PM)</span>
              </div>
              <div>
                <span className="text-zinc-400 block font-medium">Check-out</span>
                <span className="font-semibold text-white">{booking.bnbCheckOut || 'Final Day'} (Until 11:00 AM)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-safari-950/40 border border-safari-800/40 text-xs text-zinc-300 space-y-1">
              <strong className="text-gold-300 block">Arrival & Host Instructions:</strong>
              <p className="leading-relaxed">{itinerary.checkInInstructions}</p>
              <p className="text-zinc-400 pt-1">
                Property Host Contact: <strong className="text-white">{itinerary.hostContactPhone}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Concierge Assistance Footer on Voucher */}
        <div className="border-t border-gold-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated Concierge Lead: <strong className="text-white">{itinerary.conciergeLeadName}</strong></span>
          </div>
          <div>
            <span>Direct WhatsApp: <strong className="text-gold-300">{itinerary.conciergeLeadPhone}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
