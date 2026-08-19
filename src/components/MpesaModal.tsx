'use client';

import React, { useState } from 'react';
import { Smartphone, CheckCircle2, ShieldCheck, Loader2, X, AlertCircle } from 'lucide-react';
import { formatKES } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Props {
  bookingId: string;
  amountKES: number;
  clientPhone: string;
  onSuccess: (receipt: string) => void;
  onClose: () => void;
}

export default function MpesaModal({ bookingId, amountKES, clientPhone, onSuccess, onClose }: Props) {
  const [phone, setPhone] = useState(clientPhone || '+2547');
  const [stage, setStage] = useState<'prompt' | 'waiting_pin' | 'processing' | 'success'>('prompt');
  const [pin, setPin] = useState('');
  const [receipt, setReceipt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendSTK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 9) {
      setError('Please enter a valid Safaricom phone number.');
      return;
    }
    setError('');
    setStage('waiting_pin');
  };

  const handleConfirmPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter a 4-digit M-Pesa PIN.');
      return;
    }

    setError('');
    setStage('processing');
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'mpesa',
          amountKES,
          mpesaPhone: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'M-Pesa payment processing failed.');
      }

      setReceipt(data.receipt);
      setStage('success');

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#c5921f', '#ffffff'],
      });

      setTimeout(() => {
        onSuccess(data.receipt);
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Payment could not be verified.');
      setStage('prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-obsidian-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Safaricom Green Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === 'prompt' && (
          <form onSubmit={handleSendSTK} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs font-mono">
                LIPA
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Safaricom M-PESA Online
                </span>
                <h3 className="text-xl font-bold text-white font-serif">Instant STK Push</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-zinc-800">
              <span className="text-xs text-zinc-400">Total Payable Amount</span>
              <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">
                {formatKES(amountKES)}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Merchant: <strong className="text-zinc-300">AeroStay Concierge Kenya Ltd</strong>
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                Enter Safaricom M-Pesa Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-emerald-500/40 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
                <Smartphone className="w-5 h-5 text-emerald-400 absolute right-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                A prompt will appear instantly on this phone to authorize the transaction.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-obsidian-950 font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Send STK Push Prompt</span>
            </button>
          </form>
        )}

        {stage === 'waiting_pin' && (
          <form onSubmit={handleConfirmPin} className="space-y-5 text-center">
            {/* Phone Screen Mockup */}
            <div className="max-w-[280px] mx-auto p-4 rounded-2xl bg-zinc-950 border-2 border-emerald-500/60 shadow-2xl text-left font-sans">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">M-PESA SIM TOOLKIT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-300 mb-2">
                Do you want to pay <strong className="text-white">{formatKES(amountKES)}</strong> to <strong className="text-emerald-300">AeroStay Concierge</strong>?
              </p>
              <div className="mt-3">
                <label className="text-[10px] text-zinc-400 block mb-1">Enter 4-Digit M-Pesa PIN:</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-obsidian-950 font-bold text-sm hover:scale-[1.02] transition-all"
              >
                Authorize & Confirm Payment
              </button>
              <button
                type="button"
                onClick={() => setStage('prompt')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        {stage === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-white font-serif">Verifying Safaricom Receipt...</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Connecting with Daraja API gateway and securing your domestic air tickets & villa booking.
            </p>
          </div>
        )}

        {stage === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white font-serif">Payment Verified!</h4>
            <div className="p-3 rounded-xl bg-obsidian-950 border border-emerald-500/30 inline-block font-mono text-xs text-emerald-300">
              M-PESA REF: <strong>{receipt}</strong>
            </div>
            <p className="text-xs text-zinc-400">
              Your itinerary is now locked and confirmed. Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
