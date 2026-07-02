-- ChurchWork Facility Self-Signup
-- Date: 2026-07-02
-- Purpose: allow a signed-in pilot user to create a facility organization and become its first Facility Admin.

create or replace function public.slugify_facility_name(p_name text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(p_name, '')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.create_facility_account(
  p_facility_name text,
  p_address_line_1 text default null,
  p_city text default null,
  p_state text default null,
  p_postal_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
  v_base_slug text;
  v_slug text;
  v_counter integer := 1;
  v_organization_id uuid;
  v_facility_id uuid;
  v_membership_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if nullif(trim(p_facility_name), '') is null then
    raise exception 'Facility name is required';
  end if;

  v_base_slug := public.slugify_facility_name(p_facility_name);

  if v_base_slug = '' then
    raise exception 'Facility name must include letters or numbers';
  end if;

  v_slug := v_base_slug;

  while exists (select 1 from public.organizations where slug = v_slug) loop
    v_counter := v_counter + 1;
    v_slug := v_base_slug || '-' || v_counter::text;
  end loop;

  insert into public.profiles (id, email, status)
  values (auth.uid(), v_email, 'active')
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    status = 'active',
    updated_at = now();

  insert into public.organizations (name, slug, organization_type, status)
  values (trim(p_facility_name), v_slug, 'facility', 'pilot')
  returning id into v_organization_id;

  insert into public.facilities (
    organization_id,
    name,
    address_line_1,
    city,
    state,
    postal_code,
    status
  )
  values (
    v_organization_id,
    trim(p_facility_name),
    nullif(trim(coalesce(p_address_line_1, '')), ''),
    nullif(trim(coalesce(p_city, '')), ''),
    nullif(trim(coalesce(p_state, '')), ''),
    nullif(trim(coalesce(p_postal_code, '')), ''),
    'pilot'
  )
  returning id into v_facility_id;

  insert into public.role_memberships (user_id, organization_id, role, status)
  values (auth.uid(), v_organization_id, 'facility_admin', 'active')
  on conflict (user_id, organization_id, role) do update set
    status = 'active',
    updated_at = now()
  returning id into v_membership_id;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'facility_account_created',
    'facilities',
    v_facility_id,
    jsonb_build_object(
      'organization_id', v_organization_id,
      'organization_slug', v_slug,
      'facility_name', trim(p_facility_name),
      'created_admin_email', v_email,
      'membership_id', v_membership_id
    )
  );

  return jsonb_build_object(
    'organization_id', v_organization_id,
    'facility_id', v_facility_id,
    'membership_id', v_membership_id,
    'organization_slug', v_slug,
    'facility_name', trim(p_facility_name),
    'role', 'facility_admin',
    'status', 'pilot'
  );
end;
$$;

revoke all on function public.create_facility_account(text, text, text, text, text) from public;
grant execute on function public.create_facility_account(text, text, text, text, text) to authenticated;
