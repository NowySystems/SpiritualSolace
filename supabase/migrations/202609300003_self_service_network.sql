-- Self-service network onboarding, partner coverage, and owner network oversight.
alter table private.churchwork_facility_partner_routes drop constraint churchwork_facility_partner_routes_pkey;
alter table private.churchwork_facility_partner_routes add primary key (facility_id, partner_id);

create or replace function public.create_partner_account(p_partner_name text)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_org uuid; v_partner uuid; v_membership uuid; v_slug text; v_base text; v_n int:=1; v_email text;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if nullif(trim(p_partner_name),'') is null then raise exception 'Partner name is required'; end if;
 select lower(email) into v_email from auth.users where id=auth.uid();
 v_base:=trim(both '-' from lower(regexp_replace(trim(p_partner_name),'[^a-zA-Z0-9]+','-','g'))); if v_base='' then raise exception 'Partner name must include letters or numbers'; end if;
 v_slug:=v_base; while exists(select 1 from public.organizations where slug=v_slug) loop v_n:=v_n+1; v_slug:=v_base||'-'||v_n; end loop;
 insert into public.profiles(id,email,status) values(auth.uid(),v_email,'active') on conflict(id) do update set email=excluded.email,status='active',updated_at=now();
 insert into public.organizations(name,slug,organization_type,status) values(trim(p_partner_name),v_slug,'partner','active') returning id into v_org;
 insert into public.partner_organizations(organization_id,name,partner_type,status) values(v_org,trim(p_partner_name),'church','active') returning id into v_partner;
 insert into public.role_memberships(user_id,organization_id,role,status) values(auth.uid(),v_org,'partner_admin','active') returning id into v_membership;
 insert into public.audit_logs(actor_user_id,action,target_table,target_id,metadata) values(auth.uid(),'partner_account_created','partner_organizations',v_partner,jsonb_build_object('organization_id',v_org,'name',trim(p_partner_name)));
 return jsonb_build_object('organization_id',v_org,'partner_id',v_partner,'membership_id',v_membership,'organization_slug',v_slug,'partner_name',trim(p_partner_name),'role','partner_admin','status','active');
end $$;
revoke all on function public.create_partner_account(text) from public,anon; grant execute on function public.create_partner_account(text) to authenticated;

create or replace function public.list_partner_coverage_options()
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare v_partner uuid; v_result jsonb;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select po.id into v_partner from public.partner_organizations po join public.role_memberships rm on rm.organization_id=po.organization_id where rm.user_id=auth.uid() and rm.role in ('partner_admin','partner_user') and rm.status='active' and po.status in ('active','pilot') limit 1;
 if v_partner is null then raise exception 'Active partner membership required'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('facility_id',f.id,'facility_name',f.name,'city',f.city,'state',f.state,'coverage_status',r.status) order by f.name),'[]'::jsonb) into v_result
 from public.facilities f join public.organizations o on o.id=f.organization_id left join private.churchwork_facility_partner_routes r on r.facility_id=f.id and r.partner_id=v_partner
 where f.status in ('active','pilot') and o.status in ('active','pilot');
 return v_result;
end $$;
revoke all on function public.list_partner_coverage_options() from public,anon; grant execute on function public.list_partner_coverage_options() to authenticated;

create or replace function public.set_partner_facility_coverage(p_facility_id uuid,p_active boolean)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_partner uuid; v_status text;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select po.id into v_partner from public.partner_organizations po join public.role_memberships rm on rm.organization_id=po.organization_id where rm.user_id=auth.uid() and rm.role='partner_admin' and rm.status='active' and po.status in ('active','pilot') limit 1;
 if v_partner is null then raise exception 'Partner admin access required'; end if;
 if not exists(select 1 from public.facilities f join public.organizations o on o.id=f.organization_id where f.id=p_facility_id and f.status in ('active','pilot') and o.status in ('active','pilot')) then raise exception 'Facility unavailable'; end if;
 v_status:=case when p_active then 'active' else 'paused' end;
 insert into private.churchwork_facility_partner_routes(facility_id,partner_id,status,created_by,updated_at) values(p_facility_id,v_partner,v_status,auth.uid(),now())
 on conflict(facility_id,partner_id) do update set status=excluded.status,updated_at=now();
 insert into public.audit_logs(actor_user_id,action,target_table,target_id,metadata) values(auth.uid(),case when p_active then 'partner_coverage_enabled' else 'partner_coverage_paused' end,'facilities',p_facility_id,jsonb_build_object('partner_id',v_partner));
 return jsonb_build_object('ok',true,'facility_id',p_facility_id,'partner_id',v_partner,'status',v_status);
end $$;
revoke all on function public.set_partner_facility_coverage(uuid,boolean) from public,anon; grant execute on function public.set_partner_facility_coverage(uuid,boolean) to authenticated;

create or replace function public.get_churchwork_network_snapshot()
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare v_facilities jsonb; v_partners jsonb; v_events jsonb;
begin
 if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
 select coalesce(jsonb_agg(x order by x->>'name'),'[]'::jsonb) into v_facilities from (select jsonb_build_object('id',f.id,'organization_id',o.id,'name',f.name,'city',f.city,'state',f.state,'status',f.status,'organization_status',o.status,'created_at',f.created_at,'users',(select count(*) from public.role_memberships rm where rm.organization_id=o.id and rm.status='active'),'partners',(select count(*) from private.churchwork_facility_partner_routes r where r.facility_id=f.id and r.status='active')) x from public.facilities f join public.organizations o on o.id=f.organization_id) s;
 select coalesce(jsonb_agg(x order by x->>'name'),'[]'::jsonb) into v_partners from (select jsonb_build_object('id',po.id,'organization_id',o.id,'name',po.name,'status',po.status,'organization_status',o.status,'created_at',po.created_at,'users',(select count(*) from public.role_memberships rm where rm.organization_id=o.id and rm.status='active'),'facilities',(select count(*) from private.churchwork_facility_partner_routes r where r.partner_id=po.id and r.status='active')) x from public.partner_organizations po join public.organizations o on o.id=po.organization_id) s;
 select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'action',a.action,'target_table',a.target_table,'target_id',a.target_id,'metadata',a.metadata,'created_at',a.created_at) order by a.created_at desc),'[]'::jsonb) into v_events from (select * from public.audit_logs where action in ('facility_account_created','partner_account_created','partner_coverage_enabled','partner_coverage_paused','organization_status_changed') order by created_at desc limit 50) a;
 return jsonb_build_object('facilities',v_facilities,'partners',v_partners,'events',v_events);
end $$;
revoke all on function public.get_churchwork_network_snapshot() from public,anon; grant execute on function public.get_churchwork_network_snapshot() to authenticated;

create or replace function public.set_churchwork_organization_status(p_organization_id uuid,p_status text)
returns jsonb language plpgsql security definer set search_path=''
as $$
begin
 if auth.uid() is null or not public.user_has_role(array['owner','platform_admin']::text[]) then raise exception 'Owner/admin access required'; end if;
 if p_status not in ('active','paused','disabled') then raise exception 'Unsupported status'; end if;
 if not exists(select 1 from public.organizations where id=p_organization_id and organization_type in ('facility','partner')) then raise exception 'Organization not found'; end if;
 update public.organizations set status=p_status,updated_at=now() where id=p_organization_id;
 update public.facilities set status=p_status,updated_at=now() where organization_id=p_organization_id;
 update public.partner_organizations set status=p_status,updated_at=now() where organization_id=p_organization_id;
 if p_status<>'active' then
   update private.churchwork_facility_partner_routes set status='paused',updated_at=now() where facility_id in(select id from public.facilities where organization_id=p_organization_id) or partner_id in(select id from public.partner_organizations where organization_id=p_organization_id);
 end if;
 insert into public.audit_logs(actor_user_id,action,target_table,target_id,metadata) values(auth.uid(),'organization_status_changed','organizations',p_organization_id,jsonb_build_object('status',p_status));
 return jsonb_build_object('ok',true,'organization_id',p_organization_id,'status',p_status);
end $$;
revoke all on function public.set_churchwork_organization_status(uuid,text) from public,anon; grant execute on function public.set_churchwork_organization_status(uuid,text) to authenticated;
