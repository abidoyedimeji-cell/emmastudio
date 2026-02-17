-- 020_add_owner_fields.sql
-- Adds ownership fields to existing tables so marketplace RLS + RPCs can enforce permissions.

begin;

-- 1) Studios: add owner_profile_id if it doesn't exist
alter table if exists public.emma_studios
  add column if not exists owner_profile_id uuid;

-- 2) Creators: add owner_profile_id if it doesn't exist
alter table if exists public.emma_creators
  add column if not exists owner_profile_id uuid;

-- 3) Add FKs
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'studios_owner_profile_id_fkey'
  ) then
    alter table public.emma_studios
      add constraint studios_owner_profile_id_fkey
      foreign key (owner_profile_id) references public.profiles(id)
      on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'creators_owner_profile_id_fkey'
  ) then
    alter table public.emma_creators
      add constraint creators_owner_profile_id_fkey
      foreign key (owner_profile_id) references public.profiles(id)
      on delete set null;
  end if;
end $$;

-- 4) Performance indexes
create index if not exists idx_studios_owner_profile_id on public.emma_studios(owner_profile_id);
create index if not exists idx_creators_owner_profile_id on public.emma_creators(owner_profile_id);

-- 5) Ownership helper functions
create or replace function public.is_studio_owner(p_studio_id uuid, p_profile_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.emma_studios s
    where s.id = p_studio_id
      and s.owner_profile_id = p_profile_id
  );
$$;

create or replace function public.is_creator_owner(p_creator_id uuid, p_profile_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.emma_creators c
    where c.id = p_creator_id
      and c.owner_profile_id = p_profile_id
  );
$$;

commit;
