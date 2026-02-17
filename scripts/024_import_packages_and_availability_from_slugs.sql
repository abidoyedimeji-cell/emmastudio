-- 024_import_packages_and_availability_from_slugs.sql
-- Use this if you import packages/availability using the slug-based CSV templates.
-- Steps:
-- 1) Import csv_template_packages_by_slug.csv into public.import_packages_by_slug
-- 2) Import csv_template_availability_by_slug.csv into public.import_availability_by_slug
-- 3) Run this script to resolve slugs -> UUIDs and insert into emma_packages / availability_blocks.

begin;

create table if not exists public.import_packages_by_slug (
  package_owner_type text not null check (package_owner_type in ('studio','creator')),
  studio_slug text,
  creator_slug text,
  name text not null,
  description text,
  duration_hours numeric not null,
  price numeric not null,
  includes text[] default '{}',
  is_popular boolean default false,
  is_active boolean default true
);

create table if not exists public.import_availability_by_slug (
  availability_owner_type text not null check (availability_owner_type in ('studio','creator')),
  studio_slug text,
  creator_slug text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_available boolean default true,
  block_type text default 'available',
  notes text
);

-- Insert studio packages
insert into public.emma_packages (studio_id, name, description, duration_hours, price, includes, is_popular, is_active)
select
  s.id,
  i.name,
  i.description,
  i.duration_hours,
  i.price,
  coalesce(i.includes,'{}'::text[]),
  coalesce(i.is_popular,false),
  coalesce(i.is_active,true)
from public.import_packages_by_slug i
join public.emma_studios s on s.slug = i.studio_slug
where i.package_owner_type = 'studio'
on conflict do nothing;

-- Insert creator packages
insert into public.emma_packages (creator_id, name, description, duration_hours, price, includes, is_popular, is_active)
select
  c.id,
  i.name,
  i.description,
  i.duration_hours,
  i.price,
  coalesce(i.includes,'{}'::text[]),
  coalesce(i.is_popular,false),
  coalesce(i.is_active,true)
from public.import_packages_by_slug i
join public.emma_creators c on c.slug = i.creator_slug
where i.package_owner_type = 'creator'
on conflict do nothing;

-- Insert studio availability
insert into public.availability_blocks (studio_id, start_time, end_time, is_available, block_type, notes)
select
  s.id,
  a.start_time,
  a.end_time,
  coalesce(a.is_available,true),
  coalesce(a.block_type,'available'),
  a.notes
from public.import_availability_by_slug a
join public.emma_studios s on s.slug = a.studio_slug
where a.availability_owner_type = 'studio';

-- Insert creator availability
insert into public.availability_blocks (creator_id, start_time, end_time, is_available, block_type, notes)
select
  c.id,
  a.start_time,
  a.end_time,
  coalesce(a.is_available,true),
  coalesce(a.block_type,'available'),
  a.notes
from public.import_availability_by_slug a
join public.emma_creators c on c.slug = a.creator_slug
where a.availability_owner_type = 'creator';

commit;

-- Optional: truncate import tables after successful import
-- truncate table public.import_packages_by_slug;
-- truncate table public.import_availability_by_slug;
