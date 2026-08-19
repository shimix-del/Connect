import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, PhoneCall, Mail, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 border-t border-zinc-800/80 text-zinc-400 text-sm">
      {/* Concierge Highlight Banner */}
      <div className="border-b border-zinc-800/60 bg-gradient-to-r from-obsidian-900 via-safari-950/40 to-obsidian-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">100% Vetted Stays & Certified Carriers</h4>
                <p className="text-xs text-zinc-400">Strictly inspected villas, trusted KCAA-licensed air operators.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">Human-in-the-Loop Concierge</h4>
                <p className="text-xs text-zinc-400">Direct rate negotiation, custom timing, private chauffeur.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">One Seamless Checkout</h4>
                <p className="text-xs text-zinc-400">M-Pesa STK push & international card processing for all-in-one trip.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-safari-700 flex items-center justify-center">
                <Compass className="w-4 h-4 text-obsidian-950 stroke-[2.2]" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-wider">
                AERO & STAY
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kenya’s bespoke flight & luxury BnB concierge. We coordinate your domestic flights and vetted coastal villas or safari retreats into a single flawless itinerary.
            </p>
            <div className="pt-2 text-xs text-gold-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Concierge Desk Live & Active</span>
            </div>
          </div>

          {/* Featured Destinations */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Destinations</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/stays" className="hover:text-gold-300 transition-colors">Diani Beach & Galu Coast</Link></li>
              <li><Link href="/stays" className="hover:text-gold-300 transition-colors">Lamu Island & Shela Village</Link></li>
              <li><Link href="/stays" className="hover:text-gold-300 transition-colors">Watamu Marine Sanctuary</Link></li>
              <li><Link href="/stays" className="hover:text-gold-300 transition-colors">Maasai Mara Conservancies</Link></li>
              <li><Link href="/stays" className="hover:text-gold-300 transition-colors">Karen & Gigiri Mansions (Nairobi)</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Services & Portal</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/request" className="hover:text-gold-300 transition-colors">Request Flight + Stay</Link></li>
              <li><Link href="/routes" className="hover:text-gold-300 transition-colors">Domestic Flight Schedules</Link></li>
              <li><Link href="/track" className="hover:text-gold-300 transition-colors">Track Booking Status</Link></li>
              <li><Link href="/admin" className="hover:text-gold-300 transition-colors text-gold-400">Admin Operations Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact & Payment Badges */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Concierge Headquarters</h5>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Wilson Airport / Karen, Nairobi, Kenya</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>+254 700 000 000 (24/7 WhatsApp)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>concierge@aerostay.co.ke</span>
              </p>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1.5">Supported Payments</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] rounded font-bold">
                  M-PESA
                </span>
                <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded font-medium">
                  VISA
                </span>
                <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded font-medium">
                  Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Aero & Stay Kenya Concierge Ltd. All rights reserved.</p>
          <p className="text-zinc-500">Designed for VIP Domestic Travel in Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
