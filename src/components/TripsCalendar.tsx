'use client';

import React, { useState } from 'react';
import { BookingRequest } from '@/types';
import { Calendar as CalendarIcon, Plane, Home as HomeIcon, ChevronLeft, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import { formatKES } from '@/lib/utils';

interface Props {
  bookings: BookingRequest[];
  onSelectBooking: (booking: BookingRequest) => void;
}

export default function TripsCalendar({ bookings, onSelectBooking }: Props) {
  // Simple monthly calendar view (Default August/September 2026)
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 is August 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return bookings.filter((b) => {
      const flightMatch = b.flightDate === formattedDate || b.flightReturnDate === formattedDate;
      const bnbMatch = b.bnbCheckIn === formattedDate || b.bnbCheckOut === formattedDate;
      return flightMatch || bnbMatch;
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-obsidian-900 border border-zinc-800 shadow-luxury space-y-6">
      {/* Calendar Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-mono font-semibold uppercase">
            <CalendarIcon className="w-4 h-4" />
            <span>Operational Schedule</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white mt-0.5">
            Flight Departures & Stay Check-ins
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm font-bold text-white px-3 min-w-[140px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-zinc-500 uppercase">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="min-h-[90px] rounded-xl bg-obsidian-950/30 border border-zinc-900" />
        ))}

        {days.map((day) => {
          const events = getEventsForDay(day);
          const hasEvents = events.length > 0;

          return (
            <div
              key={`day-${day}`}
              className={`min-h-[95px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                hasEvents
                  ? 'bg-obsidian-950 border-gold-500/30 shadow-sm'
                  : 'bg-obsidian-950/60 border-zinc-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${hasEvents ? 'text-gold-300' : 'text-zinc-500'}`}>
                  {day}
                </span>
                {hasEvents && (
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                )}
              </div>

              <div className="space-y-1 mt-1">
                {events.slice(0, 2).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => onSelectBooking(ev)}
                    className="w-full text-left p-1 rounded bg-zinc-800/90 hover:bg-gold-500/20 border border-zinc-700/60 hover:border-gold-500/40 text-[10px] text-zinc-200 truncate transition-colors flex items-center gap-1"
                  >
                    <Plane className="w-3 h-3 text-gold-400 shrink-0" />
                    <span className="truncate font-medium">{ev.client.name.split(' ')[0]} ({ev.flightDestination?.split(' ')[0] || 'Stay'})</span>
                  </button>
                ))}
                {events.length > 2 && (
                  <span className="text-[9px] text-zinc-500 font-mono block text-center">
                    +{events.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
