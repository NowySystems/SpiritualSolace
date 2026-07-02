-- ChurchWork Pilot Safe v1 requester intake RPC
-- Purpose: allow authenticated requesters to submit structured spiritual-care requests to Grandview
-- without exposing facility lookup or allowing requester notes.

create or replace function public.submit_grandview_spiritual_request(
  p_requester_display_name text,
  p_requester_role text,
  p_relationship_to_resident text,
  p_resident_display_name text,
  p_room_or_unit text,
  p_request_type text,
  p_priority text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_facility_id uuid;
  v_request_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if nullif(trim(p_requester_display_name), '') is null then
    raise exception 'Requester name is required';
  end if;

  if nullif(trim(p_resident_display_name), '') is null then
    raise exception 'Resident/person name is required';
  end if;

  if p_requester_role not in ('resident', 'family', 'facility_staff', 'church_member', 'community_member', 'other') then
    raise exception 'Invalid requester role';
  end if;

  if p_request_type not in ('prayer', 'pastoral_visit', 'family_support', 'church_connection', 'facility_follow_up') then
    raise exception 'Invalid request type';
  end if;

  if p_priority not in ('today', 'this_week', 'routine') then
    raise exception 'Invalid priority';
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

  insert into public.care_requests (
    facility_id,
    requester_user_id,
    requester_display_name,
    requester_role,
    relationship_to_resident,
    resident_display_name,
    room_or_unit,
    request_type,
    priority,
    status,
    no_medical_information_acknowledged,
    source
  )
  values (
    v_facility_id,
    auth.uid(),
    trim(p_requester_display_name),
    p_requester_role,
    nullif(trim(coalesce(p_relationship_to_resident, '')), ''),
    trim(p_resident_display_name),
    nullif(trim(coalesce(p_room_or_unit, '')), ''),
    p_request_type,
    p_priority,
    'new',
    true,
    'requester_path'
  )
  returning id into v_request_id;

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
    v_request_id,
    auth.uid(),
    'request_submitted',
    'facility',
    'facility_internal',
    p_priority,
    null
  );

  return v_request_id;
end;
$$;

revoke all on function public.submit_grandview_spiritual_request(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_grandview_spiritual_request(text, text, text, text, text, text, text) to authenticated;

comment on function public.submit_grandview_spiritual_request(text, text, text, text, text, text, text)
is 'Pilot-safe Grandview requester intake. Structured spiritual-care request only. No requester note parameter.';
