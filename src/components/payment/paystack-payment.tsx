"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface PaystackPaymentProps {
  amount: number; // in Naira
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export function PaystackPayment({ amount, email, onSuccess, onClose, onCancel }: PaystackPaymentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
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
        onSuccess(response.reference);
      }
    });

    handler.openIframe();
  };

  if (!mounted) {
    return null;
  }

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
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Payment Method</span>
            <span>Paystack</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
          >
            Pay Now
          </button>
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          Secured by Paystack
        </p>
      </motion.div>
    </div>
  );
}
