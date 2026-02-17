-- Add duration_hours, combined booking flags, active status, and booking participants table

-- Add duration as first-class field
ALTER TABLE emma_bookings
ADD COLUMN IF NOT EXISTS booking_type TEXT CHECK (booking_type IN ('creator_only', 'studio_only', 'combined')) DEFAULT 'creator_only';

-- Populate existing rows with calculated duration
UPDATE emma_bookings
SET duration_hours = CASE
  WHEN duration_hours IS NULL AND end_time IS NOT NULL AND start_time IS NOT NULL
  THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
  ELSE duration_hours
END
WHERE duration_hours IS NULL;

-- Add explicit combined support flags to creators
ALTER TABLE emma_creators
ADD COLUMN IF NOT EXISTS accepts_combined BOOLEAN DEFAULT TRUE;

-- Add support flags to studios
ALTER TABLE emma_studios
ADD COLUMN IF NOT EXISTS supports_dry_hire BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS supports_combined BOOLEAN DEFAULT TRUE;

-- Activate all existing creators and studios
UPDATE emma_creators SET is_active = TRUE WHERE is_active IS NULL;
UPDATE emma_studios SET is_active = TRUE WHERE is_active IS NULL;

-- Add onboarding completion to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create booking participants table (SSOT for combined bookings)
CREATE TABLE IF NOT EXISTS booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE CASCADE,
  participant_type TEXT CHECK (participant_type IN ('creator','studio')),
  participant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_participants_booking ON booking_participants(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_participants_participant ON booking_participants(participant_type, participant_id);

-- Populate participants from existing bookings
INSERT INTO booking_participants (booking_id, participant_type, participant_id)
SELECT id, 'creator', creator_id
FROM emma_bookings
WHERE creator_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO booking_participants (booking_id, participant_type, participant_id)
SELECT id, 'studio', studio_id
FROM emma_bookings
WHERE studio_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create canonical availability function (SINGLE SOURCE OF TRUTH)
CREATE OR REPLACE FUNCTION is_participant_available(
  p_participant_type TEXT,
  p_participant_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM booking_participants bp
    JOIN emma_bookings b ON b.id = bp.booking_id
    WHERE bp.participant_type = p_participant_type
      AND bp.participant_id = p_participant_id
      AND b.status IN ('pending','confirmed')
      AND b.start_time < p_end
      AND b.end_time > p_start
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function for searching available creators
CREATE OR REPLACE FUNCTION search_available_creators(
  p_city TEXT,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ,
  p_creator_type TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  display_name TEXT,
  city TEXT,
  hourly_rate NUMERIC,
  half_day_rate NUMERIC,
  full_day_rate NUMERIC,
  rating NUMERIC,
  review_count INTEGER,
  cover_image TEXT,
  avatar_url TEXT,
  creator_type TEXT,
  slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.display_name,
    c.city,
    c.hourly_rate,
    c.half_day_rate,
    c.full_day_rate,
    c.rating,
    c.review_count,
    c.cover_image,
    c.avatar_url,
    c.creator_type,
    c.slug
  FROM emma_creators c
  WHERE c.is_active = true
    AND (p_city IS NULL OR c.city = p_city)
    AND (p_creator_type IS NULL OR c.creator_type = p_creator_type)
    AND is_participant_available('creator', c.id, p_start, p_end);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function for searching available studios
CREATE OR REPLACE FUNCTION search_available_studios(
  p_city TEXT,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ,
  p_studio_type TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  city TEXT,
  hourly_rate NUMERIC,
  half_day_rate NUMERIC,
  full_day_rate NUMERIC,
  rating NUMERIC,
  review_count INTEGER,
  cover_image TEXT,
  studio_type TEXT,
  slug TEXT,
  size TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.city,
    s.hourly_rate,
    s.half_day_rate,
    s.full_day_rate,
    s.rating,
    s.review_count,
    s.cover_image,
    s.studio_type,
    s.slug,
    s.size
  FROM emma_studios s
  WHERE s.is_active = true
    AND (p_city IS NULL OR s.city = p_city)
    AND (p_studio_type IS NULL OR s.studio_type = p_studio_type)
    AND is_participant_available('studio', s.id, p_start, p_end);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function for combined availability (creator + studio)
CREATE OR REPLACE FUNCTION search_combined_availability(
  p_city TEXT,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
)
RETURNS TABLE(
  creator_id UUID,
  creator_name TEXT,
  creator_rate NUMERIC,
  studio_id UUID,
  studio_name TEXT,
  studio_rate NUMERIC,
  combined_price NUMERIC,
  city TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id AS creator_id,
    c.display_name AS creator_name,
    COALESCE(c.hourly_rate, 0) AS creator_rate,
    s.id AS studio_id,
    s.name AS studio_name,
    COALESCE(s.hourly_rate, 0) AS studio_rate,
    COALESCE(c.hourly_rate, 0) + COALESCE(s.hourly_rate, 0) AS combined_price,
    c.city
  FROM emma_creators c
  JOIN emma_studios s ON s.city = c.city
  WHERE c.accepts_combined = true
    AND s.supports_combined = true
    AND c.is_active = true
    AND s.is_active = true
    AND (p_city IS NULL OR c.city = p_city)
    AND is_participant_available('creator', c.id, p_start, p_end)
    AND is_participant_available('studio', s.id, p_start, p_end);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_participant_available TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_available_creators TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_available_studios TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_combined_availability TO authenticated, anon;
