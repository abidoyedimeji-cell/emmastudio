-- Add complete booking system schema with availability, messages, payouts, disputes

-- Add missing fields to existing emma_bookings table
ALTER TABLE emma_bookings
  ADD COLUMN IF NOT EXISTS booking_type TEXT CHECK (booking_type IN ('single', 'combined')) DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_window_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ALTER COLUMN creator_id DROP NOT NULL,
  ALTER COLUMN studio_id DROP NOT NULL;

-- Create booking_packages join table for multiple package references per booking
CREATE TABLE IF NOT EXISTS booking_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES emma_packages(id) NOT NULL,
  owner_type TEXT CHECK (owner_type IN ('creator', 'studio')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create availability_blocks table for creator/studio availability management
CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES emma_creators(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES emma_studios(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  block_type TEXT CHECK (block_type IN ('available', 'blocked', 'booked')) DEFAULT 'available',
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (creator_id IS NOT NULL OR studio_id IS NOT NULL),
  CHECK (end_time > start_time)
);

-- Create booking_messages table for booking-scoped chat
CREATE TABLE IF NOT EXISTS booking_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payouts table for tracking creator/studio payments
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_type TEXT CHECK (recipient_type IN ('creator', 'studio')) NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'gbp',
  stripe_transfer_id TEXT,
  stripe_account_id TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create disputes table for handling booking disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES emma_bookings(id) NOT NULL,
  raised_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_packages_booking ON booking_packages(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_packages_package ON booking_packages(package_id);
CREATE INDEX IF NOT EXISTS idx_availability_creator_time ON availability_blocks(creator_id, start_time, end_time) WHERE creator_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_availability_studio_time ON availability_blocks(studio_id, start_time, end_time) WHERE studio_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_booking_messages_booking ON booking_messages(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_recipient ON payouts(recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_disputes_booking ON disputes(booking_id, status);

-- Enable RLS
ALTER TABLE booking_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_packages
CREATE POLICY "booking_packages_select_all" ON booking_packages FOR SELECT USING (true);
CREATE POLICY "booking_packages_insert_system" ON booking_packages FOR INSERT WITH CHECK (true);

-- RLS Policies for availability_blocks
CREATE POLICY "availability_select_all" ON availability_blocks FOR SELECT USING (true);
CREATE POLICY "availability_insert_owner" ON availability_blocks FOR INSERT 
  WITH CHECK (
    creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  );
CREATE POLICY "availability_update_owner" ON availability_blocks FOR UPDATE 
  USING (
    creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  );
CREATE POLICY "availability_delete_owner" ON availability_blocks FOR DELETE 
  USING (
    creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
    OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
  );

-- RLS Policies for booking_messages
CREATE POLICY "messages_select_relevant" ON booking_messages FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM emma_bookings 
      WHERE client_id = auth.uid() 
      OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
      OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
    )
  );
CREATE POLICY "messages_insert_relevant" ON booking_messages FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM emma_bookings 
      WHERE client_id = auth.uid() 
      OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
      OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
    )
  );

-- RLS Policies for payouts
CREATE POLICY "payouts_select_own" ON payouts FOR SELECT
  USING (recipient_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "payouts_insert_system" ON payouts FOR INSERT WITH CHECK (true);
CREATE POLICY "payouts_update_admin" ON payouts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for disputes
CREATE POLICY "disputes_select_relevant" ON disputes FOR SELECT
  USING (
    raised_by = auth.uid() 
    OR booking_id IN (
      SELECT id FROM emma_bookings 
      WHERE client_id = auth.uid() 
      OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
      OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "disputes_insert_relevant" ON disputes FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM emma_bookings 
      WHERE client_id = auth.uid() 
      OR creator_id IN (SELECT id FROM emma_creators WHERE user_id = auth.uid())
      OR studio_id IN (SELECT id FROM emma_studios WHERE owner_id = auth.uid())
    )
  );
CREATE POLICY "disputes_update_admin" ON disputes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Function to check availability conflicts
CREATE OR REPLACE FUNCTION check_availability_conflict(
  p_creator_id UUID,
  p_studio_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM availability_blocks
    WHERE (
      (creator_id = p_creator_id AND p_creator_id IS NOT NULL)
      OR (studio_id = p_studio_id AND p_studio_id IS NOT NULL)
    )
    AND block_type = 'booked'
    AND (
      (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create availability block on booking
CREATE OR REPLACE FUNCTION create_booking_availability() RETURNS TRIGGER AS $$
BEGIN
  -- Create availability block for creator
  IF NEW.creator_id IS NOT NULL THEN
    INSERT INTO availability_blocks (
      creator_id,
      start_time,
      end_time,
      block_type,
      booking_id
    ) VALUES (
      NEW.creator_id,
      (NEW.booking_date + NEW.start_time),
      (NEW.booking_date + NEW.end_time),
      'booked',
      NEW.id
    );
  END IF;
  
  -- Create availability block for studio
  IF NEW.studio_id IS NOT NULL THEN
    INSERT INTO availability_blocks (
      studio_id,
      start_time,
      end_time,
      block_type,
      booking_id
    ) VALUES (
      NEW.studio_id,
      (NEW.booking_date + NEW.start_time),
      (NEW.booking_date + NEW.end_time),
      'booked',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF NOT EXISTS booking_availability_trigger ON emma_bookings;
CREATE TRIGGER booking_availability_trigger
  AFTER INSERT ON emma_bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_availability();
