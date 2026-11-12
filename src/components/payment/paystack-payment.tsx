"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Wallet } from "lucide-react";
import { getWalletBalance } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

interface PaymentMethodProps {
  amount: number; // in Naira
  email: string;
  accountId: string;
  onSuccess: (reference: string, method: 'ercas' | 'paystack' | 'wallet') => void;
  onWalletPurchase: () => void;
  onClose: () => void;
  onCancel: () => void;
}

const supabase = createClient();

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export function PaymentMethod({ amount, email, accountId, onSuccess, onWalletPurchase, onClose, onCancel }: PaymentMethodProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'ercas' | 'paystack' | 'wallet' | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    // Load wallet balance
    async function loadWalletBalance() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const wallet = await getWalletBalance(user.id);
          setWalletBalance(wallet.balance_cents);
        }
      } catch (error) {
        console.error('Error loading wallet balance:', error);
      } finally {
        setLoadingWallet(false);
      }
    }
    loadWalletBalance();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaystackPayment = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
    const amountInKobo = amount * 100; // Convert Naira to kobo for Paystack

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountInKobo,
      currency: 'NGN',
      ref: `TRUST-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Account Purchase",
            variable_name: "account_purchase",
            value: "TrustedAccounts"
          }
        ]
      },
      onClose: () => {
        onCancel();
      },
      callback: (response: any) => {
        onSuccess(response.reference, 'paystack');
      }
    });

    handler.openIframe();
  };

  const handleErcasPayment = async () => {
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: accountId,
          paymentMethod: 'ercas',
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to initialize Ercas Pay payment');
      }
    } catch (error) {
      console.error('Ercas Pay error:', error);
      alert('Failed to initialize payment');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return null;
  }

  const canAfford = walletBalance >= amount * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">Amount to Pay</span>
            <span className="text-2xl font-bold text-slate-800">
              ₦{amount.toLocaleString()}
            </span>
          </div>
        </div>

        {!selectedMethod ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 mb-4">Choose your payment method:</p>

            {/* Ercas Pay Option - First */}
            <button
              onClick={() => setSelectedMethod('ercas')}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <CreditCard size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Ercas Pay</h3>
                <p className="text-xs text-slate-500">Instant payment</p>
              </div>
            </button>

            {/* Paystack Option - Second */}
            <button
              onClick={() => setSelectedMethod('paystack')}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CreditCard size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Paystack</h3>
                <p className="text-xs text-slate-500">Instant payment</p>
              </div>
            </button>

            {/* Wallet Option */}
            <button
              onClick={() => setSelectedMethod('wallet')}
              disabled={loadingWallet}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Wallet size={24} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-slate-800">Wallet Balance</h3>
                <p className="text-xs text-slate-500">
                  {loadingWallet ? 'Loading...' : `₦${(walletBalance / 100).toLocaleString()}`}
                </p>
                {!loadingWallet && !canAfford && (
                  <p className="text-xs text-red-500">Insufficient balance</p>
                )}
              </div>
            </button>

            <button
              onClick={onCancel}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : selectedMethod === 'ercas' ? (
          <div className="space-y-3">
            <button
              onClick={handleErcasPayment}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              Pay with Ercas Pay
            </button>
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        ) : selectedMethod === 'wallet' ? (
          <div className="space-y-3">
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <h3 className="font-bold text-slate-800 mb-2">Wallet Payment</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">Your Balance:</span>
                <span className="text-lg font-bold text-slate-800">
                  ₦{(walletBalance / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Amount:</span>
                <span className="text-lg font-bold text-slate-800">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-slate-600">Remaining:</span>
                <span className={`text-lg font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{((walletBalance - amount * 100) / 100).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onWalletPurchase}
              disabled={!canAfford}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Wallet size={16} />
              Pay with Wallet
            </button>
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        ) : selectedMethod === 'paystack' ? (
          <div className="space-y-3">
            <button
              onClick={handlePaystackPayment}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              Pay with Paystack
            </button>
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
