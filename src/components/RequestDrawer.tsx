'use client';

import React, { useState } from 'react';
import { BookingRequest, BookingStatus } from '@/types';
import { 
  X, Plane, Home as HomeIcon, CheckCircle2, AlertCircle, 
  Send, PhoneCall, DollarSign, Calendar, Users, MapPin, 
  Sparkles, ShieldCheck, Clock, ExternalLink, Save, Luggage, QrCode
} from 'lucide-react';
import { formatKES, formatUSD, getStatusBadge, generateWhatsAppLink } from '@/lib/utils';
import { quoteBookingApi, updateBookingApi } from '@/lib/apiClient';

interface Props {
  booking: BookingRequest;
  onClose: () => void;
  onUpdate: (updated: BookingRequest) => void;
}

export default function RequestDrawer({ booking, onClose, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<'quote' | 'itinerary' | 'details'>('quote');
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Quoting Form State
  const [flightPriceKES, setFlightPriceKES] = useState(booking.quote?.flightPriceKES || 0);
  const [bnbPriceKES, setBnbPriceKES] = useState(booking.quote?.bnbPriceKES || 0);
  const [conciergeFeeKES, setConciergeFeeKES] = useState(booking.quote?.conciergeFeeKES || 10000);
  const [quotedAirline, setQuotedAirline] = useState(
    booking.quote?.quotedAirline || (booking.flightCarrierPreference ? `${booking.flightCarrierPreference} (Confirmed)` : 'Safarilink / Jambojet')
  );
  const [quotedStayName, setQuotedStayName] = useState(
    booking.quote?.quotedStayName || booking.bnbCustomPreference || 'Curated Beachfront Villa'
  );
  const [quoteNotes, setQuoteNotes] = useState(
    booking.quote?.quoteNotes || 'Verified real-time availability with airline desk and villa management.'
  );
  const [validHours, setValidHours] = useState(48);

  // Itinerary Form State
  const [airlineRef, setAirlineRef] = useState(
    booking.itinerary?.airlineBookingRef || `KQ-${Math.floor(1000 + Math.random() * 9000)}-VIP`
  );
  const [stayRef, setStayRef] = useState(
    booking.itinerary?.stayConfirmationRef || `STAY-${booking.trackingCode.replace('-', '')}`
  );
  const [terminal, setTerminal] = useState(
    booking.itinerary?.departureTerminal || 'Wilson Airport Terminal 2 (Skyward / Safarilink Lounge)'
  );
  const [baggage, setBaggage] = useState(
    booking.itinerary?.baggageAllowance || '20kg Checked Baggage + 5kg Hand Luggage per person'
  );
  const [hostPhone, setHostPhone] = useState(
    booking.itinerary?.hostContactPhone || '+254 700 000 000'
  );
  const [checkInGuide, setCheckInGuide] = useState(
    booking.itinerary?.checkInInstructions || 'VIP Chauffeur will meet you at the airstrip exit holding a personalized name board.'
  );

  const totalKES = Number(flightPriceKES) + Number(bnbPriceKES) + Number(conciergeFeeKES);
  const totalUSD = Math.round(totalKES / 130);

  // Handle Quote Dispatch
  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotificationMsg('');

    try {
      const data = await quoteBookingApi(booking.id, {
        flightPriceKES: Number(flightPriceKES),
        bnbPriceKES: Number(bnbPriceKES),
        conciergeFeeKES: Number(conciergeFeeKES),
        totalPriceKES: totalKES,
        totalPriceUSD: totalUSD,
        quotedAirline,
        quotedStayName,
        quoteNotes,
        validUntil: new Date(Date.now() + validHours * 3600000).toISOString(),
        sentAt: new Date().toISOString(),
      });

      if (!data.success || !data.booking) {
        throw new Error('Failed to dispatch quote.');
      }

      onUpdate(data.booking);
      setStatus('quoted');
      setNotificationMsg('Quote generated successfully! Status is now Quoted.');
    } catch (err: any) {
      alert(err.message || 'Error creating quote.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Itinerary Update & Confirmation
  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotificationMsg('');

    try {
      const data = await updateBookingApi(booking.id, {
        status: 'confirmed',
        adminNotes,
        itinerary: {
          airlineBookingRef: airlineRef,
          flightDetailsSummary: `${booking.flightOrigin || 'NBO'} ➔ ${booking.flightDestination || 'Stay'}`,
          departureTerminal: terminal,
          baggageAllowance: baggage,
          stayConfirmationRef: stayRef,
          stayAddress: `${booking.flightDestination || 'Coast'}, Kenya`,
          checkInInstructions: checkInGuide,
          hostContactPhone: hostPhone,
          conciergeLeadName: 'Jerry (Head Concierge)',
          conciergeLeadPhone: '+254 700 000 000',
          confirmedAt: new Date().toISOString(),
        },
      });

      if (!data.success || !data.booking) {
        throw new Error('Failed to save itinerary.');
      }

      onUpdate(data.booking);
      setStatus('confirmed');
      setNotificationMsg('Itinerary details locked & booking marked as Confirmed!');
    } catch (err: any) {
      alert(err.message || 'Error updating itinerary.');
    } finally {
      setSaving(false);
    }
  };

  // Quick Status Change
  const handleStatusChange = async (newStatus: BookingStatus) => {
    setSaving(true);
    try {
      const data = await updateBookingApi(booking.id, { status: newStatus, adminNotes });
      if (data.success && data.booking) {
        setStatus(newStatus);
        onUpdate(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Pre-formatted WhatsApp Message Link
  const trackingUrl = typeof window !== 'undefined' ? `${window.location.origin}/track/${booking.trackingCode}` : `/track/${booking.trackingCode}`;
  const whatsappQuoteMsg = `Jambo ${booking.client.name.split(' ')[0]}!\n\nYour bespoke itinerary quote (${booking.trackingCode}) is ready:\n\n✈️ Flight: ${quotedAirline}\n🏨 Stay: ${quotedStayName}\n💎 Total: ${formatKES(totalKES)} (${formatUSD(totalUSD)})\n\nView full itinerary & reserve via M-Pesa / Card:\n👉 ${trackingUrl}\n\nWarm regards,\nJerry | AeroStay Concierge`;
  const whatsappUrl = generateWhatsAppLink(booking.client.phone, whatsappQuoteMsg);

  const badge = getStatusBadge(status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-obsidian-900 border-l border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-obsidian-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl font-bold text-gold-300">
                {booking.trackingCode}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Client: <strong className="text-white">{booking.client.name}</strong> • Phone: <span className="font-mono text-zinc-300">{booking.client.phone}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/track/${booking.trackingCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1"
              title="Open Client Portal View"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-obsidian-900/60 px-6">
          <button
            onClick={() => setActiveTab('quote')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quote'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Quoting Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'itinerary'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Itinerary & PNR</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client & Trip Spec</span>
          </button>
        </div>

        {/* Notification Toast Banner */}
        {notificationMsg && (
          <div className="p-3 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {notificationMsg}
            </span>
            <button onClick={() => setNotificationMsg('')} className="text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Quick Status Override:</span>
            <div className="flex items-center gap-1.5">
              {(['pending_review', 'quoted', 'payment_pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`text-[10px] px-2 py-1 rounded font-mono transition-all ${
                    status === st
                      ? 'bg-gold-500 text-obsidian-950 font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: QUOTING ENGINE */}
          {activeTab === 'quote' && (
            <form onSubmit={handleSaveQuote} className="space-y-6">
              <div className="p-4 rounded-xl bg-safari-950/40 border border-safari-800/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Human-in-the-Loop Itemized Quote</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Enter verified airline seat fares and direct BnB rates. The system computes total KES/USD and pre-configures M-Pesa Lipa payment links.
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Flight Total (KES)</label>
                  <input
                    type="number"
                    value={flightPriceKES}
                    onChange={(e) => setFlightPriceKES(Number(e.target.value))}
                    placeholder="e.g. 54000"
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:border-gold-500"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">Airlines direct</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Stay / Villa Total (KES)</label>
                  <input
                    type="number"
                    value={bnbPriceKES}
                    onChange={(e) => setBnbPriceKES(Number(e.target.value))}
                    placeholder="e.g. 195000"
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:border-gold-500"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">Property direct</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Concierge Fee (KES)</label>
                  <input
                    type="number"
                    value={conciergeFeeKES}
                    onChange={(e) => setConciergeFeeKES(Number(e.target.value))}
                    placeholder="e.g. 15000"
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:border-gold-500"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">Your margin</span>
                </div>
              </div>

              {/* Combined Total Display */}
              <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-mono">Combined Package Quote</span>
                  <div className="text-2xl font-bold text-gold-300 font-mono">
                    {formatKES(totalKES)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500 uppercase font-mono">USD Approx</span>
                  <div className="text-lg font-bold text-white font-mono">
                    {formatUSD(totalUSD)}
                  </div>
                </div>
              </div>

              {/* Text descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Quoted Flight Schedule & Operator</label>
                  <input
                    type="text"
                    value={quotedAirline}
                    onChange={(e) => setQuotedAirline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Quoted Stay Title & Package</label>
                  <input
                    type="text"
                    value={quotedStayName}
                    onChange={(e) => setQuotedStayName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Quote Inclusions & Notes for Client</label>
                  <textarea
                    rows={2}
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Quote Validity Hold (Hours)</label>
                    <select
                      value={validHours}
                      onChange={(e) => setValidHours(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm"
                    >
                      <option value={24}>24 Hours Hold</option>
                      <option value={48}>48 Hours Hold (Standard)</option>
                      <option value={72}>72 Hours Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Internal Admin Notes</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Spoke with Capt Tariq for villa"
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold text-sm shadow-luxury-gold hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Quote...' : 'Save & Dispatch Quote'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-semibold text-xs hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </form>
          )}

          {/* TAB 2: ITINERARY & PNR */}
          {activeTab === 'itinerary' && (
            <form onSubmit={handleSaveItinerary} className="space-y-6">
              <div className="p-4 rounded-xl bg-safari-950/40 border border-safari-800/50 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  <span>Confirmed Itinerary & Ticket Issuer</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Input final PNR and stay voucher code. Saving will unlock the official luxury boarding pass and stay voucher for the client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Airline PNR / E-Ticket Ref</label>
                  <input
                    type="text"
                    value={airlineRef}
                    onChange={(e) => setAirlineRef(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:border-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Stay Voucher Code</label>
                  <input
                    type="text"
                    value={stayRef}
                    onChange={(e) => setStayRef(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:border-gold-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Departure Terminal</label>
                  <input
                    type="text"
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Baggage Allowance</label>
                  <input
                    type="text"
                    value={baggage}
                    onChange={(e) => setBaggage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Host / Property Emergency Contact</label>
                  <input
                    type="text"
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Check-in & Airstrip Meet Instructions</label>
                  <textarea
                    rows={2}
                    value={checkInGuide}
                    onChange={(e) => setCheckInGuide(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm focus:border-gold-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-obsidian-950 font-bold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{saving ? 'Locking Itinerary...' : 'Save & Issue Final Confirmed Itinerary'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: CLIENT & TRIP DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-xs">
              {/* Client Card */}
              <div className="p-4 rounded-xl bg-obsidian-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono text-gold-400 uppercase font-semibold">Client Profile</span>
                <h4 className="text-sm font-bold text-white">{booking.client.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-zinc-300 pt-1">
                  <div>Phone: <span className="font-mono text-white">{booking.client.phone}</span></div>
                  <div>Email: <span className="text-white">{booking.client.email}</span></div>
                  <div>VIP Status: <span className="uppercase text-gold-400 font-bold">{booking.client.vipTier || 'Standard'}</span></div>
                  <div>Client Since: <span>{new Date(booking.client.createdAt).toLocaleDateString()}</span></div>
                </div>
                {booking.client.notes && (
                  <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded mt-2">
                    CRM Note: {booking.client.notes}
                  </p>
                )}
              </div>

              {/* Flight Requirement Spec */}
              {booking.bookingType !== 'bnb_only' && (
                <div className="p-4 rounded-xl bg-obsidian-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-gold-400 uppercase font-semibold">Requested Flight Spec</span>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>Route: <strong className="text-white">{booking.flightOrigin} ➔ {booking.flightDestination}</strong></div>
                    <div>Dates: <strong className="text-white">{booking.flightDate} {booking.flightIsRoundTrip ? `to ${booking.flightReturnDate}` : '(One-Way)'}</strong></div>
                    <div>Passengers: <strong className="text-white">{booking.flightPax}</strong></div>
                    <div>Preferred Window: <strong className="text-white capitalize">{booking.flightPreferredTime}</strong></div>
                    <div>Preferred Airline: <strong className="text-white">{booking.flightCarrierPreference || 'Any'}</strong></div>
                  </div>
                </div>
              )}

              {/* Stay Requirement Spec */}
              {booking.bookingType !== 'flight_only' && (
                <div className="p-4 rounded-xl bg-obsidian-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-gold-400 uppercase font-semibold">Requested Stay Spec</span>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>Property Preference: <strong className="text-white">{booking.bnbCustomPreference || 'Selected from catalogue'}</strong></div>
                    <div>Dates: <strong className="text-white">{booking.bnbCheckIn} to {booking.bnbCheckOut}</strong></div>
                    <div>Guests: <strong className="text-white">{booking.bnbGuests}</strong></div>
                    <div>Budget Tier: <strong className="text-white">{booking.bnbBudgetTier || 'Luxury'}</strong></div>
                  </div>
                </div>
              )}

              {/* VIP Add-ons */}
              <div className="p-4 rounded-xl bg-obsidian-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono text-gold-400 uppercase font-semibold">Requested Concierge Add-ons</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {booking.vipAirportTransfer && (
                    <span className="px-2 py-1 rounded bg-gold-500/10 text-gold-300 border border-gold-500/20">
                      ✓ Airstrip Transfer Required
                    </span>
                  )}
                  {booking.privateChefRequest && (
                    <span className="px-2 py-1 rounded bg-gold-500/10 text-gold-300 border border-gold-500/20">
                      ✓ Private Chef Required
                    </span>
                  )}
                  {booking.champagneOnArrival && (
                    <span className="px-2 py-1 rounded bg-gold-500/10 text-gold-300 border border-gold-500/20">
                      ✓ Welcome Champagne Required
                    </span>
                  )}
                </div>
                {booking.specialRequests && (
                  <p className="text-zinc-300 pt-2">
                    Special notes: <span className="text-white italic">"{booking.specialRequests}"</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
