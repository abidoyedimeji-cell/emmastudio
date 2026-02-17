-- RESET SCRIPT: Run this first to drop all tables
-- Then run RESET_002, RESET_003, RESET_004

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS booking_availability_trigger ON emma_bookings;
DROP TRIGGER IF EXISTS trigger_notify_booking_confirmed ON emma_bookings;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.check_availability_conflict CASCADE;
DROP FUNCTION IF EXISTS public.create_booking_availability CASCADE;
DROP FUNCTION IF EXISTS public.is_participant_available CASCADE;
DROP FUNCTION IF EXISTS public.is_studio_owner CASCADE;
DROP FUNCTION IF EXISTS public.is_creator_owner CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.notify_booking_confirmed CASCADE;
DROP FUNCTION IF EXISTS public.create_request_booking CASCADE;
DROP FUNCTION IF EXISTS public.accept_booking CASCADE;
DROP FUNCTION IF EXISTS public.decline_booking CASCADE;
DROP FUNCTION IF EXISTS public.create_payment_intent CASCADE;
DROP FUNCTION IF EXISTS public.mark_booking_paid CASCADE;
DROP FUNCTION IF EXISTS public.propose_change CASCADE;
DROP FUNCTION IF EXISTS public.accept_change CASCADE;
DROP FUNCTION IF EXISTS public.reject_change CASCADE;
DROP FUNCTION IF EXISTS public.expire_holds_and_requests CASCADE;
DROP FUNCTION IF EXISTS public.admin_set_booking_status CASCADE;
DROP FUNCTION IF EXISTS public.admin_extend_hold CASCADE;
DROP FUNCTION IF EXISTS public.admin_mark_paid_offline CASCADE;

-- Drop marketplace tables
DROP TABLE IF EXISTS public.marketplace_payments CASCADE;
DROP TABLE IF EXISTS public.booking_change_requests CASCADE;
DROP TABLE IF EXISTS public.calendar_busy_blocks CASCADE;
DROP TABLE IF EXISTS public.calendar_connections CASCADE;
DROP TABLE IF EXISTS public.mp_messages CASCADE;
DROP TABLE IF EXISTS public.conversation_members CASCADE;
DROP TABLE IF EXISTS public.mp_conversations CASCADE;
DROP TABLE IF EXISTS public.booking_addons CASCADE;
DROP TABLE IF EXISTS public.booking_parties CASCADE;
DROP TABLE IF EXISTS public.marketplace_bookings CASCADE;
DROP TABLE IF EXISTS public.addons CASCADE;
DROP TABLE IF EXISTS public.marketplace_packages CASCADE;

-- Drop enums
DROP TYPE IF EXISTS public.listing_type CASCADE;
DROP TYPE IF EXISTS public.booking_mode CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.party_decision CASCADE;
DROP TYPE IF EXISTS public.change_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.block_source CASCADE;

-- Drop core tables (order matters for foreign keys)
DROP TABLE IF EXISTS public.disputes CASCADE;
DROP TABLE IF EXISTS public.payouts CASCADE;
DROP TABLE IF EXISTS public.booking_messages CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.availability_slots CASCADE;
DROP TABLE IF EXISTS public.availability_blocks CASCADE;
DROP TABLE IF EXISTS public.booking_packages CASCADE;
DROP TABLE IF EXISTS public.booking_participants CASCADE;
DROP TABLE IF EXISTS public.emma_featured_works CASCADE;
DROP TABLE IF EXISTS public.emma_favorites CASCADE;
DROP TABLE IF EXISTS public.emma_reviews CASCADE;
DROP TABLE IF EXISTS public.emma_services CASCADE;
DROP TABLE IF EXISTS public.emma_faqs CASCADE;
DROP TABLE IF EXISTS public.emma_packages CASCADE;
DROP TABLE IF EXISTS public.emma_bookings CASCADE;
DROP TABLE IF EXISTS public.emma_creators CASCADE;
DROP TABLE IF EXISTS public.emma_studios CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.emma_profiles CASCADE;
