import React from 'react';
import Link from 'next/link';
import { getStays, getRoutes } from '@/lib/storage';
import BookingWizard from '@/components/BookingWizard';
import FeaturedStays from '@/components/FeaturedStays';
import FeaturedRoutes from '@/components/FeaturedRoutes';
import HowItWorks from '@/components/HowItWorks';
import { 
  Plane, Home as HomeIcon, ShieldCheck, Sparkles, Star, 
  ArrowRight, PhoneCall, CheckCircle2, ChevronRight, MapPin, Compass 
} from 'lucide-react';

export const dynamic = 'force-static';

export default function HomePage() {
  const stays = getStays();
  const routes = getRoutes();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
        {/* Background Image & Luxury Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85"
            alt="Kenyan Coastal & Safari Landscape"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-950/90 to-obsidian-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-semibold tracking-wider uppercase backdrop-blur-md shadow-luxury-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kenya’s Bespoke Air & Stay Concierge</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Your Flight & Luxury Stay. <br />
            <span className="gold-gradient-text">Orchestrated in One Go.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Skip the endless tab switching between airline portals and unvetted listings. We personally coordinate your domestic flights and luxury villas across Diani, Lamu, Watamu & Mara — as a single seamless reservation.
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Certified Domestic Operators (KQ, Safarilink, Skyward)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Hand-Inspected Villas with Private Chefs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant M-Pesa STK & Card Checkout</span>
            </span>
          </div>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-600 text-obsidian-950 font-bold text-sm shadow-luxury-gold hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Custom Flight + Stay Package</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-obsidian-900 border border-zinc-700 hover:border-gold-500/40 text-zinc-300 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Track Existing Booking Reference</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded Quick Request Studio */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="p-1 rounded-3xl bg-gradient-to-b from-gold-500/30 via-zinc-800 to-zinc-900 shadow-2xl">
          <div className="bg-obsidian-950/90 rounded-[22px] p-6 sm:p-10 backdrop-blur-xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold">
                Direct Booking Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Customize Your Kenyan Itinerary
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select your route and stay preferences. Our human concierge desk locks real availability within hours.
              </p>
            </div>

            <BookingWizard />
          </div>
        </div>
      </section>

      {/* Curated Stays Showcase */}
      <FeaturedStays stays={stays} limit={3} />

      {/* Domestic Air Routes Showcase */}
      <FeaturedRoutes routes={routes} limit={6} />

      {/* How Concierge Works */}
      <HowItWorks />

      {/* VIP Testimonials / Trust Signals */}
      <section className="py-12 bg-obsidian-900/60 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-mono font-semibold">
              Client Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Trusted by Discerning Travelers & Executives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-4">
              <div className="flex text-gold-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Booking our family trip to Lamu was effortlessly smooth. Wilson airstrip tickets, our private Shela dhow transfer, and a full house staff were ready the moment we landed."
              </p>
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold text-white">Elena Vance</p>
                <p className="text-[11px] text-zinc-500">Tech Executive, Nairobi</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-4">
              <div className="flex text-gold-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "The one M-Pesa payment for both our Safarilink flights and the Diani beachfront villa saved me so many phone calls. Top-tier concierge service."
              </p>
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold text-white">Wanjiku Mugo</p>
                <p className="text-[11px] text-zinc-500">Managing Partner, Corporate Law</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-950 border border-zinc-800 space-y-4">
              <div className="flex text-gold-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Quick turnaround on WhatsApp with a clear itemized quote. Having a real human in Nairobi double-checking seat allocations makes all the difference."
              </p>
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold text-white">Hon. Kevin Ochieng</p>
                <p className="text-[11px] text-zinc-500">Frequent Business Traveler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-mono font-semibold">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>How does the human-in-the-loop confirmation work?</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rather than relying on automated APIs that often fail with small boutique Kenyan airlines or private bush villas, our concierge directly calls the carrier reservation desks (e.g. Safarilink, Kenya Airways, Skyward) and villa property owners to lock your exact seats and dates before you pay.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Which payment methods are accepted in Kenya?</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We accept instant Safaricom M-Pesa STK Push payments, international credit/debit cards (Visa, Mastercard, American Express), and direct corporate bank wire transfers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Can I request a custom villa not listed in your catalog?</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes. In the booking request form, choose custom stay requirements and describe your ideal location, bedroom count, or specific property name. Our team will verify and negotiate the best rate for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
