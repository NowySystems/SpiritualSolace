-- ChurchWork Pilot Workspace Access Snapshot
-- Date: 2026-07-09
-- Purpose: return the signed-in user's active pilot roles and recommended /pilot workspace.

create or replace function public.get_pilot_workspace_access()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(nullif(coalesce(auth.jwt() ->> 'email', ''), ''));
  v_roles jsonb := '[]'::jsonb;
  v_has_owner_admin boolean := false;
  v_has_facility boolean := false;
  v_has_partner boolean := false;
  v_has_requester boolean := false;
  v_recommended_workspace text := 'overview';
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  perform public.sync_current_pilot_profile();

  select exists(
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role in ('owner', 'platform_admin')
  ) into v_has_owner_admin;

  select exists(
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role in ('facility_admin', 'facility_staff')
  ) into v_has_facility;

  select exists(
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role in ('partner_admin', 'partner_user')
  ) into v_has_partner;

  select exists(
    select 1
    from public.role_memberships rm
    where rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role = 'requester'
  ) into v_has_requester;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', rm.id,
        'role', rm.role,
        'status', rm.status,
        'organization_name', o.name,
        'organization_slug', o.slug,
        'organization_type', o.organization_type
      ) order by o.slug, rm.role
    ),
    '[]'::jsonb
  ) into v_roles
  from public.role_memberships rm
  join public.organizations o on o.id = rm.organization_id
  where rm.user_id = auth.uid()
    and rm.status = 'active';

  v_recommended_workspace := case
    when v_has_owner_admin then 'owner'
    when v_has_facility then 'facility'
    when v_has_partner then 'partner'
    when v_has_requester then 'requester'
    else 'overview'
  end;

  return jsonb_build_object(
    'current_user_email', v_email,
    'recommended_workspace', v_recommended_workspace,
    'has_owner_admin', v_has_owner_admin,
    'has_facility', v_has_facility,
    'has_partner', v_has_partner,
    'has_requester', v_has_requester,
    'roles', v_roles
  );
end;
$$;

revoke all on function public.get_pilot_workspace_access() from public;
grant execute on function public.get_pilot_workspace_access() to authenticated;
