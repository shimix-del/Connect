'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { BnBListing, Route } from '@/types';
import { Home as HomeIcon, Plane, Plus, Check, Edit2, Trash2, MapPin, Sparkles, X, DollarSign, Bed, Users } from 'lucide-react';
import { formatKES, formatUSD } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<'stays' | 'routes'>('stays');
  const [stays, setStays] = useState<BnBListing[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  // New Stay Form State
  const [showAddStay, setShowAddStay] = useState(false);
  const [stayTitle, setStayTitle] = useState('');
  const [stayLocation, setStayLocation] = useState('');
  const [stayRegion, setStayRegion] = useState<'Coast' | 'Nairobi' | 'Safari / Mara'>('Coast');
  const [stayPriceKES, setStayPriceKES] = useState(55000);
  const [stayBedrooms, setStayBedrooms] = useState(3);
  const [stayGuests, setStayGuests] = useState(6);
  const [stayDescription, setStayDescription] = useState('');
  const [stayOwnerName, setStayOwnerName] = useState('');
  const [stayOwnerPhone, setStayOwnerPhone] = useState('');
  const [stayPhotoUrl, setStayPhotoUrl] = useState('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80');

  // New Route Form State
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [originName, setOriginName] = useState('Nairobi Wilson');
  const [originCode, setOriginCode] = useState('WIL');
  const [destName, setDestName] = useState('');
  const [destCode, setDestCode] = useState('');
  const [routeCarriers, setRouteCarriers] = useState('Safarilink, Skyward Express');
  const [routeDuration, setRouteDuration] = useState('1h 15m');
  const [routePriceKES, setRoutePriceKES] = useState(14500);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.all([
        fetch('/api/stays'),
        fetch('/api/routes'),
      ]);
      const sData = await sRes.json();
      const rData = await rRes.json();
      if (sData.stays) setStays(sData.stays);
      if (rData.routes) setRoutes(rData.routes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateStay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stayTitle || !stayLocation) return;

    try {
      const res = await fetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: stayTitle,
          location: stayLocation,
          region: stayRegion,
          pricePerNightKES: Number(stayPriceKES),
          bedrooms: Number(stayBedrooms),
          bathrooms: Number(stayBedrooms),
          maxGuests: Number(stayGuests),
          description: stayDescription || 'Luxury private estate.',
          ownerName: stayOwnerName || 'Host Management',
          ownerPhone: stayOwnerPhone || '+254700000000',
          photos: [stayPhotoUrl],
          amenities: ['Private Chef Included', 'Oceanview Pool', 'Starlink WiFi'],
          active: true,
          featured: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStays([data.stay, ...stays]);
        setShowAddStay(false);
        setStayTitle('');
        setStayLocation('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName || !destCode) return;

    try {
      const carriersArr = routeCarriers.split(',').map((c) => c.trim()).filter(Boolean);
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originName,
          originCode,
          destName,
          destCode: destCode.toUpperCase(),
          carriers: carriersArr,
          estimatedDuration: routeDuration,
          basePriceKES: Number(routePriceKES),
          featured: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRoutes([data.route, ...routes]);
        setShowAddRoute(false);
        setDestName('');
        setDestCode('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-foreground pb-20">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">Master Inventory Catalog</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Curate the vetted villas and domestic flight connections presented on your concierge platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-obsidian-900 border border-zinc-800 flex items-center">
              <button
                onClick={() => setActiveTab('stays')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'stays'
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Curated Stays ({stays.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('routes')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'routes'
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flight Routes ({routes.length})</span>
              </button>
            </div>

            {activeTab === 'stays' ? (
              <button
                onClick={() => setShowAddStay(true)}
                className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 text-xs font-bold shadow-luxury-gold hover:bg-gold-400 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Curated Stay</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddRoute(true)}
                className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 text-xs font-bold shadow-luxury-gold hover:bg-gold-400 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Air Route</span>
              </button>
            )}
          </div>
        </div>

        {/* STAYS CATALOG TAB */}
        {activeTab === 'stays' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <div key={stay.id} className="luxury-card rounded-2xl overflow-hidden group space-y-3 p-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-800">
                  <img src={stay.photos[0]} alt={stay.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-gold-300 font-mono">
                    {stay.region}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-white text-base truncate">{stay.title}</h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{stay.location}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-zinc-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Host Internal Contact</span>
                    <strong className="text-white">{stay.ownerName}</strong> ({stay.ownerPhone})
                  </div>
                  <div className="text-right">
                    <div className="text-gold-300 font-mono font-bold">{formatKES(stay.pricePerNightKES)}</div>
                    <span className="text-[10px] text-zinc-500">/ night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ROUTES CATALOG TAB */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {routes.map((route) => (
              <div key={route.id} className="p-5 rounded-2xl bg-obsidian-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-white">
                    {route.originCode} ➔ {route.destCode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-gold-400 font-mono">
                    {route.estimatedDuration}
                  </span>
                </div>

                <div className="text-xs text-zinc-400">
                  <p>{route.originName} to {route.destName}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Carriers: {route.carriers.join(', ')}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Base Fare Range</span>
                  <span className="font-mono font-bold text-gold-300">{formatKES(route.basePriceKES)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Stay Modal */}
      {showAddStay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-obsidian-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-white text-lg">Add New Curated Property</h3>
              <button onClick={() => setShowAddStay(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStay} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Property Title</label>
                <input
                  type="text"
                  value={stayTitle}
                  onChange={(e) => setStayTitle(e.target.value)}
                  placeholder="e.g. Sultan Sands Ocean Villa"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Location & Suburb</label>
                  <input
                    type="text"
                    value={stayLocation}
                    onChange={(e) => setStayLocation(e.target.value)}
                    placeholder="e.g. Diani Beach, South Coast"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Region Category</label>
                  <select
                    value={stayRegion}
                    onChange={(e) => setStayRegion(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  >
                    <option value="Coast">Coast</option>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Safari / Mara">Safari / Mara</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Price / Night (KES)</label>
                  <input
                    type="number"
                    value={stayPriceKES}
                    onChange={(e) => setStayPriceKES(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={stayBedrooms}
                    onChange={(e) => setStayBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={stayGuests}
                    onChange={(e) => setStayGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Host Contact Name</label>
                  <input
                    type="text"
                    value={stayOwnerName}
                    onChange={(e) => setStayOwnerName(e.target.value)}
                    placeholder="Owner / Property Lead"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Host Phone (WhatsApp)</label>
                  <input
                    type="text"
                    value={stayOwnerPhone}
                    onChange={(e) => setStayOwnerPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={stayPhotoUrl}
                  onChange={(e) => setStayPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs shadow-luxury-gold hover:bg-gold-400 transition-all"
              >
                Save Property to Vetted Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-obsidian-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-white text-lg">Add Domestic Air Corridor</h3>
              <button onClick={() => setShowAddRoute(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Origin Name</label>
                  <input
                    type="text"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Origin Code</label>
                  <input
                    type="text"
                    value={originCode}
                    onChange={(e) => setOriginCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Destination Name</label>
                  <input
                    type="text"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="e.g. Samburu Buffalo Springs"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Dest Code</label>
                  <input
                    type="text"
                    value={destCode}
                    onChange={(e) => setDestCode(e.target.value)}
                    placeholder="UAS"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Airlines (Comma separated)</label>
                <input
                  type="text"
                  value={routeCarriers}
                  onChange={(e) => setRouteCarriers(e.target.value)}
                  placeholder="Safarilink, AirKenya, Skyward"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Flight Duration</label>
                  <input
                    type="text"
                    value={routeDuration}
                    onChange={(e) => setRouteDuration(e.target.value)}
                    placeholder="1h 10m"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Base Price (KES)</label>
                  <input
                    type="number"
                    value={routePriceKES}
                    onChange={(e) => setRoutePriceKES(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs shadow-luxury-gold hover:bg-gold-400 transition-all"
              >
                Save Flight Route
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
