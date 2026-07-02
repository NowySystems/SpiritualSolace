-- ChurchWork Facility User Management
-- Date: 2026-07-02
-- Purpose: let Facility Admins manage users and roles inside their own facility organizations.

create table if not exists public.facility_user_invites (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  email text not null,
  role text not null check (role in ('facility_admin', 'facility_staff')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'disabled')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (facility_id, email, role)
);

create index if not exists facility_user_invites_facility_id_idx on public.facility_user_invites(facility_id);
create index if not exists facility_user_invites_email_idx on public.facility_user_invites(lower(email));
create index if not exists facility_user_invites_status_idx on public.facility_user_invites(status);

alter table public.facility_user_invites enable row level security;

drop policy if exists "facility_invites_admin_select" on public.facility_user_invites;
create policy "facility_invites_admin_select"
  on public.facility_user_invites for select
  to authenticated
  using (
    public.user_has_role(array['owner', 'platform_admin'])
    or public.user_can_access_facility(facility_id, array['facility_admin'])
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create or replace function public.user_can_manage_facility(target_facility_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_role(array['owner', 'platform_admin'])
    or public.user_can_access_facility(target_facility_id, array['facility_admin']);
$$;

create or replace function public.claim_facility_invites()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
  v_claimed_count integer := 0;
  v_invite record;
  v_organization_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if v_email is null then
    return jsonb_build_object('claimed_count', 0);
  end if;

  insert into public.profiles (id, email, status)
  values (auth.uid(), v_email, 'active')
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    status = 'active',
    updated_at = now();

  for v_invite in
    select fui.*
    from public.facility_user_invites fui
    where lower(fui.email) = v_email
      and fui.status = 'pending'
  loop
    select f.organization_id into v_organization_id
    from public.facilities f
    where f.id = v_invite.facility_id;

    if v_organization_id is not null then
      insert into public.role_memberships (user_id, organization_id, role, status)
      values (auth.uid(), v_organization_id, v_invite.role, 'active')
      on conflict (user_id, organization_id, role) do update set
        status = 'active',
        updated_at = now();

      update public.facility_user_invites
      set status = 'accepted', updated_at = now()
      where id = v_invite.id;

      insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
      values (
        auth.uid(),
        'facility_invite_claimed',
        'facility_user_invites',
        v_invite.id,
        jsonb_build_object('facility_id', v_invite.facility_id, 'email', v_email, 'role', v_invite.role)
      );

      v_claimed_count := v_claimed_count + 1;
    end if;
  end loop;

  return jsonb_build_object('claimed_count', v_claimed_count);
end;
$$;

revoke all on function public.claim_facility_invites() from public;
grant execute on function public.claim_facility_invites() to authenticated;

create or replace function public.set_facility_user_role(
  p_facility_id uuid,
  p_user_email text,
  p_role text,
  p_status text default 'active'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_email text := lower(trim(p_user_email));
  v_user_id uuid;
  v_organization_id uuid;
  v_membership_id uuid;
  v_invite_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.user_can_manage_facility(p_facility_id) then
    raise exception 'Facility Admin access required';
  end if;

  if v_user_email is null or v_user_email = '' or position('@' in v_user_email) = 0 then
    raise exception 'A valid user email is required';
  end if;

  if p_role not in ('facility_admin', 'facility_staff') then
    raise exception 'Invalid facility role';
  end if;

  if p_status not in ('invited', 'active', 'disabled') then
    raise exception 'Invalid role status';
  end if;

  select organization_id into v_organization_id
  from public.facilities
  where id = p_facility_id;

  if v_organization_id is null then
    raise exception 'Facility not found';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = v_user_email
  limit 1;

  if v_user_id is null then
    insert into public.facility_user_invites (facility_id, email, role, status, invited_by)
    values (p_facility_id, v_user_email, p_role, 'pending', auth.uid())
    on conflict (facility_id, email, role) do update set
      status = case when p_status = 'disabled' then 'disabled' else 'pending' end,
      invited_by = auth.uid(),
      updated_at = now()
    returning id into v_invite_id;

    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (
      auth.uid(),
      'facility_user_invite_set',
      'facility_user_invites',
      v_invite_id,
      jsonb_build_object('facility_id', p_facility_id, 'email', v_user_email, 'role', p_role, 'requested_status', p_status)
    );

    return jsonb_build_object(
      'mode', 'invite',
      'invite_id', v_invite_id,
      'email', v_user_email,
      'role', p_role,
      'status', 'pending'
    );
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

  update public.facility_user_invites
  set status = case when p_status = 'disabled' then 'disabled' else 'accepted' end,
      updated_at = now()
  where facility_id = p_facility_id
    and lower(email) = v_user_email
    and role = p_role;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'facility_user_role_set',
    'role_memberships',
    v_membership_id,
    jsonb_build_object('facility_id', p_facility_id, 'email', v_user_email, 'role', p_role, 'status', p_status)
  );

  return jsonb_build_object(
    'mode', 'membership',
    'membership_id', v_membership_id,
    'email', v_user_email,
    'role', p_role,
    'status', p_status
  );
end;
$$;

revoke all on function public.set_facility_user_role(uuid, text, text, text) from public;
grant execute on function public.set_facility_user_role(uuid, text, text, text) to authenticated;

create or replace function public.get_facility_admin_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_platform_admin boolean;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select public.user_has_role(array['owner', 'platform_admin']) into v_is_platform_admin;

  with accessible_facilities as (
    select f.id, f.organization_id, f.name, f.status, f.address_line_1, f.city, f.state, f.postal_code, o.slug
    from public.facilities f
    join public.organizations o on o.id = f.organization_id
    where v_is_platform_admin
       or public.user_can_access_facility(f.id, array['facility_admin'])
  ), facilities_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', af.id,
          'organization_id', af.organization_id,
          'name', af.name,
          'slug', af.slug,
          'status', af.status,
          'address_line_1', af.address_line_1,
          'city', af.city,
          'state', af.state,
          'postal_code', af.postal_code,
          'members', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'membership_id', rm.id,
                'user_id', p.id,
                'email', p.email,
                'full_name', p.full_name,
                'role', rm.role,
                'status', rm.status,
                'created_at', rm.created_at
              ) order by rm.created_at desc
            )
            from public.role_memberships rm
            join public.profiles p on p.id = rm.user_id
            where rm.organization_id = af.organization_id
              and rm.role in ('facility_admin', 'facility_staff')
          ), '[]'::jsonb),
          'invites', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'invite_id', fui.id,
                'email', fui.email,
                'role', fui.role,
                'status', fui.status,
                'created_at', fui.created_at
              ) order by fui.created_at desc
            )
            from public.facility_user_invites fui
            where fui.facility_id = af.id
          ), '[]'::jsonb)
        ) order by af.created_at desc
      ), '[]'::jsonb
    ) as data
    from accessible_facilities af
  )
  select jsonb_build_object(
    'can_manage_facilities', exists(select 1 from accessible_facilities),
    'is_platform_admin', v_is_platform_admin,
    'facilities', (select data from facilities_json)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_facility_admin_snapshot() from public;
grant execute on function public.get_facility_admin_snapshot() to authenticated;

grant select on public.facility_user_invites to authenticated;
