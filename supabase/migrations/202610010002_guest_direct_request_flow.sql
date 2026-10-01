alter table public.churchwork_pilot_requests alter column requester_user_id drop not null;
alter table public.churchwork_pilot_requests alter column requester_email drop not null;
alter table public.churchwork_pilot_requests add column if not exists guest_session_hash text;
alter table public.churchwork_pilot_requests add column if not exists location_label text;
alter table public.churchwork_pilot_requests add column if not exists location_id uuid;
alter table public.churchwork_pilot_requests add column if not exists partner_response text;
alter table public.churchwork_pilot_requests add column if not exists partner_responded_at timestamptz;

alter table public.churchwork_pilot_requests drop constraint if exists churchwork_pilot_requests_status_check;
alter table public.churchwork_pilot_requests add constraint churchwork_pilot_requests_status_check
check (status in ('facility_review','approved_for_partner','partner_outcome_logged','requester_updated','closed','submitted','accepted_by_partner','declined_by_partner','visit_planned','completed','cancelled','expired'));

alter table public.churchwork_pilot_requests add constraint churchwork_requester_identity_check
check (requester_user_id is not null or guest_session_hash is not null);
alter table public.churchwork_pilot_requests add constraint churchwork_partner_response_check
check (partner_response is null or partner_response in ('accepted','declined','visit_planned','completed'));

alter table public.churchwork_pilot_requests alter column status set default 'submitted';
alter table public.churchwork_pilot_requests alter column safe_context_note set default '';

drop policy if exists "Pilot requests visible to authorized role" on public.churchwork_pilot_requests;
create policy "Pilot requests visible to authorized role" on public.churchwork_pilot_requests for select to authenticated using (
 requester_user_id = (select auth.uid())
 or public.user_can_access_facility(facility_id,array['facility_admin','facility_staff']::text[])
 or (status in ('submitted','accepted_by_partner','visit_planned','completed') and public.user_can_access_partner(partner_id,array['partner_admin','partner_user']::text[]))
);
create table if not exists public.churchwork_request_locations (
 id uuid primary key default gen_random_uuid(), facility_id uuid not null references public.facilities(id) on delete cascade,
 label text not null check(length(trim(label)) between 1 and 80),
 public_code text not null unique default encode(gen_random_bytes(18),'hex'),
 status text not null default 'active' check(status in ('active','paused','retired')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(facility_id,label)
);
alter table public.churchwork_request_locations enable row level security;
create policy "Facility manages own request locations" on public.churchwork_request_locations for all to authenticated using (public.user_can_access_facility(facility_id,array['facility_admin','facility_staff']::text[])) with check (public.user_can_access_facility(facility_id,array['facility_admin','facility_staff']::text[]));
alter table public.churchwork_pilot_requests add constraint churchwork_request_location_fk foreign key(location_id) references public.churchwork_request_locations(id);

create index if not exists churchwork_pilot_requests_guest_session_idx
on public.churchwork_pilot_requests(guest_session_hash) where guest_session_hash is not null;

create or replace function public.list_churchwork_request_choices()
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_result jsonb;
begin
 select coalesce(jsonb_agg(jsonb_build_object(
   'facility_id',f.id,'facility_name',f.name,'city',f.city,'state',f.state,
   'partners',coalesce((select jsonb_agg(jsonb_build_object('partner_id',po.id,'partner_name',po.name) order by po.name)
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
grant execute on function public.list_churchwork_request_choices() to anon,authenticated;

create or replace function public.partner_log_churchwork_pilot_outcome(p_request_id uuid,p_outcome text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_partner_id uuid; v_status text; v_now timestamptz:=now(); v_update text;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_outcome not in ('accepted','declined','visit_planned','completed') then raise exception 'Unsupported partner response'; end if;
 select partner_id,status into v_partner_id,v_status from public.churchwork_pilot_requests where id=p_request_id for update;
 if not found then raise exception 'Request not found'; end if;
 if not public.user_can_access_partner(v_partner_id,array['partner_admin','partner_user']::text[]) then raise exception 'Partner access denied'; end if;
 if p_outcome in ('accepted','declined') and v_status<>'submitted' then raise exception 'Request is not awaiting partner response'; end if;
 if p_outcome in ('visit_planned','completed') and v_status not in ('accepted_by_partner','visit_planned') then raise exception 'Request is not accepted'; end if;
 v_update:=case p_outcome
   when 'accepted' then 'A care partner accepted your request.'
   when 'declined' then 'The selected care partner cannot fulfill this request.'
   when 'visit_planned' then 'A care partner plans to visit.'
   else 'This spiritual-care request is complete.' end;
 update public.churchwork_pilot_requests
 set status=case p_outcome when 'accepted' then 'accepted_by_partner' when 'declined' then 'declined_by_partner' when 'visit_planned' then 'visit_planned' else 'completed' end,
 partner_response=p_outcome,partner_responded_at=v_now,
 partner_assigned_at=case when p_outcome='accepted' then v_now else partner_assigned_at end,
 partner_outcome=case when p_outcome='completed' then 'visit_completed' else partner_outcome end,
 requester_update=v_update,requester_update_released_at=v_now,
 activity_log=activity_log||jsonb_build_array(jsonb_build_object('event','partner_response','actor','partner','actor_user_id',auth.uid(),'response',p_outcome,'at',v_now))
 where id=p_request_id;
 return jsonb_build_object('ok',true,'id',p_request_id,'status',(select status from public.churchwork_pilot_requests where id=p_request_id),'requester_update',v_update);
end $$;

drop function if exists public.facility_advance_churchwork_pilot_request(uuid,text);

create or replace function public.create_churchwork_guest_request(
 p_guest_session_hash text, p_facility_id uuid, p_partner_id uuid, p_location_label text, p_support_options text[]
) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_now timestamptz:=now(); v_location text:=nullif(trim(p_location_label),'');
begin
 if p_guest_session_hash is null or length(p_guest_session_hash)<32 then raise exception 'Guest session required'; end if;
 if v_location is null or length(v_location)>80 then raise exception 'Valid location required'; end if;
 if coalesce(array_length(p_support_options,1),0)=0 or exists(select 1 from unnest(p_support_options) x where x not in ('Prayer','Friendly visit','Encouragement','Pastoral call')) then raise exception 'Unsupported request option'; end if;
 if not exists(select 1 from public.facilities f join public.organizations o on o.id=f.organization_id where f.id=p_facility_id and f.status in ('pilot','active') and o.status in ('pilot','active')) then raise exception 'Facility unavailable'; end if;
 if not exists(select 1 from private.churchwork_facility_partner_routes r join public.partner_organizations p on p.id=r.partner_id join public.organizations o on o.id=p.organization_id where r.facility_id=p_facility_id and r.partner_id=p_partner_id and r.status='active' and p.status in ('pilot','active') and o.status in ('pilot','active')) then raise exception 'Partner unavailable'; end if;
 insert into public.churchwork_pilot_requests(requester_user_id,requester_email,guest_session_hash,location_label,support_options,safe_context_note,status,facility_id,partner_id,activity_log)
 values(null,null,p_guest_session_hash,v_location,p_support_options,'','submitted',p_facility_id,p_partner_id,jsonb_build_array(jsonb_build_object('event','guest_request_submitted','actor','guest','at',v_now)))
 returning id into v_id;
 return jsonb_build_object('ok',true,'id',v_id,'status','submitted');
end $$;
revoke all on function public.create_churchwork_guest_request(text,uuid,uuid,text,text[]) from public;
grant execute on function public.create_churchwork_guest_request(text,uuid,uuid,text,text[]) to anon,authenticated;

create or replace function public.list_churchwork_guest_requests(p_guest_session_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_result jsonb;
begin
 if p_guest_session_hash is null or length(p_guest_session_hash)<32 then return '[]'::jsonb; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'support',r.support_options,'status',r.status,'location_label',r.location_label,'requester_update',r.requester_update,'created_at',r.created_at,'updated_at',r.updated_at) order by r.created_at desc),'[]'::jsonb) into v_result
 from public.churchwork_pilot_requests r where r.guest_session_hash=p_guest_session_hash;
 return v_result;
end $$;
revoke all on function public.list_churchwork_guest_requests(text) from public;
grant execute on function public.list_churchwork_guest_requests(text) to anon,authenticated;

create or replace function public.resolve_churchwork_request_location(p_public_code text)
returns jsonb language sql security definer set search_path='' as $$
 select coalesce((select jsonb_build_object('location_id',l.id,'location_label',l.label,'facility_id',l.facility_id,'facility_name',f.name,'partners',coalesce((select jsonb_agg(jsonb_build_object('partner_id',p.id,'partner_name',p.name) order by p.name) from private.churchwork_facility_partner_routes r join public.partner_organizations p on p.id=r.partner_id join public.organizations o on o.id=p.organization_id where r.facility_id=l.facility_id and r.status='active' and p.status in ('pilot','active') and o.status in ('pilot','active')),'[]'::jsonb)) from public.churchwork_request_locations l join public.facilities f on f.id=l.facility_id join public.organizations fo on fo.id=f.organization_id where l.public_code=p_public_code and l.status='active' and f.status in ('pilot','active') and fo.status in ('pilot','active')),'{}'::jsonb);
$$;
revoke all on function public.resolve_churchwork_request_location(text) from public;
grant execute on function public.resolve_churchwork_request_location(text) to anon,authenticated;
