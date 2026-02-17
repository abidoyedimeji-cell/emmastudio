-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.emma_profiles (id, email, role, onboarding_step, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    'client',
    NULL,
    now(),
    now()
  );
  
  INSERT INTO public.profiles (id, email, role, onboarding_step, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    NULL,
    NULL,
    now(),
    now()
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update emma_profiles table to ensure proper defaults
ALTER TABLE emma_profiles 
  ALTER COLUMN role DROP NOT NULL,
  ALTER COLUMN onboarding_step DROP NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_emma_profiles_user_id ON emma_profiles(id);
CREATE INDEX IF NOT EXISTS idx_emma_profiles_role ON emma_profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
