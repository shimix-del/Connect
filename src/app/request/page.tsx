import React, { Suspense } from 'react';
import BookingWizard from '@/components/BookingWizard';
import { Sparkles, ShieldCheck, PhoneCall } from 'lucide-react';

export default function RequestPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Reservation Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Request Flight & Luxury Stay
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Specify your Kenyan route, travel dates, passenger party, and curated villa preferences. Our concierge team will prepare your verified quote.
        </p>
      </div>

      <div className="p-1 rounded-3xl bg-gradient-to-b from-gold-500/20 via-zinc-800 to-zinc-900 shadow-2xl">
        <div className="bg-obsidian-950/95 rounded-[22px] p-6 sm:p-10 backdrop-blur-xl">
          <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading booking engine...</div>}>
            <BookingWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
