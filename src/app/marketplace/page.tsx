"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ShoppingCart, Shield, Sparkles, MessageCircle, Plus, ChevronRight, Globe, Users, Star, Check, X } from "lucide-react";
import { getMarketplaceAccounts, createPurchase } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { PaymentMethod } from "@/components/payment/paystack-payment";

const supabase = createClient();

const platformIcons: Record<string, string> = {
  facebook: "📘",
  instagram: "📷",
  youtube: "📺",
  tiktok: "🎵",
  twitter: "🐦",
  linkedin: "💼",
  whatsapp: "💬",
};

const platforms = [
  { id: "all", name: "All Platforms", icon: "🌐" },
  { id: "facebook", name: "Facebook", icon: "📘" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "youtube", name: "YouTube", icon: "📺" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "twitter", name: "Twitter", icon: "🐦" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬" },
];

const accountTypes = [
  { id: "all", name: "All Types" },
  { id: "personal", name: "Personal" },
  { id: "business", name: "Business" },
  { id: "creator", name: "Creator" },
  { id: "brand", name: "Brand" },
];

const countries = [
  { id: "all", name: "All Countries" },
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ng", name: "Nigeria" },
  { id: "ca", name: "Canada" },
  { id: "au", name: "Australia" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
];

const followerRanges = [
  { id: "all", name: "All Ranges" },
  { id: "0-1k", name: "0 - 1K" },
  { id: "1k-10k", name: "1K - 10K" },
  { id: "10k-100k", name: "10K - 100K" },
  { id: "100k-1m", name: "100K - 1M" },
  { id: "1m+", name: "1M+" },
];

export default function MarketplacePage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedAccountType, setSelectedAccountType] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedFollowerRange, setSelectedFollowerRange] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Seller form state
  const [sellerForm, setSellerForm] = useState({
    platform: "",
    username: "",
    email: "",
    password: "",
    recoveryEmail: "",
    followersCount: "",
    accountType: "",
    country: "",
    verified: false,
    price: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        const data = await getMarketplaceAccounts({ limit: 100 });
        setAccounts(data || []);
      } catch (error) {
        console.error('Error loading marketplace:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePurchase = (account: any) => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }

    setSelectedAccount(account);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (reference: string, method: 'ercas' | 'paystack' | 'wallet') => {
    setProcessing(true);
    try {
      await createPurchase(user.id, selectedAccount.id, method, reference);
      alert('Purchase successful! Your account credentials are now available in your dashboard.');
      setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      setShowPayment(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  const handleWalletPurchase = async () => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }

    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Please login to purchase');
        return;
      }

      const response = await fetch('/api/purchase-from-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Purchase successful! Your account credentials are now available in your dashboard.');
        setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
        setShowPayment(false);
        setSelectedAccount(null);
      } else {
        alert(result.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Error completing wallet purchase:', error);
      alert('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedAccount(null);
  };

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to sell accounts');
      return;
    }

    setSubmitting(true);
    try {
      // Here you would implement the actual account listing logic
      // For now, we'll just show a success message
      alert('Account listing submitted successfully! Your account will be reviewed and listed once approved.');
      setSellerForm({
        platform: "",
        username: "",
        email: "",
        password: "",
        recoveryEmail: "",
        followersCount: "",
        accountType: "",
        country: "",
        verified: false,
        price: "",
        description: "",
      });
    } catch (error) {
      console.error('Error submitting listing:', error);
      alert('Failed to submit listing');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const platformMatch = selectedPlatform === "all" || account.platform === selectedPlatform;
    const accountTypeMatch = selectedAccountType === "all" || account.account_type === selectedAccountType;
    const countryMatch = selectedCountry === "all" || account.country === selectedCountry;
    
    let followerMatch = true;
    if (selectedFollowerRange !== "all") {
      const followers = account.followers_count || 0;
      if (selectedFollowerRange === "0-1k") followerMatch = followers < 1000;
      else if (selectedFollowerRange === "1k-10k") followerMatch = followers >= 1000 && followers < 10000;
      else if (selectedFollowerRange === "10k-100k") followerMatch = followers >= 10000 && followers < 100000;
      else if (selectedFollowerRange === "100k-1m") followerMatch = followers >= 100000 && followers < 1000000;
      else if (selectedFollowerRange === "1m+") followerMatch = followers >= 1000000;
    }
    
    return platformMatch && accountTypeMatch && countryMatch && followerMatch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            currentStep >= step 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          }`}>
            {currentStep > step ? <Check size={14} /> : step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-0.5 transition-all ${
              currentStep > step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
                <ShoppingCart size={14} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                Marketplace
              </h1>
            </div>
            <a
              href="https://wa.link/tr16oc"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"
            >
              <MessageCircle size={16} className="text-white" />
            </a>
          </div>
          <p className="text-xs text-slate-500">Buy and sell verified social media accounts</p>
        </motion.div>

        {/* Buy/Sell Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-1 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
            <div className="flex gap-1">
              <button
                onClick={() => { setMode("buy"); setStep(1); }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "buy"
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Buy Accounts
              </button>
              <button
                onClick={() => { setMode("sell"); setStep(1); }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "sell"
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Sell Accounts
              </button>
            </div>
          </div>
        </motion.div>

        {mode === "buy" ? (
          <>
            {/* Step Indicator */}
            <StepIndicator currentStep={step} />

            {/* Step 1: Choose Platform */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Choose Platform</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => { setSelectedPlatform(platform.id); setStep(2); }}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedPlatform === platform.id
                            ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                            : 'border-slate-200 hover:border-blue-600/50 dark:border-slate-700 dark:hover:border-blue-500/50'
                        }`}
                      >
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Category */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Back to platforms
                </button>

                {/* Account Type */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Account Type</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {accountTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedAccountType(type.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedAccountType === type.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Country */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Country</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {countries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => setSelectedCountry(country.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedCountry === country.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {country.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Follower Count */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={14} className="text-blue-600 dark:text-blue-400" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Follower Count</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {followerRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setSelectedFollowerRange(range.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedFollowerRange === range.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {range.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => setStep(3)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20"
                >
                  Browse Accounts
                  <ChevronRight size={14} />
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Browse Accounts */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                {/* Back Button */}
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Back to filters
                </button>

                {/* Current Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {selectedPlatform !== "all" && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
                      {platforms.find(p => p.id === selectedPlatform)?.name}
                      <button onClick={() => setSelectedPlatform("all")} className="ml-2 hover:text-blue-900 dark:hover:text-blue-300">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {selectedAccountType !== "all" && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
                      {accountTypes.find(t => t.id === selectedAccountType)?.name}
                      <button onClick={() => setSelectedAccountType("all")} className="ml-2 hover:text-blue-900 dark:hover:text-blue-300">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {selectedCountry !== "all" && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
                      {countries.find(c => c.id === selectedCountry)?.name}
                      <button onClick={() => setSelectedCountry("all")} className="ml-2 hover:text-blue-900 dark:hover:text-blue-300">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {selectedFollowerRange !== "all" && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
                      {followerRanges.find(f => f.id === selectedFollowerRange)?.name}
                      <button onClick={() => setSelectedFollowerRange("all")} className="ml-2 hover:text-blue-900 dark:hover:text-blue-300">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Accounts Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {filteredAccounts.map((account, index) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.02 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                      <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
                        {/* Platform Logo */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center text-2xl mb-3">
                          {platformIcons[account.platform] || "🌐"}
                        </div>

                        {/* Account Details */}
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{account.username}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{account.email}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Users size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {(account.followers_count || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {account.country || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Verification Status */}
                        <div className="flex items-center gap-1 mb-3">
                          {account.verified ? (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-medium dark:bg-green-900/30 dark:text-green-400">
                              <Check size={10} />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium dark:bg-slate-700 dark:text-slate-400">
                              Unverified
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Price:</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">₦{(account.price_cents / 100).toLocaleString()}</span>
                        </div>

                        {/* Security Badge */}
                        <div className="flex items-center gap-1 mb-3 text-xs text-slate-400">
                          <Shield size={12} />
                          <span className="truncate">Secure</span>
                        </div>

                        {/* Purchase Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePurchase(account)}
                          disabled={processing}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart size={14} />
                          Buy Now
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty State */}
                {filteredAccounts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm text-center">
                      <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-3 dark:bg-blue-900/30">
                        <ShoppingCart size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">No accounts found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          /* Sell Mode - Seller Form */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/10 rounded-xl blur-md dark:from-blue-500/10 dark:to-blue-600/10" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border-2 border-blue-600/20 dark:bg-slate-800/80 dark:border-blue-500/30 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg">
                  <Plus size={14} className="text-white" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">List Your Account</h2>
              </div>

              <form onSubmit={handleSellerSubmit} className="space-y-3">
                {/* Platform */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                  <select
                    value={sellerForm.platform}
                    onChange={(e) => setSellerForm({...sellerForm, platform: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  >
                    <option value="">Select platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={sellerForm.username}
                    onChange={(e) => setSellerForm({...sellerForm, username: e.target.value})}
                    required
                    placeholder="Account username"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={sellerForm.email}
                    onChange={(e) => setSellerForm({...sellerForm, email: e.target.value})}
                    required
                    placeholder="Account email"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={sellerForm.password}
                    onChange={(e) => setSellerForm({...sellerForm, password: e.target.value})}
                    required
                    placeholder="Account password"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Recovery Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recovery Email (Optional)</label>
                  <input
                    type="email"
                    value={sellerForm.recoveryEmail}
                    onChange={(e) => setSellerForm({...sellerForm, recoveryEmail: e.target.value})}
                    placeholder="Recovery email"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Followers Count */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Follower Count</label>
                  <input
                    type="number"
                    value={sellerForm.followersCount}
                    onChange={(e) => setSellerForm({...sellerForm, followersCount: e.target.value})}
                    required
                    placeholder="Number of followers"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Account Type</label>
                  <select
                    value={sellerForm.accountType}
                    onChange={(e) => setSellerForm({...sellerForm, accountType: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  >
                    <option value="">Select type</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="creator">Creator</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <select
                    value={sellerForm.country}
                    onChange={(e) => setSellerForm({...sellerForm, country: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  >
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ng">Nigeria</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                  </select>
                </div>

                {/* Verified Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={sellerForm.verified}
                    onChange={(e) => setSellerForm({...sellerForm, verified: e.target.checked})}
                    className="w-4 h-4 rounded border-2 border-blue-600/20 dark:border-blue-500/30"
                  />
                  <label htmlFor="verified" className="text-xs font-medium text-slate-700 dark:text-slate-300">Verified Account</label>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={sellerForm.price}
                    onChange={(e) => setSellerForm({...sellerForm, price: e.target.value})}
                    required
                    placeholder="Listing price"
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    value={sellerForm.description}
                    onChange={(e) => setSellerForm({...sellerForm, description: e.target.value})}
                    placeholder="Account description and features"
                    rows={3}
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur border-2 border-blue-600/20 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none dark:bg-slate-700/50 dark:text-white dark:border-blue-500/30"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                  {submitting ? 'Submitting...' : 'Submit Listing'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedAccount && user && (
        <PaymentMethod
          amount={selectedAccount.price_cents / 100}
          email={user.email}
          accountId={selectedAccount.id}
          onSuccess={handlePaymentSuccess}
          onWalletPurchase={handleWalletPurchase}
          onClose={handlePaymentCancel}
          onCancel={handlePaymentCancel}
        />
      )}
    </DashboardLayout>
  );
}