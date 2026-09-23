-- Add wallet balance to profiles table
ALTER TABLE public.profiles ADD COLUMN wallet_balance_cents INTEGER DEFAULT 0 CHECK (wallet_balance_cents >= 0);

-- Create wallets table for tracking deposits
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'NGN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Create deposits table for tracking deposit transactions
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'transfer')),
  payment_reference TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for deposits
CREATE INDEX IF NOT EXISTS deposits_user_idx ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS deposits_status_idx ON public.deposits(status);
CREATE INDEX IF NOT EXISTS deposits_date_idx ON public.deposits(created_at DESC);

-- Create index for wallets
CREATE INDEX IF NOT EXISTS wallets_user_idx ON public.wallets(user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_wallets_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_wallets_updated_at_trigger
BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION public.update_wallets_updated_at();

CREATE TRIGGER update_deposits_updated_at_trigger
BEFORE UPDATE ON public.deposits
FOR EACH ROW EXECUTE FUNCTION public.update_wallets_updated_at();

-- RLS Policies for wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own wallet"
ON public.wallets FOR SELECT
TO AUTHENTICATED
USING (user_id = auth.uid());

CREATE POLICY "users can create own wallet"
ON public.wallets FOR INSERT
TO AUTHENTICATED
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own wallet"
ON public.wallets FOR UPDATE
TO AUTHENTICATED
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for deposits
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own deposits"
ON public.deposits FOR SELECT
TO AUTHENTICATED
USING (user_id = auth.uid());

CREATE POLICY "users can create own deposits"
ON public.deposits FOR INSERT
TO AUTHENTICATED
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins can read all deposits"
ON public.deposits FOR SELECT
TO AUTHENTICATED
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));
