'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TrackLookupPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter your tracking reference code.');
      return;
    }
    router.push(`/track/${cleanCode}`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-obsidian-900 border border-zinc-800 rounded-3xl p-8 shadow-luxury space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
          <Search className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Live Reservation Status
          </span>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">
            Track Your Concierge Booking
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your reference code (e.g. <strong className="text-gold-300">KEN-8492X</strong>) received upon request submission.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. KEN-8492X"
              className="w-full px-4 py-3.5 rounded-2xl bg-obsidian-950 border border-gold-500/40 text-white font-mono text-center text-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold text-sm shadow-luxury-gold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <span>View Itinerary & Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time flight seat & villa status updates</span>
        </div>
      </div>
    </div>
  );
}
