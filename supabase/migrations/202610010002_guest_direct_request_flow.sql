alter table public.churchwork_pilot_requests alter column requester_user_id drop not null;
alter table public.churchwork_pilot_requests add column if not exists guest_session_hash text;
alter table public.churchwork_pilot_requests add column if not exists location_label text;
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
