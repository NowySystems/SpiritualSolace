create or replace function public.set_pilot_user_role(
  p_user_email text,
  p_org_slug text,
  p_role text,
  p_status text default 'active'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
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
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.user_has_role(array['owner', 'platform_admin']) then
    raise exception 'Owner/admin access required';
  end if;

  select public.user_has_role(array['owner']) into v_caller_is_owner;

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

  select id, organization_type
    into v_organization_id, v_org_type
  from public.organizations
  where slug = v_org_slug
  limit 1;

  if v_organization_id is null then
    raise exception 'Organization not found';
  end if;

  if p_role in ('owner', 'platform_admin', 'requester') then
    if v_org_type <> 'platform' or v_org_slug <> 'churchwork' then
      raise exception 'Platform/requester roles must belong to ChurchWork';
    end if;
  elsif p_role in ('facility_admin', 'facility_staff') then
    if v_org_type <> 'facility' then
      raise exception 'Facility roles must belong to a facility organization';
    end if;
  elsif p_role in ('partner_admin', 'partner_user') then
    if v_org_type <> 'partner' then
      raise exception 'Partner roles must belong to a partner organization';
    end if;
  end if;

  if p_role = 'owner' then
    if not v_caller_is_owner then
      raise exception 'Owner access required to manage owner role';
    end if;

    if p_status = 'disabled' then
      select exists (
        select 1
        from public.role_memberships rm
        where rm.user_id = v_user_id
          and rm.organization_id = v_organization_id
          and rm.role = 'owner'
          and rm.status = 'active'
      ) into v_target_is_active_owner;

      if v_target_is_active_owner then
        select count(distinct rm.user_id)::integer
          into v_other_active_owners
        from public.role_memberships rm
        join public.organizations o on o.id = rm.organization_id
        where o.slug = 'churchwork'
          and rm.role = 'owner'
          and rm.status = 'active'
          and rm.user_id <> v_user_id;

        if v_other_active_owners = 0 then
          raise exception 'Cannot disable the last active ChurchWork owner';
        end if;
      end if;
    end if;
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

revoke all on function public.set_pilot_user_role(text, text, text, text) from public, anon, service_role;
grant execute on function public.set_pilot_user_role(text, text, text, text) to authenticated;
