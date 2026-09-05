-- Run this in Supabase SQL Editor
-- TrustedAccounts - Social Media Login Sales Platform

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Profiles table - extends auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'seller')),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Accounts table - social media accounts for sale
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin')),
  username text not null,
  email text not null,
  password text not null,
  recovery_email text,
  recovery_phone text,
  two_factor_enabled boolean default false,
  two_factor_secret text,
  followers_count integer default 0,
  following_count integer default 0,
  posts_count integer default 0,
  account_age_months integer default 0,
  verified boolean default false,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'USD',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'removed')),
  description text,
  screenshots jsonb,
  seller_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders table - customer purchases
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  payment_reference text unique,
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'delivered', 'delayed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Revenue tracking
create table public.revenue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'USD',
  platform text,
  date date not null,
  created_at timestamptz not null default now()
);

-- Customer analytics
create table public.customer_analytics (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  total_orders integer default 0,
  total_spent_cents integer default 0,
  last_order_date timestamptz,
  favorite_platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id)
);

-- Settings table (for admin settings)
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index accounts_platform_idx on public.accounts(platform);
create index accounts_status_idx on public.accounts(status);
create index accounts_seller_idx on public.accounts(seller_id);
create index orders_customer_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(status);
create index orders_date_idx on public.orders(created_at);
create index revenue_date_idx on public.revenue(date);
create index customer_analytics_customer_idx on public.customer_analytics(customer_id);

-- Trigger to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  
  insert into public.customer_analytics (customer_id)
  values (new.id);
  
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger update_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger update_accounts_updated_at before update on public.accounts
for each row execute function public.update_updated_at_column();

create trigger update_orders_updated_at before update on public.orders
for each row execute function public.update_updated_at_column();

create trigger update_customer_analytics_updated_at before update on public.customer_analytics
for each row execute function public.update_updated_at_column();

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.orders enable row level security;
alter table public.revenue enable row level security;
alter table public.customer_analytics enable row level security;
alter table public.settings enable row level security;

-- RLS Policies for Profiles
create policy "users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admins can read all profiles"
on public.profiles for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- RLS Policies for Accounts
create policy "public can read available accounts"
on public.accounts for select
to anon, authenticated
using (status = 'available');

create policy "sellers can manage own accounts"
on public.accounts for all
to authenticated
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "admins can manage all accounts"
on public.accounts for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- RLS Policies for Orders
create policy "customers can read own orders"
on public.orders for select
to authenticated
using (customer_id = auth.uid());

create policy "customers can create own orders"
on public.orders for insert
to authenticated
with check (customer_id = auth.uid());

create policy "admins can read all orders"
on public.orders for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins can update all orders"
on public.orders for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- RLS Policies for Revenue
create policy "admins can read revenue"
on public.revenue for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins can insert revenue"
on public.revenue for insert
to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- RLS Policies for Customer Analytics
create policy "users can read own analytics"
on public.customer_analytics for select
to authenticated
using (customer_id = auth.uid());

create policy "admins can read all analytics"
on public.customer_analytics for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- RLS Policies for Settings
create policy "admins can read settings"
on public.settings for select
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins can update settings"
on public.settings for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Insert default settings
insert into public.settings (key, value) values
('platforms', '["facebook", "instagram", "youtube", "tiktok", "twitter", "linkedin"]'),
('currencies', '["USD", "EUR", "GBP", "NGN"]'),
('maintenance_mode', 'false')
on conflict (key) do nothing;

-- Function to generate order number
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  order_num text;
begin
  order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((random() * 10000)::int::text, 4, '0');
  return order_num;
end;
$$;
