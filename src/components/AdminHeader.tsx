'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, LayoutDashboard, Home as HomeIcon, Plane, Users, Calendar, ArrowUpRight, Bell } from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Requests Pipeline', icon: LayoutDashboard },
    { href: '/admin/inventory', label: 'Inventory (Stays & Routes)', icon: HomeIcon },
    { href: '/admin/calendar', label: 'Trip Operations Calendar', icon: Calendar },
    { href: '/admin/clients', label: 'Client CRM', icon: Users },
  ];

  return (
    <header className="bg-obsidian-950 border-b border-zinc-800/90 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-obsidian-950 font-black text-xs">
                AS
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                  AEROSTAY
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 font-mono border border-gold-500/40">
                    ADMIN
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-gold-300 flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Public Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
