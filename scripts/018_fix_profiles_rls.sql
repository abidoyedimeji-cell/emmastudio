-- Ensure profiles table has proper RLS policies for onboarding
-- Drop and recreate the update policy to ensure it allows onboarding fields

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Ensure insert policy exists for new profiles
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Ensure users can read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile complete"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());
