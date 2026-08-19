'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Client, BookingRequest } from '@/types';
import { Users, PhoneCall, Mail, Star, ShieldCheck, Plus, Sparkles, X } from 'lucide-react';
import { formatKenyanPhone, generateWhatsAppLink } from '@/lib/utils';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientVip, setClientVip] = useState<'standard' | 'vip' | 'ultra_vip'>('vip');
  const [clientNotes, setClientNotes] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/bookings'),
      ]);
      const cData = await cRes.json();
      const bData = await bRes.json();
      if (cData.clients) setClients(cData.clients);
      if (bData.bookings) setBookings(bData.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          vipTier: clientVip,
          notes: clientNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClients([data.client, ...clients]);
        setShowAddClient(false);
        setClientName('');
        setClientPhone('');
        setClientNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getClientBookingsCount = (clientId: string, phone: string) => {
    return bookings.filter(
      (b) => b.clientId === clientId || b.client.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')
    ).length;
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-foreground pb-20">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">Client CRM & VIP Profiles</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Maintain relationship notes, VIP statuses, and past booking preferences for repeat high-end Kenyan and international guests.
            </p>
          </div>

          <button
            onClick={() => setShowAddClient(true)}
            className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 text-xs font-bold shadow-luxury-gold hover:bg-gold-400 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Profile</span>
          </button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const tripCount = getClientBookingsCount(client.id, client.phone);
            const waLink = generateWhatsAppLink(
              client.phone,
              `Jambo ${client.name.split(' ')[0]}, this is Jerry from AeroStay Concierge.`
            );

            return (
              <div
                key={client.id}
                className="p-6 rounded-2xl bg-obsidian-900 border border-zinc-800 space-y-4 shadow-luxury flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-white text-lg">{client.name}</span>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold border ${
                        client.vipTier === 'ultra_vip'
                          ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                          : client.vipTier === 'vip'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {client.vipTier?.replace('_', ' ') || 'Standard'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-400">
                    <p className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span className="font-mono text-zinc-300">{client.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{client.email}</span>
                    </p>
                  </div>

                  {client.notes && (
                    <div className="p-3 rounded-xl bg-obsidian-950 border border-zinc-850 text-xs text-zinc-300 italic">
                      "{client.notes}"
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">
                    <strong className="text-white">{tripCount}</strong> Trip Request{tripCount !== 1 ? 's' : ''}
                  </span>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-obsidian-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-white text-lg">Add High-End Client Profile</h3>
              <button onClick={() => setShowAddClient(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Full Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="elena@executive.co.ke"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">VIP Tier</label>
                <select
                  value={clientVip}
                  onChange={(e) => setClientVip(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                >
                  <option value="standard">Standard Guest</option>
                  <option value="vip">VIP Executive</option>
                  <option value="ultra_vip">Ultra-VIP / Diplomatic</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Preferences & CRM Notes</label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Prefers Wilson morning departures, front row aisle seat, Diani private chef."
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs shadow-luxury-gold hover:bg-gold-400 transition-all"
              >
                Save Client Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
