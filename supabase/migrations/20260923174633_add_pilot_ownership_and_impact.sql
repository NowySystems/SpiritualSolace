create schema if not exists private;

create table if not exists private.churchwork_pilot_request_ownership (
  request_id uuid primary key references public.churchwork_pilot_requests(id) on delete cascade,
  facility_owner_user_id uuid references public.profiles(id) on delete set null,
  facility_claimed_at timestamptz,
  partner_owner_user_id uuid references public.profiles(id) on delete set null,
  partner_claimed_at timestamptz,
  updated_at timestamptz not null default now()
);

revoke all on table private.churchwork_pilot_request_ownership from public, anon, authenticated;

create index if not exists churchwork_pilot_ownership_facility_owner_idx
  on private.churchwork_pilot_request_ownership (facility_owner_user_id)
  where facility_owner_user_id is not null;

create index if not exists churchwork_pilot_ownership_partner_owner_idx
  on private.churchwork_pilot_request_ownership (partner_owner_user_id)
  where partner_owner_user_id is not null;

create or replace function public.set_churchwork_pilot_request_owner(
  p_request_id uuid,
  p_scope text,
  p_claim boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_facility_id uuid;
  v_partner_id uuid;
  v_status text;
  v_current_owner uuid;
  v_now timestamptz := now();
  v_owner_name text;
  v_owner_email text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_scope not in ('facility', 'partner') then
    raise exception 'Unsupported ownership scope';
  end if;

  select r.facility_id, r.partner_id, r.status
    into v_facility_id, v_partner_id, v_status
  from public.churchwork_pilot_requests r
  where r.id = p_request_id
  for update;

  if not found then
    raise exception 'Pilot request not found';
  end if;

  if p_scope = 'facility' then
    if not public.user_can_access_facility(
      v_facility_id,
      array['facility_admin', 'facility_staff']::text[]
    ) then
      raise exception 'Facility access denied';
    end if;

    if v_status not in ('facility_review', 'partner_outcome_logged') then
      raise exception 'Request does not need a facility owner in its current state';
    end if;
  else
    if not public.user_can_access_partner(
      v_partner_id,
      array['partner_admin', 'partner_user']::text[]
    ) then
      raise exception 'Partner access denied';
    end if;

    if v_status <> 'approved_for_partner' then
      raise exception 'Request does not need a partner owner in its current state';
    end if;
  end if;

  insert into private.churchwork_pilot_request_ownership (request_id)
  values (p_request_id)
  on conflict (request_id) do nothing;

  if p_scope = 'facility' then
    select o.facility_owner_user_id
      into v_current_owner
    from private.churchwork_pilot_request_ownership o
    where o.request_id = p_request_id
    for update;

    if p_claim then
      if v_current_owner is not null and v_current_owner <> v_user_id then
        raise exception 'Request is already claimed';
      end if;

      update private.churchwork_pilot_request_ownership
      set facility_owner_user_id = v_user_id,
          facility_claimed_at = case
            when facility_owner_user_id = v_user_id and facility_claimed_at is not null then facility_claimed_at
            else v_now
          end,
          updated_at = v_now
      where request_id = p_request_id;
    else
      if v_current_owner is not null
         and v_current_owner <> v_user_id
         and not public.user_has_role(array['owner', 'platform_admin']::text[]) then
        raise exception 'Only the current owner or platform admin can release this claim';
      end if;

      update private.churchwork_pilot_request_ownership
      set facility_owner_user_id = null,
          facility_claimed_at = null,
          updated_at = v_now
      where request_id = p_request_id;
    end if;
  else
    select o.partner_owner_user_id
      into v_current_owner
    from private.churchwork_pilot_request_ownership o
    where o.request_id = p_request_id
    for update;

    if p_claim then
      if v_current_owner is not null and v_current_owner <> v_user_id then
        raise exception 'Request is already claimed';
      end if;

      update private.churchwork_pilot_request_ownership
      set partner_owner_user_id = v_user_id,
          partner_claimed_at = case
            when partner_owner_user_id = v_user_id and partner_claimed_at is not null then partner_claimed_at
            else v_now
          end,
          updated_at = v_now
      where request_id = p_request_id;
    else
      if v_current_owner is not null
         and v_current_owner <> v_user_id
         and not public.user_has_role(array['owner', 'platform_admin']::text[]) then
        raise exception 'Only the current owner or platform admin can release this claim';
      end if;

      update private.churchwork_pilot_request_ownership
      set partner_owner_user_id = null,
          partner_claimed_at = null,
          updated_at = v_now
      where request_id = p_request_id;
    end if;
  end if;

  insert into public.audit_logs (
    actor_user_id,
    action,
    target_table,
    target_id,
    metadata
  )
  values (
    v_user_id,
    case
      when p_scope = 'facility' and p_claim then 'facility_request_claimed'
      when p_scope = 'facility' and not p_claim then 'facility_request_released'
      when p_scope = 'partner' and p_claim then 'partner_assignment_claimed'
      else 'partner_assignment_released'
    end,
    'churchwork_pilot_requests',
    p_request_id,
    jsonb_build_object('scope', p_scope, 'claimed', p_claim)
  );

  select p.full_name, p.email
    into v_owner_name, v_owner_email
  from public.profiles p
  where p.id = case
    when p_scope = 'facility' and p_claim then v_user_id
    when p_scope = 'partner' and p_claim then v_user_id
    else null
  end;

  return jsonb_build_object(
    'ok', true,
    'request_id', p_request_id,
    'scope', p_scope,
    'claimed', p_claim,
    'owner_user_id', case when p_claim then v_user_id else null end,
    'owner_name', case when p_claim then v_owner_name else null end,
    'owner_email', case when p_claim then v_owner_email else null end,
    'claimed_at', case when p_claim then v_now else null end
  );
end;
$function$;

revoke all on function public.set_churchwork_pilot_request_owner(uuid, text, boolean) from public, anon;
grant execute on function public.set_churchwork_pilot_request_owner(uuid, text, boolean) to authenticated;

create or replace function public.get_churchwork_pilot_request_ownership(
  p_request_ids uuid[]
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'request_id', r.id,
        'facility_owner_user_id', o.facility_owner_user_id,
        'facility_owner_name', fp.full_name,
        'facility_owner_email', fp.email,
        'facility_claimed_at', o.facility_claimed_at,
        'partner_owner_user_id', o.partner_owner_user_id,
        'partner_owner_name', pp.full_name,
        'partner_owner_email', pp.email,
        'partner_claimed_at', o.partner_claimed_at
      )
      order by r.created_at desc
    ),
    '[]'::jsonb
  )
  from public.churchwork_pilot_requests r
  left join private.churchwork_pilot_request_ownership o on o.request_id = r.id
  left join public.profiles fp on fp.id = o.facility_owner_user_id
  left join public.profiles pp on pp.id = o.partner_owner_user_id
  where r.id = any(coalesce(p_request_ids, '{}'::uuid[]))
    and (
      public.user_has_role(array['owner', 'platform_admin']::text[])
      or public.user_can_access_facility(
        r.facility_id,
        array['facility_admin', 'facility_staff']::text[]
      )
      or public.user_can_access_partner(
        r.partner_id,
        array['partner_admin', 'partner_user']::text[]
      )
    );
$function$;

revoke all on function public.get_churchwork_pilot_request_ownership(uuid[]) from public, anon;
grant execute on function public.get_churchwork_pilot_request_ownership(uuid[]) to authenticated;

create or replace function public.get_churchwork_pilot_operator_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_is_admin boolean;
  v_summary jsonb;
  v_staffing jsonb;
  v_users jsonb;
  v_recent_requests jsonb;
  v_audit_events jsonb;
  v_impact jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select exists (
    select 1
    from public.role_memberships rm
    where rm.user_id = v_user_id
      and rm.status = 'active'
      and rm.role in ('owner', 'platform_admin')
  ) into v_is_admin;

  if not v_is_admin then
    raise exception 'Owner/admin access required';
  end if;

  select jsonb_build_object(
    'requests_total', count(*),
    'facility_review', count(*) filter (where status = 'facility_review'),
    'approved_for_partner', count(*) filter (where status = 'approved_for_partner'),
    'partner_outcome_logged', count(*) filter (where status = 'partner_outcome_logged'),
    'requester_updated', count(*) filter (where status = 'requester_updated'),
    'closed', count(*) filter (where status = 'closed')
  )
  into v_summary
  from public.churchwork_pilot_requests;

  select jsonb_build_object(
    'grandview_reviewers', (
      select count(distinct rm.user_id)
      from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'grandview-post-acute'
        and rm.status = 'active'
        and rm.role in ('facility_admin', 'facility_staff')
    ),
    'hope_partner_users', (
      select count(distinct rm.user_id)
      from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'hope-church'
        and rm.status = 'active'
        and rm.role in ('partner_admin', 'partner_user')
    ),
    'pending_facility_invites', (
      select count(*)
      from public.facility_user_invites fui
      join public.facilities f on f.id = fui.facility_id
      join public.organizations o on o.id = f.organization_id
      where o.slug = 'grandview-post-acute'
        and fui.status = 'pending'
    )
  ) into v_staffing;

  select jsonb_build_object(
    'requests_total', count(*),
    'requests_last_30_days', count(*) filter (where r.created_at >= now() - interval '30 days'),
    'completed_requests', count(*) filter (where r.requester_update_released_at is not null or r.status = 'closed'),
    'care_outcomes_logged', count(*) filter (where r.partner_outcome is not null),
    'prayers_logged', count(*) filter (where r.partner_outcome = 'prayer_logged'),
    'visits_planned', count(*) filter (where r.partner_outcome = 'visit_planned'),
    'visits_completed', count(*) filter (where r.partner_outcome = 'visit_completed'),
    'follow_up_requested', count(*) filter (where r.partner_outcome = 'follow_up_requested'),
    'avg_review_minutes', round(avg(extract(epoch from (r.facility_approved_at - r.created_at)) / 60.0) filter (where r.facility_approved_at is not null), 1),
    'avg_partner_response_minutes', round(avg(extract(epoch from (pe.outcome_at - r.partner_assigned_at)) / 60.0) filter (where pe.outcome_at is not null and r.partner_assigned_at is not null), 1),
    'avg_release_minutes', round(avg(extract(epoch from (r.requester_update_released_at - pe.outcome_at)) / 60.0) filter (where r.requester_update_released_at is not null and pe.outcome_at is not null), 1),
    'avg_end_to_end_minutes', round(avg(extract(epoch from (r.requester_update_released_at - r.created_at)) / 60.0) filter (where r.requester_update_released_at is not null), 1)
  )
  into v_impact
  from public.churchwork_pilot_requests r
  left join lateral (
    select min((event_item->>'at')::timestamptz) as outcome_at
    from jsonb_array_elements(r.activity_log) event_item
    where event_item->>'event' = 'partner_outcome_logged'
      and event_item ? 'at'
  ) pe on true;

  select coalesce(jsonb_agg(to_jsonb(user_row)), '[]'::jsonb)
  into v_users
  from (
    select
      p.id,
      p.email,
      p.full_name,
      p.status,
      p.created_at,
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'role', rm.role,
            'status', rm.status,
            'organization_name', o.name,
            'organization_slug', o.slug
          )
          order by o.name, rm.role
        )
        from public.role_memberships rm
        join public.organizations o on o.id = rm.organization_id
        where rm.user_id = p.id
      ), '[]'::jsonb) as roles
    from public.profiles p
    order by p.created_at desc
    limit 100
  ) user_row;

  select coalesce(jsonb_agg(to_jsonb(request_row)), '[]'::jsonb)
  into v_recent_requests
  from (
    select
      r.id,
      r.requester_email,
      r.support_options,
      r.status,
      r.partner_outcome,
      r.requester_update,
      r.created_at,
      r.updated_at,
      r.facility_approved_at,
      r.partner_assigned_at,
      r.requester_update_released_at,
      own.facility_owner_user_id,
      fp.full_name as facility_owner_name,
      fp.email as facility_owner_email,
      own.facility_claimed_at,
      own.partner_owner_user_id,
      pp.full_name as partner_owner_name,
      pp.email as partner_owner_email,
      own.partner_claimed_at
    from public.churchwork_pilot_requests r
    left join private.churchwork_pilot_request_ownership own on own.request_id = r.id
    left join public.profiles fp on fp.id = own.facility_owner_user_id
    left join public.profiles pp on pp.id = own.partner_owner_user_id
    order by r.created_at desc
    limit 25
  ) request_row;

  select coalesce(jsonb_agg(to_jsonb(audit_row)), '[]'::jsonb)
  into v_audit_events
  from (
    select
      al.id,
      al.action,
      al.target_table,
      al.target_id,
      al.metadata,
      al.created_at,
      p.email as actor_email
    from public.audit_logs al
    left join public.profiles p on p.id = al.actor_user_id
    order by al.created_at desc
    limit 50
  ) audit_row;

  return jsonb_build_object(
    'is_admin', true,
    'current_user_id', v_user_id,
    'summary', coalesce(v_summary, '{}'::jsonb),
    'staffing', coalesce(v_staffing, '{}'::jsonb),
    'impact', coalesce(v_impact, '{}'::jsonb),
    'users', coalesce(v_users, '[]'::jsonb),
    'recent_requests', coalesce(v_recent_requests, '[]'::jsonb),
    'audit_events', coalesce(v_audit_events, '[]'::jsonb)
  );
end;
$function$;
