-- Trigger function for booking confirmation notifications
CREATE OR REPLACE FUNCTION notify_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO notifications(user_id, type, title, message, related_entity_id, created_at)
    VALUES
      (NEW.client_id, 'booking', 'Booking Confirmed', 'Your booking has been confirmed!', NEW.id, NOW()),
      (COALESCE(NEW.creator_id, NEW.studio_id), 'booking', 'New Booking', 'You have a new confirmed booking.', NEW.id, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to bookings table
DROP TRIGGER IF EXISTS booking_confirmation_notify ON emma_bookings;

CREATE TRIGGER booking_confirmation_notify
AFTER UPDATE ON emma_bookings
FOR EACH ROW
EXECUTE FUNCTION notify_booking_confirmed();

-- Trigger function for new message notifications
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
BEGIN
  -- Notify the other participant in the conversation
  SELECT CASE 
    WHEN creator_id = NEW.sender_id THEN client_id
    ELSE creator_id
  END INTO recipient_id
  FROM conversations
  WHERE id = NEW.conversation_id;

  IF recipient_id IS NOT NULL THEN
    INSERT INTO notifications(user_id, type, title, message, related_entity_id, created_at)
    VALUES (recipient_id, 'message', 'New Message', LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END, NEW.conversation_id, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to messages table
DROP TRIGGER IF EXISTS new_message_notify ON messages;

CREATE TRIGGER new_message_notify
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();
