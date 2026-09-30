drop function if exists public.approve_churchwork_access_application(uuid, boolean, uuid);
drop function if exists public.reject_churchwork_access_application(uuid, text);
drop function if exists public.list_churchwork_access_applications();
drop function if exists public.get_my_churchwork_access_application(text);
drop function if exists public.submit_churchwork_access_application(text,text,text,text,uuid,text,text,text,text,text,text,text);
drop table if exists private.churchwork_access_applications;
drop function if exists public.claim_facility_invites();
drop function if exists public.get_facility_admin_snapshot();
drop function if exists public.set_facility_user_role(uuid,text,text,text);
drop table if exists public.facility_user_invites;
drop function if exists public.get_owner_admin_snapshot();
drop function if exists public.get_churchwork_pilot_operator_snapshot();
drop function if exists public.get_churchwork_pilot_request_ownership(uuid[]);
drop function if exists public.set_churchwork_pilot_request_owner(uuid,text,boolean);
create or replace function public.facility_advance_churchwork_pilot_request(p_request_id uuid, p_action text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare v_facility_id uuid; v_status text; v_partner_outcome text; v_now timestamptz := now(); v_update text;
begin
if auth.uid() is null then raise exception 'Authentication required'; end if;
select r.facility_id,r.status,r.partner_outcome into v_facility_id,v_status,v_partner_outcome from public.churchwork_pilot_requests r where r.id=p_request_id for update;
if not found then raise exception 'Pilot request not found'; end if;
if not public.user_can_access_facility(v_facility_id,array['facility_admin','facility_staff']::text[]) then raise exception 'Facility access denied'; end if;
if p_action='approve' then
 if v_status<>'facility_review' then raise exception 'Request is not awaiting facility review'; end if;
 update public.churchwork_pilot_requests set status='approved_for_partner',facility_approved_at=v_now,partner_assigned_at=v_now,activity_log=activity_log||jsonb_build_array(jsonb_build_object('event','facility_approved','actor','facility','actor_user_id',auth.uid(),'at',v_now)) where id=p_request_id;
 return jsonb_build_object('ok',true,'id',p_request_id,'status','approved_for_partner');
end if;
if p_action='release_update' then
 if v_status<>'partner_outcome_logged' or v_partner_outcome is null then raise exception 'Partner outcome is not ready for requester release'; end if;
 v_update:=case v_partner_outcome when 'prayer_logged' then 'A care partner has logged prayer for this request.' when 'visit_planned' then 'A care partner has planned a spiritual-care visit.' when 'visit_completed' then 'A care partner has completed a spiritual-care visit.' when 'follow_up_requested' then 'A care partner has requested spiritual-care follow-up.' else 'A care partner has provided a spiritual-care update.' end;
 update public.churchwork_pilot_requests set status='requester_updated',requester_update=v_update,requester_update_released_at=v_now,activity_log=activity_log||jsonb_build_array(jsonb_build_object('event','requester_update_released','actor','facility','actor_user_id',auth.uid(),'at',v_now)) where id=p_request_id;
 return jsonb_build_object('ok',true,'id',p_request_id,'status','requester_updated');
end if;
raise exception 'Unsupported facility action';
end $$;
create or replace function public.partner_log_churchwork_pilot_outcome(p_request_id uuid,p_outcome text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare v_partner_id uuid; v_status text; v_now timestamptz:=now();
begin
if auth.uid() is null then raise exception 'Authentication required'; end if;
if p_outcome not in ('prayer_logged','visit_planned','visit_completed','follow_up_requested') then raise exception 'Unsupported partner outcome'; end if;
select r.partner_id,r.status into v_partner_id,v_status from public.churchwork_pilot_requests r where r.id=p_request_id for update;
if not found then raise exception 'Pilot request not found'; end if;
if not public.user_can_access_partner(v_partner_id,array['partner_admin','partner_user']::text[]) then raise exception 'Partner access denied'; end if;
if v_status<>'approved_for_partner' then raise exception 'Request is not ready for a partner outcome'; end if;
update public.churchwork_pilot_requests set status='partner_outcome_logged',partner_outcome=p_outcome,activity_log=activity_log||jsonb_build_array(jsonb_build_object('event','partner_outcome_logged','actor','partner','actor_user_id',auth.uid(),'outcome',p_outcome,'at',v_now)) where id=p_request_id;
return jsonb_build_object('ok',true,'id',p_request_id,'status','partner_outcome_logged');
end $$;
drop table if exists private.churchwork_pilot_request_ownership;
