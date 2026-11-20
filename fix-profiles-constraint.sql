-- Fix the profiles role check constraint to allow 'admin'
-- Drop the existing constraint and recreate it

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'admin', 'seller'));

-- Also ensure wallet_balance_cents column exists (from wallet schema)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance_cents INTEGER DEFAULT 0;
