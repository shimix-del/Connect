export type BookingType = 'flight_and_bnb' | 'flight_only' | 'bnb_only';

export type BookingStatus =
  | 'pending_review'
  | 'quoted'
  | 'payment_pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string; // e.g. +254 712 345678
  vipTier?: 'standard' | 'vip' | 'ultra_vip';
  notes?: string;
  createdAt: string;
}

export interface Route {
  id: string;
  originName: string;
  originCode: string; // NBO (JKIA), WIL (Wilson), etc.
  destName: string;
  destCode: string; // MBA, UKA, MYD, LAU, KIS, MRE, etc.
  carriers: string[]; // e.g. ['Kenya Airways', 'Jambojet', 'Safarilink', 'Skyward Express']
  aircraftType?: string; // 'Dash 8-400 / Cessna Caravan'
  estimatedDuration: string; // '45 mins'
  basePriceKES: number;
  basePriceUSD: number;
  description?: string;
  featured: boolean;
  frequency?: string; // '3 flights daily'
}

export interface BnBListing {
  id: string;
  title: string;
  slug: string;
  location: string; // 'Diani Beach, South Coast'
  region: 'Coast' | 'Nairobi' | 'Safari / Mara' | 'Rift Valley' | 'Western';
  description: string;
  tagline: string;
  photos: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  pricePerNightKES: number;
  pricePerNightUSD: number;
  ownerName: string;
  ownerPhone: string;
  active: boolean;
  featured: boolean;
  badge?: string; // 'Top Pick', 'Beachfront', 'Private Chef Included'
}

export interface QuoteDetails {
  id: string;
  flightPriceKES: number;
  bnbPriceKES: number;
  conciergeFeeKES: number;
  totalPriceKES: number;
  totalPriceUSD: number;
  quotedAirline?: string;
  quotedStayName?: string;
  quoteNotes?: string;
  validUntil: string;
  sentAt: string;
}

export interface FinalItinerary {
  airlineBookingRef?: string;
  flightDetailsSummary?: string;
  baggageAllowance?: string;
  departureTerminal?: string;
  stayConfirmationRef?: string;
  stayAddress?: string;
  checkInInstructions?: string;
  hostContactPhone?: string;
  conciergeLeadName?: string;
  conciergeLeadPhone?: string;
  confirmedAt?: string;
}

export interface PaymentDetails {
  method: 'mpesa' | 'card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  mpesaReceipt?: string;
  mpesaPhone?: string;
  cardLast4?: string;
  paidAt?: string;
  amountKES: number;
  amountUSD?: number;
}

export interface BookingRequest {
  id: string;
  trackingCode: string; // e.g. 'KEN-8492X'
  clientId: string;
  client: Client;
  bookingType: BookingType;

  // Flight requirements
  flightRouteId?: string;
  flightOrigin?: string;
  flightDestination?: string;
  flightDate?: string;
  flightReturnDate?: string;
  flightIsRoundTrip: boolean;
  flightPax: number;
  flightPreferredTime?: 'morning' | 'afternoon' | 'sunset' | 'flexible';
  flightCarrierPreference?: string;

  // BnB / Stay requirements
  bnbListingId?: string;
  bnbCustomPreference?: string;
  bnbCheckIn?: string;
  bnbCheckOut?: string;
  bnbGuests?: number;
  bnbBudgetTier?: string;
  bnbLocationPreference?: string;

  // Concierge special add-ons
  vipAirportTransfer?: boolean;
  privateChefRequest?: boolean;
  champagneOnArrival?: boolean;
  specialRequests?: string;

  // Lifecycle
  status: BookingStatus;
  quote?: QuoteDetails;
  itinerary?: FinalItinerary;
  payment?: PaymentDetails;
  adminNotes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalRequests: number;
  pendingReviewCount: number;
  quotedCount: number;
  paymentPendingCount: number;
  confirmedCount: number;
  completedCount: number;
  totalRevenueKES: number;
  totalRevenueUSD: number;
  recentRequests: BookingRequest[];
}
