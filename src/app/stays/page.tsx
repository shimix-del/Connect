import React from 'react';
import { getStays } from '@/lib/storage';
import FeaturedStays from '@/components/FeaturedStays';
import { Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default function StaysPage() {
  const stays = getStays();

  return (
    <div className="py-12 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vetted Kenyan Residences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
          Curated Stays & Private Villas
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Every stay has been personally vetted by our concierge team for privacy, private chef services, reliable high-speed internet, and seamless airport coordination.
        </p>
      </div>

      <FeaturedStays stays={stays} />

      {/* Custom Stay Sourcing Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-safari-950/60 to-obsidian-900 border border-gold-500/30 text-center space-y-4 shadow-luxury">
          <h3 className="font-serif text-2xl font-bold text-white">
            Have a Specific Villa or Boutique Lodge in Mind?
          </h3>
          <p className="text-xs text-zinc-300 max-w-lg mx-auto">
            If your desired residence isn't listed above, let us know in your request. We negotiate and coordinate directly with property managers across Kenya.
          </p>
          <Link
            href="/request?type=bnb_only"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-luxury-gold hover:bg-gold-400 transition-all"
          >
            <span>Request Custom Stay Sourcing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
