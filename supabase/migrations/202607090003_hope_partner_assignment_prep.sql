-- ChurchWork Hope Church Partner Assignment Prep
-- Date: 2026-07-09
-- Purpose: create the controlled bridge from Grandview partner-ready requests to Hope Church assignments.

create or replace function public.assign_grandview_request_to_hope(
  p_care_request_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grandview_facility_id uuid;
  v_hope_partner_id uuid;
  v_request_facility_id uuid;
  v_request_status text;
  v_priority text;
  v_assignment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.user_has_role(array['owner', 'platform_admin']) then
    raise exception 'Owner/admin access required for partner assignment';
  end if;

  select f.id
    into v_grandview_facility_id
  from public.facilities f
  join public.organizations o on o.id = f.organization_id
  where o.slug = 'grandview-post-acute'
    and f.status in ('pilot', 'active')
  limit 1;

  if v_grandview_facility_id is null then
    raise exception 'Grandview facility is not configured';
  end if;

  select po.id
    into v_hope_partner_id
  from public.partner_organizations po
  join public.organizations o on o.id = po.organization_id
  where o.slug = 'hope-church'
    and po.status in ('pilot', 'active')
  limit 1;

  if v_hope_partner_id is null then
    raise exception 'Hope Church partner organization is not configured';
  end if;

  select cr.facility_id, cr.status, cr.priority
    into v_request_facility_id, v_request_status, v_priority
  from public.care_requests cr
  where cr.id = p_care_request_id
  limit 1;

  if v_request_facility_id is null then
    raise exception 'Care request not found';
  end if;

  if v_request_facility_id <> v_grandview_facility_id then
    raise exception 'This request is not in the Grandview queue';
  end if;

  if v_request_status <> 'partner_ready' then
    raise exception 'Request must be marked partner_ready before assignment';
  end if;

  insert into public.request_partner_assignments (
    care_request_id,
    partner_organization_id,
    status,
    assigned_by_user_id
  )
  values (
    p_care_request_id,
    v_hope_partner_id,
    'assigned',
    auth.uid()
  )
  on conflict (care_request_id, partner_organization_id) do update set
    status = 'assigned',
    assigned_by_user_id = excluded.assigned_by_user_id,
    assigned_at = now()
  returning id into v_assignment_id;

  update public.care_requests
  set status = 'partner_assigned',
      updated_at = now()
  where id = p_care_request_id;

  insert into public.timeline_events (
    care_request_id,
    actor_user_id,
    event_type,
    visibility,
    sharing_level,
    priority_label,
    non_medical_note
  )
  values (
    p_care_request_id,
    auth.uid(),
    'partner_assigned',
    'shared',
    'partner_safe',
    coalesce(v_priority, 'none'),
    null
  );

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'grandview_request_assigned_to_hope',
    'request_partner_assignments',
    v_assignment_id,
    jsonb_build_object('care_request_id', p_care_request_id, 'partner', 'hope-church')
  );

  return jsonb_build_object(
    'care_request_id', p_care_request_id,
    'assignment_id', v_assignment_id,
    'partner_slug', 'hope-church',
    'status', 'partner_assigned'
  );
end;
$$;

revoke all on function public.assign_grandview_request_to_hope(uuid) from public;
grant execute on function public.assign_grandview_request_to_hope(uuid) to authenticated;

comment on function public.assign_grandview_request_to_hope(uuid)
is 'Owner/admin-only pilot assignment from Grandview partner_ready request to Hope Church. No auto-routing and no free-text notes.';

create or replace function public.get_hope_partner_assignment_queue()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hope_partner_id uuid;
  v_can_access boolean := false;
  v_requests jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select po.id
    into v_hope_partner_id
  from public.partner_organizations po
  join public.organizations o on o.id = po.organization_id
  where o.slug = 'hope-church'
    and po.status in ('pilot', 'active')
  limit 1;

  if v_hope_partner_id is null then
    raise exception 'Hope Church partner organization is not configured';
  end if;

  select (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_can_access_partner(v_hope_partner_id, array['partner_admin', 'partner_user'])
  ) into v_can_access;

  if not v_can_access then
    raise exception 'Hope Church partner access required';
  end if;

  with assignment_rows as (
    select
      rpa.id as assignment_id,
      rpa.status as assignment_status,
      rpa.assigned_at,
      cr.id as care_request_id,
      cr.resident_display_name,
      cr.room_or_unit,
      cr.request_type,
      cr.priority,
      cr.status as request_status,
      cr.created_at as request_created_at,
      f.name as facility_name,
      coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', te.id,
          'event_type', te.event_type,
          'visibility', te.visibility,
          'sharing_level', te.sharing_level,
          'priority_label', te.priority_label,
          'created_at', te.created_at
        ) order by te.created_at desc)
        from public.timeline_events te
        where te.care_request_id = cr.id
          and te.visibility in ('partner', 'shared')
          and te.sharing_level in ('partner_safe', 'shared_timeline')
      ), '[]'::jsonb) as timeline_events
    from public.request_partner_assignments rpa
    join public.care_requests cr on cr.id = rpa.care_request_id
    join public.facilities f on f.id = cr.facility_id
    where rpa.partner_organization_id = v_hope_partner_id
      and rpa.status in ('assigned', 'accepted', 'completed')
    order by rpa.assigned_at desc
    limit 50
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'assignment_id', ar.assignment_id,
    'assignment_status', ar.assignment_status,
    'assigned_at', ar.assigned_at,
    'care_request_id', ar.care_request_id,
    'resident_display_name', ar.resident_display_name,
    'room_or_unit', ar.room_or_unit,
    'request_type', ar.request_type,
    'priority', ar.priority,
    'request_status', ar.request_status,
    'request_created_at', ar.request_created_at,
    'facility_name', ar.facility_name,
    'timeline_events', ar.timeline_events
  )), '[]'::jsonb)
  into v_requests
  from assignment_rows ar;

  return jsonb_build_object(
    'can_view', true,
    'partner_id', v_hope_partner_id,
    'partner_name', 'Hope Church',
    'requests', v_requests
  );
end;
$$;

revoke all on function public.get_hope_partner_assignment_queue() from public;
grant execute on function public.get_hope_partner_assignment_queue() to authenticated;

comment on function public.get_hope_partner_assignment_queue()
is 'Hope Church pilot partner queue. Partner-safe fields only; no requester notes, no medical fields, and no open chat.';

create or replace function public.get_grandview_facility_review_queue()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_facility_id uuid;
  v_can_access boolean := false;
  v_can_assign_to_hope boolean := false;
  v_requests jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select f.id
    into v_facility_id
  from public.facilities f
  join public.organizations o on o.id = f.organization_id
  where o.slug = 'grandview-post-acute'
    and f.status in ('pilot', 'active')
  limit 1;

  if v_facility_id is null then
    raise exception 'Grandview facility is not configured';
  end if;

  select (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_can_access_facility(v_facility_id, array['facility_admin', 'facility_staff'])
  ) into v_can_access;

  if not v_can_access then
    raise exception 'Grandview facility access required';
  end if;

  select public.user_has_role(array['owner', 'platform_admin']) into v_can_assign_to_hope;

  with request_rows as (
    select
      cr.id,
      cr.requester_display_name,
      cr.requester_role,
      cr.relationship_to_resident,
      cr.resident_display_name,
      cr.room_or_unit,
      cr.request_type,
      cr.priority,
      cr.status,
      cr.source,
      cr.created_at,
      cr.updated_at,
      coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', te.id,
          'event_type', te.event_type,
          'visibility', te.visibility,
          'sharing_level', te.sharing_level,
          'priority_label', te.priority_label,
          'created_at', te.created_at
        ) order by te.created_at desc)
        from public.timeline_events te
        where te.care_request_id = cr.id
          and te.visibility in ('facility', 'shared')
      ), '[]'::jsonb) as timeline_events
    from public.care_requests cr
    where cr.facility_id = v_facility_id
      and cr.status in ('new', 'facility_review', 'partner_ready', 'partner_assigned', 'paused')
    order by
      case cr.priority
        when 'today' then 1
        when 'this_week' then 2
        else 3
      end,
      cr.created_at asc
    limit 50
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rr.id,
    'requester_display_name', rr.requester_display_name,
    'requester_role', rr.requester_role,
    'relationship_to_resident', rr.relationship_to_resident,
    'resident_display_name', rr.resident_display_name,
    'room_or_unit', rr.room_or_unit,
    'request_type', rr.request_type,
    'priority', rr.priority,
    'status', rr.status,
    'source', rr.source,
    'created_at', rr.created_at,
    'updated_at', rr.updated_at,
    'timeline_events', rr.timeline_events
  )), '[]'::jsonb)
  into v_requests
  from request_rows rr;

  return jsonb_build_object(
    'can_review', true,
    'can_assign_to_hope', v_can_assign_to_hope,
    'facility_id', v_facility_id,
    'facility_name', 'Grandview Post Acute',
    'requests', v_requests
  );
end;
$$;

revoke all on function public.get_grandview_facility_review_queue() from public;
grant execute on function public.get_grandview_facility_review_queue() to authenticated;

comment on function public.get_grandview_facility_review_queue()
is 'Grandview pilot facility queue with owner/admin-only Hope assignment affordance. Structured request data only; no medical fields and no requester notes.';
