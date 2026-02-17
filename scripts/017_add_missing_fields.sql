-- Add missing onboarding_completed field if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Ensure status columns exist for approval workflow
ALTER TABLE emma_creators ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE emma_studios ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add payment intent tracking to bookings if missing
ALTER TABLE emma_bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE emma_bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON emma_bookings(status);
CREATE INDEX IF NOT EXISTS idx_creators_status ON emma_creators(status);
CREATE INDEX IF NOT EXISTS idx_studios_status ON emma_studios(status);
