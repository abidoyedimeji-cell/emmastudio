-- SEED: 20 Studios + 20 Creators (South & East London)
-- Includes: emma_studios, emma_creators, emma_packages, emma_services, availability_blocks
-- Notes:
-- 1) These are demo seed listings (fictional but realistic) for staging/testing.
-- 2) owner_id / user_id left NULL to avoid auth.users FK requirements.
-- 3) Availability is created as "available" blocks for the next 14 days, 10:00–18:00.

begin;

-- ------------------------------------------------------------
-- 1) Studios (20) — South & East London
-- ------------------------------------------------------------
with studios_seed as (
  select * from (values
    ('SEED - Deptford Studio One','seed-deptford-studio-one','multi-purpose','Deptford, London SE8','SE8','medium',55,220,380,
      array['Daylight corner','Blackout option','Changing area','Wi‑Fi'], array['2x LED panels','C-stand kit','Backdrop system','Bluetooth speaker'],
      'No smoking. Respect neighbours. Reset space after use.',
      '48h notice for reschedules. Deposits non-refundable within 24h.',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Peckham Content Loft','seed-peckham-content-loft','multi-purpose','Peckham, London SE15','SE15','large',65,260,460,
      array['High ceilings','Daylight windows','Makeup station','Wi‑Fi'], array['Godox strobe kit','2x softboxes','Backdrop rails','Props rack'],
      'Keep volume low after 8pm. No glitter/confetti.',
      '50% refund up to 72h. No refund within 24h.',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Greenwich Podcast Suite','seed-greenwich-podcast-suite','audio','Greenwich, London SE10','SE10','small',45,180,320,
      array['Quiet treated room','Waiting area','Wi‑Fi','Tea/coffee'], array['2x Shure SM7B','RØDECaster Pro','2x Sony headphones','Acoustic panels'],
      'Arrive 10 mins early for setup. No food in booth.',
      'Reschedule free with 48h notice.',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Brixton Portrait Studio','seed-brixton-portrait-studio','photography','Brixton, London SW2','SW2','medium',60,240,420,
      array['Daylight','Makeup mirror','Steamer','Wi‑Fi'], array['3x backdrops','Continuous LED tube','Reflectors','Tripod'],
      'No open flames. Please keep the space tidy.',
      '50% deposit. 48h cancellation for refund.',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Camberwell Cyclorama Room','seed-camberwell-cyc-room','photography','Camberwell, London SE5','SE5','large',75,300,520,
      array['White cyc wall','Grip area','Changing room','Wi‑Fi'], array['C-stands','Boom arm','Strobe triggers','Sandbags'],
      'Shoes off on the cyc. Use shoe covers provided.',
      'Cyc repaint fee applies if marked.',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Bermondsey Film Bay','seed-bermondsey-film-bay','videography','Bermondsey, London SE1','SE1','large',80,320,560,
      array['Blackout','Drive-in load','Green screen','Wi‑Fi'], array['2x Aputure 120D','Light dome','Slider','Teleprompter'],
      'Crew max 10. No haze without approval.',
      '72h notice for cancellations.',
      'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1600&q=80',
      array[
        'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80'
      ]
    ),
    ('SEED - Lewisham Music Room','seed-lewisham-music-room','audio','Lewisham, London SE13','SE13','small',50,200,360,
      array['Vocal booth','Control room','Wi‑Fi'], array['Apollo interface','Neumann TLM 103','MIDI keys','Nearfield monitors'],
      'No external alcohol. Respect equipment.',
      '24h notice minimum.',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Dalston Photo Kitchen','seed-dalston-photo-kitchen','photography','Dalston, London E8','E8','medium',58,232,410,
      array['Styled kitchen set','Daylight','Props'], array['Backdrops','LED panels','Reflectors'],
      'No deep frying. Keep sets as found.',
      '48h notice for refund.',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Hackney Warehouse Studio','seed-hackney-warehouse-studio','multi-purpose','Hackney, London E2','E2','extra-large',90,360,640,
      array['Industrial look','High ceilings','Freight lift','Wi‑Fi'], array['Grip kit','Backdrops','Rolling stands','Props'],
      'No loud music after 9pm. Building security onsite.',
      'Security deposit required for large crews.',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Bethnal Green Audio Booth','seed-bethnal-green-audio-booth','audio','Bethnal Green, London E2','E2','small',42,168,300,
      array['Sound-treated booth','Wi‑Fi'], array['RØDE NT1','Audio interface','Pop filters','Headphones'],
      'Keep takes organised; time includes setup.',
      'Reschedule with 24h notice.',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Stratford Creator Lab','seed-stratford-creator-lab','multi-purpose','Stratford, London E15','E15','large',70,280,500,
      array['Modular sets','Makeup station','Wi‑Fi'], array['2x LED panels','Backdrops','Tripods','Props'],
      'No adhesives on walls. Use tape provided.',
      '48h notice for full refund.',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Bow Podcast Corner','seed-bow-podcast-corner','audio','Bow, London E3','E3','small',40,160,280,
      array['Quiet room','Wi‑Fi'], array['2x SM58','Mixer','Headphones','Acoustic foam'],
      'No food in booth.',
      '24h notice for reschedule.',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Canary Wharf Brand Suite','seed-canary-wharf-brand-suite','videography','Canary Wharf, London E14','E14','medium',85,340,600,
      array['Clean corporate set','Wi‑Fi','Reception'], array['Teleprompter','2x key lights','Wireless lav mics'],
      'Front-desk check-in required.',
      '48h notice for cancellations.',
      'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Limehouse Photo Studio','seed-limehouse-photo-studio','photography','Limehouse, London E14','E14','medium',62,248,440,
      array['Daylight','Changing area','Wi‑Fi'], array['Backdrops','Strobe kit','Reflectors'],
      'Respect neighbours. No loud music.',
      '48h notice.',
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Walthamstow Set Room','seed-walthamstow-set-room','multi-purpose','Walthamstow, London E17','E17','large',68,272,480,
      array['Set builds','Props','Wi‑Fi'], array['Stands','Backdrops','LED panels'],
      'No paint without approval.',
      'Refund up to 72h.',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Leyton Audio Den','seed-leyton-audio-den','audio','Leyton, London E10','E10','small',44,176,310,
      array['Vocal corner','Wi‑Fi'], array['Mic kit','Interface','Headphones'],
      'Keep levels safe; no clipping.',
      '24h notice.',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Elephant & Castle Content Room','seed-elephant-castle-content-room','multi-purpose','Elephant & Castle, London SE1','SE1','medium',63,252,450,
      array['Modular sets','Wi‑Fi','Makeup station'], array['LED panels','Backdrops','Tripods'],
      'Keep hallways clear. Respect building rules.',
      '48h notice.',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Dulwich Daylight Studio','seed-dulwich-daylight-studio','photography','Dulwich, London SE21','SE21','medium',57,228,400,
      array['Soft daylight','Props','Wi‑Fi'], array['Backdrops','Reflectors','Tripods'],
      'No confetti. Pets allowed with approval.',
      '72h notice for refund.',
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - New Cross Recording Room','seed-new-cross-recording-room','audio','New Cross, London SE14','SE14','small',52,208,370,
      array['Vocal booth','Wi‑Fi'], array['Interface','Mic locker','MIDI keys','Monitors'],
      'No food in control room.',
      '48h notice.',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Brockley Photo Loft','seed-brockley-photo-loft','photography','Brockley, London SE4','SE4','small',48,192,340,
      array['Daylight','Wi‑Fi'], array['Backdrop stand','Reflectors','LED panel'],
      'Shoes off on set areas.',
      '24h notice.',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80']
    ),
    ('SEED - Shoreditch Edit Suite','seed-shoreditch-edit-suite','videography','Shoreditch, London E1','E1','small',50,200,360,
      array['Quiet edit room','Wi‑Fi'], array['Calibrated monitor','Fast SSD','Audio monitors'],
      'No loud calls; headphones preferred.',
      'Flexible reschedule within 48h.',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
      array['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80']
    )
  ) as t(
    name, slug, studio_type, address, postcode, size,
    hourly_rate, half_day_rate, full_day_rate,
    amenities, equipment, rules, cancellation_policy, cover_image, gallery_images
  )
)
insert into public.emma_studios (
  owner_id, name, slug, description, short_bio, studio_type, address, city, postcode, size,
  hourly_rate, half_day_rate, full_day_rate, amenities, equipment, rules, cancellation_policy,
  cover_image, gallery_images, rating, review_count, is_verified, is_featured, is_active, supports_combined, status, verification_status
)
select
  null,
  s.name,
  s.slug,
  'South & East London studio built for bookings — music, podcast, photo and content shoots.',
  'Bookable studio in South/East London.',
  s.studio_type,
  s.address,
  'London',
  s.postcode,
  s.size,
  s.hourly_rate,
  s.half_day_rate,
  s.full_day_rate,
  s.amenities,
  s.equipment,
  s.rules,
  s.cancellation_policy,
  s.cover_image,
  s.gallery_images,
  4.7,
  24,
  true,
  true,
  true,
  true,
  'approved',
  'approved'
from studios_seed s
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 2) Creators (20) — South & East London
-- ------------------------------------------------------------
with creators_seed as (
  select * from (values
    ('SEED - Ayo Mensah','seed-ayo-mensah','photographer','Portrait + brand campaigns','SE15',55,220,400,
      array['Portraits','Brand shoots','Editorial'],
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Talia Rose','seed-talia-rose','videographer','Reels + fashion content','SW2',65,260,480,
      array['Short-form','Campaign video','Lookbooks'],
      'https://images.unsplash.com/photo-1520975958225-2b4b1f66a8c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b38?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Kofi Adeyemi','seed-kofi-adeyemi','audio_engineer','Recording + mix engineer','SE8',50,200,360,
      array['Recording','Mixing','Vocal tuning'],
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Hana Okoye','seed-hana-okoye','photographer','Product + e‑com','SE10',60,240,420,
      array['Product','E‑com','Lifestyle'],
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519340333755-c04f8a22c384?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Jay Fields','seed-jay-fields','editor','Video editing + colour','E1',55,220,400,
      array['Editing','Colour grade','Sound clean'],
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Zain Malik','seed-zain-malik','videographer','Event + nightlife','E2',70,280,520,
      array['Events','Nightlife','Aftermovies'],
      'https://images.unsplash.com/photo-1520975958225-2b4b1f66a8c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Nia Carter','seed-nia-carter','multi-discipline','Creative direction + photo','SE5',75,300,560,
      array['Creative direction','Photo','Set design'],
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Ethan Miles','seed-ethan-miles','audio_engineer','Podcast engineer','SE1',55,220,400,
      array['Podcast setup','Live mix','Audio edit'],
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Sade Williams','seed-sade-williams','photographer','Fashion + editorial','E8',68,272,500,
      array['Fashion','Editorial','Beauty'],
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b38?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Leo Grant','seed-leo-grant','videographer','Brand films + interviews','E14',85,340,620,
      array['Interviews','Brand films','Corporate'],
      'https://images.unsplash.com/photo-1520975958225-2b4b1f66a8c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Imani Clarke','seed-imani-clarke','photographer','Music portraits','SE14',62,248,450,
      array['Music portraits','Press shots','Live sets'],
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Omar Aziz','seed-omar-aziz','editor','Short-form editor','E15',50,200,360,
      array['Reels edit','Captions','Motion graphics'],
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Ruby Chen','seed-ruby-chen','multi-discipline','Photo + video hybrid','E14',72,288,540,
      array['Photo','Video','Campaign content'],
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b38?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Malik Stone','seed-malik-stone','audio_engineer','Artist sessions + mix','SE13',58,232,420,
      array['Recording','Mix','Master prep'],
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Grace Holloway','seed-grace-holloway','photographer','Food + product','E3',60,240,420,
      array['Food','Product','Styled sets'],
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519340333755-c04f8a22c384?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Theo Bennett','seed-theo-bennett','videographer','YouTube + podcast video','E17',66,264,500,
      array['Podcast video','YouTube','Studio lighting'],
      'https://images.unsplash.com/photo-1520975958225-2b4b1f66a8c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Amara Dube','seed-amara-dube','photographer','Beauty + skincare','SE4',64,256,470,
      array['Beauty','Skincare','Studio portrait'],
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b38?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Daniel Okafor','seed-daniel-okafor','editor','Long-form editor','SE1',52,208,380,
      array['Long-form','Cutdowns','Subtitles'],
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Aisha Noor','seed-aisha-noor','videographer','Fashion BTS + reels','E2',62,248,470,
      array['BTS','Reels','Runway'],
      'https://images.unsplash.com/photo-1520975958225-2b4b1f66a8c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    ),
    ('SEED - Samuel King','seed-samuel-king','audio_engineer','Podcast edit + cleanup','E10',48,192,340,
      array['Noise reduction','Dialogue edit','Mix'],
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'
    )
  ) as t(
    display_name, slug, creator_type, specialty, postcode,
    hourly_rate, half_day_rate, full_day_rate,
    skills, avatar_url, cover_image
  )
)
insert into public.emma_creators (
  user_id, display_name, slug, bio, short_bio, creator_type, specialty,
  skills, years_experience, hourly_rate, half_day_rate, full_day_rate, city, postcode,
  avatar_url, cover_image, portfolio_images, portfolio_videos, badges,
  rating, review_count, completed_bookings, returning_clients,
  is_verified, is_featured, is_active, supports_combined, status, verification_status, instagram_url, website_url
)
select
  null,
  c.display_name,
  c.slug,
  'South & East London creator available for bookings. Studio-ready and fast turnaround.',
  c.specialty,
  c.creator_type,
  c.specialty,
  c.skills,
  6,
  c.hourly_rate,
  c.half_day_rate,
  c.full_day_rate,
  'London',
  c.postcode,
  c.avatar_url,
  c.cover_image,
  array[
    'https://images.unsplash.com/photo-1520975682031-a2c3b1a7f5a7?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b38?auto=format&fit=crop&w=1400&q=80'
  ],
  array[]::text[],
  array['Emma Certified','Fast Turnaround'],
  4.8,
  18,
  42,
  9,
  true,
  true,
  true,
  true,
  'approved',
  'approved',
  'https://instagram.com/emma.studios',
  'https://emmacompany.co'
from creators_seed c
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 3) Services for creators (2 each)
-- ------------------------------------------------------------
insert into public.emma_services (creator_id, name, description, category, base_price, is_active)
select
  c.id,
  case
    when c.creator_type = 'photographer' then 'Photography Session'
    when c.creator_type = 'videographer' then 'Video Shoot'
    when c.creator_type = 'audio_engineer' then 'Audio Engineering'
    when c.creator_type = 'editor' then 'Editing & Post'
    else 'Creative Service'
  end,
  'Core service booked as part of a package or custom request.',
  case
    when c.creator_type = 'photographer' then 'photography'
    when c.creator_type = 'videographer' then 'videography'
    when c.creator_type = 'audio_engineer' then 'audio'
    when c.creator_type = 'editor' then 'editing'
    else 'other'
  end,
  coalesce(c.hourly_rate, 50) * 2,
  true
from public.emma_creators c
where c.slug like 'seed-%';

insert into public.emma_services (creator_id, name, description, category, base_price, is_active)
select
  c.id,
  'Add-on: Rush Delivery',
  '48-hour delivery of selects / first cut.',
  'other',
  75,
  true
from public.emma_creators c
where c.slug like 'seed-%';

-- ------------------------------------------------------------
-- 4) Packages for studios (3 each) + creators (3 each)
-- ------------------------------------------------------------
-- Studio packages: 2h / 4h / 8h
insert into public.emma_packages (studio_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  s.id,
  '2 Hour Block',
  'Perfect for quick content, portraits, pickups or a podcast episode.',
  2,
  round(coalesce(s.hourly_rate, 60) * 2, 2),
  array['Studio access','Basic setup','House rules briefing'],
  true,
  true,
  true
from public.emma_studios s
where s.slug like 'seed-%';

insert into public.emma_packages (studio_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  s.id,
  'Half Day (4 Hours)',
  'Ideal for brand shoots, multiple setups, or a 2–3 episode podcast batch.',
  4,
  round(coalesce(s.half_day_rate, coalesce(s.hourly_rate, 60) * 4), 2),
  array['Studio access','Lighting/grip available','Changing area'],
  false,
  true,
  true
from public.emma_studios s
where s.slug like 'seed-%';

insert into public.emma_packages (studio_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  s.id,
  'Full Day (8 Hours)',
  'For full productions, lookbooks, multi-scene video, or long sessions.',
  8,
  round(coalesce(s.full_day_rate, coalesce(s.hourly_rate, 60) * 8), 2),
  array['Studio access','Priority setup','Flexible break times'],
  false,
  true,
  true
from public.emma_studios s
where s.slug like 'seed-%';

-- Creator packages: 2h / 4h / 8h
insert into public.emma_packages (creator_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  c.id,
  '2 Hour Session',
  'Quick shoot / recording support / edit sprint.',
  2,
  round(coalesce(c.hourly_rate, 60) * 2, 2),
  array['Pre-call checklist','On-site coverage','Basic deliverables'],
  true,
  true,
  true
from public.emma_creators c
where c.slug like 'seed-%';

insert into public.emma_packages (creator_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  c.id,
  'Half Day (4 Hours)',
  'Best for multi-look shoots, interviews, or podcast batch sessions.',
  4,
  round(coalesce(c.half_day_rate, coalesce(c.hourly_rate, 60) * 4), 2),
  array['Planning support','On-site coverage','Selectable deliverables'],
  false,
  true,
  true
from public.emma_creators c
where c.slug like 'seed-%';

insert into public.emma_packages (creator_id, name, description, duration_hours, price, includes, is_popular, is_active, accepts_combined)
select
  c.id,
  'Full Day (8 Hours)',
  'For campaigns, lookbooks, longer productions, or full-day edits.',
  8,
  round(coalesce(c.full_day_rate, coalesce(c.hourly_rate, 60) * 8), 2),
  array['Full coverage','Priority delivery slot','Wrap-up checklist'],
  false,
  true,
  true
from public.emma_creators c
where c.slug like 'seed-%';

-- ------------------------------------------------------------
-- 5) Availability (calendar-ready) using availability_blocks
-- Next 14 days, 10:00–18:00 as "available"
-- ------------------------------------------------------------
insert into public.availability_blocks (creator_id, start_time, end_time, is_available, block_type, notes)
select
  c.id,
  (d::date + time '10:00')::timestamptz,
  (d::date + time '18:00')::timestamptz,
  true,
  'available',
  'Seed availability'
from public.emma_creators c
cross join generate_series(current_date, current_date + interval '13 days', interval '1 day') d
where c.slug like 'seed-%';

insert into public.availability_blocks (studio_id, start_time, end_time, is_available, block_type, notes)
select
  s.id,
  (d::date + time '10:00')::timestamptz,
  (d::date + time '18:00')::timestamptz,
  true,
  'available',
  'Seed availability'
from public.emma_studios s
cross join generate_series(current_date, current_date + interval '13 days', interval '1 day') d
where s.slug like 'seed-%';

commit;
