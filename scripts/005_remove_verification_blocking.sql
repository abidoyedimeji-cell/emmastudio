-- Remove RLS policies that block unverified accounts from being visible
-- This allows creators and studios to complete onboarding without verification blocking them

-- Drop existing RLS policies that check for verification
DROP POLICY IF EXISTS "Public can view verified creators" ON emma_creators;
DROP POLICY IF EXISTS "Public can view verified studios" ON emma_studios;

-- Create new policies that allow all active listings to be visible
CREATE POLICY "Public can view active creators"
ON emma_creators FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Public can view active studios"
ON emma_studios FOR SELECT
TO public
USING (is_active = true);

-- Add comment explaining the change
COMMENT ON POLICY "Public can view active creators" ON emma_creators IS 
'Allows public to view all active creator profiles regardless of verification status. Verification is now a badge, not a blocker.';

COMMENT ON POLICY "Public can view active studios" ON emma_studios IS 
'Allows public to view all active studio profiles regardless of verification status. Verification is now a badge, not a blocker.';
