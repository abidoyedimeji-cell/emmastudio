-- Add fields to profiles table for client onboarding
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS how_heard_about_us TEXT,
ADD COLUMN IF NOT EXISTS current_issues TEXT,
ADD COLUMN IF NOT EXISTS preferred_outcomes TEXT,
ADD COLUMN IF NOT EXISTS creator_type_interest TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON profiles(user_role);
