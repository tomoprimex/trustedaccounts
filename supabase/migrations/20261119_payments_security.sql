-- =====================================================================
-- TrustedAccounts: payments + security hardening
-- Run once in Supabase → SQL Editor. Safe to re-run (idempotent).
--
-- Fixes:
--  1. Users could make themselves admin (update own profile.role / sign up with role=admin).
--  2. Anyone (even logged out) could read passwords/emails of unsold accounts.
--  3. Users could set their own wallet balance (wallet insert/update policies).
--  4. Users could insert "completed" orders without paying.
--  5. deposits.payment_method rejected 'ercas'.
-- All money movement now happens server-side with the service-role key.
-- =====================================================================

-- ---------- helper: is the current user an admin? (no RLS recursion) ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- 1. profiles: users can't change their own role/status/balance ----------
-- Make sure the columns the app and triggers rely on exist (older databases lack some).
alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists wallet_balance_cents integer default 0;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.role() is 'authenticated' for browser requests, 'service_role' for the server, null in SQL editor.
  if coalesce(auth.role(), '') = 'authenticated' and not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.wallet_balance_cents := old.wallet_balance_cents;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_columns_trigger on public.profiles;
create trigger protect_profile_columns_trigger
before update on public.profiles
for each row execute function public.protect_profile_columns();

-- New users can only self-select customer or seller — never admin.
-- Never blocks signup: if a side insert fails it is logged (Postgres logs) instead of
-- surfacing as "Database error saving new user".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text := coalesce(new.raw_user_meta_data->>'role', 'customer');
begin
  begin
    insert into public.profiles (id, email, full_name, role, status)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      case when requested in ('customer', 'seller') then requested else 'customer' end,
      'active'
    )
    on conflict (id) do nothing;
  exception when others then
    raise warning 'handle_new_user: profile insert failed for %: %', new.id, sqlerrm;
    begin
      -- Minimal fallback row so the app still has a profile.
      insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
    exception when others then
      raise warning 'handle_new_user: fallback profile insert failed for %: %', new.id, sqlerrm;
    end;
  end;

  begin
    insert into public.customer_analytics (customer_id)
    values (new.id)
    on conflict do nothing;
  exception when others then
    raise warning 'handle_new_user: customer_analytics insert failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill profiles for any users created while the trigger was broken.
insert into public.profiles (id, email, full_name, role, status)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', ''), 'customer', 'active'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- ---------- 2. accounts: hide credentials from the public ----------
drop policy if exists "public can read available accounts" on public.accounts;

-- Buyers can read the full details of accounts they have paid for.
drop policy if exists "buyers can read purchased accounts" on public.accounts;
create policy "buyers can read purchased accounts"
on public.accounts for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.account_id = accounts.id
      and o.customer_id = auth.uid()
      and o.status = 'completed'
  )
);

-- Public marketplace view: every column EXCEPT secrets, plus a masked email hint.
do $$
declare
  cols text;
begin
  select string_agg(format('a.%I', column_name), ', ' order by ordinal_position)
    into cols
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'accounts'
    and column_name not in ('email', 'password', 'phone', 'seller_id')
    and column_name !~* '(password|secret|token|cookie|backup|recovery|2fa|two_fa|otp|session)';

  execute 'drop view if exists public.marketplace_accounts';
  execute format(
    $v$create view public.marketplace_accounts as
       select %s,
              case when a.email like '%%@%%'
                   then left(a.email, 2) || '•••@' || split_part(a.email, '@', 2)
              end as email_hint
       from public.accounts a
       where a.status = 'available'$v$,
    cols
  );
end $$;

grant select on public.marketplace_accounts to anon, authenticated;

-- Seller listings go through review: allow a 'pending' status and WhatsApp accounts.
alter table public.accounts drop constraint if exists accounts_status_check;
alter table public.accounts
  add constraint accounts_status_check
  check (status in ('pending', 'available', 'reserved', 'sold', 'removed')) not valid;

alter table public.accounts drop constraint if exists accounts_platform_check;
alter table public.accounts
  add constraint accounts_platform_check
  check (platform in ('facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'whatsapp')) not valid;

-- Sellers can see their listings but cannot self-publish or edit once live.
drop policy if exists "sellers can manage own accounts" on public.accounts;
drop policy if exists "sellers can read own accounts" on public.accounts;
create policy "sellers can read own accounts"
on public.accounts for select
to authenticated
using (seller_id = auth.uid());

-- Sections 3–5 skip any table/column that doesn't exist in this database.
do $$
begin
  -- ---------- 3. wallets: read-only for users ----------
  if to_regclass('public.wallets') is not null then
    execute 'drop policy if exists "users can create own wallet" on public.wallets';
    execute 'drop policy if exists "users can update own wallet" on public.wallets';
  end if;

  -- ---------- 4. deposits / orders: created by the server only ----------
  if to_regclass('public.deposits') is not null then
    execute 'drop policy if exists "users can create own deposits" on public.deposits';

    -- ---------- 5. deposits.payment_method accepts the gateways in use ----------
    if exists (select 1 from information_schema.columns
               where table_schema = 'public' and table_name = 'deposits' and column_name = 'payment_method') then
      execute 'alter table public.deposits drop constraint if exists deposits_payment_method_check';
      execute $c$alter table public.deposits
               add constraint deposits_payment_method_check
               check (payment_method in ('card', 'transfer', 'paystack', 'ercas')) not valid$c$;
    end if;

    if exists (select 1 from information_schema.columns
               where table_schema = 'public' and table_name = 'deposits' and column_name = 'payment_reference') then
      execute 'create index if not exists deposits_payment_reference_idx on public.deposits(payment_reference)';
    end if;
  end if;

  execute 'drop policy if exists "customers can create own orders" on public.orders';
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'orders' and column_name = 'payment_reference') then
    execute 'create index if not exists orders_payment_reference_idx on public.orders(payment_reference)';
  end if;
end $$;
