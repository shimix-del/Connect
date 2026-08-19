'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plane, Home as HomeIcon, Sparkles, Calendar, Users, MapPin, 
  Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight,
  AlertCircle, DollarSign, Wine, Car, UtensilsCrossed, PhoneCall, Mail, User
} from 'lucide-react';
import { Route, BnBListing, BookingType } from '@/types';
import { formatKES, formatUSD } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Props {
  initialType?: BookingType;
  initialRouteId?: string;
  initialStayId?: string;
}

export default function BookingWizard({ initialType = 'flight_and_bnb', initialRouteId, initialStayId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookingType, setBookingType] = useState<BookingType>(
    (searchParams.get('type') as BookingType) || initialType
  );

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<{ id: string; trackingCode: string } | null>(null);

  // Catalog data
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stays, setStays] = useState<BnBListing[]>([]);

  // Form State - Flight
  const [flightOrigin, setFlightOrigin] = useState('Nairobi Wilson (WIL)');
  const [flightDestination, setFlightDestination] = useState('Diani Beach / Ukunda (UKA)');
  const [flightDate, setFlightDate] = useState('2026-08-28');
  const [flightReturnDate, setFlightReturnDate] = useState('2026-08-31');
  const [flightIsRoundTrip, setFlightIsRoundTrip] = useState(true);
  const [flightPax, setFlightPax] = useState(2);
  const [flightPreferredTime, setFlightPreferredTime] = useState<'morning' | 'afternoon' | 'sunset' | 'flexible'>('morning');
  const [flightCarrierPreference, setFlightCarrierPreference] = useState('Safarilink');

  // Form State - Stay
  const [selectedStayId, setSelectedStayId] = useState<string>(initialStayId || '');
  const [bnbCustomPreference, setBnbCustomPreference] = useState('');
  const [bnbCheckIn, setBnbCheckIn] = useState('2026-08-28');
  const [bnbCheckOut, setBnbCheckOut] = useState('2026-08-31');
  const [bnbGuests, setBnbGuests] = useState(2);
  const [bnbBudgetTier, setBnbBudgetTier] = useState('Ultra-Luxury VIP');

  // Form State - VIP Add-ons
  const [vipAirportTransfer, setVipAirportTransfer] = useState(true);
  const [privateChefRequest, setPrivateChefRequest] = useState(true);
  const [champagneOnArrival, setChampagneOnArrival] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');

  // Form State - Client
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  useEffect(() => {
    // Fetch routes and stays for autocomplete & selection
    fetch('/api/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      })
      .catch(console.error);

    fetch('/api/stays')
      .then((res) => res.json())
      .then((data) => {
        if (data.stays) {
          setStays(data.stays);
          if (initialStayId) {
            const match = data.stays.find((s: BnBListing) => s.id === initialStayId);
            if (match) setSelectedStayId(match.id);
          }
        }
      })
      .catch(console.error);
  }, [initialStayId]);

  // Handle route selection matching
  const handleRoutePreset = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      setFlightOrigin(`${route.originName} (${route.originCode})`);
      setFlightDestination(`${route.destName} (${route.destCode})`);
      if (route.carriers.length > 0) {
        setFlightCarrierPreference(route.carriers[0]);
      }
    }
  };

  const selectedStay = stays.find((s) => s.id === selectedStayId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim() || !clientPhone.trim()) {
      setError('Please provide your name and WhatsApp phone number so our concierge can reach you.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        bookingType,
        flightOrigin: bookingType !== 'bnb_only' ? flightOrigin : undefined,
        flightDestination: bookingType !== 'bnb_only' ? flightDestination : undefined,
        flightDate: bookingType !== 'bnb_only' ? flightDate : undefined,
        flightReturnDate: bookingType !== 'bnb_only' && flightIsRoundTrip ? flightReturnDate : undefined,
        flightIsRoundTrip: bookingType !== 'bnb_only' ? flightIsRoundTrip : false,
        flightPax: bookingType !== 'bnb_only' ? flightPax : 1,
        flightPreferredTime: bookingType !== 'bnb_only' ? flightPreferredTime : undefined,
        flightCarrierPreference: bookingType !== 'bnb_only' ? flightCarrierPreference : undefined,

        bnbListingId: bookingType !== 'flight_only' && selectedStayId ? selectedStayId : undefined,
        bnbCustomPreference: bookingType !== 'flight_only' ? bnbCustomPreference || selectedStay?.title : undefined,
        bnbCheckIn: bookingType !== 'flight_only' ? bnbCheckIn : undefined,
        bnbCheckOut: bookingType !== 'flight_only' ? bnbCheckOut : undefined,
        bnbGuests: bookingType !== 'flight_only' ? bnbGuests : 1,
        bnbBudgetTier: bookingType !== 'flight_only' ? bnbBudgetTier : undefined,

        vipAirportTransfer,
        privateChefRequest,
        champagneOnArrival,
        specialRequests,

        client: {
          name: clientName.trim(),
          email: clientEmail.trim() || 'guest@aerostay.ke',
          phone: clientPhone.trim(),
        },
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit booking request.');
      }

      // Celebrate
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5921f', '#d5aa32', '#faf8f5', '#10b981'],
      });

      setSuccessBooking({
        id: data.booking.id,
        trackingCode: data.trackingCode,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successBooking) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-obsidian-900/90 rounded-2xl border border-gold-500/30 text-center shadow-luxury">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-gold-400 font-mono font-semibold">
          Request Successfully Received
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-2">
          Your Concierge Ticket is Active
        </h2>
        <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
          Our VIP lead concierge is checking live seat allocations and villa availability with the hosts.
        </p>

        {/* Tracking Code Banner */}
        <div className="mt-6 p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 max-w-md mx-auto">
          <span className="text-xs text-zinc-400 block mb-1">Your Unique Tracking Reference</span>
          <span className="font-mono text-2xl font-bold text-gold-300 tracking-wider">
            {successBooking.trackingCode}
          </span>
          <p className="text-[11px] text-zinc-500 mt-1">
            Keep this code to track your itinerary quote and M-Pesa payment status anytime.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push(`/track/${successBooking.trackingCode}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-semibold text-sm shadow-luxury-gold hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>View Live Tracking Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/254700000000?text=Jambo%20Concierge,%20I%20just%20submitted%20booking%20request%20${successBooking.trackingCode}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-sm font-medium hover:bg-emerald-900/80 transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Notify Concierge on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Type Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-obsidian-900/90 border border-zinc-800 mb-8">
        <button
          type="button"
          onClick={() => setBookingType('flight_and_bnb')}
          className={`py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
            bookingType === 'flight_and_bnb'
              ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-luxury-gold font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-1">
            <Plane className="w-4 h-4" />
            <span>+</span>
            <HomeIcon className="w-4 h-4" />
          </div>
          <span>Flight + Luxury Stay</span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-obsidian-950 font-bold uppercase">
            Recommended
          </span>
        </button>

        <button
          type="button"
          onClick={() => setBookingType('flight_only')}
          className={`py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            bookingType === 'flight_only'
              ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-luxury-gold font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flight Only</span>
        </button>

        <button
          type="button"
          onClick={() => setBookingType('bnb_only')}
          className={`py-3 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            bookingType === 'bnb_only'
              ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 shadow-luxury-gold font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>BnB / Stay Only</span>
        </button>
      </div>

      {/* Main Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Flight Details (if applicable) */}
        {bookingType !== 'bnb_only' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-zinc-800/80 shadow-luxury space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Domestic Flight Details</h3>
                  <p className="text-xs text-zinc-400">Direct connections across Kenya’s best coastal & bush airstrips.</p>
                </div>
              </div>

              {/* Roundtrip Toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className={!flightIsRoundTrip ? 'text-gold-400 font-semibold' : 'text-zinc-500'}>One-Way</span>
                <button
                  type="button"
                  onClick={() => setFlightIsRoundTrip(!flightIsRoundTrip)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    flightIsRoundTrip ? 'bg-gold-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-obsidian-950 transition-transform ${
                      flightIsRoundTrip ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={flightIsRoundTrip ? 'text-gold-400 font-semibold' : 'text-zinc-500'}>Round-Trip</span>
              </div>
            </div>

            {/* Quick Route Buttons */}
            <div>
              <span className="text-xs text-zinc-400 block mb-2 font-medium">Quick Popular Routes:</span>
              <div className="flex flex-wrap gap-2">
                {routes.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoutePreset(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800/70 hover:bg-gold-500/20 hover:text-gold-300 border border-zinc-700/60 hover:border-gold-500/40 text-zinc-300 transition-all"
                  >
                    {r.originCode} ➔ {r.destCode} ({r.destName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Departure Origin</label>
                <div className="relative">
                  <input
                    type="text"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    placeholder="e.g. Nairobi Wilson (WIL) or JKIA (NBO)"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    required
                  />
                  <MapPin className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Destination</label>
                <div className="relative">
                  <input
                    type="text"
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    placeholder="e.g. Diani (UKA), Lamu (LAU), Mara (MRE)"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    required
                  />
                  <MapPin className="w-4 h-4 text-gold-400 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Departure Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                    required
                  />
                </div>
              </div>

              {flightIsRoundTrip && (
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1.5">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={flightReturnDate}
                      onChange={(e) => setFlightReturnDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Passengers</label>
                <div className="relative">
                  <select
                    value={flightPax}
                    onChange={(e) => setFlightPax(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                      <option key={n} value={n} className="bg-obsidian-900">
                        {n} Passenger{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Preferred Flight Timing</label>
                <select
                  value={flightPreferredTime}
                  onChange={(e) => setFlightPreferredTime(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="morning" className="bg-obsidian-900">Morning Departure (07:00 - 11:00 AM)</option>
                  <option value="afternoon" className="bg-obsidian-900">Afternoon Departure (12:00 - 15:30 PM)</option>
                  <option value="sunset" className="bg-obsidian-900">Late Afternoon / Sunset (16:00 - 18:00 PM)</option>
                  <option value="flexible" className="bg-obsidian-900">Any Best Scheduled Rate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Preferred Air Carrier</label>
                <select
                  value={flightCarrierPreference}
                  onChange={(e) => setFlightCarrierPreference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Safarilink" className="bg-obsidian-900">Safarilink (Wilson Direct)</option>
                  <option value="Skyward Express" className="bg-obsidian-900">Skyward Express</option>
                  <option value="Kenya Airways" className="bg-obsidian-900">Kenya Airways (Pride of Africa)</option>
                  <option value="Jambojet" className="bg-obsidian-900">Jambojet</option>
                  <option value="AirKenya" className="bg-obsidian-900">AirKenya Express</option>
                  <option value="Best Available VIP" className="bg-obsidian-900">Concierge Pick (Fastest / Best Comfort)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: BnB & Stay Preferences (if applicable) */}
        {bookingType !== 'flight_only' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-zinc-800/80 shadow-luxury space-y-6">
            <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <HomeIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Curated BnB / Luxury Stay</h3>
                <p className="text-xs text-zinc-400">Handpicked beachfront villas, Swahili mansions, and private safari suites.</p>
              </div>
            </div>

            {/* Curated Stay Select */}
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-2">
                Select from Vetted Partner Properties (or leave blank for bespoke sourcing)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stays.map((stay) => {
                  const isSelected = selectedStayId === stay.id;
                  return (
                    <div
                      key={stay.id}
                      onClick={() => setSelectedStayId(isSelected ? '' : stay.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-gold-500/10 border-gold-500 shadow-luxury-gold'
                          : 'bg-obsidian-950/70 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 relative">
                        {stay.photos?.[0] ? (
                          <img
                            src={stay.photos[0]}
                            alt={stay.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HomeIcon className="w-6 h-6 text-zinc-600 m-auto mt-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{stay.title}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 ml-1" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{stay.location}</p>
                        <p className="text-[11px] text-gold-300 font-semibold mt-1">
                          {formatKES(stay.pricePerNightKES)} <span className="text-zinc-500 font-normal">/ night</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Preference input */}
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Custom Stay Preference / Location Requirements
              </label>
              <textarea
                rows={2}
                value={bnbCustomPreference}
                onChange={(e) => setBnbCustomPreference(e.target.value)}
                placeholder="e.g. 4-bedroom oceanfront villa in Diani with private chef and Starlink WiFi, or Shela Lamu rooftop mansion."
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Check-in Date</label>
                <input
                  type="date"
                  value={bnbCheckIn}
                  onChange={(e) => setBnbCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Check-out Date</label>
                <input
                  type="date"
                  value={bnbCheckOut}
                  onChange={(e) => setBnbCheckOut(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">Number of Guests</label>
                <select
                  value={bnbGuests}
                  onChange={(e) => setBnbGuests(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((n) => (
                    <option key={n} value={n} className="bg-obsidian-900">
                      {n} Guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: VIP Concierge Add-ons */}
        <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-zinc-800/80 shadow-luxury space-y-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Concierge VIP Touches</h3>
              <p className="text-xs text-zinc-400">Complimentary arrangement coordination for our high-end guests.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
              vipAirportTransfer ? 'bg-gold-500/10 border-gold-500/50' : 'bg-obsidian-950/60 border-zinc-800'
            }`}>
              <input
                type="checkbox"
                checked={vipAirportTransfer}
                onChange={(e) => setVipAirportTransfer(e.target.checked)}
                className="rounded accent-gold-500 w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-gold-400" />
                  <span>Airstrip Transfer</span>
                </p>
                <p className="text-zinc-400 text-[11px]">Chauffeured vehicle / Dhow</p>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
              privateChefRequest ? 'bg-gold-500/10 border-gold-500/50' : 'bg-obsidian-950/60 border-zinc-800'
            }`}>
              <input
                type="checkbox"
                checked={privateChefRequest}
                onChange={(e) => setPrivateChefRequest(e.target.checked)}
                className="rounded accent-gold-500 w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-gold-400" />
                  <span>Private Chef</span>
                </p>
                <p className="text-zinc-400 text-[11px]">Coastal seafood & Swahili menu</p>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
              champagneOnArrival ? 'bg-gold-500/10 border-gold-500/50' : 'bg-obsidian-950/60 border-zinc-800'
            }`}>
              <input
                type="checkbox"
                checked={champagneOnArrival}
                onChange={(e) => setChampagneOnArrival(e.target.checked)}
                className="rounded accent-gold-500 w-4 h-4"
              />
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-gold-400" />
                  <span>Welcome Champagne</span>
                </p>
                <p className="text-zinc-400 text-[11px]">Chilled Moët / Veuve Clicquot</p>
              </div>
            </label>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Special Occasion / Dietary / Flight Notes
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Birthday anniversary celebration, extra luggage for golf clubs, vegetarian meals."
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Section 4: Client Contact Details */}
        <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-zinc-800/80 shadow-luxury space-y-6">
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Your Contact Details</h3>
              <p className="text-xs text-zinc-400">We send your verified itemized quote and tracking link directly to your WhatsApp.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Marcus Vance or Wanjiku Mugo"
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">WhatsApp Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@luxury.co.ke"
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Bar */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-600 text-obsidian-950 font-bold text-base shadow-luxury-gold hover:opacity-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting Request to Concierge Desk...</span>
            ) : (
              <>
                <span>Submit Bespoke Booking Request</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-zinc-500 mt-2.5">
            🔒 No immediate charge. Our concierge checks airline seats & villa dates, then dispatches your itemized quote.
          </p>
        </div>
      </form>
    </div>
  );
}
