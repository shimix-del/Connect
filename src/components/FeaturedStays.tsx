'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BnBListing } from '@/types';
import { MapPin, Users, Bed, Bath, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatKES, formatUSD } from '@/lib/utils';

interface Props {
  stays: BnBListing[];
  limit?: number;
}

export default function FeaturedStays({ stays, limit }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'Coast', 'Nairobi', 'Safari / Mara'];

  let filtered = stays.filter((s) => s.active);
  if (selectedRegion !== 'All') {
    filtered = filtered.filter((s) => s.region === selectedRegion);
  }

  const displayedStays = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-mono font-semibold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked & Inspected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white">
              Curated Stays & Private Coastal Villas
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              We do not list hundreds of random properties. Every residence in our portfolio features private chefs, vetted security, high-speed Starlink WiFi, and direct air-strip coordination.
            </p>
          </div>

          {/* Region Filters */}
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedRegion === region
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow-luxury-gold'
                    : 'bg-obsidian-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Stays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStays.map((stay) => (
            <div
              key={stay.id}
              className="luxury-card rounded-2xl overflow-hidden group flex flex-col justify-between"
            >
              {/* Photo & Badge */}
              <div className="relative h-60 w-full overflow-hidden bg-zinc-800">
                <img
                  src={stay.photos[0]}
                  alt={stay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {stay.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold-500/90 backdrop-blur-md text-obsidian-950 text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {stay.badge}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span className="font-medium truncate max-w-[200px]">{stay.location}</span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                    {stay.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {stay.description}
                  </p>

                  {/* Highlights / Amenities */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {stay.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Property Stats & Price */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{stay.bedrooms} Beds</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Up to {stay.maxGuests}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-gold-300 font-mono">
                      {formatKES(stay.pricePerNightKES)}
                    </div>
                    <span className="text-[10px] text-zinc-500">/ night ({formatUSD(stay.pricePerNightUSD)})</span>
                  </div>
                </div>

                {/* Request Stay Button */}
                <Link
                  href={`/request?type=flight_and_bnb&stayId=${stay.id}`}
                  className="w-full py-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 border border-gold-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-luxury-gold"
                >
                  <span>Book with Flight & Stay Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {limit && stays.length > limit && (
          <div className="text-center mt-10">
            <Link
              href="/stays"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian-900 border border-gold-500/40 text-gold-300 hover:text-white hover:bg-gold-500/10 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <span>View Full Curated Stay Portfolio ({stays.length} Properties)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
