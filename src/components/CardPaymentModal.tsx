'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';
import { formatUSD, formatKES } from '@/lib/utils';
import { payBookingApi } from '@/lib/apiClient';
import confetti from 'canvas-confetti';

interface Props {
  bookingId: string;
  amountKES: number;
  amountUSD: number;
  onSuccess: (receipt: string) => void;
  onClose: () => void;
}

export default function CardPaymentModal({ bookingId, amountKES, amountUSD, onSuccess, onClose }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCardFormat = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryFormat = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 2) {
      setExpiry(`${clean.substring(0, 2)}/${clean.substring(2)}`);
    } else {
      setExpiry(clean);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 15 || !cardHolder.trim() || cvv.length < 3) {
      setError('Please complete all valid card details.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await payBookingApi(bookingId, {
        method: 'card',
        amountKES,
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
        status: 'completed',
        paidAt: new Date().toISOString(),
      });

      if (!data.success) {
        throw new Error('Payment processing failed.');
      }

      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5921f', '#d5aa32', '#ffffff'],
      });

      setTimeout(() => {
        onSuccess(data.booking?.payment?.mpesaReceipt || 'TXN-CARD-SUCCESS');
      }, 1600);
    } catch (err: any) {
      setError(err.message || 'Card authorization failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-obsidian-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold">
                  Card Gateway / Flutterwave
                </span>
                <h3 className="text-xl font-bold text-white font-serif">Credit or Debit Card</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-obsidian-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400">Total Charged</span>
                <div className="text-lg font-bold text-white font-mono">
                  {formatKES(amountKES)} <span className="text-xs text-gold-400 font-normal">({formatUSD(amountUSD)})</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit TLS</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => handleCardFormat(e.target.value)}
                placeholder="4242 •••• •••• 4242"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="e.g. MARCUS VANCE"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-white text-sm uppercase focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => handleExpiryFormat(e.target.value)}
                  placeholder="08/28"
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm text-center focus:outline-none focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">CVV / CVC</label>
                <input
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-zinc-700 text-white font-mono text-sm text-center focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-bold text-sm shadow-luxury-gold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Card Payment...</span>
                </>
              ) : (
                <span>Authorize {formatKES(amountKES)}</span>
              )}
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white font-serif">Payment Approved!</h4>
            <p className="text-xs text-zinc-400">
              Securing flight tickets & private villa lock. Refreshing your itinerary...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
