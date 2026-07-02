-- Replaces the facility admin snapshot RPC with created_at included in the facility CTE.

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
  select public.user_has_role(array['owner', 'platform_admin']) into v_is_platform_admin;

  with accessible_facilities as (
    select f.id, f.organization_id, f.name, f.status, f.address_line_1, f.city, f.state, f.postal_code, f.created_at, o.slug
    from public.facilities f
    join public.organizations o on o.id = f.organization_id
    where v_is_platform_admin
       or public.user_can_access_facility(f.id, array['facility_admin'])
  ), facilities_json as (
    select coalesce(jsonb_agg(jsonb_build_object(
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
        select jsonb_agg(jsonb_build_object(
          'membership_id', rm.id,
          'user_id', p.id,
          'email', p.email,
          'full_name', p.full_name,
          'role', rm.role,
          'status', rm.status,
          'created_at', rm.created_at
        ) order by rm.created_at desc)
        from public.role_memberships rm
        join public.profiles p on p.id = rm.user_id
        where rm.organization_id = af.organization_id
          and rm.role in ('facility_admin', 'facility_staff')
      ), '[]'::jsonb),
      'invites', coalesce((
        select jsonb_agg(jsonb_build_object(
          'invite_id', fui.id,
          'email', fui.email,
          'role', fui.role,
          'status', fui.status,
          'created_at', fui.created_at
        ) order by fui.created_at desc)
        from public.facility_user_invites fui
        where fui.facility_id = af.id
      ), '[]'::jsonb)
    ) order by af.created_at desc), '[]'::jsonb) as data
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
