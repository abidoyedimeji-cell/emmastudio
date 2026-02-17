-- EMMA Studios Database Schema
-- This script creates all necessary tables for the booking platform

-- Users/Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.emma_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'creator', 'studio_owner', 'admin')) DEFAULT 'client',
  postcode TEXT,
  city TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.emma_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.emma_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.emma_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.emma_profiles FOR DELETE USING (auth.uid() = id);

-- Studios table
CREATE TABLE IF NOT EXISTS public.emma_studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.emma_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_bio TEXT,
  studio_type TEXT CHECK (studio_type IN ('photography', 'videography', 'audio', 'multi-purpose')) DEFAULT 'multi-purpose',
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
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_studios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "studios_select_all" ON public.emma_studios FOR SELECT USING (true);
CREATE POLICY "studios_insert_owner" ON public.emma_studios FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "studios_update_owner" ON public.emma_studios FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "studios_delete_owner" ON public.emma_studios FOR DELETE USING (auth.uid() = owner_id);

-- Creators table
CREATE TABLE IF NOT EXISTS public.emma_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.emma_profiles(id) ON DELETE CASCADE,
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
  instagram_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creators_select_all" ON public.emma_creators FOR SELECT USING (true);
CREATE POLICY "creators_insert_own" ON public.emma_creators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "creators_update_own" ON public.emma_creators FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "creators_delete_own" ON public.emma_creators FOR DELETE USING (auth.uid() = user_id);

-- Packages table (for both studios and creators)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Services table (specific services offered by creators)
CREATE TABLE IF NOT EXISTS public.emma_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('photography', 'videography', 'audio', 'editing', 'other')),
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_select_all" ON public.emma_services FOR SELECT USING (true);
CREATE POLICY "services_insert_creator" ON public.emma_services FOR INSERT WITH CHECK (
  creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())
);
CREATE POLICY "services_update_creator" ON public.emma_services FOR UPDATE USING (
  creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())
);
CREATE POLICY "services_delete_creator" ON public.emma_services FOR DELETE USING (
  creator_id IN (SELECT id FROM public.emma_creators WHERE user_id = auth.uid())
);

-- FAQs table
CREATE TABLE IF NOT EXISTS public.emma_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Bookings table
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
  client_notes TEXT,
  creator_notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_relevant" ON public.emma_bookings FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.emma_creators WHERE id = creator_id) OR
  auth.uid() IN (SELECT owner_id FROM public.emma_studios WHERE id = studio_id)
);
CREATE POLICY "bookings_insert_client" ON public.emma_bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "bookings_update_relevant" ON public.emma_bookings FOR UPDATE USING (
  auth.uid() = client_id OR 
  auth.uid() IN (SELECT user_id FROM public.emma_creators WHERE id = creator_id) OR
  auth.uid() IN (SELECT owner_id FROM public.emma_studios WHERE id = studio_id)
);

-- Reviews table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Featured Works table (for homepage carousels)
CREATE TABLE IF NOT EXISTS public.emma_featured_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('hero', 'top_rated', 'new_creators', 'client_favorites')) DEFAULT 'hero',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emma_featured_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_select_all" ON public.emma_featured_works FOR SELECT USING (true);
CREATE POLICY "featured_insert_admin" ON public.emma_featured_works FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin')
);
CREATE POLICY "featured_update_admin" ON public.emma_featured_works FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin')
);
CREATE POLICY "featured_delete_admin" ON public.emma_featured_works FOR DELETE USING (
  auth.uid() IN (SELECT id FROM public.emma_profiles WHERE user_type = 'admin')
);

-- Favorites table (for users to save creators/studios)
CREATE TABLE IF NOT EXISTS public.emma_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.emma_profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES public.emma_studios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_emma_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.emma_profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_emma_auth_user_created ON auth.users;

CREATE TRIGGER on_emma_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_emma_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creators_city ON public.emma_creators(city);
CREATE INDEX IF NOT EXISTS idx_creators_type ON public.emma_creators(creator_type);
CREATE INDEX IF NOT EXISTS idx_creators_rating ON public.emma_creators(rating DESC);
CREATE INDEX IF NOT EXISTS idx_studios_city ON public.emma_studios(city);
CREATE INDEX IF NOT EXISTS idx_studios_type ON public.emma_studios(studio_type);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.emma_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.emma_bookings(status);
