-- Add Stripe payment fields to bookings table
ALTER TABLE emma_bookings 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Add index for faster payment intent lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent 
ON emma_bookings(stripe_payment_intent_id);

-- Update existing bookings to have payment_status
UPDATE emma_bookings 
SET payment_status = CASE 
  WHEN status = 'confirmed' THEN 'paid'
  WHEN status = 'cancelled' THEN 'failed'
  ELSE 'pending'
END
WHERE payment_status IS NULL;
