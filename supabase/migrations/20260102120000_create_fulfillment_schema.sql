-- Create required extension
create extension if not exists "pgcrypto";

-- Profiles table (mirror of auth.users for roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer',
  full_name text,
  created_at timestamptz default now()
);

-- Products (per-customer)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  sku text,
  image_url text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ebay_order_id text,
  buyer_name text,
  order_date timestamptz default now(),
  status text not null default 'Pending',
  courier_name text,
  tracking_number text,
  dispatch_date timestamptz,
  estimated_delivery_date timestamptz,
  delivery_status text,
  receiver_name text,
  delivery_address jsonb,
  product_details jsonb,
  created_at timestamptz default now()
);

-- Labels (images or generated PDFs)
create table if not exists public.labels (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  storage_path text,
  url text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable row level security
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.labels enable row level security;

-- Policy: allow customers to select/insert/update their own orders; admins can access all
create policy "customers_manage_own_orders" on public.orders
  for all
  using (
    auth.uid()::uuid = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  )
  with check (
    auth.uid()::uuid = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  );

create policy "customers_manage_own_products" on public.products
  for all
  using (
    auth.uid()::uuid = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  )
  with check (
    auth.uid()::uuid = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  );

create policy "customers_manage_own_labels" on public.labels
  for all
  using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid()::uuid))
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid()::uuid))
    or exists (select 1 from public.profiles p where p.id = auth.uid()::uuid and p.role = 'admin')
  );
