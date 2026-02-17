-- Add onboarding_answers column to profiles table to store role-specific onboarding data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_answers JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN profiles.onboarding_answers IS 'Stores role-specific onboarding answers in JSONB format: {role: "client"|"creator"|"studio", answers: {...}}';

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_answers ON profiles USING GIN (onboarding_answers);
