'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Compass, Home as HomeIcon, Search, ShieldCheck, PhoneCall, Menu, X, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/request', label: 'Request Booking', icon: Sparkles, highlight: true },
    { href: '/stays', label: 'Curated Stays', icon: HomeIcon },
    { href: '/routes', label: 'Flight Routes', icon: Plane },
    { href: '/track', label: 'Track Booking', icon: Search },
  ];

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full luxury-glass border-b border-gold-500/20 bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 via-gold-600 to-safari-800 flex items-center justify-center shadow-luxury-gold ring-1 ring-gold-300/40 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-5 h-5 text-obsidian-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl tracking-wider font-semibold text-white group-hover:text-gold-200 transition-colors">
                  AERO & STAY
                </span>
                <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 font-mono">
                  KENYA
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans tracking-wide -mt-0.5">
                Private Flight + Luxury Stay Concierge
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative ml-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-sans shadow-luxury-gold hover:opacity-95 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-gold-400 bg-white/5 font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-70" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Admin / VIP Hotline */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/254700000000?text=Jambo%20AeroStay%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20private%20flight%20and%20luxury%20stay."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs text-zinc-300 hover:text-gold-300 flex items-center gap-1.5 rounded-lg border border-zinc-800 hover:border-gold-500/40 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>VIP Desk: +254 700 000 000</span>
            </a>

            <Link
              href="/admin"
              className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                isAdmin
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/request"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gold-500 text-obsidian-950"
            >
              Request
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gold-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian-900 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-800 hover:text-gold-300"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gold-300 bg-gold-500/10 border border-gold-500/20 text-center font-medium"
            >
              Admin Operations Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
