import React from 'react';
import { getRoutes } from '@/lib/storage';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import { Plane, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default function RoutesPage() {
  const routes = getRoutes();

  return (
    <div className="py-12 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-semibold">
          <Plane className="w-3.5 h-3.5" />
          <span>Domestic Flight Schedules</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Kenyan Domestic Flight Corridors
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Explore direct connections from Nairobi Wilson (WIL) and Jomo Kenyatta International (NBO) to Kenya’s coastal gems and safari plains.
        </p>
      </div>

      <FeaturedRoutes routes={routes} />

      {/* Private Charter Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-safari-950/60 to-obsidian-900 border border-gold-500/30 text-center space-y-4 shadow-luxury">
          <h3 className="font-serif text-2xl font-bold text-white">
            Need a Private Aircraft Charter?
          </h3>
          <p className="text-xs text-zinc-300 max-w-lg mx-auto">
            For VIP delegations, private safari bush landings, or custom schedule departures on Cessna Grand Caravans or King Airs, our concierge can charter direct flights.
          </p>
          <Link
            href="/request?type=flight_only"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-luxury-gold hover:bg-gold-400 transition-all"
          >
            <span>Request Private Flight Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
