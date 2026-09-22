-- Remove accidental Data API execution from legacy SECURITY DEFINER helpers.
-- Trigger/event-trigger functions remain attached to their database triggers but are not RPC endpoints.

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- These authorization helpers are still required by authenticated RLS evaluation.
revoke execute on function public.partner_can_access_request(uuid) from public, anon;
revoke execute on function public.user_can_access_request(uuid) from public, anon;
revoke execute on function public.user_can_manage_facility(uuid) from public, anon;
revoke execute on function public.user_has_org(uuid) from public, anon;
revoke execute on function public.user_has_role(text[]) from public, anon;

grant execute on function public.partner_can_access_request(uuid) to authenticated, service_role;
grant execute on function public.user_can_access_request(uuid) to authenticated, service_role;
grant execute on function public.user_can_manage_facility(uuid) to authenticated, service_role;
grant execute on function public.user_has_org(uuid) to authenticated, service_role;
grant execute on function public.user_has_role(text[]) to authenticated, service_role;
