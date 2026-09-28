create schema if not exists private;

create table if not exists private.churchwork_access_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  applicant_email text not null,
  portal text not null check (portal in ('facility','partner')),
  applicant_name text not null default '',
  job_title text,
  phone text,
  existing_organization_id uuid references public.organizations(id) on delete set null,
  organization_name text not null,
  address_line_1 text,
  city text,
  state text,
  postal_code text,
  website text,
  relationship_note text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','withdrawn')),
  approved_organization_id uuid references public.organizations(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists churchwork_access_applications_one_pending_idx
  on private.churchwork_access_applications (applicant_user_id, portal)
  where status = 'pending';
create index if not exists churchwork_access_applications_status_idx
  on private.churchwork_access_applications (status, created_at desc);
create index if not exists churchwork_access_applications_existing_org_idx
  on private.churchwork_access_applications (existing_organization_id)
  where existing_organization_id is not null;
create index if not exists churchwork_access_applications_approved_org_idx
  on private.churchwork_access_applications (approved_organization_id)
  where approved_organization_id is not null;
create index if not exists churchwork_access_applications_reviewed_by_idx
  on private.churchwork_access_applications (reviewed_by)
  where reviewed_by is not null;

create table if not exists private.churchwork_facility_partner_routes (
  facility_id uuid primary key references public.facilities(id) on delete cascade,
  partner_id uuid not null references public.partner_organizations(id) on delete restrict,
  status text not null default 'active' check (status in ('active','paused','disabled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists churchwork_facility_partner_routes_partner_idx
  on private.churchwork_facility_partner_routes (partner_id);

revoke all on table private.churchwork_access_applications from public, anon, authenticated;
revoke all on table private.churchwork_facility_partner_routes from public, anon, authenticated;

alter table private.churchwork_portal_invites
  drop constraint if exists churchwork_portal_invites_portal_check;
alter table private.churchwork_portal_invites
  add constraint churchwork_portal_invites_portal_check
  check (portal in ('facility','partner','requester'));

alter table private.churchwork_portal_invites
  drop constraint if exists churchwork_portal_invites_role_check;
alter table private.churchwork_portal_invites
  add constraint churchwork_portal_invites_role_check
  check (role in ('facility_admin','facility_staff','partner_admin','partner_user','requester'));

revoke all on table private.churchwork_portal_invites from public, anon, authenticated;


CREATE OR REPLACE FUNCTION public.approve_churchwork_access_application(p_application_id uuid, p_pilot_admin boolean DEFAULT false, p_partner_organization_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_app private.churchwork_access_applications%rowtype;
  v_org_id uuid;
  v_org_slug text;
  v_org_type text;
  v_platform_org uuid;
  v_role text;
  v_facility_id uuid;
  v_partner_id uuid;
  v_route_partner_id uuid;
  v_now timestamptz := now();
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then
    raise exception 'Owner/admin access required';
  end if;

  select * into v_app
  from private.churchwork_access_applications a
  where a.id = p_application_id
  for update;

  if not found or v_app.status <> 'pending' then
    raise exception 'Application is not pending';
  end if;

  if v_app.existing_organization_id is not null then
    select o.id, o.slug, o.organization_type
      into v_org_id, v_org_slug, v_org_type
    from public.organizations o
    where o.id = v_app.existing_organization_id
      and o.status in ('active','pilot');

    if v_org_type <> v_app.portal then
      raise exception 'Existing organization does not match application portal';
    end if;
  else
    v_org_slug := trim(both '-' from lower(regexp_replace(v_app.organization_name, '[^a-zA-Z0-9]+', '-', 'g')));
    if v_org_slug = '' then
      v_org_slug := 'churchwork-org';
    end if;

    if exists(select 1 from public.organizations o where o.slug = v_org_slug) then
      v_org_slug := left(v_org_slug, 48) || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,6);
    end if;

    insert into public.organizations (name, slug, organization_type, status)
    values (v_app.organization_name, v_org_slug, v_app.portal, 'pilot')
    returning id into v_org_id;

    if v_app.portal = 'facility' then
      insert into public.facilities (
        organization_id, name, address_line_1, city, state, postal_code, status
      )
      values (
        v_org_id, v_app.organization_name, v_app.address_line_1, v_app.city, v_app.state, v_app.postal_code, 'pilot'
      )
      returning id into v_facility_id;
    else
      insert into public.partner_organizations (organization_id, name, partner_type, status)
      values (v_org_id, v_app.organization_name, 'church', 'pilot')
      returning id into v_partner_id;
    end if;
  end if;

  if v_app.portal = 'facility' then
    v_role := 'facility_admin';

    if v_facility_id is null then
      select f.id into v_facility_id
      from public.facilities f
      where f.organization_id = v_org_id
      order by f.created_at
      limit 1;
    end if;

    if v_facility_id is null then
      raise exception 'Facility record is not configured';
    end if;

    if p_partner_organization_id is not null then
      select po.id into v_route_partner_id
      from public.partner_organizations po
      join public.organizations o on o.id = po.organization_id
      where o.id = p_partner_organization_id
        and o.organization_type = 'partner'
        and o.status in ('active','pilot')
        and po.status in ('active','pilot')
      order by po.created_at
      limit 1;

      if v_route_partner_id is null then
        raise exception 'Selected care partner is unavailable';
      end if;

      insert into private.churchwork_facility_partner_routes (
        facility_id, partner_id, status, created_by, updated_at
      )
      values (v_facility_id, v_route_partner_id, 'active', auth.uid(), v_now)
      on conflict (facility_id) do update
      set partner_id = excluded.partner_id,
          status = 'active',
          created_by = excluded.created_by,
          updated_at = excluded.updated_at;
    end if;
  else
    v_role := 'partner_admin';
  end if;

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (v_app.applicant_user_id, v_org_id, v_role, 'active')
  on conflict (user_id, organization_id, role) do update
  set status = 'active',
      updated_at = v_now;

  if coalesce(p_pilot_admin,false) then
    select o.id into v_platform_org
    from public.organizations o
    where o.slug = 'churchwork'
      and o.organization_type = 'platform'
    limit 1;

    if v_platform_org is null then
      raise exception 'ChurchWork platform organization missing';
    end if;

    insert into public.role_memberships (user_id, organization_id, role, status)
    values (v_app.applicant_user_id, v_platform_org, 'pilot_admin', 'active')
    on conflict (user_id, organization_id, role) do update
    set status = 'active',
        updated_at = v_now;
  end if;

  update private.churchwork_access_applications
  set status = 'approved',
      approved_organization_id = v_org_id,
      reviewed_by = auth.uid(),
      reviewed_at = v_now,
      review_note = null,
      updated_at = v_now
  where id = p_application_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'pilot_access_application_approved',
    'churchwork_access_applications',
    p_application_id,
    jsonb_build_object(
      'applicant_user_id', v_app.applicant_user_id,
      'organization_id', v_org_id,
      'role', v_role,
      'pilot_admin', coalesce(p_pilot_admin,false),
      'partner_organization_id', p_partner_organization_id
    )
  );

  return jsonb_build_object(
    'ok', true,
    'application_id', p_application_id,
    'organization_id', v_org_id,
    'organization_name', v_app.organization_name,
    'organization_slug', v_org_slug,
    'portal', v_app.portal,
    'role', v_role,
    'pilot_admin', coalesce(p_pilot_admin,false),
    'facility_route_configured', case when v_app.portal = 'facility' then exists(
      select 1 from private.churchwork_facility_partner_routes r
      where r.facility_id = v_facility_id and r.status = 'active'
    ) else null end
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.create_churchwork_org_invite(p_organization_id uuid, p_email text, p_role text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_email text := lower(trim(p_email));
  v_org record;
  v_portal text;
  v_token text;
  v_hash text;
  v_invite_id uuid;
  v_expires timestamptz := now() + interval '14 days';
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select o.id, o.name, o.slug, o.organization_type
    into v_org
  from public.organizations o
  where o.id = p_organization_id
    and o.status in ('active','pilot');

  if not found then
    raise exception 'Organization not found';
  end if;

  if v_org.organization_type = 'facility' then
    if not public.user_has_org_role(v_org.id, array['facility_admin']::text[]) then
      raise exception 'Facility admin access required';
    end if;
    if p_role not in ('facility_admin','facility_staff','requester') then
      raise exception 'Unsupported facility role';
    end if;
    v_portal := case when p_role = 'requester' then 'requester' else 'facility' end;
  elsif v_org.organization_type = 'partner' then
    if not public.user_has_org_role(v_org.id, array['partner_admin']::text[]) then
      raise exception 'Partner admin access required';
    end if;
    if p_role not in ('partner_admin','partner_user') then
      raise exception 'Unsupported partner role';
    end if;
    v_portal := 'partner';
  else
    raise exception 'Organization cannot manage pilot users';
  end if;

  if v_email = '' or position('@' in v_email) < 2 then
    raise exception 'Valid email required';
  end if;

  update private.churchwork_portal_invites
  set revoked_at = now()
  where lower(email) = v_email
    and organization_id = v_org.id
    and accepted_at is null
    and revoked_at is null;

  v_token := pg_catalog.encode(extensions.gen_random_bytes(32), 'hex');
  v_hash := pg_catalog.encode(extensions.digest(v_token, 'sha256'), 'hex');

  insert into private.churchwork_portal_invites (
    email, organization_id, org_slug, portal, role, pilot_admin,
    token_hash, created_by, expires_at
  )
  values (
    v_email, v_org.id, v_org.slug, v_portal, p_role, false,
    v_hash, v_user_id, v_expires
  )
  returning id into v_invite_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    v_user_id, 'organization_user_invited',
    'churchwork_portal_invites', v_invite_id,
    jsonb_build_object('email', v_email, 'organization_id', v_org.id, 'role', p_role)
  );

  return jsonb_build_object(
    'ok', true,
    'invite_id', v_invite_id,
    'token', v_token,
    'email', v_email,
    'organization_id', v_org.id,
    'organization_name', v_org.name,
    'org_slug', v_org.slug,
    'portal', v_portal,
    'role', p_role,
    'pilot_admin', false,
    'expires_at', v_expires
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_my_churchwork_access_application(p_portal text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select to_jsonb(x) into v_result
  from (
    select
      a.id,
      a.portal,
      a.applicant_email,
      a.applicant_name,
      a.job_title,
      a.phone,
      a.existing_organization_id,
      a.organization_name,
      a.address_line_1,
      a.city,
      a.state,
      a.postal_code,
      a.website,
      a.relationship_note,
      a.status,
      a.review_note,
      a.created_at,
      a.updated_at,
      a.reviewed_at
    from private.churchwork_access_applications a
    where a.applicant_user_id = auth.uid()
      and a.portal = p_portal
    order by a.created_at desc
    limit 1
  ) x;

  return coalesce(v_result, '{}'::jsonb);
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_my_churchwork_org_team(p_portal text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_org_id uuid;
  v_org_name text;
  v_org_slug text;
  v_org_type text;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_portal = 'facility' then
    select o.id, o.name, o.slug, o.organization_type
      into v_org_id, v_org_name, v_org_slug, v_org_type
    from public.role_memberships rm
    join public.organizations o on o.id = rm.organization_id
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role = 'facility_admin'
      and o.organization_type = 'facility'
      and o.status in ('active','pilot')
    order by rm.created_at
    limit 1;
  elsif p_portal = 'partner' then
    select o.id, o.name, o.slug, o.organization_type
      into v_org_id, v_org_name, v_org_slug, v_org_type
    from public.role_memberships rm
    join public.organizations o on o.id = rm.organization_id
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role = 'partner_admin'
      and o.organization_type = 'partner'
      and o.status in ('active','pilot')
    order by rm.created_at
    limit 1;
  else
    raise exception 'Unsupported portal';
  end if;

  if v_org_id is null then
    raise exception 'Organization admin access required';
  end if;

  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at), '[]'::jsonb)
  into v_result
  from (
    select distinct on (p.id)
      p.id as user_id,
      p.email,
      p.full_name,
      rm.role,
      rm.status,
      rm.created_at
    from public.role_memberships rm
    join public.profiles p on p.id = rm.user_id
    where rm.organization_id = v_org_id
      and (
        (v_org_type = 'facility' and rm.role in ('facility_admin','facility_staff','requester'))
        or
        (v_org_type = 'partner' and rm.role in ('partner_admin','partner_user'))
      )
    order by p.id, case when rm.status = 'active' then 0 else 1 end, rm.updated_at desc
  ) x;

  return jsonb_build_object(
    'organization_id', v_org_id,
    'organization_name', v_org_name,
    'organization_slug', v_org_slug,
    'portal', p_portal,
    'members', coalesce(v_result,'[]'::jsonb)
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_my_requester_facilities()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'facility_id', f.id,
    'organization_id', o.id,
    'facility_name', f.name,
    'organization_name', o.name,
    'route_ready', (r.status = 'active' and po.status in ('pilot','active')),
    'partner_name', po.name
  ) order by f.name), '[]'::jsonb)
  into v_result
  from public.role_memberships rm
  join public.organizations o on o.id = rm.organization_id
  join public.facilities f on f.organization_id = o.id
  left join private.churchwork_facility_partner_routes r on r.facility_id = f.id
  left join public.partner_organizations po on po.id = r.partner_id
  where rm.user_id = auth.uid()
    and rm.role = 'requester'
    and rm.status = 'active'
    and o.organization_type = 'facility'
    and o.status in ('pilot','active')
    and f.status in ('pilot','active');

  -- Preserve owner/platform-admin demo access without making ordinary public requesters global.
  if jsonb_array_length(v_result) = 0
     and public.user_has_role(array['owner','platform_admin']::text[]) then
    select coalesce(jsonb_agg(jsonb_build_object(
      'facility_id', f.id,
      'organization_id', o.id,
      'facility_name', f.name,
      'organization_name', o.name,
      'route_ready', (r.status = 'active' and po.status in ('pilot','active')),
      'partner_name', po.name
    ) order by f.name), '[]'::jsonb)
    into v_result
    from public.facilities f
    join public.organizations o on o.id = f.organization_id
    left join private.churchwork_facility_partner_routes r on r.facility_id = f.id
    left join public.partner_organizations po on po.id = r.partner_id
    where o.slug = 'grandview-post-acute'
      and f.status in ('pilot','active');
  end if;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.list_churchwork_access_applications()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then
    raise exception 'Owner/admin access required';
  end if;

  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
  into v_result
  from (
    select
      a.id,
      a.applicant_user_id,
      a.applicant_email,
      a.portal,
      a.applicant_name,
      a.job_title,
      a.phone,
      a.existing_organization_id,
      existing_org.name as existing_organization_name,
      a.organization_name,
      a.address_line_1,
      a.city,
      a.state,
      a.postal_code,
      a.website,
      a.relationship_note,
      a.status,
      a.approved_organization_id,
      approved_org.name as approved_organization_name,
      a.reviewed_at,
      a.review_note,
      a.created_at,
      a.updated_at
    from private.churchwork_access_applications a
    left join public.organizations existing_org on existing_org.id = a.existing_organization_id
    left join public.organizations approved_org on approved_org.id = a.approved_organization_id
    order by a.created_at desc
    limit 200
  ) x;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.list_churchwork_pilot_organizations()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null
     or not public.user_has_role(array['owner','platform_admin','pilot_admin']::text[]) then
    raise exception 'Pilot admin access required';
  end if;

  select coalesce(jsonb_agg(to_jsonb(x) order by x.organization_type, x.name), '[]'::jsonb)
  into v_result
  from (
    select
      o.id,
      o.name,
      o.slug,
      o.organization_type,
      o.status,
      o.created_at,
      case
        when o.organization_type = 'facility' then (
          select count(distinct rm.user_id)::int
          from public.role_memberships rm
          where rm.organization_id = o.id
            and rm.status = 'active'
            and rm.role in ('facility_admin','facility_staff')
        )
        when o.organization_type = 'partner' then (
          select count(distinct rm.user_id)::int
          from public.role_memberships rm
          where rm.organization_id = o.id
            and rm.status = 'active'
            and rm.role in ('partner_admin','partner_user')
        )
        else 0
      end as team_members,
      case
        when o.organization_type = 'facility' then (
          select count(distinct rm.user_id)::int
          from public.role_memberships rm
          where rm.organization_id = o.id
            and rm.status = 'active'
            and rm.role = 'requester'
        )
        else 0
      end as requesters,
      case
        when o.organization_type = 'facility' then (
          select count(distinct rm.user_id)::int
          from public.role_memberships rm
          where rm.organization_id = o.id
            and rm.status = 'active'
            and rm.role = 'facility_admin'
        )
        when o.organization_type = 'partner' then (
          select count(distinct rm.user_id)::int
          from public.role_memberships rm
          where rm.organization_id = o.id
            and rm.status = 'active'
            and rm.role = 'partner_admin'
        )
        else 0
      end as admins,
      case
        when o.organization_type = 'facility' then (
          select f.id
          from public.facilities f
          where f.organization_id = o.id
          order by f.created_at
          limit 1
        )
        else null
      end as facility_id,
      case
        when o.organization_type = 'partner' then (
          select po.id
          from public.partner_organizations po
          where po.organization_id = o.id
          order by po.created_at
          limit 1
        )
        else null
      end as partner_id,
      case
        when o.organization_type = 'facility' then (
          select po.name
          from public.facilities f
          join private.churchwork_facility_partner_routes r on r.facility_id = f.id and r.status = 'active'
          join public.partner_organizations po on po.id = r.partner_id
          where f.organization_id = o.id
          order by f.created_at
          limit 1
        )
        else null
      end as care_partner_name,
      case
        when o.organization_type = 'facility' then exists (
          select 1
          from public.facilities f
          join private.churchwork_facility_partner_routes r on r.facility_id = f.id
          where f.organization_id = o.id
            and r.status = 'active'
        )
        else null
      end as route_ready
    from public.organizations o
    where o.organization_type in ('facility','partner')
      and o.status in ('pilot','active')
  ) x;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.list_churchwork_route_partners()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then
    raise exception 'Owner/admin access required';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'organization_id', o.id,
    'organization_name', o.name,
    'partner_id', po.id
  ) order by o.name), '[]'::jsonb)
  into v_result
  from public.partner_organizations po
  join public.organizations o on o.id = po.organization_id
  where po.status in ('pilot','active')
    and o.status in ('pilot','active');

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.list_churchwork_signup_organizations(p_portal text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_portal not in ('facility','partner') then
    raise exception 'Unsupported portal';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id,
    'name', o.name,
    'slug', o.slug
  ) order by o.name), '[]'::jsonb)
  into v_result
  from public.organizations o
  where o.organization_type = p_portal
    and o.status in ('active','pilot');

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.reject_churchwork_access_application(p_application_id uuid, p_review_note text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then
    raise exception 'Owner/admin access required';
  end if;

  update private.churchwork_access_applications
  set status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      review_note = nullif(left(trim(coalesce(p_review_note,'')), 800), ''),
      updated_at = now()
  where id = p_application_id
    and status = 'pending';

  if not found then
    return false;
  end if;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(), 'pilot_access_application_rejected',
    'churchwork_access_applications', p_application_id, '{}'::jsonb
  );

  return true;
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_churchwork_org_member_role(p_organization_id uuid, p_user_id uuid, p_role text, p_status text DEFAULT 'active'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_org_type text;
  v_admin_role text;
  v_allowed_roles text[];
  v_other_admins integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select o.organization_type into v_org_type
  from public.organizations o
  where o.id = p_organization_id
    and o.status in ('active','pilot');

  if v_org_type = 'facility' then
    v_admin_role := 'facility_admin';
    v_allowed_roles := array['facility_admin','facility_staff','requester']::text[];
  elsif v_org_type = 'partner' then
    v_admin_role := 'partner_admin';
    v_allowed_roles := array['partner_admin','partner_user']::text[];
  else
    raise exception 'Unsupported organization';
  end if;

  if not public.user_has_org_role(p_organization_id, array[v_admin_role]::text[]) then
    raise exception 'Organization admin access required';
  end if;

  if not (p_role = any(v_allowed_roles)) then
    raise exception 'Role is not valid for this organization';
  end if;

  if p_status not in ('active','disabled') then
    raise exception 'Unsupported status';
  end if;

  if not exists (
    select 1
    from public.role_memberships rm
    where rm.user_id = p_user_id
      and rm.organization_id = p_organization_id
      and rm.role = any(v_allowed_roles)
  ) then
    raise exception 'User is not a member of this organization';
  end if;

  if p_user_id = auth.uid()
     and (
       p_status = 'disabled'
       or p_role <> v_admin_role
     )
     and exists (
       select 1 from public.role_memberships rm
       where rm.user_id = p_user_id
         and rm.organization_id = p_organization_id
         and rm.role = v_admin_role
         and rm.status = 'active'
     ) then
    select count(distinct rm.user_id)::integer into v_other_admins
    from public.role_memberships rm
    where rm.organization_id = p_organization_id
      and rm.role = v_admin_role
      and rm.status = 'active'
      and rm.user_id <> p_user_id;

    if v_other_admins = 0 then
      raise exception 'Cannot remove the last active organization admin';
    end if;
  end if;

  update public.role_memberships rm
  set status = 'disabled',
      updated_at = now()
  where rm.user_id = p_user_id
    and rm.organization_id = p_organization_id
    and rm.role = any(v_allowed_roles)
    and rm.role <> p_role;

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (p_user_id, p_organization_id, p_role, p_status)
  on conflict (user_id, organization_id, role) do update
  set status = excluded.status,
      updated_at = now();

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(), 'organization_member_role_set',
    'role_memberships', p_user_id,
    jsonb_build_object('organization_id', p_organization_id, 'role', p_role, 'status', p_status)
  );

  return true;
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_churchwork_pilot_request_routing()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_facility_id uuid;
  v_partner_id uuid;
  v_facility_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if new.requester_user_id <> auth.uid() then
    raise exception 'Requester identity mismatch';
  end if;

  if new.facility_id is not null then
    if public.user_has_role(array['owner','platform_admin']::text[]) then
      v_facility_id := new.facility_id;
    else
      select f.id into v_facility_id
      from public.facilities f
      join public.role_memberships rm on rm.organization_id = f.organization_id
      where f.id = new.facility_id
        and f.status in ('pilot','active')
        and rm.user_id = auth.uid()
        and rm.role = 'requester'
        and rm.status = 'active'
      limit 1;
    end if;

    if v_facility_id is null then
      raise exception 'Requester is not linked to the selected facility';
    end if;
  else
    select count(*), min(f.id)
      into v_facility_count, v_facility_id
    from public.role_memberships rm
    join public.organizations o on o.id = rm.organization_id
    join public.facilities f on f.organization_id = o.id
    where rm.user_id = auth.uid()
      and rm.role = 'requester'
      and rm.status = 'active'
      and o.organization_type = 'facility'
      and o.status in ('pilot','active')
      and f.status in ('pilot','active');

    if v_facility_count = 0 and public.user_has_role(array['owner','platform_admin']::text[]) then
      select f.id into v_facility_id
      from public.facilities f
      join public.organizations o on o.id = f.organization_id
      where o.slug = 'grandview-post-acute'
        and f.status in ('pilot','active')
      order by f.created_at
      limit 1;
      v_facility_count := case when v_facility_id is null then 0 else 1 end;
    end if;

    if v_facility_count = 0 then
      raise exception 'Requester account is not linked to a facility';
    elsif v_facility_count > 1 then
      raise exception 'Choose a facility for this request';
    end if;
  end if;

  select r.partner_id into v_partner_id
  from private.churchwork_facility_partner_routes r
  join public.partner_organizations po on po.id = r.partner_id
  where r.facility_id = v_facility_id
    and r.status = 'active'
    and po.status in ('pilot','active')
  limit 1;

  if v_partner_id is null then
    raise exception 'This facility does not have an active ChurchWork care partner yet';
  end if;

  new.facility_id := v_facility_id;
  new.partner_id := v_partner_id;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.submit_churchwork_access_application(p_portal text, p_applicant_name text, p_job_title text, p_phone text, p_existing_organization_id uuid, p_organization_name text, p_address_line_1 text, p_city text, p_state text, p_postal_code text, p_website text, p_relationship_note text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_org_type text;
  v_application_id uuid;
  v_org_name text := trim(coalesce(p_organization_name,''));
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_portal not in ('facility','partner') then
    raise exception 'Unsupported portal';
  end if;

  select lower(u.email) into v_email
  from auth.users u
  where u.id = v_user_id;

  if v_email is null then
    raise exception 'Account email unavailable';
  end if;

  if p_existing_organization_id is not null then
    select o.organization_type, o.name
      into v_org_type, v_org_name
    from public.organizations o
    where o.id = p_existing_organization_id
      and o.status in ('active','pilot');

    if v_org_type is null or v_org_type <> p_portal then
      raise exception 'Selected organization does not match portal';
    end if;
  elsif length(v_org_name) < 2 then
    raise exception 'Organization name required';
  end if;

  if length(trim(coalesce(p_applicant_name,''))) < 2 then
    raise exception 'Your name is required';
  end if;

  insert into private.churchwork_access_applications (
    applicant_user_id,
    applicant_email,
    portal,
    applicant_name,
    job_title,
    phone,
    existing_organization_id,
    organization_name,
    address_line_1,
    city,
    state,
    postal_code,
    website,
    relationship_note,
    status,
    updated_at
  )
  values (
    v_user_id,
    v_email,
    p_portal,
    left(trim(p_applicant_name), 160),
    nullif(left(trim(coalesce(p_job_title,'')), 160), ''),
    nullif(left(trim(coalesce(p_phone,'')), 80), ''),
    p_existing_organization_id,
    left(v_org_name, 200),
    nullif(left(trim(coalesce(p_address_line_1,'')), 240), ''),
    nullif(left(trim(coalesce(p_city,'')), 120), ''),
    nullif(left(trim(coalesce(p_state,'')), 80), ''),
    nullif(left(trim(coalesce(p_postal_code,'')), 32), ''),
    nullif(left(trim(coalesce(p_website,'')), 240), ''),
    nullif(left(trim(coalesce(p_relationship_note,'')), 800), ''),
    'pending',
    now()
  )
  on conflict (applicant_user_id, portal) where status = 'pending'
  do update set
    applicant_email = excluded.applicant_email,
    applicant_name = excluded.applicant_name,
    job_title = excluded.job_title,
    phone = excluded.phone,
    existing_organization_id = excluded.existing_organization_id,
    organization_name = excluded.organization_name,
    address_line_1 = excluded.address_line_1,
    city = excluded.city,
    state = excluded.state,
    postal_code = excluded.postal_code,
    website = excluded.website,
    relationship_note = excluded.relationship_note,
    updated_at = now()
  returning id into v_application_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    v_user_id,
    'pilot_access_application_submitted',
    'churchwork_access_applications',
    v_application_id,
    jsonb_build_object('portal', p_portal, 'organization_name', v_org_name)
  );

  return jsonb_build_object(
    'ok', true,
    'application_id', v_application_id,
    'email', v_email,
    'portal', p_portal,
    'organization_name', v_org_name,
    'status', 'pending'
  );
end;
$function$;

revoke all on function public.list_churchwork_signup_organizations(text) from public, anon;
grant execute on function public.list_churchwork_signup_organizations(text) to authenticated;
revoke all on function public.get_my_churchwork_access_application(text) from public, anon;
grant execute on function public.get_my_churchwork_access_application(text) to authenticated;
revoke all on function public.submit_churchwork_access_application(text,text,text,text,uuid,text,text,text,text,text,text,text) from public, anon;
grant execute on function public.submit_churchwork_access_application(text,text,text,text,uuid,text,text,text,text,text,text,text) to authenticated;
revoke all on function public.list_churchwork_access_applications() from public, anon;
grant execute on function public.list_churchwork_access_applications() to authenticated;
revoke all on function public.approve_churchwork_access_application(uuid,boolean,uuid) from public, anon;
grant execute on function public.approve_churchwork_access_application(uuid,boolean,uuid) to authenticated;
revoke all on function public.reject_churchwork_access_application(uuid,text) from public, anon;
grant execute on function public.reject_churchwork_access_application(uuid,text) to authenticated;
revoke all on function public.list_churchwork_route_partners() from public, anon;
grant execute on function public.list_churchwork_route_partners() to authenticated;
revoke all on function public.list_churchwork_pilot_organizations() from public, anon;
grant execute on function public.list_churchwork_pilot_organizations() to authenticated;
revoke all on function public.get_my_churchwork_org_team(text) from public, anon;
grant execute on function public.get_my_churchwork_org_team(text) to authenticated;
revoke all on function public.create_churchwork_org_invite(uuid,text,text) from public, anon;
grant execute on function public.create_churchwork_org_invite(uuid,text,text) to authenticated;
revoke all on function public.set_churchwork_org_member_role(uuid,uuid,text,text) from public, anon;
grant execute on function public.set_churchwork_org_member_role(uuid,uuid,text,text) to authenticated;
revoke all on function public.get_my_requester_facilities() from public, anon;
grant execute on function public.get_my_requester_facilities() to authenticated;
revoke all on function public.set_churchwork_pilot_request_routing() from public, anon, authenticated;

drop trigger if exists set_churchwork_pilot_request_routing on public.churchwork_pilot_requests;
create trigger set_churchwork_pilot_request_routing
before insert on public.churchwork_pilot_requests
for each row execute function public.set_churchwork_pilot_request_routing();
