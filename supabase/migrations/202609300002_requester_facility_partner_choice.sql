-- Requesters explicitly choose an active facility and a partner volunteering for it.
create or replace function public.list_churchwork_request_choices()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_result jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'facility_id', f.id, 'facility_name', f.name, 'city', f.city, 'state', f.state,
    'partners', coalesce((select jsonb_agg(jsonb_build_object('partner_id',po.id,'partner_name',po.name) order by po.name)
      from private.churchwork_facility_partner_routes r
      join public.partner_organizations po on po.id=r.partner_id
      join public.organizations p_org on p_org.id=po.organization_id
      where r.facility_id=f.id and r.status='active' and po.status in ('pilot','active') and p_org.status in ('pilot','active')),'[]'::jsonb)
  ) order by f.name),'[]'::jsonb) into v_result
  from public.facilities f join public.organizations o on o.id=f.organization_id
  where f.status in ('pilot','active') and o.status in ('pilot','active')
    and exists(select 1 from private.churchwork_facility_partner_routes r where r.facility_id=f.id and r.status='active');
  return v_result;
end $$;
revoke all on function public.list_churchwork_request_choices() from public,anon;
grant execute on function public.list_churchwork_request_choices() to authenticated;

create or replace function public.set_churchwork_pilot_request_routing()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_partner uuid;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if new.requester_user_id<>auth.uid() then raise exception 'Requester identity mismatch'; end if;
 if new.facility_id is null then raise exception 'Choose your facility'; end if;
 if new.partner_id is null then raise exception 'Choose a care partner'; end if;
 select r.partner_id into v_partner
 from private.churchwork_facility_partner_routes r
 join public.facilities f on f.id=r.facility_id
 join public.organizations fo on fo.id=f.organization_id
 join public.partner_organizations po on po.id=r.partner_id
 join public.organizations p_org on p_org.id=po.organization_id
 where r.facility_id=new.facility_id and r.partner_id=new.partner_id and r.status='active'
   and f.status in ('pilot','active') and fo.status in ('pilot','active')
   and po.status in ('pilot','active') and p_org.status in ('pilot','active');
 if v_partner is null then raise exception 'That care partner is not currently available for this facility'; end if;
 return new;
end $$;
