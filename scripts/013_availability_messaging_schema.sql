-- Availability slots for creators and studios
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  recurring boolean DEFAULT false,
  recurring_rule text, -- RFC 5545 RRULE format (e.g., "FREQ=WEEKLY;BYDAY=MO,WE,FR")
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_availability_user ON availability_slots(user_id);
CREATE INDEX idx_availability_time ON availability_slots(start_time, end_time);

-- Enable RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Policies for availability_slots
CREATE POLICY "Anyone can view availability"
  ON availability_slots FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own availability"
  ON availability_slots FOR ALL
  USING (auth.uid() = user_id);

-- Conversations between clients and providers
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(client_id, provider_id)
);

CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_provider ON conversations(provider_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);

-- Messages within conversations
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('text', 'image', 'video', 'link', 'package')),
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
        AND (conversations.client_id = auth.uid() OR conversations.provider_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
        AND (conversations.client_id = auth.uid() OR conversations.provider_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Venue favorites (extend existing if needed)
CREATE TABLE IF NOT EXISTS venue_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

CREATE INDEX idx_venue_favorites_user ON venue_favorites(user_id);
CREATE INDEX idx_venue_favorites_venue ON venue_favorites(venue_id);

-- Enable RLS
ALTER TABLE venue_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for venue_favorites
CREATE POLICY "Users can view all favorites"
  ON venue_favorites FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own favorites"
  ON venue_favorites FOR ALL
  USING (auth.uid() = user_id);

-- RPC function to get closest venues using PostGIS
CREATE OR REPLACE FUNCTION get_closest_venues(
  user_lon float8,
  user_lat float8,
  limit_results int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  city text,
  category text,
  image_url text,
  rating numeric,
  price_range integer,
  distance_meters float8
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.name,
    v.address,
    v.city,
    v.category,
    v.image_url,
    v.rating,
    v.price_range,
    0::float8 as distance_meters -- Placeholder for now
  FROM venues v
  WHERE v.city IS NOT NULL
  ORDER BY v.rating DESC NULLS LAST
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check if a user is available at a specific time
CREATE OR REPLACE FUNCTION is_user_available(
  p_user_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS boolean AS $$
DECLARE
  has_availability boolean;
  has_booking boolean;
BEGIN
  -- Check if user has availability slots covering this time
  SELECT EXISTS (
    SELECT 1 FROM availability_slots
    WHERE user_id = p_user_id
      AND start_time <= p_start_time
      AND end_time >= p_end_time
  ) INTO has_availability;
  
  -- Check if user has conflicting bookings
  SELECT EXISTS (
    SELECT 1 FROM emma_bookings
    WHERE (creator_id = p_user_id OR studio_id = p_user_id)
      AND status NOT IN ('cancelled', 'declined')
      AND start_time < p_end_time
      AND end_time > p_start_time
  ) INTO has_booking;
  
  RETURN has_availability AND NOT has_booking;
END;
$$ LANGUAGE plpgsql STABLE;
