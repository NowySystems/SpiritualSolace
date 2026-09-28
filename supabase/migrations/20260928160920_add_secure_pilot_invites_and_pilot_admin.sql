alter table public.role_memberships
  drop constraint if exists role_memberships_role_check;

alter table public.role_memberships
  add constraint role_memberships_role_check
  check (role = any (array[
    'owner'::text,
    'platform_admin'::text,
    'pilot_admin'::text,
    'facility_admin'::text,
    'facility_staff'::text,
    'partner_admin'::text,
    'partner_user'::text,
    'requester'::text
  ]));

create table if not exists private.churchwork_portal_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  org_slug text not null,
  portal text not null check (portal in ('facility','partner')),
  role text not null check (role in ('facility_admin','facility_staff','partner_admin','partner_user')),
  pilot_admin boolean not null default false,
  token_hash text not null unique,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  accepted_user_id uuid references auth.users(id) on delete set null,
  revoked_at timestamptz
);

create index if not exists churchwork_portal_invites_email_idx
  on private.churchwork_portal_invites (lower(email));

create index if not exists churchwork_portal_invites_pending_idx
  on private.churchwork_portal_invites (expires_at)
  where accepted_at is null and revoked_at is null;

revoke all on table private.churchwork_portal_invites from public, anon, authenticated;

create or replace function public.create_churchwork_portal_invite(
  p_email text,
  p_org_slug text,
  p_role text,
  p_pilot_admin boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_email text := lower(trim(p_email));
  v_org_slug text := lower(trim(p_org_slug));
  v_org_id uuid;
  v_org_name text;
  v_org_type text;
  v_portal text;
  v_token text;
  v_hash text;
  v_invite_id uuid;
  v_expires timestamptz := now() + interval '14 days';
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.user_has_role(array['owner','platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
  if v_email = '' or position('@' in v_email) < 2 then raise exception 'Valid email required'; end if;

  select o.id, o.name, o.organization_type into v_org_id, v_org_name, v_org_type
  from public.organizations o where o.slug = v_org_slug limit 1;
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if v_org_type = 'facility' and p_role in ('facility_admin','facility_staff') then
    v_portal := 'facility';
  elsif v_org_type = 'partner' and p_role in ('partner_admin','partner_user') then
    v_portal := 'partner';
  else
    raise exception 'Role does not match organization';
  end if;

  update private.churchwork_portal_invites
  set revoked_at = now()
  where lower(email) = v_email and organization_id = v_org_id
    and accepted_at is null and revoked_at is null;

  v_token := pg_catalog.encode(extensions.gen_random_bytes(32), 'hex');
  v_hash := pg_catalog.encode(extensions.digest(v_token, 'sha256'), 'hex');

  insert into private.churchwork_portal_invites (
    email, organization_id, org_slug, portal, role, pilot_admin,
    token_hash, created_by, expires_at
  ) values (
    v_email, v_org_id, v_org_slug, v_portal, p_role, coalesce(p_pilot_admin,false),
    v_hash, auth.uid(), v_expires
  ) returning id into v_invite_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(), 'pilot_portal_invite_created', 'churchwork_portal_invites', v_invite_id,
    jsonb_build_object('email', v_email, 'org_slug', v_org_slug, 'role', p_role, 'pilot_admin', coalesce(p_pilot_admin,false))
  );

  return jsonb_build_object(
    'ok', true, 'invite_id', v_invite_id, 'token', v_token, 'email', v_email,
    'organization_name', v_org_name, 'org_slug', v_org_slug, 'portal', v_portal,
    'role', p_role, 'pilot_admin', coalesce(p_pilot_admin,false), 'expires_at', v_expires
  );
end;
$function$;

revoke all on function public.create_churchwork_portal_invite(text,text,text,boolean) from public, anon;
grant execute on function public.create_churchwork_portal_invite(text,text,text,boolean) to authenticated;

create or replace function public.validate_churchwork_portal_invite(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_hash text;
  v_row record;
begin
  if p_token is null or length(trim(p_token)) < 32 then return jsonb_build_object('valid', false); end if;
  v_hash := pg_catalog.encode(extensions.digest(trim(p_token), 'sha256'), 'hex');

  select i.id, i.email, i.org_slug, i.portal, i.role, i.pilot_admin,
         i.expires_at, o.name as organization_name
    into v_row
  from private.churchwork_portal_invites i
  join public.organizations o on o.id = i.organization_id
  where i.token_hash = v_hash and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
  limit 1;

  if not found then return jsonb_build_object('valid', false); end if;

  return jsonb_build_object(
    'valid', true, 'email', v_row.email, 'organization_name', v_row.organization_name,
    'org_slug', v_row.org_slug, 'portal', v_row.portal, 'role', v_row.role,
    'pilot_admin', v_row.pilot_admin, 'expires_at', v_row.expires_at
  );
end;
$function$;

revoke all on function public.validate_churchwork_portal_invite(text) from public;
grant execute on function public.validate_churchwork_portal_invite(text) to anon, authenticated;

create or replace function public.accept_churchwork_portal_invite(p_token text, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_hash text;
  v_invite private.churchwork_portal_invites%rowtype;
  v_user_email text;
  v_platform_org uuid;
  v_membership_id uuid;
begin
  if p_token is null or p_user_id is null then raise exception 'Invite token and user are required'; end if;
  v_hash := pg_catalog.encode(extensions.digest(trim(p_token), 'sha256'), 'hex');

  select * into v_invite
  from private.churchwork_portal_invites i
  where i.token_hash = v_hash
  for update;

  if not found or v_invite.accepted_at is not null or v_invite.revoked_at is not null or v_invite.expires_at <= now() then
    raise exception 'Invite is invalid or expired';
  end if;

  select lower(u.email) into v_user_email from auth.users u where u.id = p_user_id limit 1;
  if v_user_email is null or v_user_email <> lower(v_invite.email) then raise exception 'Invite email does not match account'; end if;

  insert into public.profiles (id, email, status)
  values (p_user_id, v_user_email, 'active')
  on conflict (id) do update set email = excluded.email, status = 'active', updated_at = now();

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (p_user_id, v_invite.organization_id, v_invite.role, 'active')
  on conflict (user_id, organization_id, role) do update set status = 'active', updated_at = now()
  returning id into v_membership_id;

  if v_invite.pilot_admin then
    select o.id into v_platform_org from public.organizations o
    where o.slug = 'churchwork' and o.organization_type = 'platform' limit 1;
    if v_platform_org is null then raise exception 'ChurchWork platform organization not found'; end if;

    insert into public.role_memberships (user_id, organization_id, role, status)
    values (p_user_id, v_platform_org, 'pilot_admin', 'active')
    on conflict (user_id, organization_id, role) do update set status = 'active', updated_at = now();
  end if;

  update private.churchwork_portal_invites
  set accepted_at = now(), accepted_user_id = p_user_id
  where id = v_invite.id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    p_user_id, 'pilot_portal_invite_accepted', 'role_memberships', v_membership_id,
    jsonb_build_object('invite_id', v_invite.id, 'org_slug', v_invite.org_slug, 'role', v_invite.role, 'pilot_admin', v_invite.pilot_admin)
  );

  return jsonb_build_object('ok', true, 'portal', v_invite.portal, 'org_slug', v_invite.org_slug, 'role', v_invite.role, 'pilot_admin', v_invite.pilot_admin);
end;
$function$;

revoke all on function public.accept_churchwork_portal_invite(text,uuid) from public;
grant execute on function public.accept_churchwork_portal_invite(text,uuid) to anon, authenticated;

create or replace function public.list_churchwork_portal_invites()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare v_result jsonb;
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
  into v_result
  from (
    select i.id, i.email, o.name as organization_name, i.org_slug, i.portal, i.role,
           i.pilot_admin, i.created_at, i.expires_at, i.accepted_at, i.revoked_at
    from private.churchwork_portal_invites i
    join public.organizations o on o.id = i.organization_id
    order by i.created_at desc limit 100
  ) x;
  return v_result;
end;
$function$;

revoke all on function public.list_churchwork_portal_invites() from public, anon;
grant execute on function public.list_churchwork_portal_invites() to authenticated;

create or replace function public.revoke_churchwork_portal_invite(p_invite_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
  update private.churchwork_portal_invites set revoked_at = now()
  where id = p_invite_id and accepted_at is null and revoked_at is null;
  if not found then return false; end if;
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (auth.uid(), 'pilot_portal_invite_revoked', 'churchwork_portal_invites', p_invite_id, '{}'::jsonb);
  return true;
end;
$function$;

revoke all on function public.revoke_churchwork_portal_invite(uuid) from public, anon;
grant execute on function public.revoke_churchwork_portal_invite(uuid) to authenticated;

create or replace function public.set_pilot_user_role(p_user_email text, p_org_slug text, p_role text, p_status text default 'active'::text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid;
  v_organization_id uuid;
  v_membership_id uuid;
  v_user_email text := lower(trim(p_user_email));
  v_org_slug text := lower(trim(p_org_slug));
  v_org_type text;
  v_caller_is_owner boolean := false;
  v_target_is_active_owner boolean := false;
  v_other_active_owners integer := 0;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.user_has_role(array['owner', 'platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
  select public.user_has_role(array['owner']::text[]) into v_caller_is_owner;

  if p_role not in ('owner', 'platform_admin', 'pilot_admin', 'facility_admin', 'facility_staff', 'partner_admin', 'partner_user', 'requester') then raise exception 'Invalid role'; end if;
  if p_status not in ('invited', 'active', 'disabled') then raise exception 'Invalid status'; end if;

  select id into v_user_id from auth.users where lower(email) = v_user_email limit 1;
  if v_user_id is null then raise exception 'User has not signed up yet'; end if;

  select id, organization_type into v_organization_id, v_org_type
  from public.organizations where slug = v_org_slug limit 1;
  if v_organization_id is null then raise exception 'Organization not found'; end if;

  if p_role in ('owner', 'platform_admin', 'pilot_admin', 'requester') then
    if v_org_type <> 'platform' or v_org_slug <> 'churchwork' then raise exception 'Platform/requester roles must belong to ChurchWork'; end if;
  elsif p_role in ('facility_admin', 'facility_staff') then
    if v_org_type <> 'facility' then raise exception 'Facility roles must belong to a facility organization'; end if;
  elsif p_role in ('partner_admin', 'partner_user') then
    if v_org_type <> 'partner' then raise exception 'Partner roles must belong to a partner organization'; end if;
  end if;

  if p_role = 'owner' then
    if not v_caller_is_owner then raise exception 'Owner access required to manage owner role'; end if;
    if p_status = 'disabled' then
      select exists (
        select 1 from public.role_memberships rm
        where rm.user_id = v_user_id and rm.organization_id = v_organization_id
          and rm.role = 'owner' and rm.status = 'active'
      ) into v_target_is_active_owner;

      if v_target_is_active_owner then
        select count(distinct rm.user_id)::integer into v_other_active_owners
        from public.role_memberships rm join public.organizations o on o.id = rm.organization_id
        where o.slug = 'churchwork' and rm.role = 'owner' and rm.status = 'active' and rm.user_id <> v_user_id;
        if v_other_active_owners = 0 then raise exception 'Cannot disable the last active ChurchWork owner'; end if;
      end if;
    end if;
  end if;

  insert into public.profiles (id, email, status)
  values (v_user_id, v_user_email, 'active')
  on conflict (id) do update set email = excluded.email, updated_at = now();

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (v_user_id, v_organization_id, p_role, p_status)
  on conflict (user_id, organization_id, role) do update set status = excluded.status, updated_at = now()
  returning id into v_membership_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(), 'pilot_user_role_set', 'role_memberships', v_membership_id,
    jsonb_build_object('user_email', v_user_email, 'org_slug', v_org_slug, 'role', p_role, 'status', p_status)
  );
  return v_membership_id;
end;
$function$;

revoke all on function public.set_pilot_user_role(text,text,text,text) from public, anon;
grant execute on function public.set_pilot_user_role(text,text,text,text) to authenticated;

create or replace function public.get_churchwork_pilot_operator_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_can_manage_access boolean := false;
  v_is_pilot_admin boolean := false;
  v_summary jsonb;
  v_staffing jsonb;
  v_users jsonb := '[]'::jsonb;
  v_recent_requests jsonb;
  v_audit_events jsonb := '[]'::jsonb;
  v_impact jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select public.user_has_role(array['owner','platform_admin']::text[]) into v_can_manage_access;
  select public.user_has_role(array['pilot_admin']::text[]) into v_is_pilot_admin;
  if not v_can_manage_access and not v_is_pilot_admin then raise exception 'Operator access required'; end if;

  select jsonb_build_object(
    'requests_total', count(*),
    'facility_review', count(*) filter (where status = 'facility_review'),
    'approved_for_partner', count(*) filter (where status = 'approved_for_partner'),
    'partner_outcome_logged', count(*) filter (where status = 'partner_outcome_logged'),
    'requester_updated', count(*) filter (where status = 'requester_updated'),
    'closed', count(*) filter (where status = 'closed')
  ) into v_summary from public.churchwork_pilot_requests;

  select jsonb_build_object(
    'grandview_reviewers', (
      select count(distinct rm.user_id) from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'grandview-post-acute' and rm.status = 'active' and rm.role in ('facility_admin','facility_staff')
    ),
    'hope_partner_users', (
      select count(distinct rm.user_id) from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'hope-church' and rm.status = 'active' and rm.role in ('partner_admin','partner_user')
    ),
    'pending_facility_invites', (
      select count(*) from private.churchwork_portal_invites i
      where i.org_slug = 'grandview-post-acute' and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
    ),
    'pending_partner_invites', (
      select count(*) from private.churchwork_portal_invites i
      where i.org_slug = 'hope-church' and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
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
    'avg_review_minutes', round(avg(extract(epoch from (r.facility_approved_at-r.created_at))/60.0) filter (where r.facility_approved_at is not null),1),
    'avg_partner_response_minutes', round(avg(extract(epoch from (pe.outcome_at-r.partner_assigned_at))/60.0) filter (where pe.outcome_at is not null and r.partner_assigned_at is not null),1),
    'avg_release_minutes', round(avg(extract(epoch from (r.requester_update_released_at-pe.outcome_at))/60.0) filter (where r.requester_update_released_at is not null and pe.outcome_at is not null),1),
    'avg_end_to_end_minutes', round(avg(extract(epoch from (r.requester_update_released_at-r.created_at))/60.0) filter (where r.requester_update_released_at is not null),1)
  ) into v_impact
  from public.churchwork_pilot_requests r
  left join lateral (
    select min((event_item->>'at')::timestamptz) as outcome_at
    from jsonb_array_elements(r.activity_log) event_item
    where event_item->>'event'='partner_outcome_logged' and event_item ? 'at'
  ) pe on true;

  if v_can_manage_access then
    select coalesce(jsonb_agg(to_jsonb(user_row)), '[]'::jsonb) into v_users
    from (
      select p.id,p.email,p.full_name,p.status,p.created_at,
        coalesce((
          select jsonb_agg(jsonb_build_object('role',rm.role,'status',rm.status,'organization_name',o.name,'organization_slug',o.slug) order by o.name,rm.role)
          from public.role_memberships rm join public.organizations o on o.id=rm.organization_id
          where rm.user_id=p.id
        ),'[]'::jsonb) as roles
      from public.profiles p order by p.created_at desc limit 100
    ) user_row;

    select coalesce(jsonb_agg(to_jsonb(audit_row)), '[]'::jsonb) into v_audit_events
    from (
      select al.id,al.action,al.target_table,al.target_id,al.metadata,al.created_at,p.email as actor_email
      from public.audit_logs al left join public.profiles p on p.id=al.actor_user_id
      order by al.created_at desc limit 50
    ) audit_row;
  end if;

  select coalesce(jsonb_agg(to_jsonb(request_row)), '[]'::jsonb) into v_recent_requests
  from (
    select r.id,r.requester_email,r.support_options,r.status,r.partner_outcome,r.requester_update,
      r.created_at,r.updated_at,r.facility_approved_at,r.partner_assigned_at,r.requester_update_released_at,
      own.facility_owner_user_id,fp.full_name as facility_owner_name,fp.email as facility_owner_email,own.facility_claimed_at,
      own.partner_owner_user_id,pp.full_name as partner_owner_name,pp.email as partner_owner_email,own.partner_claimed_at
    from public.churchwork_pilot_requests r
    left join private.churchwork_pilot_request_ownership own on own.request_id=r.id
    left join public.profiles fp on fp.id=own.facility_owner_user_id
    left join public.profiles pp on pp.id=own.partner_owner_user_id
    order by r.created_at desc limit 25
  ) request_row;

  return jsonb_build_object(
    'is_admin', true,
    'access_level', case when v_can_manage_access then 'platform_admin' else 'pilot_admin' end,
    'can_manage_access', v_can_manage_access,
    'can_view_activity', v_can_manage_access,
    'current_user_id', v_user_id,
    'summary', coalesce(v_summary,'{}'::jsonb),
    'staffing', coalesce(v_staffing,'{}'::jsonb),
    'impact', coalesce(v_impact,'{}'::jsonb),
    'users', coalesce(v_users,'[]'::jsonb),
    'recent_requests', coalesce(v_recent_requests,'[]'::jsonb),
    'audit_events', coalesce(v_audit_events,'[]'::jsonb)
  );
end;
$function$;

revoke all on function public.get_churchwork_pilot_operator_snapshot() from public, anon;
grant execute on function public.get_churchwork_pilot_operator_snapshot() to authenticated;
