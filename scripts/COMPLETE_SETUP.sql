-- ============================================================
-- EMMA STUDIOS - COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor to set up everything
-- ============================================================

-- Step 1: Clean slate - drop everything if exists
DROP TABLE IF EXISTS booking_participants CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS emma_favorites CASCADE;
DROP TABLE IF EXISTS emma_reviews CASCADE;
DROP TABLE IF EXISTS emma_bookings CASCADE;
DROP TABLE IF EXISTS emma_packages CASCADE;
DROP TABLE IF EXISTS emma_creators CASCADE;
DROP TABLE IF EXISTS emma_studios CASCADE;
DROP TABLE IF EXISTS emma_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_studio_owner(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS is_creator_owner(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS is_participant_available(TEXT, UUID, TIMESTAMPTZ, TIMESTAMPTZ) CASCADE;

-- ============================================================
-- PROFILES (auth-linked)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'creator', 'studio_owner', 'admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============================================================
-- AUTH TRIGGER - auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CREATORS
-- ============================================================
CREATE TABLE emma_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  short_bio TEXT,
  creator_type TEXT CHECK (creator_type IN ('photographer', 'videographer', 'audio_engineer', 'editor', 'content_creator')),
  specialty TEXT,
  skills TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2) DEFAULT 0,
  half_day_rate DECIMAL(10, 2) DEFAULT 0,
  full_day_rate DECIMAL(10, 2) DEFAULT 0,
  city TEXT,
  postcode TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  badges TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  returning_clients INTEGER DEFAULT 0,
  response_time TEXT DEFAULT 'within_24h',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  supports_dry_hire BOOLEAN DEFAULT FALSE,
  supports_combined BOOLEAN DEFAULT FALSE,
  instagram_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE emma_creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved creators" ON emma_creators FOR SELECT USING (status = 'approved' AND is_active = true);

-- ============================================================
-- STUDIOS
-- ============================================================
CREATE TABLE emma_studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_bio TEXT,
  studio_type TEXT CHECK (studio_type IN ('photography', 'videography', 'audio', 'podcast', 'multipurpose')),
  address TEXT,
  city TEXT,
  postcode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  amenities TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10, 2) DEFAULT 0,
  half_day_rate DECIMAL(10, 2) DEFAULT 0,
  full_day_rate DECIMAL(10, 2) DEFAULT 0,
  cover_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  supports_combined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE emma_studios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved studios" ON emma_studios FOR SELECT USING (status = 'approved' AND is_active = true);

-- ============================================================
-- PACKAGES
-- ============================================================
CREATE TABLE emma_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID REFERENCES emma_studios(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES emma_creators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_hours DECIMAL(4, 1) DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  includes TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  accepts_combined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT package_owner CHECK (studio_id IS NOT NULL OR creator_id IS NOT NULL)
);

ALTER TABLE emma_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active packages" ON emma_packages FOR SELECT USING (is_active = true);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE emma_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  studio_id UUID REFERENCES emma_studios(id),
  creator_id UUID REFERENCES emma_creators(id),
  package_id UUID REFERENCES emma_packages(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE emma_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE emma_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id),
  reviewer_id UUID REFERENCES auth.users(id),
  studio_id UUID REFERENCES emma_studios(id),
  creator_id UUID REFERENCES emma_creators(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAVORITES
-- ============================================================
CREATE TABLE emma_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES emma_studios(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES emma_creators(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_studio_owner(p_studio_id UUID, p_profile_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM emma_studios WHERE id = p_studio_id AND owner_profile_id = p_profile_id);
$$;

CREATE OR REPLACE FUNCTION is_creator_owner(p_creator_id UUID, p_profile_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM emma_creators WHERE id = p_creator_id AND owner_profile_id = p_profile_id);
$$;

-- Admin policies
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all creators" ON emma_creators FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all studios" ON emma_studios FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view all bookings" ON emma_bookings FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_creators_slug ON emma_creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_type ON emma_creators(creator_type);
CREATE INDEX IF NOT EXISTS idx_creators_city ON emma_creators(city);
CREATE INDEX IF NOT EXISTS idx_creators_featured ON emma_creators(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_studios_slug ON emma_studios(slug);
CREATE INDEX IF NOT EXISTS idx_studios_type ON emma_studios(studio_type);
CREATE INDEX IF NOT EXISTS idx_studios_city ON emma_studios(city);
CREATE INDEX IF NOT EXISTS idx_studios_featured ON emma_studios(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_packages_studio ON emma_packages(studio_id);
CREATE INDEX IF NOT EXISTS idx_packages_creator ON emma_packages(creator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON emma_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_studio ON emma_bookings(studio_id);
CREATE INDEX IF NOT EXISTS idx_bookings_creator ON emma_bookings(creator_id);
CREATE INDEX IF NOT EXISTS idx_studios_owner ON emma_studios(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_creators_owner ON emma_creators(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
