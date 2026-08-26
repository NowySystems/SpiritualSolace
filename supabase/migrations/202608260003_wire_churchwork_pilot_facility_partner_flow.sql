alter table public.churchwork_pilot_requests
  add column if not exists facility_id uuid references public.facilities(id),
  add column if not exists partner_id uuid references public.partner_organizations(id);

create or replace function public.set_churchwork_pilot_request_routing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
  v_partner_id uuid;
begin
  select f.id
    into v_facility_id
  from public.facilities f
  join public.organizations o on o.id = f.organization_id
  where o.slug = 'grandview-post-acute'
    and f.status = 'pilot'
  order by f.created_at
  limit 1;

  select po.id
    into v_partner_id
  from public.partner_organizations po
  join public.organizations o on o.id = po.organization_id
  where o.slug = 'hope-church'
    and po.status = 'pilot'
  order by po.created_at
  limit 1;

  if v_facility_id is null then
    raise exception 'ChurchWork pilot facility is not configured';
  end if;

  if v_partner_id is null then
    raise exception 'ChurchWork pilot partner is not configured';
  end if;

  -- Pilot #001 is intentionally fixed to Grandview + Hope Church.
  -- Always override client-supplied routing so requesters cannot spoof a destination.
  new.facility_id := v_facility_id;
  new.partner_id := v_partner_id;
  return new;
end;
$$;

revoke all privileges on function public.set_churchwork_pilot_request_routing() from public, anon, authenticated;

drop trigger if exists set_churchwork_pilot_request_routing on public.churchwork_pilot_requests;
create trigger set_churchwork_pilot_request_routing
before insert on public.churchwork_pilot_requests
for each row
execute function public.set_churchwork_pilot_request_routing();

update public.churchwork_pilot_requests r
set facility_id = f.id,
    partner_id = po.id
from public.facilities f
join public.organizations fo on fo.id = f.organization_id
cross join public.partner_organizations po
join public.organizations p_org on p_org.id = po.organization_id
where fo.slug = 'grandview-post-acute'
  and f.status = 'pilot'
  and p_org.slug = 'hope-church'
  and po.status = 'pilot'
  and (r.facility_id is null or r.partner_id is null);

alter table public.churchwork_pilot_requests
  alter column facility_id set not null,
  alter column partner_id set not null;

create index if not exists churchwork_pilot_requests_facility_queue_idx
on public.churchwork_pilot_requests (facility_id, status, created_at desc);

create index if not exists churchwork_pilot_requests_partner_queue_idx
on public.churchwork_pilot_requests (partner_id, status, created_at desc);

alter table public.churchwork_pilot_requests
  drop constraint if exists churchwork_pilot_requests_partner_outcome_check;

alter table public.churchwork_pilot_requests
  add constraint churchwork_pilot_requests_partner_outcome_check
  check (
    partner_outcome is null
    or partner_outcome in ('prayer_logged', 'visit_planned', 'visit_completed', 'follow_up_requested')
  );

drop policy if exists "Facility can read pilot review queue" on public.churchwork_pilot_requests;
create policy "Facility can read pilot review queue"
on public.churchwork_pilot_requests
for select
to authenticated
using (
  public.user_can_access_facility(
    facility_id,
    array['facility_admin', 'facility_staff']::text[]
  )
);

drop policy if exists "Partner can read approved pilot requests" on public.churchwork_pilot_requests;
create policy "Partner can read approved pilot requests"
on public.churchwork_pilot_requests
for select
to authenticated
using (
  status in ('approved_for_partner', 'partner_outcome_logged', 'requester_updated', 'closed')
  and public.user_can_access_partner(
    partner_id,
    array['partner_admin', 'partner_user']::text[]
  )
);

create or replace function public.facility_advance_churchwork_pilot_request(
  p_request_id uuid,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_id uuid;
  v_status text;
  v_partner_outcome text;
  v_now timestamptz := now();
  v_update text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select r.facility_id, r.status, r.partner_outcome
    into v_facility_id, v_status, v_partner_outcome
  from public.churchwork_pilot_requests r
  where r.id = p_request_id
  for update;

  if not found then
    raise exception 'Pilot request not found';
  end if;

  if not public.user_can_access_facility(
    v_facility_id,
    array['facility_admin', 'facility_staff']::text[]
  ) then
    raise exception 'Facility access denied';
  end if;

  if p_action = 'approve' then
    if v_status <> 'facility_review' then
      raise exception 'Request is not awaiting facility review';
    end if;

    update public.churchwork_pilot_requests
    set status = 'approved_for_partner',
        facility_approved_at = v_now,
        partner_assigned_at = v_now,
        activity_log = activity_log || jsonb_build_array(
          jsonb_build_object(
            'event', 'facility_approved',
            'actor', 'facility',
            'actor_user_id', auth.uid(),
            'at', v_now
          )
        )
    where id = p_request_id;

    return jsonb_build_object('ok', true, 'id', p_request_id, 'status', 'approved_for_partner');
  end if;

  if p_action = 'release_update' then
    if v_status <> 'partner_outcome_logged' or v_partner_outcome is null then
      raise exception 'Partner outcome is not ready for requester release';
    end if;

    v_update := case v_partner_outcome
      when 'prayer_logged' then 'A care partner has logged prayer for this request.'
      when 'visit_planned' then 'A care partner has planned a spiritual-care visit.'
      when 'visit_completed' then 'A care partner has completed a spiritual-care visit.'
      when 'follow_up_requested' then 'A care partner has requested spiritual-care follow-up.'
      else 'A care partner has provided a spiritual-care update.'
    end;

    update public.churchwork_pilot_requests
    set status = 'requester_updated',
        requester_update = v_update,
        requester_update_released_at = v_now,
        activity_log = activity_log || jsonb_build_array(
          jsonb_build_object(
            'event', 'requester_update_released',
            'actor', 'facility',
            'actor_user_id', auth.uid(),
            'at', v_now
          )
        )
    where id = p_request_id;

    return jsonb_build_object('ok', true, 'id', p_request_id, 'status', 'requester_updated');
  end if;

  raise exception 'Unsupported facility action';
end;
$$;

revoke all privileges on function public.facility_advance_churchwork_pilot_request(uuid, text) from public, anon;
grant execute on function public.facility_advance_churchwork_pilot_request(uuid, text) to authenticated;

create or replace function public.partner_log_churchwork_pilot_outcome(
  p_request_id uuid,
  p_outcome text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_partner_id uuid;
  v_status text;
  v_now timestamptz := now();
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_outcome not in ('prayer_logged', 'visit_planned', 'visit_completed', 'follow_up_requested') then
    raise exception 'Unsupported partner outcome';
  end if;

  select r.partner_id, r.status
    into v_partner_id, v_status
  from public.churchwork_pilot_requests r
  where r.id = p_request_id
  for update;

  if not found then
    raise exception 'Pilot request not found';
  end if;

  if not public.user_can_access_partner(
    v_partner_id,
    array['partner_admin', 'partner_user']::text[]
  ) then
    raise exception 'Partner access denied';
  end if;

  if v_status <> 'approved_for_partner' then
    raise exception 'Request is not ready for a partner outcome';
  end if;

  update public.churchwork_pilot_requests
  set status = 'partner_outcome_logged',
      partner_outcome = p_outcome,
      activity_log = activity_log || jsonb_build_array(
        jsonb_build_object(
          'event', 'partner_outcome_logged',
          'actor', 'partner',
          'actor_user_id', auth.uid(),
          'outcome', p_outcome,
          'at', v_now
        )
      )
  where id = p_request_id;

  return jsonb_build_object('ok', true, 'id', p_request_id, 'status', 'partner_outcome_logged');
end;
$$;

revoke all privileges on function public.partner_log_churchwork_pilot_outcome(uuid, text) from public, anon;
grant execute on function public.partner_log_churchwork_pilot_outcome(uuid, text) to authenticated;
