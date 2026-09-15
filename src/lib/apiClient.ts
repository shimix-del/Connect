import {
  browserGetRoutes,
  browserSaveRoute,
  browserGetStays,
  browserSaveStay,
  browserGetClients,
  browserSaveClient,
  browserGetBookings,
  browserGetBookingByIdOrCode,
  browserCreateBooking,
  browserUpdateBooking,
  browserGetAdminStats,
} from './browserStorage';
import { BookingRequest, BookingStatus, Client, BnBListing, Route, AdminStats, QuoteDetails } from '@/types';

/**
 * Universal Data Layer that works seamlessly both in full-stack Node.js environments
 * (Vercel, Docker, Localhost) and 100% statically in GitHub Pages (via LocalStorage).
 */

export async function fetchRoutes(): Promise<{ success: boolean; data: Route[] }> {
  try {
    const res = await fetch('/api/routes');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // static / offline fallback
  }
  return { success: true, data: browserGetRoutes() };
}

export async function createRouteApi(payload: Partial<Route> & { originName: string; destName: string }): Promise<{ success: boolean; route: Route }> {
  const fullRoute: Route = {
    id: payload.id || `route-${Date.now()}`,
    originName: payload.originName,
    originCode: payload.originCode || 'WIL',
    destName: payload.destName,
    destCode: payload.destCode || 'UKA',
    carriers: payload.carriers || ['Safarilink'],
    estimatedDuration: payload.estimatedDuration || '1h',
    basePriceKES: payload.basePriceKES || 15000,
    basePriceUSD: payload.basePriceUSD || Math.round((payload.basePriceKES || 15000) / 130),
    featured: payload.featured ?? true,
    description: payload.description,
    frequency: payload.frequency,
    aircraftType: payload.aircraftType,
  };

  try {
    const res = await fetch('/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullRoute),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const route = browserSaveRoute(fullRoute);
  return { success: true, route };
}

export async function fetchStays(): Promise<{ success: boolean; data: BnBListing[] }> {
  try {
    const res = await fetch('/api/stays');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  return { success: true, data: browserGetStays() };
}

export async function createStayApi(payload: Partial<BnBListing> & { title: string; location: string }): Promise<{ success: boolean; stay: BnBListing }> {
  const fullStay: BnBListing = {
    id: payload.id || `stay-${Date.now()}`,
    title: payload.title,
    slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    location: payload.location,
    region: payload.region || 'Coast',
    description: payload.description || 'Luxury private estate.',
    tagline: payload.tagline || 'Curated luxury retreat in Kenya.',
    photos: payload.photos || ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'],
    bedrooms: payload.bedrooms || 3,
    bathrooms: payload.bathrooms || 3,
    maxGuests: payload.maxGuests || 6,
    amenities: payload.amenities || ['Private Chef Included', 'Oceanview Pool'],
    pricePerNightKES: payload.pricePerNightKES || 55000,
    pricePerNightUSD: payload.pricePerNightUSD || Math.round((payload.pricePerNightKES || 55000) / 130),
    ownerName: payload.ownerName || 'Host Management',
    ownerPhone: payload.ownerPhone || '+254700000000',
    active: payload.active ?? true,
    featured: payload.featured ?? true,
    badge: payload.badge,
  };

  try {
    const res = await fetch('/api/stays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullStay),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const stay = browserSaveStay(fullStay);
  return { success: true, stay };
}

export async function fetchClients(): Promise<{ success: boolean; data: Client[] }> {
  try {
    const res = await fetch('/api/clients');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  return { success: true, data: browserGetClients() };
}

export async function saveClientApi(client: Client): Promise<{ success: boolean; client: Client }> {
  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const saved = browserSaveClient(client);
  return { success: true, client: saved };
}

export async function fetchBookings(status?: BookingStatus): Promise<{ success: boolean; data: BookingRequest[] }> {
  try {
    const url = status ? `/api/bookings?status=${status}` : '/api/bookings';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  return { success: true, data: browserGetBookings(status) };
}

export async function fetchBookingByCode(code: string): Promise<{ success: boolean; booking?: BookingRequest; message?: string }> {
  try {
    const res = await fetch(`/api/bookings/${code}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const booking = browserGetBookingByIdOrCode(code);
  if (!booking) {
    return { success: false, message: 'Reservation reference not found.' };
  }
  return { success: true, booking };
}

export async function createBookingApi(
  payload: Omit<Partial<BookingRequest>, 'client'> & { client?: Partial<Client> }
): Promise<{ success: boolean; booking: BookingRequest }> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const booking = browserCreateBooking(payload);
  return { success: true, booking };
}

export async function updateBookingApi(
  idOrCode: string,
  updates: Partial<BookingRequest>
): Promise<{ success: boolean; booking?: BookingRequest }> {
  try {
    const res = await fetch(`/api/bookings/${idOrCode}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const booking = browserUpdateBooking(idOrCode, updates);
  return { success: !!booking, booking: booking || undefined };
}

export async function quoteBookingApi(
  id: string,
  quote: Partial<QuoteDetails> & {
    flightPriceKES: number;
    bnbPriceKES: number;
    conciergeFeeKES: number;
    totalPriceKES: number;
    totalPriceUSD: number;
  }
): Promise<{ success: boolean; booking?: BookingRequest }> {
  const fullQuote: QuoteDetails = {
    id: quote.id || `quote-${Date.now()}`,
    flightPriceKES: quote.flightPriceKES,
    bnbPriceKES: quote.bnbPriceKES,
    conciergeFeeKES: quote.conciergeFeeKES,
    totalPriceKES: quote.totalPriceKES,
    totalPriceUSD: quote.totalPriceUSD,
    quotedAirline: quote.quotedAirline,
    quotedStayName: quote.quotedStayName,
    quoteNotes: quote.quoteNotes,
    validUntil: quote.validUntil || new Date(Date.now() + 48 * 3600000).toISOString(),
    sentAt: quote.sentAt || new Date().toISOString(),
  };

  try {
    const res = await fetch(`/api/bookings/${id}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullQuote),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const booking = browserUpdateBooking(id, {
    quote: fullQuote,
    status: 'quoted',
  });
  return { success: !!booking, booking: booking || undefined };
}

export async function payBookingApi(
  id: string,
  payment: NonNullable<BookingRequest['payment']>
): Promise<{ success: boolean; booking?: BookingRequest }> {
  try {
    const res = await fetch(`/api/bookings/${id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  const booking = browserUpdateBooking(id, {
    payment: {
      ...payment,
      status: 'completed',
      paidAt: new Date().toISOString(),
    },
    status: 'confirmed',
  });
  return { success: !!booking, booking: booking || undefined };
}

export async function fetchAdminStats(): Promise<{ success: boolean; stats: AdminStats }> {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (e) {
    // fallback
  }
  return { success: true, stats: browserGetAdminStats() };
}
