-- Grant admin access to hello@emmacomms.co
UPDATE profiles 
SET is_admin = true 
WHERE email = 'hello@emmacomms.co';

-- Create index on is_admin for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;
