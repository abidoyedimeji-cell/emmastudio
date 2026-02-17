-- Add role and onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('client', 'creator', 'studio')),
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step TEXT CHECK (onboarding_step IN ('role_selection', 'profile', 'packages', 'availability', 'complete')),
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- Update existing emma_profiles to align with new system
ALTER TABLE public.emma_profiles
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('client', 'creator', 'studio')),
ADD COLUMN IF NOT EXISTS onboarding_step TEXT CHECK (onboarding_step IN ('role_selection', 'profile', 'packages', 'availability', 'complete')),
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- Update emma_creators to use verification_status
ALTER TABLE public.emma_creators
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- Update emma_studios to use verification_status  
ALTER TABLE public.emma_studios
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_step);
CREATE INDEX IF NOT EXISTS idx_emma_creators_verification ON public.emma_creators(verification_status);
CREATE INDEX IF NOT EXISTS idx_emma_studios_verification ON public.emma_studios(verification_status);

-- Update RLS policies to respect verification
DROP POLICY IF EXISTS "creators_select_all" ON public.emma_creators;
CREATE POLICY "creators_select_all" ON public.emma_creators
  FOR SELECT USING (
    is_active = true AND 
    (verification_status = 'approved' OR user_id = auth.uid())
  );

DROP POLICY IF EXISTS "studios_select_all" ON public.emma_studios;
CREATE POLICY "studios_select_all" ON public.emma_studios
  FOR SELECT USING (
    is_active = true AND 
    (verification_status = 'approved' OR owner_id = auth.uid())
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, onboarding_step, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'role_selection',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON COLUMN profiles.role IS 'User role: client (book), creator (provide services), studio (provide venue)';
COMMENT ON COLUMN profiles.onboarding_step IS 'Current onboarding step for the user';
COMMENT ON COLUMN profiles.is_admin IS 'Backend-controlled admin flag';
COMMENT ON COLUMN profiles.verification_status IS 'Verification status for creators and studios';
