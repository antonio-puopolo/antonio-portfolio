-- Lead Tracker · initial schema
--
-- How to apply:
--   1. Open your Supabase project -> SQL editor
--   2. Paste the entire contents of this file and run
--   3. Copy your project URL + anon key into .env (see .env.example)
--
-- Single-tenant model: every row is scoped to the signed-in user via auth.uid().
-- A trigger auto-fills user_id on insert so the client never has to set it.

------------------------------------------------------------
-- Extensions
------------------------------------------------------------
create extension if not exists "pgcrypto";

------------------------------------------------------------
-- Enums
------------------------------------------------------------
create type stage as enum (
  'new_lead',
  'nurturing',
  'lap_booked',
  'lap_done',
  'listing_signed',
  'on_market',
  'under_contract',
  'sold',
  'lost'
);

create type lead_source as enum (
  'ofi',
  'door_knock',
  'referral',
  'online_enquiry',
  'appraisal_request',
  'social',
  'past_client',
  'other'
);

create type lost_reason as enum (
  'listed_with_another_agent',
  'withdrew_from_market',
  'not_selling_anymore',
  'sold_privately',
  'no_contact',
  'other'
);

create type contact_role as enum (
  'owner',
  'partner',
  'decision_maker',
  'other'
);

create type activity_kind as enum (
  'call',
  'sms',
  'email',
  'inspection',
  'note',
  'voice',
  'stage_change'
);

create type call_outcome as enum (
  'spoke',
  'no_answer',
  'left_vm',
  'booked_lap',
  'wrong_number',
  'do_not_call'
);

------------------------------------------------------------
-- Tables
------------------------------------------------------------
create table public.properties (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users on delete cascade,
  address             text not null,
  suburb              text,
  postcode            text,
  property_type       text,
  beds                smallint,
  baths               smallint,
  cars                smallint,
  est_price_low       integer,
  est_price_high      integer,
  source              lead_source,
  stage               stage not null default 'new_lead',
  next_follow_up_at   timestamptz,
  snoozed_until       timestamptz,
  lost_reason         lost_reason,
  lost_note           text,
  listed_at           timestamptz,
  sold_at             timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.contacts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  property_id  uuid not null references public.properties on delete cascade,
  name         text not null,
  role         contact_role not null default 'owner',
  phone        text,
  email        text,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);

create table public.activities (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  property_id  uuid not null references public.properties on delete cascade,
  kind         activity_kind not null,
  outcome      call_outcome,
  body         text,
  transcript   text,
  from_stage   stage,
  to_stage     stage,
  created_at   timestamptz not null default now()
);

------------------------------------------------------------
-- Triggers
------------------------------------------------------------

-- Auto-fill user_id from auth.uid() on insert (so client never sets it).
create or replace function public.set_user_id()
returns trigger language plpgsql security definer as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

create trigger properties_set_user_id
  before insert on public.properties
  for each row execute function public.set_user_id();

create trigger contacts_set_user_id
  before insert on public.contacts
  for each row execute function public.set_user_id();

create trigger activities_set_user_id
  before insert on public.activities
  for each row execute function public.set_user_id();

-- Maintain updated_at on properties.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- When stage changes, log a stage_change activity and stamp listed_at / sold_at.
create or replace function public.handle_stage_change()
returns trigger language plpgsql as $$
begin
  if new.stage is distinct from old.stage then
    if new.stage = 'on_market' and new.listed_at is null then
      new.listed_at := now();
    end if;
    if new.stage = 'sold' and new.sold_at is null then
      new.sold_at := now();
    end if;

    insert into public.activities (user_id, property_id, kind, from_stage, to_stage)
    values (old.user_id, new.id, 'stage_change', old.stage, new.stage);
  end if;
  return new;
end;
$$;

create trigger properties_handle_stage_change
  before update of stage on public.properties
  for each row execute function public.handle_stage_change();

------------------------------------------------------------
-- Row Level Security
------------------------------------------------------------
alter table public.properties enable row level security;
alter table public.contacts   enable row level security;
alter table public.activities enable row level security;

create policy "own_properties" on public.properties
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_contacts" on public.contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_activities" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

------------------------------------------------------------
-- Indexes
------------------------------------------------------------
create index properties_user_stage_idx
  on public.properties (user_id, stage);

create index properties_user_followup_idx
  on public.properties (user_id, next_follow_up_at)
  where next_follow_up_at is not null;

create index contacts_property_idx
  on public.contacts (property_id);

create index activities_property_created_idx
  on public.activities (property_id, created_at desc);
