create or replace function public.user_can_access_facility(target_facility_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.user_has_role(array['owner', 'platform_admin']::text[])
    or exists (
      select 1
      from public.facilities f
      where f.id = target_facility_id
        and public.user_has_org_role(f.organization_id, allowed_roles)
    );
$$;

create or replace function public.user_can_access_partner(target_partner_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.user_has_role(array['owner', 'platform_admin']::text[])
    or exists (
      select 1
      from public.partner_organizations po
      where po.id = target_partner_id
        and public.user_has_org_role(po.organization_id, allowed_roles)
    );
$$;

revoke all on function public.user_can_access_facility(uuid, text[]) from public, anon;
revoke all on function public.user_can_access_partner(uuid, text[]) from public, anon;
grant execute on function public.user_can_access_facility(uuid, text[]) to authenticated;
grant execute on function public.user_can_access_partner(uuid, text[]) to authenticated;
