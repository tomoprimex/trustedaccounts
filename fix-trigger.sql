-- Fix the handle_new_user trigger to properly set role
-- Run this in Supabase SQL Editor

-- First, let's see the current trigger function
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Drop and recreate the trigger function with proper role handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    'active'
  );
  
  insert into public.customer_analytics (customer_id)
  values (new.id);
  
  return new;
end;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
