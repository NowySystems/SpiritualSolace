-- ChurchWork Pilot Owner/Admin Access Center
-- Date: 2026-07-02
-- Purpose: bootstrap Cole and Sam as platform owners, track new signups, and support owner/admin role assignment.

create or replace function public.sync_current_pilot_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles;
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (id, email, status)
  values (auth.uid(), v_email, 'active')
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    updated_at = now()
  returning * into v_profile;

  return v_profile;
end;
$$;

revoke all on function public.sync_current_pilot_profile() from public;
grant execute on function public.sync_current_pilot_profile() to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, status)
  values (new.id, lower(new.email), 'active')
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists churchwork_auth_profile_insert on auth.users;
create trigger churchwork_auth_profile_insert
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.claim_churchwork_bootstrap_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
  v_organization_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if v_email not in ('llcolej8@gmail.com', 'samuellefave@gmail.com') then
    raise exception 'This account is not authorized for bootstrap owner access';
  end if;

  select id into v_organization_id
  from public.organizations
  where slug = 'churchwork'
  limit 1;

  if v_organization_id is null then
    raise exception 'ChurchWork organization is not configured';
  end if;

  insert into public.profiles (id, email, status)
  values (auth.uid(), v_email, 'active')
  on conflict (id) do update set
    email = excluded.email,
    status = 'active',
    updated_at = now();

  insert into public.role_memberships (user_id, organization_id, role, status)
  values
    (auth.uid(), v_organization_id, 'owner', 'active'),
    (auth.uid(), v_organization_id, 'platform_admin', 'active')
  on conflict (user_id, organization_id, role) do update set
    status = 'active',
    updated_at = now();

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'bootstrap_admin_claimed',
    'role_memberships',
    v_organization_id,
    jsonb_build_object('email', v_email, 'roles', jsonb_build_array('owner', 'platform_admin'))
  );

  return true;
end;
$$;

revoke all on function public.claim_churchwork_bootstrap_admin() from public;
grant execute on function public.claim_churchwork_bootstrap_admin() to authenticated;

create or replace function public.set_pilot_user_role(
  p_user_email text,
  p_org_slug text,
  p_role text,
  p_status text default 'active'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_organization_id uuid;
  v_membership_id uuid;
  v_user_email text := lower(trim(p_user_email));
  v_org_slug text := lower(trim(p_org_slug));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.user_has_role(array['owner', 'platform_admin']) then
    raise exception 'Owner/admin access required';
  end if;

  if p_role not in ('owner', 'platform_admin', 'facility_admin', 'facility_staff', 'partner_admin', 'partner_user', 'requester') then
    raise exception 'Invalid role';
  end if;

  if p_status not in ('invited', 'active', 'disabled') then
    raise exception 'Invalid status';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = v_user_email
  limit 1;

  if v_user_id is null then
    raise exception 'User has not signed up yet';
  end if;

  select id into v_organization_id
  from public.organizations
  where slug = v_org_slug
  limit 1;

  if v_organization_id is null then
    raise exception 'Organization not found';
  end if;

  insert into public.profiles (id, email, status)
  values (v_user_id, v_user_email, 'active')
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (v_user_id, v_organization_id, p_role, p_status)
  on conflict (user_id, organization_id, role) do update set
    status = excluded.status,
    updated_at = now()
  returning id into v_membership_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'pilot_user_role_set',
    'role_memberships',
    v_membership_id,
    jsonb_build_object('user_email', v_user_email, 'org_slug', v_org_slug, 'role', p_role, 'status', p_status)
  );

  return v_membership_id;
end;
$$;

revoke all on function public.set_pilot_user_role(text, text, text, text) from public;
grant execute on function public.set_pilot_user_role(text, text, text, text) to authenticated;

create or replace function public.get_owner_admin_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
  v_is_admin boolean;
  v_snapshot jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select public.user_has_role(array['owner', 'platform_admin']) into v_is_admin;

  if not v_is_admin then
    return jsonb_build_object(
      'is_admin', false,
      'current_user_email', v_email,
      'message', 'Owner/admin access is required for the access center.'
    );
  end if;

  with role_bucket_counts as (
    select
      case
        when role in ('owner', 'platform_admin') then 'owner_admin'
        when role in ('facility_admin', 'facility_staff') then 'facility'
        when role in ('partner_admin', 'partner_user') then 'partner'
        when role = 'requester' then 'requester'
        else 'other'
      end as bucket,
      count(distinct user_id)::int as bucket_count
    from public.role_memberships
    where status = 'active'
    group by 1
  ), users_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'email', p.email,
          'full_name', p.full_name,
          'status', p.status,
          'created_at', p.created_at,
          'policy_acceptance_count', (
            select count(*)::int from public.policy_acceptances pa where pa.user_id = p.id
          ),
          'roles', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', rm.id,
                'role', rm.role,
                'status', rm.status,
                'organization_name', o.name,
                'organization_slug', o.slug,
                'organization_type', o.organization_type
              ) order by o.slug, rm.role
            )
            from public.role_memberships rm
            join public.organizations o on o.id = rm.organization_id
            where rm.user_id = p.id
          ), '[]'::jsonb)
        ) order by p.created_at desc
      ), '[]'::jsonb
    ) as data
    from public.profiles p
  ), requests_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'resident_display_name', q.resident_display_name,
          'requester_display_name', q.requester_display_name,
          'requester_role', q.requester_role,
          'request_type', q.request_type,
          'priority', q.priority,
          'status', q.status,
          'facility_name', q.facility_name,
          'created_at', q.created_at
        ) order by q.created_at desc
      ), '[]'::jsonb
    ) as data
    from (
      select cr.*, f.name as facility_name
      from public.care_requests cr
      join public.facilities f on f.id = cr.facility_id
      order by cr.created_at desc
      limit 12
    ) q
  ), timeline_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'care_request_id', q.care_request_id,
          'event_type', q.event_type,
          'visibility', q.visibility,
          'sharing_level', q.sharing_level,
          'priority_label', q.priority_label,
          'created_at', q.created_at
        ) order by q.created_at desc
      ), '[]'::jsonb
    ) as data
    from (
      select *
      from public.timeline_events
      order by created_at desc
      limit 12
    ) q
  )
  select jsonb_build_object(
    'is_admin', true,
    'current_user_email', v_email,
    'summary', jsonb_build_object(
      'users_total', (select count(*)::int from public.profiles),
      'unassigned_users', (
        select count(*)::int
        from public.profiles p
        where not exists (
          select 1
          from public.role_memberships rm
          where rm.user_id = p.id
            and rm.status = 'active'
        )
      ),
      'requests_total', (select count(*)::int from public.care_requests),
      'new_requests', (select count(*)::int from public.care_requests where status in ('new', 'facility_review')),
      'timeline_events_total', (select count(*)::int from public.timeline_events)
    ),
    'role_buckets', coalesce((select jsonb_object_agg(bucket, bucket_count) from role_bucket_counts), '{}'::jsonb),
    'users', (select data from users_json),
    'recent_requests', (select data from requests_json),
    'recent_timeline_events', (select data from timeline_json)
  ) into v_snapshot;

  return v_snapshot;
end;
$$;

revoke all on function public.get_owner_admin_snapshot() from public;
grant execute on function public.get_owner_admin_snapshot() to authenticated;
