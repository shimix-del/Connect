import fs from 'fs';
import path from 'path';
import { Route, BnBListing, BookingRequest, Client, AdminStats, BookingStatus } from '@/types';
import { INITIAL_ROUTES, INITIAL_STAYS, INITIAL_CLIENTS, INITIAL_BOOKINGS } from './seedData';

interface StoreSchema {
  routes: Route[];
  stays: BnBListing[];
  clients: Client[];
  bookings: BookingRequest[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// In-memory fallback if fs write fails in certain edge environments
let memoryStore: StoreSchema = {
  routes: [...INITIAL_ROUTES],
  stays: [...INITIAL_STAYS],
  clients: [...INITIAL_CLIENTS],
  bookings: [...INITIAL_BOOKINGS],
};

function ensureDataFile(): StoreSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initialData: StoreSchema = {
        routes: INITIAL_ROUTES,
        stays: INITIAL_STAYS,
        clients: INITIAL_CLIENTS,
        bookings: INITIAL_BOOKINGS,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent) as StoreSchema;
    memoryStore = parsed;
    return parsed;
  } catch (error) {
    console.error('Filesystem storage error, using in-memory store:', error);
    return memoryStore;
  }
}

function saveDataFile(data: StoreSchema): void {
  try {
    memoryStore = data;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to file, kept in memory:', error);
  }
}

// Data Access Methods
export function getRoutes(): Route[] {
  const store = ensureDataFile();
  return store.routes;
}

export function saveRoute(route: Route): Route {
  const store = ensureDataFile();
  const index = store.routes.findIndex((r) => r.id === route.id);
  if (index >= 0) {
    store.routes[index] = route;
  } else {
    store.routes.unshift(route);
  }
  saveDataFile(store);
  return route;
}

export function getStays(): BnBListing[] {
  const store = ensureDataFile();
  return store.stays;
}

export function saveStay(stay: BnBListing): BnBListing {
  const store = ensureDataFile();
  const index = store.stays.findIndex((s) => s.id === stay.id);
  if (index >= 0) {
    store.stays[index] = stay;
  } else {
    store.stays.unshift(stay);
  }
  saveDataFile(store);
  return stay;
}

export function getClients(): Client[] {
  const store = ensureDataFile();
  return store.clients;
}

export function saveClient(client: Client): Client {
  const store = ensureDataFile();
  const index = store.clients.findIndex((c) => c.id === client.id);
  if (index >= 0) {
    store.clients[index] = client;
  } else {
    store.clients.unshift(client);
  }
  saveDataFile(store);
  return client;
}

export function getBookings(statusFilter?: BookingStatus): BookingRequest[] {
  const store = ensureDataFile();
  let list = store.bookings;
  if (statusFilter) {
    list = list.filter((b) => b.status === statusFilter);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBookingByIdOrCode(identifier: string): BookingRequest | null {
  const store = ensureDataFile();
  const cleanId = identifier.trim().toLowerCase();
  const match = store.bookings.find(
    (b) => b.id.toLowerCase() === cleanId || b.trackingCode.toLowerCase() === cleanId
  );
  return match || null;
}

export function createBooking(payload: Partial<BookingRequest>): BookingRequest {
  const store = ensureDataFile();
  
  // Create or match Client
  let client = store.clients.find(
    (c) => c.email.toLowerCase() === payload.client?.email?.toLowerCase() ||
           c.phone.replace(/\s+/g, '') === payload.client?.phone?.replace(/\s+/g, '')
  );

  if (!client && payload.client) {
    client = {
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: payload.client.name,
      email: payload.client.email,
      phone: payload.client.phone,
      vipTier: 'standard',
      createdAt: new Date().toISOString(),
    };
    store.clients.unshift(client);
  }

  // Generate Unique Tracking Code e.g. KEN-7329X
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
  saveDataFile(store);
  return newBooking;
}

export function updateBooking(
  idOrCode: string,
  updates: Partial<BookingRequest>
): BookingRequest | null {
  const store = ensureDataFile();
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
  saveDataFile(store);
  return updated;
}

export function getAdminStats(): AdminStats {
  const store = ensureDataFile();
  const bookings = store.bookings;

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
