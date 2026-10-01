drop function if exists public.user_can_manage_facility(uuid);
drop function if exists public.current_user_id();
drop function if exists public.sync_current_pilot_profile();

revoke execute on function public.user_can_access_facility(uuid,text[]) from authenticated;
revoke execute on function public.user_can_access_partner(uuid,text[]) from authenticated;
revoke execute on function public.user_has_org_role(uuid,text[]) from authenticated;
revoke execute on function public.user_has_role(text[]) from authenticated;
revoke execute on function public.validate_churchwork_portal_invite(text) from authenticated;

alter function public.create_facility_account(text,text,text,text,text) set search_path = '';
