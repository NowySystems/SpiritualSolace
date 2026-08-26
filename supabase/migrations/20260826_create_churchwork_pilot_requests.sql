create table if not exists public.churchwork_pilot_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null,
  requester_email text,
  support_options text[] not null default '{}',
  safe_context_note text not null default '',
  status text not null default 'facility_review',
  facility_approved_at timestamptz,
  partner_assigned_at timestamptz,
  partner_outcome text,
  requester_update text,
  requester_update_released_at timestamptz,
  activity_log jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint churchwork_pilot_requests_status_check
    check (status in (
      'draft',
      'facility_review',
      'approved_for_partner',
      'partner_outcome_logged',
      'requester_updated',
      'closed'
    ))
);

alter table public.churchwork_pilot_requests enable row level security;

drop policy if exists "Requester can read own pilot requests"
on public.churchwork_pilot_requests;

create policy "Requester can read own pilot requests"
on public.churchwork_pilot_requests
for select
to authenticated
using (requester_user_id = auth.uid());

drop policy if exists "Requester can create own pilot requests"
on public.churchwork_pilot_requests;

create policy "Requester can create own pilot requests"
on public.churchwork_pilot_requests
for insert
to authenticated
with check (requester_user_id = auth.uid());

drop policy if exists "Requester can update own pilot requests"
on public.churchwork_pilot_requests;

create policy "Requester can update own pilot requests"
on public.churchwork_pilot_requests
for update
to authenticated
using (requester_user_id = auth.uid())
with check (requester_user_id = auth.uid());

create index if not exists churchwork_pilot_requests_requester_idx
on public.churchwork_pilot_requests (requester_user_id, created_at desc);

create index if not exists churchwork_pilot_requests_status_idx
on public.churchwork_pilot_requests (status, created_at desc);

create or replace function public.set_churchwork_pilot_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_churchwork_pilot_requests_updated_at
on public.churchwork_pilot_requests;

create trigger set_churchwork_pilot_requests_updated_at
before update on public.churchwork_pilot_requests
for each row
execute function public.set_churchwork_pilot_requests_updated_at();
