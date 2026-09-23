"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Building2, Copy, Check, Wallet } from "lucide-react";
import { getWalletBalance } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

interface PaymentMethodProps {
  amount: number; // in Naira
  email: string;
  accountId: string;
  onSuccess: (reference: string, method: 'paystack' | 'transfer') => void;
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
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'transfer' | 'wallet' | null>(null);
  const [transferProof, setTransferProof] = useState('');
  const [copied, setCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);

  const bankDetails = {
    accountName: "ABASIODIONG INYANG",
    accountNumber: "1009822052",
    bankName: "FIRST CITY MONUMENT BANK (FCMB)",
  };

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

  const handleTransferPayment = () => {
    if (!transferProof.trim()) {
      alert('Please provide transfer reference or proof');
      return;
    }
    const reference = `TRANSFER-${Date.now()}`;
    onSuccess(transferProof, 'transfer');
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
              onClick={() => setSelectedMethod('paystack')}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CreditCard size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Paystack</h3>
                <p className="text-xs text-slate-500">Instant payment</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('transfer')}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Bank Transfer</h3>
                <p className="text-xs text-slate-500">Requires admin approval</p>
              </div>
            </button>

            <button
              onClick={onCancel}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
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
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <h3 className="font-bold text-slate-800 mb-3">Bank Transfer Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Bank Name:</span>
                  <span className="font-medium text-slate-800">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Account Name:</span>
                  <span className="font-medium text-slate-800">{bankDetails.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                    >
                      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-blue-600" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transfer Reference / Proof
              </label>
              <textarea
                value={transferProof}
                onChange={(e) => setTransferProof(e.target.value)}
                placeholder="Enter your transfer reference number or upload proof..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Bank transfers require admin approval. Your order will be processed once the transfer is verified.
              </p>
            </div>

            <button
              onClick={handleTransferPayment}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Submit Transfer Proof
            </button>
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
