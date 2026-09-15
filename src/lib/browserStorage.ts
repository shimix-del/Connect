import { Route, BnBListing, BookingRequest, Client, AdminStats, BookingStatus } from '@/types';
import { INITIAL_ROUTES, INITIAL_STAYS, INITIAL_CLIENTS, INITIAL_BOOKINGS } from './seedData';

const STORAGE_KEY = 'aero_stay_kenya_store';

interface BrowserStore {
  routes: Route[];
  stays: BnBListing[];
  clients: Client[];
  bookings: BookingRequest[];
}

function getStore(): BrowserStore {
  if (typeof window === 'undefined') {
    return {
      routes: INITIAL_ROUTES,
      stays: INITIAL_STAYS,
      clients: INITIAL_CLIENTS,
      bookings: INITIAL_BOOKINGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: BrowserStore = {
        routes: INITIAL_ROUTES,
        stays: INITIAL_STAYS,
        clients: INITIAL_CLIENTS,
        bookings: INITIAL_BOOKINGS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as BrowserStore;
  } catch (e) {
    return {
      routes: INITIAL_ROUTES,
      stays: INITIAL_STAYS,
      clients: INITIAL_CLIENTS,
      bookings: INITIAL_BOOKINGS,
    };
  }
}

function saveStore(store: BrowserStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function browserGetRoutes(): Route[] {
  return getStore().routes;
}

export function browserSaveRoute(route: Route): Route {
  const store = getStore();
  const index = store.routes.findIndex((r) => r.id === route.id);
  if (index >= 0) {
    store.routes[index] = route;
  } else {
    store.routes.unshift(route);
  }
  saveStore(store);
  return route;
}

export function browserGetStays(): BnBListing[] {
  return getStore().stays;
}

export function browserSaveStay(stay: BnBListing): BnBListing {
  const store = getStore();
  const index = store.stays.findIndex((s) => s.id === stay.id);
  if (index >= 0) {
    store.stays[index] = stay;
  } else {
    store.stays.unshift(stay);
  }
  saveStore(store);
  return stay;
}

export function browserGetClients(): Client[] {
  return getStore().clients;
}

export function browserSaveClient(client: Client): Client {
  const store = getStore();
  const index = store.clients.findIndex((c) => c.id === client.id);
  if (index >= 0) {
    store.clients[index] = client;
  } else {
    store.clients.unshift(client);
  }
  saveStore(store);
  return client;
}

export function browserGetBookings(statusFilter?: BookingStatus): BookingRequest[] {
  let list = getStore().bookings;
  if (statusFilter) {
    list = list.filter((b) => b.status === statusFilter);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function browserGetBookingByIdOrCode(identifier: string): BookingRequest | null {
  const cleanId = identifier.trim().toLowerCase();
  const match = getStore().bookings.find(
    (b) => b.id.toLowerCase() === cleanId || b.trackingCode.toLowerCase() === cleanId
  );
  return match || null;
}

export function browserCreateBooking(
  payload: Omit<Partial<BookingRequest>, 'client'> & { client?: Partial<Client> }
): BookingRequest {
  const store = getStore();

  let client = store.clients.find(
    (c) => (payload.client?.email && c.email.toLowerCase() === payload.client.email.toLowerCase()) ||
           (payload.client?.phone && c.phone.replace(/\s+/g, '') === payload.client.phone.replace(/\s+/g, ''))
  );

  if (!client && payload.client) {
    client = {
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: payload.client.name || 'Guest',
      email: payload.client.email || 'guest@aerostay.ke',
      phone: payload.client.phone || '+254700000000',
      vipTier: 'standard',
      createdAt: new Date().toISOString(),
    };
    store.clients.unshift(client);
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const trackingCode = `KEN-${randomDigits}${randomChar}`;

  const newBooking: BookingRequest = {
    id: `req-${Date.now()}`,
    trackingCode,
    clientId: client?.id || 'client-unknown',
    client: client || {
      id: 'client-guest',
      name: 'Valued Guest',
      email: 'guest@safari.concierge',
      phone: '+254700000000',
      createdAt: new Date().toISOString(),
    },
    bookingType: payload.bookingType || 'flight_and_bnb',
    flightRouteId: payload.flightRouteId,
    flightOrigin: payload.flightOrigin,
    flightDestination: payload.flightDestination,
    flightDate: payload.flightDate,
    flightReturnDate: payload.flightReturnDate,
    flightIsRoundTrip: payload.flightIsRoundTrip ?? false,
    flightPax: payload.flightPax || 1,
    flightPreferredTime: payload.flightPreferredTime || 'flexible',
    flightCarrierPreference: payload.flightCarrierPreference,
    bnbListingId: payload.bnbListingId,
    bnbCustomPreference: payload.bnbCustomPreference,
    bnbCheckIn: payload.bnbCheckIn,
    bnbCheckOut: payload.bnbCheckOut,
    bnbGuests: payload.bnbGuests || 1,
    bnbBudgetTier: payload.bnbBudgetTier,
    vipAirportTransfer: payload.vipAirportTransfer,
    privateChefRequest: payload.privateChefRequest,
    champagneOnArrival: payload.champagneOnArrival,
    specialRequests: payload.specialRequests,
    status: 'pending_review',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.bookings.unshift(newBooking);
  saveStore(store);
  return newBooking;
}

export function browserUpdateBooking(
  idOrCode: string,
  updates: Partial<BookingRequest>
): BookingRequest | null {
  const store = getStore();
  const cleanId = idOrCode.trim().toLowerCase();
  const index = store.bookings.findIndex(
    (b) => b.id.toLowerCase() === cleanId || b.trackingCode.toLowerCase() === cleanId
  );

  if (index === -1) return null;

  const current = store.bookings[index];
  const updated: BookingRequest = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  store.bookings[index] = updated;
  saveStore(store);
  return updated;
}

export function browserGetAdminStats(): AdminStats {
  const bookings = getStore().bookings;
  let totalRevenueKES = 0;
  let totalRevenueUSD = 0;

  bookings.forEach((b) => {
    if (b.payment?.status === 'completed') {
      totalRevenueKES += b.payment.amountKES || 0;
      totalRevenueUSD += b.payment.amountUSD || (b.payment.amountKES ? Math.round(b.payment.amountKES / 130) : 0);
    }
  });

  return {
    totalRequests: bookings.length,
    pendingReviewCount: bookings.filter((b) => b.status === 'pending_review').length,
    quotedCount: bookings.filter((b) => b.status === 'quoted').length,
    paymentPendingCount: bookings.filter((b) => b.status === 'payment_pending').length,
    confirmedCount: bookings.filter((b) => b.status === 'confirmed').length,
    completedCount: bookings.filter((b) => b.status === 'completed').length,
    totalRevenueKES,
    totalRevenueUSD,
    recentRequests: bookings.slice(0, 5),
  };
}
