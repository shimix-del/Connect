'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import TripsCalendar from '@/components/TripsCalendar';
import RequestDrawer from '@/components/RequestDrawer';
import { BookingRequest } from '@/types';

import { fetchBookings as getBookingsApi } from '@/lib/apiClient';

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  const loadBookings = async () => {
    try {
      const data = await getBookingsApi();
      if (data.data) setBookings(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateBooking = (updated: BookingRequest) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBooking(updated);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-foreground pb-20">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Trip Operations Schedule</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor upcoming air departure slots and villa check-ins/check-outs to prevent double bookings.
          </p>
        </div>

        <TripsCalendar
          bookings={bookings}
          onSelectBooking={(b) => setSelectedBooking(b)}
        />
      </main>

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
