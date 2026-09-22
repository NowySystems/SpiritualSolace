create or replace function public.get_churchwork_pilot_operator_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_admin boolean;
  v_summary jsonb;
  v_staffing jsonb;
  v_users jsonb;
  v_recent_requests jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select exists (
    select 1
    from public.role_memberships rm
    where rm.user_id = v_user_id
      and rm.status = 'active'
      and rm.role in ('owner', 'platform_admin')
  ) into v_is_admin;

  if not v_is_admin then
    raise exception 'Owner/admin access required';
  end if;

  select jsonb_build_object(
    'requests_total', count(*),
    'facility_review', count(*) filter (where status = 'facility_review'),
    'approved_for_partner', count(*) filter (where status = 'approved_for_partner'),
    'partner_outcome_logged', count(*) filter (where status = 'partner_outcome_logged'),
    'requester_updated', count(*) filter (where status = 'requester_updated'),
    'closed', count(*) filter (where status = 'closed')
  )
  into v_summary
  from public.churchwork_pilot_requests;

  select jsonb_build_object(
    'grandview_reviewers', (
      select count(distinct rm.user_id)
      from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'grandview-post-acute'
        and rm.status = 'active'
        and rm.role in ('facility_admin', 'facility_staff')
    ),
    'hope_partner_users', (
      select count(distinct rm.user_id)
      from public.role_memberships rm
      join public.organizations o on o.id = rm.organization_id
      where o.slug = 'hope-church'
        and rm.status = 'active'
        and rm.role in ('partner_admin', 'partner_user')
    ),
    'pending_facility_invites', (
      select count(*)
      from public.facility_user_invites fui
      join public.facilities f on f.id = fui.facility_id
      join public.organizations o on o.id = f.organization_id
      where o.slug = 'grandview-post-acute'
        and fui.status = 'pending'
    )
  ) into v_staffing;

  select coalesce(jsonb_agg(to_jsonb(user_row)), '[]'::jsonb)
  into v_users
  from (
    select
      p.id,
      p.email,
      p.full_name,
      p.status,
      p.created_at,
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'role', rm.role,
            'status', rm.status,
            'organization_name', o.name,
            'organization_slug', o.slug
          )
          order by o.name, rm.role
        )
        from public.role_memberships rm
        join public.organizations o on o.id = rm.organization_id
        where rm.user_id = p.id
      ), '[]'::jsonb) as roles
    from public.profiles p
    order by p.created_at desc
    limit 100
  ) user_row;

  select coalesce(jsonb_agg(to_jsonb(request_row)), '[]'::jsonb)
  into v_recent_requests
  from (
    select
      r.id,
      r.requester_email,
      r.support_options,
      r.status,
      r.partner_outcome,
      r.requester_update,
      r.created_at,
      r.updated_at
    from public.churchwork_pilot_requests r
    order by r.created_at desc
    limit 25
  ) request_row;

  return jsonb_build_object(
    'is_admin', true,
    'current_user_id', v_user_id,
    'summary', coalesce(v_summary, '{}'::jsonb),
    'staffing', coalesce(v_staffing, '{}'::jsonb),
    'users', coalesce(v_users, '[]'::jsonb),
    'recent_requests', coalesce(v_recent_requests, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_churchwork_pilot_operator_snapshot() from public, anon;
grant execute on function public.get_churchwork_pilot_operator_snapshot() to authenticated;
