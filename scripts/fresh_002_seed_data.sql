-- Seed data for EMMA Studios
-- This script creates sample creators and studios with valid UUIDs

-- Clear existing data for clean re-seed
DELETE FROM emma_reviews WHERE creator_id IS NOT NULL OR studio_id IS NOT NULL;
DELETE FROM emma_bookings WHERE id IS NOT NULL;
DELETE FROM emma_services WHERE creator_id IS NOT NULL;
DELETE FROM emma_packages WHERE creator_id IS NOT NULL OR studio_id IS NOT NULL;
DELETE FROM emma_faqs WHERE creator_id IS NOT NULL OR studio_id IS NOT NULL;
DELETE FROM emma_creators WHERE id IS NOT NULL;
DELETE FROM emma_studios WHERE id IS NOT NULL;

-- Insert 15 Creators with proper UUIDs
INSERT INTO emma_creators (
  id, display_name, slug, bio, short_bio, creator_type, specialty, skills,
  years_experience, hourly_rate, half_day_rate, full_day_rate,
  city, postcode, avatar_url, cover_image, portfolio_images, badges,
  rating, review_count, completed_bookings, returning_clients, is_featured, is_active
) VALUES
-- Using gen_random_uuid() for valid UUID generation
-- 1. Marcus Johnson - Photographer
(
  gen_random_uuid(),
  'Marcus Johnson',
  'marcus-johnson',
  'Award-winning commercial photographer with 12 years of experience specializing in fashion, product, and editorial photography.',
  'Award-winning fashion photographer',
  'photographer',
  'Fashion Photography',
  ARRAY['Portrait', 'Product', 'Editorial', 'Fashion', 'Studio Lighting'],
  12, 85.00, 220.00, 400.00,
  'London', 'E1 6AN',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['top_rated', 'verified', 'award'],
  4.9, 156, 234, 89, true, true
),
-- 2. Aisha Williams - Videographer
(
  gen_random_uuid(),
  'Aisha Williams',
  'aisha-williams',
  'Creative videographer passionate about music videos and documentaries. 8 years in the industry.',
  'Music video specialist',
  'videographer',
  'Music Videos',
  ARRAY['Music Videos', 'Documentaries', 'Color Grading', 'Drone', 'Editing'],
  8, 95.00, 250.00, 450.00,
  'Manchester', 'M1 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'top_rated'],
  4.8, 102, 187, 56, true, true
),
-- 3. James Chen - Audio Engineer
(
  gen_random_uuid(),
  'James Chen',
  'james-chen',
  'Experienced audio engineer specializing in music production and mixing. 10 years of industry experience.',
  'Music production expert',
  'audio_engineer',
  'Music Production',
  ARRAY['Mixing', 'Mastering', 'Recording', 'Sound Design', 'Music Production'],
  10, 75.00, 200.00, 350.00,
  'Birmingham', 'B1 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.7, 89, 156, 45, false, true
),
-- 4. Sofia Rodriguez - Video Editor
(
  gen_random_uuid(),
  'Sofia Rodriguez',
  'sofia-rodriguez',
  'Professional video editor with expertise in commercials and branded content. 6 years experience.',
  'Commercial video editor',
  'editor',
  'Commercial Editing',
  ARRAY['Video Editing', 'Color Correction', 'Motion Graphics', 'After Effects'],
  6, 70.00, 180.00, 320.00,
  'Leeds', 'LS1 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.6, 67, 123, 34, false, true
),
-- 5. David Thompson - Photographer
(
  gen_random_uuid(),
  'David Thompson',
  'david-thompson',
  'Portrait and lifestyle photographer capturing authentic moments. 9 years professional experience.',
  'Portrait specialist',
  'photographer',
  'Portrait Photography',
  ARRAY['Portrait', 'Lifestyle', 'Natural Light', 'Studio', 'Retouching'],
  9, 80.00, 210.00, 380.00,
  'London', 'SE1 9AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'top_rated'],
  4.8, 134, 198, 72, true, true
),
-- 6. Emma Watson - Videographer
(
  gen_random_uuid(),
  'Emma Watson',
  'emma-watson-video',
  'Corporate and event videographer with a cinematic approach. 7 years experience.',
  'Corporate videographer',
  'videographer',
  'Corporate Video',
  ARRAY['Corporate Video', 'Events', 'Interviews', 'Editing', 'Live Streaming'],
  7, 90.00, 240.00, 420.00,
  'Manchester', 'M2 3AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.7, 78, 145, 41, false, true
),
-- 7. Liam O''Brien - Audio Engineer
(
  gen_random_uuid(),
  'Liam O''Brien',
  'liam-obrien',
  'Podcast and voiceover specialist with studio setup expertise. 5 years experience.',
  'Podcast audio expert',
  'audio_engineer',
  'Podcast Production',
  ARRAY['Podcast Editing', 'Voiceover Recording', 'Audio Restoration', 'Mixing'],
  5, 65.00, 170.00, 300.00,
  'Birmingham', 'B2 4AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.5, 56, 98, 28, false, true
),
-- 8. Maya Patel - Editor
(
  gen_random_uuid(),
  'Maya Patel',
  'maya-patel',
  'Social media content creator and editor specializing in short-form content. 4 years experience.',
  'Social media editor',
  'editor',
  'Social Media Content',
  ARRAY['Short Form', 'Reels', 'TikTok', 'Instagram', 'Captions'],
  4, 60.00, 160.00, 280.00,
  'Leeds', 'LS2 7AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.6, 91, 167, 52, false, true
),
-- 9. Oliver Harris - Photographer
(
  gen_random_uuid(),
  'Oliver Harris',
  'oliver-harris',
  'Food and product photographer with studio and on-location experience. 11 years experience.',
  'Food photography expert',
  'photographer',
  'Food Photography',
  ARRAY['Food', 'Product', 'Commercial', 'Styling', 'Lighting'],
  11, 85.00, 220.00, 400.00,
  'London', 'W1 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'award'],
  4.9, 143, 212, 78, true, true
),
-- 10. Zara Ahmed - Videographer
(
  gen_random_uuid(),
  'Zara Ahmed',
  'zara-ahmed',
  'Wedding and event videographer creating cinematic memories. 6 years experience.',
  'Wedding videographer',
  'videographer',
  'Wedding Video',
  ARRAY['Weddings', 'Events', 'Drone', 'Storytelling', 'Multi-Camera'],
  6, 100.00, 260.00, 480.00,
  'Manchester', 'M3 4AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'top_rated'],
  4.8, 112, 189, 67, true, true
),
-- 11. Noah Brown - Audio Engineer
(
  gen_random_uuid(),
  'Noah Brown',
  'noah-brown',
  'Live sound engineer and recording specialist. 13 years experience.',
  'Live sound expert',
  'audio_engineer',
  'Live Sound',
  ARRAY['Live Sound', 'Recording', 'System Design', 'Mixing', 'Mastering'],
  13, 80.00, 210.00, 380.00,
  'Birmingham', 'B3 2AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'top_rated'],
  4.8, 97, 176, 61, false, true
),
-- 12. Isabella Garcia - Editor
(
  gen_random_uuid(),
  'Isabella Garcia',
  'isabella-garcia',
  'Documentary and long-form content editor. 8 years experience.',
  'Documentary editor',
  'editor',
  'Documentary Editing',
  ARRAY['Documentary', 'Long Form', 'Storytelling', 'Sound Design', 'Color'],
  8, 75.00, 195.00, 350.00,
  'Leeds', 'LS3 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.7, 71, 134, 47, false, true
),
-- 13. Ethan Wilson - Photographer
(
  gen_random_uuid(),
  'Ethan Wilson',
  'ethan-wilson',
  'Real estate and architectural photographer. 7 years experience.',
  'Architectural photographer',
  'photographer',
  'Architectural Photography',
  ARRAY['Architecture', 'Real Estate', 'Interior', 'Drone', 'HDR'],
  7, 75.00, 200.00, 360.00,
  'London', 'SW1 1AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.6, 88, 162, 53, false, true
),
-- 14. Mia Taylor - Videographer
(
  gen_random_uuid(),
  'Mia Taylor',
  'mia-taylor',
  'Brand storytelling and social media video creator. 5 years experience.',
  'Brand storyteller',
  'videographer',
  'Brand Video',
  ARRAY['Brand Content', 'Social Media', 'Interviews', 'Behind The Scenes', 'Editing'],
  5, 85.00, 225.00, 400.00,
  'Manchester', 'M4 5AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified'],
  4.7, 83, 151, 44, false, true
),
-- 15. Lucas Martinez - Multi-discipline
(
  gen_random_uuid(),
  'Lucas Martinez',
  'lucas-martinez',
  'Full-service creative offering photography, video, and editing. 9 years experience.',
  'Full-service creative',
  'photographer',
  'Multi-discipline',
  ARRAY['Photography', 'Videography', 'Editing', 'Content Strategy', 'Social Media'],
  9, 90.00, 240.00, 450.00,
  'Birmingham', 'B4 6AA',
  '/placeholder.svg?height=400&width=400',
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  ARRAY['verified', 'top_rated'],
  4.9, 127, 203, 81, true, true
);

-- Insert 15 Studios with proper UUIDs
INSERT INTO emma_studios (
  id, name, slug, description, short_bio, studio_type,
  address, city, postcode, size, amenities, equipment,
  hourly_rate, half_day_rate, full_day_rate,
  cover_image, gallery_images, rating, review_count, is_featured, is_active
) VALUES
-- Using gen_random_uuid() for valid UUID generation
-- 1. Shoreditch Photo Studio
(
  gen_random_uuid(),
  'Shoreditch Photo Studio',
  'shoreditch-photo-studio',
  'Modern photography studio in the heart of Shoreditch with natural light and professional equipment.',
  'Natural light photo studio',
  'photography',
  '123 Shoreditch High St',
  'London', 'E1 6JE',
  'large',
  ARRAY['Natural Light', 'Kitchen', 'WiFi', 'Parking', 'Air Conditioning'],
  ARRAY['Profoto Lighting', 'Backdrops', 'Props', 'Reflectors'],
  60.00, 160.00, 300.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.9, 187, true, true
),
-- 2. Brixton Sound House
(
  gen_random_uuid(),
  'Brixton Sound House',
  'brixton-sound-house',
  'Professional recording studio with vintage and modern equipment. Perfect for music production.',
  'Premium recording studio',
  'audio',
  '45 Brixton Road',
  'London', 'SW9 6BU',
  'medium',
  ARRAY['Control Room', 'Live Room', 'Kitchen', 'WiFi', 'Parking'],
  ARRAY['SSL Console', 'Pro Tools', 'Vintage Mics', 'Instruments'],
  75.00, 200.00, 380.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.8, 142, true, true
),
-- 3. Camden Video Hub
(
  gen_random_uuid(),
  'Camden Video Hub',
  'camden-video-hub',
  'Multi-purpose video production space with green screen and lighting setup.',
  'Video production space',
  'videography',
  '78 Camden High Street',
  'London', 'NW1 0LT',
  'large',
  ARRAY['Green Screen', 'WiFi', 'Kitchen', 'Editing Suite', 'Parking'],
  ARRAY['Cinema Cameras', 'Lighting Kit', 'Grip Equipment', 'Monitors'],
  70.00, 185.00, 350.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.7, 156, true, true
),
-- 4. Manchester Creative Loft
(
  gen_random_uuid(),
  'Manchester Creative Loft',
  'manchester-creative-loft',
  'Spacious industrial loft perfect for photo and video shoots.',
  'Industrial creative space',
  'photography',
  '12 Ancoats Street',
  'Manchester', 'M4 6DE',
  'large',
  ARRAY['Natural Light', 'High Ceilings', 'WiFi', 'Kitchen', 'Changing Rooms'],
  ARRAY['Backdrops', 'Lighting', 'Props', 'Stands'],
  55.00, 150.00, 280.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.8, 129, false, true
),
-- 5. Birmingham Audio Suite
(
  gen_random_uuid(),
  'Birmingham Audio Suite',
  'birmingham-audio-suite',
  'Boutique recording studio with analog warmth and digital precision.',
  'Boutique recording studio',
  'audio',
  '34 Digbeth High Street',
  'Birmingham', 'B5 6BS',
  'small',
  ARRAY['Control Room', 'Booth', 'WiFi', 'Kitchen', 'Lounge'],
  ARRAY['Analog Console', 'Pro Tools', 'Vintage Gear', 'Microphones'],
  65.00, 175.00, 320.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.6, 98, false, true
),
-- 6. Leeds Content Studio
(
  gen_random_uuid(),
  'Leeds Content Studio',
  'leeds-content-studio',
  'Modern content creation studio ideal for influencers and brands.',
  'Content creator studio',
  'videography',
  '56 Kirkgate',
  'Leeds', 'LS2 7DJ',
  'medium',
  ARRAY['Ring Lights', 'Backdrops', 'WiFi', 'Changing Room', 'Props'],
  ARRAY['Cameras', 'Lighting', 'Tripods', 'Teleprompter'],
  50.00, 140.00, 260.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.7, 114, false, true
),
-- 7. Hackney Portrait Space
(
  gen_random_uuid(),
  'Hackney Portrait Space',
  'hackney-portrait-space',
  'Intimate portrait studio with natural daylight and professional setup.',
  'Portrait photography studio',
  'photography',
  '89 Mare Street',
  'London', 'E8 4RG',
  'small',
  ARRAY['Natural Light', 'Changing Room', 'WiFi', 'Kitchen'],
  ARRAY['Lighting Kit', 'Backdrops', 'Props', 'Reflectors'],
  55.00, 145.00, 270.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.8, 167, false, true
),
-- 8. Salford Music Room
(
  gen_random_uuid(),
  'Salford Music Room',
  'salford-music-room',
  'Professional music recording and rehearsal space.',
  'Music recording space',
  'audio',
  '23 Chapel Street',
  'Manchester', 'M3 5LE',
  'medium',
  ARRAY['Live Room', 'Control Room', 'WiFi', 'Kitchen', 'Parking'],
  ARRAY['Drums', 'Amps', 'Mics', 'Mixing Console', 'Pro Tools'],
  70.00, 190.00, 360.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.7, 134, false, true
),
-- 9. Nottingham Film Studio
(
  gen_random_uuid(),
  'Nottingham Film Studio',
  'nottingham-film-studio',
  'Professional film and video production facility.',
  'Film production studio',
  'videography',
  '67 Maid Marian Way',
  'Birmingham', 'B15 1NG',
  'large',
  ARRAY['Cyclorama', 'Grid System', 'WiFi', 'Kitchen', 'Parking', 'Loading Bay'],
  ARRAY['Cinema Cameras', 'Lighting', 'Grip', 'Monitors', 'Editing Suite'],
  80.00, 210.00, 400.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.9, 178, true, true
),
-- 10. Shoreditch Multi-Space
(
  gen_random_uuid(),
  'Shoreditch Multi-Space',
  'shoreditch-multi-space',
  'Versatile creative space for all types of production.',
  'Multi-purpose studio',
  'multipurpose',
  '101 Old Street',
  'London', 'EC1V 9NR',
  'large',
  ARRAY['Natural Light', 'Blackout', 'WiFi', 'Kitchen', 'Changing Rooms', 'Parking'],
  ARRAY['Lighting', 'Backdrops', 'Props', 'Audio Equipment', 'Cameras'],
  65.00, 170.00, 320.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.8, 152, true, true
),
-- 11. Greenwich White Space
(
  gen_random_uuid(),
  'Greenwich White Space',
  'greenwich-white-space',
  'Clean white minimalist studio perfect for product photography.',
  'White cyclorama studio',
  'photography',
  '34 Greenwich High Road',
  'London', 'SE10 8JL',
  'medium',
  ARRAY['White Cyc', 'Natural Light', 'WiFi', 'Kitchen'],
  ARRAY['Profoto', 'Backdrops', 'Tables', 'Stands'],
  60.00, 165.00, 310.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.7, 121, false, true
),
-- 12. Bristol Podcast Pod
(
  gen_random_uuid(),
  'Bristol Podcast Pod',
  'bristol-podcast-pod',
  'Professional podcast recording studio with soundproofing.',
  'Podcast studio',
  'audio',
  '78 Park Street',
  'Birmingham', 'B1 5BS',
  'small',
  ARRAY['Soundproof Booth', 'WiFi', 'Kitchen', 'Lounge'],
  ARRAY['Microphones', 'Interface', 'Headphones', 'Software'],
  45.00, 120.00, 220.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.6, 87, false, true
),
-- 13. Liverpool Video Lab
(
  gen_random_uuid(),
  'Liverpool Video Lab',
  'liverpool-video-lab',
  'Cutting-edge video production and editing facility.',
  'Video production lab',
  'videography',
  '45 Bold Street',
  'Leeds', 'LS1 6L2',
  'medium',
  ARRAY['Green Screen', 'Editing Suites', 'WiFi', 'Kitchen', 'Parking'],
  ARRAY['Cameras', 'Lighting', 'Editing Workstations', 'Color Suite'],
  68.00, 180.00, 340.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.8, 145, false, true
),
-- 14. Kings Cross Studio
(
  gen_random_uuid(),
  'Kings Cross Studio',
  'kings-cross-studio',
  'Versatile photography studio near major transport links.',
  'Central photo studio',
  'photography',
  '12 York Way',
  'London', 'N1 9AA',
  'medium',
  ARRAY['Natural Light', 'Blackout', 'WiFi', 'Kitchen', 'Parking'],
  ARRAY['Lighting', 'Backdrops', 'Props', 'Changing Room'],
  58.00, 155.00, 290.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.7, 138, false, true
),
-- 15. Soho Production House
(
  gen_random_uuid(),
  'Soho Production House',
  'soho-production-house',
  'Premium multi-purpose production facility in central London.',
  'Premium production house',
  'multipurpose',
  '56 Wardour Street',
  'London', 'W1D 6QW',
  'large',
  ARRAY['Multiple Rooms', 'Green Screen', 'WiFi', 'Kitchen', 'Editing Suites', 'Parking'],
  ARRAY['Cinema Cameras', 'Lighting', 'Audio Equipment', 'Editing', 'Color Suite'],
  90.00, 240.00, 450.00,
  '/placeholder.svg?height=600&width=1200',
  ARRAY['/placeholder.svg?height=600&width=800'],
  4.9, 201, true, true
);
