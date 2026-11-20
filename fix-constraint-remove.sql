-- Remove the problematic constraint entirely
-- Run this in Supabase SQL Editor

-- Drop the role check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Verify it's dropped
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND contype = 'c';
