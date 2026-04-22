-- Run this in the Supabase SQL editor

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('advertiser', 'owner')),
  name text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Spaces
create table spaces (
  id bigint generated always as identity primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  type text not null check (type in ('gym','car','vending','restaurant','billboard','office')),
  city text not null,
  location text not null,
  traffic integer not null default 0,
  price integer not null,
  format text,
  description text,
  image_url text,
  available boolean default true,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

alter table spaces enable row level security;

create policy "Anyone can read approved spaces"
  on spaces for select using (approved = true);

create policy "Owners can read own spaces"
  on spaces for select using (auth.uid() = owner_id);

create policy "Owners can insert own spaces"
  on spaces for insert with check (auth.uid() = owner_id);

create policy "Owners can update own spaces"
  on spaces for update using (auth.uid() = owner_id);

-- Contracts
create table contracts (
  id bigint generated always as identity primary key,
  space_id bigint references spaces(id) on delete cascade not null,
  advertiser_id uuid references profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'active', 'cancelled')),
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

alter table contracts enable row level security;

create policy "Advertisers can read own contracts"
  on contracts for select using (auth.uid() = advertiser_id);

create policy "Advertisers can insert contracts"
  on contracts for insert with check (auth.uid() = advertiser_id);

create policy "Space owners can read contracts for their spaces"
  on contracts for select
  using (exists (
    select 1 from spaces where spaces.id = contracts.space_id and spaces.owner_id = auth.uid()
  ));
