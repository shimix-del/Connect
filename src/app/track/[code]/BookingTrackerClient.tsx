'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingRequest, BookingStatus } from '@/types';
import { 
  Plane, Home as HomeIcon, CheckCircle2, Clock, 
  CreditCard, Smartphone, PhoneCall, AlertCircle, 
  Sparkles, RefreshCw
} from 'lucide-react';
import { formatKES, formatUSD, getStatusBadge } from '@/lib/utils';
import { fetchBookingByCode } from '@/lib/apiClient';
import MpesaModal from '@/components/MpesaModal';
import CardPaymentModal from '@/components/CardPaymentModal';
import PrintableItinerary from '@/components/PrintableItinerary';

export default function BookingTrackerClient({ code }: { code: string }) {
  const router = useRouter();

  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [showMpesa, setShowMpesa] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const fetchBooking = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const data = await fetchBookingByCode(code);
      if (!data.success || !data.booking) {
        throw new Error(data.message || 'Could not find booking reference.');
      }
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      fetchBooking();
    }
  }, [code, fetchBooking]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooking(true);
  };

  const handlePaymentSuccess = () => {
    setShowMpesa(false);
    setShowCard(false);
    fetchBooking(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase">
          Retrieving reservation status...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-obsidian-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4 shadow-luxury">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-serif">Reservation Reference Not Found</h2>
          <p className="text-xs text-zinc-400">
            We couldn't locate reference <strong className="text-gold-400 font-mono">{code}</strong>. Please check your reference code and try again.
          </p>
          <button
            onClick={() => router.push('/track')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(booking.status);

  const steps: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'pending_review', label: '1. Request Received', desc: 'Concierge checking carrier & villa availability' },
    { key: 'quoted', label: '2. Quote Ready', desc: 'Itemized package pricing dispatched' },
    { key: 'payment_pending', label: '3. Payment Pending', desc: 'M-Pesa or Card checkout initiated' },
    { key: 'confirmed', label: '4. Confirmed & Locked', desc: 'Flight e-tickets & stay vouchers issued' },
    { key: 'completed', label: '5. Completed', desc: 'Trip fulfilled' },
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'pending_review': return 0;
      case 'quoted': return 1;
      case 'payment_pending': return 2;
      case 'confirmed': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(booking.status);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-obsidian-900 border border-zinc-800 shadow-luxury">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-gold-300">
              {booking.trackingCode}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Guest: <strong className="text-white">{booking.client.name}</strong> • Requested on {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>

          <a
            href={`https://wa.me/254700000000?text=Jambo%20Concierge,%20inquiring%20about%20my%20booking%20${booking.trackingCode}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp Lead</span>
          </a>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="p-6 rounded-3xl bg-obsidian-900 border border-zinc-800 shadow-luxury">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-6">
          Live Reservation Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx || booking.status === 'confirmed' || booking.status === 'completed';
            const isCurrent = idx === currentStepIdx && booking.status !== 'confirmed' && booking.status !== 'completed';

            return (
              <div
                key={step.key}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gold-500/10 border-gold-500 shadow-luxury-gold'
                    : isCompleted
                    ? 'bg-obsidian-950/80 border-emerald-500/30 text-zinc-300'
                    : 'bg-obsidian-950/40 border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold font-serif ${isCurrent ? 'text-gold-300' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {step.label}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isCurrent && <Clock className="w-4 h-4 text-gold-400 shrink-0 animate-spin" />}
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE: QUOTE READY & PAYMENT REVIEW */}
      {booking.status === 'quoted' && booking.quote && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-obsidian-900 via-obsidian-900 to-safari-950/40 border-2 border-gold-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-500/20 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-400">
                Verified Concierge Package
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                Your Itinerary Quote is Ready
              </h3>
            </div>

            <div className="text-xs text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30 self-start sm:self-auto font-mono">
              Hold Active (Seats & Dates Reserved)
            </div>
          </div>

          {/* Itemized Quote Card */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {booking.bookingType !== 'bnb_only' && (
                <div className="p-4 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold font-mono uppercase">
                    <Plane className="w-4 h-4" />
                    <span>Domestic Flight Fare</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">{booking.quote.quotedAirline}</p>
                  <div className="text-lg font-bold text-white font-mono pt-1">
                    {formatKES(booking.quote.flightPriceKES)}
                  </div>
                </div>
              )}

              {booking.bookingType !== 'flight_only' && (
                <div className="p-4 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold font-mono uppercase">
                    <HomeIcon className="w-4 h-4" />
                    <span>Vetted Stay / Villa</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">{booking.quote.quotedStayName}</p>
                  <div className="text-lg font-bold text-white font-mono pt-1">
                    {formatKES(booking.quote.bnbPriceKES)}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold font-mono uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Concierge Coordination</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">VIP Ground Escort & Dedicated Lead</p>
                <div className="text-lg font-bold text-white font-mono pt-1">
                  {formatKES(booking.quote.conciergeFeeKES)}
                </div>
              </div>
            </div>

            {/* Total Banner */}
            <div className="p-6 rounded-2xl bg-obsidian-950 border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-zinc-400">Total Combined Package</span>
                <div className="text-3xl font-black text-gold-300 font-mono">
                  {formatKES(booking.quote.totalPriceKES)}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Approx. <strong className="text-white">{formatUSD(booking.quote.totalPriceUSD)}</strong> • Inclusive of all carrier taxes and fees.
                </p>
              </div>

              {/* Payment Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowMpesa(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-obsidian-950 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay with M-PESA STK Push</span>
                </button>

                <button
                  onClick={() => setShowCard(true)}
                  className="px-5 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs sm:text-sm shadow-luxury-gold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Card (USD / KES)</span>
                </button>
              </div>
            </div>

            {booking.quote.quoteNotes && (
              <p className="text-xs text-zinc-400 italic bg-obsidian-950/60 p-3 rounded-xl border border-zinc-800">
                Concierge Note: "{booking.quote.quoteNotes}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* STAGE: CONFIRMED ITINERARY */}
      {(booking.status === 'confirmed' || booking.status === 'completed') && (
        <PrintableItinerary booking={booking} />
      )}

      {/* STAGE: PENDING REVIEW NOTICE */}
      {booking.status === 'pending_review' && (
        <div className="p-8 rounded-3xl bg-obsidian-900 border border-zinc-800 text-center space-y-4 shadow-luxury">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            We Are Verifying Carrier Seats & Villa Dates
          </h3>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Our concierge desk in Nairobi is contacting the airline reservation agents and property host. You will receive an itemized quote on this screen and via WhatsApp shortly.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/254700000000?text=Jambo%20Concierge,%20following%20up%20on%20my%20request%20${booking.trackingCode}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Concierge Desk: +254 700 000 000</span>
            </a>
          </div>
        </div>
      )}

      {/* Trip Spec Card */}
      <div className="p-6 rounded-3xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          Trip Summary & Preferences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Flight Route</span>
            <strong className="text-white block">
              {booking.flightOrigin || 'N/A'} ➔ {booking.flightDestination || 'N/A'}
            </strong>
            <span className="text-zinc-400">
              {booking.flightDate} {booking.flightIsRoundTrip ? `(Ret: ${booking.flightReturnDate})` : ''} • {booking.flightPax} Pax
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Stay Preference</span>
            <strong className="text-white block">
              {booking.bnbCustomPreference || 'Curated Villa'}
            </strong>
            <span className="text-zinc-400">
              {booking.bnbCheckIn} to {booking.bnbCheckOut} • {booking.bnbGuests} Guests
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">VIP Add-ons</span>
            <div className="flex flex-wrap gap-1 text-[10px] text-gold-300">
              {booking.vipAirportTransfer && <span>• Airstrip Chauffeur</span>}
              {booking.privateChefRequest && <span>• Private Chef</span>}
              {booking.champagneOnArrival && <span>• Welcome Moët</span>}
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Modal */}
      {showMpesa && booking.quote && (
        <MpesaModal
          bookingId={booking.id}
          amountKES={booking.quote.totalPriceKES}
          clientPhone={booking.client.phone}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowMpesa(false)}
        />
      )}

      {/* Card Modal */}
      {showCard && booking.quote && (
        <CardPaymentModal
          bookingId={booking.id}
          amountKES={booking.quote.totalPriceKES}
          amountUSD={booking.quote.totalPriceUSD}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowCard(false)}
        />
      )}
    </div>
  );
}
