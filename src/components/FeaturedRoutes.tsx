'use client';

import React from 'react';
import Link from 'next/link';
import { Route } from '@/types';
import { Plane, Clock, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatKES, formatUSD } from '@/lib/utils';

interface Props {
  routes: Route[];
  limit?: number;
}

export default function FeaturedRoutes({ routes, limit }: Props) {
  const displayed = limit ? routes.slice(0, limit) : routes;

  return (
    <section className="py-12 bg-obsidian-950/60 border-y border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-mono font-semibold uppercase tracking-widest mb-1.5">
              <Plane className="w-3.5 h-3.5" />
              <span>Domestic Air Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white">
              Direct Kenyan Air Corridors
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Fly directly out of Nairobi Wilson (WIL) or JKIA (NBO) straight to pristine coastal airstrips and bush conservancy runways. We handle seat locks and baggage arrangements.
            </p>
          </div>

          <Link
            href="/routes"
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold uppercase tracking-wider self-start md:self-auto"
          >
            <span>View All Schedules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((route) => (
            <div
              key={route.id}
              className="p-5 rounded-2xl bg-obsidian-900/80 border border-zinc-800 hover:border-gold-500/40 transition-all flex flex-col justify-between group space-y-4 shadow-luxury"
            >
              {/* Route Origin & Destination */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    {route.frequency || 'Daily flights'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-gold-300 font-mono">
                    {route.estimatedDuration}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black font-mono text-white">{route.originCode}</span>
                    <p className="text-xs text-zinc-400 truncate max-w-[110px]">{route.originName}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-2">
                    <Plane className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                    <div className="w-full border-t border-dashed border-zinc-700 mt-1" />
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-gold-300">{route.destCode}</span>
                    <p className="text-xs text-zinc-400 truncate max-w-[120px]">{route.destName}</p>
                  </div>
                </div>
              </div>

              {/* Carriers & Pricing */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {route.carriers.map((carrier, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      {carrier}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Indicative fare from</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {formatKES(route.basePriceKES)} <span className="text-xs text-zinc-500 font-normal">({formatUSD(route.basePriceUSD)})</span>
                    </span>
                  </div>

                  <Link
                    href={`/request?type=flight_and_bnb&routeId=${route.id}`}
                    className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Request Route</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
