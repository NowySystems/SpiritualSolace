-- ChurchWork Grandview Facility Review Queue
-- Date: 2026-07-09
-- Purpose: let facility users review structured spiritual-care requests with safe button-only actions.

create or replace function public.get_grandview_facility_review_queue()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_facility_id uuid;
  v_can_access boolean := false;
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
      and cr.status in ('new', 'facility_review', 'partner_ready', 'paused')
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
    'facility_id', v_facility_id,
    'facility_name', 'Grandview Post Acute',
    'requests', v_requests
  );
end;
$$;

revoke all on function public.get_grandview_facility_review_queue() from public;
grant execute on function public.get_grandview_facility_review_queue() to authenticated;

comment on function public.get_grandview_facility_review_queue()
is 'Grandview pilot facility queue. Structured request data only; no medical fields and no requester notes.';

create or replace function public.update_grandview_facility_review_status(
  p_care_request_id uuid,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_facility_id uuid;
  v_request_facility_id uuid;
  v_next_status text;
  v_event_type text;
  v_priority text;
  v_can_access boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_action not in ('start_facility_review', 'mark_partner_ready', 'pause_request', 'close_request') then
    raise exception 'Invalid facility review action';
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

  select cr.facility_id, cr.priority
    into v_request_facility_id, v_priority
  from public.care_requests cr
  where cr.id = p_care_request_id
  limit 1;

  if v_request_facility_id is null then
    raise exception 'Care request not found';
  end if;

  if v_request_facility_id <> v_facility_id then
    raise exception 'This request is not in the Grandview queue';
  end if;

  select (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_can_access_facility(v_facility_id, array['facility_admin', 'facility_staff'])
  ) into v_can_access;

  if not v_can_access then
    raise exception 'Grandview facility access required';
  end if;

  v_next_status := case p_action
    when 'start_facility_review' then 'facility_review'
    when 'mark_partner_ready' then 'partner_ready'
    when 'pause_request' then 'paused'
    when 'close_request' then 'closed'
  end;

  v_event_type := case p_action
    when 'close_request' then 'request_closed'
    else 'facility_reviewed'
  end;

  update public.care_requests
  set status = v_next_status,
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
    v_event_type,
    'facility',
    'facility_internal',
    coalesce(v_priority, 'none'),
    null
  );

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'grandview_facility_review_status_updated',
    'care_requests',
    p_care_request_id,
    jsonb_build_object('action', p_action, 'next_status', v_next_status)
  );

  return jsonb_build_object(
    'care_request_id', p_care_request_id,
    'status', v_next_status,
    'action', p_action
  );
end;
$$;

revoke all on function public.update_grandview_facility_review_status(uuid, text) from public;
grant execute on function public.update_grandview_facility_review_status(uuid, text) to authenticated;

comment on function public.update_grandview_facility_review_status(uuid, text)
is 'Grandview pilot facility review actions. Button-only status updates; no free-text notes and no partner assignment.';
