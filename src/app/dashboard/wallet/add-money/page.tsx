"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Wallet, ArrowLeft, CreditCard, Building2, Sparkles, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createDeposit } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const bankDetails = {
  accountName: "ABASIODIONG INYANG",
  accountNumber: "1009822052",
  bankName: "FIRST CITY MONUMENT BANK (FCMB)",
};

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function AddMoneyPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'success' | 'failed'>('form');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | null>(null);
  const [transferProof, setTransferProof] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function loadUserEmail() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    }
    loadUserEmail();

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaystackPayment = (depositId: string) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
    const amountInKobo = parseFloat(amount) * 100; // Convert Naira to kobo for Paystack
    const reference = `WALLET-${depositId}`;

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: userEmail,
      amount: amountInKobo,
      currency: 'NGN',
      ref: reference,
      metadata: {
        deposit_id: depositId,
        custom_fields: [
          {
            display_name: "Wallet Deposit",
            variable_name: "wallet_deposit",
            value: "TrustedAccounts"
          }
        ]
      },
      onClose: function() {
        // User closed payment window
        setStep('failed');
      },
      callback: function(response: any) {
        console.log('Paystack callback received:', response);

        // Payment successful - call API route to complete deposit
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('Session:', session ? 'has session' : 'no session');

          if (!session) {
            console.error('No session available');
            setStep('failed');
            return;
          }

          fetch('/api/complete-deposit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ depositId }),
          })
            .then(res => {
              console.log('API response status:', res.status);
              return res.json();
            })
            .then(result => {
              console.log('API result:', result);
              if (result.success) {
                console.log('Setting step to success');
                setStep('success');
              } else {
                console.error('Error completing deposit:', result.error);
                setStep('failed');
              }
            })
            .catch((error) => {
              console.error('Error completing deposit:', error);
              setStep('failed');
            });
        }).catch((error) => {
          console.error('Error getting session:', error);
          setStep('failed');
        });
      }
    });

    handler.openIframe();
  };

  const handleContinue = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'transfer' && !transferProof.trim()) {
      alert('Please provide transfer reference or proof');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const amountCents = Math.round(parseFloat(amount) * 100);

        if (paymentMethod === 'card') {
          // Generate unique reference
          const reference = `WALLET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          // Create deposit first
          const deposit = await createDeposit(user.id, amountCents, paymentMethod, reference);
          // Use deposit ID as reference for Paystack
          handlePaystackPayment(deposit.id);
        } else {
          // Transfer requires admin approval
          await createDeposit(user.id, amountCents, paymentMethod, transferProof);
          setStep('success');
        }
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
      alert('Failed to create deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/wallet');
  };

  if (step === 'form') {
    return (
      <DashboardLayout>
        <div className="space-y-3 px-2 sm:px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleBack}
                className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg"
              >
                <ArrowLeft size={14} className="text-white" />
              </button>
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
                <Wallet size={14} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500">
                Add Money
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deposit funds into your wallet</p>
          </motion.div>

          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
              />
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                      : 'border-slate-200 hover:border-blue-600/50 dark:border-slate-700 dark:hover:border-blue-500/50'
                  }`}
                >
                  <CreditCard size={24} className={paymentMethod === 'card' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Paystack</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'transfer'
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                      : 'border-slate-200 hover:border-blue-600/50 dark:border-slate-700 dark:hover:border-blue-500/50'
                  }`}
                >
                  <Building2 size={24} className={paymentMethod === 'transfer' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Transfer</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Transfer Details */}
          {paymentMethod === 'transfer' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Bank Transfer Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Bank Name:</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-white">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Account Name:</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-white">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-800 dark:text-white">{bankDetails.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors dark:hover:bg-blue-900/30"
                      >
                        {copied ? <Check size={14} className="text-green-600" /> : <CreditCard size={14} className="text-blue-600 dark:text-blue-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transfer Proof */}
          {paymentMethod === 'transfer' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Transfer Reference / Proof
                </label>
                <textarea
                  value={transferProof}
                  onChange={(e) => setTransferProof(e.target.value)}
                  placeholder="Enter your transfer reference number or upload proof..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                />
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Sparkles size={12} />
              {loading ? 'Processing...' : 'Continue'}
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'success') {
    return (
      <DashboardLayout>
        <div className="space-y-3 px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/10 rounded-xl blur-md" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-6 border-2 border-green-600/20 dark:bg-slate-800/80 dark:border-green-500/30 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Confirmed</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {paymentMethod === 'transfer' 
                  ? 'Your transfer has been submitted for admin approval. Your wallet balance will be updated once approved.'
                  : `Your deposit of ₦${parseFloat(amount).toLocaleString()} has been recorded and your wallet balance has been updated.`
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard/wallet')}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'failed') {
    return (
      <DashboardLayout>
        <div className="space-y-3 px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-600/10 rounded-xl blur-md" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-6 border-2 border-red-600/20 dark:bg-slate-800/80 dark:border-red-500/30 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Your payment could not be processed. Please try again.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('form')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/wallet')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}
