-- CONSOLIDATED FOUNDATION MIGRATION
-- Combines scripts 001, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015, 017, 018, 019, 020
-- Run this FIRST on a fresh Supabase project

-- ==========================================
-- 1. CORE TABLES (from 001)
-- ==========================================

-- emma_profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.emma_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'creator', 'studio_owner', 'admin')) DEFAULT 'client',
  role TEXT CHECK (role IN ('client', 'creator', 'studio')),
  postcode TEXT,
  city TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  onboarding_step TEXT CHECK (onboarding_step IN ('role_selection', 'profile', 'packages', 'availability', 'complete')),
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.emma_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.emma_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.emma_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.emma_profiles FOR DELETE USING (auth.uid() = id);

-- profiles table (used by auth system)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  first_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('client', 'creator', 'studio')),
  is_admin BOOLEAN DEFAULT false,
  onboarding_step TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_answers JSONB DEFAULT '{}'::jsonb,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  address TEXT,
  how_heard_about_us TEXT,
  current_issues TEXT,
  preferred_outcomes TEXT,
  creator_type_interest TEXT,
  business_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed) WHERE onboarding_completed = false;
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_answers ON profiles USING GIN (onboarding_answers);

-- emma_studios
CREATE TABLE IF NOT EXISTS public.emma_studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.emma_profiles(id) ON DELETE SET NULL,
  owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_bio TEXT,
  studio_type TEXT CHECK (studio_type IN ('photography', 'videography', 'audio', 'multi-purpose', 'multipurpose')) DEFAULT 'multi-purpose',
  address TEXT,
  city TEXT DEFAULT 'London',
  postcode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'extra-large')),
  hourly_rate DECIMAL(10, 2),
  half_day_rate DECIMAL(10, 2),
  full_day_rate DECIMAL(10, 2),
  amenities TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  rules TEXT,
  cancellation_policy TEXT,
  cover_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  supports_combined BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_studios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "studios_select_all" ON public.emma_studios FOR SELECT USING (true);
CREATE POLICY "studios_insert_owner" ON public.emma_studios FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "studios_update_owner" ON public.emma_studios FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "studios_delete_owner" ON public.emma_studios FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all studios" ON emma_studios FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX IF NOT EXISTS idx_studios_city ON public.emma_studios(city);
CREATE INDEX IF NOT EXISTS idx_studios_type ON public.emma_studios(studio_type);
CREATE INDEX IF NOT EXISTS idx_studios_status ON public.emma_studios(status);
CREATE INDEX IF NOT EXISTS idx_studios_owner_profile_id ON public.emma_studios(owner_profile_id);

-- emma_creators
CREATE TABLE IF NOT EXISTS public.emma_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.emma_profiles(id) ON DELETE CASCADE,
  owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  short_bio TEXT,
  creator_type TEXT CHECK (creator_type IN ('photographer', 'videographer', 'audio_engineer', 'editor', 'multi-discipline')) DEFAULT 'photographer',
  specialty TEXT,
  skills TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  half_day_rate DECIMAL(10, 2),
  full_day_rate DECIMAL(10, 2),
  city TEXT DEFAULT 'London',
  postcode TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  portfolio_videos TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  supports_dry_hire BOOLEAN DEFAULT false,
  supports_combined BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  instagram_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators_select_all" ON public.emma_creators FOR SELECT USING (true);
CREATE POLICY "creators_insert_own" ON public.emma_creators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "creators_update_own" ON public.emma_creators FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "creators_delete_own" ON public.emma_creators FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all creators" ON emma_creators FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX IF NOT EXISTS idx_creators_city ON public.emma_creators(city);
CREATE INDEX IF NOT EXISTS idx_creators_type ON public.emma_creators(creator_type);
CREATE INDEX IF NOT EXISTS idx_creators_rating ON public.emma_creators(rating DESC);
CREATE INDEX IF NOT EXISTS idx_creators_status ON public.emma_creators(status);
CREATE INDEX IF NOT EXISTS idx_creators_owner_profile_id ON public.emma_creators(owner_profile_id);

-- emma_packages
CREATE TABLE IF NOT EXISTS public.emma_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_hours DECIMAL(4, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  includes TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  accepts_combined BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT package_owner CHECK (
    (creator_id IS NOT NULL AND studio_id IS NULL) OR 
    (creator_id IS NULL AND studio_id IS NOT NULL)
  )
);

ALTER TABLE public.emma_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_select_all" ON public.emma_packages FOR SELECT USING (true);
CREATE POLICY "packages_insert_creator" ON public.emma_packages FOR INSERT WITH CHECK (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);
CREATE POLICY "packages_update_owner" ON public.emma_packages FOR UPDATE USING (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);
CREATE POLICY "packages_delete_owner" ON public.emma_packages FOR DELETE USING (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);

-- emma_services
CREATE TABLE IF NOT EXISTS public.emma_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('photography', 'videography', 'audio', 'editing', 'other')),
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_select_all" ON public.emma_services FOR SELECT USING (true);
CREATE POLICY "services_insert_creator" ON public.emma_services FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid()));
CREATE POLICY "services_update_creator" ON public.emma_services FOR UPDATE USING (creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid()));
CREATE POLICY "services_delete_creator" ON public.emma_services FOR DELETE USING (creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid()));

-- emma_faqs
CREATE TABLE IF NOT EXISTS public.emma_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT faq_owner CHECK (
    (creator_id IS NOT NULL AND studio_id IS NULL) OR 
    (creator_id IS NULL AND studio_id IS NOT NULL)
  )
);

ALTER TABLE public.emma_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs_select_all" ON public.emma_faqs FOR SELECT USING (true);
CREATE POLICY "faqs_insert_owner" ON public.emma_faqs FOR INSERT WITH CHECK (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);
CREATE POLICY "faqs_update_owner" ON public.emma_faqs FOR UPDATE USING (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);
CREATE POLICY "faqs_delete_owner" ON public.emma_faqs FOR DELETE USING (
  (creator_id IS NOT NULL AND creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())) OR
  (studio_id IS NOT NULL AND studio_id IN (SELECT id FROM public.emma_studios WHERE owner_id = auth.uid()))
);

-- emma_bookings
CREATE TABLE IF NOT EXISTS public.emma_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.emma_profiles(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE SET NULL,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.emma_packages(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours DECIMAL(4, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT FALSE,
  final_paid BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  booking_type TEXT CHECK (booking_type IN ('single', 'combined')) DEFAULT 'single',
  refund_amount NUMERIC DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  cancellation_window_hours INTEGER DEFAULT 24,
  client_notes TEXT,
  creator_notes TEXT,
  cancellation_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_select_relevant" ON public.emma_bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.emma_creators WHERE id = creator_id) OR
  auth.uid() IN (SELECT owner_id FROM public.emma_studios WHERE id = studio_id) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "bookings_insert_client" ON public.emma_bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "bookings_update_relevant" ON public.emma_bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.emma_creators WHERE id = creator_id) OR
  auth.uid() IN (SELECT owner_id FROM public.emma_studios WHERE id = studio_id) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.emma_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.emma_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON public.emma_bookings(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- emma_reviews
CREATE TABLE IF NOT EXISTS public.emma_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.emma_bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.emma_profiles(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT review_target CHECK (
    (creator_id IS NOT NULL AND studio_id IS NULL) OR 
    (creator_id IS NULL AND studio_id IS NOT NULL)
  )
);

ALTER TABLE public.emma_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select_all" ON public.emma_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_reviewer" ON public.emma_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_update_reviewer" ON public.emma_reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "reviews_delete_reviewer" ON public.emma_reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- emma_featured_works
CREATE TABLE IF NOT EXISTS public.emma_featured_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('hero', 'top_rated', 'new_creators', 'client_favorites')) DEFAULT 'hero',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emma_featured_works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "featured_select_all" ON public.emma_featured_works FOR SELECT USING (true);
CREATE POLICY "featured_insert_admin" ON public.emma_featured_works FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin'));
CREATE POLICY "featured_update_admin" ON public.emma_featured_works FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin'));
CREATE POLICY "featured_delete_admin" ON public.emma_featured_works FOR DELETE USING (auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin'));

-- emma_favorites
CREATE TABLE IF NOT EXISTS public.emma_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.emma_profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT favorite_target CHECK (
    (creator_id IS NOT NULL AND studio_id IS NULL) OR 
    (creator_id IS NULL AND studio_id IS NOT NULL)
  ),
  UNIQUE(user_id, creator_id),
  UNIQUE(user_id, studio_id)
);

ALTER TABLE public.emma_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select_own" ON public.emma_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.emma_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.emma_favorites FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 2. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_system" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ==========================================
-- 3. BOOKING SUPPORT TABLES (from 009, 011, 013)
-- ==========================================

-- booking_participants
CREATE TABLE IF NOT EXISTS booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES emma_bookings(id) ON DELETE CASCADE,
  participant_type TEXT NOT NULL CHECK (participant_type IN ('creator', 'studio')),
  participant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_participants_booking ON booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_participant ON booking_participants(participant_type, participant_id);

-- booking_packages
CREATE TABLE IF NOT EXISTS booking_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES emma_packages(id) NOT NULL,
  owner_type TEXT CHECK (owner_type IN ('creator', 'studio')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booking_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_packages_select_all" ON booking_packages FOR SELECT USING (true);
CREATE POLICY "booking_packages_insert_system" ON booking_packages FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_booking_packages_booking ON booking_packages(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_packages_package ON booking_packages(package_id);

-- availability_blocks
CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES emma_studios(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  block_type TEXT CHECK (block_type IN ('available', 'blocked', 'booked')) DEFAULT 'available',
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (creator_id IS NOT NULL OR studio_id IS NOT NULL),
  CHECK (end_time > start_time)
);

ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "availability_select_all" ON availability_blocks FOR SELECT USING (true);
CREATE POLICY "availability_insert_owner" ON availability_blocks FOR INSERT WITH CHECK (
  creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid()) OR
  studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
);
CREATE POLICY "availability_update_owner" ON availability_blocks FOR UPDATE USING (
  creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid()) OR
  studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
);
CREATE POLICY "availability_delete_owner" ON availability_blocks FOR DELETE USING (
  creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid()) OR
  studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
);

CREATE INDEX IF NOT EXISTS idx_availability_creator_time ON availability_blocks(creator_id, start_time, end_time) WHERE creator_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_availability_studio_time ON availability_blocks(studio_id, start_time, end_time) WHERE studio_id IS NOT NULL;

-- availability_slots
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('creator', 'studio')),
  provider_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_provider ON availability_slots(provider_type, provider_id);
CREATE INDEX IF NOT EXISTS idx_availability_time ON availability_slots(start_time, end_time);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_participants CHECK (participant1_id != participant2_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant1_id, participant2_id);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'link', 'package_reference')),
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- booking_messages
CREATE TABLE IF NOT EXISTS booking_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select_relevant" ON booking_messages FOR SELECT USING (
  booking_id IN (
    SELECT id FROM emma_bookings 
    WHERE client_id = auth.uid() 
    OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  )
);
CREATE POLICY "messages_insert_relevant" ON booking_messages FOR INSERT WITH CHECK (
  booking_id IN (
    SELECT id FROM emma_bookings 
    WHERE client_id = auth.uid() 
    OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_booking_messages_booking ON booking_messages(booking_id, created_at DESC);

-- payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_type TEXT CHECK (recipient_type IN ('creator', 'studio')) NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'gbp',
  stripe_transfer_id TEXT,
  stripe_account_id TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payouts_select_own" ON payouts FOR SELECT USING (recipient_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "payouts_insert_system" ON payouts FOR INSERT WITH CHECK (true);
CREATE POLICY "payouts_update_admin" ON payouts FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX IF NOT EXISTS idx_payouts_recipient ON payouts(recipient_id, status);

-- disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) NOT NULL,
  raised_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disputes_select_relevant" ON disputes FOR SELECT USING (
  raised_by = auth.uid() 
  OR booking_id IN (
    SELECT id FROM emma_bookings 
    WHERE client_id = auth.uid() 
    OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "disputes_insert_relevant" ON disputes FOR INSERT WITH CHECK (
  booking_id IN (
    SELECT id FROM emma_bookings 
    WHERE client_id = auth.uid() 
    OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  )
);
CREATE POLICY "disputes_update_admin" ON disputes FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX IF NOT EXISTS idx_disputes_booking ON disputes(booking_id, status);

-- ==========================================
-- 4. FUNCTIONS AND TRIGGERS
-- ==========================================

-- Auth trigger: create profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.emma_profiles (id, email, role, created_at, updated_at)
  VALUES (new.id, new.email, 'client', now(), now());
  
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (new.id, new.email, NULL, now(), now());
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Availability check function
CREATE OR REPLACE FUNCTION check_availability_conflict(
  p_creator_id UUID, p_studio_id UUID, p_start_time TIMESTAMPTZ, p_end_time TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM availability_blocks
    WHERE ((creator_id = p_creator_id AND p_creator_id IS NOT NULL) OR (studio_id = p_studio_id AND p_studio_id IS NOT NULL))
    AND block_type = 'booked'
    AND (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
  );
END;
$$ LANGUAGE plpgsql;

-- Auto-create availability block on booking
CREATE OR REPLACE FUNCTION create_booking_availability() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.creator_id IS NOT NULL THEN
    INSERT INTO availability_blocks (creator_id, start_time, end_time, block_type, booking_id)
    VALUES (NEW.creator_id, (NEW.booking_date + NEW.start_time), (NEW.booking_date + NEW.end_time), 'booked', NEW.id);
  END IF;
  IF NEW.studio_id IS NOT NULL THEN
    INSERT INTO availability_blocks (studio_id, start_time, end_time, block_type, booking_id)
    VALUES (NEW.studio_id, (NEW.booking_date + NEW.start_time), (NEW.booking_date + NEW.end_time), 'booked', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_availability_trigger ON emma_bookings;
CREATE TRIGGER booking_availability_trigger
  AFTER INSERT ON emma_bookings
  FOR EACH ROW EXECUTE FUNCTION create_booking_availability();

-- Participant availability check
CREATE OR REPLACE FUNCTION is_participant_available(
  p_type TEXT, p_id UUID, p_start TIMESTAMPTZ, p_end TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM emma_bookings b
    JOIN booking_participants bp ON b.id = bp.booking_id
    WHERE bp.participant_type = p_type AND bp.participant_id = p_id
    AND b.status NOT IN ('cancelled', 'refunded')
    AND (b.booking_date + b.start_time, b.booking_date + b.end_time) OVERLAPS (p_start, p_end)
  );
END;
$$ LANGUAGE plpgsql;

-- Ownership helper functions
CREATE OR REPLACE FUNCTION public.is_studio_owner(p_studio_id uuid, p_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM public.emma_studios s WHERE s.id = p_studio_id AND s.owner_profile_id = p_profile_id);
$$;

CREATE OR REPLACE FUNCTION public.is_creator_owner(p_creator_id uuid, p_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM public.emma_creators c WHERE c.id = p_creator_id AND c.owner_profile_id = p_profile_id);
$$;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notification on booking confirmation
CREATE OR REPLACE FUNCTION notify_booking_confirmed() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (NEW.client_id, 'booking_confirmed', 'Booking Confirmed', 'Your booking has been confirmed!', jsonb_build_object('booking_id', NEW.id));
    IF NEW.creator_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, metadata)
      SELECT user_id, 'booking_confirmed', 'New Booking', 'You have a new confirmed booking!', jsonb_build_object('booking_id', NEW.id)
      FROM emma_creators WHERE id = NEW.creator_id;
    END IF;
    IF NEW.studio_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, metadata)
      SELECT owner_id, 'booking_confirmed', 'New Booking', 'You have a new confirmed booking!', jsonb_build_object('booking_id', NEW.id)
      FROM emma_studios WHERE id = NEW.studio_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_booking_confirmed ON emma_bookings;
CREATE TRIGGER trigger_notify_booking_confirmed
  AFTER INSERT OR UPDATE ON emma_bookings
  FOR EACH ROW EXECUTE FUNCTION notify_booking_confirmed();
