-- Comprehensive fix for profiles table constraint issue
-- Run this in Supabase SQL Editor

-- First, let's see what constraints exist
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND contype = 'c';

-- Drop ALL check constraints on role column
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check1;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check2;

-- Recreate the constraint properly
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'admin', 'seller'));

-- Ensure wallet_balance_cents column exists and is properly typed
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance_cents INTEGER DEFAULT 0;

-- Verify the constraint was created
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND contype = 'c';
