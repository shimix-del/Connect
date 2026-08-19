import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookingStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+254' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanNumber = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function getStatusBadge(status: BookingStatus): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case 'pending_review':
      return {
        label: 'Pending Review',
        className: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-400',
      };
    case 'quoted':
      return {
        label: 'Quote Sent',
        className: 'bg-sky-950/70 text-sky-300 border-sky-500/30',
        dotColor: 'bg-sky-400',
      };
    case 'payment_pending':
      return {
        label: 'Payment Pending',
        className: 'bg-orange-950/70 text-orange-300 border-orange-500/30',
        dotColor: 'bg-orange-400',
      };
    case 'confirmed':
      return {
        label: 'Confirmed & Locked',
        className: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
        dotColor: 'bg-emerald-400',
      };
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        dotColor: 'bg-zinc-400',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        className: 'bg-rose-950/70 text-rose-300 border-rose-500/30',
        dotColor: 'bg-rose-400',
      };
    default:
      return {
        label: status,
        className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        dotColor: 'bg-zinc-400',
      };
  }
}
