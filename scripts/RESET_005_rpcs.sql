-- 022_marketplace_rpcs.sql
-- All marketplace RPC functions for state machine transitions

begin;

-- ============================================================
-- create_request_booking
-- Customer submits a booking request. Creates booking, parties,
-- conversation, members, system message, and hold blocks.
-- ============================================================
create or replace function public.create_request_booking(
  p_customer_id uuid,
  p_mode public.booking_mode,
  p_studio_id uuid default null,
  p_creator_id uuid default null,
  p_package_id uuid default null,
  p_booking_date date default null,
  p_start_time time default null,
  p_end_time time default null,
  p_duration_hours integer default 2,
  p_customer_note text default null,
  p_addon_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_booking_id uuid;
  v_conv_id uuid;
  v_subtotal integer := 0;
  v_addon_total integer := 0;
  v_fee integer;
  v_total integer;
  v_deposit integer;
  v_pkg_price integer := 0;
  v_studio_owner uuid;
  v_creator_owner uuid;
  v_aid uuid;
  v_addon_price integer;
begin
  -- Get package price
  if p_package_id is not null then
    select price_cents into v_pkg_price from marketplace_packages where id = p_package_id and is_active;
    if v_pkg_price is null then raise exception 'Package not found or inactive'; end if;
  end if;

  v_subtotal := v_pkg_price;

  -- Calculate addon totals
  if array_length(p_addon_ids, 1) > 0 then
    foreach v_aid in array p_addon_ids loop
      select price_cents into v_addon_price from addons where id = v_aid and is_active;
      if v_addon_price is not null then
        v_addon_total := v_addon_total + v_addon_price;
      end if;
    end loop;
  end if;

  v_subtotal := v_subtotal + v_addon_total;
  v_fee := (v_subtotal * 8) / 100;  -- 8% service fee
  v_total := v_subtotal + v_fee;
  v_deposit := v_total / 2;          -- 50% deposit

  -- Create booking
  insert into marketplace_bookings (
    customer_id, mode, studio_id, creator_id, package_id,
    booking_date, start_time, end_time, duration_hours,
    status, subtotal_cents, service_fee_cents, total_cents, deposit_cents, balance_cents,
    customer_note, request_expires_at
  ) values (
    p_customer_id, p_mode, p_studio_id, p_creator_id, p_package_id,
    p_booking_date, p_start_time, p_end_time, p_duration_hours,
    'requested', v_subtotal, v_fee, v_total, v_deposit, v_total - v_deposit,
    p_customer_note, now() + interval '24 hours'
  ) returning id into v_booking_id;

  -- Insert addons
  if array_length(p_addon_ids, 1) > 0 then
    foreach v_aid in array p_addon_ids loop
      select price_cents into v_addon_price from addons where id = v_aid and is_active;
      if v_addon_price is not null then
        insert into booking_addons (booking_id, addon_id, quantity, unit_price_cents)
        values (v_booking_id, v_aid, 1, v_addon_price);
      end if;
    end loop;
  end if;

  -- Create booking parties
  if p_studio_id is not null then
    select owner_profile_id into v_studio_owner from emma_studios where id = p_studio_id;
    if v_studio_owner is not null then
      insert into booking_parties (booking_id, party_type, party_listing_id, owner_profile_id)
      values (v_booking_id, 'studio', p_studio_id, v_studio_owner);
    end if;
  end if;

  if p_creator_id is not null then
    select owner_profile_id into v_creator_owner from emma_creators where id = p_creator_id;
    if v_creator_owner is not null then
      insert into booking_parties (booking_id, party_type, party_listing_id, owner_profile_id)
      values (v_booking_id, 'creator', p_creator_id, v_creator_owner);
    end if;
  end if;

  -- Create conversation
  insert into mp_conversations (booking_id)
  values (v_booking_id) returning id into v_conv_id;

  -- Add customer to conversation
  insert into conversation_members (conversation_id, profile_id, role)
  values (v_conv_id, p_customer_id, 'customer');

  -- Add party owners to conversation
  if v_studio_owner is not null then
    insert into conversation_members (conversation_id, profile_id, role)
    values (v_conv_id, v_studio_owner, 'studio_owner')
    on conflict (conversation_id, profile_id) do nothing;
  end if;

  if v_creator_owner is not null then
    insert into conversation_members (conversation_id, profile_id, role)
    values (v_conv_id, v_creator_owner, 'creator_owner')
    on conflict (conversation_id, profile_id) do nothing;
  end if;

  -- System message
  insert into mp_messages (conversation_id, sender_id, content, message_type)
  values (v_conv_id, p_customer_id, 'Booking request submitted. Waiting for confirmation from all parties.', 'system');

  -- Create hold blocks for the requested time
  if p_studio_id is not null then
    insert into calendar_busy_blocks (listing_type, listing_id, source, source_id, start_time, end_time, booking_id)
    values ('studio', p_studio_id, 'internal_hold', v_booking_id::text,
      (p_booking_date + p_start_time)::timestamptz,
      (p_booking_date + p_end_time)::timestamptz,
      v_booking_id);
  end if;

  if p_creator_id is not null then
    insert into calendar_busy_blocks (listing_type, listing_id, source, source_id, start_time, end_time, booking_id)
    values ('creator', p_creator_id, 'internal_hold', v_booking_id::text,
      (p_booking_date + p_start_time)::timestamptz,
      (p_booking_date + p_end_time)::timestamptz,
      v_booking_id);
  end if;

  return v_booking_id;
end;
$$;

-- ============================================================
-- accept_booking
-- A party owner accepts the booking. If all parties accepted,
-- transitions to party_confirmed (then pending_payment with 2h hold).
-- ============================================================
create or replace function public.accept_booking(
  p_booking_id uuid,
  p_profile_id uuid default auth.uid()
)
returns void
language plpgsql
security definer
as $$
declare
  v_booking marketplace_bookings%rowtype;
  v_all_accepted boolean;
begin
  -- Lock the booking row
  select * into v_booking from marketplace_bookings where id = p_booking_id for update;
  
  if v_booking is null then raise exception 'Booking not found'; end if;
  if v_booking.status not in ('requested') then raise exception 'Booking cannot be accepted in current state: %', v_booking.status; end if;

  -- Update the party decision
  update booking_parties
  set decision = 'accepted', decided_at = now()
  where booking_id = p_booking_id
    and owner_profile_id = p_profile_id
    and decision = 'pending';

  if not found then raise exception 'You are not a pending party on this booking'; end if;

  -- Check if all parties accepted
  select not exists(
    select 1 from booking_parties where booking_id = p_booking_id and decision != 'accepted'
  ) into v_all_accepted;

  if v_all_accepted then
    -- Transition to pending_payment with 2h hold
    update marketplace_bookings
    set status = 'pending_payment',
        hold_expires_at = now() + interval '2 hours',
        updated_at = now()
    where id = p_booking_id;

    -- Post system message
    insert into mp_messages (conversation_id, sender_id, content, message_type)
    select c.id, p_profile_id, 'All parties have accepted! Customer has 2 hours to pay the deposit.', 'system'
    from mp_conversations c where c.booking_id = p_booking_id;
  else
    -- Post accept message
    insert into mp_messages (conversation_id, sender_id, content, message_type)
    select c.id, p_profile_id, 'Party has accepted the booking.', 'system'
    from mp_conversations c where c.booking_id = p_booking_id;
  end if;
end;
$$;

-- ============================================================
-- decline_booking
-- A party declines. Booking transitions to declined.
-- Removes hold blocks.
-- ============================================================
create or replace function public.decline_booking(
  p_booking_id uuid,
  p_profile_id uuid default auth.uid(),
  p_reason text default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_booking marketplace_bookings%rowtype;
begin
  select * into v_booking from marketplace_bookings where id = p_booking_id for update;
  
  if v_booking is null then raise exception 'Booking not found'; end if;
  if v_booking.status not in ('requested', 'pending_payment') then
    raise exception 'Booking cannot be declined in current state: %', v_booking.status;
  end if;

  -- Update party decision
  update booking_parties
  set decision = 'declined', decided_at = now()
  where booking_id = p_booking_id
    and owner_profile_id = p_profile_id
    and decision = 'pending';

  -- Transition booking to declined
  update marketplace_bookings
  set status = 'declined',
      decline_reason = coalesce(p_reason, 'Declined by party'),
      updated_at = now()
  where id = p_booking_id;

  -- Remove hold blocks
  delete from calendar_busy_blocks where booking_id = p_booking_id and source = 'internal_hold';

  -- Post system message
  insert into mp_messages (conversation_id, sender_id, content, message_type)
  select c.id, p_profile_id,
    'Booking has been declined.' || case when p_reason is not null then ' Reason: ' || p_reason else '' end,
    'system'
  from mp_conversations c where c.booking_id = p_booking_id;
end;
$$;

-- ============================================================
-- create_payment_intent_rpc
-- Creates a payment record for the booking deposit.
-- ============================================================
create or replace function public.create_payment_intent_rpc(
  p_booking_id uuid,
  p_profile_id uuid default auth.uid()
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_booking marketplace_bookings%rowtype;
  v_payment_id uuid;
begin
  select * into v_booking from marketplace_bookings where id = p_booking_id for update;
  
  if v_booking is null then raise exception 'Booking not found'; end if;
  if v_booking.status != 'pending_payment' then raise exception 'Booking not in payment state'; end if;
  if v_booking.customer_id != p_profile_id then raise exception 'Only the customer can pay'; end if;

  -- Check for existing pending payment
  select id into v_payment_id from marketplace_payments
  where booking_id = p_booking_id and status = 'pending' limit 1;

  if v_payment_id is not null then
    return v_payment_id;
  end if;

  insert into marketplace_payments (booking_id, amount_cents, payment_type, status)
  values (p_booking_id, v_booking.deposit_cents, 'deposit', 'pending')
  returning id into v_payment_id;

  return v_payment_id;
end;
$$;

-- ============================================================
-- mark_booking_paid
-- Called after Stripe webhook confirms payment.
-- Transitions booking to confirmed, converts holds to booking blocks.
-- ============================================================
create or replace function public.mark_booking_paid(
  p_booking_id uuid,
  p_payment_id uuid,
  p_stripe_pi_id text
)
returns void
language plpgsql
security definer
as $$
declare
  v_booking marketplace_bookings%rowtype;
begin
  select * into v_booking from marketplace_bookings where id = p_booking_id for update;
  
  if v_booking is null then raise exception 'Booking not found'; end if;
  -- Idempotency: if already confirmed, just update payment
  if v_booking.status = 'confirmed' then
    update marketplace_payments set status = 'succeeded', stripe_payment_intent_id = p_stripe_pi_id, updated_at = now()
    where id = p_payment_id;
    return;
  end if;
  if v_booking.status != 'pending_payment' then raise exception 'Booking not in payment state: %', v_booking.status; end if;

  -- Update payment
  update marketplace_payments
  set status = 'succeeded', stripe_payment_intent_id = p_stripe_pi_id, updated_at = now()
  where id = p_payment_id;

  -- Confirm booking
  update marketplace_bookings
  set status = 'confirmed', hold_expires_at = null, updated_at = now()
  where id = p_booking_id;

  -- Convert holds to confirmed booking blocks
  update calendar_busy_blocks
  set source = 'confirmed_booking'
  where booking_id = p_booking_id and source = 'internal_hold';

  -- Post system message
  insert into mp_messages (conversation_id, sender_id, content, message_type)
  select c.id, v_booking.customer_id, 'Payment received! Booking is confirmed.', 'system'
  from mp_conversations c where c.booking_id = p_booking_id;
end;
$$;

-- ============================================================
-- propose_change
-- ============================================================
create or replace function public.propose_change(
  p_booking_id uuid,
  p_requested_by uuid default auth.uid(),
  p_change_type text default 'reschedule',
  p_old_value jsonb default null,
  p_new_value jsonb default null,
  p_reason text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_cr_id uuid;
begin
  insert into booking_change_requests (booking_id, requested_by, change_type, old_value, new_value, reason)
  values (p_booking_id, p_requested_by, p_change_type, p_old_value, p_new_value, p_reason)
  returning id into v_cr_id;

  insert into mp_messages (conversation_id, sender_id, content, message_type, metadata)
  select c.id, p_requested_by, 'A change has been proposed: ' || p_change_type, 'system',
    jsonb_build_object('change_request_id', v_cr_id)
  from mp_conversations c where c.booking_id = p_booking_id;

  return v_cr_id;
end;
$$;

-- ============================================================
-- accept_change
-- ============================================================
create or replace function public.accept_change(
  p_change_id uuid,
  p_decided_by uuid default auth.uid()
)
returns void
language plpgsql
security definer
as $$
begin
  update booking_change_requests
  set status = 'accepted', decided_by = p_decided_by, decided_at = now()
  where id = p_change_id and status = 'proposed';

  if not found then raise exception 'Change request not found or already decided'; end if;
end;
$$;

-- ============================================================
-- reject_change
-- ============================================================
create or replace function public.reject_change(
  p_change_id uuid,
  p_decided_by uuid default auth.uid()
)
returns void
language plpgsql
security definer
as $$
begin
  update booking_change_requests
  set status = 'rejected', decided_by = p_decided_by, decided_at = now()
  where id = p_change_id and status = 'proposed';

  if not found then raise exception 'Change request not found or already decided'; end if;
end;
$$;

-- ============================================================
-- expire_holds_and_requests
-- Called via cron. Expires timed-out requests and payment holds.
-- ============================================================
create or replace function public.expire_holds_and_requests()
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer := 0;
  v_rec record;
begin
  -- Expire requests past 24h
  for v_rec in
    select id from marketplace_bookings
    where status = 'requested' and request_expires_at < now()
    for update skip locked
  loop
    update marketplace_bookings set status = 'expired', updated_at = now() where id = v_rec.id;
    delete from calendar_busy_blocks where booking_id = v_rec.id and source = 'internal_hold';
    
    insert into mp_messages (conversation_id, sender_id, content, message_type)
    select c.id, customer_id, 'Booking request expired (no response within 24 hours).', 'system'
    from mp_conversations c
    join marketplace_bookings mb on mb.id = c.booking_id
    where c.booking_id = v_rec.id;
    
    v_count := v_count + 1;
  end loop;

  -- Expire payment holds past 2h
  for v_rec in
    select id from marketplace_bookings
    where status = 'pending_payment' and hold_expires_at < now()
    for update skip locked
  loop
    update marketplace_bookings set status = 'expired', updated_at = now() where id = v_rec.id;
    delete from calendar_busy_blocks where booking_id = v_rec.id and source = 'internal_hold';
    update marketplace_payments set status = 'failed', updated_at = now()
    where booking_id = v_rec.id and status = 'pending';
    
    insert into mp_messages (conversation_id, sender_id, content, message_type)
    select c.id, customer_id, 'Booking expired (payment not received within 2 hours).', 'system'
    from mp_conversations c
    join marketplace_bookings mb on mb.id = c.booking_id
    where c.booking_id = v_rec.id;
    
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

-- ============================================================
-- Admin override RPCs
-- ============================================================
create or replace function public.admin_set_booking_status(
  p_booking_id uuid,
  p_status public.booking_status,
  p_note text default null
)
returns void
language plpgsql
security definer
as $$
begin
  if not is_admin(auth.uid()) then raise exception 'Admin access required'; end if;
  
  update marketplace_bookings set status = p_status, updated_at = now() where id = p_booking_id;

  if p_note is not null then
    insert into mp_messages (conversation_id, sender_id, content, message_type)
    select c.id, auth.uid(), 'Admin action: Status changed to ' || p_status || '. ' || coalesce(p_note, ''), 'system'
    from mp_conversations c where c.booking_id = p_booking_id;
  end if;
end;
$$;

create or replace function public.admin_extend_hold(
  p_booking_id uuid,
  p_new_expiry timestamptz
)
returns void
language plpgsql
security definer
as $$
begin
  if not is_admin(auth.uid()) then raise exception 'Admin access required'; end if;
  
  update marketplace_bookings set hold_expires_at = p_new_expiry, updated_at = now()
  where id = p_booking_id;
end;
$$;

create or replace function public.admin_mark_paid_offline(
  p_booking_id uuid,
  p_amount_cents integer,
  p_reference text
)
returns void
language plpgsql
security definer
as $$
begin
  if not is_admin(auth.uid()) then raise exception 'Admin access required'; end if;
  
  insert into marketplace_payments (booking_id, amount_cents, payment_type, status, stripe_payment_intent_id)
  values (p_booking_id, p_amount_cents, 'offline', 'succeeded', p_reference);

  update marketplace_bookings
  set status = 'confirmed', hold_expires_at = null, updated_at = now()
  where id = p_booking_id;

  update calendar_busy_blocks
  set source = 'confirmed_booking'
  where booking_id = p_booking_id and source = 'internal_hold';
end;
$$;

commit;
