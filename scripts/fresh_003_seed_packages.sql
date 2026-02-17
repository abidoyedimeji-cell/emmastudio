-- Seed script for 5 studios with single and dual packages
-- Run this after 002_seed_emma_data.sql

-- Clear existing packages for clean seed
DELETE FROM emma_packages WHERE studio_id IS NOT NULL OR creator_id IS NOT NULL;

-- Using actual studio IDs from seed data with slug matching to avoid NULL constraint violations

-- Studio Packages - Single and Dual for 5 studios
INSERT INTO emma_packages (id, studio_id, name, description, duration_hours, price, includes, is_popular, is_active)
VALUES
  -- Studio 1: Shoreditch Photo Studio
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'shoreditch-photo-studio' LIMIT 1), 
   'Solo Session', 'Perfect for individual photoshoots', 3, 150, 
   ARRAY['3 hour studio access', 'Basic lighting setup', 'Backdrop options', 'WiFi access'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'shoreditch-photo-studio' LIMIT 1), 
   'Duo Package', 'Ideal for couples or small group shoots', 6, 280, 
   ARRAY['6 hour studio access', 'Full lighting kit', 'Multiple backdrops', 'Changing room', 'Refreshments'], true, true),

  -- Studio 2: Brixton Sound House
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'brixton-sound-house' LIMIT 1),
   'Quick Mix', 'Fast turnaround audio session', 3, 200,
   ARRAY['3 hour studio time', 'Basic mixing', 'Engineer assistance', 'Digital export'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'brixton-sound-house' LIMIT 1),
   'Full Production', 'Complete recording and mixing session', 8, 500,
   ARRAY['8 hour studio time', 'Full mixing and mastering', 'Dedicated engineer', 'Unlimited revisions', 'Physical and digital masters'], true, true),

  -- Studio 3: Camden Video Hub
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'camden-video-hub' LIMIT 1),
   'Content Creator', 'Quick video content session', 4, 250,
   ARRAY['4 hour studio access', 'Green screen', 'Basic lighting', 'Teleprompter'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'camden-video-hub' LIMIT 1),
   'Production Day', 'Full day video production', 10, 650,
   ARRAY['10 hour studio access', 'Full lighting rig', 'Multiple camera setup', 'Grip equipment', 'Production assistant'], true, true),

  -- Studio 4: Manchester Creative Loft
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'manchester-creative-loft' LIMIT 1),
   'Half Day Flex', 'Flexible half day booking', 4, 180,
   ARRAY['4 hour access', 'Configurable space', 'Basic equipment', 'WiFi'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'manchester-creative-loft' LIMIT 1),
   'Full Day Takeover', 'Complete studio access for the day', 12, 400,
   ARRAY['12 hour exclusive access', 'All equipment included', 'Kitchen access', 'Parking for 3 cars', 'Overnight gear storage'], true, true),

  -- Studio 5: Soho Production House
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'soho-production-house' LIMIT 1),
   'Premium Session', 'Luxury studio experience', 4, 350,
   ARRAY['4 hour premium access', 'High-end equipment', 'Styling area', 'Catering included'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_studios WHERE slug = 'soho-production-house' LIMIT 1),
   'VIP Full Day', 'Ultimate creative experience', 10, 800,
   ARRAY['10 hour VIP access', 'All premium equipment', 'Personal assistant', 'Gourmet catering', 'Valet parking', 'Post-production suite access'], true, true);

-- Creator Packages - Single and Dual for 5 creators
INSERT INTO emma_packages (id, creator_id, name, description, duration_hours, price, includes, is_popular, is_active)
VALUES
  -- Creator 1: Marcus Johnson (Photographer)
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'marcus-johnson' LIMIT 1),
   'Portrait Session', 'Professional portrait photography', 2, 180,
   ARRAY['2 hour session', '20 edited photos', 'Online gallery', 'Print rights'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'marcus-johnson' LIMIT 1),
   'Full Shoot', 'Extended photography session', 5, 400,
   ARRAY['5 hour session', '50 edited photos', 'Online gallery', 'Print rights', '2 outfit changes', 'Location scouting'], true, true),

  -- Creator 2: Aisha Williams (Videographer)
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'aisha-williams' LIMIT 1),
   'Short Form', 'Social media video content', 3, 250,
   ARRAY['3 hour shoot', '3 edited clips', 'Social media formats', 'Music licensing'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'aisha-williams' LIMIT 1),
   'Full Video Package', 'Complete video production', 8, 700,
   ARRAY['8 hour shoot', 'Full edited video', 'Behind the scenes', 'Raw footage', 'Color grading', '2 revision rounds'], true, true),

  -- Creator 3: James Chen (Audio Engineer)
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'james-chen' LIMIT 1),
   'Track Mix', 'Single track mixing', 2, 120,
   ARRAY['2 hour session', 'Full mix', 'Stem exports', '1 revision'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'james-chen' LIMIT 1),
   'EP Package', 'Multi-track EP mixing', 10, 500,
   ARRAY['Up to 5 tracks', 'Full mixing', 'Mastering', 'Unlimited revisions', 'Stem exports'], true, true),

  -- Creator 4: Sofia Rodriguez (Editor)
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'sofia-rodriguez' LIMIT 1),
   'Quick Edit', 'Fast turnaround editing', 1, 80,
   ARRAY['1 hour editing', 'Basic color correction', 'Music sync', 'Export in 2 formats'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'sofia-rodriguez' LIMIT 1),
   'Full Post', 'Complete post-production', 6, 350,
   ARRAY['6 hours editing', 'Color grading', 'Sound design', 'Graphics', 'Multiple formats', '3 revision rounds'], true, true),

  -- Creator 5: Lucas Martinez (Multi-discipline)
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'lucas-martinez' LIMIT 1),
   'Content Bundle', 'Photo + Video combo', 4, 300,
   ARRAY['4 hour session', '15 photos', '1 short video', 'Social media edits'], false, true),
  (gen_random_uuid(), (SELECT id FROM emma_creators WHERE slug = 'lucas-martinez' LIMIT 1),
   'Full Creative', 'Complete content creation', 8, 600,
   ARRAY['8 hour session', '40 photos', '3 videos', 'Full editing', 'Social media package', 'Brand kit'], true, true);
