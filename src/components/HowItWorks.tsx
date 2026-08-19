import React from 'react';
import { Send, UserCheck, CreditCard, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Submit Single Request',
      description: 'Choose your domestic flight route and curated stay preferences in 60 seconds. No multi-tab chaos.',
      icon: Send,
    },
    {
      number: '02',
      title: 'Human Concierge Verification',
      description: 'We personally call airline desks and villa hosts to guarantee exact seat availability, best rates, and VIP perks.',
      icon: UserCheck,
    },
    {
      number: '03',
      title: 'Review Quote & Pay in One Go',
      description: 'Receive an itemized WhatsApp quote. Settle both flights and your luxury stay with one seamless M-Pesa or Card payment.',
      icon: CreditCard,
    },
    {
      number: '04',
      title: 'All-in-One Itinerary & Support',
      description: 'Access your confirmed flight e-tickets, villa vouchers, check-in guide, and 24/7 dedicated concierge hotline.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-mono font-semibold">
            Bespoke Luxury Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1.5">
            How The Concierge Works
          </h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Eliminating the friction of piecing together separate flight bookings and guesthouse communications in Kenya.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-obsidian-900/90 border border-zinc-800/80 hover:border-gold-500/30 transition-all space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-zinc-700/60 group-hover:text-gold-500/40 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <Link
            href="/request"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold text-sm shadow-luxury-gold hover:scale-105 transition-all"
          >
            <span>Experience Bespoke Concierge Booking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
