-- Add approval status to creators and studios
ALTER TABLE emma_creators
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Add check constraint
ALTER TABLE emma_creators
ADD CONSTRAINT creators_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE emma_studios
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Add check constraint
ALTER TABLE emma_studios
ADD CONSTRAINT studios_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing records to approved
UPDATE emma_creators SET status = 'approved' WHERE status = 'pending';
UPDATE emma_studios SET status = 'approved' WHERE status = 'pending';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_creators_status ON emma_creators(status);
CREATE INDEX IF NOT EXISTS idx_studios_status ON emma_studios(status);

-- Create approval notification trigger
CREATE OR REPLACE FUNCTION notify_approval_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (user_id, type, title, message, action_url, created_at)
    VALUES (
      NEW.user_id,
      'approval_update',
      CASE NEW.status
        WHEN 'approved' THEN 'Profile Approved!'
        WHEN 'rejected' THEN 'Profile Needs Review'
        ELSE 'Profile Status Updated'
      END,
      CASE NEW.status
        WHEN 'approved' THEN 'Congratulations! Your profile has been approved and is now live.'
        WHEN 'rejected' THEN 'Your profile needs some updates before going live. Please review admin feedback.'
        ELSE 'Your profile status has been updated to: ' || NEW.status
      END,
      CASE
        WHEN TG_TABLE_NAME = 'emma_creators' THEN '/profile'
        WHEN TG_TABLE_NAME = 'emma_studios' THEN '/profile'
        ELSE '/dashboard'
      END,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for both tables
DROP TRIGGER IF EXISTS creator_approval_notify ON emma_creators;
CREATE TRIGGER creator_approval_notify
  AFTER UPDATE ON emma_creators
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_approval_status_change();

DROP TRIGGER IF EXISTS studio_approval_notify ON emma_studios;
CREATE TRIGGER studio_approval_notify
  AFTER UPDATE ON emma_studios
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_approval_status_change();
