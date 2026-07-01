-- ChurchWork Pilot Safe v1 foundation
-- Date: 2026-07-01
-- Purpose: backend schema and RLS direction for Grandview + Hope Church Pilot #001.
-- Guardrail: requester path is structured only. No requester notes. No medical fields.

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared helpers
-- -----------------------------------------------------------------------------

create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organization_type text not null check (organization_type in ('platform', 'facility', 'partner')),
  status text not null default 'active' check (status in ('active', 'pilot', 'paused', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null check (role in ('owner', 'platform_admin', 'facility_admin', 'facility_staff', 'partner_admin', 'partner_user', 'requester')),
  status text not null default 'active' check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, organization_id, role)
);

create index if not exists role_memberships_user_id_idx on public.role_memberships(user_id);
create index if not exists role_memberships_organization_id_idx on public.role_memberships(organization_id);
create index if not exists role_memberships_role_idx on public.role_memberships(role);

create or replace function public.user_has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role = any(allowed_roles)
  );
$$;

create or replace function public.user_has_org_role(target_organization_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.organization_id = target_organization_id
      and rm.status = 'active'
      and rm.role = any(allowed_roles)
  );
$$;

-- -----------------------------------------------------------------------------
-- Organizations
-- -----------------------------------------------------------------------------

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  name text not null,
  address_line_1 text,
  city text,
  state text,
  postal_code text,
  status text not null default 'pilot' check (status in ('pilot', 'active', 'paused', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_organizations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  name text not null,
  partner_type text not null default 'church' check (partner_type in ('church', 'ministry', 'care_group', 'other')),
  status text not null default 'pilot' check (status in ('pilot', 'active', 'paused', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.user_can_access_facility(target_facility_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.facilities f
    where f.id = target_facility_id
      and public.user_has_org_role(f.organization_id, allowed_roles)
  );
$$;

create or replace function public.user_can_access_partner(target_partner_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.partner_organizations po
    where po.id = target_partner_id
      and public.user_has_org_role(po.organization_id, allowed_roles)
  );
$$;

-- -----------------------------------------------------------------------------
-- Requests and partner assignments
-- -----------------------------------------------------------------------------

create table if not exists public.care_requests (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  requester_user_id uuid references auth.users(id) on delete set null,
  requester_display_name text not null,
  requester_role text not null check (requester_role in ('resident', 'family', 'facility_staff', 'church_member', 'community_member', 'other')),
  relationship_to_resident text,
  resident_display_name text not null,
  room_or_unit text,
  request_type text not null check (request_type in ('prayer', 'pastoral_visit', 'family_support', 'church_connection', 'facility_follow_up')),
  priority text not null default 'routine' check (priority in ('today', 'this_week', 'routine')),
  status text not null default 'new' check (status in ('new', 'facility_review', 'partner_ready', 'partner_assigned', 'visit_planned', 'completed', 'closed', 'paused')),
  no_medical_information_acknowledged boolean not null default false,
  source text not null default 'requester_path' check (source in ('requester_path', 'facility_path', 'partner_path', 'owner_path')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(requester_display_name) <= 160),
  check (char_length(resident_display_name) <= 160),
  check (char_length(room_or_unit) <= 80),
  check (relationship_to_resident is null or char_length(relationship_to_resident) <= 120),
  check (no_medical_information_acknowledged = true)
);

comment on table public.care_requests is 'Structured spiritual-care requests only. No requester notes and no medical fields.';
comment on column public.care_requests.no_medical_information_acknowledged is 'Required acknowledgment that no diagnosis, symptoms, medications, treatment details, chart notes, clinical instructions, insurance, or emergency information is submitted.';

create index if not exists care_requests_facility_id_idx on public.care_requests(facility_id);
create index if not exists care_requests_requester_user_id_idx on public.care_requests(requester_user_id);
create index if not exists care_requests_status_idx on public.care_requests(status);

create table if not exists public.request_partner_assignments (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  partner_organization_id uuid not null references public.partner_organizations(id) on delete cascade,
  status text not null default 'assigned' check (status in ('suggested', 'assigned', 'accepted', 'completed', 'paused', 'removed')),
  assigned_by_user_id uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  unique (care_request_id, partner_organization_id)
);

create index if not exists request_partner_assignments_request_idx on public.request_partner_assignments(care_request_id);
create index if not exists request_partner_assignments_partner_idx on public.request_partner_assignments(partner_organization_id);

create or replace function public.partner_can_access_request(target_care_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.request_partner_assignments rpa
    join public.partner_organizations po on po.id = rpa.partner_organization_id
    where rpa.care_request_id = target_care_request_id
      and rpa.status in ('assigned', 'accepted', 'completed')
      and public.user_has_org_role(po.organization_id, array['partner_admin', 'partner_user'])
  );
$$;

create or replace function public.user_can_access_request(target_care_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.care_requests cr
    where cr.id = target_care_request_id
      and (
        cr.requester_user_id = auth.uid()
        or public.user_can_access_facility(cr.facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
        or public.partner_can_access_request(cr.id)
      )
  );
$$;

-- -----------------------------------------------------------------------------
-- Timeline and actions
-- -----------------------------------------------------------------------------

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_organization_id uuid references public.organizations(id) on delete set null,
  event_type text not null check (event_type in ('request_submitted', 'facility_reviewed', 'partner_assigned', 'prayer_logged', 'visit_planned', 'visit_completed', 'follow_up_logged', 'request_closed', 'coordination_note')),
  visibility text not null default 'facility' check (visibility in ('requester', 'facility', 'partner', 'shared')),
  sharing_level text not null default 'facility_internal' check (sharing_level in ('facility_internal', 'partner_safe', 'shared_timeline')),
  priority_label text check (priority_label in ('today', 'this_week', 'routine', 'none')),
  non_medical_note text,
  created_at timestamptz not null default now(),
  check (non_medical_note is null or char_length(non_medical_note) <= 1000)
);

comment on column public.timeline_events.non_medical_note is 'Facility/partner non-medical coordination notes only. Do not store diagnosis, symptoms, medication, treatment details, chart notes, medical history, insurance, clinical instructions, or emergency information.';

create index if not exists timeline_events_request_idx on public.timeline_events(care_request_id);
create index if not exists timeline_events_visibility_idx on public.timeline_events(visibility);
create index if not exists timeline_events_created_at_idx on public.timeline_events(created_at desc);

create table if not exists public.template_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  action_type text not null check (action_type in ('prayer', 'pastoral_visit', 'family_support', 'church_connection', 'facility_follow_up')),
  title text not null,
  body text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.template_actions is 'Approved non-medical spiritual-care templates only.';

-- -----------------------------------------------------------------------------
-- Policies and audit
-- -----------------------------------------------------------------------------

create table if not exists public.policy_documents (
  id uuid primary key default gen_random_uuid(),
  policy_key text not null,
  version text not null,
  title text not null,
  effective_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (policy_key, version)
);

create table if not exists public.policy_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_key text not null,
  version text not null,
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  unique (user_id, policy_key, version)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_idx on public.audit_logs(actor_user_id);
create index if not exists audit_logs_target_idx on public.audit_logs(target_table, target_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.role_memberships enable row level security;
alter table public.facilities enable row level security;
alter table public.partner_organizations enable row level security;
alter table public.care_requests enable row level security;
alter table public.request_partner_assignments enable row level security;
alter table public.timeline_events enable row level security;
alter table public.template_actions enable row level security;
alter table public.policy_documents enable row level security;
alter table public.policy_acceptances enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.user_has_role(array['owner', 'platform_admin']));

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Organizations
create policy "organizations_select_by_membership_or_admin"
  on public.organizations for select
  using (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_has_org_role(id, array['facility_admin', 'facility_staff', 'partner_admin', 'partner_user', 'requester'])
  );

-- Role memberships
create policy "role_memberships_select_own_or_admin"
  on public.role_memberships for select
  using (user_id = auth.uid() or public.user_has_role(array['owner', 'platform_admin']));

create policy "role_memberships_manage_platform_admins"
  on public.role_memberships for all
  using (public.user_has_role(array['owner', 'platform_admin']))
  with check (public.user_has_role(array['owner', 'platform_admin']));

-- Facilities and partners
create policy "facilities_select_facility_members_or_admins"
  on public.facilities for select
  using (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_has_org_role(organization_id, array['facility_admin', 'facility_staff'])
  );

create policy "partner_orgs_select_partner_members_or_admins"
  on public.partner_organizations for select
  using (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_has_org_role(organization_id, array['partner_admin', 'partner_user'])
  );

-- Care requests
create policy "care_requests_select_by_role"
  on public.care_requests for select
  using (
    requester_user_id = auth.uid()
    or public.user_can_access_facility(facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
    or public.partner_can_access_request(id)
  );

create policy "care_requests_insert_requester_or_facility"
  on public.care_requests for insert
  with check (
    no_medical_information_acknowledged = true
    and (
      requester_user_id = auth.uid()
      or public.user_can_access_facility(facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
    )
  );

create policy "care_requests_update_facility_or_admin"
  on public.care_requests for update
  using (public.user_can_access_facility(facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff']))
  with check (public.user_can_access_facility(facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff']));

-- Partner assignments
create policy "assignments_select_related_users"
  on public.request_partner_assignments for select
  using (
    public.user_can_access_request(care_request_id)
    or public.user_can_access_partner(partner_organization_id, array['partner_admin', 'partner_user'])
  );

create policy "assignments_manage_facility_or_admin"
  on public.request_partner_assignments for all
  using (
    exists (
      select 1
      from public.care_requests cr
      where cr.id = care_request_id
        and public.user_can_access_facility(cr.facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
    )
  )
  with check (
    exists (
      select 1
      from public.care_requests cr
      where cr.id = care_request_id
        and public.user_can_access_facility(cr.facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
    )
  );

-- Timeline events
create policy "timeline_select_by_role_and_visibility"
  on public.timeline_events for select
  using (
    exists (
      select 1
      from public.care_requests cr
      where cr.id = care_request_id
        and (
          (cr.requester_user_id = auth.uid() and visibility in ('requester', 'shared'))
          or public.user_can_access_facility(cr.facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
          or (public.partner_can_access_request(cr.id) and visibility in ('partner', 'shared') and sharing_level in ('partner_safe', 'shared_timeline'))
        )
    )
  );

create policy "timeline_insert_facility_partner_or_requester"
  on public.timeline_events for insert
  with check (
    exists (
      select 1
      from public.care_requests cr
      where cr.id = care_request_id
        and (
          public.user_can_access_facility(cr.facility_id, array['owner', 'platform_admin', 'facility_admin', 'facility_staff'])
          or (public.partner_can_access_request(cr.id) and visibility in ('partner', 'shared') and sharing_level in ('partner_safe', 'shared_timeline'))
          or (cr.requester_user_id = auth.uid() and event_type = 'request_submitted' and non_medical_note is null)
        )
    )
  );

-- Templates
create policy "templates_select_org_members"
  on public.template_actions for select
  using (
    organization_id is null
    or public.user_has_role(array['owner', 'platform_admin'])
    or public.user_has_org_role(organization_id, array['facility_admin', 'facility_staff', 'partner_admin', 'partner_user'])
  );

create policy "templates_manage_admins"
  on public.template_actions for all
  using (public.user_has_role(array['owner', 'platform_admin']))
  with check (public.user_has_role(array['owner', 'platform_admin']));

-- Policies
create policy "policy_documents_select_active"
  on public.policy_documents for select
  using (is_active = true or public.user_has_role(array['owner', 'platform_admin']));

create policy "policy_acceptances_select_own_or_admin"
  on public.policy_acceptances for select
  using (user_id = auth.uid() or public.user_has_role(array['owner', 'platform_admin']));

create policy "policy_acceptances_insert_own"
  on public.policy_acceptances for insert
  with check (user_id = auth.uid());

-- Audit logs
create policy "audit_logs_select_admins"
  on public.audit_logs for select
  using (public.user_has_role(array['owner', 'platform_admin']));

create policy "audit_logs_insert_authenticated"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

-- -----------------------------------------------------------------------------
-- Pilot seed records. User membership is intentionally not seeded here.
-- -----------------------------------------------------------------------------

insert into public.organizations (name, slug, organization_type, status)
values
  ('ChurchWork', 'churchwork', 'platform', 'pilot'),
  ('Grandview Post Acute', 'grandview-post-acute', 'facility', 'pilot'),
  ('Hope Church', 'hope-church', 'partner', 'pilot')
on conflict (slug) do update set
  name = excluded.name,
  organization_type = excluded.organization_type,
  status = excluded.status,
  updated_at = now();

insert into public.facilities (organization_id, name, address_line_1, city, state, postal_code, status)
select id, 'Grandview Post Acute', '444 One Eleven Pl', 'Cookeville', 'TN', null, 'pilot'
from public.organizations
where slug = 'grandview-post-acute'
on conflict (organization_id) do update set
  name = excluded.name,
  address_line_1 = excluded.address_line_1,
  city = excluded.city,
  state = excluded.state,
  postal_code = excluded.postal_code,
  status = excluded.status,
  updated_at = now();

insert into public.partner_organizations (organization_id, name, partner_type, status)
select id, 'Hope Church', 'church', 'pilot'
from public.organizations
where slug = 'hope-church'
on conflict (organization_id) do update set
  name = excluded.name,
  partner_type = excluded.partner_type,
  status = excluded.status,
  updated_at = now();

insert into public.policy_documents (policy_key, version, title, is_active)
values
  ('terms_of_service', 'pilot-safe-v1', 'ChurchWork Terms of Service', true),
  ('privacy_policy', 'pilot-safe-v1', 'ChurchWork Privacy Policy', true),
  ('pilot_participation_notice', 'pilot-safe-v1', 'ChurchWork Pilot Participation Notice', true),
  ('requester_acknowledgment', 'pilot-safe-v1', 'Requester Acknowledgment', true),
  ('facility_user_acknowledgment', 'pilot-safe-v1', 'Facility User Acknowledgment', true),
  ('partner_confidentiality_acknowledgment', 'pilot-safe-v1', 'Partner User Confidentiality Acknowledgment', true),
  ('no_medical_information_policy', 'pilot-safe-v1', 'No Medical Information Policy', true)
on conflict (policy_key, version) do update set
  title = excluded.title,
  is_active = excluded.is_active;
