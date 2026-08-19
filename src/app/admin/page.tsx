'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import RequestDrawer from '@/components/RequestDrawer';
import { BookingRequest, BookingStatus, AdminStats } from '@/types';
import { 
  Search, Filter, Plus, Clock, CheckCircle2, DollarSign, 
  Plane, Home as HomeIcon, PhoneCall, ExternalLink, RefreshCw, 
  Sparkles, ArrowRight, UserCheck, AlertCircle, TrendingUp 
} from 'lucide-react';
import { formatKES, formatUSD, getStatusBadge } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/stats'),
      ]);

      const bData = await bookingsRes.json();
      const sData = await statsRes.json();

      if (bData.bookings) setBookings(bData.bookings);
      if (sData.stats) setStats(sData.stats);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleUpdateBooking = (updated: BookingRequest) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBooking(updated);
    fetchData(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      b.trackingCode.toLowerCase().includes(query) ||
      b.client.name.toLowerCase().includes(query) ||
      b.client.phone.includes(query) ||
      b.flightDestination?.toLowerCase().includes(query) ||
      b.bnbCustomPreference?.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const filterTabs = [
    { key: 'all', label: 'All Requests', count: bookings.length },
    { key: 'pending_review', label: 'Pending Review', count: bookings.filter((b) => b.status === 'pending_review').length, highlight: true },
    { key: 'quoted', label: 'Quoted', count: bookings.filter((b) => b.status === 'quoted').length },
    { key: 'payment_pending', label: 'Payment Pending', count: bookings.filter((b) => b.status === 'payment_pending').length },
    { key: 'confirmed', label: 'Confirmed & Locked', count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-foreground pb-20">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono uppercase">Action Required</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {stats.pendingReviewCount}
              </div>
              <span className="text-[11px] text-zinc-500 block">Pending airline & stay quote</span>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono uppercase">Quotes Out</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-sky-300 font-mono">
                {stats.quotedCount}
              </div>
              <span className="text-[11px] text-zinc-500 block">Waiting client checkout</span>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono uppercase">Confirmed Bookings</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-300 font-mono">
                {stats.confirmedCount}
              </div>
              <span className="text-[11px] text-zinc-500 block">Paid in full & tickets locked</span>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-gold-500/30 shadow-luxury space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono uppercase">Gross Processed</span>
                <TrendingUp className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gold-300 font-mono">
                {formatKES(stats.totalRevenueKES)}
              </div>
              <span className="text-[11px] text-zinc-500 block">≈ {formatUSD(stats.totalRevenueUSD)} USD</span>
            </div>
          </div>
        )}

        {/* Requests Management Panel */}
        <div className="p-6 rounded-3xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-6">
          {/* Top Actions & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Booking Requests Pipeline
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Human-in-the-loop coordination desk. Check availability, compose itemized quotes, and confirm PNRs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code, client, phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-zinc-700 transition-colors"
                title="Refresh requests"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              <Link
                href="/request"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 text-xs font-bold shadow-luxury-gold hover:bg-gold-400 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow-sm'
                      : 'bg-obsidian-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-black/20 text-obsidian-950 font-black'
                        : tab.highlight && tab.count > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pipeline Table */}
          {loading ? (
            <div className="py-12 text-center text-xs text-zinc-500">Loading requests pipeline...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-zinc-400 text-sm">No booking requests found matching this filter.</p>
              <button
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                className="text-xs text-gold-400 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-obsidian-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Ref / Created</th>
                    <th className="py-3 px-4">Client & Contact</th>
                    <th className="py-3 px-4">Type & Route</th>
                    <th className="py-3 px-4">Stay / Pax</th>
                    <th className="py-3 px-4">Quote / Value</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredBookings.map((req) => {
                    const badge = getStatusBadge(req.status);
                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedBooking(req)}
                        className="hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                      >
                        {/* Reference */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-white group-hover:text-gold-300 transition-colors">
                            {req.trackingCode}
                          </span>
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-4">
                          <strong className="text-white block">{req.client.name}</strong>
                          <span className="font-mono text-zinc-400 text-[11px]">{req.client.phone}</span>
                        </td>

                        {/* Type & Route */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            {req.bookingType !== 'bnb_only' ? (
                              <>
                                <Plane className="w-3.5 h-3.5 text-gold-400" />
                                <span>{req.flightOrigin?.split(' ')[0] || 'WIL'} ➔ {req.flightDestination?.split(' ')[0] || 'Coast'}</span>
                              </>
                            ) : (
                              <>
                                <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Stay Only</span>
                              </>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400">
                            {req.flightDate || req.bnbCheckIn || 'Flexible Dates'}
                          </span>
                        </td>

                        {/* Stay / Pax */}
                        <td className="py-3.5 px-4">
                          <span className="text-zinc-200 block truncate max-w-[140px]">
                            {req.bnbCustomPreference || 'Curated Stay'}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {req.flightPax} Pax • {req.bnbGuests || req.flightPax} Guests
                          </span>
                        </td>

                        {/* Quote Value */}
                        <td className="py-3.5 px-4 font-mono">
                          {req.quote ? (
                            <div>
                              <strong className="text-gold-300 block">{formatKES(req.quote.totalPriceKES)}</strong>
                              <span className="text-[10px] text-zinc-500">{formatUSD(req.quote.totalPriceUSD)}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Not Quoted</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1.5 ${badge.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                            {badge.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(req);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-gold-500 hover:text-obsidian-950 text-gold-300 font-semibold text-xs transition-colors border border-zinc-700"
                          >
                            <span>Open Ops Desk</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Operations Drawer */}
      {selectedBooking && (
        <RequestDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}
