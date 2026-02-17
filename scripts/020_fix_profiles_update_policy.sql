-- Fix profiles RLS policies to allow updates

-- Drop conflicting policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with proper permissions
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure upsert works for signup
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
