-- 021_marketplace_schema.sql
-- Full marketplace schema: enums, tables, indexes, RLS

begin;

-- ===== ENUMS =====
do $$ begin
  create type public.listing_type as enum ('studio','creator');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_mode as enum ('studio_only','creator_only','bundle');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_status as enum (
    'requested','party_confirmed','pending_payment','confirmed',
    'in_progress','completed','cancelled','declined','expired','disputed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.party_decision as enum ('pending','accepted','declined');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.change_status as enum ('proposed','accepted','rejected','expired');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pending','succeeded','failed','refunded');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.block_source as enum ('external_ical','internal_hold','confirmed_booking');
exception when duplicate_object then null;
end $$;

-- ===== MARKETPLACE PACKAGES =====
create table if not exists public.marketplace_packages (
  id uuid primary key default gen_random_uuid(),
  listing_type public.listing_type not null,
  listing_id uuid not null,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  duration_hours integer not null default 1 check (duration_hours > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== ADDONS =====
create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  listing_type public.listing_type not null,
  listing_id uuid not null,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== MARKETPLACE BOOKINGS =====
create table if not exists public.marketplace_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  mode public.booking_mode not null,
  studio_id uuid references public.emma_studios(id),
  creator_id uuid references public.emma_creators(id),
  package_id uuid references public.marketplace_packages(id),
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  duration_hours integer not null default 2 check (duration_hours > 0),
  status public.booking_status not null default 'requested',
  subtotal_cents integer not null default 0,
  service_fee_cents integer not null default 0,
  total_cents integer not null default 0,
  deposit_cents integer not null default 0,
  balance_cents integer not null default 0,
  customer_note text,
  decline_reason text,
  request_expires_at timestamptz,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_booking_time check (end_time > start_time)
);

-- ===== BOOKING PARTIES =====
create table if not exists public.booking_parties (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings(id) on delete cascade,
  party_type public.listing_type not null,
  party_listing_id uuid not null,
  owner_profile_id uuid not null references public.profiles(id),
  decision public.party_decision not null default 'pending',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

-- ===== BOOKING ADDONS =====
create table if not exists public.booking_addons (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings(id) on delete cascade,
  addon_id uuid not null references public.addons(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null
);

-- ===== CONVERSATIONS =====
create table if not exists public.mp_conversations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.mp_conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id),
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(conversation_id, profile_id)
);

create table if not exists public.mp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.mp_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  message_type text not null default 'text',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ===== CALENDAR =====
create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  listing_type public.listing_type not null,
  listing_id uuid not null,
  ical_url text not null,
  last_synced_at timestamptz,
  sync_error text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.calendar_busy_blocks (
  id uuid primary key default gen_random_uuid(),
  listing_type public.listing_type not null,
  listing_id uuid not null,
  source public.block_source not null,
  source_id text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  booking_id uuid references public.marketplace_bookings(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ===== CHANGE REQUESTS =====
create table if not exists public.booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  change_type text not null,
  old_value jsonb,
  new_value jsonb,
  reason text,
  status public.change_status not null default 'proposed',
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

-- ===== MARKETPLACE PAYMENTS =====
create table if not exists public.marketplace_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.marketplace_bookings(id) on delete cascade,
  amount_cents integer not null,
  payment_type text not null default 'deposit',
  status public.payment_status not null default 'pending',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== INDEXES =====
create index if not exists idx_mp_bookings_customer on public.marketplace_bookings(customer_id);
create index if not exists idx_mp_bookings_status on public.marketplace_bookings(status);
create index if not exists idx_mp_bookings_studio on public.marketplace_bookings(studio_id);
create index if not exists idx_mp_bookings_creator on public.marketplace_bookings(creator_id);
create index if not exists idx_mp_bookings_date on public.marketplace_bookings(booking_date);
create index if not exists idx_booking_parties_booking on public.booking_parties(booking_id);
create index if not exists idx_booking_parties_owner on public.booking_parties(owner_profile_id);
create index if not exists idx_mp_conversations_booking on public.mp_conversations(booking_id);
create index if not exists idx_mp_messages_conversation on public.mp_messages(conversation_id, created_at desc);
create index if not exists idx_calendar_busy_listing on public.calendar_busy_blocks(listing_type, listing_id, start_time, end_time);
create index if not exists idx_mp_payments_booking on public.marketplace_payments(booking_id);
create index if not exists idx_change_requests_booking on public.booking_change_requests(booking_id);

-- ===== RLS POLICIES =====
alter table public.marketplace_bookings enable row level security;
alter table public.booking_parties enable row level security;
alter table public.mp_conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.mp_messages enable row level security;
alter table public.marketplace_payments enable row level security;
alter table public.booking_change_requests enable row level security;
alter table public.marketplace_packages enable row level security;
alter table public.addons enable row level security;
alter table public.booking_addons enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.calendar_busy_blocks enable row level security;

-- Bookings: customer + party owners + admins can view
drop policy if exists "Users can view own bookings" on public.marketplace_bookings;
create policy "Users can view own bookings" on public.marketplace_bookings
  for select to authenticated using (
    customer_id = auth.uid()
    or exists (select 1 from booking_parties bp where bp.booking_id = id and bp.owner_profile_id = auth.uid())
    or is_admin(auth.uid())
  );

-- Bookings: authenticated can insert (will be done via RPC)
drop policy if exists "Authenticated can create bookings" on public.marketplace_bookings;
create policy "Authenticated can create bookings" on public.marketplace_bookings
  for insert to authenticated with check (customer_id = auth.uid());

-- Bookings: update via RPC (service role)
drop policy if exists "Service role can update bookings" on public.marketplace_bookings;
create policy "Service role can update bookings" on public.marketplace_bookings
  for update to authenticated using (
    customer_id = auth.uid()
    or exists (select 1 from booking_parties bp where bp.booking_id = id and bp.owner_profile_id = auth.uid())
    or is_admin(auth.uid())
  );

-- Parties: booking participants can view
drop policy if exists "Users can view booking parties" on public.booking_parties;
create policy "Users can view booking parties" on public.booking_parties
  for select to authenticated using (
    owner_profile_id = auth.uid()
    or exists (select 1 from marketplace_bookings mb where mb.id = booking_id and mb.customer_id = auth.uid())
    or is_admin(auth.uid())
  );

-- Packages: everyone can view active
drop policy if exists "Anyone can view active packages" on public.marketplace_packages;
create policy "Anyone can view active packages" on public.marketplace_packages
  for select to authenticated using (is_active = true or is_admin(auth.uid()));

-- Addons: everyone can view active
drop policy if exists "Anyone can view active addons" on public.addons;
create policy "Anyone can view active addons" on public.addons
  for select to authenticated using (is_active = true or is_admin(auth.uid()));

-- Booking addons: booking participants can view
drop policy if exists "Users can view booking addons" on public.booking_addons;
create policy "Users can view booking addons" on public.booking_addons
  for select to authenticated using (
    exists (
      select 1 from marketplace_bookings mb
      where mb.id = booking_id
      and (mb.customer_id = auth.uid() or is_admin(auth.uid())
        or exists (select 1 from booking_parties bp where bp.booking_id = mb.id and bp.owner_profile_id = auth.uid()))
    )
  );

-- Conversations: members can view
drop policy if exists "Members can view conversations" on public.mp_conversations;
create policy "Members can view conversations" on public.mp_conversations
  for select to authenticated using (
    exists (select 1 from conversation_members cm where cm.conversation_id = id and cm.profile_id = auth.uid())
    or is_admin(auth.uid())
  );

-- Conversation members: members can view
drop policy if exists "Members can view members" on public.conversation_members;
create policy "Members can view members" on public.conversation_members
  for select to authenticated using (
    profile_id = auth.uid()
    or exists (select 1 from conversation_members cm2 where cm2.conversation_id = conversation_id and cm2.profile_id = auth.uid())
    or is_admin(auth.uid())
  );

-- Messages: conversation members can view and insert
drop policy if exists "Members can view messages" on public.mp_messages;
create policy "Members can view messages" on public.mp_messages
  for select to authenticated using (
    exists (select 1 from conversation_members cm where cm.conversation_id = conversation_id and cm.profile_id = auth.uid())
    or is_admin(auth.uid())
  );

drop policy if exists "Members can send messages" on public.mp_messages;
create policy "Members can send messages" on public.mp_messages
  for insert to authenticated with check (
    sender_id = auth.uid()
    and exists (select 1 from conversation_members cm where cm.conversation_id = conversation_id and cm.profile_id = auth.uid())
  );

-- Payments: booking participants can view
drop policy if exists "Users can view payments" on public.marketplace_payments;
create policy "Users can view payments" on public.marketplace_payments
  for select to authenticated using (
    exists (
      select 1 from marketplace_bookings mb
      where mb.id = booking_id
      and (mb.customer_id = auth.uid() or is_admin(auth.uid())
        or exists (select 1 from booking_parties bp where bp.booking_id = mb.id and bp.owner_profile_id = auth.uid()))
    )
  );

-- Change requests: booking participants can view
drop policy if exists "Users can view change requests" on public.booking_change_requests;
create policy "Users can view change requests" on public.booking_change_requests
  for select to authenticated using (
    requested_by = auth.uid()
    or exists (
      select 1 from marketplace_bookings mb
      where mb.id = booking_id
      and (mb.customer_id = auth.uid() or is_admin(auth.uid())
        or exists (select 1 from booking_parties bp where bp.booking_id = mb.id and bp.owner_profile_id = auth.uid()))
    )
  );

-- Calendar connections: owners can view/manage
drop policy if exists "Owners can view calendar connections" on public.calendar_connections;
create policy "Owners can view calendar connections" on public.calendar_connections
  for select to authenticated using (
    (listing_type = 'studio' and is_studio_owner(listing_id, auth.uid()))
    or (listing_type = 'creator' and is_creator_owner(listing_id, auth.uid()))
    or is_admin(auth.uid())
  );

-- Calendar busy blocks: everyone can read (for availability display)
drop policy if exists "Anyone can view busy blocks" on public.calendar_busy_blocks;
create policy "Anyone can view busy blocks" on public.calendar_busy_blocks
  for select to authenticated using (true);

-- Admin full access policies for packages and addons management
drop policy if exists "Admins can manage packages" on public.marketplace_packages;
create policy "Admins can manage packages" on public.marketplace_packages
  for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

drop policy if exists "Admins can manage addons" on public.addons;
create policy "Admins can manage addons" on public.addons
  for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

commit;
